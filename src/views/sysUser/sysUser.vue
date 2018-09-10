<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <!--查询条件-->
            <el-button class="btn btn-add" type="primary" @click="onAdd">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-col :span="24">
                <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="account" label="用户名"></el-table-column>
                    <el-table-column prop="userName" label="用户姓名"></el-table-column>
                    <el-table-column prop="mobile" label="手机号"></el-table-column>
                    <el-table-column prop="corpName" label="所属企业">
                    </el-table-column>
                    <el-table-column prop="userClass" label="用户类型">
                        <template scope="scope">
                            {{queryParameter.userClassNameArr[scope.row.userClass]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="enabledFlag" label="状态">
                        <template scope="scope">
                            {{scope.row.enabledFlag==0 ? '禁用':'启用'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="backendUserFlag" label="是否后台用户">
                        <template scope="scope">
                            {{scope.row.backendUserFlag==0 ? '否':'是'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="操作" align="center" width="400">
                        <template scope="scope">
                            <el-button type="default" title="编辑" class="icon-btn edit"
                                       @click="onEdit(scope.row)" size="small"
                                       v-authority="'SystemConfig.SystemUser.Modify'">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </el-button>
                            <el-button type="default" title="分配角色" class="icon-btn edit"
                                       @click="onAssigningRoleFormVisible(scope.row)" size="small"
                                       v-authority="'SystemConfig.SystemUser.Modify'">
                                分配角色 <i class="el-icon-setting"></i>
                            </el-button>
                            <el-button v-if="scope.row.enabledFlag == '0' "
                                       type="default"
                                       class="icon-btn edit"
                                       size="small"
                                       @click="updateEnabledFlag(scope.row,1)">
                                启用<i class="el-icon-setting"></i>
                            </el-button>
                            <el-button v-else type="default"
                                       class="icon-btn edit"
                                       size="small"
                                       @click="updateEnabledFlag(scope.row,0)">
                                禁用<i class="el-icon-setting"></i>
                            </el-button>

                            <el-button type="default" title="重置密码" class="icon-btn edit"
                                       @click="resetPassword(scope.row.id)" size="small"
                                       v-authority="'SystemConfig.SystemUser.Modify'">
                                重置密码<i class="el-icon-setting"></i>
                            </el-button>
                            <el-button type="default" title="关联组织" class="icon-btn edit"
                                       @click="onresourceallocation(scope.row)" size="small"
                                       v-authority="'SystemConfig.SystemUser.Modify'">
                                关联组织<i class="el-icon-setting"></i>
                            </el-button>
                            <el-button type="default" title="分配资源" class="icon-btn edit"
                                       @click="onResourceRoleFormVisible(scope.row.id)" size="small"
                                       v-authority="'SystemConfig.SystemUser.Modify'">
                                分配资源<i class="el-icon-setting"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange1"></pagination>
            </el-col>
        </div>
        <div>
            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form labelPosition="" :model="queryParameter" ref="queryParameter">
                    <el-form-item label="用户名" rop="account">
                        <el-input v-model="queryParameter.account" placeholder="用户名" maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="用户姓名">
                        <el-input v-model="queryParameter.userName" placeholder="用户姓名" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="queryParameter.mobile" placeholder="手机号" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" rop="enabledFlag">
                        <el-select class="filter-item" v-model="queryParameter.enabledFlag" placeholder="请选择状态">
                            <el-option key="-1" label="所有" value=""></el-option>
                            <!--<el-option key="1" label="启用"  value="1"> </el-option>-->
                            <!--<el-option key="0" label="禁用"  value="0"> </el-option>-->
                            <el-option v-for="item in  queryParameter.enabledFlags" :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="所属企业">
                        <el-input v-model="queryParameter.corpName" placeholder="所属企业" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属组织">
                        <el-input v-model="queryParameter.corpNameId" placeholder="所属组织"></el-input>
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
            <!--新增  编辑-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="用户名" prop="account">
                            <el-input v-model="temp.account" placeholder="用户名" maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="用户姓名" prop="userName">
                            <el-input v-model="temp.userName" placeholder="角色名称" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="所属企业" prop="corpName">
                            <!--<el-input v-model="queryParameter.corpName" :disabled="true" placeholder="所属企业"></el-input>-->
                            <el-input v-model="queryParameter.corpName" placeholder="所属企业"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="mobile">
                            <el-input v-model="temp.mobile" placeholder="手机号码" maxlength="11"></el-input>
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
            <!--分配权限-->
            <el-dialog class="dialogForm" title="分配权限" :visible.sync="assigningAuthFormVisible">
                <el-col :span="24">
                    <el-button class="btn btn-add" type="primary" @click="updateAuth"
                               style="float: right;margin-bottom: 5px;">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        提交
                    </el-button>
                </el-col>
                <el-col :span="11">
                    <!--<el-tree-->
                    <!--:data="treeLeftData"-->
                    <!--:props="props"-->
                    <!--:load="loadLeftNode"-->
                    <!--show-checkbox-->
                    <!--ref="treeLeft"-->
                    <!--node-key="id"-->

                    <!--@node-click="nodeClick"-->
                    <!--&gt;</el-tree>-->
                    <el-input v-model="queryParameter.leftTreeFilterText"
                              @change="leftTreeSearch" placeholder="请输入搜索内容"></el-input>
                    <el-tree show-checkbox ref="treeLeft" :data="treeLeftData" :props="props"
                             default-expand-all
                             :filter-node-method="filterNode"
                             @check-change="handleLeftTreeCheckChange"
                             @node-click="nodeClick"></el-tree>

                </el-col>
                <el-col :span="2">
                    <div style="position: absolute; top: 50%; transform: translateY(-50%);padding: 0 2px;">
                        <el-button class="btn btn-edit" size="mini" type="primary" title="全部左移"><i
                                class="el-icon-d-arrow-left"></i></el-button>
                        <br/>
                        <el-button class="btn btn-edit" size="mini" type="primary" title="左移"><i
                                class="el-icon-arrow-left"></i></el-button>
                        <br/>
                        <el-button class="btn btn-edit" size="mini" type="primary" title="右移" @click="moveToRight"><i
                                class="el-icon-arrow-right"></i></el-button>
                        <br/>
                        <el-button class="btn btn-edit" size="mini" type="primary" title="全部右移"
                                   @click="allToall('jstreeData')"><i class="el-icon-d-arrow-right"></i></el-button>
                    </div>
                </el-col>

                <el-col :span="11">
                    <el-input v-model="queryParameter.rightTreeFilterText"
                              @change="rightTreeSearch"
                              placeholder="请输入搜索内容"></el-input>
                    <el-tree show-checkbox ref="treeRight" :data="treeRightData" :props="props"
                             :filter-node-method="filterNode"></el-tree>
                </el-col>
            </el-dialog>
            <!--分配角色-->
            <el-dialog class="dialogForm" title="关联角色" :visible.sync="assigningRoleFormVisible">

                <!--查询条件-->
                <el-row>
                    <el-col :span="24">
                        <div class="user-filter-container">
                            <el-button class="btn btn-add" type="primary" @click="saveRole">
                                <svg class="icon icon-add1" aria-hidden="true">
                                    <use xlink:href="#icon-add1"></use>
                                </svg>
                                保存
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div style="max-height: 500px;overflow-y: auto; overflow-x: hidden;">
                            <div v-for="(value,index) in roles">
                                <el-row :gutter="20">
                                    <el-col :span="9" style="padding-top: 10px;">
                                        角色类型
                                        <el-select placeholder="角色类型" v-model="temp.roleTypes[index]"
                                                   @change="getByRoleType(index)">
                                            <el-option v-for="roleType in queryParameter.roleTypes"
                                                       :key="roleType.value"
                                                       :label="roleType.name" :value="roleType.value"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="9" style="padding-top: 10px;">
                                        角色名称
                                        <el-select placeholder="角色名称" v-model="temp.roleIds[index]">
                                            <el-option v-for="roleId in roleIds" :key="roleId.id" :label="roleId.name"
                                                       :value="roleId.id"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6" style="padding-top: 10px;">
                                        <el-button class="btn btn-reset reset" @click="addRole(index)" type="default"
                                                   style="margin-top: 20px;">
                                            添加
                                        </el-button>
                                        <el-button class="btn btn-edit search" @click="removeRole(index)"
                                                   type="default">
                                            删除
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-dialog>

            <!--分配资源-->
            <el-dialog class="dialogForm" title="关联资源" :visible.sync="resourceRoleFormVisible">
                <el-row>
                    <!--<el-col :span="24">
                        <div style="max-height: 500px;overflow-y: auto; overflow-x: hidden;">
                            <template>
                                <el-select v-model="value5" multiple placeholder="请选择" style="width:100%;">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </div>
                    </el-col>-->
                    <el-tree
                            ref="tree"
                            :data="data2"
                            show-checkbox
                            node-key="id"
                            :props="defaultProps">
                    </el-tree>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="user-filter-container">
                            <el-button class="btn btn-add" type="primary" @click="saveResource">
                                <svg class="icon icon-add1" aria-hidden="true">
                                    <use xlink:href="#icon-add1"></use>
                                </svg>
                                保存
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./sysUser.js"></script>

<style scoped rel="stylesheet/scss" lang="scss">
    .user-filter-container {
        float: right;
        margin: 15px 0 10px;
        padding-bottom: 0;
    }

    .btn {
        width: auto;
    }

    .el-tree {
        height: 450px;
        overflow: auto;
    }
</style>