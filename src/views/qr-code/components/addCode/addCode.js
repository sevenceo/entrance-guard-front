import moment from 'moment'

import {GetBaseData, CreateActivity, GetActivityById, UpdateActivity} from "src/views/qr-code/api/qrCodeApi";

import store from 'store'


//组件级变量
let selectionData = []

export default {
    created() {
        // this.getIndex()
        this.getBaseData()
        // console.log(this)
        if (this.activityId === undefined) {
            this.actionType = '新增'

            this.$store.commit('SET_ACTIONTYPE', this.actionType)
            console.log("A")
            console.log(this.activityData)
            this.$store.commit('SET_ACTIVITYDATA', this.activityData)

        } else {
            if (this.$route.fullPath.indexOf('edit') >= 0) {
                this.getActivityById()
                this.actionType = '编辑'
                console.log(this.actionType)
                // this.getIndex()
            } else {
                this.getActivityById()
                this.actionType = '查看'
                console.log(this.actionType)
                // this.getIndex()
            }

            this.$store.commit('SET_ACTIONTYPE', this.actionType)
        }
        console.log(this)
    },
    data() {
        return {
            date: '',
            tempMaterial: tempMaterialInit(),
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            // temp: this.$store.state.weChatActivityData.activityData,
            activeIndex: '',
            // baseData: '',
            showTabs: '',
            navs: [],
            editNavs: [],
            account: this.$store.state.weChatAccount.accountInfo.account,
            activityId: this.$router.currentRoute.params.id,
            activityType: '',
            activityData: activityDataInit(),
            baseData: {},
            actionType: ''
        }
    },
    methods: {
        getBaseData() {
            GetBaseData(this.account)
                .then(response => {
                    // this.$store.commit('SET_BASEDATA', response.data.baseInfo)

                    console.log('进入时渲染导航 baseData')
                    console.log(this.baseData)
                    this.baseData = response.data.baseInfo

                    if (this.actionType === '新增') {

                        for (let i in this.baseData.templateDTOS) {
                            if (this.baseData.templateDTOS[i].templateCode === this.templateCode) {
                                this.navs = this.baseData.templateDTOS[i].tabs
                            }
                        }

                        // this.navs = this.baseData.templateDTOS[this.templateCode].tabs
                    }
                })
        },
        handleSelect(key, keyPath) {
            this.activeIndex = key
        },
        createActivity() {
            console.log(this.$refs.childSection)
            this.$store.commit('SET_ACCOUNT', this.account)
            if (this.$refs.childSection.showRules) {
                //数组情况
                if(Array.isArray(this.$refs.childSection.$refs['temp'])){
                    for(let i = 0;i<this.$refs.childSection.$refs['temp'].length;i++){
                        this.$refs.childSection.$refs['temp'][i].validate((valid) => {
                            if (valid) {
                                this.onCreate()
                            }
                        })
                    }
                }else {
                    //非数组
                    this.$refs.childSection.$refs['temp'].validate((valid) => {
                        if (valid) {
                            this.onCreate()
                        }
                    })
                }

            } else {
                this.onCreate()
            }
        },
        onCreate(){
            if(this.handleOrgDTO()){
                return;
            }
            CreateActivity(this.temp)
                .then(response => {
                    console.log(response)
                    this.$message({
                        type: "success",
                        message: "创建成功",
                    })
                    this.$router.push({name: '活动中心'})
                })
        },
        updateActivity() {
            if(this.handleOrgDTO()){
                return;
            }
            console.log('修改')
            console.log(this.temp)
            UpdateActivity(this.temp)
                .then(response => {
                    this.$message({
                        type: "success",
                        message: "编辑成功",
                    })
                    this.$router.push({name: '活动中心'})
                    console.log(response)
                })
        },
        handleOrgDTO(){
            let flag = false;
            try{
                let message = "";
                if(this.temp.activityTemplateCode == '001'){
                     for(var index in this.temp.jsonDataDetail.qrDTOS){
                         message = "";
                         if(this.temp.jsonDataDetail.qrDTOS[index].organDTOS.length == 0){
                             flag = true;
                             message = this.temp.jsonDataDetail.qrDTOS[index].qrCodeName+"未添加经销商！"
                             this.$message({
                                 type: "error",
                                 message: message
                             })
                         }
                     }
                }
            } catch(err){
                console.log(err);
            }
            return flag;
        },
        getActivityById() {
            GetActivityById(this.account, this.activityId)
                .then(response => {
                    // console.log('commit 路由main页面根据id获取数据')
                    // console.log(response.data)
                    console.log("C")
                    console.log(response.data)


                    this.$store.commit('SET_ACTIVITYDATA', response.data)

                    console.log('获取后提交数据')

                    console.log(this.$store.state.weChatActivityData.activityData)

                    // this.$store.commit('SET_ACTIVITYDATA', activityDataInit())

                    // console.log()
                    this.$nextTick(function () {
                        this.navs = response.data.templateDTO.tabs
                    })

                })
        },
        editActivity() {
            if(new Date() > new Date(this.$store.state.weChatActivityData.activityData.beginDate + ' 00:00:00'))
            {
                this.$message({
                    message: "活动已经开始无法编辑",
                    type: 'error'
                })
                return;
            }
            this.actionType = '编辑'
            this.$store.commit('SET_ACTIONTYPE', this.actionType)
            this.activeIndex = '01'
            this.$router.push({path: '../../edit-activity/basic/' + this.activityId, reload: null})
        },
        showRules(x) {
            if (this.actionType === '查看') {
                return true
            } else if (this.actionType === '编辑') {
                if (x.tabEnName === 'customer' || x.tabEnName === 'statistics') {
                    return false
                } else {
                    return true
                }
            }
        }
    },
    computed: {
        templateCode() {
            return this.$store.state.weChatActivityData.activityData.activityTemplateCode
        },
        temp() {
            return this.$store.state.weChatActivityData.activityData
        }
    },
    watch: {
        templateCode: function (val, oldVal) {
            for (let i in this.baseData.templateDTOS) {
                if (this.baseData.templateDTOS[i].templateCode === this.templateCode) {
                    this.navs = this.baseData.templateDTOS[i].tabs
                }
            }
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


function navsInit() {
    return {
        tabsCodes: ['01', '02', '03', '04'],
        navList:
            [
                {templateCode: '1', templateName: '基本信息'},
                {templateCode: '2', templateName: '二维码'},
                {templateCode: '3', templateName: '经销商'},
                {templateCode: '4', templateName: '关联车系'}
            ]
    }
}

function activityDataInit() {
    return {
        account: '',
        activityCode: '',
        activityName: '',
        activityTemplateCode: '001',
        activityTemplateName: '扫码活动留资',
        activityTypeCode: '',
        activityTypeName: '',
        activityRegionId: '',
        activityRegionName: '',
        beginDate: '',
        endDate: '',
        description: '',
        jsonDataDetail: {
            qrDTOS: [
                {
                    qrCodeName: '默认二维码',
                    qrUrl: '',
                    scene: '',
                    materialId: '',
                    materialName: '',
                    materialType: '',
                    materialContent: '{"picUrl":"","url":"","mediaId":"","serverUrl":"","content":""}',
                    organDTOS: [
                        {
                            organName: "",
                            qrCodeName: "",
                            tel: "",
                            provinceName: "",
                            cityName: "",
                            areasName : "",
                            provinceId : "",
                            cityId : "",
                            areasId : ""
                        }
                    ]
                },
            ],
            carSeriesDTOS: [{
                dossSend: '',
                seriesName: '',
                seriesEnName: '',
                dossCode: '',
                id: ""
            }],
            questionnaireDTO: {
                name: "",
                author: "",
                title: "",
                backgroundPic: "",
                desc: "",
                customerItems: [],
                questionItemDTOS: [
                    {
                        id: 1,
                        questionDesc: "",
                        maxChooseNum: 1,
                        isMultiple:false,
                        answerItemSize:4,
                        answerItems: [
                            {
                                name: "A",
                                desc: ""
                            },
                            {
                                name: "B",
                                desc: ""
                            },
                            {
                                name: "C",
                                desc: ""
                            },
                            {
                                name: "D",
                                desc: ""
                            },
                        ],
                    }
                ]
            }

        },

    }

}