import moment from 'moment'

import store from 'store'


//组件级变量
let selectionData = []

export default {
    created() {
        console.log('qr code info')
        console.log(this.tabIndex)
        this.$store.commit('SET_TABINDEX', 0)
        this.$nextTick(function () {
            // this.$refs.codeTable.setCurrentRow(this.temp.jsonDataDetail.qrDTOS[this.tabIndex])
        })
    },
    data() {
        return {
            selectedCode: '',
            codeNum: '等待创建',
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            // temp: this.$store.state.weChatActivityData.activityData,
            activeIndex: '02',
            qrCodeName: '',
            qrCodeFormVisible: false,
            tempCodeName: '',
            // tabIndex: '',
            actionType: '',
            // activityActionType:this.$store.state.weChatActivityData.actionType
            rules:{}
        }
    },
    // mounted(){
    //     this.$refs.codeTable.setCurrentRow(this.temp.jsonDataDetail.qrDTOS[this.tabIndex])
    // },
    methods: {

        getCurrentCell(row, column, cell, event) {
            console.log(row, column, cell, event)
            this.tempCodeName = row.name
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        onAddQrCode() {
            this.qrCodeFormVisible = true
            this.actionType = 'add'
        },
        confirmQrCode() {

            for (let i in this.temp.jsonDataDetail.qrDTOS){
                if(this.qrCodeName === this.temp.jsonDataDetail.qrDTOS[this.tabIndex].qrCodeName){
                    this.temp.jsonDataDetail.qrDTOS[this.tabIndex].qrCodeName = this.qrCodeName
                    this.qrCodeFormVisible = false

                    this.$store.commit('EDIT_QRCODELIST', {
                        index: this.tabIndex,
                        qrCodeName: this.qrCodeName,
                    })
                }
                else if(this.qrCodeName === this.temp.jsonDataDetail.qrDTOS[i].qrCodeName){
                    this.$message(
                        {
                            message: '二维码不可重名',
                            type: 'error'
                        }
                    )
                    return false
                }
            }



            if (this.qrCodeName !== '') {
                if (this.actionType === 'edit') {
                    this.temp.jsonDataDetail.qrDTOS[this.tabIndex].qrCodeName = this.qrCodeName
                    this.qrCodeFormVisible = false

                    this.$store.commit('EDIT_QRCODELIST', {
                        index: this.tabIndex,
                        qrCodeName: this.qrCodeName,
                    })
                } else {
                    this.qrCodeFormVisible = false
                    this.$store.commit('SET_QRCODELIST', {
                        qrCodeName: this.qrCodeName,
                        materialId: '',
                        materialName: '',
                        materialType: '',
                        materialContent: '{"picUrl":"","url":"","mediaId":"","serverUrl":"","content":""}',
                        organDTOS: [],
                        qrUrl: '',
                        scene: '',
                    })
                    this.qrCodeFormVisible = false
                }
            }

        },
        onEditQrCode() {
            this.qrCodeFormVisible = true;
            this.actionType = 'edit'
            let row = this.temp.jsonDataDetail.qrDTOS[this.tabIndex]
            this.qrCodeName = row.qrCodeName
            console.log(this.tabIndex)
        },
        onDelete(){

            this.ConfirmBox('是否确认删除')
                .then(() => {
                    this.$store.commit('SET_DELETECODE',this.tabIndex)
                    this.$store.commit('SET_TABINDEX', 0)
                    this.$refs.codeTable.setCurrentRow(this.temp.jsonDataDetail.qrDTOS[0]);
                })
        },
        resetCodeForm() {
            this.qrCodeName = ''
            this.qrCodeFormVisible = false
        },
        handleRow(index) {
            this.$store.commit('SET_TABINDEX', index)
            if(index === 0 && this.$refs.codeChild.$data.activeIndex ==='06'){
                this.$refs.codeChild.getEchartsData()
            }
        }
    },
    computed: {
        temp() {
            return this.$store.state.weChatActivityData.activityData
        },
        isShowEdit() {
            return this.$store.state.weChatActivityData.activeIndex
        },
        activityActionType() {
            return this.$store.state.weChatActivityData.actionType
        },
        tabIndex() {
            return this.$store.state.weChatActivityData.tabIndex
        },
        qrCode(){
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex]
        }
    },
}


function tempInit() {
    return [{
        qrCodeName: '默认二维码',
        materialId: '',
        materialName: '',
        materialContent: ''
    }]
}