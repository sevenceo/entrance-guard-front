<template>
    <div class="changeAccountWeb">
        <h4>请先选择您的公众号</h4>
        
        <div class="treeContent">
            <!--内容区-->
            <change-account @changeAid="setAid"></change-account>
        </div>
        
        <!--分页-->
        <!-- <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination> -->
    </div>
</template>

<script src="./wcChange.js"></script>
<style scoped src="./wcChange.scss"></style>
