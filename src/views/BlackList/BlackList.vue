
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
                <el-table-column prop="blackListRemark" label="加入原因">
                </el-table-column>
                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
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
                    </template>N
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange" ></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" title="新增黑名单" :visible.sync="dialogFormVisible"
                       @close="resetForm">

                <div class="">
                  <!--  <el-button class="btn btn-add" type="primary" @click="addHuman()">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        新增
                    </el-button>-->
                    <el-button class="btn btn-edit" type="primary" @click="onSearch" ><!--v-authority="'BlackList.Search'"-->
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-filter"></use>
                        </svg>
                        筛选
                    </el-button>
                </div>
                <div class="audit-body" style="margin-top: 10px;">
                    <el-table :data="humanSelect" border stripe style="width: 100%" class="blue-table"
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
                    <pagination ref="pagesHuman" :total="rowHumanTotal" v-on:pageChange="handleHumanCurrentChange" v-if="paginationShow"></pagination>
                </div>
                <el-form :model="temp" labelPosition="" :rules="reasonRules" ref="blackListReason">
                    <el-form-item label="加入黑名单原因" prop="blackListRemark">
                        <el-input v-model="temp.blackListRemark"
                                  placeholder="请输加入黑名单原因"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-add" type="primary" @click="matchHuman('blackListReason')"
                               style="width: 100px;float: right;margin: 10px 0px;">
                        <svg class="icon icon-add1" aria-hidden="true">
                            <use xlink:href="#icon-add1"></use>
                        </svg>
                        匹配人员
                    </el-button>
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


            <el-dialog class="dialogForm" title="新增人员" :visible.sync="newHumanVisible"
                       @close="closeAddHuman()">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="addHumanTemp"
                             ref="form"
                             :rules="rules">
                        <!--<el-form-item label="人脸照片" prop="facePhoto">-->
                        <!--<el-input v-model="temp.facePhoto"-->
                        <!--placeholder="请输入人脸照片"></el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="姓名" prop="realName">
                            <el-input v-model="addHumanTemp.realName"
                                      placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model="addHumanTemp.mobilePhone" :maxlength="11"
                                      placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="身份" prop="identity">
                            <el-select v-model="addHumanTemp.identity" placeholder="请选择">
                                <el-option
                                        v-for="item in identityList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="头像" prop="imageUrl">
                            <!--<el-input v-model="temp.idNo" :maxlength="18"
                                      placeholder="请输入身份证号"></el-input>-->
                            <!-- <el-upload
                                     class="avatar-uploader"
                                     action="https://jsonplaceholder.typicode.com/posts/"
                                     :show-file-list="false"
                                     :on-success="handleAvatarSuccess"
                                     :before-upload="beforeAvatarUpload">
                                 <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                 <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                             </el-upload>-->
                            <!--<el-upload-->
                            <!--class="avatar-uploader"-->
                            <!--:action="action"-->
                            <!--:show-file-list="false"-->
                            <!--:on-change="changeFeature">-->
                            <!--<img v-if="addHumanTemp.imageUrlFlag" :src="imageUrl" class="avatar">-->
                            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                            <!--</el-upload>-->
                            <img v-if="addHumanTemp.imageUrlFlag" :src="imageUrl" style="width: 100px; height: 100px;" class="avatar" @click="showCropperDialog">
                            <i v-else class="el-icon-plus avatar-uploader-icon" style="cursor: pointer" @click="showCropperDialog"></i>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="addHumanTemp.gender" placeholder="请选择">
                                <el-option
                                        v-for="item in genders"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idNo">
                            <el-input v-model="addHumanTemp.idNo" :maxlength="18"
                                      placeholder="请输入身份证号"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model="addHumanTemp.age" :maxlength="3"
                                      placeholder="请输入年龄"></el-input>
                        </el-form-item>

                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addHumanTemp.email" type="email"
                                      placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="addHumanTemp.remark"
                                      placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" class="update"
                               @keyup.enter="createNewHuman('form')"
                               @click="createNewHuman('form')"
                               :loading="$store.state.app.onXHR">
                        确 定
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog class="dialogCropperForm" title="头像" :visible.sync="dialogCropperFormVisible"
                       @open="initCropper()" @close="closeCropper()">
                <div style="display:flex;">
                    <div class="info-item" style="flex:1;margin-left:-160px;margin-top:30px;">
                        <div class="line" style="margin-left: -280px;margin-top: 85px;">
                            <div class="cropper-content" style="margin-top:-60px;margin-left:260px;">
                                <div class="cropper">
                                    <vueCropper
                                            ref="cropper"
                                            :img="option.img"
                                            :outputSize="option.size"
                                            :outputType="option.outputType"
                                            :info="true"
                                            :full="option.full"
                                            :canMove="option.canMove"
                                            :canMoveBox="option.canMoveBox"
                                            :original="option.original"
                                            :autoCrop="option.autoCrop"
                                            :autoCropWidth="option.autoCropWidth"
                                            :autoCropHeight="option.autoCropHeight"
                                            :fixedBox="option.fixedBox"
                                            @realTime="realTime"
                                            @imgLoad="imgLoad"
                                    ></vueCropper>
                                </div>
                                <div style="margin-left:20px;">
                                    <div class="show-preview" :style="{'width': '238px', 'height':'238px',  'overflow': 'hidden', 'margin': '5px'}">
                                        <div :style="previews.div" class="preview">
                                            <img :src="previews.url" :style="previews.img">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="width: 1000px;padding: 10px 40px 5px 300px">
                            <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;background-color: #4D84BA;color:white;cursor: pointer;">选择图片</label>
                            <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)"/>
                            <button class="btn btn-orange" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;" @click="changeScale(1)">放大</button>
                            <button class="btn btn-orange" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;" @click="changeScale(-1)">缩小</button>
                            <button class="btn btn-orange" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;" @click="rotateLeft">左旋转</button>
                            <button class="btn btn-orange" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;" @click="rotateRight">右旋转</button>
                            <button class="btn btn-orange" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;cursor: pointer;" @click="down('blob')">下载</button>
                            <button class="btn btn-orange" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;background-color: #4D84BA;color:white;cursor: pointer;" @click="finish('base64')">确定</button>
                        </div>
                    </div>
                </div>
            </el-dialog>

            <el-dialog class="dialogForm" title="编辑黑名单" :visible.sync="blackListEdit" @close="cancelEdit()">
                <el-form :model="temp" labelPosition="" :rules="reasonRules" ref="blackListReason">
                    <el-form-item label="加入黑名单原因" prop="blackListRemark">
                        <el-input v-model="temp.blackListRemark"
                                  placeholder="请输加入黑名单原因"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit" class="cancel">取 消</el-button>
                    <el-button type="primary" class="update"
                               @keyup.enter="update('blackListReason')"
                               @click="update('blackListReason')"
                               :loading="$store.state.app.onXHR">
                        确 定
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
        </div>
    </div>
</template>
<script src="./BlackList.js"></script>

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
