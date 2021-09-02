import axios from "axios";
import Config from "@/settings";
import { getToken } from "@/utils/auth";

// 创建axios实例
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? process.env.VUE_APP_BASE_API : "/", // api的base_url，process.env这个属性返回包含用户环境信息的对象
  timeout: Config.timeout, // 请求超时时间z
});

//request拦截器
service.interceptors.request.use(
  (config) => {
    //config实际上是一个请求对象{url: "auth/code", method: "get", headers: {…}, baseURL: "/", transformRequest: Array(1), …}
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token请根据实际情况自行修改
    }
    config.headers["Content-Type"] = "application/json"; //作为请求头告诉服务端消息主体是序列化的JSON字符串
    return config;
  },
  (error) => {
    Promise.reject(error); //Promise.reject(reason)方法也会返回一个新的Promise实例，该实例的状态为rejected
    //const p = Promise.reject('出错了');等同于const p = new Promise((resolve, reject) => reject('出错了'))
  }
);

//response拦截器
service.interceptors.response.use((response) => {
  return response.data;
});

export default service;
