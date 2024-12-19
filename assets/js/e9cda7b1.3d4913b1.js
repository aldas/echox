"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5191],{3057:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>d,default:()=>u,frontMatter:()=>a,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"middleware/request-id","title":"Request ID","description":"Request ID middleware","source":"@site/docs/middleware/request-id.md","sourceDirName":"middleware","slug":"/middleware/request-id","permalink":"/docs/middleware/request-id","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/middleware/request-id.md","tags":[],"version":"current","frontMatter":{"description":"Request ID middleware"},"sidebar":"docsSidebar","previous":{"title":"Redirect","permalink":"/docs/middleware/redirect"},"next":{"title":"Rewrite","permalink":"/docs/middleware/rewrite"}}');var i=t(4848),s=t(8453);const a={description:"Request ID middleware"},d="Request ID",o={},l=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3},{value:"Set ID",id:"set-id",level:2},{value:"Request",id:"request",level:3},{value:"Log",id:"log",level:3}];function c(e){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"request-id",children:"Request ID"})}),"\n",(0,i.jsx)(n.p,{children:"Request ID middleware generates a unique id for a request."}),"\n",(0,i.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:"e.Use(middleware.RequestID())\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'    e := echo.New()\n\n    e.Use(middleware.RequestID())\n\n    e.GET("/", func(c echo.Context) error {\n        return c.String(http.StatusOK, c.Response().Header().Get(echo.HeaderXRequestID))\n    })\n    e.Logger.Fatal(e.Start(":1323"))\n'})}),"\n",(0,i.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,i.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:"e.Use(middleware.RequestIDWithConfig(middleware.RequestIDConfig{\n  Generator: func() string {\n    return customGenerator()\n  },\n}))\n"})}),"\n",(0,i.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:"RequestIDConfig struct {\n    // Skipper defines a function to skip middleware.\n    Skipper Skipper\n\n    // Generator defines a function to generate an ID.\n    // Optional. Default value random.String(32).\n    Generator func() string\n\n    // RequestIDHandler defines a function which is executed for a request id.\n    RequestIDHandler func(echo.Context, string)\n\n    // TargetHeader defines what header to look for to populate the id\n    TargetHeader string\n}\n"})}),"\n",(0,i.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:"DefaultRequestIDConfig = RequestIDConfig{\n  Skipper:   DefaultSkipper,\n  Generator: generator,\n  TargetHeader: echo.HeaderXRequestID,\n}\n"})}),"\n",(0,i.jsx)(n.h2,{id:"set-id",children:"Set ID"}),"\n",(0,i.jsxs)(n.p,{children:["You can set the id from the requester with the ",(0,i.jsx)(n.code,{children:"X-Request-ID"}),"-Header"]}),"\n",(0,i.jsx)(n.h3,{id:"request",children:"Request"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:'curl -H "X-Request-ID: 3" --compressed -v "http://localhost:1323/?my=param"\n'})}),"\n",(0,i.jsx)(n.h3,{id:"log",children:"Log"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:'{"time":"2017-11-13T20:26:28.6438003+01:00","id":"3","remote_ip":"::1","host":"localhost:1323","method":"GET","uri":"/?my=param","my":"param","status":200, "latency":0,"latency_human":"0s","bytes_in":0,"bytes_out":13}\n'})})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>d});var r=t(6540);const i={},s=r.createContext(i);function a(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);