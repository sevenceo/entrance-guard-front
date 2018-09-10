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
        <div class="dashboard-container wd100" style="text-align:center;">
            <div class="chartRoom">
                <!-- 	        	<h5>粉丝增长</h5> -->
                <div id="fansAdd" class="chartShow">
                </div>
            </div>
        </div>
        <el-date-picker
                v-model="value7"
                :clearable = "false"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change = "getFansDate"
                :picker-options="pickerOptions2">
        </el-date-picker>
        <div class="fans-filter-container">
            <!--<el-button class="btn btn-edit" type="primary" @click="onSearch2">-->
                <!--<svg class="icon icon-add1" aria-hidden="true">-->
                    <!--<use xlink:href="#icon-filter"></use>-->
                <!--</svg>-->
                <!--筛选-->
            <!--</el-button>-->
            <el-button class="btn btn-add" type="primary" @click="exportAllFans()">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                导出
            </el-button>
        </div>
        <el-table :data="listData" border stripe style="width: 100%" class="blue-table">
            <el-table-column width="200px" prop="reportDate" label="时间">
            </el-table-column>
            <el-table-column prop="unSubscribe" label="取消关注">
            </el-table-column>
            <el-table-column prop="netSubscribe" label="净增关注">
            </el-table-column>
            <el-table-column prop="subscribe" label="新增关注">
            </el-table-column>
            <el-table-column prop="fansCount" label="粉丝总数">
            </el-table-column>
        </el-table>
        <!--筛选区-->
        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form v-model="param">
                <el-form-item label="组织机构">
                    <el-button style="width: 70%" v-model="param.accounts" @click="getOrg"><span>{{selectedName}}</span></el-button>
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
        <!--筛选区(表格)-->
        <el-dialog :visible.sync="searchFormVisible2" class="search-dialog" :show-close="false" :modal="false">
            <el-form v-model="param">
                <!--<el-form-item label="组织机构">-->
                    <!--<el-button v-model="param.accounts" @click="getOrg">请选择组织机构</el-button>-->
                <!--</el-form-item>-->
                <el-form-item label="起始时间">
                    <el-date-picker
                            v-model="param.beginDate"
                            type="date" style="width: 100%"
                            placeholder="请选择关注起始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="param.endDate"
                            type="date" style="width: 100%"
                            placeholder="请选择关注结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" @click="reset" type="default">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" @click="search2" type="default">
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
        </el-dialog>


    </div>
</template>

<script src="./report.js"></script>
<style src="../css/report.scss" scoped>
</style>