<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input
          v-model="query.filter"
          clearable
          size="small"
          placeholder="博客名搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="分类名搜索"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="标签名搜索"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
      <crudOperation :permission="permission"></crudOperation>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <!-- 标题图，标题，作者，是否原创，分类，标签，浏览次数，评论数，点赞数，创建时间，最后修改时间，发布状态，操作 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="titlePicture" label="标题图" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="isOriginal" label="是否原创" />
      <el-table-column prop="blogSort" label="分类" />
      <el-table-column prop="blogTag" label="标签" />
      <el-table-column prop="clickCount" label="点击数" />
      <el-table-column prop="isPublish" label="发布状态" />
      <el-table-column prop="createdTime" label="创建时间" />
      <el-table-column prop="modifiedTime" label="修改时间" />
      <el-table-column
        v-if="checkPer(['admin', 'user:edit', 'user:del'])"
        label="操作"
        width="115"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-dle="scope.row.id === user.id"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import CRUD, { presenter, header, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";

export default {
  name: "OnlineUser",
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ url: "api/blog", title: "在线用户" });
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      delLoading: false,
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"],
      },
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  created() {},
  methods: {},
};
</script>
