<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">

        </div>

            <el-row :span="24">
                <el-col :span="24">
                    <div style="background-color: white;width:100%;padding: 6px 8px;">
                        <el-form class="small-space" label-position="left" label-width="160px"
                                 style='margin-left:20px;'
                                 :model="humanAuditSetting"
                                 ref="opendoorForm"
                                 :rules="rules">
                            <el-form-item label="业主必填资料：">
                                <el-checkbox v-model="humanAuditSetting.idCardPhotoFlag" disabled>身份证照片</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox v-model="humanAuditSetting.idCardNoFlag" disabled>身份证号码</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox v-model="humanAuditSetting.certificateFlag" disabled>房产信息</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-radio v-model="humanAuditSetting.certificateTypeFlag" label="0">房产证照片</el-radio>
                                <el-radio v-model="humanAuditSetting.certificateTypeFlag" label="1">楼栋单元房号信息</el-radio>
                            </el-form-item>
                            <el-form-item>
                                <label style="color:red">* 无业主房产档案的，建议使用房产证照片作为业主身份验证凭据</label>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox v-model="humanAuditSetting.readFlag">我已阅读</el-checkbox>
                                <a style="color: blue;" @click="read">《智能门禁管理系统免责声明》</a>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="update"
                                           @click="set()" :disabled="!humanAuditSetting.readFlag">
                                    确定
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>


        <el-dialog class="dialogForm" title="智能门禁管理系统免责声明" :visible.sync="declareVisible">
            <div class="dialogFormBox" style="text-indent:28px">
                <p>  1、在您对用户信息进行审核并给用户进行门禁授权时，应当对您设置的用户必填资料项承担相应的责任，并且对用户上传的所有信息可靠性作出判断和评估。由您设置的用户必填资料项以及您审核通过的用户信息，所造成的所有风险和责任由您独自承担，我们对此不承担任何法律责任。</p>
                <p>  2、所有的用户信息（包括但不限于用户手机号、身份证照片、身份证号、房产信息及相关证件等）均为用户上传，智能通行系统平台及相关产品仅提供展示及审核功能，本平台不对其内容的准确性、可靠性、正当性、安全性、合法性等负责，亦不承担任何法律责任。</p>
                <p>  3、所有的用户信息仅供您在本产品及相关平台使用，不得私自泄露或用于其他商业或其他用途，否则，一切后果均由您自己承担，我们对此不承担任何法律责任。</p>
                <p>  4、以任何方式登录或者进入本平台或直接、间接使用上述信息资料，我们均视为您自愿接受并完全同意本声明。</p>
            </div>
        </el-dialog>
    </div>
</template>

<script src="./humanAuditSetting.js" />