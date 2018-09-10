<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->
        <div class="account-filter-container">
            <el-button class="btn btn-add" type="primary" @click="$router.push('new-role')" v-authority="'SystemConfig.UserRole.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <!--<el-button class="btn" type="primary" @click="onEdit" v-authority="'ROLE_ADMIN'" style="background: #f4a75b">-->
            <!--<svg class="icon icon-edit1" aria-hidden="true">-->
            <!--<use xlink:href="#icon-edit1"></use>-->
            <!--</svg>-->
            <!--编辑-->
            <!--</el-button>-->

        </div>
        <!--内容区-->

        <el-table :data="tableData" border stripe style="width: 100%;" class="blue-table">
            <el-table-column
                    prop="name"
                    label="角色名称"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="摘要"
            >
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="id"-->
                    <!--label="ID"-->
            <!--&gt;-->
            <!--</el-table-column>-->
            <el-table-column prop="type" label="操作" align="center" width="80">
                <template scope="scope">
                    <router-link :to="'edit-role/' + scope.row.id" v-authority="'SystemConfig.UserRole.Modify'">
                            <el-button class="icon-btn edit" type="default" size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-edit1"></use>
                                </svg>
                            </el-button>
                    </router-link>

                    <el-button class="icon-btn delete" size="small" type="default" @click="handleDelete(scope.row.id)" v-authority="'SystemConfig.UserRole.Remove'">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-delete1"></use>
                        </svg>
                    </el-button>
                </template>
            </el-table-column>


        </el-table>

        <!--分页-->
        <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination>
    </div>
</template>


<script src="./rolesManage.js"></script>
<style scoped src="./rolesManage.scss" lang="scss" >

</style>