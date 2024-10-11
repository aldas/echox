"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1229],{3347:(e,r,d)=>{d.r(r),d.d(r,{assets:()=>s,contentTitle:()=>n,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var o=d(5893),t=d(1151);const i={description:"Method override middleware"},n="Method Override",a={id:"middleware/method-override",title:"Method Override",description:"Method override middleware",source:"@site/docs/middleware/method-override.md",sourceDirName:"middleware",slug:"/middleware/method-override",permalink:"/docs/middleware/method-override",draft:!1,unlisted:!1,editUrl:"https://github.com/labstack/echox/blob/master/website/docs/middleware/method-override.md",tags:[],version:"current",frontMatter:{description:"Method override middleware"},sidebar:"docsSidebar",previous:{title:"Logger",permalink:"/docs/middleware/logger"},next:{title:"Prometheus",permalink:"/docs/middleware/prometheus"}},s={},l=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3}];function c(e){const r={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,t.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.header,{children:(0,o.jsx)(r.h1,{id:"method-override",children:"Method Override"})}),"\n",(0,o.jsx)(r.p,{children:"Method override middleware checks for the overridden method from the request and\nuses it instead of the original method."}),"\n",(0,o.jsx)(r.admonition,{type:"info",children:(0,o.jsxs)(r.p,{children:["For security reasons, only ",(0,o.jsx)(r.code,{children:"POST"})," method can be overridden."]})}),"\n",(0,o.jsx)(r.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-go",children:"e.Pre(middleware.MethodOverride())\n"})}),"\n",(0,o.jsx)(r.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,o.jsx)(r.h3,{id:"usage-1",children:"Usage"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-go",children:'e := echo.New()\ne.Pre(middleware.MethodOverrideWithConfig(middleware.MethodOverrideConfig{\n  Getter: middleware.MethodFromForm("_method"),\n}))\n'})}),"\n",(0,o.jsx)(r.h2,{id:"configuration",children:"Configuration"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-go",children:"MethodOverrideConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper Skipper\n\n  // Getter is a function that gets overridden method from the request.\n  // Optional. Default values MethodFromHeader(echo.HeaderXHTTPMethodOverride).\n  Getter MethodOverrideGetter\n}\n"})}),"\n",(0,o.jsx)(r.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-go",children:"DefaultMethodOverrideConfig = MethodOverrideConfig{\n  Skipper: DefaultSkipper,\n  Getter:  MethodFromHeader(echo.HeaderXHTTPMethodOverride),\n}\n"})})]})}function h(e={}){const{wrapper:r}={...(0,t.a)(),...e.components};return r?(0,o.jsx)(r,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},1151:(e,r,d)=>{d.d(r,{Z:()=>a,a:()=>n});var o=d(7294);const t={},i=o.createContext(t);function n(e){const r=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:n(e.components),o.createElement(i.Provider,{value:r},e.children)}}}]);