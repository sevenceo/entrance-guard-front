<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click=""
                       style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click=""
                       style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click=""
                       style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div style="margin-top:35px;">
            <el-table border stripe style="width: 100%;" class="blue-table" ref="table">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="所属组织" prop="">
                </el-table-column>
                <el-table-column  label="有效期开始" prop="">
                </el-table-column>
                <el-table-column  label="有效期结束" prop="">
                </el-table-column>
                <el-table-column  label="设置人" prop="">
                </el-table-column>
                <el-table-column  label="操作" >
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit"
                                   @click="" size="small" >
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <!--<el-button type="default" title="停用" class="icon-btn delete" @click=""-->
                                   <!--v-if="scope.row.enabledFlag == 1" size="small">停用-->
                        <!--</el-button>-->
                        <!--<el-button type="default" title="启用" class="icon-btn delete" @click=""-->
                                   <!--v-if="scope.row.enabledFlag != 1" size="small">启用-->
                        <!--</el-button>-->
                        <el-button type="default" title="删除" class="icon-btn delete"
                                   @click="" size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange=""></pagination>
        </div>
    </div>
</template>

<script src="./AttenDanceMonth.js"></script>