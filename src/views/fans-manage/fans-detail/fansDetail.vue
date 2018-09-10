<template>
    <el-dialog class="dialogFans360Form" title="粉丝360" :visible.sync="showFans360Dialog" @close="resetForm">
        <el-tabs class="v-content" v-model="activeName" @tab-click="tabchange">
            <el-tab-pane label="基本信息" name="basicInfo" style="overflow: auto;max-height: 440px;">
                <el-row>
                    <el-col :span="4">
                        <div>
                            <img v-if="temp.headImgUrl" :src="temp.headImgUrl" width="100%">
                            <img v-else src="~assets/replace.png">
                        </div>
                    </el-col>
                    <el-col :span="20">
                        <div>
                            <!--dialog编辑区-->
                            <el-form class="small-space" label-position="left" label-width="100px"
                                     style='width: 400px; color:#666; margin-left:50px;'
                                     :model="temp"
                                     ref="userForm">
                                <el-form-item label="昵称：" prop="nickName">
                                    {{temp.nickName}}
                                    <!--<el-input v-model="temp.nickName" placeholder="请输入粉丝昵称"></el-input>-->
                                </el-form-item>
                                <el-form-item label="性别：" prop="gender">
                                    {{temp.gender}}
                                    <!--<el-input  v-model="temp.gender" placeholder="请选择性别"></el-input>-->
                                </el-form-item>
                                <el-form-item label="国家：" prop="country">
                                    {{temp.country}}
                                    <!--<el-input  v-model="temp.country" placeholder="请选择国家"></el-input>-->
                                </el-form-item>
                                <el-form-item label="省份：" prop="province">
                                    {{temp.province}}
                                    <!--<el-input  v-model="temp.province" placeholder="请选择省份"></el-input>-->
                                </el-form-item>
                                <el-form-item label="城市：" prop="city">
                                    {{temp.city}}
                                    <!--<el-input  v-model="temp.city" placeholder="请选择城市"></el-input>-->
                                </el-form-item>
                                <el-form-item label="语言：" prop="language">
                                    {{temp.language}}
                                    <!--<el-input  v-model="temp.language" placeholder="请选择语言"></el-input>-->
                                </el-form-item>
                                <el-form-item label="关注时间：" prop="subscribeTime">
                                    {{temp.subscribeTime}}
                                    <!--<el-input  v-model="temp.subscribeTime" placeholder="关注时间"></el-input>-->
                                </el-form-item>
                                <el-form-item label="取关时间：" prop="unsubscribeTime">
                                    {{temp.unsubscribeTime}}
                                    <!--<el-input  v-model="temp.unsubscribeTime" placeholder="关注时间"></el-input>-->
                                </el-form-item>
                                <el-form-item label="是否关注：">
                                    {{temp.isSubscribe}}
                                    <!--<el-input  v-model="temp.isSubscribe" placeholder="是否关注"></el-input>-->
                                </el-form-item>
                                <el-form-item label="标签：">
                                    <tag-tree :treeData = "treeData" :tags = "tags" v-on:treeTags="handTags"></tag-tree>
                                    <el-tag class="fansTag"
                                            type="success"
                                            v-for="tag in tags"
                                            :key="tag.tagName">
                                        {{tag.tagName}}
                                    </el-tag>
                                </el-form-item>

                            </el-form>
                        </div>

                    </el-col>
                </el-row>
            </el-tab-pane>
            <!--<el-tab-pane label="绑定资料"  :disabled="true">-->


            <!--</el-tab-pane>-->
            <el-tab-pane label="消息记录">
                <el-row class='h100'>
                    <el-col :span="24">
                        <div class="message">
                            <li v-for="message in messageList" :key="message.id"
                                :class="message.sendType=='10'?'an-move-left':'an-move-right'">
                                <p class="time"><span v-text="message.messageTime"></span></p>
                                <p class="time system" v-if="message.messageType==10000"><span
                                        v-html="message.content"></span></p>
                                <div :class="'main' + (message.sendType=='10'?'':' self')" v-else>
                                    <img class="avatar" width="45" height="45"
                                         :src="message.sendType=='10'? temp.headImgUrl: accountImg">
                                    <!-- 文本 -->
                                    <div class="text" v-if="message.messageType=='100'" v-html="message.content"></div>

                                    <!-- 图片 -->
                                    <div class="text" v-else-if="message.messageType=='101'" style="max-width: 50%">
                                        <el-tooltip content="图片" placement="top">
                                            <img style="width: 100%" v-if="message.medias.serverUrl"
                                                 :src="imageUrl+message.medias.serverUrl">
                                            <img v-else src="~assets/replace.png">
                                        </el-tooltip>
                                        <!--<img :src="message.media.picUrl" class="image" alt="聊天图片">-->
                                    </div>

                                    <!-- 语音 -->
                                    <div class="text" v-else-if="message.messageType=='102'">
                                        <audio class="audio" controls="controls"
                                               :src="mediaUrl + message.medias.serverUrl">
                                            <source :src="mediaUrl + message.medias.serverUrl">
                                        </audio>
                                    </div>

                                    <!-- 视频 -->
                                    <div class="text" v-else-if="message.messageType=='103'" style="max-width: 50%">
                                        <video height="192px" width="100%" :src="mediaUrl + message.medias.serverUrl"
                                               @click="showVideo(message.medias.serverUrl)"></video>
                                    </div>

                                    <!-- 链接 -->
                                    <div class="text" v-else-if="message.messageType=='107'" style="max-width: 50%;">
                                        <img style="width: 100%" v-if="message.medias.picUrl"
                                             :src="imageUrl+message.medias.picUrl">
                                        <img v-else src="~assets/replace.png">
                                        <a :href="message.medias.url"  target="_blank">
                                            <div style="border-top: 1px solid gray">
                                                <div style="float: left"> 阅读全文</div>
                                                <div style="float: right">></div>
                                            </div>
                                        </a>
                                    </div>
                                    <!-- 图文 -->
                                    <div class="text" v-else-if="message.messageType=='108'" style="max-width: 50%;">
                                        <el-tooltip content="图文" placement="top">
                                            <img style="width: 100%" v-if="message.medias.serverUrl"
                                                 :src="imageUrl+message.medias.serverUrl">
                                            <img v-else src="~assets/replace.png">
                                        </el-tooltip>

                                    </div>

                                    <!-- 卡券 -->
                                    <div class="text card-container" v-else-if="message.messageType=='300'">
                                        <div class="card-wrapper">
                                            <div class="card-body">
                                                <div class="card-img-container">
                                                    <img v-if="message.medias.picUrl"
                                                         :src="imageUrl+message.medias.picUrl">
                                                    <img v-else src="~assets/replace.png">
                                                </div>
                                                <div class="card-title">
                                                <span :title="message.medias.title">
                                                    {{message.medias.title}}
                                                </span>
                                                </div>
                                            </div>
                                            <div class="card-foot">
                                                <span>微信卡券</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 其他 -->
                                    <div class="text" v-else-if="message.messageType!='10000'">
                                        暂未支持的消息类型
                                    </div>
                                </div>
                            </li>
                        </div>
                        <pagination class="msg-page" :total="totalMSGPage"
                                    v-on:pageChange="handleCurrentChange2"></pagination>

                        <!--视频播放区-->
                        <el-dialog class="dialogForm" :visible.sync="videoDialogVisible" @close="stopPlay">
                            <video controls="controls" style="height: 500px" width="100%" :src="videoSrc">
                                您的浏览器不支持html5播放器，请升级浏览器或者使用chrome。
                                <source :src="videoSrc" type="video/mp4">
                            </video>
                        </el-dialog>
                    </el-col>
                </el-row>


            </el-tab-pane>

            <el-tab-pane label="交互记录" name="msgHistory">
                <div class="tab-filter-container">
                    <el-button class="btn btn-add" type="primary" @click="exportEvent()" >
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-wendang"></use>
                    </svg>
                        导出
                    </el-button>
                </div>
                <div class="t-sorll">
                    <el-table :data="tableData" height="410" border stripe style="width: 100%"
                              class="blue-table">
                        <el-table-column prop="eventTime" label="时间">
                        </el-table-column>
                        <el-table-column prop="eventType" label="类型">
                        </el-table-column>
                        <el-table-column prop="eventParms" label="摘要">
                        </el-table-column>
                    </el-table>
                </div>
                <pagination :total="totalPage" v-on:pageChange="handleCurrentChange1"></pagination>
            </el-tab-pane>
            <el-tab-pane label="粉丝轨迹" name="fansMap">
                <map-view :height="height"></map-view>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script src="./fansDetail.js"></script>
