<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="输入类别名称或描述模糊搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select
          v-model="query.enabled"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 90px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in categoryTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <date-range-picker v-model="query.createTime" class="date-item" />

        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="350px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="88px"
      >
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类别描述" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio-group v-model="form.enabled">
            <el-radio
              v-for="item in dict.category_status"
              :key="item.id"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 70%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="类别名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="description"
        label="类别描述"
      />
      <el-table-column label="状态" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        width="135"
        label="创建日期"
      />
      <el-table-column
        v-if="checkPer(['admin', 'user:edit', 'user:del'])"
        label="操作"
        width="115"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudCategory from "@/api/blog/category";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import DateRangePicker from "@/components/DateRangePicker";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import { mapGetters } from "vuex";

const defaultForm = {
  name: null,
  description: null,
  enabled: "false",
};
export default {
  name: "Category",
  components: {
    crudOperation,
    rrOperation,
    udOperation,
    DateRangePicker,
    pagination,
  },
  cruds() {
    return CRUD({
      title: "类别",
      url: "api/categories",
      crudMethod: { ...crudCategory },
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ["category_status"],
  data() {
    return {
      categoryTypeOptions: [
        { key: "true", display_name: "激活" },
        { key: "false", display_name: "禁止" },
      ],
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"],
      },
      rules: {
        name: [
          { required: true, message: "请输入类别名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    changeEnabled(data, val) {
      debugger;
      console.log(data, val);
      this.$confirm(
        '此操作将 "' +
          this.dict.label.category_status[val] +
          '" ' +
          data.name +
          ", 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          crudCategory
            .edit(data)
            .then((res) => {
              this.crud.notify(
                this.dict.label.category_status[val] + "成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              );
            })
            .catch(() => {
              data.enabled = !data.enabled;
            });
        })
        .catch(() => {
          data.enabled = !data.enabled;
        });
    },

    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.enabled = form.enabled.toString();
    },
  },
};
</script>

