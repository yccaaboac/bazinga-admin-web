<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div class="fixed-header">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { AppMain, Navbar, Sidebar, TagsView } from "./components";
// import AppMain from './components/AppMain'
// import Navbar from './components/Navbar'
// import Sidebar from './components/Sidebar'
// ...
export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      needTagsView: (state) => state.settings.tagsView,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

// .app-wrapper {
//   @include clearfix;
//   position: relative;
//   height: 100%;
//   width: 100%;

//   &.mobile.openSidebar {
//     position: fixed;
//     top: 0;
//   }
// }

// .drawer-bg {
//   background: #000;
//   opacity: 0.3;
//   width: 100%;
//   top: 0;
//   height: 100%;
//   position: absolute;
//   z-index: 999;
// }

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  padding: 0;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

// .mobile .fixed-header {
//   width: 100%;
// }
</style>
