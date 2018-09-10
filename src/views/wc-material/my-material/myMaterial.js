/**
 * Created by zhaimaojin on 2017/9/20.
 */

import {
    CreateText,
    UpdateText,
    AvatarUpload,
    CreateExternalLinks,
    UpdateExternalLinks,
    CreateImage,
    UpdateImage,
    CreateVideo,
    UpdateVideo,
    CreateVoice,
    UpdateVoice
} from './api/myMaterialApi'

export default {
    created() {
    },
    data() {
        return {

        }
    },
    methods: {

        resetForm() {
            this.$refs['temp'].resetFields();
            this.temp = []
        },
        cancel() {
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false
        },

    }
}


