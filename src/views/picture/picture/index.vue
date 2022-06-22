<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          size="small"
          clearable
          placeholder="输入名称或者描述搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation :defaultQuery="{ categoryName: picCategory.name }" />
      </div>

      <crudOperation :permission="permission">
        <el-button
          slot="left"
          style="width: 100px"
          class="filter-item"
          type="info"
          icon="el-icon-refresh"
          size="mini"
          @click="checkAll()"
        >
          {{ checkedTitle }}
        </el-button>
      </crudOperation>
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
        <el-form-item label="图片名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片分类">
          <el-select
            v-model="form.picCategory.id"
            size="small"
            placeholder="请选择"
            style="width: 156px"
          >
            <el-option
              v-for="item in picCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片路径" prop="pictureUrl">
          <el-input v-model="form.pictureUrl" />
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
    <el-tabs
      v-model="activeName"
      tab-position="left"
      style="height: 634px; width: 100%"
      @tab-click="clickTab"
      type="border-card"
      v-loading="tabsLoading"
    >
      <el-tab-pane
        style="height: 800px; width: 100%; overflow: auto"
        v-for="(tabPicCategory, index) in tabPicCategories"
        :key="index"
      >
        <div v-if="tabPicCategory.name === undefined" slot="label">
          全部图片
        </div>
        <div slot="label">
          {{ tabPicCategory.name }}
        </div>
        <el-scrollbar>
          <el-row :key="tabPicCategory.name">
            <el-col
              v-for="picture in tabPicCategory.pictures"
              :key="picture.id"
              style="padding: 6px"
              :xs="3"
              :sm="3"
              :md="3"
              :lg="3"
              :xl="3"
            >
              <el-card :body-style="{ padding: '0px', textAlign: 'center' }">
                <input
                  style="position: absolute; z-index: 100"
                  type="checkbox"
                  :id="picture.id"
                  :checked="isChecked(picture)"
                  @click="checked(picture)"
                />
                <el-image
                  :src="picture.pictureUrl"
                  style="cursor: pointer"
                  fit="cover"
                  @click="showPicture(picture.pictureUrl)"
                />
                <div>
                  <span class="media-title" v-if="picture.name">{{
                    picture.name
                  }}</span>
                  <span class="media-title" v-else>图片 {{ index + 1 }}</span>
                </div>
                <div style="margin-bottom: 10px">
                  <el-button-group>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="复制图片地址"
                      placement="bottom-start"
                      style="margin-right: 2px"
                    >
                      <el-button
                        size="mini"
                        icon="el-icon-copy-document"
                        @click="copyUrl(picture.pictureUrl)"
                      />
                    </el-tooltip>

                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="复制Markdown格式图片地址"
                      placement="bottom-start"
                      style="margin-right: 2px"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-document-copy"
                        @click="
                          copyMarkdownUrl(
                            picture.pictureUrl,
                            picture.pictureUrl
                          )
                        "
                      >
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="删除图片"
                      placement="bottom-start"
                      style="margin-right: 2px"
                    >
                      <el-button
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="handleDelete(picture)"
                      />
                    </el-tooltip>
                  </el-button-group>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :visible.sync="dialogPictureVisible"
      fullscreen
      style="text-align: center"
    >
      <img :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudOperation from "@crud/CRUD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import { getAllCategory } from "@/api/picture/picCategory";
import { del } from "@/api/picture/picture";
import { copyText } from "@/utils/index";
import { initData } from "@/api/data";
import crudPicture from "@/api/picture/picture";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import Vue from "vue";
import RROperation from "../../../components/Crud/RR.operation.vue";

