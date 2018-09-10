<template>
    <el-row type="flex" class="mt-10" justify="center">
        <el-pagination @current-change="pageChange"
                layout="total, prev, pager, next, jumper"
                :total= "totalNum"
               :page-size="pagesize"
                :current-page.sync="currentPage">
        </el-pagination>
    </el-row>
</template>

<script src="./pagination.js"></script>
<style scoped src="./pagination.scss"></style>