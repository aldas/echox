"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2923],{8044:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"middleware/jaeger","title":"Jaeger","description":"Jaeager tracing middleware","source":"@site/docs/middleware/jaeger.md","sourceDirName":"middleware","slug":"/middleware/jaeger","permalink":"/docs/middleware/jaeger","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/middleware/jaeger.md","tags":[],"version":"current","frontMatter":{"description":"Jaeager tracing middleware"},"sidebar":"docsSidebar","previous":{"title":"Gzip","permalink":"/docs/middleware/gzip"},"next":{"title":"JWT","permalink":"/docs/middleware/jwt"}}');var i=t(4848),a=t(8453);const s={description:"Jaeager tracing middleware"},c="Jaeger",d={},l=[{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Skipping URL(s)",id:"skipping-urls",level:3},{value:"TraceFunction",id:"tracefunction",level:3},{value:"CreateChildSpan",id:"createchildspan",level:3},{value:"References",id:"references",level:2}];function o(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"jaeger",children:"Jaeger"})}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"Echo community contribution"})}),"\n",(0,i.jsx)(n.p,{children:"Trace requests on Echo framework with Jaeger Tracing Middleware."}),"\n",(0,i.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'package main\nimport (\n    "github.com/labstack/echo-contrib/jaegertracing"\n    "github.com/labstack/echo/v4"\n)\nfunc main() {\n    e := echo.New()\n    // Enable tracing middleware\n    c := jaegertracing.New(e, nil)\n    defer c.Close()\n\n    e.Logger.Fatal(e.Start(":1323"))\n}\n'})}),"\n",(0,i.jsx)(n.p,{children:"Enabling the tracing middleware creates a tracer and a root tracing span for every request."}),"\n",(0,i.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,i.jsxs)(n.p,{children:["By default, traces are sent to ",(0,i.jsx)(n.code,{children:"localhost"})," Jaeger agent instance. To configure an external Jaeger, start your application with environment variables."]}),"\n",(0,i.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"$ JAEGER_AGENT_HOST=192.168.1.10 JAEGER_AGENT_PORT=6831 ./myserver\n"})}),"\n",(0,i.jsx)(n.p,{children:"The tracer can be initialized with values coming from environment variables. None of the env vars are required\nand all of them can be overridden via direct setting of the property on the configuration object."}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"Property"}),(0,i.jsx)(n.th,{children:"Description"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_SERVICE_NAME"}),(0,i.jsx)(n.td,{children:"The service name"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_AGENT_HOST"}),(0,i.jsx)(n.td,{children:"The hostname for communicating with agent via UDP"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_AGENT_PORT"}),(0,i.jsx)(n.td,{children:"The port for communicating with agent via UDP"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_ENDPOINT"}),(0,i.jsxs)(n.td,{children:["The HTTP endpoint for sending spans directly to a collector, i.e. ",(0,i.jsx)(n.a,{href:"http://jaeger-collector:14268/api/traces",children:"http://jaeger-collector:14268/api/traces"})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_USER"}),(0,i.jsx)(n.td,{children:'Username to send as part of "Basic" authentication to the collector endpoint'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_PASSWORD"}),(0,i.jsx)(n.td,{children:'Password to send as part of "Basic" authentication to the collector endpoint'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_REPORTER_LOG_SPANS"}),(0,i.jsx)(n.td,{children:"Whether the reporter should also log the spans"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_REPORTER_MAX_QUEUE_SIZE"}),(0,i.jsx)(n.td,{children:"The reporter's maximum queue size"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_REPORTER_FLUSH_INTERVAL"}),(0,i.jsx)(n.td,{children:'The reporter\'s flush interval, with units, e.g. "500ms" or "2s" ([valid units][timeunits])'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_SAMPLER_TYPE"}),(0,i.jsx)(n.td,{children:"The sampler type"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_SAMPLER_PARAM"}),(0,i.jsx)(n.td,{children:"The sampler parameter (number)"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_SAMPLER_MANAGER_HOST_PORT"}),(0,i.jsxs)(n.td,{children:["The HTTP endpoint when using the remote sampler, i.e. ",(0,i.jsx)(n.a,{href:"http://jaeger-agent:5778/sampling",children:"http://jaeger-agent:5778/sampling"})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_SAMPLER_MAX_OPERATIONS"}),(0,i.jsx)(n.td,{children:"The maximum number of operations that the sampler will keep track of"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_SAMPLER_REFRESH_INTERVAL"}),(0,i.jsx)(n.td,{children:'How often the remotely controlled sampler will poll jaeger-agent for the appropriate sampling strategy, with units, e.g. "1m" or "30s" ([valid units][timeunits])'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_TAGS"}),(0,i.jsxs)(n.td,{children:["A comma separated list of ",(0,i.jsx)(n.code,{children:"name = value"})," tracer level tags, which get added to all reported spans. The value can also refer to an environment variable using the format ",(0,i.jsx)(n.code,{children:"${envVarName:default}"}),", where the ",(0,i.jsx)(n.code,{children:":default"})," is optional, and identifies a value to be used if the environment variable cannot be found"]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_DISABLED"}),(0,i.jsxs)(n.td,{children:["Whether the tracer is disabled or not. If true, the default ",(0,i.jsx)(n.code,{children:"opentracing.NoopTracer"})," is used."]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"JAEGER_RPC_METRICS"}),(0,i.jsx)(n.td,{children:"Whether to store RPC metrics"})]})]})]}),"\n",(0,i.jsxs)(n.p,{children:["By default, the client sends traces via UDP to the agent at ",(0,i.jsx)(n.code,{children:"localhost:6831"}),". Use ",(0,i.jsx)(n.code,{children:"JAEGER_AGENT_HOST"})," and\n",(0,i.jsx)(n.code,{children:"JAEGER_AGENT_PORT"})," to send UDP traces to a different ",(0,i.jsx)(n.code,{children:"host:port"}),". If ",(0,i.jsx)(n.code,{children:"JAEGER_ENDPOINT"})," is set, the client sends traces\nto the endpoint via ",(0,i.jsx)(n.code,{children:"HTTP"}),", making the ",(0,i.jsx)(n.code,{children:"JAEGER_AGENT_HOST"})," and ",(0,i.jsx)(n.code,{children:"JAEGER_AGENT_PORT"})," unused. If ",(0,i.jsx)(n.code,{children:"JAEGER_ENDPOINT"})," is\nsecured, HTTP basic authentication can be performed by setting the ",(0,i.jsx)(n.code,{children:"JAEGER_USER"})," and ",(0,i.jsx)(n.code,{children:"JAEGER_PASSWORD"})," environment\nvariables."]}),"\n",(0,i.jsx)(n.h3,{id:"skipping-urls",children:"Skipping URL(s)"}),"\n",(0,i.jsx)(n.p,{children:"A middleware skipper can be passed to avoid tracing spans to certain URL(s)."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Usage"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'package main\nimport (\n\t"strings"\n    "github.com/labstack/echo-contrib/jaegertracing"\n    "github.com/labstack/echo/v4"\n)\n\n// urlSkipper ignores metrics route on some middleware\nfunc urlSkipper(c echo.Context) bool {\n    if strings.HasPrefix(c.Path(), "/testurl") {\n        return true\n    }\n    return false\n}\n\nfunc main() {\n    e := echo.New()\n    // Enable tracing middleware\n    c := jaegertracing.New(e, urlSkipper)\n    defer c.Close()\n\n    e.Logger.Fatal(e.Start(":1323"))\n}\n'})}),"\n",(0,i.jsx)(n.h3,{id:"tracefunction",children:"TraceFunction"}),"\n",(0,i.jsx)(n.p,{children:"This is a wrapper function that can be used to seamlessly add a span for\nthe duration of the invoked function. There is no need to change function arguments."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Usage"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'package main\nimport (\n    "github.com/labstack/echo-contrib/jaegertracing"\n    "github.com/labstack/echo/v4"\n    "net/http"\n    "time"\n)\nfunc main() {\n    e := echo.New()\n    // Enable tracing middleware\n    c := jaegertracing.New(e, nil)\n    defer c.Close()\n    e.GET("/", func(c echo.Context) error {\n        // Wrap slowFunc on a new span to trace it\'s execution passing the function arguments\n\t\tjaegertracing.TraceFunction(c, slowFunc, "Test String")\n        return c.String(http.StatusOK, "Hello, World!")\n    })\n    e.Logger.Fatal(e.Start(":1323"))\n}\n\n// A function to be wrapped. No need to change it\'s arguments due to tracing\nfunc slowFunc(s string) {\n\ttime.Sleep(200 * time.Millisecond)\n\treturn\n}\n'})}),"\n",(0,i.jsx)(n.h3,{id:"createchildspan",children:"CreateChildSpan"}),"\n",(0,i.jsxs)(n.p,{children:["For more control over the Span, the function ",(0,i.jsx)(n.code,{children:"CreateChildSpan"})," can be called\ngiving control on data to be appended to the span like log messages, baggages and tags."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Usage"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-go",children:'package main\nimport (\n    "github.com/labstack/echo-contrib/jaegertracing"\n    "github.com/labstack/echo/v4"\n)\nfunc main() {\n    e := echo.New()\n    // Enable tracing middleware\n    c := jaegertracing.New(e, nil)\n    defer c.Close()\n    e.GET("/", func(c echo.Context) error {\n        // Do something before creating the child span\n        time.Sleep(40 * time.Millisecond)\n        sp := jaegertracing.CreateChildSpan(c, "Child span for additional processing")\n        defer sp.Finish()\n        sp.LogEvent("Test log")\n        sp.SetBaggageItem("Test baggage", "baggage")\n        sp.SetTag("Test tag", "New Tag")\n        time.Sleep(100 * time.Millisecond)\n        return c.String(http.StatusOK, "Hello, World!")\n    })\n    e.Logger.Fatal(e.Start(":1323"))\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"references",children:"References"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/opentracing/opentracing-go",children:"Opentracing Library"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/jaegertracing/jaeger-client-go#environment-variables",children:"Jaeger configuration"})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(o,{...e})}):o(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>c});var r=t(6540);const i={},a=r.createContext(i);function s(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);