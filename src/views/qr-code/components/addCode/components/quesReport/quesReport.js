import moment from 'moment'

import store from 'store'

import {GetBaseData} from "src/views/qr-code/api/qrCodeApi";
import {GetActivityById} from "../../../../api/qrCodeApi";

//组件级变量
let selectionData = []

export default {
    created() {
        this.getActivityById()

    },
    data() {
        return {
            account:this.$store.state.weChatAccount.accountInfo.account,
            activityId: this.$router.currentRoute.params.id,
            temp:{}
        }
    },
    methods: {
        getActivityById() {
            GetActivityById(this.account, this.activityId)
                .then(response => {

                    this.$store.commit('SET_ACTIVITYDATA', response.data)

                    this.temp =  response.data.jsonDataDetail.questionnaireReportDTO
                    for(let i = 0; i<this.temp.customerItemStatis.length;i++){
                        this.temp.customerItemStatis[i] = [this.temp.customerItemStatis[i]]
                        console.log(this.temp.customerItemStatis[i])
                    }
                })
        },
        formatter(row, column) {
            let scale = row[column.property];
            if(scale) {
                scale = scale.toFixed(2);
            }
            return scale;
        },
        formatterlz(row, column) {
            let scale = row[column.property];
            if(scale) {
                scale = scale.toFixed(2);
            }
            return scale;
        }
    },

    computed: {
        // temp() {
        //     return this.$store.state.weChatActivityData.activityData.jsonDataDetail.questionnaireReportDTO
        // },
        actionType() {
            return this.$store.state.weChatActivityData.actionType
        },
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