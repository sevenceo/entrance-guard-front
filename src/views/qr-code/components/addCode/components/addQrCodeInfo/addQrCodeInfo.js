
import moment from 'moment'

import store from 'store'

//组件级变量
let selectionData = []

export default {
    created(){
        this.$store.commit('SET_ACTIVIINDEX',this.activeIndex)
    },
    data() {
        let that = this
        return {
            date: '',
            selectedCode: '',
            codeNum:'等待创建',
            imageUrl:process.env.MATERIAL_API,
            mediaUrl:process.env.MATERIAL_API,
            activeIndex: '02',
            actionType: this.$store.state.weChatActivityData.actionType,
            // materialContent: this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[0].materialContent
        }
    },
    methods: {
        getSelectedTempMaterial(value,type) {
            this.tempMaterial.materialType = type
            this.tempMaterial.materialId = value.id
            this.tempMaterial.materialName = value.name
            this.materialContent.serverUrl = value.serverUrl
            this.materialContent.picUrl = value.picUrl
            this.materialContent.url = value.url
            this.materialContent.content = value.content
            this.materialContent.mediaId = value.mediaId
            console.log(this.materialContent)

            this.$store.commit('SET_MATERIAL',
                {
                    materialId: this.tempMaterial.materialId,
                    materialName: this.tempMaterial.materialName,
                    materialType: this.tempMaterial.materialType,
                    materialContent:this.materialContent
                }
            )
        }
    },
    computed : {
        tempMaterial(){
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex]
        },
        tabIndex(){
            return this.$store.state.weChatActivityData.tabIndex
        },
        materialContent(){
            return JSON.parse(this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex].materialContent)
        }

    },
    watch : {
        tabIndex : function () {
            console.log('change mt')
            console.log(this.tabIndex)
            console.log(this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex])
            console.log('change mt2')
            console.log(this.tempMaterial)

        }
    }
}


