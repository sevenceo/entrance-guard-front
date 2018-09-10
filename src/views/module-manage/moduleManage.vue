<!--&lt;!&ndash; 引入样式 &ndash;&gt;-->
<!--<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">-->

<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <!--查询条件-->
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'AUTH_MODULE_ADD'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'AUTH_MODULE_QUERY'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div>
            <el-col :span="24">
                <!--左侧树结构-->
                <el-col :span="6">
                    <el-tree
                            :data="treeData"
                            :props="props"
                            :load="loadNode"
                            lazy
                            @node-click="nodeClick"
                    >
                    </el-tree>
                </el-col>
                <!--右侧列表-->
                <el-col :span="18">
                    <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                        <el-table-column prop="code" label="模块编码"></el-table-column>
                        <el-table-column prop="name" label="模块名称"></el-table-column>
                        <el-table-column prop="displayIndex" label="排序号"></el-table-column>
                        <el-table-column prop="type" label="模块类型">
                            <template scope="scope">
                                {{tableShowType[scope.row.type]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" label="模块描述"></el-table-column>

                        <el-table-column prop="type" label="操作" align="center" width="130">
                            <template scope="scope">
                                <el-button type="default" title="编辑" class="icon-btn edit"
                                           @click="onEdit(scope.row)" size="small"
                                           v-authority="'AUTH_MODULE_EDIT'">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-edit1"></use>
                                    </svg>
                                </el-button>
                                <el-button type="default" title="删除" class="icon-btn delete"
                                           @click="onDelete(scope.row)" size="small" v-authority="'AUTH_MODULE_DELETE'">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-delete1"></use>
                                    </svg>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange1"></pagination>
                </el-col>
            </el-col>
        </div>
        <div>
            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form labelPosition="" :model="temp" ref="temp">
                    <el-form-item label="所属微服务" rop="systemCode">
                        <el-select class="filter-item" v-model="qSystemCode"
                                   @change="changeModule"
                                   placeholder="请选择状态">
                            <el-option v-for="item in  moduleList" :key="item.id" :label="item.name"
                                       :value="item.systemCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模块编码">
                        <el-input v-model="temp.code" placeholder="所属系统"></el-input>
                    </el-form-item>
                    <el-form-item label="模块名称">
                        <el-input v-model="temp.name" placeholder="模块名称"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-reset reset" @click="reset" type="default">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" type="default" @click="doSearch">
                        筛选
                    </el-button>
                </div>
            </el-dialog>
            <!--新增-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="所属微服务" rop="systemCode">
                            <el-select class="filter-item" v-model="temp.systemCode" @change="parentModuleChange"
                                       placeholder="请选择状态">
                                <el-option v-for="item in  moduleList" :key="item.id" :label="item.name"
                                           :value="item.systemCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模块编码" prop="code">
                            <el-input v-model="temp.code" placeholder="模块编码" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="模块名称" prop="name">
                            <el-input v-model="temp.name" placeholder="模块名称"></el-input>
                        </el-form-item>
                        <el-form-item label="父模块" prop="addParentName">
                            <el-input v-model="temp.addParentName" placeholder="父模块" :readonly="true"
                                      @focus="showParentTree"></el-input>
                            <template v-if="parentTree">
                                <div style="position: absolute;width: 100%;height: 200px;z-index:999;overflow:auto;background-color: white;">
                                    <button @click="parentTree=false"> 关闭</button>
                                    <el-tree
                                            :data="parentTreeData"
                                            :props="props"
                                            :load="parentLoadNode"
                                            lazy
                                            @node-click="parentNodeClick"
                                    >
                                    </el-tree>
                                </div>
                            </template>
                        </el-form-item>
                        <el-form-item label="模块类型" prop="type">
                            <template>
                                <el-select v-model="temp.type" placeholder="请选择">
                                    <el-option
                                            v-for="item in types"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item label="模块路径" class="organizationId" prop="url">
                            <el-input v-model="temp.url" placeholder="模块路径"></el-input>
                        </el-form-item>
                        <el-form-item label="模块LOGO" prop="logo">
                            <el-input v-model="temp.logo" placeholder="模块LOGO"></el-input>
                        </el-form-item>
                        <el-form-item label="排序号" prop="displayIndex">
                            <el-input v-model="temp.displayIndex" placeholder="排序号"></el-input>
                        </el-form-item>
                        <el-form-item label="模块描述" prop="description">
                            <el-input v-model="temp.description"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('form')"
                               @click="update('form')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<!-- 引入组件库 -->
<!--<script src="https://unpkg.com/element-ui/lib/index.js"></script>-->
<script src="./moduleManage.js"></script>

<style scoped rel="stylesheet/scss" lang="scss">
    .user-filter-container {
        float: right;
        margin: 15px 0 10px;
        padding-bottom: 0;
    }
</style>