<style scoped src="./fansDetail.scss"></style>
<style scoped rel="stylesheet/scss" lang="scss">
    .message{
        // min-height:400px;
        // max-height: 600px;
        padding: 10px 15px;
        overflow-y: scroll;
        background-color: #F5F5F5;
        border:solid 1px #d5d5d5;
            position: absolute;
        left: 0;
        right: 0;
        bottom: 90px;
        top: 0;
    }
    .message li {
        margin-bottom: 15px;
        left:0;
        position: relative;
        display: block;
    }
    .message .time {
        margin: 10px 0;
        text-align: center;
    }

    .message .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: calc(100% - 75px);
        min-height: 35px;
        line-height: 2.1;
        font-size: 14px;
        padding: 3px 10px;
        text-align: left;
        word-break: break-all;
        background-color: #fff;
        color: #000;
        border-radius: 4px;
    }
    .message .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
        background: #fff;
    }
    .message .time>span {
        display: inline-block;
        padding: 4px 5px 2px;
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
        background-color: #ccc;
    }
    .message .system>span{
        padding: 4px 9px;
        text-align: left;
    }
    .message .text:before {
        content: " ";
        position: absolute;
        top: 9px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color: #fff;
    }
    .message .self {
        text-align: right;
    }
    .message .self .avatar {
        float: right;
        margin: 0 0 0 10px;
    }
    .message .self .text {
        background-color: #9EEA6A;
    }

    .message .self .text:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #9EEA6A;
    }
    .message .image{
        max-width: 200px;
    }
    img.static-emotion-gif, img.static-emotion {
        vertical-align: middle !important;
    }

    .an-move-left{
        left: 0;
        animation: moveLeft .7s ease;
        -webkit-animation:moveLeft .7s ease;
    }
    .an-move-right{
        left: 0;
        animation: moveRight .7s ease;
        -webkit-animation:moveRight .7s ease;
    }
    @keyframes moveRight{
        0%{left:-20px; opacity: 0};
    100%{left:0; opacity: 1}
    }

    @-webkit-keyframes moveRight
    {
        0%{left:-20px; opacity: 0};
    100%{left:0px; opacity: 1}
    }
    @keyframes moveLeft{
        0%{left:20px; opacity: 0};
    100%{left:0px; opacity: 1}
    }

    @-webkit-keyframes moveLeft
    {
        0%{left:20px; opacity: 0};
    100%{left:0px; opacity: 1}
    }
    .el-form-item {
        margin-bottom: 5px;
    }
    .v-content{
        border:solid 1px #c6cad6;
        position: absolute;
        top: 50px;
        bottom: 20px;
        right: 20px;
        left: 20px;
        overflow: hidden;

    }
    // .t-sorll{
    //     position: absolute;
    //     right: 0;
    //     left: 0;
    //     overflow-y: auto;
    //     top: 0;border:solid 1px #c8cbd0;
    // }
    .el-tab-pane{
        height:100%;
    }
    .msg-page{
        position:absolute;width:100%;bottom:52px;height:30px;
    }
    .fansTag{
        margin-right:5px;
    }
    // .el-table{
    //     border:none;
    // }
    .audio{
        max-width: 100%;
        max-height: 32px;
    }
</style>