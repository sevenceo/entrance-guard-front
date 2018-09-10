<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd"  v-authority="'VisitorRecord.Create'" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch" v-authority="'VisitorRecord.Search'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <el-table-column prop="communityName" label="租户" width="120px">
                </el-table-column>
                <el-table-column prop="visitorName" label="姓名">
                </el-table-column>
                <el-table-column prop="identityCard" label="身份证号">
                </el-table-column>
                <el-table-column prop="mobilePhone" label="手机号">
                </el-table-column>
                <el-table-column prop="sex" label="性别" :formatter="formatSex">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="beginTime" label="开始时间" width="150px">
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="150px">
                </el-table-column>
                <el-table-column prop="isApproval" label="审核状态" :formatter="formatApproval">
                </el-table-column>
                <el-table-column prop="type" label="类型" :formatter="formatType">
                </el-table-column>

                <el-table-column prop="type" label="操作" align="center" width="120">
                    <template scope="scope">
                        <el-button type="default" title="修改" class="icon-btn edit"
                                   @click="onEdit(scope.row)" size="small" v-authority="'VisitorRecord.Editor'">
                            修改
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>

            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                    <el-form-item label="姓名" prop="visitorName">
                        <el-input v-model="pageParam.visitorName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobilePhone">
                        <el-input v-model="pageParam.mobilePhone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="isApproval">
                        <el-select v-model="pageParam.isApproval" placeholder="请选择状态">
                            <el-option label="未审核" value="0"></el-option>
                            <el-option label="成功" value="1"></el-option>
                            <el-option label="拒绝" value="2"></el-option>
                            <el-option label="待提交" value="3"></el-option>
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

            <!--dialog编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="closeAdd()">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="120px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="姓名" prop="visitorName">
                            <el-input v-model="temp.visitorName"
                                      placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="temp.sex">
                                <el-radio class="radio" label="1">男</el-radio>
                                <el-radio class="radio" label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model="temp.mobilePhone" :maxlength="11" placeholder="请输入手机号" v-on:blur="getFacePhotoByPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="受访人手机号" prop="auditorPhone">
                            <el-input v-model="temp.auditorPhone" :maxlength="11" placeholder="请输入受访人手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证" prop="identityCard">
                            <el-input v-model="temp.identityCard" :maxlength="18" placeholder="请输入身份证号"></el-input>
                        </el-form-item>
                        <el-form-item label="资源" prop="resourceId">
                            <el-input v-model="temp.resourceName" placeholder="资源" :readonly="true" @focus="showParentTree"></el-input>
                            <template v-if="parentTree">
                                <div style="position: absolute;width: 100%;height: 200px;z-index:999;overflow:auto;background-color: white;">
                                    <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 200px;"> </el-input>
                                    <button style="cursor: pointer;" class="btn btn-ddefault" @click="parentTree=false">关闭</button>
                                    <el-tree class="communityTreeFY"
                                             ref="tenantTree"
                                             :data="treeData"
                                             :props="props"
                                             @node-click="nodeClick"
                                             :filter-node-method="filterTenantNode"
                                    >
                                    </el-tree>
                                </div>
                            </template>
                        </el-form-item>
                        <el-form-item label="关系">
                            <el-input value="访客" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="起始时间" prop="beginTime">
                            <el-date-picker
                                    v-model="temp.beginTime"
                                    type="datetime"
                                    placeholder="选择日期范围"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="endTime">
                            <el-date-picker
                                    v-model="temp.endTime"
                                    type="datetime"
                                    placeholder="选择日期范围"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="头像" prop="imageUrl">
                            <img v-if="imageUrl" :src="imageUrl" style="width: 100px; height: 100px;" class="avatar" @click="showCropperDialog">
                            <i v-else class="el-icon-plus avatar-uploader-icon" style="cursor: pointer" @click="showCropperDialog"></i>
                            <!--<el-upload
                                    class="avatar-uploader"
                                    :action="actionWhileAdd"
                                    :data="upLoadData"
                                    :show-file-list="false"
                                    :on-success="handleUploadSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :auto-upload="false"
                                    :on-change="changeFeature">
                                <img v-if="imageUrl" :src="imageUrl" style="width: 100px; height: 100px;" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>-->
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="temp.email" type="email"
                                      placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeAdd" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        提交
                    </el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('form')"
                               @click="update('form')"
                               :loading="$store.state.app.onXHR">
                        提交
                    </el-button>
                </div>
            </el-dialog>

            <!--croperDialog截取图片-->
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
        </div>
    </div>
</template>
<script src="./visitorRecord.js"></script>

<style lang="scss">
    .communityTreeFY{
    }
    .communityTreeFY .is-current > .el-tree-node__content{
        background-color: #E4E8F1 !important;
    }
    .audit-header{
        padding: 20px 0px;
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

