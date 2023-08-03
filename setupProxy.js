// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = function (app) {
//   app.use(
//     createProxyMiddleware("/api", {
//       target: "http://localhost:3005",
//       changeOrigin: true, // 控制服务器接收到的请求头中host字段的值
//       pathRewrite: { "^/api": "" },
//     }),
//     createProxyMiddleware("/youdao", {
//       target: "http://dict.youdao.com",
//       changeOrigin: true,
//       pathRewrite: { "^/youdao": "" },
//     })
//   );
// };
