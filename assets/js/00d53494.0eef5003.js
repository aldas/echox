"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9128],{6664:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>r,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"middleware/secure","title":"Secure","description":"Secure middleware","source":"@site/docs/middleware/secure.md","sourceDirName":"middleware","slug":"/middleware/secure","permalink":"/docs/middleware/secure","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/middleware/secure.md","tags":[],"version":"current","frontMatter":{"description":"Secure middleware"},"sidebar":"docsSidebar","previous":{"title":"Rewrite","permalink":"/docs/middleware/rewrite"},"next":{"title":"Session","permalink":"/docs/middleware/session"}}');var o=t(4848),s=t(8453);const r={description:"Secure middleware"},a="Secure",c={},d=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3}];function l(e){const n={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"secure",children:"Secure"})}),"\n",(0,o.jsx)(n.p,{children:"Secure middleware provides protection against cross-site scripting (XSS) attack,\ncontent type sniffing, clickjacking, insecure connection and other code injection\nattacks."}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"e.Use(middleware.Secure())\n"})}),"\n",(0,o.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,o.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'e := echo.New()\ne.Use(middleware.SecureWithConfig(middleware.SecureConfig{\n\tXSSProtection:         "",\n\tContentTypeNosniff:    "",\n\tXFrameOptions:         "",\n\tHSTSMaxAge:            3600,\n\tContentSecurityPolicy: "default-src \'self\'",\n}))\n'})}),"\n",(0,o.jsx)(n.admonition,{type:"info",children:(0,o.jsxs)(n.p,{children:["Passing empty ",(0,o.jsx)(n.code,{children:"XSSProtection"}),", ",(0,o.jsx)(n.code,{children:"ContentTypeNosniff"}),", ",(0,o.jsx)(n.code,{children:"XFrameOptions"})," or ",(0,o.jsx)(n.code,{children:"ContentSecurityPolicy"}),"\ndisables that protection."]})}),"\n",(0,o.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'SecureConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper Skipper\n\n  // XSSProtection provides protection against cross-site scripting attack (XSS)\n  // by setting the `X-XSS-Protection` header.\n  // Optional. Default value "1; mode=block".\n  XSSProtection string `json:"xss_protection"`\n\n  // ContentTypeNosniff provides protection against overriding Content-Type\n  // header by setting the `X-Content-Type-Options` header.\n  // Optional. Default value "nosniff".\n  ContentTypeNosniff string `json:"content_type_nosniff"`\n\n  // XFrameOptions can be used to indicate whether or not a browser should\n  // be allowed to render a page in a <frame>, <iframe> or <object> .\n  // Sites can use this to avoid clickjacking attacks, by ensuring that their\n  // content is not embedded into other sites.provides protection against\n  // clickjacking.\n  // Optional. Default value "SAMEORIGIN".\n  // Possible values:\n  // - "SAMEORIGIN" - The page can only be displayed in a frame on the same origin as the page itself.\n  // - "DENY" - The page cannot be displayed in a frame, regardless of the site attempting to do so.\n  // - "ALLOW-FROM uri" - The page can only be displayed in a frame on the specified origin.\n  XFrameOptions string `json:"x_frame_options"`\n\n  // HSTSMaxAge sets the `Strict-Transport-Security` header to indicate how\n  // long (in seconds) browsers should remember that this site is only to\n  // be accessed using HTTPS. This reduces your exposure to some SSL-stripping\n  // man-in-the-middle (MITM) attacks.\n  // Optional. Default value 0.\n  HSTSMaxAge int `json:"hsts_max_age"`\n\n  // HSTSExcludeSubdomains won\'t include subdomains tag in the `Strict Transport Security`\n  // header, excluding all subdomains from security policy. It has no effect\n  // unless HSTSMaxAge is set to a non-zero value.\n  // Optional. Default value false.\n  HSTSExcludeSubdomains bool `json:"hsts_exclude_subdomains"`\n\n  // ContentSecurityPolicy sets the `Content-Security-Policy` header providing\n  // security against cross-site scripting (XSS), clickjacking and other code\n  // injection attacks resulting from execution of malicious content in the\n  // trusted web page context.\n  // Optional. Default value "".\n  ContentSecurityPolicy string `json:"content_security_policy"`\n}\n'})}),"\n",(0,o.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'DefaultSecureConfig = SecureConfig{\n  Skipper:            DefaultSkipper,\n  XSSProtection:      "1; mode=block",\n  ContentTypeNosniff: "nosniff",\n  XFrameOptions:      "SAMEORIGIN",\n}\n'})})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>a});var i=t(6540);const o={},s=i.createContext(o);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);