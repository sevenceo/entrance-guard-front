/**
 * Created by zhaimaojin on 2017/8/16.
 */
import store from "store"
import {
    GetExternalLinksList,
    GetImageList,
    GetTextList,
    GetVideoList,
    GetVoiceList,
    GetArticlePhotoList,
    GetExternalLinksById,
    GetTextById,
    GetVoiceById,
    GetVideoById,
    GetImageById,
    GetArticlePhotoById
} from "src/views/wc-material/my-material/api/myMaterialApi";
import {
    GetFansGroupList,
    GetNationList,
    GetProvinceList,
    GetCityList,
    SendMessage,
    GetMessageHistoryList,
    GetMaterialById,
    GetFansList,
    ExportAll
} from "src/views/push-message/api/pushMessageApi";
import {
    GetCardsList,GetCardData
} from "src/views/card-coupons/api/cardCouponsApi";
import { ValidateNumber,ValidatePercentage } from "utils/validate"

import router from "src/router"
import {loginByEmail} from 'src/api/login'
import moment from 'moment'


const genderType = [
    {
        genderValue: '1',
        label: '男性',
        key: 'AB'
    }, {
        genderValue: '2',
        label: '女性',
        key: 'CD'
    }, {
        genderValue: '0',
        label: '未知',
        key: 'EF'
    }
]

const options = [
    {key: null, label: '全部'},
    {key: true, label: '已发送'},
    {key: false, label: '未发送'}
];


