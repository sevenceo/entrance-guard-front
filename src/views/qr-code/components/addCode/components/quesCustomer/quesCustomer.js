import moment from 'moment'

import store from 'store'

import {GetFieldData} from "src/views/qr-code/api/qrCodeApi";
import {GetActivityById} from "../../../../api/qrCodeApi";



//组件级变量

export default {
    created() {
        if(this.actionType === '新增'){

            this.$store.commit('SET_TPLCODE', {
                activityTemplateCode: '003',
                activityTemplateName: '问卷活动'
            })
        }else {
            this.getActivityById()
        }
        this.getFieldData()
    },
    data() {
        return {
            checkedItems: [],
            checkBoxList:[],
            account:this.$store.state.weChatAccount.accountInfo.account,
            activityId: this.$router.currentRoute.params.id
        };
    },

    methods: {
        checkCheck(val){
            console.log(this.checkedItems)
            let selected = []
            for(let v of this.checkedItems){
                for(let m of this.checkBoxList){
                    if(v === m.fieldZhName){
                        selected.push(
                            {
                                isRequired: true,
                                fieldName: m.fieldName,
                                fieldZhName: m.fieldZhName
                            }
                        )
                    }
                }
            }
            this.$store.commit('SET_CUSTOMERITEMS', selected)
        },
        getFieldData(){
            GetFieldData(this.account)
                .then(response => {
                    console.log(response)
                    this.checkBoxList = response.data.fieldDTOS
                })
        },
        getActivityById() {
            GetActivityById(this.account, this.activityId)
                .then(response => {

                    this.$store.commit('SET_ACTIVITYDATA', response.data)

                    console.log('获取后提交数据')

                    console.log(this.$store.state.weChatActivityData.activityData)

                    let item = []
                    for(let i of response.data.jsonDataDetail.questionnaireDTO.customerItems){
                        item.push(i.fieldZhName)
                    }
                    this.checkedItems = item

                })
        }
    },
    computed: {
        actionType() {
            return this.$store.state.weChatActivityData.actionType
        },
        checkOptions() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.questionnaireDTO.customerItems
        },
        isDisabled() {
            console.log('done')
            return isDisabledInit(this.actionType === '查看')
        }
    },
    watch: {
        tabIndex: function () {
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

