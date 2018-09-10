<template>
    <el-breadcrumb class="app-levelbar" separator="/">
        <svg class="icon icon-location" aria-hidden="true">
            <use xlink:href="#icon-location1"></use>
        </svg>
        <el-breadcrumb-item v-for="(item,index)  in levelList" :key="index">
            <span v-if='item.redirect==="noredirect"||index==levelList.length-1' to="" class="no-redirect">{{item.meta.name}}</span>
            <span v-else :to="item.path">{{item.name}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script src="./breadcrumb.js"></script>
<style scoped src="./breadcrumb.scss"></style>