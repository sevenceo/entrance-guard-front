<template>
    <div>
        <div class="account-part">
            <!--面包屑-->
            <breadcrumb></breadcrumb>
            <!--操作区-->
            <div class="filter-container account-filter-container" :model="searchVal">
                
                <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'SystemConfig.Account.Create'" >
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    新增
                </el-button>
                <el-button class="btn btn-add" type="primary" @click="onEdit"  v-authority="'SystemConfig.Account.Modify'"  >
                    <svg class="icon icon-edit1" aria-hidden="true">
                        <use xlink:href="#icon-edit1"></use>
                    </svg>
                    编辑
                </el-button>
                <el-button class="btn btn-edit" type="primary" @click="onSearch"  >
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-filter"></use>
                    </svg>
                    筛选
                </el-button>
                <el-button class="btn btn-delete" type="danger"  @click="onDel" v-authority="'SystemConfig.Account.Remove'" >
                    <svg class="icon icon-delete1" aria-hidden="true">
                        <use xlink:href="#icon-delete1"></use>
                    </svg>
                    删除
                </el-button>
            </div>
            <!--展示区-->
            <dataTable :tableData ="formData" v-on:selectionChange="handleSelectionChange" />
            <!--筛选区-->

            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" ref="searchForm">
                    <el-form-item label="公众号名称">
                        <el-input v-model="pageParam.name" style="ime-mode:disabled" placeholder="请输入公众号名称"></el-input>
                    </el-form-item>
                    <el-form-item label="公众号账号">
                        <el-input v-model="pageParam.account" style="ime-mode:disabled" placeholder="请输入公众号账号"></el-input>
                    </el-form-item>
                    <el-form-item label="组织机构" class="organizationId">
                        <el-input v-model="pageParam.organizationId" class="hide"></el-input>
                        <organizationTree @organizationKey = 'getSearchOrganization' :organizationName="organizationName" ></organizationTree>
                    </el-form-item>
                    <el-form-item label="数据库实例">
                        <el-select class="filter-item" style="float: left" v-model="pageParam.dbInstanceId" placeholder="请选择数据库实例">
                            <el-option v-for="item in  dbListInSearchBox" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-reset reset" type="default" @click="resetSearchBox">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" @click="search" type="default">
                        筛选
                    </el-button>
                </div>
            </el-dialog>

            <!--分页-->
            <pagination :total="totalPage" ref="pages" v-on:pageChange="handleCurrentChange"></pagination>
            <!--编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" @close="resetForm">
                <div class="dialogFormBox">
                    <el-form class="small-space" :model="temp" ref="temp" :rules="rules" label-position="left" label-width="110px" style='width: 400px; margin-left:50px;'>
                    <el-form-item label="公众号名称" prop="name">
                        <el-input v-model="temp.name" placeholder="请输入公众号名称"></el-input>
                    </el-form-item>
                    <el-form-item label="公众号账号"  prop="account">
                        <el-input v-model="temp.account"  :disabled="dialogStatus !== 'create'"  placeholder="请输入公众号账号"></el-input>
                    </el-form-item>
                    <el-form-item label="图片上传" prop="imageUrl">
                        <el-upload class="avatar-uploader"  :action="upLoadApi"  :on-success="handleAvatarSuccess" :show-file-list="false" :before-upload="avatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus
                        avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="组织机构" class="organizationId" prop="organizationId" name="organizationId">
                        <el-input v-model="temp.organizationId" class="hide"></el-input>
                        <organizationTree @organizationKey = 'getOrganization' :organizationName="organizationName"></organizationTree>
                    </el-form-item>

                    <el-form-item label="数据库实例" >
                        <el-select class="filter-item" :disabled="dialogStatus !== 'create'"  v-model="temp.dbInstanceId" placeholder="若不选择则自动分配">
                            <el-option v-for="item in  selectionList" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                        <el-form-item label="应用编号" prop="appId">
                            <el-input v-model="temp.appId" placeholder="请输入应用编号"></el-input>
                        </el-form-item>
                        <el-form-item label="应用密匙" prop="appSecret">
                            <el-input v-model="temp.appSecret" placeholder="请输入应用密匙"></el-input>
                        </el-form-item>
                        <el-form-item label="应用令牌" prop="appToken">
                            <el-input v-model="temp.appToken" placeholder="请输入应用令牌"></el-input>
                        </el-form-item>
                        <el-form-item label="消息内容解密Key" prop="aesKey">
                            <el-input v-model="temp.aesKey" placeholder="请输入消息内容解密Key"></el-input>
                        </el-form-item>
                        <el-form-item label="页面授权回调地址" prop="oAuthServerDomainName" v-show="false">
                            <el-input v-model="temp.oAuthServerDomainName" placeholder="请输入授权回调页面域名"></el-input>
                        </el-form-item>
                    </el-form> 
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel('temp')" type="default">取 消</el-button>
                    <el-button v-if="dialogStatus=='create'" type="primary" :loading="$store.state.app.onXHR" @click="create('temp')">确 定</el-button>
                    <el-button v-else type="primary" @click="update('temp')" :loading="$store.state.app.onXHR">确 定</el-button>
                </div>
            </el-dialog>

        </div>

    </div>
</template>

<script src="./wcAccount.js"></script>
<style scoped src="./wcAccount.scss"></style>
