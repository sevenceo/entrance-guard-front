import moment from 'moment'

import store from 'store'

import {GetCustomerData, GetActivityById} from "src/views/qr-code/api/qrCodeApi";



//组件级变量
let selectionData = []

export default {
    created() {
        this.getActivityById()
        this.$store.commit('SET_ACTIVIINDEX', this.activeIndex)

    },
    data() {
        return {
            date: '',
            activeIndex: '05',
            account: this.$store.state.weChatAccount.accountInfo.account,
            activityId: this.$router.currentRoute.params.id,
            messageDataList: [],
            page: {
                page: 0,
                size: 10,
                activityId: '',
                activitySceneId: ''
            },
            tempData: '',
            totalPage: 10,

        }
    },
    methods: {
        onAdd() {
            this.dealerFormVisible = true
            // this.$refs.dealerTable.toggleRowSelection(this.selectedDealerList);
        },
        getMessageData() {
            if (this.$store.state.weChatActivityData.activityData.id) {
                this.page.activityId = this.$store.state.weChatActivityData.activityData.id
                this.page.activitySceneId = this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex].activitySceneId
                this.getCustomerData()
            } else {
                this.getCustomerData()
            }

        },
        getActivityById() {
            GetActivityById(this.account, this.activityId)
                .then(response => {
                    console.log('tmp dat')
                    console.log(response.data)
                    this.tempData = response.data
                    this.page.activityId = this.tempData.id
                    this.page.activitySceneId = this.tempData.jsonDataDetail.qrDTOS[0].activitySceneId
                    this.getMessageData()
                })
        },
        getCustomerData() {
            GetCustomerData(this.page)
                .then(response => {
                    console.log(response)
                    this.totalPage = response.headers['x-total-count']
                    this.messageDataList = response.data
                    for (let i in this.messageDataList) {
                        this.messageDataList[i].createTime = moment(this.messageDataList[i].createTime).format("YYYY-MM-DD HH:mm:ss")

                    }

                })
        },
        handleCurrentChange(page) {
            this.page.page = page - 1;
            this.getCustomerData()
        },

    },
    computed: {
        tabIndex() {
            return this.$store.state.weChatActivityData.tabIndex
        },
        selectedDealerList() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex].organDTOS
        }
    },
    watch: {
        tabIndex: function () {
            this.getMessageData()
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

