<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <div align="right" class="div-top">
            <el-button class="cancel" @click='goBackDoor()'>返回</el-button>
        </div>
        <!--操作区-->
        <div class="door-content">
            <div class="door-divLeft">
                <div style="padding: 5px;">
                    盒子状态区域&nbsp;&nbsp;&nbsp;<span style="color: red">最新上报时间:{{doorData.creationDate}}</span>
                </div>
                <div class="door-div">
                    <span>当前版本：{{doorData.deviceStateDetail.version}}</span><br/>
                    <span>CPU：{{doorData.deviceStateDetail.cpuStatus[0].usageRate}}%</span><br/>
                    <span>内存：{{doorData.deviceStateDetail.memoryStatus[0].percent}}%</span><br/>
                    <span>硬盘：{{doorData.deviceStateDetail.diskStatus[0].percent}}%</span><br/>
                </div>
            </div>
            <div class="door-divRight">
                <div style="padding: 5px;">
                    场景设备状态区&nbsp;&nbsp;&nbsp;<span style="color: red">最新上报时间:{{doorData.creationDate}}</span>
                </div>
                <div v-if="doorData.deviceStateDetail.scene != null" >
                    <div class="door-div" v-for="doorD in doorData.deviceStateDetail.scene">
                        <span>AI盒子IP：{{doorD.aiServerIp}}</span><br/>
                        <span>场景设备IP：{{doorD.sensingDeviceIp}}</span><br/>
                        <span>控制设备IP：{{doorD.controlDeviceIp}}</span><br/>
                        <span>是否在线：
                            <span v-if="doorD.mqtt == null">没有设备</span>
                            <span v-if="doorD.mqtt == true">在线</span>
                            <span v-if="doorD.mqtt == false">掉线</span><br/>
                        </span>
                        <span>摄像头：
                            <span v-if="doorD.channelStatus == null">没有设备</span>
                            <span v-if="doorD.channelStatus == true">在线</span>
                            <span v-if="doorD.channelStatus == false">掉线</span><br/>
                        </span>
                        <span>控制器：
                            <span v-if="doorD.controlStatus == null">没有设备</span>
                            <span v-if="doorD.controlStatus == true">在线</span>
                            <span v-if="doorD.controlStatus == false">掉线</span><br/>
                        </span>
                    </div>
                </div>
                <div v-else>
                    <div class="door-div">
                        暂无数据...
                    </div>
                </div>
            </div>
            <div class="door-divLeft">
                <div style="padding: 25px 5px;">
                    盒子日志区&nbsp;&nbsp;&nbsp;<span style="color: red">最新上报时间:{{doorData.creationDate}}</span>
                </div>
                <div class="door-divLog">
                    <div style="margin:0px 0px 5px 600px;">
                        <el-select v-model="temp.errorType" @change="getLogData">
                            <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </div>
                    <div style="overflow: auto;height:150px;">
                        <div style="margin:10px" v-for="logD in logData">
                            <span v-if="logD.level=='error' || logD.level=='warn'" style="color:red">{{logD.creationDate}}&nbsp;&nbsp;{{logD.level}}:&nbsp;&nbsp;{{logD.subject}}&nbsp;&nbsp;{{logD.detail}}</span>
                            <span v-else>{{logD.creationDate}}&nbsp;&nbsp;&nbsp;&nbsp;{{logD.level}}:&nbsp;&nbsp;{{logD.subject}}&nbsp;{{logD.detail}}</span><br/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./DeviceEarlyWarningDetail.js"></script>
<style scoped src="./DeviceEarlyWarningDetail.scss"></style>