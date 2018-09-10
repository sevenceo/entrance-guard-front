<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <div class="fans-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-show="searchFlag">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <!--tab切换-->
        <el-tabs class="v-content push-message" @tab-click="tabClick">
            <el-tab-pane label="精准群发">
                <div class="form-container">
                    <el-form class="send-all" labelWidth="90px" label-position="right" :model="temp" ref="temp"
                             :rules="rules">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="粉丝组" prop="fansGroupId">

                                <el-button class="material-btn"  @click="getSearchGroup">
                                    <span v-if="temp.fansGroupId">{{temp.fansGroup}}</span>
                                    <span v-else style="color: gray">选择粉丝组</span>
                                </el-button>
                                <template>
                                    <router-link :to="{name: '粉丝组维护', params: {id: 'add',isMaster:true,auth:'Manufacturer',status:'speed'}}"  v-authority="'FansGroup.Manufacturer.Maintenance'"> <!--:to="{name: '粉丝组维护', params: {id: scope.row.id,isMaster: scope.row.isMaster,auth:'Agency' }}"  v-authority="'FansGroup.Agency.Maintenance'" >-->
                                        <el-button type="default" title="新增主机厂标签组" class="edit" size="small" ><!--v-if="!scope.row.isMaster"  v-show='agencyModVisible'>-->
                                            <svg class="icon icon-tianzhuan"  aria-hidden="true">
                                                <use xlink:href="#icon-zjc"></use>
                                            </svg>
                                        </el-button>
                                    </router-link>
                                    <router-link :to="{name: '粉丝组维护', params: {id: 'add',isMaster:false,auth:'Agency',status:'speed'}}" v-authority="'FansGroup.Agency.Maintenance'"> <!--:to="{name: '粉丝组详情', params: { id: scope.row.id, isMaster: scope.row.isMaster}}">-->
                                        <el-button type="default" title="新增经销商标签组" class="check" size="small">
                                            <svg class="icon icon-tianzhuan"  aria-hidden="true">
                                                <use xlink:href="#icon-touxiang"></use>
                                            </svg>
                                        </el-button>
                                    </router-link>
                                </template>
                                </el-form-item>
                                    <!--<el-select class="filter-item" v-model="temp.fansGroupId" @change="getSelection">-->
                                        <!--<el-option v-for="item in fansGroupOption" :key="item.id" :label="item.name"-->
                                                   <!--:value="item.id">-->
                                        <!--</el-option>-->
                                    <!--</el-select>-->
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="发送时间" prop="setSendTime">
                                    <el-date-picker
                                            v-model="temp.setSendTime"
                                            type="datetime"
                                            placeholder="选择日期时间"
                                    :picker-options="dateOptions"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="性别">
                                    <el-select class="filter-item" v-model="temp.gender">
                                        <el-option v-for="item in genderType" :key="item.key" :label="item.label"
                                                   :value="item.genderValue">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="国家" class="message-country">
                                    <el-select class="filter-item" v-model="temp.country" @change="getProvinceList">
                                        <el-option v-for="item in nation" :key="item.name" :label="item.name"
                                                   :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label=" 省份" class="message-province">
                                    <el-select class="filter-item" v-model="temp.province" @change="getCityList">
                                        <el-option
                                                v-for="item in province"
                                                :label="item.name"
                                                :value="item.name"
                                                :key="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="城市" class="message-city">
                                    <el-select class="filter-item" v-model="temp.city" @change="getCity">
                                        <el-option
                                                v-for="item in city"
                                                :label="item.name"
                                                :value="item.name"
                                                :key="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                        </el-row>


                        <el-row class="count-contaner">
                            <el-col :span="24">
                                <label class="gruopEdit">控制组</label>
                                <el-radio class="radio" v-model="radio" label="百分比"></el-radio>
                                <el-form-item label-width="0" class="percentage" prop="percentage">
                                    <el-input type="text" class="control-group-input control-gruopEdit-input"
                                              v-model="temp.percentage"
                                              :disabled="radio === '人数'"></el-input>
                                </el-form-item>

                                <el-radio class="radio" v-model="radio" label="人数"></el-radio>
                                <el-form-item label-width="0" prop="personCount" class="person-count">
                                    <el-input type="text" class="control-group-input control-gruopEdit-input"
                                              v-model="temp.personCount"
                                              :disabled="radio === '百分比'"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <div class="exhibition">
                                    <label class="exhibition-title">群发内容</label>
                                    <div class="exhibition-content">
                                        <el-tabs type="border-card" @tab-click="materialTabClick">
                                            <el-tab-pane label="外链">
                                                <div class="details">
                                                    <div class="item-wrapper" v-if="selectedData.id">
                                                        <a class="icon-wrapper delete" @click="clearSelectedData">
                                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                                <use xlink:href="#icon-delete1"></use>
                                                            </svg>
                                                        </a>
                                                        <div style="    position: relative">
                                                            <img height="192px" width="50%"
                                                                 :src="baseUrl + selectedData.picUrl"
                                                                 alt="">
                                                            <a :href="selectedData.url" target="_blank" style="margin-bottom: 20px">
                                                                <div style="border-top: 1px solid gray">
                                                                    <div style="float: right;margin-right: 25%">></div>
                                                                    <div style="float: right;margin-right: 20px;"> 阅读全文</div>

                                                                </div>
                                                            </a>
                                                        </div>

                                                        <p>{{selectedData.name}}</p>
                                                    </div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="图文">
                                                <div class="details">
                                                    <div class="item-wrapper" v-if="selectedData.id">
                                                        <a class="icon-wrapper delete" @click="clearSelectedData">
                                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                                <use xlink:href="#icon-delete1"></use>
                                                            </svg>
                                                        </a>
                                                        <p class="material-title">{{selectedData.name}}</p>

                                                        <div style="position: relative">
                                                            <img height="192px"
                                                                 :src="baseUrl + selectedData.serverUrl"
                                                                 alt="">
                                                        </div>

                                                        <p
                                                                v-for=" tpl in selectedData.newsItemList"
                                                                v-html="tpl.content"
                                                                style="overflow: hidden;text-align:center;"></p>

                                                    </div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="文字">
                                                <div class="details">
                                                    <div class="item-wrapper" v-if="selectedData.id">
                                                        <a class="icon-wrapper delete" @click="clearSelectedData">
                                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                                <use xlink:href="#icon-delete1"></use>
                                                            </svg>
                                                        </a>
                                                        <div class="text-wrapper" v-if="selectedData.id">
                                                            <p>{{selectedData.content}}</p>
                                                        </div>
                                                        <p>{{selectedData.name}}</p>
                                                    </div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="图片">
                                                <div class="details">
                                                    <div class="item-wrapper" v-if="selectedData.id">
                                                        <a class="icon-wrapper delete" @click="clearSelectedData">
                                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                                <use xlink:href="#icon-delete1"></use>
                                                            </svg>
                                                        </a>
                                                        <div style="position: relative">
                                                            <img width="50%"
                                                                 :src="baseUrl + selectedData.serverUrl"
                                                                 alt="">
                                                        </div>
                                                        <p>{{selectedData.name}}</p>
                                                    </div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="语音">
                                                <div class="details">
                                                    <div class="item-wrapper" v-if="selectedData.id">
                                                        <a class="icon-wrapper delete" @click="clearSelectedData">
                                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                                <use xlink:href="#icon-delete1"></use>
                                                            </svg>
                                                        </a>
                                                        <div class="text-wrapper">
                                                            <audio class="audio" controls="controls"
                                                                   :src="baseUrl + selectedData.serverUrl">
                                                                <source :src="baseUrl + selectedData.serverUrl">
                                                            </audio>
                                                        </div>
                                                        <p>{{selectedData.name}}</p>
                                                    </div>

                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="视频">
                                                <div class="details">
                                                    <div class="item-wrapper" v-if="selectedData.id">
                                                        <a class="icon-wrapper delete" @click="clearSelectedData">
                                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                                <use xlink:href="#icon-delete1"></use>
                                                            </svg>
                                                        </a>
                                                        <div class="text-wrapper">
                                                            <video controls="controls" width="50%"
                                                                   :src="baseUrl + selectedData.serverUrl">
                                                                <source :src="baseUrl + selectedData.serverUrl">
                                                            </video>
                                                        </div>
                                                        <p>{{selectedData.name}}</p>
                                                    </div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="优惠券">
                                                <div class="details">
                                                    <div class="item-wrapper" v-if="selectedData.id">
                                                        <a class="icon-wrapper delete" @click="clearSelectedData">
                                                            <svg class="icon icon-edit1" aria-hidden="true">
                                                                <use xlink:href="#icon-delete1"></use>
                                                            </svg>
                                                        </a>
                                                        <div class="text-wrapper" v-if="materialTabIndex == 6">
                                                            <img :src="baseUrl + selectedData.iconUrlPath" alt="">
                                                        </div>
                                                        <p class="material-title" style="text-align: center;"
                                                           v-if="materialTabIndex == 6">{{selectedData.cardTitle}}</p>
                                                    </div>
                                                </div>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="message-btn-wrapper">
                        <el-button type="primary" v-authority="'PushMessage.many'" style="margin-right:50px;" @click="sendMessage(0)">高级群发
                        </el-button>
                        <el-button type="primary" v-authority="'PushMessage.one'" style="margin-left:50px;" @click="sendMessage(1)">客服群发
                        </el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="发送列表">
                <el-table :data="historyData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column width="200px" prop="setSendTime" label="发送时间">
                    </el-table-column>
                    <el-table-column prop="sendWay" label="发送类型">
                    </el-table-column>
                    <el-table-column prop="materialType" label="素材类型">
                    </el-table-column>
                    <el-table-column prop="groupName" label="粉丝组">
                    </el-table-column>
                    <el-table-column prop="fansSex" label="性别" :formatter="formatter">
                    </el-table-column>
                    <el-table-column prop="fansCountry" label="国家" :formatter="formatter">
                    </el-table-column>
                    <el-table-column prop="fansProvince" label="省份" :formatter="formatter">
                    </el-table-column>
                    <el-table-column prop="fansCity" label="城市" :formatter="formatter">
                    </el-table-column>
                    <el-table-column prop="materialName" label="素材">
                    </el-table-column>
                    <el-table-column label="发送粉丝数">
                        <template scope="scope">
                            <a title="查看发送成功粉丝信息" class="underline" v-if="scope.row.sendCount != 0" href="javascript:void(0);" @click="showfans(scope.row.id)">
                               {{scope.row.sendCount}}
                            </a>
                            <span v-if="scope.row.sendCount == 0">
                                {{scope.row.sendCount}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="progress" label="发送进度">
                    </el-table-column>
        </el-table>
                <pagination :total="totalPage2" v-on:pageChange="handleCurrentChange2"></pagination>

            </el-tab-pane>
        </el-tabs>

        <el-dialog class="dialogShowFansForm" title="粉丝列表" :visible.sync="showFans" @close="resetForm">
        <!--表格-->
            <div class="user-filter-container">
                <el-button class="btn btn-add" type="primary" @click="exportAll()">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-wendang"></use>
                    </svg>
                        导出
                </el-button>
            </div>
            <div>
                <el-table :data="tableData" border stripe style="width: 100%;" class="blue-table">
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
                    <el-table-column prop="gender" label="性别" min-width="60">
                    </el-table-column>
                    <el-table-column prop="province" label="省份" min-width="70">
                    </el-table-column>
                    <el-table-column prop="city" label="城市" min-width="70">
                    </el-table-column>
                    <el-table-column prop="isSubscribe" label="关注状态" :formatter="formatter1" min-width="80">
                    </el-table-column>
                    <el-table-column prop="lastActionTime" label="最近活跃时间"  width="150">
                    </el-table-column>
                    <el-table-column prop="subscribeTime" label="关注时间"  width="150">
                    </el-table-column>
                    <el-table-column prop="unsubscribeTime" label="取消关注时间"  min-width="100">
                    </el-table-column>
                    <el-table-column prop="realName" label="真实姓名">
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号码"  min-width="100">
                    </el-table-column>
                </el-table>
                <!--翻页-->
                <pagination :total="fansTotalPage" ref="pages" v-on:pageChange="handleCurrentChange3"></pagination>
            </div>
        </el-dialog>

        <el-dialog class="dialogForm" :visible.sync="dialogFormVisible" size="large" @close="clearData">
            <!--<editor :temp = "temp" :activeTypeOptions="activeTypeOptions" :pickerOptions0="pickerOptions0" ></editor>-->
            <div class="dialogFormBox">
                <el-row :gutter="30" class="material-wrapper" style="margin-left:0;margin-right:0;">

                    <el-col class="item" :span="8" v-for="x in dataList" :key="x.id"
                            style="text-align:center;margin-bottom:20px;">
                        <div class="item-wrapper">
                            <div class="item-wrapper-pt" v-if="materialTabIndex == 0">
                                <img width="100%" height="120px" :src="baseUrl + x.picUrl" alt="">
                            </div>
                            <div class="item-wrapper-pt" v-if="materialTabIndex == 1">
                                <img
                                        :src="baseUrl + x.serverUrl"
                                        alt="">
                            </div>
                            <div class="text-wrapper-pt" v-if="materialTabIndex == 2">
                                <p>{{x.content}}</p>
                            </div>
                            <div class="item-wrapper-pt" v-if="materialTabIndex == 3">
                                <img :src="baseUrl + x.serverUrl" alt="">
                            </div>
                            <div class="item-wrapper-pt" v-if="materialTabIndex == 4">
                                <audio style="width: 100%" class="audio" controls="controls"
                                       :src="baseUrl + x.serverUrl">
                                    <source :src="baseUrl + x.serverUrl">
                                </audio>
                            </div>


                            <div class="text card-container" v-if="materialTabIndex == 6">
                                <div class="card-wrapper">
                                    <div class="card-body">
                                        <div class="card-img-container">
                                            <img :src="baseUrl + x.iconUrlPath" alt="">
                                        </div>
                                        <div class="card-title">
                                                <span :title="x.cardTitle">
                                                    {{x.cardTitle}}
                                                </span>
                                        </div>
                                    </div>
                                    <div class="card-foot push-msg-card-foot">
                                        <span>微信卡券</span>
                                    </div>
                                </div>
                            </div>

                            <video width="100%" :src="baseUrl + x.serverUrl" v-if="materialTabIndex == 5"></video>

                            <p :title="x.name" class="material-title" v-if="materialTabIndex != 6">{{x.name}}</p>
                            <!--<p class="material-title" v-for=" tpl in x.newsItemList"  v-if="materialTabIndex == 1" v-html="tpl.content" style="overflow: hidden"></p>-->
                        </div>
                        <el-radio class="radio select-radio" v-model="selectedRadio" :label="x"></el-radio>
                    </el-col>
                </el-row>

            </div>
            <pagination class="item-wrapper-page" :total="totalPage" :pagesize="pageParam.size"
                        v-on:pageChange="handleCurrentChange"></pagination>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel" @click="cancel">取 消</el-button>
                <el-button type="primary" class="update" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>

        <!--粉丝组选择区（筛选）-->
        <el-dialog  class="dialogForm"  :visible.sync="fansGroupSelectSearchBoxVisible" @close="closeSearchGroup">
            <FansGroupSelectBox  @selectGroup = 'getSelectedSearchGroup'></FansGroupSelectBox>
        </el-dialog>

    <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
        <el-form v-model="historyPageParam">
            <el-form-item label="发送状态">
                <template>
                    <el-select class="filter-item" v-model="historyPageParam.type">
                        <el-option v-for="item in  options" :key="item.key" :label="item.label"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </template>
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

    </div>
</template>

<script src="./pushMessage.js">

</script>

<style scoped src="./pushMessage.scss"></style>

<style scoped lang="scss">
    .user-filter-container{
        float: right;
        margin:5px 0 10px;
        padding-bottom: 0;
    }

    .form-container {
        max-width: 940px;
    }

    .control-group-input {
        display: inline-block;
        width: 200px;
        margin-right: 40px;
    }

    .exhibition {
        margin-top: 0;
    }

    .item-wrapper {
        position: relative;
        border: solid 1px #ccc;
        margin-bottom: 10px;
        overflow: hidden;
        svg {
            fill: red;
        }
    }

    .icon-wrapper {
        position: absolute;
        right: 50px;
        top: 0;
        z-index: 10;
    }

    .exhibition-title {
        vertical-align: top;
        width: 90px;
        display: inline-block;
        text-align: right;
        padding-right: 12px;
    }

    .exhibition-content {
        display: inline-block;
        width: 750px;
        min-height: 300px;
        vertical-align: top;
        .el-tabs--border-card {
            height: 400px;
            position: relative;
            .el-tabs__content {
                position: absolute;
                top: 0;
                bottom: 0;
                margin-top: 43px;
                height: auto !important;
            }
        }
    }

    .details {
        text-align: center;
    }

    .text-wrapper {
        padding: 20px;
        position: relative;
        background-color: #f2f2f2;
        p {
            text-align: center;
        }
    }

    .message-btn-wrapper {
        text-align: center;
        margin-top: 20px;
    }

    .percentage, .person-count {
        display: inline-block;
    }

    .send-all {
        overflow: hidden;
    }

    .item-wrapper-pt {
        height: 130px;
        display: table-cell;
        display: block\0; // IE样式兼容
        vertical-align: middle;
        padding: 5px;
        width: 1000px;
        width: 100%\0; // IE样式兼容
        text-align: center;
        overflow-y: auto;
    }

    .text-wrapper-pt {
        height: 130px;
        display: block;
        padding: 5px;
        width: 100%;
        text-align: left;
        overflow-y: auto;
    }

    .item-wrapper-pt img {
        max-height: 100%;max-width: 100%;vertical-align: middle;border:0;margin:0;padding:0;
    }

    .material-title {
        // position: absolute;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.1);
        width: 100%;
        color: #000;
        margin: 0;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }

    /*.item-wrapper-page {*/
    /*position: absolute;*/
    /*}*/
    .el-form-item .el-form-item__label {
        width: 90px;
    }

    .gruopEdit {
        width: 90px;
        display: inline-block;
        text-align: right;
        padding-right: 12px;
    }

    .control-gruopEdit-input {
        width: 192px;
    }

    .el-date-editor.el-input {
        width: 217px;
    }
</style>
