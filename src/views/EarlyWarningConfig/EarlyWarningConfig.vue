<template>
    <el-row :gutter="20">
        <el-col :span="24">
            <breadcrumb></breadcrumb>
        </el-col>
        <el-col :span="24">
            <el-col :span="12">
                <div>
                    <el-input
                            placeholder="请输入邮箱"
                            v-model="email">
                    </el-input>
                </div>
                <div style="margin-top: 5px;text-align: right">
                    <!--<el-button class="btn-delete" type="danger" @click="deleteEmail()">-->
                    <!--删除-->
                    <!--</el-button>-->

                    <el-button v-if="updateFlag" type="primary" class="update"
                               @click="updateEmailSave()">
                        修改
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @click="addEmail()">
                        新增
                    </el-button>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <table class="table">
                        <th style="width: 70%">邮箱</th>
                        <th style="width: 25%">操作</th>
                        <tr v-for="(item,index) in emailList" @click="selectEmail(index)" :id="'tr'+index">
                            <td style="text-align: center">{{item}}</td>
                            <td style="text-align: center"><a @click="updateEmail(index)">修改</a>&nbsp;
                                &nbsp;&nbsp;&nbsp;<a @click="deleteEmail(index)">删除</a></td>
                        </tr>
                    </table>
                </div>
            </el-col>
        </el-col>

        <el-col :span="24">
            <div style="width: 100%;height:12px;"></div>
        </el-col>
        <el-col :span="24">
            <el-col :span="12">
                <div style="background-color: white;width:100%;padding: 6px 8px;">
                    <h3>开门预警</h3>
                    <el-form class="small-space" label-position="left" label-width="160px"
                             style='margin-left:20px;'
                             :model="opendoorEarlyWarningTemp"
                             ref="opendoorForm"
                             :rules="rules">
                        <el-form-item label="开关">
                            <el-radio v-model="opendoorEarlyWarningTemp.opendoorFlag" label="1">开</el-radio>
                            <el-radio v-model="opendoorEarlyWarningTemp.opendoorFlag" label="0">关</el-radio>
                        </el-form-item>
                        <div v-if="opendoorEarlyWarningTemp.opendoorFlag == 1">

                            <el-form-item label="轮循时间" prop="opendoorRotationTime">
                                <el-input v-model="opendoorEarlyWarningTemp.opendoorRotationTime"
                                          placeholder="请输入轮循时间" style="width: 200px;"></el-input>
                                <el-select v-model="opendoorEarlyWarningTemp.rotationTimeType" placeholder="请选择"
                                           style="width: 60px;">
                                    <el-option
                                            v-for="item in timeSelection"
                                            :key="item.label"
                                            :label="item.value"
                                            :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="红色报警时间" prop="redWarningTime">
                                <el-input v-model="opendoorEarlyWarningTemp.redWarningTime"
                                          placeholder="请输入红色报警时间" style="width: 200px;"></el-input>
                                <el-select v-model="opendoorEarlyWarningTemp.redWarningTimeType" placeholder="请选择"
                                           style="width: 60px;">
                                    <el-option
                                            v-for="item in timeSelection"
                                            :key="item.label"
                                            :label="item.value"
                                            :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="橙色报警时间" prop="orangeWarningTime">
                                <el-input v-model="opendoorEarlyWarningTemp.orangeWarningTime"
                                          placeholder="请输入橙色报警时间" style="width: 200px;"></el-input>
                                <el-select v-model="opendoorEarlyWarningTemp.orangeWarningTimeType" placeholder="请选择"
                                           style="width: 60px;">
                                    <el-option
                                            v-for="item in timeSelection"
                                            :key="item.label"
                                            :label="item.value"
                                            :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="黄色报警时间" prop="yellowWarningTime">
                                <el-input v-model="opendoorEarlyWarningTemp.yellowWarningTime"
                                          placeholder="请输入黄色报警时间" style="width: 200px;"></el-input>
                                <el-select v-model="opendoorEarlyWarningTemp.yellowWarningTimeType" placeholder="请选择"
                                           style="width: 60px;">
                                    <el-option
                                            v-for="item in timeSelection"
                                            :key="item.label"
                                            :label="item.value"
                                            :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12">
                <div style="background-color: white;width:100%;padding: 6px 8px;">
                    <h3>设备预警</h3>
                    <el-form class="small-space" label-position="left" label-width="160px"
                             style='margin:0 20px;'
                             :model="deviceEarlyWarningTemp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="开关">
                            <el-radio v-model="deviceEarlyWarningTemp.deviceFlag" label="1">开</el-radio>
                            <el-radio v-model="deviceEarlyWarningTemp.deviceFlag" label="0">关</el-radio>
                        </el-form-item>
                        <div v-if="deviceEarlyWarningTemp.deviceFlag == 1">

                            <el-form-item label="轮循时间" prop="deviceRotationTime">
                                <el-input v-model="deviceEarlyWarningTemp.deviceRotationTime"
                                          placeholder="请输入轮循时间" style="width: 200px;"></el-input>
                                <el-select v-model="deviceEarlyWarningTemp.rotationTimeType" placeholder="请选择"
                                           style="width: 60px;">
                                    <el-option
                                            v-for="item in timeSelection"
                                            :key="item.label"
                                            :label="item.value"
                                            :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <div style="padding-left:12px;border: 1px solid #bfcbd9;border-radius: 4px;">
                                <h5>红色报警</h5>
                                <div style="padding-left: 20px;">
                                    <el-form-item label="CPU（报警阈值）" prop="redCPUWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.redCPUWarning"
                                                  placeholder="请输入CPU（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                    <el-form-item label="硬盘（报警阈值）" prop="redDiskWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.redDiskWarning"
                                                  placeholder="请输入硬盘（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                    <el-form-item label="内存（报警阈值）" prop="redRAMWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.redRAMWarning"
                                                  placeholder="请输入内存（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                </div>
                            </div>
                            <div style="padding-left:12px;border: 1px solid #bfcbd9;border-radius: 4px;margin-top: 6px">
                                <h5>橙色报警</h5>
                                <div style="padding-left: 20px;">
                                    <el-form-item label="CPU（报警阈值）" prop="orangeCPUWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.orangeCPUWarning"
                                                  placeholder="请输入CPU（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                    <el-form-item label="硬盘（报警阈值）" prop="orangeDiskWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.orangeDiskWarning"
                                                  placeholder="请输入硬盘（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                    <el-form-item label="内存（报警阈值）" prop="orangeRAMWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.orangeRAMWarning"
                                                  placeholder="请输入内存（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                </div>
                            </div>
                            <div style="padding-left:12px;border: 1px solid #bfcbd9;border-radius: 4px;margin: 6px 0">
                                <h5>黄色报警</h5>
                                <div style="padding-left: 20px;">
                                    <el-form-item label="CPU（报警阈值）" prop="yellowCPUWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.yellowCPUWarning"
                                                  placeholder="请输入CPU（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                    <el-form-item label="硬盘（报警阈值）" prop="yellowDiskWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.yellowDiskWarning"
                                                  placeholder="请输入硬盘（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                    <el-form-item label="内存（报警阈值）" prop="yellowRAMWarning">
                                        <el-input v-model="deviceEarlyWarningTemp.yellowRAMWarning"
                                                  placeholder="请输入内存（报警阈值）" style="width: 200px;"></el-input>
                                        %
                                    </el-form-item>
                                </div>
                            </div>
                            <el-form-item label="最大上报延时时间" prop="delayedTime">
                                <el-input v-model="deviceEarlyWarningTemp.delayedTime"
                                          placeholder="请输入最大上报延时时间" style="width: 200px;"></el-input>
                                秒
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </el-col>

        </el-col>
        <el-col :span="24">
            <div style="text-align: center;margin-top: 12px;height: 50px;">
                <el-button @click="" class="cancel">取 消</el-button>
                <el-button type="primary" class="update"
                           @click="save()">
                    确 定
                </el-button>
            </div>
        </el-col>

    </el-row>


</template>
<script src="./EarlyWarningConfig.js"></script>
<style>
    .table {
        max-height: 100px;
        background-color: white;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        width: 100%;
        padding: 2px 4px;
    }

    .table tr:hover {
        background-color: #FAFAFA;
        cursor: pointer;
    }

    .table th {
        background-color: #EEF1F6;
        height: 32px;
        line-height: 32px;
    }

    .table tr {
        height: 32px;
        line-height: 32px;
    }

    table tr:nth-child(odd) {
        background-color: #FAFAFA;
    }

    table tr:nth-child(even) {
        background-color: #fff;
    }

    a:hover {
        color: #66ccff;
    }

    .checked {
        background-color: #20a1ff;
    }
</style>
