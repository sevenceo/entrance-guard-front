
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'WhiteList.Add'" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'WhiteList.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>

        </div>


        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="facePhoto" label="特征照片">
                    <template scope="scope">
                        <img :src="scope.row.facePhoto" @click="picDetail(scope.row.facePhoto)"  width="100" height="100"/>
                    </template>
                </el-table-column>
                <el-table-column prop="realName" label="姓名">
                </el-table-column>
                <el-table-column prop="gender" label="性别">
                    <template scope="scope">
                        <span>{{genderInfo[scope.row.gender]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mobilePhone" label="手机号">
                </el-table-column>
                <el-table-column prop="redListRemark" label="加入红名单原因">
                </el-table-column>
                <el-table-column prop="pushScreenMessage" label="推送大屏消息">
                    <template scope="scope">
                        <span>{{OneZeroInfo[scope.row.pushScreenMessage]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sendWarningAlert" label="发送预警提醒">
                    <template scope="scope">
                        <span>{{OneZeroInfo[scope.row.sendWarningAlert]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="操作" width="170">
                    <template scope="scope">
                        <el-button type="default" title="查看详情" class="icon-btn edit"
                                   @click="redListDetail(scope.row)" size="small">
                            查看详情
                        </el-button>
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   size="small"><!--v-authority="'WhiteList.Edit'"-->
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   size="small"> <!--v-authority="'WhiteList.Delete'"-->
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" title="新增红名单" :visible.sync="dialogFormVisible"
                       @close="resetForm">
               <div style="max-height: 650px;overflow: auto">
                <div class="">
                    <el-button class="btn btn-edit" type="primary" @click="onSearch" ><!--v-authority="'BlackList.Search'"-->
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-filter"></use>
                        </svg>
                        筛选
                    </el-button>
                </div>
                <div class="audit-body" style="margin-top: 10px;">
                    <el-table :data="humanSelect" border stripe style="width: 120%" class="blue-table"
                              @selection-change="humanSelectionChange">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="facePhoto" label="人脸照片">
                            <template scope="scope">
                                <img :src="scope.row.facePhoto" @click="picDetail(scope.row.facePhoto)" width="100" height="100"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="mobilePhone" label="手机号">
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱">
                        </el-table-column>
                    </el-table>
                    <!--翻页-->
                    <pagination ref="pages" :total="rowHumanTotal" v-on:pageChange="handleHumanCurrentChange" v-if="paginationShow"></pagination>
                </div>
                <el-form :model="temp" labelPosition="" :rules="reasonRules" ref="redListReason" label-width="120px">
                    <el-form-item label="加入红名单原因" prop="redListRemark">
                        <el-input v-model="temp.redListRemark"
                                  placeholder="请输加入红名单原因" :maxlength='30' v-on:blur="changeCount(temp.redListRemark)"></el-input>
                    </el-form-item>
                    <el-form-item label="推送大屏消息">
                        <el-switch
                                v-model="pushScreenMessageFlag"
                                active-text="开"
                                inactive-text="关"
                             >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="大屏消息内容" prop="blackListRemark" v-if="pushScreenMessageFlag">
                        <el-input v-model="temp.screenMessage" type="textarea"
                                  placeholder="大屏消息内容" :maxlength= 50></el-input>
                        <span style="color:red">*</span><span>可用{name}表示用户姓名</span>
                    </el-form-item>
                    <el-form-item label="发送预警提醒">
                        <el-switch
                                v-model="sendWarningAlertFlag"
                                active-text="开"
                                inactive-text="关"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="预警方式" v-if="sendWarningAlertFlag">
                        <el-select v-model="temp.warningType" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="预警消息内容" v-if="sendWarningAlertFlag">
                        <el-input v-model="temp.warningMessage" type="textarea"
                                  disabled></el-input>
                        <span style="color:red">*</span><span>可用{name}表示用户姓名</span>
                    </el-form-item>
                    <el-form-item label="预警接收人员" v-if="sendWarningAlertFlag">
                        <el-button class="btn btn-add" type="primary" @click="chooseHuman('blackListReason')"
                                   style="width: 100px;float: left;margin: 10px 0px;">
                            选择人员
                        </el-button>
                    </el-form-item>
                    <el-table :data="humanInWarningListSelected" border stripe style="width: 100%" class="blue-table" v-if="sendWarningAlertFlag">
                        <el-table-column prop="realName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="mobilePhone" label="手机号">
                        </el-table-column>
                        <el-table-column prop="type" label="操作" width="130">
                            <template scope="scope">
                                <el-button type="default" title="删除" class="icon-btn delete" @click="deleteHumanSelected(scope.row)"
                                           size="small"> <!--v-authority="'WhiteList.Delete'"-->
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-delete1"></use>
                                    </svg>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-add" type="primary" @click="matchHuman('redListReason')"
                               style="width: 100px;float: right;margin: 10px 0px;">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        新增红名单
                    </el-button>
                </div>
               </div>
            </el-dialog>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="humanPageParam" labelPosition="">
                    <el-form-item label="用户名">
                        <el-input v-model="humanPageParam.realName"
                                  placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="humanPageParam.mobilePhone"
                                  placeholder="请输入手机号"></el-input>
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


            <el-dialog :visible.sync="humanNotInEarningListDialog" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="warningHumanPageParam" labelPosition="">
                    <el-form-item label="用户名">
                        <el-input v-model="warningHumanPageParam.realName"
                                  placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="warningHumanPageParam.mobilePhone"
                                  placeholder="请输入手机号"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-reset reset" @click="resetSearchCondition" type="default">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" @click="searchWithCondition" type="default">
                        筛选
                    </el-button>
                </div>
            </el-dialog>



            <el-dialog class="dialogForm" title="编辑红名单"  :visible.sync="redListEdit" @close="cancelEdit()">
                <div style="max-height: 650px;overflow: auto">
                    <div class="audit-body" style="margin-top: 10px;">
                        <el-form :model="temp" labelPosition="" ref="redListReasonUpdate" label-width="120px" :rules="reasonRules">
                            <el-form-item label="特征照片">
                                <img :src="temp.facePhoto"width="100" height="100"/>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="temp.realName" disabled ></el-input>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-input v-if="temp.gender == '1'" value="男" disabled >男</el-input>
                                <el-input v-if="temp.gender == '2'" value="女" disabled >女</el-input>
                                <el-input v-if="temp.gender == ''|| temp.gender == undefined" value="未知" disabled >未知</el-input>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <el-input v-model="temp.mobilePhone" disabled ></el-input>
                            </el-form-item>
                            <el-form-item label="加入红名单原因" prop="redListRemark">
                                <el-input v-model="temp.redListRemark"
                                          placeholder="请输加入红名单原因"   :maxlength='30' v-on:blur="changeCount(temp.redListRemark)"></el-input>
                            </el-form-item>
                            <el-form-item label="推送大屏消息">
                                <el-switch
                                        v-model="pushScreenMessageFlag"
                                        on-text="开"
                                        off-text="关"
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="大屏消息内容" prop="blackListRemark" v-if="pushScreenMessageFlag">
                                <el-input v-model="temp.screenMessage" type="textarea"  ></el-input>
                                <span style="color:red">*</span><span>可用{name}表示用户姓名</span>
                            </el-form-item>
                            <el-form-item label="发送预警提醒">
                                <el-switch
                                        v-model="sendWarningAlertFlag"
                                        on-text="开"
                                        off-text="关"
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="预警方式" v-if="sendWarningAlertFlag">
                                <el-select v-model="temp.warningType" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="预警消息内容" v-if="sendWarningAlertFlag">
                                <el-input v-model="temp.warningMessage" type="textarea" disabled></el-input>
                                <span style="color:red">*</span><span>可用{name}表示用户姓名</span>
                            </el-form-item>
                            <el-form-item label="预警接收人员" v-if="sendWarningAlertFlag">
                                <el-button class="btn btn-add" type="primary" @click="chooseHuman()"
                                           style="width: 100px;float: left;margin: 10px 0px;">
                                    选择人员
                                </el-button>
                            </el-form-item>
                            <el-table :data="humanInWarningListSelected" border stripe style="width: 100%" class="blue-table" v-if="sendWarningAlertFlag">
                                <el-table-column prop="realName" label="姓名">
                                </el-table-column>
                                <el-table-column prop="mobilePhone" label="手机号">
                                </el-table-column>
                                <el-table-column prop="type" label="操作" width="130">
                                    <template scope="scope">
                                        <el-button type="default" title="删除" class="icon-btn delete" @click="deleteHumanSelected(scope.row)"
                                                    size="small"> <!--v-authority="'WhiteList.Delete'"-->
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-delete1"></use>
                                            </svg>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit" class="cancel">取 消</el-button>
                    <el-button type="primary" class="update"
                               @keyup.enter="update('redListReasonUpdate')"
                               @click="update('redListReasonUpdate')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>


            <el-dialog class="dialogForm" title="选择人员" :visible.sync="warningHumanDialogFormVisible"
                       @close="closeWarningHumanDialog">
                <div class="">
                    <el-button class="btn btn-edit" type="primary" @click="onSearchWarningHuman" ><!--v-authority="'BlackList.Search'"-->
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-filter"></use>
                        </svg>
                        筛选
                    </el-button>
                </div>
                <div class="audit-body" style="margin-top: 10px;">
                    <el-table :data="warningHumanSelect" border stripe style="width: 100%" class="blue-table"
                              @selection-change="warningHumanSelectionChange">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="facePhoto" label="人脸照片">
                            <template scope="scope">
                                <img :src="scope.row.facePhoto" @click="picDetail(scope.row.facePhoto)" width="100" height="100"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="mobilePhone" label="手机号">
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱">
                        </el-table-column>
                    </el-table>
                    <!--翻页-->
                    <pagination ref="pages" :total="rowWarningHumanTotal" v-on:pageChange="handleWarningHumanCurrentChange" v-if="paginationShow1"></pagination>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-add" type="primary" @click="addWarningHuman()"
                               style="width: 100px;float: right;margin: 10px 0px;">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        添加人员
                    </el-button>
                </div>
            </el-dialog>

            <div class="viewOriginalImage" title="原图查看" v-if="picVisible ">
                <div class="close" @click="closePic" title="关闭">X</div>
                <div class="title">查看照片</div>
                <div class="body">
                    <img id="pic" :src="imageDetail"/>
                </div>
            </div>

            <el-dialog class="dialogForm" title="查看详情" :visible.sync="redListDetailDialog"
                       @close="closeDetail()">
                <div style="max-height: 650px;overflow: auto">
                    <div class="audit-body" style="margin-top: 10px;">
                        <el-form :model="temp" labelPosition="" ref="redListReason" label-width="110px">
                            <el-form-item label="特征照片" prop="redListRemark">
                                <img :src="temp.facePhoto"width="100" height="100"/>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="temp.realName" disabled ></el-input>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-input v-if="temp.gender == '1'" value="男" disabled >男</el-input>
                                <el-input v-if="temp.gender == '2'" value="女" disabled >女</el-input>
                                <el-input v-if="temp.gender == ''|| temp.gender == undefined" value="未知" disabled >未知</el-input>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <el-input v-model="temp.mobilePhone" disabled ></el-input>
                            </el-form-item>
                            <el-form-item label="推送大屏消息">
                                <el-switch
                                        v-model="pushScreenMessageFlag"
                                        active-text="开"
                                        inactive-text="关"
                                        disabled
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="大屏消息内容" prop="blackListRemark" v-if="pushScreenMessageFlag">
                                <el-input v-model="temp.screenMessage" type="textarea" disabled ></el-input>
                            </el-form-item>
                            <el-form-item label="发送预警提醒">
                                <el-switch
                                        v-model="sendWarningAlertFlag"
                                        active-text="开"
                                        inactive-text="关"
                                        disabled
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="预警方式" v-if="sendWarningAlertFlag">
                                <el-select v-model="temp.warningType" placeholder="请选择"  disabled >
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="预警消息内容" v-if="sendWarningAlertFlag">
                                <el-input v-model="temp.warningMessage" type="textarea"
                                          disabled ></el-input>
                            </el-form-item>
                            <el-form-item label="预警接收人员" v-if="sendWarningAlertFlag">
                                <el-button class="btn btn-add" type="primary" @click="chooseHuman('blackListReason')"
                                           style="width: 100px;float: left;margin: 10px 0px;" disabled >
                                    选择人员
                                </el-button>
                            </el-form-item>
                            <el-table :data="temp.humanList" border stripe style="width: 100%" class="blue-table" v-if="sendWarningAlertFlag">
                                <el-table-column prop="realName" label="姓名">
                                </el-table-column>
                                <el-table-column prop="mobilePhone" label="手机号">
                                </el-table-column>
                                <el-table-column prop="type" label="操作" width="130">
                                    <template scope="scope">
                                        <el-button type="default" title="删除" class="icon-btn delete" @click="deleteHumanSelected(scope.row)"
                                                   disabled size="small"> <!--v-authority="'WhiteList.Delete'"-->
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-delete1"></use>
                                            </svg>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="btn btn-add" type="primary" @click="closeDetail()"
                                   style="width: 100px;float: right;margin: 10px 0px;">
                            关闭
                        </el-button>
                    </div>
                </div>
            </el-dialog>

        </div>
    </div>
</template>
<script src="./RedList.js"></script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .add_img_list {
        float: left;
        width: 3.893333333333333rem;
        height: 3.893333333333333rem;
        position: relative;
        padding: 0.213333rem;
        box-sizing: border-box;
    }

    .add_img_list .map_loading {
        margin-top: -120px;
        margin-left: 247px;
        width: 148px;
        text-align: center;
        color: #333;
        font-size: 1.554667rem;
        color: #0c0f09;
        border: none;
    }

    .viewOriginalImage {
        z-index: 5555;
        min-height: 150px;
        min-width: 400px;
        position: fixed;
        left: 250px;
        top: 30px;
        border: 1px solid #c9cbd1;
        padding: 10px;
        background-color: white;
        display: none;
    }

    .viewOriginalImage .body {
        max-height: 800px;
        max-width: 1200px;
        overflow: auto;
    }

    .viewOriginalImage .title {
        text-align: left;
        line-height: 1;
        font-size: 16px;
        font-weight: 700;
        color: #1f2d3d;
        margin-bottom: 10px;
    }

    .viewOriginalImage .close:hover {
        color: red;
    }

    .viewOriginalImage .close {
        width: 20px;
        height: 20px;
        position: absolute;
        left: calc(100% - 30px);
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
    }

    .dialogCropperForm .el-dialog {
        width: 1000px;
        height: 500px;
        margin-bottom: 0;
        top: 50% !important;
        left: 35% !important;
        margin-top: -290px;
        margin-left: -300px;
        -webkit-transform: translateX(0);
        -moz-transform: translateX(0);
        -ms-transform: translateX(0);
        transform: translateX(0);
    // height: 550px;
    }
    .info-item {
        margin-top: 15px;
    }
    /*label {*/
    /*display: inline-block;*/
    /*width: 100px;*/
    /*text-align: right;*/
    /*}*/
    .cropper-content {
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;
    }
    .cropper{
        width: 600px;
        height: 400px;
        margin-top: -80px;
    }
    .show-preview {
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
    }
    .preview{
        overflow: hidden;
        /*border-radius: 50%;*/
        border:1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
    }
    .cropper-content .show-preview .preview {margin-left: 0;}
</style>
