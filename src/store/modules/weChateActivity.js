import Vue from 'vue'
const weChatActivityData = {
    state: {
        templateCode: '',
        deleteData: [],
        matrialData: '',
        tabIndex: 0,
        selectedCarData: [],
        tempSelectedCarData: [],
        actionType: '',
        activeIndex: '',
        activityData: {
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
                                areasName: "",
                                provinceId: "",
                                cityId: "",
                                areasId: ""
                            }
                        ]
                    },
                ],
                carSeriesDTOS: [{
                    dossSend: '',
                    seriesName: '',
                    seriesEnName: '',
                    dossCode: '',
                    id: ''
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
            templateDTO: {
                templateCode: "",
                templateName: "",
                tabs: []
            }
        }
    },
    mutations: {
        SET_BASEDATA: (state, data) => {
            state.baseData = data
            state.typeOptions = data.typeDTOS
            state.templateOptions = data.templateDTOS
            state.regionOptions = data.regionDTOS
            console.log('state basedata')
            console.log(state.baseData)
        },
        SET_ACCOUNT: (state, account) => {
            state.activityData.account = account
        },
        SET_TPLCODE: (state, data) => {
            state.activityData.activityTemplateCode = data.activityTemplateCode
            state.activityData.activityTemplateName = data.activityTemplateName
        },
        SET_CODEINFO: (state, data) => {
            state.matrialData = data
        },
        SET_REGIONSINFO: (state, data) => {
            state.activityData.activityRegionId = data.id
            state.activityData.activityRegionName = data.name
        },

        SET_ACTIVITYNAME: (state, name) => {
            state.activityData.activityName = name
        },
        SET_ACTIVITYCODE: (state, code) => {
            state.activityData.activityCode = code
        },
        SET_ACTIVITYTYPE: (state, data) => {
            state.activityData.activityTypeCode = data.id
            state.activityData.activityTypeName = data.name
        },
        SET_BEGINDATE: (state, date) => {
            state.activityData.beginDate = date

        },
        SET_ENDDATE: (state, date) => {
            state.activityData.endDate = date

        },
        SET_BEWRITE: (state, data) => {
            state.activityData.description = data

        },
        SET_QRCODELIST: (state, data) => {
            state.activityData.jsonDataDetail.qrDTOS.push(data)
        },
        EDIT_QRCODELIST: (state, data) => {
            state.tabIndex = data.index
            state.activityData.jsonDataDetail.qrDTOS[data.index].qrCodeName = data.qrCodeName
        },
        SET_TABINDEX: (state, index) => {
            state.tabIndex = index
        },
        SET_MATERIAL: (state, data) => {
            state.activityData.jsonDataDetail.qrDTOS[state.tabIndex].materialId = data.materialId
            state.activityData.jsonDataDetail.qrDTOS[state.tabIndex].materialName = data.materialName
            state.activityData.jsonDataDetail.qrDTOS[state.tabIndex].materialType = data.materialType
            state.activityData.jsonDataDetail.qrDTOS[state.tabIndex].materialContent = JSON.stringify(data.materialContent)
        },
        SET_CARDATA: (state, data) => {
            state.activityData.jsonDataDetail.carSeriesDTOS = data
        },
        SET_ORGAN: (state, data) => {
            state.activityData.jsonDataDetail.qrDTOS[state.tabIndex].organDTOS = data
        },
        SET_ACTIVITYDATA: (state, data) => {
            state.activityData = data
        },
        SET_ACTIONTYPE: (state, data) => {
            state.actionType = data
        },
        SET_ACTIVIINDEX: (state, data) => {
            state.activeIndex = data
        },
        SET_DELETECODE: (state, index) => {
            state.activityData.jsonDataDetail.qrDTOS.splice(index, 1)
        },

    //    question
        ADD_QUESTION: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS.push(data)
        },
        INIT_QUESTION: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS = data
        },
        RESET_QUESTION: (state,data) => {
            console.log('————————————————————————————————————')
            console.log(data.id)
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.id].id = data.id + 1
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.id].questionDesc = data.questionDesc
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.id].isMultiple = data.isMultiple
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.id].answerItems = data.answerItems
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.id].answerItemSize = data.answerItemSize
        },
        SET_QUESTIONDETAIL: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.id].answerItems[data.index].desc = data.desc
        },
        DELETE_QUESTION: (state,index) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS.splice(index,1)
        },
        RESET_QUESTIONDESC: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.index].questionDesc = data.desc
        },
        INIT_ISMULTIPLE: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.index].maxChooseNum = data.num
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.index].isMultiple = data.isMultiple
        },
        SET_MAXNUM: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[data.index].maxChooseNum = data.num
        },
        EDIT_QUESTION: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS.push(data)
        },
        SET_CUSTOMERITEMS: (state,data) => {
            state.activityData.jsonDataDetail.questionnaireDTO.customerItems = data
        },


    }
}

export default weChatActivityData;