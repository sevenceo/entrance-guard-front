<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="fans-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>

        <!--表格-->
        <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
            <el-table-column prop="headImage" width="70px" label="头像">
                <template scope="scope">
                    <img v-if="scope.row.headImgUrl" :src="scope.row.headImgUrl"
                         onerror="this.onerror=null;this.src='/static/img/replace.bbbb6a7.png'" class="head-img">
                    <img v-else src="~assets/replace.png" class="head-img">
                </template>
            </el-table-column>
            <el-table-column prop="nickName" label="昵称">
                <template scope="scope">
                    <div class="text" v-html="scope.row.nickName"></div>
                </template>
            </el-table-column>
            <el-table-column prop="context" label="消息摘要">
                <template scope="scope">
                    <div class="text" v-html="scope.row.context"></div>
                </template>
            </el-table-column>
            <el-table-column prop="acceptMsgCount" label="接收消息数量">
            </el-table-column>
            <el-table-column prop="newMsgCount" label="未回复消息数量">
            </el-table-column>
            <el-table-column prop="updateTime" label="最后更新时间">
            </el-table-column>
            <el-table-column prop="type" label="操作" align="center" width="80">
                <template scope="scope">
                    <el-button type="default" class="icon-btn edit" title="查看" @click="onShow(scope.row)" size="small"
                               v-authority="'Server.Reply'">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-nshu"></use>
                        </svg>
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--翻页-->
        <pagination :total="totalPage" ref="pages" center="true" v-on:pageChange="handleCurrentChange"></pagination>
        <!--dialog编辑区-->
        <el-dialog :visible.sync="dialogFormVisible" center="true" :show-close="false" @close="resetForm"
                   class="message-container">
            <div class="el-dialog__header">
                <span class="el-dialog__title" @click="showUserInfo">{{dialogStatus}}</span>
                <button v-if="!showHistroy" type="button" aria-label="Close" @click="closeMainDialog"
                        class="el-dialog__headerbtn">
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                </button>
            </div>
            <div class="message-wrapper">
                <div class="message" v-scroll-bottom="messageList">
                    <div v-for="message in messageList" :key="message.id"
                         :class="message.sendType=='10'?'an-move-left':'an-move-right'">
                        <p class="time"><span v-text="message.messageTime"></span></p>
                        <p class="time system" v-if="message.messageType==10000"><span v-html="message.content"></span>
                        </p>
                        <div :class="'main' + (message.sendType=='10'?'':' self')" v-else>
                            <img class="avatar" width="45" height="45"
                                 :src="message.sendType=='10'? userImg: accountImg">
                            <!-- 文本 -->
                            <div class="text" v-if="message.messageType=='100'" v-html="message.content"></div>

                            <!-- 图片 -->
                            <div class="text" v-else-if="message.messageType=='101'" style="max-width: 50%">
                                <el-tooltip content="图片" placement="top">
                                    <img style="width: 100%" v-if="message.medias.serverUrl" :src="imageUrl+message.medias.serverUrl">
                                    <img v-else src="~assets/replace.png">
                                </el-tooltip>
                            </div>
                            <!-- 语音 -->
                            <div class="text" v-else-if="message.messageType=='102'">
                                <audio class="audio" controls="controls" :src="mediaUrl + message.medias.serverUrl">
                                    <source :src="mediaUrl + message.medias.serverUrl">
                                </audio>
                            </div>

                            <!-- 视频 -->
                            <div class="text" v-else-if="message.messageType=='103'" style="max-width: 50%;">
                                <video height="100%" width="100%" :src="mediaUrl + message.medias.serverUrl"
                                       @click="showVideo(message.medias.serverUrl)"></video>
                            </div>

                            <!-- 链接 -->
                            <div class="text" v-else-if="message.messageType=='107'" style="max-width: 50%;">
                                <img style="width: 100%" v-if="message.medias.picUrl"
                                     :src="imageUrl+message.medias.picUrl">
                                <img v-else src="~assets/replace.png">
                                <a :href="message.medias.url" target="_blank">
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
                            <div class="text card-container" v-else-if="message.messageType=='300'" >
                                <div class="card-wrapper" >
                                    <div class="card-body" >
                                        <div class="card-img-container">
                                            <img v-if="message.medias.picUrl" :src="imageUrl+message.medias.picUrl" >
                                            <img v-else src="~assets/replace.png">
                                        </div>
                                        <div class="card-title">
                                                <span :title="message.medias.title">
                                                    {{message.medias.title}}
                                                </span>
                                        </div>
                                    </div>
                                    <div class="card-foot" >
                                        <span>微信卡券</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 其他 -->
                            <div class="text" v-else-if="message.messageType!='10000'">
                                暂未支持的消息类型
                            </div>
                        </div>
                    </div>
                </div>
                <!--<pagination :total="totalPage2" v-on:pageChange="handleCurrentChange2"></pagination>-->
                <div style="text-align:left;">
                    <!--<el-button  class="cancel">表情</el-button>-->
                    <div class="material-select-btn">
                        <MaterialSelectBox ref="selectBox"
                                           @selectedMaterial='getSelectedTempMaterial'></MaterialSelectBox>
                    </div>
                    <el-button class="material-btn" @click="getCard">
                        <svg class="wscn-icon" aria-hidden="true"
                             style="width: 24px;height: 18px;fill: currentColor;margin-top: -1px;overflow: hidden;">
                            <use xlink:href="#icon-qiaquan"></use>
                        </svg>
                    </el-button>
                    <el-button class="history-message-btn" @click="showHistory">消息记录</el-button>
                </div>
                <div class="message_send">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 2}"
                            style="height: 63px;" :maxlength="682"
                            placeholder="请输入内容"
                            v-model="textarea"
                            @keyup.native="sendKeyBoardMSG"
                    >
                    </el-input>
                    <div slot="footer" class="dialog-footer" style="text-align:right;padding: 10px;">
                        <el-button @click="handleCancel" class="cancel msg-btn">取 消</el-button>
                        <el-button type="primary" class="confirm msg-btn"
                                   @click="sendMSG"
                        >
                            发送
                        </el-button>
                    </div>
                </div>
            </div>

            <div v-if="showHistroy" class="history-message">
                <div class="el-dialog__header" style="height: 47px">
                    <button v-if="showHistroy" type="button" aria-label="Close" @click="dialogFormVisible = false"
                            class="el-dialog__headerbtn">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>
                <div style="height: 461px;" class="message">
                    <div v-for="message in historyMessageList" :key="message.id"
                         :class="message.sendType=='10'?'an-move-left':'an-move-right'">
                        <p class="time"><span v-text="message.messageTime"></span></p>
                        <p class="time system" v-if="message.messageType==10000"><span v-html="message.content"></span>
                        </p>
                        <div :class="'main' + (message.sendType=='10'?'':' self')" v-else>
                            <img class="avatar" width="45" height="45"
                                 :src="message.sendType=='10'? userImg: accountImg">
                            <!-- 文本 -->
                            <div class="text" v-if="message.messageType=='100'" v-html="message.content"></div>

                            <!-- 图片 -->
                            <div class="text" v-else-if="message.messageType=='101'" style="max-width: 50%">
                                <el-tooltip content="图片" placement="top">
                                    <img style="width: 100%" v-if="message.medias.serverUrl" :src="imageUrl+message.medias.serverUrl">
                                    <img v-else src="~assets/replace.png">
                                </el-tooltip>
                            </div>
                            <!-- 语音 -->
                            <div class="text" v-else-if="message.messageType=='102'">
                                <audio class="audio" controls="controls"
                                       :src="mediaUrl + message.medias.serverUrl">
                                    <source :src="mediaUrl + message.medias.serverUrl">
                                </audio>
                            </div>

                            <!-- 视频 -->
                            <div class="text" v-else-if="message.messageType=='103'" style="max-width: 50%;">
                                <video height="100%" width="100%" :src="mediaUrl + message.medias.serverUrl"
                                       @click="showVideo(message.medias.serverUrl)"></video>
                            </div>

                            <!-- 链接 -->
                            <div class="text" v-else-if="message.messageType=='107'" style="max-width: 50%;">
                                <img style="width: 100%" v-if="message.medias.picUrl"
                                     :src="imageUrl+message.medias.picUrl">
                                <img v-else src="~assets/replace.png">
                                <a :href="message.medias.url" target="_blank">
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
                            <div class="text card-container" v-else-if="message.messageType=='300'" >
                                <div class="card-wrapper" >
                                    <div class="card-body" >
                                        <div class="card-img-container">
                                            <img v-if="message.medias.picUrl" :src="imageUrl+message.medias.picUrl" >
                                            <img v-else src="~assets/replace.png">
                                        </div>
                                        <div class="card-title">
                                                <span :title="message.medias.title">
                                                    {{message.medias.title}}
                                                </span>
                                        </div>
                                    </div>
                                    <div class="card-foot" >
                                        <span>微信卡券</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 其他 -->
                            <div class="text" v-else-if="message.messageType!='10000'">
                                暂未支持的消息类型
                            </div>
                        </div>
                    </div>
                </div>

                <el-row type="flex" class="small-page" justify="center">
                    <div v-if="searBarVisible" class="search-bar">
                        <el-form>
                            <el-form-item class="small-space" label-position="left" label-width="10px">
                                <el-form-item label="关键字">
                                    <el-input  class="filter-item" v-model="pageParam2.keyWord" style="ime-mode:disabled"></el-input>
                                </el-form-item>
                            </el-form-item>
                            <el-button class="search-bar-btn" @click="searchData">
                                确定
                            </el-button>
                        </el-form>

                    </div>

                    <el-button type="default" class="icon-btn edit message-filter-icon" title="查看" size="small" @click="showSearchBar">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-filter"></use>
                        </svg>
                    </el-button>

                    <smallPagination :total="totalPage2" style="margin:0 0 5px;" v-on:pageChange="handleCurrentChange2"></smallPagination>
                </el-row>
            </div>
        </el-dialog>

        <!--卡券编辑区-->
        <el-dialog class="dialogForm" :visible.sync="cardSelectBoxVisible" @close="closeCard">
            <CardSelectBox @selectedCard='getSelectedCard'></CardSelectBox>
        </el-dialog>

        <!--视频播放区-->
        <el-dialog class="dialogForm" :visible.sync="videoDialogVisible" @close="stopPlay">
            <video controls="controls" style="height: 500px" width="100%" :src="videoSrc">
                您的浏览器不支持html5播放器，请升级浏览器或者使用chrome。
                <source :src="videoSrc" type="video/mp4">
            </video>
        </el-dialog>
        <!--筛选区-->


        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form v-model="pageParam">
                <el-form-item label="粉丝昵称">
                    <el-input v-model="pageParam.nickName" style="ime-mode:disabled" placeholder="请输入粉丝昵称"></el-input>
                </el-form-item>
                <el-form-item label="起始时间">
                    <el-date-picker
                            v-model="pageParam.startTime"
                            type="datetime" style="width: 100%"
                            placeholder="请选择关注起始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="pageParam.endTime"
                            type="datetime" style="width: 100%"
                            placeholder="请选择关注结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="消息类型">
                    <el-select style="float: left;width: 100%" v-model="pageParam.isReply" placeholder="请选择是否关注">
                        <el-option label="未回复消息" value="false"></el-option>
                        <el-option label="所有消息" value=""></el-option>
                    </el-select>
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

        <el-dialog :visible.sync="userInfoVisible" ref="userInfoDialog" style="top: 6%" class="user-info-dialog">
            <div style=' margin-left:10px;'>
                <el-form class="small-space" label-position="left">
                    <el-form-item label="昵称:" prop="nickName">
                        {{fansData.nickName}}
                    </el-form-item>
                    <el-form-item label="性别:" prop="gender">
                        {{fansData.gender}}
                    </el-form-item>
                    <el-form-item label="城市:" prop="province">
                        {{fansData.province}} {{fansData.city}}
                    </el-form-item>
                    <el-form-item label="语言:" prop="language">
                        {{fansData.language}}
                    </el-form-item>
                    <el-form-item label="标签:">
                        <tag-tree :treeData = "userInfoTreeData" :tags = "fansLabelList" v-on:treeTags="handTags"></tag-tree>
                        <el-tag style="margin: 5px;" v-for="(label,index) in fansLabelList" :key="index">
                            {{label.tagName}}
                        </el-tag>
                    </el-form-item>

                </el-form>
            </div>

            <div style="text-align:center;margin-bottom: 10px;">
                <!--<router-link :to="'/fans-manage/fans-detail/' + fansData.openId" >-->
                <el-button class="cancel" @click="gotofansDetail(fansData.account,fansData.openId)">查看详情</el-button>
                <!--</router-link>-->
            </div>
        </el-dialog>

        <fansDetail ref="fansDetail1"/>

    </div>

</template>
<script src="./fansMSGManage.js"></script>

<style scoped lang="scss">
    .icon-sucai {
        width: 16px;
        height: 16px;
        line-height: 0;
        fill: #666;
    }

    .material-btn {
        padding: 4px 5px;
        border-radius: 0;
        margin: 4px;
    }

    .material-btn:hover {
        background: #dedede;
    }
    .message-container{
        overflow: hidden;
    }
    .material-btn:hover .icon-sucai {
        fill: #333;
    }

    .msg-btn {
        padding: 5px 15px;
    }
    .audio{
        max-width: 100%;
        max-height: 32px;
    }

</style>

