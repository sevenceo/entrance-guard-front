<template>
    <div>
        <div class="user-filter-container">
            <!--查询条件-->
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'AUTH_ROLE_ADD'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'AUTH_ROLE_SEARCH'">
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
                    <el-table-column prop="corpName" label="企业"></el-table-column>
                    <el-table-column prop="code" label="角色编码"></el-table-column>
                    <el-table-column prop="name" label="角色名称"></el-table-column>
                    <el-table-column prop="roleType" label="角色类型">
                        <template scope="scope">
                            {{temp.roleTypes[scope.row.roleType]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="角色描述"></el-table-column>

                    <el-table-column prop="type" label="操作" align="center" width="260">
                        <template scope="scope">
                            <el-button type="default" title="编辑" class="icon-btn edit"
                                       @click="onEdit(scope.row)" size="small"
                                       v-authority="'AUTH_ROLE_EDIT'">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </el-button>
                            <el-button type="default" title="分配权限" class="icon-btn edit"
                                       @click="onAssigningAuthFormVisible(scope.row)" size="small"
                                       v-authority="'AUTH_ROLE_AUTHORITY'">
                                分配权限 <i class="el-icon-setting"></i>
                            </el-button>
                            <!-- v-if="parentUser.roleType != 'PLATFORM' && scope.row.roleType != 'ORG'"-->
                            <el-button type="default" title="查看用户" class="icon-btn edit"
                                       @click="onUsersFormVisible(scope.row)" size="small"
                                       v-authority="'AUTH_ROLE_USERS'">
                                查看用户<i class="el-icon-setting"></i>
                            </el-button>
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onDelete(scope.row)" size="small" v-authority="'AUTH_ROLE_DELETE'">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
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
                    <el-form-item label="角色编码" rop="systemCode">
                        <el-input v-model="queryParameter.code" placeholder="角色编码" :maxlength=50></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称">
                        <el-input v-model="queryParameter.name" placeholder="角色名称" :maxlength=30></el-input>
                    </el-form-item>
                    <el-form-item label="角色类型">
                        <el-select class="filter-item" v-model="queryParameter.roleType"
                                   placeholder="请选择角色类型">
                            <el-option v-if="currentUser.roleType!='ORG'" key="-1" label="全部" value=""></el-option>
                            <el-option v-if="currentUser.roleType=='PLATFORM'" key="PLATFORM" label="平台"
                                       value="PLATFORM"></el-option>
                            <el-option v-if="currentUser.roleType!='ORG'" key="CORP" label="企业"
                                       value="CORP"></el-option>
                            <el-option key="ORG" label="组织" value="ORG"></el-option>
                            <!--<el-option v-for="item in  queryParameter.roleTypes" :key="item.value" :label="item.label"-->
                            <!--:value="item.value">-->
                        </el-select>
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
                        <!--<el-form-item label="所属系统" prop="systemId">-->
                        <!--<el-select class="filter-item" v-model="temp.systemId" :disabled="dialogStatus != 'create'"-->
                        <!--placeholder="请选择所属系统">-->
                        <!--<el-option v-for="item in  temp.systems" :key="item.id" :label="item.name"-->
                        <!--:value="item.id">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="角色编码" prop="code">-->
                        <!--<el-input v-model="temp.code" placeholder="角色编码"></el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="所属企业" prop="corpCode"
                                      v-if="temp.roleType=='CORP'  && currentUser.roleType == 'PLATFORM' ">
                            <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="temp.corpCode"
                                    :fetch-suggestions="querySearchAsync"
                                    :readonly="true"
                                    readonly="readonly"
                                    placeholder="所属企业" @select="handleSelect">
                                <!--<template slot-scope="props">-->
                                <!--<div class="name">{{ props.item.value }}</div>-->
                                <!--<span class="addr">{{ props.item.address }}</span>-->
                                <!--</template>-->
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model="temp.name" placeholder="角色名称" :maxlength=30></el-input>
                        </el-form-item>
                        <el-form-item label="角色类型" prop="roleType">
                            <el-select class="filter-item" v-model="temp.roleType"
                                       @change="getParentRole"
                                       :disabled="dialogStatus != 'create'"
                                       placeholder="请选择角色类型">
                                <el-option v-for="item in  queryParameter.roleTypes" :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-input v-else v-model="showOtherMsg.roleTypeName"/>-->
                        </el-form-item>
                        <el-form-item label="上级角色" prop="parentId">
                            <el-select v-if="dialogStatus === 'create' " class="filter-item" v-model="temp.parentId"
                                       :disabled="dialogStatus != 'create'"
                                       placeholder="请选择上级角色">
                                <el-option v-for="item in  queryParameter.parentRoles" :key="item.id"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-input v-else v-model="allRolesMsg[temp.parentId]" :disabled="true"/>
                        </el-form-item>
                        <el-form-item label="角色描述" class="organizationId" prop="description">
                            <el-input v-model="temp.description"
                                      type="textarea"
                                      :rows="2"
                                      placeholder="请输入内容" :maxlength=20>
                            </el-input>

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

                    <el-input v-model="queryParameter.leftTreeFilterText"
                              @change="leftTreeSearch" placeholder="请输入搜索内容"></el-input>
                    <el-tree show-checkbox ref="treeLeft" :data="treeLeftData" :props="props"
                             :default-expand-all="false"
                             :filter-node-method="filterNode"
                             node-key="id"
                             @check-change="handleLeftTreeCheckChange"
                             @node-click="nodeClick"></el-tree>

                </el-col>
                <el-col :span="2">
                    <div style="position: absolute; top: 50%; transform: translateY(-50%);padding: 0 2px;">
                        <el-button class="btn btn-edit" size="mini" type="primary" title="全部左移" @click="moveAllToLeft">
                            <i
                                    class="el-icon-d-arrow-left"></i></el-button>
                        <br/>
                        <el-button class="btn btn-edit" size="mini" type="primary" title="左移" @click="moveToLeft"><i
                                class="el-icon-arrow-left"></i></el-button>
                        <br/>
                        <el-button class="btn btn-edit" size="mini" type="primary" title="右移" @click="moveToRight"><i
                                class="el-icon-arrow-right"></i></el-button>
                        <br/>
                        <el-button class="btn btn-edit" size="mini" type="primary" title="全部右移"
                                   @click="moveAllToRight"><i class="el-icon-d-arrow-right"></i></el-button>
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
        </div>
    </div>
</template>
<script src="./role.js"></script>

<style scoped rel="stylesheet/scss" lang="scss">
    .user-filter-container {
        float: right;
        margin: 15px 0 10px;
        padding-bottom: 0;
    }

    .btn {
        width: auto;
    }

    .el-col-11, .el-col-2 {
        height: 500px;
    }

    .el-tree {
        height: 450px;
        overflow: auto;
    }
</style>