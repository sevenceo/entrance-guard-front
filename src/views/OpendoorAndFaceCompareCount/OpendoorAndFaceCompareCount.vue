<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
        </div>
        <div style="height: 60px;"></div>
        <div class="el-table boundary">
            <div class="dashboard-container wd100">
                <div class="maintain_table_box">
                    <div>
                        <div class="dealer-left" style="width: 35%">
                            <div style="display: flex;justify-content: space-between;align-items: center;width: 100%">
                                <div><h3>时间</h3></div>
                                <div><span class="spanColor" @click="getFormatDateCount(0.5,0,$event)" style="cursor: pointer" name="showColor">近30分钟</span></div>
                                <div><span @click="getFormatDateCount(1,0,$event)" style="cursor: pointer" name="showColor">近60分钟</span></div>
                                <div><span @click="getFormatDateCount(4,0,$event)" style="cursor: pointer" name="showColor">近4小时</span></div>
                                <div><span @click="getFormatDateCount(8,0,$event)" style="cursor: pointer" name="showColor">近8小时</span></div>
                                <div><span @click="getFormatDateCount(0,1,$event)" style="cursor: pointer" name="showColor">近1天</span></div>
                                <div><span @click="getFormatDateCount(0,2,$event)" style="cursor: pointer" name="showColor">近2天</span></div>
                            </div>
                        </div>
                        <div class="dealer-right">

                            <el-button type="primary" @click="exportExcel()"
                            >导出
                            </el-button>
                        </div>
                        <!--表格-->
                        <el-table :data="allReportData" border stripe style="width: 100%;" class="blue-table" @sort-change="changesort">
                            <!--<el-table-column prop="time" label="序号">
                            </el-table-column>-->
                            <el-table-column prop="corpName" label="企业">
                            </el-table-column>
                            <el-table-column prop="resourceName" label="小区">
                            </el-table-column>
                            <el-table-column prop="sceneName" label="场景">
                            </el-table-column>
                            <el-table-column prop="opendoorCountsInOneSceneLimitTime" label="开门数" sortable="custom">
                            </el-table-column>
                            <el-table-column prop="faceCompareCountsInOneSceneLimitTime" label="人流量" sortable="custom">
                            </el-table-column>
                            <el-table-column prop="opendoorCountsInOneScene" label="历史累计开门数">
                            </el-table-column>
                            <el-table-column prop="faceCompareCountsInOneScene" label="历史累计人流量">
                            </el-table-column>
                        </el-table>
                        <!--翻页-->
                        <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
                    </div>
                    <div class="clear"></div>
                </div>

                <div class="dealer-left">
                    <h3>数据统计</h3>
                </div>
                <div class="clear" style="height: 30px;"></div>

                <div id="newsEchart1" class="echart"></div>

            </div>
        </div>
    </div>
</template>

<script src="./OpendoorAndFaceCompareCount.js"></script>
<style scoped src="./dealerLog.scss"></style>
<style>
    .spanColor{
        color: red;
    }
</style>

