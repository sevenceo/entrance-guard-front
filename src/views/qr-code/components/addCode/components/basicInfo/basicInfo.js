import moment from 'moment'

import store from 'store'

import {GetBaseData} from "src/views/qr-code/api/qrCodeApi";

//组件级变量
let selectionData = []

export default {
    created() {
        // this.getBaseData()
    },
    data() {
        let that = this;
        return {
            tempMaterial: tempMaterialInit(),
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            // temp:this.$store.state.weChatActivityData.activityData,
            activeIndex: '01',
            account: this.$store.state.weChatAccount.accountInfo.account,
            templateOptions: [
                {
                    regionCode:'',
                    regionName:''
                }
            ],
            regionOptions: [
                {
                    templateName: '',
                    templateCode: ''
                }
            ],
            typeOptions: [
                {
                    typeCode: '',
                    typeName: ''
                }
            ],
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 ||
                        time.getTime() > new Date(that.temp.endDate).getTime();
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 ||
                        time.getTime() < new Date(that.temp.beginDate).getTime();
                }
            },
            rules: {
                activityName: [
                    {required: true, message: '请填写活动名'},
                    {max: 100, message: '活动名不可超过100个字', trigger: 'blur' }
                ],
                activityTemplateCode: [{
                    required: true, message: '请选择活动模版'
                }],
                activityTypeCode: [{
                    required: true, message: '请选择活动类型'
                }],
                activityRegionId: [{
                    required: true, message: '请选择活动区域'
                }],
                beginDate: [{
                    required: true, message: '请选择起始时间'
                }],
                endDate: [{
                    required: true, message: '请选择结束时间'
                }],
                description: [
                    {max: 128, message: '摘要信息不可超过128个字', trigger: 'blur' }
                ],
            },
            baseData:{},
            showRules:true
        }
    },
    mounted() {
        console.log('X')
        this.$nextTick(function () {
            this.temp = this.$store.state.weChatActivityData.activityData
        })
        this.getBaseData()

    },
    methods: {
        getBaseData() {
            if (this.actionType === '查看' || this.actionType === '编辑') {
                GetBaseData(this.account)
                    .then(response => {
                        console.log('baseInfo页面渲染 baseData')
                        // this.temp = this.$store.state.weChatActivityData.activityData
                        console.log(this.temp)
                        // let baseData = response.data.baseInfo
                        this.templateOptions = response.data.baseInfo.templateDTOS
                        this.regionOptions = response.data.baseInfo.regionDTOS
                        this.typeOptions = response.data.baseInfo.typeDTOS
                    })
            } else if (this.actionType === '新增') {
                GetBaseData(this.account)
                    .then(response => {
                        console.log('response')
                        console.log(response)
                        this.baseData = response.data.baseInfo
                        this.templateOptions = this.baseData.templateDTOS
                        this.regionOptions = this.baseData.regionDTOS
                        this.typeOptions = this.baseData.typeDTOS
                        // this.temp = this.$store.state.weChatActivityData.activityData
                        console.log(this.temp)
                        console.log(this.temp)
                        console.log('bstp')
                        console.log(this.templateOptions)
                    })
            }
        },
        changeTemplate(value) {
            // console.log(value);
            let obj = {};
            obj = this.templateOptions.find((item) => {
                return item.templateCode === value;
            });
            if(obj === undefined){
                return false
            }
            this.temp.activityTemplateName = obj.templateName
            this.temp.activityTemplateCode = value

            let data = {
                activityTemplateCode: this.temp.activityTemplateCode,
                activityTemplateName: this.temp.activityTemplateName
            }
            this.$store.commit('SET_TPLCODE', data)
        },
        changeRegion(value) {
            // console.log(value);
            let obj = {};
            obj = this.regionOptions.find((item) => {
                return item.regionCode === value;
            });
            if(obj === undefined){
                return false
            }
            this.temp.activityRegionName = obj.regionName
            // console.log(this.temp.activityRegionName)
            this.temp.activityRegionId = value
            this.$store.commit('SET_REGIONSINFO', {id: this.temp.activityRegionId, name: this.temp.activityRegionName})

            // this.temp.activityRegionName = obj.regionName
        },
        changeType(value) {
            let obj = {};
            obj = this.typeOptions.find((item) => {
                return item.typeCode === value;
            });
            if(obj === undefined){
                return false
            }
            // console.log(obj)
            this.temp.activityTypeName = obj.typeName
            // console.log(this.temp.activityRegionName)
            this.temp.activityTypeId = value
            this.$store.commit('SET_ACTIVITYTYPE', {id: this.temp.activityTypeCode, name: this.temp.activityTypeName})

        },
        selectBeginDate(value) {
            this.temp.beginDate = value
            this.$store.commit('SET_BEGINDATE', value)
        },
        selectEndDate(value) {
            this.temp.endDate = value
            this.$store.commit('SET_ENDDATE', value)
        }
    },

    computed: {
        temp() {
            return this.$store.state.weChatActivityData.activityData
        },
        'temp.activityCode': {
            get() {
                return this.$store.state.activityData.activityCode
            },
            set(value) {
                this.$store.commit('SET_ACTIVITYCODE', value)
            }
        },
        'temp.activityName': {
            get() {
                return this.$store.state.activityData.activityName
            },
            set(value) {
                this.$store.commit('SET_ACTIVITYNAME', value)
            }
        },
        'temp.beginDate': {
            get() {
                return this.$store.state.activityData.beginDate
            },
            set(value) {
                this.$store.commit('SET_BEGINDATE', value)
            }
        },
        'temp.endDate': {
            get() {
                return this.$store.state.activityData.endDate
            },
            set(value) {
                this.$store.commit('SET_ENDDATE', value)
            }
        },
        'temp.description': {
            get() {
                return this.$store.state.activityData.description
            },
            set(value) {
                this.$store.commit('SET_BEWRITE', value)
            }
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