export default {
    created() {
        this.getFansGroupList()
        this.getNation()
        this.timer = this.timeTask();
    },
    destroyed: function () {
        clearInterval(this.timer);
    },
    data() {

        return {
            temp: tempInit(),
            freshFlag:false,
            fansGroupOption: '',
            genderType,
            radio: '百分比',
            dialogFormVisible: false,
            fansGroupSelectSearchBoxVisible:false,
            dataList: '',
            pageParam: {
                page: 1,
                size: 12,
                account: this.$store.state.weChatAccount.accountInfo.account,
                exp:true
            },
            fansParam: {
                page: 1,
                size: 10,
                account: this.$store.state.weChatAccount.accountInfo.account,
                msgSendId:""
            },
            historyPageParam: {
                page: 1,
                size: 10,
                type:null
            },
            totalPage: 10,
            fansTotalPage:10,
            selectedRadio: '',
            baseUrl: process.env.MATERIAL_API,
            titleTabIndex: '',
            materialTabIndex: '',
            selectedId: '',
            selectedData: '',
            city: '',
            province: '',
            nation: '',
            selectProv: '',
            selectCity: '',
            account: this.$store.state.weChatAccount.accountInfo.account,
            fansGroupData: {
                account: this.$store.state.weChatAccount.accountInfo.account
            },
            dateOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            tempHistoryData: [],
            sealedCountry: '',
            sealedProvince: '',
            sealedCity: '',
            historyData: [],
            tableData:[],
            rules: {
                personCount: [
                    {validator: ValidateNumber, trigger: 'blur'}
                ],
                percentage: [
                    {validator: ValidatePercentage, trigger: 'blur'}
                ],
                fansGroupId: [
                    {required: true, message: '请选择粉丝组'}
                ],
                gender: [
                    {required: true, message: '请选择粉丝组'}
                ],
                country: [
                    {required: true, message: '请选择国家'}
                ],
                city: [
                    {required: true, message: '请选择城市'}
                ],
                province: [
                    {required: true, message: '请选择省份'}
                ],
                setSendTime: [
                    {required: true, message: '请选择时间'}
                ]
            },
            totalPage2:10,
            timer:"",
            showFans:false,
            searchFlag:false,
            searchFormVisible:false,
            options
        }

    },
    methods: {
        tabClick(tab, event) {
            this.titleTabIndex = tab.index
            if (this.titleTabIndex === '0') {
                this.getFansGroupList()
                this.getNation()
                this.freshFlag = false;
                this.searchFlag = false;
            } else if (this.titleTabIndex === '1') {
                this.searchFlag = true;
                this.getMessageHistoryList(this.historyPageParam, this.$store.state.weChatAccount.accountInfo.account)

            }
        },
        timeTask(){
            return setInterval(this.task,3000);
        },
        task(){
            if(this.titleTabIndex === '1' && this.$route.path == "/push-message/message" && this.freshFlag){
                this.getMessageHistoryList(this.historyPageParam, this.$store.state.weChatAccount.accountInfo.account)
            }
        },
        materialTabClick(tab, event) {
            this.materialTabIndex = tab.index
            this.dialogFormVisible = true;
            this.selectedRadio = ''
            this.selectedData = ''
            if (this.materialTabIndex === '0') {
                this.getLinkDataList()
            } else if (this.materialTabIndex === '1') {
                this.getNewsDataList()
            } else if (this.materialTabIndex === '2') {
                this.getTextDataList()
            } else if (this.materialTabIndex === '3') {
                this.getImageDataList()
            } else if (this.materialTabIndex === '4') {
                this.getVoiceDataList()
            } else if (this.materialTabIndex === '5') {
                this.getVideoDataList()
            } else {
                this.getCardsList()
            }
        },
        getLinkDataList() {
            GetExternalLinksList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
            })
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            if (this.materialTabIndex === '0') {
                this.getLinkDataList()
            } else if (this.materialTabIndex === '1') {
                this.getNewsDataList()()
            } else if (this.materialTabIndex === '2') {
                this.getTextDataList()
            } else if (this.materialTabIndex === '3') {
                this.getImageDataList()
            } else if (this.materialTabIndex === '4') {
                this.getVoiceDataList()
            } else if (this.materialTabIndex === '5') {
                this.getVideoDataList()
            } else {
                this.getCardsList()
            }
        },
        getTextDataList() {
            GetTextList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
            })
        },
        getImageDataList() {
            GetImageList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
            })
        },
        getNewsDataList() {
            this.pageParam.status = 1;
            GetArticlePhotoList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']

            })
        },
        getVoiceDataList() {
            GetVoiceList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
            })
        },
        getCardsList() {
            GetCardsList(this.account,this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']

            })
        },
        getVideoDataList() {
            GetVideoList(this.pageParam).then(response => {
                this.dataList = response.data
                this.totalPage = response.headers['x-total-count']
            })
        },
        getLinkById(id, account) {
            GetExternalLinksById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'link'
                })
        },
        getTextById(id, account) {
            GetTextById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'text'
                })
        },
        getVoiceById(id, account) {
            GetVoiceById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'voice'

                })
        },
        getVideoById(id, account) {
            GetVideoById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'video'
                })
        },
        getImageById(id, account) {
            GetImageById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'image'
                })
        },
        getArticlePhotoById(id, account) {
            GetArticlePhotoById(id, account)
                .then(response => {
                    this.selectedData = response.data
                    this.temp.materialType = 'news'
                })
        },
        getCardById(id, account) {
            GetCardData(id, account)
                .then(response => {
                    this.selectedData = response.data
                })
        },
        confirm() {
            if (this.selectedRadio === '') {
                this.ConfirmBox("请先选择")
                    .then(() => {
                        return false
                    })
            } else {
                if (this.materialTabIndex === '0') {
                    this.getLinkById(this.selectedRadio.id, this.selectedRadio.account)
                } else if (this.materialTabIndex === '1') {
                    this.getArticlePhotoById(this.selectedRadio.id, this.selectedRadio.account)
                } else if (this.materialTabIndex === '2') {
                    this.getTextById(this.selectedRadio.id, this.selectedRadio.account)
                } else if (this.materialTabIndex === '3') {
                    this.getImageById(this.selectedRadio.id, this.selectedRadio.account)
                } else if (this.materialTabIndex === '4') {
                    this.getVoiceById(this.selectedRadio.id, this.selectedRadio.account)
                } else if (this.materialTabIndex === '5') {
                    this.getVideoById(this.selectedRadio.id, this.selectedRadio.account)
                } else {
                    this.selectedData = this.selectedRadio;
                    this.temp.materialType = 'card'
                }
                this.dialogFormVisible = false;
            }

        },
        cancel() {
            this.dialogFormVisible = false;
        },
        clearData() {
            this.dialogFormVisible = false;
            this.dataList = ''
        },
        clearSelectedData() {
            this.selectedData = ''
        },
        getFansGroupList() {
            GetFansGroupList()
                .then(response => {
                    this.fansGroupOption = response.data
                })
        },
        sendMessage(item) {

            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    if (this.temp.materialType !== '' || this.temp.materialType !== '') {
                        this.temp.percentage = parseFloat(this.temp.percentage)
                        this.temp.personCount = parseFloat(this.temp.personCount)
                        this.temp.materialId = this.selectedData.id
                        this.temp.sendWay = item.toString()
                        this.temp.setSendTime = this.getDate(this.temp.setSendTime)
                        if(this.temp.materialType == 'link' && item==0){
                            this.ConfirmBox("高级群发不支持发送外链！","高级群发","warning",true);
                            return;
                        }
                        if(item == 0){
                            this.ConfirmBox("服务号每月（自然月）仅提供4次群发权限，您是否确认发送？","高级群发","info",true).then(() => {
                                SendMessage(this.temp, this.pageParam.account)
                                    .then(response => {
                                        this.ConfirmBox("设定成功")
                                    })
                            });
                        }else {
                            this.ConfirmBox("用户在48小时内与服务号发生交互即可接收消息，您是否确认发送？","客服群发","info",true).then(() => {
                                SendMessage(this.temp, this.pageParam.account)
                                    .then(response => {
                                        this.ConfirmBox("设定成功")
                                    })
                            });
                        }

                    } else {
                        this.$message(
                            {
                                message: '请选择素材',
                                type:'error'
                            }
                        )
                    }
                }
            })

        },
        getNation() {
            GetNationList()
                .then(response => {
                    this.nation = response.data
                })
        },
        getProvinceList(value) {
            let obj = {};

            obj = this.nation.find((item) => {
                return item.name === value;
            });

            GetProvinceList(obj.id)
                .then(response => {
                    this.province = response.data

                })

            this.temp.province = ''
            this.temp.city = ''

        },
        getCityList(value) {

            let obj = {};
            obj = this.province.find((item) => {
                return item.name === value;
            });

            GetCityList(obj.id)
                .then(response => {
                    this.city = response.data
                })
            this.temp.city = ''


        },
        getCity(value) {
            console.log(value)

        },
        getSelection(value) {
            let obj = {};
            obj = this.fansGroupOption.find((item) => {
                return item.id === value;
            });
            this.temp.fansGroup = obj.name
        },
        getDate(date) {
            "use strict";
            if (date) {
                if (typeof(date) == 'string') {
                    date = new Date(date);
                }
                return date.toISOString(date)
            }
            return date;
        },
        formatter(row, column) {
            let data = row[column.property];
            if(data) {
                return data;
            } else {
                return '全部';
            }

        },
        getMessageHistoryList(page, account) {
            GetMessageHistoryList(page, account)
                .then(response => {
                    this.tempHistoryData = response.data
                    this.totalPage2 = response.headers['x-total-count']

                    let upperMaterialType = ''
                    this.freshFlag = false;
                    for (let i = 0; i < this.tempHistoryData.length; i++) {

                        this.tempHistoryData[i].setSendTime = new Date(+new Date(this.tempHistoryData[i].setSendTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                        if (this.tempHistoryData[i].sendWay === "0") {
                            this.tempHistoryData[i].sendWay = '高级发送'
                        } else {
                            this.tempHistoryData[i].sendWay = '客户群发'
                        }
                        if (this.tempHistoryData[i].materialType === 'image') {
                            this.tempHistoryData[i].materialType = "图片"
                        } else if (this.tempHistoryData[i].materialType === 'text') {
                            this.tempHistoryData[i].materialType = "文字"
                        } else if (this.tempHistoryData[i].materialType === 'video') {
                            this.tempHistoryData[i].materialType = "视频"
                        } else if (this.tempHistoryData[i].materialType === 'voice') {
                            this.tempHistoryData[i].materialType = "语音"
                        } else if (this.tempHistoryData[i].materialType === 'link') {
                            this.tempHistoryData[i].materialType = "外链"
                        } else if (this.tempHistoryData[i].materialType === 'news') {
                            this.tempHistoryData[i].materialType = "图文"
                        } else if (this.tempHistoryData[i].materialType === 'card') {
                            this.tempHistoryData[i].materialType = "卡券"
                        }
                        if (this.tempHistoryData[i].fansSex === '0') {
                            this.tempHistoryData[i].fansSex = '未知'
                        }else if (this.tempHistoryData[i].fansSex === '1') {
                            this.tempHistoryData[i].fansSex = '男性'
                        } else if (this.tempHistoryData[i].fansSex === '2') {
                            this.tempHistoryData[i].fansSex = '女性'
                        } else {
                            this.tempHistoryData[i].fansSex = '全部'
                        }

                        if(this.tempHistoryData[i].status == "1" || this.tempHistoryData[i].status == "0"){
                            this.freshFlag = true;
                            if(this.tempHistoryData[i].status == "0"){
                                this.tempHistoryData[i].progress =  "0%";
                            }else{
                                this.tempHistoryData[i].progress =  100*this.tempHistoryData[i].progress+"%";
                            }
                        } else{
                            this.tempHistoryData[i].progress =  "100%";
                        }
                    }
                    this.historyData = this.tempHistoryData
                })
        },
        getSearchGroup(){
            this.fansGroupSelectSearchBoxVisible = true
        },
        getSelectedSearchGroup(value) {
            this.temp.fansGroupId = value.id
            this.temp.fansGroup = value.name
            this.fansGroupSelectSearchBoxVisible = false
        },
        closeSearchGroup(){
            this.fansGroupSelectSearchBoxVisible = false
        },
        handleCurrentChange2(page){
            this.historyPageParam.page = page
            this.getMessageHistoryList(this.historyPageParam, this.$store.state.weChatAccount.accountInfo.account)

        },
        getFansList(page){
            GetFansList(page)
                .then((response) => {
                    if (response.data) {
                        this.fansTotalPage = Math.ceil(response.headers['x-total-count'] / page.size * 10)
                        this.tableData = response.data
                        for (let i in this.tableData) {
                            if (this.tableData[i].gender == 1) {
                                this.tableData[i].gender = '男'
                            } else if (this.tableData[i].gender == 2) {
                                this.tableData[i].gender = '女'
                            } else {
                                this.tableData[i].gender = '-'
                            }
                            if (this.tableData[i].isSubscribe == "1") {
                                this.tableData[i].unsubscribeTime = "-"
                            }
                            if (this.tableData[i].headImgUrl) {
                                this.tableData[i].headImgUrl = this.tableData[i].headImgUrl.substring(0, this.tableData[i].headImgUrl.lastIndexOf("/") + 1) + "64";
                            }
                        }
                    } else {
                        this.fansTotalPage = 0
                    }
                })
        },
        showfans(item){
            this.showFans = true;
            this.fansParam.msgSendId = item;
            this.fansParam.page = 1;
            this.fansParam.size = 10;
            this.tableData = [];
            this.getFansList(this.fansParam);
        },
        resetForm(){
            this.showFans = false;
        },
        handleCurrentChange3(page){
            this.fansParam.page = page
            this.getFansList(this.fansParam);
        },
        formatter1(row, column) {
            let issub = row[column.property];
            if (issub == '1') {
                return "已关注";
            } else {
                return "已取消";
            }
        },
        onSearch(){
            this.searchFormVisible = true;
        },
        reset(){
            this.historyPageParam.type = null;
        },
        search(){
            this.historyPageParam.page = 1;
            this.historyPageParam.size = 10;
            this.searchFormVisible = false;
            this.getMessageHistoryList(this.historyPageParam, this.$store.state.weChatAccount.accountInfo.account)
        },
        exportAll(){
            ExportAll(this.fansParam.account,this.fansParam.msgSendId);
        }
    },
    watch: {
        radio: function () {
            if (this.radio === '百分比') {
                this.temp.personCount = 0
                this.temp.percentage = ''
            } else {
                this.temp.percentage = 0
                this.temp.personCount = ''
            }
        }
    }
}


function tempInit() {
    return {
        city: "",
        country: "",
        fansGroup: "",
        fansGroupId: "",
        gender: "",
        materialId: "",
        materialType: "",
        percentage: 0,
        personCount: 0,
        province: "",
        sendWay: "",
        setSendTime: "",
        sendSuccessScale:0,
        progress:0
    }
}


