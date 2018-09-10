<template>


    <el-row>
        <el-col :span="24">
            <breadcrumb></breadcrumb>
            <div class="user-filter-container">
                <el-button class="btn btn-add" type="primary" @click="" v-authority="'Resource.Create'" style="width:140px;">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    下载消息模板
                </el-button>
                <el-button class="btn btn-add" type="primary" @click="" v-authority="'Resource.Create'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    导入
                </el-button>
                <el-button class="btn btn-edit" type="primary" @click="" style="width:140px;"
                           v-authority="'Resource.Create'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                    批量添加消息
                </el-button>
            </div>
        </el-col>
        <el-col :span="6">
            <div>
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <el-tree class="communityTreeFY"
                         :data="treeData"
                         :props="props"
                         :filter-node-method="filterNode"
                         @node-click="nodeClick"
                         ref="tree2"
                >
                </el-tree>
            </div>
        </el-col>
        <el-col :span="18">
            <div>
                <div>
                    <!--表格-->
                    <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                              @selection-change="handleSelectionChange">
                        <el-table-column prop="humanName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="phoneNum" label="手机号">
                        </el-table-column>
                        <el-table-column prop="resourceName" label="资源名称">
                        </el-table-column>
                        <el-table-column prop="resourceTypeName" label="资源类型">
                        </el-table-column>
                    </el-table>
                    <!--翻页-->
                    <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
                    <!--dialog编辑区-->
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script src="./UserMessage.js"></script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .add_img_list {
        float: left;
        width: 3.893333333333333rem;
        height: 3.893333333333333rem;
        position: relative;
        padding: 0.213333rem;
        box-sizing: border-box;
    }

    .add_img_list .map_loading {
        margin-top: -120px;
        margin-left: 247px;
        width: 148px;
        text-align: center;
        color: #333;
        font-size: 1.554667rem;
        color: #0c0f09;
        border: none;
    }

    .communityTreeFY {
    }

    .communityTreeFY .is-current > .el-tree-node__content {
        background-color: #E4E8F1 !important;
    }

    .audit-header {
        padding: 20px 0px;
    }

</style>
