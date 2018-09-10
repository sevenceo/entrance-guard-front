<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <el-table-column prop="corpCode" label="企业编码">
                </el-table-column>
                <el-table-column prop="corpName" label="企业名称">
                </el-table-column>
                <el-table-column prop="domainName" label="企业域名">
                </el-table-column>
                <el-table-column prop="logo" label="企业logo">
                    <template scope="scope">
                        <img :src="scope.row.logo" @click="picDetail(scope.row.logo)" width="100" height="100" v-if="scope.row.logo != undefined && scope.row.logo != ''"/>
                    </template>
                </el-table-column>
                <el-table-column prop="copyright" label="版权信息">
                </el-table-column>
                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)"
                                   size="small">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange1"></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                       @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" label-position="left" label-width="100px"
                             style='width: 400px; margin-left:50px;'
                             :model="temp"
                             ref="form"
                             :rules="rules">
                        <el-form-item label="企业编码" prop="corpCode">
                            <el-input v-model="temp.corpCode" placeholder="请输入企业编码"></el-input>
                        </el-form-item>
                        <el-form-item label="企业名称" prop="corpName">
                            <el-input v-model="temp.corpName" placeholder="请输入企业名称"></el-input>
                        </el-form-item>
                        <el-form-item label="企业域名" prop="corpName">
                            <el-input v-model="temp.domainName" placeholder="请输入企业域名"></el-input>
                        </el-form-item>
                        <el-form-item label="企业logo" prop="logo">
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
                        <el-form-item label="版权信息" prop="corpName">
                            <el-input v-model="temp.copyright" placeholder="请输入企业名称"></el-input>
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


            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                    <el-form-item label="企业编码">
                        <el-input v-model="pageParam.corpCode" style="ime-mode:disabled"
                                  placeholder="请输入企业编码"></el-input>
                    </el-form-item>
                    <el-form-item label="企业名称">
                        <el-input v-model="pageParam.corpName" placeholder="请输入企业名称"></el-input>
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
<script src="./companyManage.js"></script>

<!--<style scoped rel="stylesheet/scss" lang="scss">-->
    <!--.user-filter-container {-->
        <!--float: right;-->
        <!--margin: 15px 0 10px;-->
        <!--padding-bottom: 0;-->
    <!--}-->

<!--</style>-->
