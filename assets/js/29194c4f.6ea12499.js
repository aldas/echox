"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5675],{887:(e,n,d)=>{d.r(n),d.d(n,{assets:()=>s,contentTitle:()=>t,default:()=>c,frontMatter:()=>r,metadata:()=>a,toc:()=>u});var o=d(4848),i=d(8453);const r={description:"Body dump middleware"},t="Body Dump",a={id:"middleware/body-dump",title:"Body Dump",description:"Body dump middleware",source:"@site/docs/middleware/body-dump.md",sourceDirName:"middleware",slug:"/middleware/body-dump",permalink:"/docs/middleware/body-dump",draft:!1,unlisted:!1,editUrl:"https://github.com/labstack/echox/blob/master/website/docs/middleware/body-dump.md",tags:[],version:"current",frontMatter:{description:"Body dump middleware"},sidebar:"docsSidebar",previous:{title:"Basic Auth",permalink:"/docs/middleware/basic-auth"},next:{title:"Body Limit",permalink:"/docs/middleware/body-limit"}},s={},u=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration*",id:"default-configuration",level:3}];function l(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"body-dump",children:"Body Dump"})}),"\n",(0,o.jsx)(n.p,{children:"Body dump middleware captures the request and response payload and calls the registered handler. Generally used for debugging/logging purpose. Avoid using it if your request/response payload is huge e.g. file upload/download, but if you still need to, add an exception for your endpoints in the skipper function."}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"e := echo.New()\ne.Use(middleware.BodyDump(func(c echo.Context, reqBody, resBody []byte) {\n}))\n"})}),"\n",(0,o.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,o.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"e := echo.New()\ne.Use(middleware.BodyDumpWithConfig(middleware.BodyDumpConfig{}))\n"})}),"\n",(0,o.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"BodyDumpConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper Skipper\n\n  // Handler receives request and response payload.\n  // Required.\n  Handler BodyDumpHandler\n}\n"})}),"\n",(0,o.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration*"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"DefaultBodyDumpConfig = BodyDumpConfig{\n  Skipper: DefaultSkipper,\n}\n"})})]})}function c(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},8453:(e,n,d)=>{d.d(n,{R:()=>t,x:()=>a});var o=d(6540);const i={},r=o.createContext(i);function t(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);