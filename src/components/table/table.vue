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
                label="活动名称"
                width="180">
        </el-table-column>
        <el-table-column
                prop="beginDate"
                label="开始时间"
                width="180">
        </el-table-column>
        <el-table-column
                prop="type"
                label="活动类型">
        </el-table-column>
        <el-table-column
                prop="creator"
                label="发布人">
        </el-table-column>
        <el-table-column
                prop="description"
                label="描述">
        </el-table-column>
        <el-table-column
                prop="type"
                label="类型">
        </el-table-column>
    </el-table>
</template>

<script src="./table.js"></script>
<style scoped src="./table.scss"></style>
