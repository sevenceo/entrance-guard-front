<template>
    <div>

        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
        </div>
        <div style="height: 60px;"></div>

        <div class="dashboard-container wd100" style="text-align:center;">
            <div class="dataCard">
                <el-row class="cardList">
                    <el-col :span="1">
                        <div class="cl-show">
                            <label class="cl-fcount"></label>
                            <span></span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="cl-show">
                            <label class="cl-fcount">{{echartsCount.overlayNum}}</label>
                            <span>当前覆盖小区数</span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="cl-show">
                            <label class="cl-fcount">{{echartsCount.userNum}}</label>
                            <span>当前用户总数</span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="cl-show">
                            <label class="cl-fcount">{{echartsCount.faceNum}}</label>
                            <span>人脸数</span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="cl-show">
                            <label class="cl-fcount">{{echartsCount.faceRate}}</label>
                            <span>人脸录入率</span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="cl-show">
                            <label class="cl-fcount">{{echartsCount.sluiceNum}}</label>
                            <span>闸机数量</span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="cl-show">
                            <label class="cl-fcount">{{echartsCount.openingNum}}</label>
                            <span>开门次数</span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="cl-show">
                            <label class="cl-fcount">{{echartsCount.recognitionNum}}</label>
                            <span>人流量</span>
                        </div>
                    </el-col>
                    <el-col :span="1">
                        <div class="cl-show">
                            <label class="cl-fcount"></label>
                            <span></span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="el-table boundary">
            <div class="dashboard-container wd100">
                <div class="clear" style="height: 30px;"></div>

                <div id="newsEchart1" class="echart"></div>

                <el-card class="box-card side">
                    <div class="text item">
                        <span>{{resourceCount.resourceName}}</span>
                        <table border="1px" class="card-table" >
                            <tr>
                                <td>
                                    <span>今日开门次数：</span>
                                    <span>{{resourceCount.todayOpenNum}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>累计开门次数：</span>
                                    <span>{{resourceCount.allOpenNum}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>今日人流量：</span>
                                    <span>{{resourceCount.todayRecognitionNum}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>累计人流量：</span>
                                    <span>{{resourceCount.allRecognitionNum}}</span>
                                </td>
                            </tr>
                        </table>
                        <table border="1px" class="card-table" >
                            <tr>
                                <td>
                                    <span>cpu：</span>
                                    <span>{{doorData.cpu}}%</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>内存：</span>
                                    <span>{{doorData.memory}}%</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>硬盘：</span>
                                    <span>{{doorData.disk}}%</span>
                                </td>
                            </tr>
                        </table>
                        <table class="card-table" v-if = "skipbtn">
                            <tr>
                                <td>
                                    <a class="a" @click="skip('todayCount/')">查看今日统计</a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a @click="skip('historyCount/')" class="a">查看历史统计</a>
                                </td>
                            </tr>
                            <!--<tr>
                                <td>
                                    <a @click="skip('screen')" class="a">查看设备详情</a>
                                </td>
                            </tr>-->
                            <tr>
                                <el-table :data="tableData"  @row-click="alert">
                                    <el-table-column prop="sceneName" label="场景">
                                    </el-table-column>
                                </el-table>
                            </tr>
                        </table>
                    </div>
                </el-card>

            </div>
        </div>
    </div>
</template>
<script src="./mapCount.js"></script>
<style scoped src="./mapCount.scss"></style>

