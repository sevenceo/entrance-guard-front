<template>
    <div>

        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
        </div>

        <!--<div style="width: 100%;">-->
        <!--<div>-->
        <!--<el-checkbox @change="checkCheck">全选</el-checkbox>-->
        <!--</div>-->
        <!--<div>-->
        <!--<el-checkbox-group-->
        <!--v-model="checkedItems"-->
        <!--&gt;-->
        <!--<el-checkbox @change="checkCheck" v-for="x in scenes" :label="x.sceneName"-->
        <!--:key="x.id"></el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</div>-->
        <!--</div>-->
        <div style="height: 60px;"></div>
        <div>
            <el-checkbox :indeterminate="isIndeterminate" :checked="checkAll" @change="checkCheckAll" v-model="checked">
                全选
            </el-checkbox>
            <div>
                <el-checkbox-group
                        v-model="checkedItems"
                >
                    <el-checkbox @change="checkCheck" v-for="x in scenes" :label="x.id"
                                 :key="x.id" :value="x.id" style="margin-left: 0px;!important;margin-right:15px;">
                        {{x.sceneName}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </div>

        <div class="dashboard-container wd100" style="text-align:center;">
            <div class="dataCard">
                <el-row class="cardList">

                    <el-col :span="12">
                        <div class="cl-show">
                            <label class="cl-fcount">{{countBySceneIds.historyOpenCount}}</label>
                            <span>累计开门数量</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="cl-show">
                            <label class="cl-fcount">{{countBySceneIds.historyCompareCount}}</label>
                            <span>累计人流量</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="el-table boundary">
            <div class="dashboard-container wd100">
                <div class="dealer-left">
                    <h3>历史统计</h3>
                </div>
                <div class="dealer-right">
                    <el-date-picker
                            v-model="newsTime"
                            type="daterange"
                            :picker-options="pickerOptions2"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width: auto;"
                            @change="getCountAndTimeBySceneIds"
                    >
                    </el-date-picker>
                </div>
                <div class="clear" style="height: 30px;"></div>

                <div id="newsEchart1" class="echart"></div>

                <div class="maintain_table_box">
                    <div>
                        <div class="dealer-left">
                            <h3>详细数据</h3>
                        </div>
                        <div class="dealer-right">

                            <el-button type="primary" @click="exportNewsTableData()"
                            >导出
                            </el-button>
                        </div>
                        <!--表格-->
                        <el-table :data="allReportData" border stripe style="width: 100%;" class="blue-table">
                            <el-table-column prop="time" label="日期">
                            </el-table-column>
                            <el-table-column prop="historyOpenCount" label="历史开门数">
                            </el-table-column>
                            <el-table-column prop="historyCompareCount" label="历史识别数">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="clear"></div>
                </div>


            </div>
        </div>
    </div>
</template>

<script src="./historyCount.js"></script>
<style scoped src="./dealerLog.scss"></style>

