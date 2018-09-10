
<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd1"  v-authority="'ScreenInformation.CompanyAdd'" v-if="lvl == 1 || lvl == 2">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onAdd2"  v-authority="'ScreenInformation.CommunityAdd'" v-if="lvl == 0">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-delete" type="danger" @click="onBatchDelete" v-authority="'ScreenInformation.BatchDelete'" style="width: 100px;">
                <svg class="icon icon-delete1" aria-hidden="true">
                    <use xlink:href="#icon-delete1"></use>
                </svg>
                批量删除
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('0')" v-authority="'ScreenInformation.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量启用
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="onBatchStatus('1')" v-authority="'ScreenInformation.BatchStatus'" style="width: 100px;">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                批量停用
            </el-button>
        </div>


        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                    <el-table-column prop="companyName" label="公司名称">
                    </el-table-column>
                    <el-table-column prop="companyLogo" label="公司logo">
                        <template scope="scope" >
                            <img :src="scope.row.companyLogo" @click="picDetail(scope.row.companyLogo)" width="100" height="100" v-if="scope.row.companyLogo != undefined && scope.row.companyLogo != '' && scope.row.useLogo == 1"/>
                            <span v-if="scope.row.useLogo == 0">{{scope.row.textContent}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="companyBackgroundImage" label="公司背景图">
                        <template scope="scope">
                            <img :src="scope.row.companyBackgroundImage" @click="picDetail(scope.row.companyBackgroundImage)" width="100" height="100" v-if="scope.row.companyBackgroundImage != undefined && scope.row.companyBackgroundImage != ''"/>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="companyAdRotationTime" label="公司广告轮播时间">
                    </el-table-column>-->
                    <el-table-column prop="communityName" label="小区名称">
                    </el-table-column>
                    <el-table-column prop="communityBackgroundImage" label="小区背景图">
                        <template scope="scope">
                            <img :src="scope.row.communityBackgroundImage" @click="picDetail(scope.row.communityBackgroundImage)" width="100" height="100" v-if="scope.row.communityBackgroundImage != undefined && scope.row.communityBackgroundImage != ''"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="communityAdRotationTime" label="小区广告轮播时间">
                    </el-table-column>
                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <!--{{lvl}} &&&
                        {{scope.row.lvl}}-->
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit1(scope.row)"
                                   v-if="lvl === scope.row.lvl && lvl !=0"
                                   v-authority="'ScreenInformation.CompanyEdit'"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <!--v-if="lvl >= scope.row.lvl"-->
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit2(scope.row)"
                                   v-authority="'ScreenInformation.CommunityEdit'"
                                   size="small"
                                   v-if="scope.row.lvl ===0 && lvl ===0">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="deleteScreenInformation(scope.row)"
                                   v-if="lvl === scope.row.lvl && lvl !=0"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <!--v-if="lvl >= scope.row.lvl"-->
                        <el-button type="default" title="删除" class="icon-btn delete" @click="deleteScreenInformation(scope.row)"
                                   size="small"
                                   v-if="scope.row.lvl ===0 && lvl ===0">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="下发数据" class="icon-btn edit" @click="sendScreenInformation(scope.row)" v-authority="'ScreenInformation.CommunityAdd'"
                                   size="small" v-if="lvl == 0">
                            下发数据
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            <!--dialog编辑区-->
              <!--公司账号新增-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="closeCompanyAdd">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules1">
                            <el-form-item label="公司名称" prop="companyName">
                                    <el-input v-model="temp.companyName"
                                              placeholder="请输入公司名称"></el-input>
                            </el-form-item>
                            <el-form-item label="公司标识" prop="useLogo">
                                <el-select v-model="temp.useLogo" placeholder="请选择"  @change="setLogoFlag">
                                    <el-option
                                            v-for="item in logoOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="公司logo" prop="companyLogoBaseStr" v-if="logoFlag == 1">
                                <el-upload
                                        class="avatar-uploader"
                                        :action="actionWhileAdd"
                                        :data="upLoadData"
                                        :show-file-list="false"
                                        :on-success="handleUploadCompanylogoSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        :auto-upload="false"
                                        :on-change="changeFeature1">
                                    <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <div slot="tip" class="el-upload__tip" style="color: red"><sup>*</sup>公司logo图片分辨率208*51</div>
                                </el-upload>

                                <template v-if="img_loading">
                                    <div class="add_img_list">
                                        <p class="map_loading">图片上传中</p>
                                    </div>
                                </template>
                            </el-form-item>
                        <el-form-item label="文字" prop="words" v-if="logoFlag == 0">
                            <el-input  v-model="temp.textContent"
                                      placeholder="请输入公司文字"></el-input>
                        </el-form-item>
                            <el-form-item label="公司背景图" prop="imageUrl2">
                                <el-upload
                                        class="avatar-uploader"
                                        :action="actionWhileAdd"
                                        :data="upLoadData"
                                        :show-file-list="false"
                                        :on-success="handleUploadCompanyBgSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        :auto-upload="false"
                                        :on-change="changeFeature2">
                                    <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>

                                <template v-if="img_loading">
                                    <div class="add_img_list">
                                        <p class="map_loading">图片上传中</p>
                                    </div>
                                </template>
                            </el-form-item>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('form')"
                               @click="update('form')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

             <!--组织账号新增-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleCommunity"
                       @close="resetForm"
                       v-loading="loading2"
                       element-loading-text="PPT上传中"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules2">
                        <el-form-item label="项目名称" prop="communityName" v-authority="'ScreenInformation.CommunityAdd'">
                            <el-input v-model="temp.communityName"
                                      placeholder="请输入项目名称"></el-input>
                        </el-form-item>
                        <el-form-item label="大屏背景图" prop="imageUrl3">
                            <el-upload
                                    class="avatar-uploader"
                                    :action="actionWhileAdd"
                                    :data="upLoadData"
                                    :show-file-list="false"
                                    :on-success="handleUploadCommunityBgSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :auto-upload="false"
                                    :on-change="changeFeature3">
                                <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>

                            <template v-if="img_loading">
                                <div class="add_img_list">
                                    <p class="map_loading">图片上传中</p>
                                </div>
                            </template>
                        </el-form-item>
                        <el-form-item label="使用头像、广告">
                            <el-checkbox v-model="checkedPortrait" label="使用头像" border size="medium" :change="choosePortraitOrNot()"></el-checkbox>
                            <el-checkbox v-model="checkedAdvertisement" label="使用广告" border size="medium" :change="chooseAdOrNot()"></el-checkbox>
                          <!--  <el-select v-model="temp.usePortrait" placeholder="请选择"  @change="setPortraitFlag">
                                <el-option
                                        v-for="item in adOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>-->
                        </el-form-item>

                        <el-form-item label="广告全屏展示" prop="fullScreen" v-if="checkedAdvertisement">
                            <el-switch
                                    id="fullScreenSwitch"
                                    v-model="chooseFullScreen"
                                    on-text="是"
                                    off-text="否">
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="切换广告间隔时间（秒）" prop="advertisementInterval" v-if="chooseFullScreen && checkedAdvertisement">
                            未识别到头像 <el-input type="number" v-model="temp.advertisementInterval"
                                      placeholder="" style="width: 50px;"></el-input> 秒后切换为广告
                        </el-form-item>


                        <el-form-item label="广告轮播时间（秒）" prop="communityAdRotationTime" v-if="checkedAdvertisement">
                            <el-input type="number" v-model="temp.communityAdRotationTime"
                                      placeholder="请输入广告轮播时间"></el-input>
                        </el-form-item>
                    </el-form>


                    <div id="app"  v-if="checkedAdvertisement">
                        <div style="margin-left: 9%;margin-bottom: 16px;color: #000">
                            <label>广告图片</label>
                        </div>
                        <div class="hello">
                            <div class="upload">
                                <div class="upload_warp">
                                    <div class="upload_warp_left" @click="fileClick">
                                        <img src="../../../static/img/upload.png">
                                    </div>
                                    <div class="upload_warp_right" @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">
                                        或者将文件拖到此处
                                    </div>
                                </div>
                                <div class="upload_warp_text">
                                    选中{{imgList.length}}张图片
                                </div>
                                <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none">
                                <div class="upload_warp_img" v-show="imgList.length!=0">
                                    <div class="upload_warp_img_div" v-for="(item,index) in imgList">
                                        <div class="upload_warp_img_div_top">
                                            <div class="upload_warp_img_div_text">
                                                {{item.name}}
                                            </div>
                                            <img src="../../../static/img/del.png" class="upload_warp_img_div_del" @click="fileDel(index)">
                                        </div>
                                        <img :src="item.baseStr">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('form')"
                               @click="update('form')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <!--dialog编辑区-->
            <el-dialog class="dialogForm" title="错误信息" :visible.sync="formVisible" @close="closeForm()">
                <div class="dialogFormBox">
                    <el-input
                            type="textarea"
                            :rows="errorLine"
                            placeholder="错误信息"
                            :disabled="true"
                            v-model="errorTip">
                    </el-input>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeForm()" class="cancel">取 消</el-button>
                    <el-button type="primary" class="confirm," @click="closeForm()">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="原图查看" :visible.sync="picVisible"
                       @close="closeViewPicture()" class="dialogFormWidth800Height600">
                <div style="display:flex;align-items: center;justify-content: center;height: 500px">
                    <img id="pic" src=""/>
                </div>
            </el-dialog>

        </div>
    </div>
</template>
<script src="./ScreenInformation.js"></script>
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

    .add_img_list{
        float: left;
        width: 3.893333333333333rem;
        height: 3.893333333333333rem;
        position: relative;
        padding: 0.213333rem;
        box-sizing: border-box;
    }

    .add_img_list .map_loading{
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




    .upload_warp_img_div_del {
        position: absolute;
        top: 6px;
        width: 16px;
        right: 4px;
    }

    .upload_warp_img_div_top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 30px;
        background-color: rgba(0, 0, 0, 0.4);
        line-height: 30px;
        text-align: left;
        color: #fff;
        font-size: 12px;
        text-indent: 4px;
    }

    .upload_warp_img_div_text {
        white-space: nowrap;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .upload_warp_img_div img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
    }

    .upload_warp_img_div {
        position: relative;
        height: 100px;
        width: 120px;
        border: 1px solid #ccc;
        margin: 0px 30px 10px 0px;
        float: left;
        line-height: 100px;
        display: table-cell;
        text-align: center;
        background-color: #eee;
        cursor: pointer;
    }

    .upload_warp_img {
        border-top: 1px solid #D2D2D2;
        padding: 14px 0 0 14px;
        overflow: hidden
    }

    .upload_warp_text {
        text-align: left;
        margin-bottom: 10px;
        padding-top: 10px;
        text-indent: 14px;
        border-top: 1px solid #ccc;
        font-size: 14px;
    }

    .upload_warp_right {
        float: left;
        width: 57%;
        margin-left: 2%;
        height: 100%;
        border: 1px dashed #999;
        border-radius: 4px;
        line-height: 130px;
        color: #999;
    }

    .upload_warp_left img {
        margin-top: 32px;
    }

    .upload_warp_left {
        float: left;
        width: 40%;
        height: 100%;
        border: 1px dashed #999;
        border-radius: 4px;
        cursor: pointer;
    }

    .upload_warp {
        margin: 14px;
        height: 130px;
    }

    .upload {
        border: 1px solid #ccc;
        background-color: #fff;
        width: 500px;
        box-shadow: 0px 1px 0px #ccc;
        border-radius: 4px;
    }

    .hello {
        width: 500px;
        margin-left: 6%;
        text-align: center;
    }
</style>
