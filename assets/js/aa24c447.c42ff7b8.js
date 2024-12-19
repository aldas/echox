"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6105],{6641:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>d,default:()=>c,frontMatter:()=>o,metadata:()=>i,toc:()=>l});const i=JSON.parse('{"id":"middleware/key-auth","title":"Key Auth","description":"Key auth middleware","source":"@site/docs/middleware/key-auth.md","sourceDirName":"middleware","slug":"/middleware/key-auth","permalink":"/docs/middleware/key-auth","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/middleware/key-auth.md","tags":[],"version":"current","frontMatter":{"description":"Key auth middleware"},"sidebar":"docsSidebar","previous":{"title":"JWT","permalink":"/docs/middleware/jwt"},"next":{"title":"Logger","permalink":"/docs/middleware/logger"}}');var r=t(4848),a=t(8453);const o={description:"Key auth middleware"},d="Key Auth",s={},l=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3}];function u(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"key-auth",children:"Key Auth"})}),"\n",(0,r.jsx)(n.p,{children:"Key auth middleware provides a key based authentication."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"For valid key it calls the next handler."}),"\n",(0,r.jsx)(n.li,{children:'For invalid key, it sends "401 - Unauthorized" response.'}),"\n",(0,r.jsx)(n.li,{children:'For missing key, it sends "400 - Bad Request" response.'}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'e.Use(middleware.KeyAuth(func(key string, c echo.Context) (bool, error) {\n  return key == "valid-key", nil\n}))\n'})}),"\n",(0,r.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,r.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'e := echo.New()\ne.Use(middleware.KeyAuthWithConfig(middleware.KeyAuthConfig{\n  KeyLookup: "query:api-key",\n  Validator: func(key string, c echo.Context) (bool, error) {\n\t\t\treturn key == "valid-key", nil\n\t\t},\n}))\n'})}),"\n",(0,r.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'KeyAuthConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper Skipper\n\n  // KeyLookup is a string in the form of "<source>:<name>" that is used\n  // to extract key from the request.\n  // Optional. Default value "header:Authorization".\n  // Possible values:\n  // - "header:<name>"\n  // - "query:<name>"\n  // - "cookie:<name>"\n  // - "form:<name>"\n  KeyLookup string `yaml:"key_lookup"`\n\n  // AuthScheme to be used in the Authorization header.\n  // Optional. Default value "Bearer".\n  AuthScheme string\n\n  // Validator is a function to validate key.\n  // Required.\n  Validator KeyAuthValidator\n\n  // ErrorHandler defines a function which is executed for an invalid key.\n  // It may be used to define a custom error.\n  ErrorHandler KeyAuthErrorHandler\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'DefaultKeyAuthConfig = KeyAuthConfig{\n  Skipper:    DefaultSkipper,\n  KeyLookup:  "header:" + echo.HeaderAuthorization,\n  AuthScheme: "Bearer",\n}\n'})})]})}function c(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>d});var i=t(6540);const r={},a=i.createContext(r);function o(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);