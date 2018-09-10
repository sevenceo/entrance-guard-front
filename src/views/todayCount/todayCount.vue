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
        <div style="position: relative">
            <span style="position: absolute;right: 0;top:0;cursor: pointer;color:blue" @click="isExpand=!isExpand"  v-text="!isExpand?'展开↓':'收起↑'"></span>
            <el-checkbox :indeterminate="isIndeterminate" :checked="checkAll" @change="checkCheckAll" v-model="checked">
                全选
            </el-checkbox>
            <div :class="isExpand?'':'cgClose'">
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
                    <el-col :span="6">
                        <div class="cl-show">
                            <label class="cl-fcount">{{countBySceneIds.todayOpenCount}}</label>
                            <span>今日开门数量</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="cl-show cl-line">
                            <label class="cl-fcount">{{countBySceneIds.todayCompareCount}}</label>
                            <span>今日人流量</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="cl-show">
                            <label class="cl-fcount">{{countBySceneIds.historyOpenCount}}</label>
                            <span>累计开门数量</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
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
                    <h3>今日统计</h3>
                </div>
                <div class="clear" style="height: 30px;"></div>

                <div id="newsEchart1" class="echart"></div>


            </div>
        </div>
    </div>
</template>

<script src="./todayCount.js"></script>
<style scoped src="./dealerLog.scss"></style>
<style>
    .cgClose{
        overflow: hidden;
        height: 20px;
    }
</style>

