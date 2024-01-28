"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1710],{8353:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>c,toc:()=>i});var r=n(5893),t=n(1151);const o={description:"CRUD (Create, read, update and delete) recipe"},l="CRUD",c={id:"cookbook/crud",title:"CRUD",description:"CRUD (Create, read, update and delete) recipe",source:"@site/docs/cookbook/crud.md",sourceDirName:"cookbook",slug:"/cookbook/crud",permalink:"/docs/cookbook/crud",draft:!1,unlisted:!1,editUrl:"https://github.com/labstack/echox/blob/master/website/docs/cookbook/crud.md",tags:[],version:"current",frontMatter:{description:"CRUD (Create, read, update and delete) recipe"},sidebar:"docsSidebar",previous:{title:"CORS",permalink:"/docs/cookbook/cors"},next:{title:"Embed Resources",permalink:"/docs/cookbook/embed-resources"}},d={},i=[{value:"Server",id:"server",level:2},{value:"Client",id:"client",level:2},{value:"Create user",id:"create-user",level:3},{value:"Request",id:"request",level:4},{value:"Response",id:"response",level:4},{value:"Get user",id:"get-user",level:3},{value:"Request",id:"request-1",level:4},{value:"Response",id:"response-1",level:4},{value:"Update user",id:"update-user",level:3},{value:"Request",id:"request-2",level:4},{value:"Response",id:"response-2",level:4},{value:"Delete user",id:"delete-user",level:3},{value:"Request",id:"request-3",level:4},{value:"Response",id:"response-3",level:4}];function a(e){const s={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,t.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.h1,{id:"crud",children:"CRUD"}),"\n",(0,r.jsx)(s.h2,{id:"server",children:"Server"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-go",metastring:"reference",children:"https://github.com/labstack/echox/blob/master/cookbook/crud/server.go\n"})}),"\n",(0,r.jsx)(s.h2,{id:"client",children:"Client"}),"\n",(0,r.jsx)(s.h3,{id:"create-user",children:"Create user"}),"\n",(0,r.jsx)(s.h4,{id:"request",children:"Request"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sh",children:"curl -X POST \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"Joe Smith\"}' \\\n  localhost:1323/users\n"})}),"\n",(0,r.jsx)(s.h4,{id:"response",children:"Response"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-js",children:'{\n  "id": 1,\n  "name": "Joe Smith"\n}\n'})}),"\n",(0,r.jsx)(s.h3,{id:"get-user",children:"Get user"}),"\n",(0,r.jsx)(s.h4,{id:"request-1",children:"Request"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sh",children:"curl localhost:1323/users/1\n"})}),"\n",(0,r.jsx)(s.h4,{id:"response-1",children:"Response"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-js",children:'{\n  "id": 1,\n  "name": "Joe Smith"\n}\n'})}),"\n",(0,r.jsx)(s.h3,{id:"update-user",children:"Update user"}),"\n",(0,r.jsx)(s.h4,{id:"request-2",children:"Request"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sh",children:"curl -X PUT \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"Joe\"}' \\\n  localhost:1323/users/1\n"})}),"\n",(0,r.jsx)(s.h4,{id:"response-2",children:"Response"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-js",children:'{\n  "id": 1,\n  "name": "Joe"\n}\n'})}),"\n",(0,r.jsx)(s.h3,{id:"delete-user",children:"Delete user"}),"\n",(0,r.jsx)(s.h4,{id:"request-3",children:"Request"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-sh",children:"curl -X DELETE localhost:1323/users/1\n"})}),"\n",(0,r.jsx)(s.h4,{id:"response-3",children:"Response"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"NoContent - 204"})})]})}function u(e={}){const{wrapper:s}={...(0,t.a)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},1151:(e,s,n)=>{n.d(s,{Z:()=>c,a:()=>l});var r=n(7294);const t={},o=r.createContext(t);function l(e){const s=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),r.createElement(o.Provider,{value:s},e.children)}}}]);