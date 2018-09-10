<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'SystemConfig.SystemUser.Create'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="exportAll()" v-authority="'SystemConfig.SystemUser.export'" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                导出
            </el-button>
            <el-button class="btn btn-edit" type="primary" @click="onSearch"  >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
            <el-button  type="primary" size="small" v-authority="'SystemConfig.SystemUser.import'">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                <a href="/static/excel/usertemplate.xlsx" download="用户模板.xlsx">下载模板</a>
            </el-button>
            <el-upload
                class="upload-excel"
                :action="upLoadApi"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload = "beforeUpload"
                :show-file-list = "false"
                >
                <el-button size="small" type="primary" :loading="uploadFileFlag" v-authority="'SystemConfig.SystemUser.import'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-baocun"></use>
                    </svg>
                    导入用户
                </el-button>
            </el-upload>
        </div>
        <div>
            <!--表格-->
            <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                <el-table-column prop="login" label="用户名">
                </el-table-column>
                <el-table-column label="角色名">
                    <template scope="scope">
                        <tr-roles :roles="scope"></tr-roles>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="realname" label="真实姓名"></el-table-column>
                <el-table-column prop="phone" label="手机号码">
                </el-table-column>
                <el-table-column prop="bewrite" label="摘要信息"></el-table-column>
                <el-table-column label="是否启用">
                    <template scope="scope">
                        <span>{{scope.row.isEnable ? "是" : "否"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="操作" align="center" width="130">
                    <template scope="scope">
                        <el-button type="default" title="编辑" class="icon-btn edit" @click="onEdit(scope.row)" size="small" v-authority="'SystemConfig.SystemUser.Modify'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-edit1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="删除" class="icon-btn delete" @click="onDelete(scope.row)" size="small" v-authority="'SystemConfig.SystemUser.Remove'">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-delete1"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="重置密码" class="icon-btn edit" @click="resetPassword(scope.row)" size="small" v-authority="'SystemConfig.SystemUser.ResetPassword'" v-if="scope.row.isEnable">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-yaoshi"></use>
                            </svg>
                        </el-button>
                        <el-button type="default" title="解除锁定" class="icon-btn edit" @click="unLockUser(scope.row)" size="small" v-authority="'SystemConfig.SystemUser.Unlock'" v-if="scope.row.isEnable">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-jiesuo"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="totalPage" v-on:pageChange="handleCurrentChange1"></pagination>
            <!--dialog编辑区-->
            <el-dialog class="dialogForm" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="resetForm">
                <div class="dialogFormBox">
                <el-form class="small-space" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'
                         :model="temp"
                         ref="userForm"
                         :rules="userRules">
                    <el-form-item label="真实姓名" prop="realname">
                        <el-input v-model="temp.realname" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="login">
                        <el-input v-model="temp.login" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="temp.password" placeholder="请输入密码（不少于6位）"></el-input>
                    </el-form-item>
                    <el-form-item label="重复密码" prop="password2">
                        <el-input type="password" v-model="temp.password2" placeholder="请重复密码"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" class="character" prop="rolesStr">
                        <!--<el-input v-model="temp.rolesStr" class="hide"></el-input>-->
                        <el-input v-model="temp.rolesStr" @focus="onAddUser" placeholder="请选择角色"></el-input>
                    </el-form-item>
                    <el-form-item label="组织机构" class="organizationId" prop="organizationid">
                        <el-input v-model="temp.organizationid" class="hide"></el-input>
                        <organizationTree :title="organizationName" @organizationKey = 'getOrganization' :organizationName="organizationName"></organizationTree>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="temp.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="temp.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                        <el-form-item label="摘要信息">
                            <el-input v-model="temp.bewrite"></el-input>
                        </el-form-item>

                        <el-form-item label="是否启用">
                            <el-switch
                                    v-model="temp.isEnable"
                                    on-text=""
                                    off-text="">
                            </el-switch>
                        </el-form-item>

                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="cancel">取 消</el-button>
                    <el-button v-if="dialogStatus === 'create' " type="primary" class="confirm,"
                               @keyup.enter="create"
                               @click="create"
                               :loading="$store.state.app.onXHR">
                        确 定</el-button>
                    <el-button v-else type="primary" class="update"
                               @keyup.enter="update('userForm')"
                               @click="update('userForm')"
                               :loading="$store.state.app.onXHR">
                        确 定</el-button>
                </div>
            </el-dialog>
            <!--筛选区-->
            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form v-model="pageParam" labelPosition="">
                    <el-form-item label="用户名">
                        <el-input v-model="pageParam.userName" style="ime-mode:disabled" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="pageParam.realName" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="pageParam.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="号码">
                        <el-input v-model="pageParam.phone" placeholder="请输入号码"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用">
                        <el-switch
                                v-model="pageParam.isEnable"
                                on-text="是"
                                off-text="否">
                        </el-switch>
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
                <el-button  type="primary" class="confirm,"  @click="closeForm()">确 定</el-button>
            </div>
        </el-dialog>

            <!-- dialog角色选择区 -->
            <el-dialog class="dialogForm" title="选择角色"v-if="dialogFormUsers" :visible.sync="dialogFormUsers" >
                <ul class="usersManageList">
                    <li class="ico_uuaCheck" v-for="(user,index) in uaaList">
                        <input :id="index" :name="user.id" :vname="user.name" :value="user.id" type="checkbox"><label :for="index">{{user.name}}</label>
                    </li>
                </ul>
                <div class="el-dialog__footer" style="text-align:right;">
                    <el-button type="primary" class="confirm," @click="addUsers">确 定</el-button>
                </div>
                
            </el-dialog>
        </div>
    </div>
</template>
<script src="./userManager.js"></script>

<style scoped rel="stylesheet/scss" lang="scss" >
    .user-filter-container{
        float: right;
        margin:15px 0 10px;
        padding-bottom: 0;
    }
    .upload-excel{
        float: right;
        margin:0px 15px 10px;
        padding-bottom: 0;
    }
    .ico_uuaCheck i{
        display:inline-block;width:18px;height:18px;border:solid 1px #ccc;float: left;
        border-radius:5px;
    }
    .ico_uuaCheck i.icoChecked{
        background:#408ed6;
    }
    .ico_uuaCheck input{
        float: left;margin-top:-20px;
    }
    input[type="checkbox"]:checked+label::before{
        border: 1px #dddddd solid;cursor: pointer;
        background: url("../../assets/selected.png") 50% 50% no-repeat;
    }
    .usersManageList{
        list-style-type: none;
        height:350px;
        min-height:300px;
        overflow-y:auto;
    }
    .ico_uuaCheck label::before{
        content: "";
        display: inline-block;
        width: 18px;
        height: 18px;
        background: #ffffff;
        vertical-align: middle;
        -webkit-border-radius: 25%;
        margin-right: 15px;
        -webkit-box-sizing: border-box;
        border: 1px #dddddd solid;
        cursor: pointer;
    }
    .usersManageList li{
        line-height: 28px;overflow: hidden;margin-bottom:5px;text-overflow: ellipsis;white-space: nowrap;
    }
</style>
