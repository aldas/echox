"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2728],{7826:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"middleware/casbin-auth","title":"Casbin Auth","description":"Casbin auth middleware","source":"@site/docs/middleware/casbin-auth.md","sourceDirName":"middleware","slug":"/middleware/casbin-auth","permalink":"/docs/middleware/casbin-auth","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/middleware/casbin-auth.md","tags":[],"version":"current","frontMatter":{"description":"Casbin auth middleware"},"sidebar":"docsSidebar","previous":{"title":"Body Limit","permalink":"/docs/middleware/body-limit"},"next":{"title":"CORS","permalink":"/docs/middleware/cors"}}');var r=i(4848),o=i(8453);const a={description:"Casbin auth middleware"},t="Casbin Auth",c={},d=[{value:"Dependencies",id:"dependencies",level:2},{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"casbin-auth",children:"Casbin Auth"})}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsx)(n.p,{children:"Echo community contribution"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"https://github.com/casbin/casbin",children:"Casbin"})," is a powerful and efficient open-source access control library for Go. It provides support for enforcing authorization based on various models. So far, the access control models supported by Casbin are:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"ACL (Access Control List)"}),"\n",(0,r.jsx)(n.li,{children:"ACL with superuser"}),"\n",(0,r.jsx)(n.li,{children:"ACL without users: especially useful for systems that don't have authentication or user log-ins."}),"\n",(0,r.jsx)(n.li,{children:"ACL without resources: some scenarios may target for a type of resources instead of an individual resource by using permissions like write-article, read-log. It doesn't control the access to a specific article or log."}),"\n",(0,r.jsx)(n.li,{children:"RBAC (Role-Based Access Control)"}),"\n",(0,r.jsx)(n.li,{children:"RBAC with resource roles: both users and resources can have roles (or groups) at the same time."}),"\n",(0,r.jsx)(n.li,{children:"RBAC with domains/tenants: users can have different role sets for different domains/tenants."}),"\n",(0,r.jsx)(n.li,{children:"ABAC (Attribute-Based Access Control)"}),"\n",(0,r.jsx)(n.li,{children:"RESTful"}),"\n",(0,r.jsx)(n.li,{children:"Deny-override: both allow and deny authorizations are supported, deny overrides the allow."}),"\n"]}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"Currently, only HTTP basic authentication is supported."})}),"\n",(0,r.jsx)(n.h2,{id:"dependencies",children:"Dependencies"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'import (\n  "github.com/casbin/casbin"\n  casbin_mw "github.com/labstack/echo-contrib/casbin"\n)\n'})}),"\n",(0,r.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'e := echo.New()\nenforcer, err := casbin.NewEnforcer("casbin_auth_model.conf", "casbin_auth_policy.csv")\ne.Use(casbin_mw.Middleware(enforcer))\n'})}),"\n",(0,r.jsxs)(n.p,{children:["For syntax, see: ",(0,r.jsx)(n.a,{href:"https://casbin.org/docs/syntax-for-models",children:"Syntax for Models"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,r.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'e := echo.New()\nce := casbin.NewEnforcer("casbin_auth_model.conf", "")\nce.AddRoleForUser("alice", "admin")\nce.AddPolicy(...)\ne.Use(casbin_mw.MiddlewareWithConfig(casbin_mw.Config{\n  Enforcer: ce,\n}))\n'})}),"\n",(0,r.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:"// Config defines the config for CasbinAuth middleware.\nConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper middleware.Skipper\n\n  // Enforcer CasbinAuth main rule.\n  // Required.\n  Enforcer *casbin.Enforcer\n}\n"})}),"\n",(0,r.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:"// DefaultConfig is the default CasbinAuth middleware config.\nDefaultConfig = Config{\n  Skipper: middleware.DefaultSkipper,\n}\n"})})]})}function u(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>t});var s=i(6540);const r={},o=s.createContext(r);function a(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);