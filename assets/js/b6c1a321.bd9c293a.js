"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[596],{3548:(e,i,s)=>{s.r(i),s.d(i,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>t,toc:()=>o});const t=JSON.parse('{"id":"guide/static-files","title":"Static Files","description":"Serving static files","source":"@site/docs/guide/static-files.md","sourceDirName":"guide","slug":"/static-files","permalink":"/docs/static-files","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/guide/static-files.md","tags":[],"version":"current","sidebarPosition":11,"frontMatter":{"description":"Serving static files","slug":"/static-files","sidebar_position":11},"sidebar":"docsSidebar","previous":{"title":"Routing","permalink":"/docs/routing"},"next":{"title":"Templates","permalink":"/docs/templates"}}');var n=s(4848),c=s(8453);const r={description:"Serving static files",slug:"/static-files",sidebar_position:11},a="Static Files",l={},o=[{value:"Using Static Middleware",id:"using-static-middleware",level:2},{value:"Using Echo#Static()",id:"using-echostatic",level:2},{value:"Using Echo#File()",id:"using-echofile",level:2}];function d(e){const i={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,c.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.header,{children:(0,n.jsx)(i.h1,{id:"static-files",children:"Static Files"})}),"\n",(0,n.jsx)(i.p,{children:"Images, JavaScript, CSS, PDF, Fonts and so on..."}),"\n",(0,n.jsx)(i.h2,{id:"using-static-middleware",children:"Using Static Middleware"}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.a,{href:"/docs/middleware/static",children:"See "})}),"\n",(0,n.jsx)(i.h2,{id:"using-echostatic",children:"Using Echo#Static()"}),"\n",(0,n.jsxs)(i.p,{children:[(0,n.jsx)(i.code,{children:"Echo#Static(prefix, root string)"})," registers a new route with path prefix to serve\nstatic files from the provided root directory."]}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.em,{children:"Usage 1"})}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-go",children:'e := echo.New()\ne.Static("/static", "assets")\n'})}),"\n",(0,n.jsxs)(i.p,{children:["Example above will serve any file from the assets directory for path ",(0,n.jsx)(i.code,{children:"/static/*"}),". For example,\na request to ",(0,n.jsx)(i.code,{children:"/static/js/main.js"})," will fetch and serve ",(0,n.jsx)(i.code,{children:"assets/js/main.js"})," file."]}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.em,{children:"Usage 2"})}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-go",children:'e := echo.New()\ne.Static("/", "assets")\n'})}),"\n",(0,n.jsxs)(i.p,{children:["Example above will serve any file from the assets directory for path ",(0,n.jsx)(i.code,{children:"/*"}),". For example,\na request to ",(0,n.jsx)(i.code,{children:"/js/main.js"})," will fetch and serve ",(0,n.jsx)(i.code,{children:"assets/js/main.js"})," file."]}),"\n",(0,n.jsx)(i.h2,{id:"using-echofile",children:"Using Echo#File()"}),"\n",(0,n.jsxs)(i.p,{children:[(0,n.jsx)(i.code,{children:"Echo#File(path, file string)"})," registers a new route with path to serve a static\nfile."]}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.em,{children:"Usage 1"})}),"\n",(0,n.jsxs)(i.p,{children:["Serving an index page from ",(0,n.jsx)(i.code,{children:"public/index.html"})]}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-go",children:'e.File("/", "public/index.html")\n'})}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.em,{children:"Usage 2"})}),"\n",(0,n.jsxs)(i.p,{children:["Serving a favicon from ",(0,n.jsx)(i.code,{children:"images/favicon.ico"})]}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-go",children:'e.File("/favicon.ico", "images/favicon.ico")\n'})})]})}function h(e={}){const{wrapper:i}={...(0,c.R)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},8453:(e,i,s)=>{s.d(i,{R:()=>r,x:()=>a});var t=s(6540);const n={},c=t.createContext(n);function r(e){const i=t.useContext(c);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:r(e.components),t.createElement(c.Provider,{value:i},e.children)}}}]);