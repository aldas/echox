"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7787],{2789:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>p,frontMatter:()=>t,metadata:()=>s,toc:()=>l});var r=i(5893),o=i(1151);const t={description:"Gzip middleware"},a="Gzip",s={id:"middleware/gzip",title:"Gzip",description:"Gzip middleware",source:"@site/docs/middleware/gzip.md",sourceDirName:"middleware",slug:"/middleware/gzip",permalink:"/docs/middleware/gzip",draft:!1,unlisted:!1,editUrl:"https://github.com/labstack/echox/blob/master/website/docs/middleware/gzip.md",tags:[],version:"current",frontMatter:{description:"Gzip middleware"},sidebar:"docsSidebar",previous:{title:"Decompress",permalink:"/docs/middleware/decompress"},next:{title:"Jaeger",permalink:"/docs/middleware/jaeger"}},d={},l=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Example",id:"example",level:4},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3}];function c(e){const n={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"gzip",children:"Gzip"})}),"\n",(0,r.jsx)(n.p,{children:"Gzip middleware compresses HTTP response using gzip compression scheme."}),"\n",(0,r.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.code,{children:"e.Use(middleware.Gzip())"})}),"\n",(0,r.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,r.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:"e := echo.New()\ne.Use(middleware.GzipWithConfig(middleware.GzipConfig{\n  Level: 5,\n}))\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsx)(n.p,{children:"A middleware skipper can be passed to avoid gzip to certain URL(s)."})}),"\n",(0,r.jsx)(n.h4,{id:"example",children:"Example"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'e := echo.New()\ne.Use(middleware.GzipWithConfig(middleware.GzipConfig{\n  Skipper: func(c echo.Context) bool {\n    return strings.Contains(c.Path(), "metrics") // Change "metrics" for your own path\n  },\n}))\n'})}),"\n",(0,r.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'GzipConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper Skipper\n\n  // Gzip compression level.\n  // Optional. Default value -1.\n  Level int `json:"level"`\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:"DefaultGzipConfig = GzipConfig{\n  Skipper: DefaultSkipper,\n  Level:   -1,\n}\n"})})]})}function p(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>s,a:()=>a});var r=i(7294);const o={},t=r.createContext(o);function a(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);