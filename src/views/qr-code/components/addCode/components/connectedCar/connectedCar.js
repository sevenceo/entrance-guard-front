import moment from 'moment'

import store from 'store'

import {GetCarData} from "src/views/qr-code/api/qrCodeApi";



//组件级变量
let selectionData = []

export default {
    created() {
        this.getCarList()
    },
    data() {
        return {
            date: '',
            codeList: [{'name': 'code1', 'year': '123'}, {'name': 'code2'}, {'name': 'code3'},],
            selectedCode: '',
            codeNum: '等待创建',
            tempMaterial: tempMaterialInit(),
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            // temp:tempInit(),
            activeIndex: '04',
            account: this.$store.state.weChatAccount.accountInfo.account,
            carData: [],
            tempSelectedCarData: [],
            carFormVisible: false,
            temp: this.$store.state.weChatActivityData.activityData,
            sendOptions: [
                {
                    value: true,
                    label: '需要下发',
                    key: 'AB'
                }, {
                    value: false,
                    label: '无需下发',
                    key: 'CD'
                }
            ],
            activityData: {
                account: '',
                activityCode: '',
                activityName: '',
                activityTemplateCode: '',
                activityTemplateName: '',
                activityTypeCode: '',
                activityTypeName: '',
                activityRegionId: '',
                activityRegionName: '',
                beginDate: '',
                endDate: '',
                description: '',
            },
        }
    },

    methods: {
        onAdd() {
            this.carFormVisible = true

            console.log(11111)


            // this.checkSelection()
        },
        onEdit() {

        },
        onSearch() {

        },
        close() {

        },
        open() {
            this.$nextTick(function () {
                console.log(this.$refs.carTable)
                console.log(this.selectedCarData)
                console.log(this.carData)

                let selectArray = []
                for (let v of this.selectedCarData) {
                    for (let [index, value] of this.carData.entries()) {
                        if (v.dossCode === value.dossCode) {
                            selectArray.push(index)
                        }
                    }
                }
                console.log(selectArray)

                for (let v of selectArray) {
                    this.$refs.carTable.toggleRowSelection(this.carData[v], true);
                }
            })
        },
        onDel() {

        },
        getCurrentCell(row, column, cell, event) {
            console.log(row)
            console.log(column)
            console.log(cell)
            console.log(event)
        },
        getCarList() {
            GetCarData(this.account)
                .then(response => {
                    console.log(response.data.carSeriesDTOS)
                    this.carData = response.data.carSeriesDTOS

                })
        },
        handleSelectionChange(val) {
            this.tempSelectedCarData = val;
        },
        confirmCar() {
            // this.selectedCarData = $.extend([], this.tempSelectedCarData)
            console.log(this.selectedCarData)
            this.carFormVisible = false
            this.$store.commit('SET_CARDATA', this.tempSelectedCarData)
        },
        // checkSelection(){
        //     // this.$nextTick(function(){
        //     // })
        // }
    },
    computed: {
        selectedCarData() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.carSeriesDTOS
        },
        actionType(){
            return this.$store.state.weChatActivityData.actionType
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
