<template>
    <div class="tabs-fix-container">
        <el-tree :data="catalogData" ref="fileTree" :props="defaultProps" @current-change="handleNodeChange" highlight-current></el-tree>
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script src="./catalog.js"></script>

<style link rel="stylesheet" href="./multimarkdown_default.css" scoped>
    .content{
        background-color: aliceblue;
    }
    .el-tree{
        width: 250px;
        position: absolute;
        top: 0;bottom: 0;
        overflow: auto;
    }
    .main-content{
        padding-left: 266px;
        left: 0;right: 0;
    }
</style>
