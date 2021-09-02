import Cookies from "js-cookie";
import Config from "@/settings";

const TokenKey = Config.TokenKey;

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token, rememberMe) {
  //区别于其他cookie信息，token一定会被保存，否则每次访问都处于未登录状态
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires });
  } else {
    //默认情况下，浏览器关闭，Cookies过期
    return Cookies.set(TokenKey, token);
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
