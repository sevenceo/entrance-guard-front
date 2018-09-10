<template>
    <el-upload
            class="avatar-uploader"
            :action="upLoadApi"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="materialApi + imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
    export default {
        data() {
            return {
                imageUrl: '',
                materialApi: process.env.MATERIAL_API,
                upLoadApi: process.env.UPLOAD_API + 'material/api/file/upload',


            };
        },
        props: ['value'],
        methods: {
            handleAvatarSuccess(res, file) {
//                this.imageUrl = URL.createObjectURL(file.raw);
                this.imageUrl = res;
                this.$emit('success', this.imageUrl);
            },
            beforeAvatarUpload(file) {

                const isWBMP = file.type === 'image/wmp';

                const isJepg = file.type === 'image/jpeg';
                const isJpg = file.type === 'image/jpg';
                const isPng = file.type === 'image/png';
                const isBmp = file.type === 'image/bmp';
                const isGif = file.type === 'image/gif';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJepg && !isJpg && !isPng && !isBmp && !isGif && !isWBMP) {
                    this.$message({
                        message: '图片类型必须是gif,jpeg,jpg,png,bmp中的一种',
                        type:'error'
                    });
                    return false
                }
                if (!isLt2M) {
                    this.$message({
                        message: '图片大小不能超过2MB',
                        type:'error'
                    });
                    return false
                }
            }
        }
    }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
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

</style>