"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6802],{2484:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>t,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"guide/customization","title":"Customization","description":"Customization","source":"@site/docs/guide/customization.md","sourceDirName":"guide","slug":"/customization","permalink":"/docs/customization","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/guide/customization.md","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"description":"Customization","slug":"/customization","sidebar_position":2},"sidebar":"docsSidebar","previous":{"title":"Quick Start","permalink":"/docs/quick-start"},"next":{"title":"Binding","permalink":"/docs/binding"}}');var l=i(4848),s=i(8453);const o={description:"Customization",slug:"/customization",sidebar_position:2},t="Customization",d={},c=[{value:"Debug",id:"debug",level:2},{value:"Logging",id:"logging",level:2},{value:"Log Header",id:"log-header",level:3},{value:"Available Tags",id:"available-tags",level:4},{value:"Log Output",id:"log-output",level:3},{value:"Log Level",id:"log-level",level:3},{value:"Custom Logger",id:"custom-logger",level:3},{value:"Startup Banner",id:"startup-banner",level:2},{value:"Listener Port",id:"listener-port",level:2},{value:"Custom Listener",id:"custom-listener",level:2},{value:"Disable HTTP/2",id:"disable-http2",level:2},{value:"Read Timeout",id:"read-timeout",level:2},{value:"Write Timeout",id:"write-timeout",level:2},{value:"Validator",id:"validator",level:2},{value:"Custom Binder",id:"custom-binder",level:2},{value:"Custom JSON Serializer",id:"custom-json-serializer",level:2},{value:"Renderer",id:"renderer",level:2},{value:"HTTP Error Handler",id:"http-error-handler",level:2}];function a(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.header,{children:(0,l.jsx)(n.h1,{id:"customization",children:"Customization"})}),"\n",(0,l.jsx)(n.h2,{id:"debug",children:"Debug"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#Debug"})," can be used to enable / disable debug mode. Debug mode sets the log level\nto ",(0,l.jsx)(n.code,{children:"DEBUG"}),"."]}),"\n",(0,l.jsx)(n.h2,{id:"logging",children:"Logging"}),"\n",(0,l.jsx)(n.p,{children:"The default format for logging is JSON, which can be changed by modifying the header."}),"\n",(0,l.jsx)(n.h3,{id:"log-header",children:"Log Header"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#Logger.SetHeader(string)"})," can be used to set the header for\nthe logger. Default value:"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'{"time":"${time_rfc3339_nano}","level":"${level}","prefix":"${prefix}","file":"${short_file}","line":"${line}"}\n'})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-go",children:'import "github.com/labstack/gommon/log"\n\n/* ... */\n\nif l, ok := e.Logger.(*log.Logger); ok {\n  l.SetHeader("${time_rfc3339} ${level}")\n}\n'})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-sh",children:"2018-05-08T20:30:06-07:00 INFO info\n"})}),"\n",(0,l.jsx)(n.h4,{id:"available-tags",children:"Available Tags"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"time_rfc3339"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"time_rfc3339_nano"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"level"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"prefix"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"long_file"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"short_file"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"line"})}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"log-output",children:"Log Output"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#Logger.SetOutput(io.Writer)"})," can be used to set the output destination for\nthe logger. Default value is ",(0,l.jsx)(n.code,{children:"os.Stdout"})]}),"\n",(0,l.jsxs)(n.p,{children:["To completely disable logs use ",(0,l.jsx)(n.code,{children:"Echo#Logger.SetOutput(io.Discard)"})," or ",(0,l.jsx)(n.code,{children:"Echo#Logger.SetLevel(log.OFF)"})]}),"\n",(0,l.jsx)(n.h3,{id:"log-level",children:"Log Level"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#Logger.SetLevel(log.Lvl)"})," can be used to set the log level for the logger.\nDefault value is ",(0,l.jsx)(n.code,{children:"ERROR"}),". Possible values:"]}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"DEBUG"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"INFO"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"WARN"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"ERROR"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.code,{children:"OFF"})}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"custom-logger",children:"Custom Logger"}),"\n",(0,l.jsxs)(n.p,{children:["Logging is implemented using ",(0,l.jsx)(n.code,{children:"echo.Logger"})," interface which allows you to register\na custom logger using ",(0,l.jsx)(n.code,{children:"Echo#Logger"}),"."]}),"\n",(0,l.jsx)(n.h2,{id:"startup-banner",children:"Startup Banner"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#HideBanner"})," can be used to hide the startup banner."]}),"\n",(0,l.jsx)(n.h2,{id:"listener-port",children:"Listener Port"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#HidePort"})," can be used to hide the listener port message."]}),"\n",(0,l.jsx)(n.h2,{id:"custom-listener",children:"Custom Listener"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#*Listener"})," can be used to run a custom listener."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-go",children:'l, err := net.Listen("tcp", ":1323")\nif err != nil {\n  e.Logger.Fatal(err)\n}\ne.Listener = l\ne.Logger.Fatal(e.Start(""))\n'})}),"\n",(0,l.jsx)(n.h2,{id:"disable-http2",children:"Disable HTTP/2"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#DisableHTTP2"})," can be used disable HTTP/2 protocol."]}),"\n",(0,l.jsx)(n.h2,{id:"read-timeout",children:"Read Timeout"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#*Server#ReadTimeout"})," can be used to set the maximum duration before timing out read\nof the request."]}),"\n",(0,l.jsx)(n.h2,{id:"write-timeout",children:"Write Timeout"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#*Server#WriteTimeout"})," can be used to set the maximum duration before timing out write\nof the response."]}),"\n",(0,l.jsx)(n.h2,{id:"validator",children:"Validator"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#Validator"})," can be used to register a validator for performing data validation\non request payload."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.a,{href:"/docs/request#validate-data",children:"Learn more"})}),"\n",(0,l.jsx)(n.h2,{id:"custom-binder",children:"Custom Binder"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#Binder"})," can be used to register a custom binder for binding request payload."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.a,{href:"./binding#custom-binding",children:"Learn more"})}),"\n",(0,l.jsx)(n.h2,{id:"custom-json-serializer",children:"Custom JSON Serializer"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#JSONSerializer"})," can be used to register a custom JSON serializer."]}),"\n",(0,l.jsxs)(n.p,{children:["Have a look at ",(0,l.jsx)(n.code,{children:"DefaultJSONSerializer"})," on ",(0,l.jsx)(n.a,{href:"https://github.com/labstack/echo/blob/master/json.go",children:"json.go"}),"."]}),"\n",(0,l.jsx)(n.h2,{id:"renderer",children:"Renderer"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#Renderer"})," can be used to register a renderer for template rendering."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.a,{href:"/docs/templates",children:"Learn more"})}),"\n",(0,l.jsx)(n.h2,{id:"http-error-handler",children:"HTTP Error Handler"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.code,{children:"Echo#HTTPErrorHandler"})," can be used to register a custom http error handler."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.a,{href:"/docs/error-handling",children:"Learn more"})})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(a,{...e})}):a(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>t});var r=i(6540);const l={},s=r.createContext(l);function o(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:o(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);