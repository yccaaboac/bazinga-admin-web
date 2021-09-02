import permission from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
}

// if (window.Vue) {
//   window['permission'] = permission
//   Vue.use(install); // eslint-disable-line
// }

// install是默认的方法。当外界在use这个组件的时候（Vue.use(xx)），就会调用本身的install方法，同时传一个Vue这个类的参数。
permission.install = install



export default permission