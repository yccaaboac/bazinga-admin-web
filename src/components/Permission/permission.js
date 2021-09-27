import store from "@/store";

export default {
  inserted(el, binding) {
    const { value } = binding; //取指令的绑定值，除此之外binding还有name，oldValue(仅在 update 和 componentUpdated 钩子中可用)，expression等
    const roles = store.getters && store.getters.roles;
    if (value && value instanceof Array) {
      if (value.length > 0) {
        const permissionRoles = value;
        const hasPermission = roles.some((role) => {
          return permissionRoles.includes(role);
        });
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    } else {
      throw new Error(`使用方式： v-permission="['admin','editor']"`);
    }
  },
};
