const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/youdao", {
      target: "http://dict.youdao.com",
      changeOrigin: true,
      pathRewrite: { "^/youdao": "" },
    })
  );
};
