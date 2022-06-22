<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="输入博客标题模糊搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />

        <el-select
          v-model="query.isOriginal"
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
          v-model="query.categoryId"
          size="small"
          placeholder="分类"
          style="width: 156px"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          class="filter-item"
          v-model="query.tagIds"
          multiple
          size="small"
          placeholder="标签"
          style="width: 400px"
        >
          <el-option
            v-for="item in tags"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="query.isPublish"
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
      :title="crud.status.title"
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
                  v-model="form.category.id"
                  size="small"
                  placeholder="请选择"
                  style="width: 156px"
                >
                  <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
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
                  @change="changeTag"
                  @remove-tag="deleteTag"
                >
                  <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
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
                  <el-radio label="0" border>下架</el-radio>
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
                <el-input v-model="form.articleSource"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="photo">
          <el-row>
            <el-col :span="12">
              <el-form-item label="标题图" style="width: 380px">
                <el-input v-model="form.titlePicture"></el-input>
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
      <el-table-column align="center" prop="photo" label="标题图">
        <img src="./demo.jpg" />
      </el-table-column>
      <el-table-column align="center" prop="title" label="标题" />
      <el-table-column align="center" prop="author" label="作者" />
      <el-table-column align="center" prop="isOriginal" label="是否原创">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOriginal == 1" type="success">原创</el-tag>
          <el-tag v-if="scope.row.isOriginal == 0" type="info">转载</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="category" label="分类">
        <template slot-scope="scope">
          <div>{{ scope.row.category.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="tags" label="标签">
        <template slot-scope="scope">
          <template>
            <el-tag
              style="margin-left: 3px; margin-bottom: 3px"
              type="warning"
              :key="index"
              v-for="(item, index) in scope.row.tags"
              >{{ item.name }}</el-tag
            >
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="clickCount" label="点击数" />
      <el-table-column align="center" prop="isPublish" label="发布状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isPublish == 1" type="success">发布</el-tag>
          <el-tag v-if="scope.row.isPublish == 0" type="info">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" />
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
              :loading="crud.status.cu === 2"
              size="mini"
              :type="scope.row.isPublish == 0 ? 'success' : 'warning'"
              @click="changeRelease(scope.row)"
            >
              <svg-icon
                :icon-class="scope.row.isPublish == 0 ? 'fabu' : 'xiajia'"
                class-name="is-publish-svg-icon"
              ></svg-icon>
            </el-button>
          </udOperation>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudBlog from "@/api/blog/blog";
import { isvalidPhone } from "@/utils/validate";
import { getAllTag } from "@/api/blog/tag";
import { getAllCategory } from "@/api/blog/category";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import DateRangePicker from "@/components/DateRangePicker";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import { mapGetters } from "vuex";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

let blogTags = []; //后台服务需要的格式

const defaultForm = {
  title: null,
  summary: null,
  isOriginal: "1",
  isPublish: "0",
  articleSource: null,
  author: null,
  category: { id: null },
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
      url: "api/blogs",
      page: {
        // 页码
        page: 0,
        // 每页数据条数
        size: 7,
        // 总数据条数
        total: 0,
      },
      crudMethod: { ...crudBlog },
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ["original_status", "publish_status"],
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
      categories: [],
      tags: [],
      tagDatas: [], //数组格式，不是后台服务需要的格式
      level: 3,
      defaultProps: { children: "children", label: "name", isLeaf: "leaf" },
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"],
      },
      originalTypeOptions: [
        { key: "1", display_name: "原创" },
        { key: "0", display_name: "转载" },
      ],
      publishTypeOptions: [
        { key: "1", display_name: "发布" },
        { key: "0", display_name: "下架" },
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
        // content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
      },
    };
  },

  computed: {
    ...mapGetters(["blog"]),
  },
  methods: {
    changeTag(value) {
      blogTags = [];
      value.forEach(function (data, index) {
        const tag = { id: data };
        blogTags.push(tag);
      });
    },
    deleteTag(value) {
      blogTags.forEach(function (data, index) {
        if (data.id === value) {
          blogTags.splice(index, value);
        }
      });
    },
    getCategories() {
      getAllCategory()
        .then((res) => {
          this.categories = res.content;
        })
        .catch(() => {});
    },
    getTags() {
      getAllTag()
        .then((res) => {
          this.tags = res.content;
        })
        .catch(() => {});
    },
    changeRelease(data) {
      const isPublish = data.isPublish == "1" ? "0" : "1";
      const id = data.id;
      const title = data.title;
      crudBlog
        .changeRelease({ id, isPublish })
        .then(() => {
          this.crud.toQuery();
          isPublish == "1"
            ? this.crud.notify(
                title + " 发布成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              )
            : this.crud.notify(
                title + " 下架成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              );
        })
        .catch(() => {
          isPublish == "1"
            ? this.crud.notify(
                title + " 发布失败",
                CRUD.NOTIFICATION_TYPE.ERROR
              )
            : this.crud.notify(
                title + " 下架失败",
                CRUD.NOTIFICATION_TYPE.ERROR
              );
        });
    },

    [CRUD.HOOK.beforeRefresh]() {
      this.getTags();
      this.getCategories();
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.tagDatas = [];
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.tagDatas = []; //前台显示的
      blogTags = []; //传给后台的
      const _this = this;
      form.tags.forEach(function (tag, index) {
        _this.tagDatas.push(tag.id);
        const rol = { id: tag.id };
        blogTags.push(rol);
      });
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      debugger;
      if (!crud.form.category.id) {
        this.$message({
          message: "博客类型不能为空",
          type: "warning",
        });
        return false;
      } else if (this.tagDatas.length === 0) {
        this.$message({
          message: "博客标签不能为空",
          type: "warning",
        });
        return false;
      }
      crud.form.tags = blogTags; //tagDatas不是后台需要的类型，需要将tagDatas转化为blogTags再传给后台
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  object-fit: cover;
  vertical-align: top;
  width: 130px;
  height: 70px;
}
el-radio-group .el-radio {
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
  .cancel-icon {
    position: absolute;
    right: 10px;
    top: 0px;
    z-index: 999;
    color: #4158d0;
    font-size: 10px;
    cursor: pointer;
  }
}
.img-icon {
  font-size: 50px;
}

.is-publish-svg-icon {
  width: 10px;
  height: 10px;
}
</style>
