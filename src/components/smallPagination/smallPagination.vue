<template>

        <el-pagination @current-change="pageChange"
                       layout="prev, next, jumper,total"
                       small
                       :total="totalNum"
                       :page-size="pagesize">
        </el-pagination>

</template>

<script src="./smallPagination.js"></script>
<style scoped src="./smallPagination.scss"></style>