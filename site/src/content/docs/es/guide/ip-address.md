---
title: Dirección IP
description: Obtén de forma segura la dirección IP real del cliente detrás de proxies.
sidebar:
  order: 14
---

La dirección IP cumple un papel fundamental en HTTP: se usa para control de acceso,
auditoría, análisis geográfico y más. Echo expone `Context#RealIP()` para obtenerla.

Obtener la IP _real_ del cliente no es trivial, especialmente cuando hay proxies L7 delante
de tu aplicación. En ese caso, la IP real debe transmitirse por HTTP desde los proxies hacia
tu app, pero no debes confiar incondicionalmente en headers HTTP, o corres el riesgo de ser
engañado. **Esto es un riesgo de seguridad.**

Para obtener la IP de forma fiable y segura, tu aplicación debe conocer toda su infraestructura.
En Echo, esto se configura mediante `Echo#IPExtractor`.

:::caution
Si no estableces `Echo#IPExtractor` explícitamente, Echo vuelve al comportamiento legacy,
que no es un valor por defecto seguro.
:::

Empieza con dos preguntas para encontrar el enfoque correcto:

1. ¿Pones algún proxy HTTP (L7) delante de la aplicación? Esto incluye load balancers cloud
   (como AWS ALB o GCP HTTP LB) y proxies open-source (como Nginx, Envoy o un Istio ingress gateway).
2. Si es así, ¿qué header HTTP usan tus proxies para pasar la IP del cliente a la
   aplicación?

## Caso 1: Sin proxy

Si no hay proxy (la app mira directamente a internet), la única dirección en la que puedes
confiar es la de la capa de red. Todos los headers HTTP son no confiables porque los clientes
tienen control total sobre ellos.

Usa `echo.ExtractIPDirect()`:

```go
e.IPExtractor = echo.ExtractIPDirect()
```

## Caso 2: Proxies que usan el header X-Forwarded-For

[`X-Forwarded-For` (XFF)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)
es el header más común para retransmitir IPs de cliente. En cada salto, el proxy agrega la
IP del request al final del header.

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

En este caso, toma la **primera lectura de IP no confiable desde la derecha**. Nunca tomes
la primera desde la izquierda, ya que el cliente la controla. Aquí "confiable" significa que
estás seguro de que la IP pertenece a tu infraestructura. En el ejemplo anterior, si `b` y
`c` son confiables, la IP del cliente es `a` en ambos casos, nunca `x`.

Usa `ExtractIPFromXFFHeader(...TrustOption)`:

```go
e.IPExtractor = echo.ExtractIPFromXFFHeader()
```

Por defecto confía en direcciones IP internas: loopback, link-local unicast,
private-use y direcciones locales únicas de
[RFC 6890](https://datatracker.ietf.org/doc/html/rfc6890),
[RFC 4291](https://datatracker.ietf.org/doc/html/rfc4291) y
[RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193). Contrólalo con `TrustOption`s:

```go
e.IPExtractor = echo.ExtractIPFromXFFHeader(
	echo.TrustLoopback(false),   // e.g. IPv4 starting with 127.
	echo.TrustLinkLocal(false),  // e.g. IPv4 starting with 169.254.
	echo.TrustPrivateNet(false), // e.g. IPv4 starting with 10. or 192.168.
	echo.TrustIPRange(lbIPRange),
)
```

## Caso 3: Proxies que usan el header X-Real-IP

`X-Real-IP` es otro header para retransmitir la IP del cliente, pero a diferencia de XFF
contiene solo una dirección.

Si tus proxies establecen este header, usa `ExtractIPFromRealIPHeader(...TrustOption)`:

```go
e.IPExtractor = echo.ExtractIPFromRealIPHeader()
```

Al igual que con XFF, confía en direcciones IP internas por defecto y acepta los mismos
`TrustOption`s.

:::danger
**Nunca olvides** configurar el proxy más externo (en el edge de tu infraestructura) para que
**no deje pasar headers entrantes**. De lo contrario, un cliente puede falsificarlos y abrir
la puerta al fraude.
:::

## Comportamiento por defecto

Por defecto, Echo considera al mismo tiempo el primer header XFF, el header X-Real-IP y la IP
de la capa de red.

Como este artículo debería dejar claro, esa no es una buena elección. Sigue siendo el valor
por defecto solo por compatibilidad hacia atrás.
