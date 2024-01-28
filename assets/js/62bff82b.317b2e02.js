"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7787],{1942:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>p,frontMatter:()=>t,metadata:()=>a,toc:()=>l});var o=i(5893),r=i(1151);const t={description:"Gzip middleware"},s="Gzip",a={id:"middleware/gzip",title:"Gzip",description:"Gzip middleware",source:"@site/docs/middleware/gzip.md",sourceDirName:"middleware",slug:"/middleware/gzip",permalink:"/docs/middleware/gzip",draft:!1,unlisted:!1,editUrl:"https://github.com/labstack/echox/blob/master/website/docs/middleware/gzip.md",tags:[],version:"current",frontMatter:{description:"Gzip middleware"},sidebar:"docsSidebar",previous:{title:"Decompress",permalink:"/docs/middleware/decompress"},next:{title:"Jaeger",permalink:"/docs/middleware/jaeger"}},d={},l=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Example",id:"example",level:4},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3}];function c(e){const n={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"gzip",children:"Gzip"}),"\n",(0,o.jsx)(n.p,{children:"Gzip middleware compresses HTTP response using gzip compression scheme."}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.code,{children:"e.Use(middleware.Gzip())"})}),"\n",(0,o.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,o.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"e := echo.New()\ne.Use(middleware.GzipWithConfig(middleware.GzipConfig{\n  Level: 5,\n}))\n"})}),"\n",(0,o.jsx)(n.admonition,{type:"tip",children:(0,o.jsx)(n.p,{children:"A middleware skipper can be passed to avoid gzip to certain URL(s)."})}),"\n",(0,o.jsx)(n.h4,{id:"example",children:"Example"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'e := echo.New()\ne.Use(middleware.GzipWithConfig(middleware.GzipConfig{\n  Skipper: func(c echo.Context) bool {\n    return strings.Contains(c.Path(), "metrics") // Change "metrics" for your own path\n  },\n}))\n'})}),"\n",(0,o.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'GzipConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper Skipper\n\n  // Gzip compression level.\n  // Optional. Default value -1.\n  Level int `json:"level"`\n}\n'})}),"\n",(0,o.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:"DefaultGzipConfig = GzipConfig{\n  Skipper: DefaultSkipper,\n  Level:   -1,\n}\n"})})]})}function p(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>s});var o=i(7294);const r={},t=o.createContext(r);function s(e){const n=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(t.Provider,{value:n},e.children)}}}]);