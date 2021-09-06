<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="输入博客名搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />

        <el-select
          v-model="query.enabled"
          clearable
          size="small"
          placeholder="是否原创"
          class="filter-item"
          style="width: 100px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in originalTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-select
          class="filter-item"
          clearable
          v-model="form.sort"
          size="small"
          placeholder="分类"
          style="width: 156px"
        >
          <el-option
            v-for="item in sorts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          class="filter-item"
          v-model="tagDatas"
          multiple
          size="small"
          placeholder="标签"
          style="width: 400px"
        >
          <el-option
            v-for="item in tags"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="query.enabled"
          clearable
          size="small"
          placeholder="发布状态"
          class="filter-item"
          style="width: 100px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in publishTypeOptions"
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
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      fullscreen
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="meta">
          <el-row>
            <el-col :span="15">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="简介">
                <el-input v-model="form.summary"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="分类">
                <el-select
                  v-model="form.sort"
                  size="small"
                  placeholder="请选择"
                  style="width: 156px"
                >
                  <el-option
                    v-for="item in sorts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="16">
              <el-form-item label="标签">
                <el-select
                  v-model="tagDatas"
                  multiple
                  size="small"
                  placeholder="请选择"
                  style="width: 400px"
                  filterable
                >
                  <el-option
                    v-for="item in tags"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <el-form-item label="是否原创" prop="isOriginal">
                <el-radio-group v-model="form.isOriginal" size="mini">
                  <el-radio label="1" border>原创</el-radio>
                  <el-radio label="0" border>转载</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否发布" prop="isPublish">
                <el-radio-group v-model="form.isPublish" size="mini">
                  <el-radio label="1" border>发布</el-radio>
                  <el-radio label="0" border>未发布</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item
                label="作者"
                v-if="form.isOriginal == 0"
                prop="author"
              >
                <el-input v-model="form.author"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="文章出处" v-if="form.isOriginal == 0">
                <el-input v-model="form.articlesPart"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="photo">
          <el-row>
            <el-col :span="12">
              <el-form-item label="标题图" style="width: 380px">
                <el-input v-model="form.articlesPart"></el-input>
                <div class="preview-box">
                  <div class="cancel-icon">
                    <svg-icon icon-class="cancel"></svg-icon>
                  </div>
                  <div class="img-preview"></div>
                  <div class="content">
                    <div class="img-icon">
                      <svg-icon icon-class="image"></svg-icon>
                    </div>
                    <div class="text">
                      Paste the image url above, <br />to see a preview or
                      download!
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row>
            <el-col :span="23">
              <el-form-item label="内容" prop="content">
                <mavon-editor ref="md"></mavon-editor>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="crud.cancelCU">取 消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确 认</el-button
        >
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="photo"
        label="标题图"
      >
        <img src="./demo.jpg" />
      </el-table-column>
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="title"
        label="标题"
      />

      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="author"
        label="作者"
      />
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="isOriginal"
        label="是否原创"
      >
        <el-tag type="success">原创</el-tag>
      </el-table-column>
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="sort"
        label="分类"
      />
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="tag"
        label="标签"
      >
        <el-tag type="success">标签</el-tag>
      </el-table-column>
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="clickCount"
        label="点击数"
      />
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="isPublish"
        label="发布状态"
      >
        <el-tag type="success">发布状态</el-tag>
      </el-table-column>
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        v-if="checkPer(['admin', 'user:edit', 'user:del'])"
        label="操作"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission">
            <el-button
              slot="left"
              v-permission="permission.edit"
              :loading="crud.status.cu === 2"
              size="mini"
              type="success"
              icon="el-icon-s-release"
              @click="crud.toEdit(data)"
            />
          </udOperation>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudBlog from "@/api/system/user";
import { isvalidPhone } from "@/utils/validate";
import { getDepts, getDeptSuperior } from "@/api/system/dept";
import { getAll, getLevel } from "@/api/system/role";
import { getAllJob } from "@/api/system/job";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import DateRangePicker from "@/components/DateRangePicker";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import { mapGetters } from "vuex";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

let userRoles = [];
let userJobs = [];
const defaultForm = {
  title: null,
  summary: null,
  isOriginal: "1",
  isPublish: "0",
  sorts: [],
  tags: [],
};
export default {
  name: "Blog",
  components: {
    crudOperation,
    rrOperation,
    udOperation,
    DateRangePicker,
    pagination,
  },
  cruds() {
    return CRUD({
      title: "博客",
      url: "api/users",
      crudMethod: { ...crudBlog },
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ["user_status"],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      sorts: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      tags: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      tagDatas: [],
      deptName: "",
      depts: [],
      deptDatas: [],
      jobs: [],
      level: 3,
      roles: [],
      jobDatas: [],
      roleDatas: [], // 多选时使用
      defaultProps: { children: "children", label: "name", isLeaf: "leaf" },
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"],
      },
      originalTypeOptions: [
        { key: "true", display_name: "原创" },
        { key: "false", display_name: "转载" },
      ],
      publishTypeOptions: [
        { key: "true", display_name: "已发布" },
        { key: "false", display_name: "未发布" },
      ],
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        isPublish: [
          { required: true, message: "发布字段不能为空", trigger: "blur" },
          { pattern: /^[0-9]\d*$/, message: "发布字段只能为自然数" },
        ],
        isOriginal: [
          { required: true, message: "原创字段不能为空", trigger: "blur" },
          { pattern: /^[0-9]\d*$/, message: "原创字段只能为自然数" },
        ],
        content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
      },
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      debugger;
      // this.getRoles();
      if (form.id == null) {
        // this.getDepts();
      } else {
        // this.getSupDepts(form.dept.id);
      }
      // this.getJobs();
      form.enabled = form.enabled.toString();
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      debugger;
      this.jobDatas = [];
      this.roleDatas = [];
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      debugger;
      console.log(this.form, "this.formthis.formthis.formthis.form");
      // this.getJobs(this.form.dept.id);
      this.jobDatas = [];
      this.roleDatas = [];
      userRoles = [];
      userJobs = [];
      const _this = this;
      form.roles.forEach(function(role, index) {
        _this.roleDatas.push(role.id);
        const rol = { id: role.id };
        userRoles.push(rol);
      });
      form.jobs.forEach(function(job, index) {
        _this.jobDatas.push(job.id);
        const data = { id: job.id };
        userJobs.push(data);
      });
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      debugger;
      if (!crud.form.dept.id) {
        this.$message({
          message: "部门不能为空",
          type: "warning",
        });
        return false;
      } else if (this.jobDatas.length === 0) {
        this.$message({
          message: "岗位不能为空",
          type: "warning",
        });
        return false;
      } else if (this.roleDatas.length === 0) {
        this.$message({
          message: "角色不能为空",
          type: "warning",
        });
        return false;
      }
      crud.form.roles = userRoles;
      crud.form.jobs = userJobs;
      return true;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
img {
  object-fit: cover;
  vertical-align: top;
  width: 130px;
  height: 70px;
}
.el-radio {
  margin-right: 0;
}
.el-dialog__body {
  padding: 0;
}
.preview-box {
  margin-top: 10px;
  position: relative;
  width: 260px;
  height: 140px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px dashed #c2cdda;
}
.img-icon {
  font-size: 50px;
}
.preview-box.imgActive {
  border: 2px solid transparent;
}

.preview-box .cancel-icon {
  position: absolute;
  right: 10px;
  top: 0px;
  z-index: 999;
  color: #4158d0;
  font-size: 10px;
  cursor: pointer;
}
</style>
