"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7236],{3558:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>l,frontMatter:()=>a,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"middleware/jwt","title":"JWT","description":"JWT middleware","source":"@site/docs/middleware/jwt.md","sourceDirName":"middleware","slug":"/middleware/jwt","permalink":"/docs/middleware/jwt","draft":false,"unlisted":false,"editUrl":"https://github.com/labstack/echox/blob/master/website/docs/middleware/jwt.md","tags":[],"version":"current","frontMatter":{"description":"JWT middleware"},"sidebar":"docsSidebar","previous":{"title":"Jaeger","permalink":"/docs/middleware/jaeger"},"next":{"title":"Key Auth","permalink":"/docs/middleware/key-auth"}}');var o=t(4848),r=t(8453);const a={description:"JWT middleware"},s="JWT",d={},c=[{value:"Dependencies",id:"dependencies",level:2},{value:"Usage",id:"usage",level:2},{value:"Custom Configuration",id:"custom-configuration",level:2},{value:"Usage",id:"usage-1",level:3},{value:"Configuration",id:"configuration",level:2},{value:"Example",id:"example",level:2}];function u(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"jwt",children:"JWT"})}),"\n",(0,o.jsxs)(n.p,{children:["JWT provides a JSON Web Token (JWT) authentication middleware. Echo JWT middleware is located at ",(0,o.jsx)(n.a,{href:"https://github.com/labstack/echo-jwt",children:"https://github.com/labstack/echo-jwt"})]}),"\n",(0,o.jsx)(n.p,{children:"Basic middleware behavior:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"For valid token, it sets the user in context and calls next handler."}),"\n",(0,o.jsx)(n.li,{children:'For invalid token, it sends "401 - Unauthorized" response.'}),"\n",(0,o.jsxs)(n.li,{children:["For missing or invalid ",(0,o.jsx)(n.code,{children:"Authorization"}),' header, it sends "400 - Bad Request".']}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"dependencies",children:"Dependencies"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'import "github.com/labstack/echo-jwt/v4"\n'})}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'e.Use(echojwt.JWT([]byte("secret")))\n'})}),"\n",(0,o.jsx)(n.h2,{id:"custom-configuration",children:"Custom Configuration"}),"\n",(0,o.jsx)(n.h3,{id:"usage-1",children:"Usage"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'e.Use(echojwt.WithConfig(echojwt.Config{\n  // ...\n  SigningKey:             []byte("secret"),\n  // ...\n}))\n'})}),"\n",(0,o.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-go",children:'type Config struct {\n\t// Skipper defines a function to skip middleware.\n\tSkipper middleware.Skipper\n\n\t// BeforeFunc defines a function which is executed just before the middleware.\n\tBeforeFunc middleware.BeforeFunc\n\n\t// SuccessHandler defines a function which is executed for a valid token.\n\tSuccessHandler func(c echo.Context)\n\n\t// ErrorHandler defines a function which is executed when all lookups have been done and none of them passed Validator\n\t// function. ErrorHandler is executed with last missing (ErrExtractionValueMissing) or an invalid key.\n\t// It may be used to define a custom JWT error.\n\t//\n\t// Note: when error handler swallows the error (returns nil) middleware continues handler chain execution towards handler.\n\t// This is useful in cases when portion of your site/api is publicly accessible and has extra features for authorized users\n\t// In that case you can use ErrorHandler to set default public JWT token value to request and continue with handler chain.\n\tErrorHandler func(c echo.Context, err error) error\n\n\t// ContinueOnIgnoredError allows the next middleware/handler to be called when ErrorHandler decides to\n\t// ignore the error (by returning `nil`).\n\t// This is useful when parts of your site/api allow public access and some authorized routes provide extra functionality.\n\t// In that case you can use ErrorHandler to set a default public JWT token value in the request context\n\t// and continue. Some logic down the remaining execution chain needs to check that (public) token value then.\n\tContinueOnIgnoredError bool\n\n\t// Context key to store user information from the token into context.\n\t// Optional. Default value "user".\n\tContextKey string\n\n\t// Signing key to validate token.\n\t// This is one of the three options to provide a token validation key.\n\t// The order of precedence is a user-defined KeyFunc, SigningKeys and SigningKey.\n\t// Required if neither user-defined KeyFunc nor SigningKeys is provided.\n\tSigningKey interface{}\n\n\t// Map of signing keys to validate token with kid field usage.\n\t// This is one of the three options to provide a token validation key.\n\t// The order of precedence is a user-defined KeyFunc, SigningKeys and SigningKey.\n\t// Required if neither user-defined KeyFunc nor SigningKey is provided.\n\tSigningKeys map[string]interface{}\n\n\t// Signing method used to check the token\'s signing algorithm.\n\t// Optional. Default value HS256.\n\tSigningMethod string\n\n\t// KeyFunc defines a user-defined function that supplies the public key for a token validation.\n\t// The function shall take care of verifying the signing algorithm and selecting the proper key.\n\t// A user-defined KeyFunc can be useful if tokens are issued by an external party.\n\t// Used by default ParseTokenFunc implementation.\n\t//\n\t// When a user-defined KeyFunc is provided, SigningKey, SigningKeys, and SigningMethod are ignored.\n\t// This is one of the three options to provide a token validation key.\n\t// The order of precedence is a user-defined KeyFunc, SigningKeys and SigningKey.\n\t// Required if neither SigningKeys nor SigningKey is provided.\n\t// Not used if custom ParseTokenFunc is set.\n\t// Default to an internal implementation verifying the signing algorithm and selecting the proper key.\n\tKeyFunc jwt.Keyfunc\n\n\t// TokenLookup is a string in the form of "<source>:<name>" or "<source>:<name>,<source>:<name>" that is used\n\t// to extract token from the request.\n\t// Optional. Default value "header:Authorization".\n\t// Possible values:\n\t// - "header:<name>" or "header:<name>:<cut-prefix>"\n\t// \t\t\t`<cut-prefix>` is argument value to cut/trim prefix of the extracted value. This is useful if header\n\t//\t\t\tvalue has static prefix like `Authorization: <auth-scheme> <authorisation-parameters>` where part that we\n\t//\t\t\twant to cut is `<auth-scheme> ` note the space at the end.\n\t//\t\t\tIn case of JWT tokens `Authorization: Bearer <token>` prefix we cut is `Bearer `.\n\t// If prefix is left empty the whole value is returned.\n\t// - "query:<name>"\n\t// - "param:<name>"\n\t// - "cookie:<name>"\n\t// - "form:<name>"\n\t// Multiple sources example:\n\t// - "header:Authorization:Bearer ,cookie:myowncookie"\n\tTokenLookup string\n\n\t// TokenLookupFuncs defines a list of user-defined functions that extract JWT token from the given context.\n\t// This is one of the two options to provide a token extractor.\n\t// The order of precedence is user-defined TokenLookupFuncs, and TokenLookup.\n\t// You can also provide both if you want.\n\tTokenLookupFuncs []middleware.ValuesExtractor\n\n\t// ParseTokenFunc defines a user-defined function that parses token from given auth. Returns an error when token\n\t// parsing fails or parsed token is invalid.\n\t// Defaults to implementation using `github.com/golang-jwt/jwt` as JWT implementation library\n\tParseTokenFunc func(c echo.Context, auth string) (interface{}, error)\n\n\t// Claims are extendable claims data defining token content. Used by default ParseTokenFunc implementation.\n\t// Not used if custom ParseTokenFunc is set.\n\t// Optional. Defaults to function returning jwt.MapClaims\n\tNewClaimsFunc func(c echo.Context) jwt.Claims\n}\n'})}),"\n",(0,o.jsx)(n.h2,{id:"example",children:(0,o.jsx)(n.a,{href:"/docs/cookbook/jwt",children:"Example"})})]})}function l(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>s});var i=t(6540);const o={},r=i.createContext(o);function a(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);