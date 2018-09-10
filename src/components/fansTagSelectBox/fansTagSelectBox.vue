<template>
    <div class="selectBox">
        <div class="inputs">
            <el-input v-model="pageParam.name" style="ime-mode:disabled" placeholder="请输入标签名(支持模糊查询)"></el-input>
            <el-button class="btn btn-edit search" @click="search" type="default">
            筛选
            </el-button>
        </div>

        <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
            <el-table-column
                    prop="name"
                    label="粉丝标签名称"
                    min-width="150"
                    class="name"

            >
            </el-table-column>
            <el-table-column prop="type" fixed="right" label="操作" align="center" width="80px">
                <template scope="scope">
                    <el-button type="default" title="选中" class="icon-btn el-icon-check"  @click="confirm(scope.row)" size="small" v-authority="'SystemConfig.SystemUser.Modify'">
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <!--翻页-->
        <pagination :total="totalPage" center="true" v-on:pageChange="handleCurrentChange"></pagination>
    </div>
</template>

<script src="./fansTagSelectBox.js">
</script>
<style scoped src="./fansTagSelectBox.scss">
</style>