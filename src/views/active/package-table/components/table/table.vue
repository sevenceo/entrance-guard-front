<template>
    <el-table
            :data="tableData"
            border
            stripe
            @selection-change="handleSelectionChange"
            style="width: 100%">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <!--<el-table-column align="center" label="ID" width="65">-->
            <!--<template scope="scope">-->
                <!--<span>{{scope.row.id}}</span>-->
            <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
                prop="name"
                label="公众号名称"
                width="180">
        </el-table-column>
        <el-table-column
                prop="account"
                label="公众号账号"
                width="180">
        </el-table-column>
        <el-table-column
                prop="organizationId"
                label="组织架构">
        </el-table-column>
        <el-table-column
                prop="headImgUrl"
                label="公众号头像地址">
        </el-table-column>
        <el-table-column
                prop="appId"
                label="应用编号">
        </el-table-column>
    </el-table>
</template>

<script src="./table.js"></script>
<style scoped src="./table.scss"></style>
