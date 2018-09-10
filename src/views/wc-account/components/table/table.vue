<template>
    <el-table
            class="blue-table"
            :data="tableData"
            border
            stripe
            @selection-change="handleSelectionChange"
            style="width: 100%">
        <el-table-column
                type="selection"
                width="40">
        </el-table-column>
        <el-table-column label="头像" width="70">
            <template scope="scope">
                <img v-if="scope.row.headImgUrl" :src="scope.row.fullUrl" alt="" onerror="this.onerror=null;this.src='/static/img/replace.bbbb6a7.png'" class="head-img">
                <img v-else  src="~assets/replace.png" class="head-img">
            </template>
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
                prop="organizationName"
                label="组织架构">
        </el-table-column>
        
        <el-table-column
                prop="appId"
                label="应用编号">
        </el-table-column>
    </el-table>
</template>

<script src="./table.js"></script>
<style lang="scss" src="./table.scss"></style>
