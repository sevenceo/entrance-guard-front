import moment from 'moment'

import store from 'store'

import {GetBaseData} from "src/views/qr-code/api/qrCodeApi";

//组件级变量
let selectionData = []

export default {
    created() {
        // this.getBaseData()
        if(this.actionType === '新增'){

            this.$store.commit('SET_TPLCODE', {
                activityTemplateCode: '003',
                activityTemplateName: '问卷活动'
            })
        }

    },
    data() {
        return {
            rules: {
                name: [
                    {required: true, message: '请填写活动名'},
                    {max: 100, message: '活动名不可超过100个字', trigger: 'blur' }
                ],
                author: [
                    {required: true, message: '请填写活动编码'},
                    {max: 50, message: '活动编码不可超过50个字', trigger: 'blur' }
                ]
            },
            upLoadApi: process.env.UPLOAD_API + 'material/api/file/upload',
            imageUrl: process.env.MATERIAL_API,
            showRules:true,
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
            console.log(file)
            this.serverUrl = this.imageUrl + file.response
            this.temp.backgroundPic = file.response
        },
        avatarUpload(file) {

            const isJepg = file.type === 'image/jpeg';
            const isJpg = file.type === 'image/jpg';
            const isPng = file.type === 'image/png';
            const isBmp = file.type === 'image/bmp';
            const isGif = file.type === 'image/gif';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJepg && !isJpg && !isPng && !isBmp && !isGif) {
                this.$message(
                    {
                        message: "图片类型必须是gif,jpeg,jpg,png,bmp中的一种",
                        type:'error'
                    }
                );
                return false
            }
            if (!isLt2M) {
                this.$message(
                    {
                        message: '上传头像图片大小不能超过 2MB!',
                        type:'error'
                    }
                );
                return false
            }
        },
    },

    computed: {
        temp() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.questionnaireDTO
        },
        actionType() {
            return this.$store.state.weChatActivityData.actionType
        },
        isDisabled() {
            console.log('done')
            return isDisabledInit(this.actionType === '查看')
        }
    },
    watch: {
        actionType: function () {

        }
    }

}


function tempMaterialInit() {
    return {
        pushType: "",
        materialId: "",
        materialName: "",
        materialUrl: "",
        serverUrl: "",
        picUrl: "",
        url: "",
        mediaId: "",
        picurl: ""
    }
}

function isDisabledInit(item) {
    if (item) {
        console.log('正确')
        return true
    } else {
        console.log('错误')
        return false
    }
}