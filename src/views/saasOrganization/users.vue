<template>
    <div>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="back">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                返回
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onAssigningUsersFormVisible">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                关联用户
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-col :span="24">
                <el-table :data="alreadyAssignedTableData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="account" label="用户名"></el-table-column>
                    <el-table-column prop="userName" label="用户姓名"></el-table-column>
                    <el-table-column prop="mobile" label="手机号"></el-table-column>
                    <el-table-column prop="orgName" label="所属组织">
                    </el-table-column>
                    <el-table-column prop="type" label="操作" align="center">
                        <template scope="scope">
                            <el-button type="default" title="删除" class="icon-btn delete"
                                       @click="onDelete(scope.row)" size="small"
                                       v-authority="'SystemConfig.SystemUser.Remove'">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            </el-col>
        </div>
        <div>
            <!--分配用户-->
            <el-dialog title="关联" :visible.sync="assigningUsersFormVisible"
                       @close="resetForm">
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
                    <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                        <el-form labelPosition="" :model="userQueryParameter" ref="userQueryParameter">

                            <el-form-item label="用户姓名">
                                <el-input v-model="userQueryParameter.account" placeholder="用户姓名"></el-input>
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
        </div>
    </div>
</template>
<script src="./users.js"></script>

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