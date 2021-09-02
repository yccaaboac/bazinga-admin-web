import Vue from "vue";
import Cookies from "js-cookie";
import App from "./App.vue";
import Element from "element-ui";


import router from "./router/routers";
import "./assets/icons";
import "element-ui/lib/theme-chalk/index.css";
import "./router/index";

import dict from './components/Dict'
// 权限指令
import checkPer from '@/utils/permission'
import permission from "./components/Permission";
// import "./assets/styles/element-variables.scss";
import "./assets/styles/index.scss";
import store from "./store";
Vue.config.productionTip = false;

// install是默认的方法。当外界在use这个组件的时候（Vue.use(xx)），就会调用本身的install方法，同时传一个Vue这个类的参数。
// 用 axios时，之所以不需要用 Vue.use(axios)，就能直接使用，是因为开发者在封装 axios 时，没有写 install这一步
Vue.use(checkPer)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  // 在引入Element时,可以传入一个全局配置对象
  //该对象目前支持size与zIndex字段
  //size用于改变组件的默认尺寸, zIndex设置弹框的初始z-index (默认值: 2000 )。
  //也可以按需引入，如（Button），具体查看文档
  size: Cookies.get("size") || "small",
});

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
