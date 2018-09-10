import {
    GetReplyMSGList,
    EditorReply,
    CreateReplyData,
    DeleteReply,
    GetReplyData,
    GetFansGroupList
} from "./api/replyMSGManageApi";

export default {
    created() {
        this.account = this.$store.state.weChatAccount.accountInfo.account;
        this.getFansGroup();
        this.getReplyMSGList(this.account, this.pageParam);
    },
    data() {
        return {
            tableData: [],
            mOptions: [],
            mOptions2: [],
            fansGroup: [],
            totalPage: 10,
            account: "",
            openId: "",
            dialogFormVisible: false,
            dialogFormVisible2: false,
            dialogFormFansGroup: false,
            cardSelectBoxVisible: false,
            requestParam: tempInit(),
            dialogStatus: 'create',
            pageParam: pageParamInit(),
            temp: tempInit(),
            tempMaterial: tempMaterialInit(),
            value1: '',
            value2: '',
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            Type: {
                auto: '直接回复',
                condition: '条件回复',
                search: '搜索关注'
            },
            pushTypeMap: {
                text: '文字',
                link: '外链',
                image: '图片',
                news: '图文',
                video: '视频',
                voice: '语音',
                card: '卡券'
            },
            replyRules: {
                replyType: [
                    {required: true, message: '请选择回复类型', trigger: 'blur'}
                ],
                keyWord: [
                    {required: true, message: '请输入关键字', trigger: 'blur'},
                    {max: 50, message: '最多输入50个字', trigger: 'blur'}
                ]
            },
            fansGroupList: [],
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            videoSrc: "",
            videoDialogVisible: false,
            isPush: ''
        }
    },
    methods: {
        //  显示自动回复信息
        getReplyMSGList(account, pageParam) {
            GetReplyMSGList(account, pageParam)
                .then((response) => {
                    if (response.data) {
                        this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
                        this.tableData = response.data

                    } else {
                        this.totalPage = 0
                    }
                })
        },
        change(value) {
            console.log(this.isPush)
            if (value == 'no-push') {
                this.temp.pushType = 'no-push';
                this.temp.materialId = ''
                this.temp.materialName = ''
                this.temp.serverUrl = ''
                this.temp.picUrl = ''
                this.temp.url = ''
                this.temp.content = ''
            }
            else {
                this.temp.pushType = ''
                // this.isPush = true
            }
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getReplyMSGList(this.account, this.pageParam)
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row, row.replyBody[0])
            console.log('tttt')
            console.log(this.temp)
            this.temp.oldKeyWord = this.temp.keyWord
            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
            // this.loadMName();
            if (this.temp.pushType == 'no-push') {
                this.isPush = 'no-push'
            }
        },
        onDelete(row) {
            if (row.replyType == 'search') {
                this.$message({
                    message: '搜索关注类型不能删除',
                    type: 'error'
                })
            } else {
                this.ConfirmBox('是否确认删除')
                    .then(() => {
                        DeleteReply(this.account, row.id)
                            .then(() => {
                                this.getReplyMSGList(this.account, this.pageParam);
                            })
                    })
            }

        },
        onAdd: function () {
            this.temp.replyType = 'auto'
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
            // $('.condition').hide();
            // $('.auto').hide();
        },
        reset: function () {
            this.pageParam = pageParamInit()
        },
        resetForm() {
            this.$refs['replyForm'].resetFields();
            this.temp = tempInit()

        },
        resetForm2() {
            this.$refs['addMForm'].resetFields();
            this.tempMaterial = tempMaterialInit()

        },
        loadMName() {
            if (this.temp.pushType != "" && this.temp.pushType != 'no-push') {
                GetReplyData(this.account, this.temp.pushType)
                    .then((response) => {
                        if (response.data) {
                            this.mOptions = response.data
                        }
                    })
            }
        },
        getFansGroup() {
            GetFansGroupList(this.account)
                .then((response) => {
                    if (response.data) {
                        this.fansGroup = response.data
                        for(let i in this.fansGroup){
                            if(this.fansGroup[i].state == 'OFF'){
                                this.fansGroup[i].disabled = true;
                            }
                        }
                    }
                })
        },
        loadMName2() {
            if (this.tempMaterial.pushType != "") {
                GetReplyData(this.account, this.tempMaterial.pushType)
                    .then((response) => {
                        if (response.data) {
                            this.mOptions2 = response.data
                        }
                    })
            }
        },
        onAddMaterial() {
            this.dialogFormVisible2 = true
        },
        addMaterial() {
            this.$refs['addMForm'].validate((valid) => {
                if (valid) {
                    var id = this.tempMaterial.fansGroupId;
                    var groups = this.fansGroup;
                    if (this.tempMaterial.fansGroupId != '') {
                        var i = 0;
                        for (var group in groups) {
                            if (groups[i].id == (id)) {
                                this.tempMaterial.fansGroupName = groups[i].name;
                                break;
                            }
                            i++;
                        }
                    }
                    console.log("tempMaterial:" + JSON.stringify(this.tempMaterial))
                    if (this.tempMaterial.index >= 0) {
                        this.temp.replyBody.splice(this.tempMaterial.index, 1, JSON.parse(JSON.stringify(this.tempMaterial)));
                        //this.tableMData[this.tempMaterial.index]=JSON.parse(JSON.stringify(this.tempMaterial));
                    } else {
                        this.temp.replyBody.push(JSON.parse(JSON.stringify(this.tempMaterial)))
                    }
                    this.dialogFormVisible2 = false;
                } else {
                    this.dialogFormVisible2 = false;
                    return false;
                }
            });
        },
        getSelectedCard(value, type) {

            if (this.temp.replyType === 'auto') {
                console.log('')
                console.log(value)
                console.log(type)
                console.log(this.temp)
                this.temp.materialId = value.cardId
                this.temp.materialName = value.cardTitle
                this.temp.pushType = 'card'
                this.temp.serverUrl = ''
                this.temp.picUrl = value.logoUrlPath
                this.temp.url = ''
                console.log(this.temp.pushType)
            } else if (this.temp.replyType === 'condition') {
                console.log('')
                console.log(value)
                console.log(type)
                this.tempMaterial.pushType = 'card'
                this.tempMaterial.materialId = value.cardId
                this.tempMaterial.materialName = value.cardTitle
                this.tempMaterial.serverUrl = ''
                this.tempMaterial.picUrl = value.logoUrlPath
                this.tempMaterial.url = ''
            } else if (this.temp.replyType === 'search') {
                this.temp.materialId = value.cardId
                this.temp.materialName = value.cardTitle
                this.temp.serverUrl = ''
                this.temp.picUrl = value.logoUrlPath
                this.temp.url = ''
                this.temp.pushType = 'card'
                this.tempMaterial.pushType = 'card'
                console.log(this.temp)
            }
            this.cardSelectBoxVisible = false
        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['replyForm'].resetFields()
        },
        handleCancel2() {
            this.dialogFormVisible2 = false;
            this.tempMaterial = tempMaterialInit()
            this.$refs['addMForm'].resetFields()
        },
        onDelete2(index, row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    if (index >= 0) {
                        this.temp.replyBody.splice(index, 1);
                    } else {
                        return false;
                    }
                })

        },
        getReplyDetail(replyId) {
            // if()
        },
        onEdit2(index, row) {
            this.dialogFormVisible2 = true;
            this.tempMaterial = $.extend(tempMaterialInit(), row)
            this.tempMaterial.index = index;
            // this.loadMName2()

        },
        create() {
            this.$refs['replyForm'].validate((valid) => {
                if (valid) {
                    // delete this.temp("roleStr")
                    if (this.temp.replyType == 'condition') {
                        if (this.temp.replyBody.length == 0) {
                            this.$message({
                                message: '请添加粉丝组',
                                type: 'error'
                            })
                            return false
                        }
                        let flag = false;
                        for (let i in this.temp.replyBody) {
                            if (this.temp.replyBody[i].fansGroupName == '') {
                                flag = true;
                                break;
                            }
                        }
                        if (flag) {
                            this.$message({
                                message: '请添加粉丝组',
                                type: 'error'
                            })
                            return false
                        }
                    }
                    if (this.temp.replyType == 'auto') {
                        this.temp.replyBody = [];
                        this.temp.fansGroupName = "";
                        this.temp.fansGroupId = "";
                        this.temp.replyBody.push(JSON.parse(JSON.stringify(this.temp)))
                    }
                    CreateReplyData(this.account, this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getReplyMSGList(this.account, this.pageParam);
                        })
                } else {
                    return false;
                }
            });

        },
        update(formName) {
            //
            // console.log('tempMaterial')
            // console.log(this.tempMaterial.pushType)
            // console.log('temp')
            // console.log(this.temp.pushType)
            if (this.temp.replyType == 'condition') {
                if (this.temp.replyBody.length == 0) {
                    this.$message({
                        message: '请添加粉丝组',
                        type: 'error'
                    })
                    return false
                }
                let flag = false;
                for (let i in this.temp.replyBody) {
                    if (this.temp.replyBody[i].fansGroupName == '') {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    this.$message({
                        message: '请添加粉丝组',
                        type: 'error'
                    })
                    return false
                }
            }
            if (this.temp.pushType == '') {
                this.$message({
                    message: '请添加粉丝组',
                    type: 'error'
                })
                return false
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.temp.replyType != 'condition') {
                        this.temp.replyBody = [];
                        this.temp.fansGroupName = "";
                        this.temp.fansGroupId = "";
                        this.temp.replyBody.push(JSON.parse(JSON.stringify(this.temp)))
                    }
                    EditorReply(this.account, this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getReplyMSGList(this.account, this.pageParam);
                            this.temp = tempInit()
                        });
                } else {
                    return false;
                }
            })
        },
        loadMaterial() {
            if (this.temp.materialId != '') {
                var ml = this.mOptions
                var i = 0;
                for (var material in ml) {
                    if (ml[i].id == (this.temp.materialId)) {
                        this.temp.materialName = ml[i].name;
                        if (ml[i].content) {
                            this.temp.content = ml[i].content;
                        }
                        if (ml[i].serverUrl) {
                            this.temp.serverUrl = ml[i].serverUrl;
                        }
                        if (ml[i].url) {
                            this.temp.url = ml[i].url;
                        }
                        if (ml[i].picUrl) {
                            this.temp.picUrl = ml[i].picUrl;
                        }
                        break;
                    }
                    i++;
                }
            }
        },
        loadMaterial2() {
            if (this.tempMaterial.materialId != '') {
                var ml = this.mOptions2
                var i = 0;
                for (var material in ml) {
                    if (ml[i].id == (this.tempMaterial.materialId)) {
                        this.tempMaterial.materialName = ml[i].name;
                        if (ml[i].content) {
                            this.tempMaterial.content = ml[i].content;
                        }
                        if (ml[i].serverUrl) {
                            this.tempMaterial.serverUrl = ml[i].serverUrl;
                        }
                        if (ml[i].url) {
                            this.tempMaterial.url = ml[i].url;
                        }
                        if (ml[i].picUrl) {
                            this.tempMaterial.picUrl = ml[i].picUrl;
                        }
                        break;
                    }
                    i++;
                }
            }
        },
        getCard() {
            this.cardSelectBoxVisible = true
        },
        //视频播放逻辑
        stopPlay() {
            this.videoSrc = ''
        },
        showVideo(url) {
            this.videoDialogVisible = true
            this.videoSrc = this.mediaUrl + url
        },
        closeCard() {
            this.cardSelectBoxVisible = false;

        },
        //    dialog1 从组件获取数据
        getSelectedMaterial(value, type) {

            if (this.temp.replyType === 'auto') {
                console.log('')
                console.log(value)
                console.log(type)
                this.temp.pushType = type
                this.temp.materialId = value.id
                this.temp.materialName = value.name
                this.temp.serverUrl = value.serverUrl
                this.temp.picUrl = value.picUrl
                this.temp.url = value.url
                this.temp.content = value.content
            } else if (this.temp.replyType === 'condition') {
                console.log('')
                console.log(value)
                console.log(type)
                this.tempMaterial.pushType = type
                this.tempMaterial.materialId = value.id
                this.tempMaterial.materialName = value.name
                this.tempMaterial.content = value.content
                this.tempMaterial.serverUrl = value.serverUrl
                this.tempMaterial.picUrl = value.picUrl
                this.tempMaterial.url = value.url
            } else if (this.temp.replyType === 'search') {
                this.temp.materialId = value.id
                this.temp.materialName = value.name
                this.temp.serverUrl = value.serverUrl
                this.temp.picUrl = value.picUrl
                this.temp.url = value.url
                this.temp.pushType = type
                this.temp.content = value.content
                this.tempMaterial.pushType = type
            }
        },

    }
}

function tempMaterialInit() {
    return {
        index: -1,
        pushType: "",
        keyWord: "",
        content: "",
        materialName: "",
        picUrl: "",
        serverUrl: "",
        remoteUrl: "",
        url: "",
        fansGroupId: "",
        materialId: "",
        replyType: ""
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10
    }
}

function tempInit() {
    return {
        account: "",
        keyWord: "",
        replyType: "",
        pushType: "",
        materialId: "",
        materialName: "",
        content: "",
        picUrl: "",
        serverUrl: "",
        remoteUrl: "",
        url: "",
        fansGroupName: "",
        fansGroupId: "",
        replyBody: []
    }
}

