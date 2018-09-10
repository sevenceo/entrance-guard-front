<template>
    <div>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="back">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                返回
            </el-button>
            <!--<el-button class="btn btn-edit" type="primary" @click="onAssigningUsersFormVisible">-->
                <!--<svg class="icon icon-add1" aria-hidden="true">-->
                    <!--<use xlink:href="#icon-filter"></use>-->
                <!--</svg>-->
                <!--分配用户-->
            <!--</el-button>-->
        </div>
        <div>
            <!--表格-->
            <el-col :span="24">
                <el-table :data="alreadyAssignedTableData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="account" label="用户名"></el-table-column>
                    <el-table-column prop="userName" label="用户姓名"></el-table-column>
                    <el-table-column prop="mobile" label="手机号"></el-table-column>
                    <!--<el-table-column prop="description" label="角色名称">-->
                        <!--<template scope="scope">-->
                            <!--{{parentUser.name}}-->
                        <!--</template>-->

                    <!--</el-table-column>-->
                    <!--<el-table-column prop="corpName" label="角色对应企业"></el-table-column>-->
                    <el-table-column prop="orgName" label="角色对应组织"></el-table-column>

                    <!--<el-table-column prop="type" label="操作" align="center">-->
                        <!--<template scope="scope">-->
                            <!--<el-button type="default" title="删除" class="icon-btn delete"-->
                                       <!--@click="onDelete(scope.row)" size="small"-->
                                       <!--v-authority="'SystemConfig.SystemUser.Remove'">-->
                                <!--<svg class="icon" aria-hidden="true">-->
                                    <!--<use xlink:href="#icon-delete1"></use>-->
                                <!--</svg>-->
                            <!--</el-button>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                </el-table>
                <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            </el-col>
        </div>
        <div>
            <!--分配用户-->
            <el-dialog title="分配用户" :visible.sync="assigningUsersFormVisible">
                <div class="user-filter-container">
                    <el-button class="btn btn-add" @click="create" type="primary">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-filter"></use>
                        </svg>
                        保存
                    </el-button>
                    <el-button class="btn btn-edit" type="primary" @click="onSearch">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-filter"></use>
                        </svg>
                        筛选
                    </el-button>
                </div>
                <div>
                    <el-table :data="unassignedTableData"
                              @selection-change="handleSelectionChange"
                              border stripe style="width: 100%;min-height: 450px;" class="blue-table">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column prop="account" label="用户名"></el-table-column>
                        <el-table-column prop="userName" label="用户姓名"></el-table-column>
                        <el-table-column prop="mobile" label="手机号"></el-table-column>
                    </el-table>
                    <pagination ref="pages" :total="rowTotal1" v-on:pageChange="handleCurrentChange1"></pagination>
                </div>
                <div>
                    <!--筛选区-->
                    <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false"
                               :modal="false">
                        <el-form labelPosition="" :model="userQueryParameter" ref="userQueryParameter">

                            <!--<el-form-item label="角色名称">-->
                                <!--<el-input v-model="userQueryParameter.name" placeholder="角色名称"-->
                                          <!--:disabled="true"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="角色类型" rop="systemCode">-->
                                <!--<el-input v-model="userQueryParameter.typeName" placeholder="角色类型"-->
                                          <!--:disabled="true"></el-input>-->
                            <!--</el-form-item>-->
                            <el-form-item label="用户姓名">
                                <el-input v-model="userQueryParameter.userName" placeholder="用户姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <el-input v-model="userQueryParameter.mobile" placeholder="手机号"></el-input>
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
                </div>
            </el-dialog>
            <!--分配组织用户-->
            <el-dialog class="orgUserDialog" title="分配用户" :visible.sync="assigningOrgUsersFormVisible">
                <!--头部用户信息-->
                <el-col :span="24" style="padding:20px 0;">
                    <div style="display: inline-block;">
                        <strong>角色名称：</strong> {{parentUser.name}}，
                        <strong>用户类型：</strong>{{parentUser.roleType=='ORG'?'组织':(parentUser.roleType=='PLATFORM'?'平台':(parentUser.roleType=='CORP'?'企业':''))}}，
                        <strong>企业名称：</strong>{{parentUser.corpName}}
                    </div>
                    <div style="display: inline-block;float: right;">
                        <el-button class="btn btn-add" @click="create" type="primary">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-filter"></use>
                            </svg>
                            保存
                        </el-button>
                        <el-button class="btn btn-edit" type="primary" @click="onSearch">
                            <svg class="icon icon-add1" aria-hidden="true">
                                <use xlink:href="#icon-filter"></use>
                            </svg>
                            筛选
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="10">
                    <strong>组织</strong>
                    <!--<el-checkbox v-model="isIncludeChildren" label="是否及以下" border style="float: right;" v-if="orgList.length<=1"></el-checkbox>-->
                </el-col>
                <el-col :span="24">
                    <!--左侧树-->
                    <el-col :span="10">
                        <!--组织树-->
                        <!--<el-tree class="orgTree" v-if="assigningOrgUsersFormVisible"-->
                                 <!--:props="props"-->
                                 <!--:load="parentLoadNode"-->
                                 <!--lazy-->
                                 <!--@check-change="nodeCheckChange"-->
                                 <!--show-checkbox-->
                                 <!--:check-strictly="true"-->
                        <!--&gt;-->
                        <!--</el-tree>-->
                        <el-tree ref="treeLeft" :data="treeLeftData" :props="props"
                                 @check-change="nodeCheckChange"
                                 show-checkbox
                                ></el-tree>
                    </el-col>
                    <!--右侧列表-->
                    <el-col :span="14">
                        <div>
                            <el-table :data="unassignedTableData"
                                      @selection-change="handleSelectionChange"
                                      border stripe style="width: 100%;height: 482px;" class="blue-table">
                                <el-table-column
                                        type="selection"
                                        width="55">
                                </el-table-column>
                                <el-table-column prop="account" label="用户名"></el-table-column>
                                <el-table-column prop="userName" label="用户姓名"></el-table-column>
                                <el-table-column prop="mobile" label="手机号"></el-table-column>
                            </el-table>
                            <pagination ref="pages" :total="rowTotal1"
                                        v-on:pageChange="handleCurrentChange1"></pagination>
                        </div>
                        <div>
                            <!--筛选区-->
                            <el-dialog :visible.sync="searchFormVisible" class="search-dialog org-search-dialog"
                                       :show-close="false"
                                       :modal="false">
                                <el-form labelPosition="" :model="userQueryParameter" ref="userQueryParameter">

                                    <!--<el-form-item label="角色名称">-->
                                        <!--<el-input v-model="userQueryParameter.name" placeholder="角色名称"-->
                                                  <!--:disabled="true"></el-input>-->
                                    <!--</el-form-item>-->
                                    <!--<el-form-item label="角色类型" rop="systemCode">-->
                                        <!--<el-input v-model="userQueryParameter.typeName" placeholder="角色类型"-->
                                                  <!--:disabled="true"></el-input>-->
                                    <!--</el-form-item>-->
                                    <el-form-item label="用户姓名">
                                        <el-input v-model="userQueryParameter.userName" placeholder="用户姓名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号">
                                        <el-input v-model="userQueryParameter.mobile" placeholder="手机号"></el-input>
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
                        </div>
                    </el-col>
                </el-col>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./assigningUsers.js"></script>

<style scoped rel="stylesheet/scss" lang="scss">
    .user-filter-container {
        float: right;
        margin: 15px 0 10px;
        padding-bottom: 0;
    }

    .btn {
        width: auto;
    }

</style>
<style>
    .orgUserDialog .el-dialog {
        width: 900px;
        height: 700px;
        top: calc((100% - 700px) / 2);
    }

    .orgUserDialog .el-dialog__body {
        padding: 5px 20px;
    }

    .checkedOrgList {
        border: 1px solid #dde0e3;
        padding: 10px;
    }

    .org-filter {
        margin: 33px 0 10px !important;
    }

    .org-search-dialog .el-dialog {
        width: 300px !important;
        height: 500px !important;
    }

    .orgTree {
        height: 482px;
        overflow-y: auto;
    }
</style>