<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-input
          v-model="query.title"
          clearable
          size="small"
          placeholder="模糊搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getComments"
      :data="crud.data"
      :tree-props="{ hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column label="博客标题" width="125px" prop="title">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.title !== undefined">{{
            scope.row.title
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评论人" width="125px" prop="user.username">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.user !== undefined" type="success">{{
            scope.row.user.username
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" width="550px" prop="content">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.content !== undefined" type="info">{{
            scope.row.content
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="被评论人"
        width="125px"
        prop="parentComment.user.username"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parentComment !== undefined" type="warning">{{
            scope.row.parentComment.user.username
          }}</el-tag>
        </template></el-table-column
      >
      <el-table-column
        label="被评论内容"
        width="550px"
        prop="parentComment.content"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parentComment !== undefined" type="info">{{
            scope.row.parentComment.content
          }}</el-tag>
        </template></el-table-column
      >

      <el-table-column prop="createTime" label="创建日期" width="135px" />
    </el-table>
  </div>
</template>

<script>
import crudComment from "@/api/news/comment";
import CRUD, { presenter, header } from "@crud/crud";
import rrOperation from "@crud/RR.operation";

export default {
  name: "Comment",
  components: {
    rrOperation,
  },
  cruds() {
    return CRUD({
      query: { openComment: 1 },
      title: "消息",
      url: "api/blogs",
      crudMethod: { ...crudComment },
    });
  },
  mixins: [presenter(), header()],
  methods: {
    getComments(tree, treeNode, resolve) {
      let params = undefined;
      if (tree.title == null) {
        params = { firstCommentId: tree.id };
      } else {
        params = { blogId: tree.id, pidIsNull: true };
      }
      setTimeout(() => {
        crudComment.getComments(params).then((res) => {
          resolve(res.content);
        });
      }, 100);
    },
  },
};
</script>

