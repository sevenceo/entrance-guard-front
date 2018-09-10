<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="filter-container dataRport">
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>

        <div>
            <div class="dashboard-container wd100" style="text-align:center;">
                <div class="chartRoom">
                    <!--<h5>菜单点击次数</h5>-->
                    <div id="fansAdd" class="chartShow">
                    </div>
                </div>

            </div>
        </div>

        <div class="fans-filter-container">
            <el-button class="btn btn-add" type="primary" @click="exportAllScans()" v-authority="'Fans.export'" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                导出
            </el-button>
        </div>

        <el-table :data="listData" border stripe style="width: 100%" class="blue-table">
            <el-table-column width="200px" prop="openId" label="openId">
            </el-table-column>
            <el-table-column prop="account" label="公众号">
            </el-table-column>
            <el-table-column prop="nickName" label="昵称">
            </el-table-column>
            <el-table-column prop="sex" label="性别">
            </el-table-column>
            <el-table-column prop="province" label="省份">
            </el-table-column>
            <el-table-column prop="city" label="城市">
            </el-table-column>
            <el-table-column prop="isSubscribe" label="关注状态">
            </el-table-column>
            <el-table-column prop="subscribeTime" label="关注时间">
            </el-table-column>
            <el-table-column prop="unsubscribeTime" label="取关时间">
            </el-table-column>
            <el-table-column prop="lastActionTime" label="最近活动时间">
            </el-table-column>
            <el-table-column prop="nickName" label="真实姓名">
            </el-table-column>
            <el-table-column prop="headImgUrl" label="头像路径">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column prop="unionId" label="unionId">
            </el-table-column>
        </el-table>

        <!--翻页-->
        <pagination :total="totalPage2" ref="pages" v-on:pageChange="handleCurrentChange"></pagination>

        <!--筛选区-->

        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form v-model="param">
                <el-form-item label="组织机构">
                    <el-button style="width: 70%" v-model="param.accounts" @click="getOrg"><span>{{selectedAccountName}}</span></el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" @click="reset" type="default">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" @click="search" type="default">
                    筛选
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择组织机构" :visible.sync="orgVisible" class="tree-dialog" :show-close="true" :modal="true">
            <el-table :data="tableData" class="filter-table" border stripe style="width: 100%">
                <el-table-column prop="orgName" label="组织机构" width="200">
                </el-table-column>
                <el-table-column label="公众号" align="center">
                    <template scope="scope">
                        <el-table :data="scope.row.accountInfos" :ref="scope.row.orgId" class="inner-table"
                                    @selection-change="handleSelectionChange" highlight-current-row style="width: 100%">
                        <el-table-column prop="account">
                            </el-table-column>
                            <el-table-column prop="accountName">
                            </el-table-column>
                            <el-table-column
                                    type="selection"
                                    width="55">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div slot="footer" class="dialog-footer">
                <el-button class="btn btn-edit search" @click="confirmAccounts" type="default">
                    确定
                </el-button>
            </div>-->
        </el-dialog>
    </div>
</template>

<script src="./qr-code-report.js">

</script>

<style src="../css/report.scss" scoped>

</style>