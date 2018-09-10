import moment from 'moment'

import store from 'store'

import {GetDealerData} from "src/views/qr-code/api/qrCodeApi";

//组件级变量
let selectionData = []

export default {
    created() {
        this.getDealerData()
        this.$store.commit('SET_ACTIVIINDEX', this.activeIndex)

    },
    data() {
        return {
            date: '',
            selectedCode: '',
            codeNum: '等待创建',
            tempMaterial: tempMaterialInit(),
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            codeList: [{'name': 'code1', 'year': '123'}, {'name': 'code2'}, {'name': 'code3'},],
            activeIndex: '03',
            account: this.$store.state.weChatAccount.accountInfo.account,
            dealerList: [],
            dealerFormVisible: false,
            tempSelectedDealerList: [],
        }
    },
    methods: {
        onAdd() {
            this.dealerFormVisible = true
            // this.$refs.dealerTable.toggleRowSelection(this.selectedDealerList);
        },
        open() {
            this.$nextTick(function () {

                let selectArray = []
                console.log(this.selectedDealerList)
                if (this.selectedDealerList === []) {
                    this.$refs.dealerTable.toggleRowSelection(this.dealerList, false);
                } else {

                    this.$refs.dealerTable.clearSelection();

                    for (let v of this.selectedDealerList) {
                        for (let [index, value] of this.dealerList.entries()) {
                            if (v.organName === value.organName) {
                                selectArray.push(index)
                            }
                        }
                    }

                    console.log(selectArray)

                    for (let v of selectArray) {
                        this.$refs.dealerTable.toggleRowSelection(this.dealerList[v], true);
                    }
                }

            })
        },
        getDealerData() {
            GetDealerData(this.account,this.$store.state.weChatActivityData.activityData.activityRegionId)
                .then(response => {
                    console.log(response)
                    this.dealerList = response.data.organDTOS
                })
        },
        confirmDealer() {
            this.dealerFormVisible = false
            this.$store.commit('SET_ORGAN', this.tempSelectedDealerList)
        },
        handleSelectionChange(val) {

            this.tempSelectedDealerList = val;

            console.log(this.tempSelectedDealerList)
        },
    },
    computed: {
        tabIndex() {
            return this.$store.state.weChatActivityData.tabIndex
        },
        selectedDealerList() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex].organDTOS
        },
        actionType() {
            return this.$store.state.weChatActivityData.actionType
        }

    },
    watch: {
        tabIndex: function () {
            this.selectedDealerList = this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex].organDTOS
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

