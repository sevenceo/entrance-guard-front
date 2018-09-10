import moment from 'moment'

import store from 'store'

import {GetBaseData} from "src/views/qr-code/api/qrCodeApi";
import {GetActivityById} from "../../../../api/qrCodeApi";


export default {
    created() {
        // this.getBaseData()
        if(this.actionType === '新增'){
            this.$store.commit('SET_TPLCODE', {
                activityTemplateCode: '003',
                activityTemplateName: '问卷活动'
            })
        }else {
            this.getActivityById()
        }
    },
    data() {
        let that = this;
        return {
            tempMaterial: tempMaterialInit(),
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            account: this.$store.state.weChatAccount.accountInfo.account,
            activityId: this.$router.currentRoute.params.id,
            // temp:this.$store.state.weChatActivityData.activityData,
            activeIndex: '01',
            templateOptions: [
                {
                    regionCode: '',
                    regionName: ''
                }
            ],
            rules: {
                questionDesc: [
                    {required: true, message: '请输入问题描述'},
                    {max: true, message: '问题描述不可超过120个字'}
                ]
            },
            showRules:true,
            numberOption: [
                {key: 1, label: 1},
                {key: 2, label: 2},
                {key: 3, label: 3},
                {key: 4, label: 4},
                {key: 5, label: 5},
                {key: 6, label: 6},
                {key: 7, label: 7},
                {key: 8, label: 8},
                {key: 9, label: 9},
            ],
            selectedNumber: 4,
            multiOption: [
                {key: 2, label: 2},
                {key: 3, label: 3},
                {key: 4, label: 4},
            ],
            tempAnswerItems: [
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
            ]
        }
    },
    mounted() {

    },
    methods: {
        changeNum(val,id) {
            console.log(id)
            this.multiOption = []
            console.log(val)
            let selectionTitle = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
            console.log(val)
            for (let i = 2; i <= val; i++) {
                this.multiOption.push(
                    {
                        key: i,
                        label: i
                    }
                )
            }
            let tempAnswerItems = []


            for (let i = 0; i < val; i++) {
                for (let [index, value] of selectionTitle.entries()) {
                    if (i === index) {
                        tempAnswerItems.push({
                            name: value,
                            desc: ''
                        })
                    }
                }
            }
            let questionItemDTOS =
                {
                    id: id,
                    questionDesc: "",
                    maxChooseNum: 1,
                    answerItemSize:val,
                    isMultiple: false,
                    answerItems: tempAnswerItems,
                }

                console.log(questionItemDTOS)
            this.$store.commit('RESET_QUESTION', questionItemDTOS)
        },
        changeMultiNum(value,index) {
            console.log(value)
            // console.log(SET_MAXNUM)
            let data = {
                index: index,
                num: value
            }
            this.$store.commit('SET_MAXNUM', data)

        },
        updateQuestionMessage(desc,index){
            console.log('RESET_QUESTIONDESC')
            let data = {
                index: index,
                desc: desc
            }
            this.$store.commit('RESET_QUESTIONDESC',data)
        },
        changeIsMultiple(isMultiple, index) {
            console.log(index)
            console.log(isMultiple)
            if (isMultiple) {
                this.temp[index].maxChooseNum = 2
            } else {
                this.temp[index].maxChooseNum = 1
            }
            let data = {
                isMultiple:isMultiple,
                index: index,
                num: this.temp[index].maxChooseNum
            }
            console.log(this.temp)
            this.$store.commit('INIT_ISMULTIPLE', data)

        },
        addQuestion() {
            let tempAnswerItems=[
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
                ]
            this.$store.commit('ADD_QUESTION', {
                id: this.maxId + 1,
                questionDesc: "",
                maxChooseNum: 1,
                isMultiple: false,
                answerItems: tempAnswerItems,
                answerItemSize:4,
            })
        },
        updateMessage(desc,index,id){
            //desc 文本
            //index abcd序号
            //ID 问题几的序号
            console.log('文本')
            console.log(desc)
            console.log('abcd序号')
            console.log(index)
            console.log('问题几的序号')
            console.log(id)
            let data = {
                desc: desc,
                index: index,
                id: id
            }

            this.$store.commit('SET_QUESTIONDETAIL', data)
        },
        deleteQuestion(index){
            if(this.temp.length < 2){
                this.$message({
                    message: "至少保留一个问题",
                    type: 'error'
                })
            }else {
                this.$store.commit('DELETE_QUESTION', index)

            }

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
    },

    computed: {
        temp() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS
        },
        questionLength(){
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS.length
        },
        maxId() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS[this.$store.state.weChatActivityData.activityData.jsonDataDetail.questionnaireDTO.questionItemDTOS.length - 1].id
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
        actionType() {
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

function isDisabledInit(item) {
    if (item) {
        console.log('正确')
        return true
    } else {
        console.log('错误')
        return false
    }
}
