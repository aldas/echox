"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6444],{8062:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"middleware/cors","title":"CORS","description":"CORS middleware","source":"@site/docs/middleware/cors.md","sourceDirName":"middleware","slug":"/middleware/cors","permalink":"/docs/middleware/cors","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/middleware/cors.md","tags":[],"version":"current","frontMatter":{"description":"CORS middleware"},"sidebar":"docsSidebar","previous":{"title":"Casbin Auth","permalink":"/docs/middleware/casbin-auth"},"next":{"title":"CSRF","permalink":"/docs/middleware/csrf"}}');var i=t(4848),a=t(8453);const r={description:"CORS middleware"},o="CORS",l={},d=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Default Configuration",id:"default-configuration",level:3}];function c(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"cors",children:"CORS"})}),"\n",(0,i.jsxs)(n.p,{children:["CORS middleware implements ",(0,i.jsx)(n.a,{href:"http://www.w3.org/TR/cors",children:"CORS"})," specification.\nCORS gives web servers cross-domain access controls, which enable secure cross-domain\ndata transfers."]}),"\n",(0,i.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:"e.Use(middleware.CORS())\n"})}),"\n",(0,i.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,i.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'e := echo.New()\ne.Use(middleware.CORSWithConfig(middleware.CORSConfig{\n  AllowOrigins: []string{"https://labstack.com", "https://labstack.net"},\n  AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},\n}))\n'})}),"\n",(0,i.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'CORSConfig struct {\n  // Skipper defines a function to skip middleware.\n  Skipper Skipper\n\n  // AllowOrigin defines a list of origins that may access the resource.\n  // Optional. Default value []string{"*"}.\n  AllowOrigins []string `yaml:"allow_origins"`\n\n  // AllowOriginFunc is a custom function to validate the origin. It takes the\n  // origin as an argument and returns true if allowed or false otherwise. If\n  // an error is returned, it is returned by the handler. If this option is\n  // set, AllowOrigins is ignored.\n  // Optional.\n  AllowOriginFunc func(origin string) (bool, error) `yaml:"allow_origin_func"`\n\n  // AllowMethods defines a list methods allowed when accessing the resource.\n  // This is used in response to a preflight request.\n  // Optional. Default value DefaultCORSConfig.AllowMethods.\n  AllowMethods []string `yaml:"allow_methods"`\n\n  // AllowHeaders defines a list of request headers that can be used when\n  // making the actual request. This is in response to a preflight request.\n  // Optional. Default value []string{}.\n  AllowHeaders []string `yaml:"allow_headers"`\n\n  // AllowCredentials indicates whether or not the response to the request\n  // can be exposed when the credentials flag is true. When used as part of\n  // a response to a preflight request, this indicates whether or not the\n  // actual request can be made using credentials.\n  // Optional. Default value false.\n  AllowCredentials bool `yaml:"allow_credentials"`\n\n  // ExposeHeaders defines a whitelist headers that clients are allowed to\n  // access.\n  // Optional. Default value []string{}.\n  ExposeHeaders []string `yaml:"expose_headers"`\n\n  // MaxAge indicates how long (in seconds) the results of a preflight request\n  // can be cached.\n  // Optional. Default value 0.\n  MaxAge int `yaml:"max_age"`\n}\n'})}),"\n",(0,i.jsx)(n.h3,{id:"default-configuration",children:"Default Configuration"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'DefaultCORSConfig = CORSConfig{\n  Skipper:      DefaultSkipper,\n  AllowOrigins: []string{"*"},\n  AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},\n}\n'})})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>o});var s=t(6540);const i={},a=s.createContext(i);function r(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);