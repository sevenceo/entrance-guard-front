<template>
    <div>
        <div class="user-filter-container">
            <!--查询条件-->
            <el-button class="btn btn-add" type="primary" @click="onAdd">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
        </div>
        <div>
            <el-col :span="24">
                <!--左侧树结构-->
                <el-col :span="6">
                    <el-input v-model="leftTreeFilterText"
                              @change="leftTreeSearch" placeholder="请输入搜索内容"></el-input>
                    <el-tree ref="treeLeft" :data="treeLeftData" :props="props"
                             default-expand-all
                             :filter-node-method="filterNode"
                             @node-click="nodeClick"></el-tree>
                </el-col>
                <!--右侧列表-->
                <el-col :span="18">
                    <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                        <el-table-column prop="orgName" label="组织名称"></el-table-column>
                        <el-table-column prop="code" label="组织编码"></el-table-column>
                        <el-table-column prop="parentName" label="上级组织"></el-table-column>
                        <el-table-column prop="corpName" label="所属企业"></el-table-column>
                        <el-table-column prop="type" label="操作" align="center" width="180">
                            <template scope="scope">
                                <el-button type="default" title="关联用户" class="icon-btn edit"
                                           @click="onUsersFormVisible(scope.row)" size="small"
                                           v-authority="'SystemConfig.SystemUser.Modify'">
                                    关联用户<i class="el-icon-setting"></i>
                                </el-button>
                                <el-button type="default" title="编辑" class="icon-btn edit"
                                           @click="onEdit(scope.row)" size="small"
                                           >
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-edit1"></use>
                                    </svg>
                                </el-button>
                                <el-button type="default" title="删除" class="icon-btn delete"
                                           @click="onDelete(scope.row)" size="small"
                                          >
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
            <!--新增-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">

                        <el-form-item v-if="dialogStatus === 'create' " label="所属企业" rop="corporationId">
                            <el-select v-model="temp.corporationId" rop="corporationId" placeholder="请选择">
                                <el-option v-for="corp in corpList"
                                           :key="corp.id"
                                           :label="corp.corpName" :value="corp.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-else label="所属企业" rop="corporationId">
                            <!--<el-input v-model="temp.corporationId" placeholder="所属企业" :disabled="true"></el-input>-->
                            <el-select v-model="temp.corporationId" rop="corporationId" placeholder="请选择">
                                <el-option :label="temp.corpName" :value="temp.corporationId"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="dialogStatus === 'create' " label="上级组织" prop="parentName">
                            <!--<el-input v-model="temp.parentName" placeholder="上级组织"></el-input>-->
                            <el-cascader
                                    v-model="queryParameter._parentIds"
                                    placeholder="上级组织"
                                    :options="orgOptions"
                                    filterable
                                    change-on-select
                                    @change="selectParentOrg"
                            ></el-cascader>
                        </el-form-item>

                        <el-form-item v-else label="上级组织" prop="parentName">
                            <el-input v-model="temp.parentName" placeholder="上级组织" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="组织名称" prop="orgName">
                            <el-input v-model="temp.orgName" placeholder="组织名称"></el-input>
                        </el-form-item>

                        <el-form-item v-if="dialogStatus === 'create'" label="组织编码" prop="addParentName">
                            <el-input v-model="temp.code" placeholder="组织编码" :readonly="true" ></el-input>
                        </el-form-item>
                        <el-form-item v-else label="组织编码" prop="addParentName">
                            <el-input v-model="temp.code" placeholder="组织编码" :disabled="true" ></el-input>
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
<script src="./saasOrganization.js"></script>

<style scoped rel="stylesheet/scss" lang="scss">
    .user-filter-container {
        float: right;
        margin: 15px 0 10px;
        padding-bottom: 0;
    }
</style>