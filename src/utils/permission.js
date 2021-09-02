import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default {
  install(Vue) {
    Vue.prototype.checkPer = (value) => {
      if (value && value instanceof Array && value.length > 0) {
        const roles = store.getters && store.getters.roles
        const permissionRoles = value

        const hasPermission = roles.some(role => {//some判断是否有元素符合条件，如果有返回的是布尔变量true反之为false
          return permissionRoles.includes(role)
        })

        if (!hasPermission) {
          return false
        }
        return true
      } else {
        console.error(`need roles! Like v-permission="['admin','editor']"`)
        return false
      }
    }
  }
}
