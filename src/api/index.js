import axios from "axios";
import qs from "qs";
import Cookie from 'js-cookie';

export default function request(target, method = "GET", data = {}) {
  const instance = axios.create({
    // 基础路径，发请求的时候，路径当中会出现api
    baseURL: target.startsWith("/youdao") ? "" : "http://localhost:3005/api/",
    // 代表请求超时的时间5s
    timeout: 5000
  });

  // 请求拦截器：在发送请求之前，请求拦截器可以检测到，可以在请求发送出去前做一些事情
  instance.interceptors.request.use((config) => {
    // config：配置对象，对象里面有一个属性很重要，headers请求头
    config.method = method;
    config.headers["Content-Type"] =
      method === "POST" ||
      method === "PUT" ||
      method === "DELETE" ||
      method === "PATCH"
        ? "application/x-www-form-urlencoded"
        : "application/json";
    config.headers["Authorization"] = `Bearer ${Cookie.get('easy-english-react-token')}`;
    config.data = qs.stringify(data);

    return config;
  });

  // 响应拦截器
  instance.interceptors.response.use((res) => {
    return res.data;
  });

  return instance(target);
}
