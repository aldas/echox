"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1283],{7796:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>o,toc:()=>i});const o=JSON.parse('{"id":"cookbook/reverse-proxy","title":"Reverse Proxy","description":"Reverse proxy recipe","source":"@site/docs/cookbook/reverse-proxy.md","sourceDirName":"cookbook","slug":"/cookbook/reverse-proxy","permalink":"/docs/cookbook/reverse-proxy","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/cookbook/reverse-proxy.md","tags":[],"version":"current","frontMatter":{"description":"Reverse proxy recipe"},"sidebar":"docsSidebar","previous":{"title":"Middleware","permalink":"/docs/cookbook/middleware"},"next":{"title":"Server-Sent-Events (SSE)","permalink":"/docs/cookbook/sse"}}');var t=s(4848),n=s(8453);const a={description:"Reverse proxy recipe"},l="Reverse Proxy",c={},i=[{value:"1) Identify upstream target URL(s)",id:"1-identify-upstream-target-urls",level:2},{value:"2) Setup proxy middleware with upstream targets",id:"2-setup-proxy-middleware-with-upstream-targets",level:2},{value:"3) Start upstream servers",id:"3-start-upstream-servers",level:2},{value:"4) Start the proxy server",id:"4-start-the-proxy-server",level:2},{value:"Source Code",id:"source-code",level:2}];function d(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.header,{children:(0,t.jsx)(r.h1,{id:"reverse-proxy",children:"Reverse Proxy"})}),"\n",(0,t.jsx)(r.p,{children:"This recipe demonstrates how you can use Echo as a reverse proxy server and load balancer in front of your favorite applications like WordPress, Node.js, Java, Python, Ruby or even Go. For simplicity, I will use Go upstream servers with WebSocket."}),"\n",(0,t.jsx)(r.h2,{id:"1-identify-upstream-target-urls",children:"1) Identify upstream target URL(s)"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-go",children:'url1, err := url.Parse("http://localhost:8081")\nif err != nil {\n  e.Logger.Fatal(err)\n}\nurl2, err := url.Parse("http://localhost:8082")\nif err != nil {\n  e.Logger.Fatal(err)\n}\ntargets := []*middleware.ProxyTarget{\n  {\n    URL: url1,\n  },\n  {\n    URL: url2,\n  },\n}\n'})}),"\n",(0,t.jsx)(r.h2,{id:"2-setup-proxy-middleware-with-upstream-targets",children:"2) Setup proxy middleware with upstream targets"}),"\n",(0,t.jsxs)(r.p,{children:["In the following code snippet we are using round-robin load balancing technique. You may also use ",(0,t.jsx)(r.code,{children:"middleware.NewRandomBalancer()"}),"."]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-go",children:"e.Use(middleware.Proxy(middleware.NewRoundRobinBalancer(targets)))\n"})}),"\n",(0,t.jsxs)(r.p,{children:["To setup proxy for a sub-route use ",(0,t.jsx)(r.code,{children:"Echo#Group()"}),"."]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-go",children:'g := e.Group("/blog")\ng.Use(middleware.Proxy(...))\n'})}),"\n",(0,t.jsx)(r.h2,{id:"3-start-upstream-servers",children:"3) Start upstream servers"}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsx)(r.li,{children:(0,t.jsx)(r.code,{children:"cd upstream"})}),"\n",(0,t.jsx)(r.li,{children:(0,t.jsx)(r.code,{children:"go run server.go server1 :8081"})}),"\n",(0,t.jsx)(r.li,{children:(0,t.jsx)(r.code,{children:"go run server.go server2 :8082"})}),"\n"]}),"\n",(0,t.jsx)(r.h2,{id:"4-start-the-proxy-server",children:"4) Start the proxy server"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-sh",children:"go run server.go\n"})}),"\n",(0,t.jsxs)(r.p,{children:["Browse to ",(0,t.jsx)(r.a,{href:"http://localhost:1323",children:"http://localhost:1323"}),', and you should see a webpage with an HTTP request being served from "server 1" and a WebSocket request being served from "server 2."']}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-sh",children:"HTTP\n\nHello from upstream server server1\n\nWebSocket\n\nHello from upstream server server2!\nHello from upstream server server2!\nHello from upstream server server2!\n"})}),"\n",(0,t.jsx)(r.h2,{id:"source-code",children:"Source Code"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-go",metastring:"reference",children:"https://github.com/labstack/echox/blob/master/cookbook/reverse-proxy/upstream/server.go\n"})}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-go",metastring:"reference",children:"https://github.com/labstack/echox/blob/master/cookbook/reverse-proxy/server.go\n"})})]})}function u(e={}){const{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,r,s)=>{s.d(r,{R:()=>a,x:()=>l});var o=s(6540);const t={},n=o.createContext(t);function a(e){const r=o.useContext(n);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function l(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),o.createElement(n.Provider,{value:r},e.children)}}}]);