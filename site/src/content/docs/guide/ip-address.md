---
title: IP Address
description: Retrieve the real client IP address securely behind proxies.
sidebar:
  order: 14
---

The IP address plays a fundamental role in HTTP — it is used for access control,
auditing, geo-based analysis, and more. Echo exposes `Context#RealIP()` to retrieve
it.

Retrieving the _real_ client IP is not trivial, especially when L7 proxies sit in
front of your application. In that case the real IP must be relayed over HTTP from
the proxies to your app — but you must not trust HTTP headers unconditionally, or you
risk being deceived. **This is a security risk.**

To retrieve the IP reliably and securely, your application must be aware of your
entire infrastructure. In Echo, you configure this through `Echo#IPExtractor`.

:::caution
If you do not set `Echo#IPExtractor` explicitly, Echo falls back to legacy behavior,
which is not a secure default.
:::

Start with two questions to find the right approach:

1. Do you put any HTTP (L7) proxy in front of the application? This includes cloud
   load balancers (such as AWS ALB or GCP HTTP LB) and open-source proxies (such as
   Nginx, Envoy, or an Istio ingress gateway).
2. If so, which HTTP header do your proxies use to pass the client IP to the
   application?

## Case 1: No proxy

If there is no proxy (the app faces the internet directly), the only address you can
trust is the one from the network layer. Every HTTP header is untrustworthy because
clients have full control over them.

Use `echo.ExtractIPDirect()`:

```go
e.IPExtractor = echo.ExtractIPDirect()
```

## Case 2: Proxies using the X-Forwarded-For header

[`X-Forwarded-For` (XFF)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)
is the most common header for relaying client IPs. At each hop, the proxy appends the
request IP to the end of the header.

```text
            ┌──────────┐            ┌──────────┐            ┌──────────┐
───────────>│ Proxy 1  │───────────>│ Proxy 2  │───────────>│ Your app │
            │ (IP: b)  │            │ (IP: c)  │            │          │
            └──────────┘            └──────────┘            └──────────┘

Case 1.
XFF:  ""                    "a"                     "a, b"
                                                    ~~~~~~
Case 2.
XFF:  "x"                   "x, a"                  "x, a, b"
                                                    ~~~~~~~~~
                                                    ↑ What your app will see
```

In this case, take the **first untrustworthy IP reading from the right**. Never take
the first one from the left, since the client controls it. Here "trustworthy" means
you are sure the IP belongs to your infrastructure. In the example above, if `b` and
`c` are trustworthy, the client IP is `a` in both cases — never `x`.

Use `ExtractIPFromXFFHeader(...TrustOption)`:

```go
e.IPExtractor = echo.ExtractIPFromXFFHeader()
```

By default it trusts internal IP addresses — loopback, link-local unicast,
private-use, and unique local addresses from
[RFC 6890](https://datatracker.ietf.org/doc/html/rfc6890),
[RFC 4291](https://datatracker.ietf.org/doc/html/rfc4291), and
[RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193). Control this with `TrustOption`s:

```go
e.IPExtractor = echo.ExtractIPFromXFFHeader(
	echo.TrustLoopback(false),   // e.g. IPv4 starting with 127.
	echo.TrustLinkLocal(false),  // e.g. IPv4 starting with 169.254.
	echo.TrustPrivateNet(false), // e.g. IPv4 starting with 10. or 192.168.
	echo.TrustIPRange(lbIPRange),
)
```

## Case 3: Proxies using the X-Real-IP header

`X-Real-IP` is another header for relaying the client IP, but unlike XFF it carries
only a single address.

If your proxies set this header, use `ExtractIPFromRealIPHeader(...TrustOption)`:

```go
e.IPExtractor = echo.ExtractIPFromRealIPHeader()
```

As with XFF, it trusts internal IP addresses by default and accepts the same
`TrustOption`s.

:::danger
**Never forget** to configure the outermost proxy (at the edge of your
infrastructure) **not to pass through incoming headers**. Otherwise a client can
forge them, opening the door to fraud.
:::

## Default behavior

By default, Echo considers the first XFF header, the X-Real-IP header, and the IP
from the network layer all at once.

As this article should make clear, that is not a good choice. It remains the default
only for backward compatibility.
