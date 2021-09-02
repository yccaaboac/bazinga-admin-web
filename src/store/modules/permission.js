import { constantRouterMap } from "@/router/routers";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";

const permission = {
  state: {
    //原来的routers加上动态的router，包括{ path: "*", redirect: "/404", hidden: true }
    routers: constantRouterMap,
    //动态的router，包括{ path: "*", redirect: "/404", hidden: true }，且子组件的子组件（多级菜单子组件和子组件的子组件）没有层级关系（合并）
    addRouters: [],
    //原来的routers加上动态的router，不包括{ path: "*", redirect: "/404", hidden: true }
    sidebarRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers); //concat方法不改变原来的数组
    },
    SET_SIDEBAR_ROUTERS: (state, routers) => {
      state.sidebarRouters = constantRouterMap.concat(routers);
    },
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit("SET_ROUTERS", asyncRouter);
    },
    SetSidebarRouters({ commit }, sidebarRouter) {
      commit("SET_SIDEBAR_ROUTERS", sidebarRouter);
    },
  },
};
// 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (routers, isRewrite = false) => {
  return routers.filter((router) => {
    if (isRewrite && router.children) {
      //二级菜单还有儿子（三级菜单）时进入，传入三级菜单
      router.children = filterChildren(router.children);
    }
    if (router.component) {
      if (router.component === "Layout") {
        // Layout组件特殊处理（固定的组件Layout）
        router.component = Layout;
      } else if (router.component === "ParentView") {
        // ParentView组件特殊处理（固定的组件ParentView）
        router.component = ParentView;
      } else {
        const component = router.component;
        router.component = loadView(component);
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, router, isRewrite); //router.children子组件，router父组件
    }
    return true;
  });
};

function filterChildren(childrenMap) {
  //childrenMap：三级菜单
  //childrenMap：二级菜单
  var children = [];
  console.log(childrenMap,'childrenMap')
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      //如果三级菜单还有儿子（四级菜单，五级菜单...）
      //如果二级菜单还有儿子（三级菜单，四级菜单...）
      // console.log(el.children, "33333333333333");
      // console.log(el.children);
      if (el.component === "ParentView") {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    children = children.concat(el);
  });
  // console.log("-------------------------");
  // console.log(JSON.stringify(children, null, "\t"));
  return children;
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;
