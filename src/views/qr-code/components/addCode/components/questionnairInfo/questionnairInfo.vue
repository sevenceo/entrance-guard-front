<template>
    <div>
        <div class="child-code">

            <!--问卷名称，问卷作者，背景图，问卷说明-->

            <el-form style="width: 800px" ref="temp" :model="temp" label-width="80px" :rules="rules">

                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="问卷名称" prop="name">
                            <el-input v-model="temp.name" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="问卷作者" prop="author">
                            <el-input v-model="temp.author" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="背景图片" prop="backgroundPic">
                            <el-upload class="avatar-uploader" :action="upLoadApi" :on-success="handleAvatarSuccess"
                                       :show-file-list="false" :before-upload="avatarUpload" :disabled="isDisabled">
                                <img v-if="temp.backgroundPic" :src="imageUrl + temp.backgroundPic" style="width: 100px;height: 100px;" class="avatar">
                                <i v-else class="el-icon-plus
                            avatar-uploader-icon
                             material-icon"></i>
                            </el-upload>
                            <el-input v-model="temp.picUrl" v-show="false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>-->

                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="摘要信息" prop="description">
                            <el-input type="textarea" :disabled="isDisabled" v-model="temp.desc"
                                      :autosize="{ minRows: 6, maxRows: 8}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script src="./questionnairInfo.js">

</script>

<style src="./questionnairInfo.scss" scoped>

</style>