const defaultForm = {
  name: null,
  picCategory: { id: null },
  pictureUrl: null,
};
export default {
  name: "Picture",
  components: {
    rrOperation,
    crudOperation,
    pagination,
  },
  cruds() {
    return CRUD({
      title: "图片",
      url: "api/pictures",
      page: {
        // 页码
        page: 0,
        // 每页数据条数
        size: 24,
        // 总数据条数
        total: 0,
      },
      crudMethod: { ...crudPicture },
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      tabPicCategories: [{ id: 0, name: undefined }],
      picCategories: [], //所有图片分类列表
      picCategoryId: undefined, //当前选中的图片分类id
      picCategory: { id: 0, name: undefined }, //当前选中的图片分类
      pictures: [], //显示的图片列表
      activeName: 0, //tab激活的
      dialogPictureVisible: false,
      dialogImageUrl: "",
      permission: {
        add: ["admin", "category:add"],
        edit: ["admin", "category:edit"],
        del: ["admin", "category:del"],
      },
      checkedPictures: [], //选中的图片id集合
      delAllLoading: false,
      isCheckedAll: false,
      checkedTitle: "全选",
      tabsLoading: false,
      rules: {
        pictureUrl: [
          { required: true, message: "请输入图片路径", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    pictures(newPictures, oldPictures) {
      for (let i = 0; i < newPictures.length; i++) {
        var flag = this.checkedPictures.every(function (x) {
          return newPictures[i].id !== x.id;
        });
        if (flag) {
          this.isCheckedAll = false;
          this.checkedTitle = "全选";
          return;
        }
      }
      this.isCheckedAll = true;
      this.checkedTitle = "取消全选";
    },
    checkedPictures(newPictureIds, oldPictures) {
      let pictures = this.pictures;
      for (let i = 0; i < pictures.length; i++) {
        var flag = newPictureIds.every(function (x) {
          return pictures[i].id !== x.id;
        });
        if (flag) {
          this.isCheckedAll = false;
          this.checkedTitle = "全选";
          this.crud.selections = newPictureIds;
          debugger;
          return;
        }
      }
      this.isCheckedAll = true;
      this.checkedTitle = "取消全选";
      this.crud.selections = newPictureIds;
      debugger;
    },
  },
  created() {
    this.initPicCategoryList();
  },
  methods: {
    resetQuery() {
      this.checkedPictures = [];
      this.crud.resetQuery({ categoryName: this.picCategory.name });
    },
    checkAll() {
      let checkedPictures = this.checkedPictures;
      let pictures = this.pictures;
      debugger;
      if (this.isCheckedAll) {
        pictures.forEach(function (picture) {
          checkedPictures.forEach(function (checkedPicture, index) {
            if (picture.id == checkedPicture.id) {
              checkedPictures.splice(index, 1);
              debugger;
            }
          });
        });
      } else {
        pictures.forEach(function (picture) {
          let nonexistent = checkedPictures.every(function (checkedPicture) {
            return picture.id !== checkedPicture.id;
          });
          if (nonexistent) {
            checkedPictures.push(picture);
          }
        });
        // debugger;
      }
      console.log(this.checkedPictures);
    },
    isChecked: function (picture) {
      return this.checkedPictures.some((checkedPicture) => {
        return picture.id == checkedPicture.id;
      });
    },
    checked: function (data) {
      debugger;
      let index = undefined;
      this.checkedPictures.forEach((picture, i) => {
        if (picture.id == data.id) {
          index = i;
        }
      });
      if (index !== undefined) {
        this.checkedPictures.splice(index, 1);
      } else {
        this.checkedPictures.push(data);
      }
      console.log(this.checkedPictures);
    },
    showPicture: function (url) {
      this.dialogPictureVisible = true;
      this.dialogImageUrl = url;
    },
    handleDeleteBatch: function () {
      if (this.checkedPictures.length <= 0) {
        return;
      }
      this.$confirm("是否删除选中图片？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del(this.checkedPictures).then(() => {
            this.crud.delSuccessNotify();
            this.crud.toQuery();
          });
        })
        .catch(() => {});
    },

    //经过多次测试发现：
    //CRUD.HOOK.afterRefresh中this.picCategories[this.activeName].id和initPicCategoryList中that.picCategories = picCategories;
    //的执行顺序不可预测，所以只能
    //当CRUD.HOOK.afterRefresh中this.picCategories[this.activeName].id先执行则先使用默认的picCategories，进行Vue.set(this.picCategories, this.activeName, newObject);
    //后面initPicCategoryList中that.picCategories = picCategories;会获取picCategories再次执行Vue.set(this.picCategories, this.activeName, newObject);
    [CRUD.HOOK.afterRefresh]() {
      var newObject = {
        picCategoryId: this.tabPicCategories[this.activeName].id,
        name: this.tabPicCategories[this.activeName].name,
        pictures: this.crud.data,
      };
      this.pictures = this.crud.data;
      Vue.set(this.tabPicCategories, this.activeName, newObject);
      this.tabsLoading = false;
    },

    [CRUD.HOOK.afterReset]() {
      this.checkedPictures = [];
    },
    [CRUD.HOOK.afterDelete]() {
      this.checkedPictures = [];
    },
    //提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      debugger;
      if (crud.form.picCategory.id === null) {
        this.$message({
          message: "图片分类不能为空",
          type: "warning",
        });
        return false;
      }
      return true;
    },

    initPicCategoryList: function () {
      this.tabsLoading = true;
      debugger;
      var _this = this;
      getAllCategory("api/picCategories").then(function (response) {
        debugger;
        _this.tabPicCategories = _this.tabPicCategories.concat(
          response.content
        );
        _this.picCategories = response.content;
        _this.tabsLoading = false;
      });
    },
    clickTab() {
      debugger;
      this.tabsLoading = true;
      let picCategory = this.tabPicCategories[this.activeName];
      this.picCategory = picCategory;
      this.picCategoryId = picCategory.id;
      this.crud.query.categoryName = picCategory.name;
      debugger;
      this.crud.toQuery();
    },

    copyUrl(url) {
      copyText(url);
    },
    copyMarkdownUrl(name, url) {
      const text = "![" + name + "](" + url + ")";
      copyText(text);
    },
    handleDelete(picture) {
      debugger;
      this.$confirm("是否删除选中图片？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del([picture.id]).then(() => {
            this.crud.delSuccessNotify();
            this.crud.toQuery();
          });
          let idIndex = this.checkedPictures.indexOf(picture.id);
          if (idIndex >= 0) {
            this.checkedPictures.splice(idIndex, 1);
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.media-title {
  color: #8492a6;
  font-size: 14px;
  padding: 3px;
  display: inline-block;
  white-space: nowrap;
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-image {
  width: 100%;
  height: 118px;
}
</style>
