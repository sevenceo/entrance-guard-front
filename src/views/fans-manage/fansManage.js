import {parseTime} from 'utils'
import {GetFansList, GetRefreshResult, GetFansData,ExportAllFans,GetTreeData,HandTags,filterTree} from "./api/fansManageApi";
import TagTree from '../../components/TagTree/TagTree.vue'
import fansDetail from './fans-detail/fansDetail.vue'
import {
    GetMSGDetailList,
    SaveMSG,
    GetReplyData,
    GetUserMsgState,
    GetFansLabelList
} from "../fans-msg-manage/api/fansMSGManageApi";
import moment from 'moment'

const subscribeStateOptions = [
    {key: 1, label: '已关注'},
    {key: 0, label: '已取消'},
];

export default {
    created() {
        this.account = this.$store.state.weChatAccount.accountInfo.account;
        this.accountImg = this.$store.state.weChatAccount.accountInfo.accountImg;
        this.getFansList(this.account, this.pageParam);
        this.getTreeData();
    },
    data() {
        var checkSubscribeTimeStart = (rule, value, callback) => {
            if(this.pageParam.subscribeTimeStart && this.pageParam.subscribeTimeEnd) {
                if(this.pageParam.subscribeTimeStart >  this.pageParam.subscribeTimeEnd) {
                    callback(new Error('起始日期应小于等于结束日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkSubscribeTimeEnd = (rule, value, callback) => {
            if(this.pageParam.subscribeTimeStart && this.pageParam.subscribeTimeEnd) {
                if(this.pageParam.subscribeTimeStart >  this.pageParam.subscribeTimeEnd) {
                    callback(new Error('结束日期应大于等于起始日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkLastActionTimeStart = (rule, value, callback) => {
            if(this.pageParam.lastActionTimeStart && this.pageParam.lastActionTimeEnd) {
                if(this.pageParam.lastActionTimeStart >  this.pageParam.lastActionTimeEnd) {
                    callback(new Error('起始日期应小于等于结束日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkLastActionTimeEnd = (rule, value, callback) => {
            if(this.pageParam.lastActionTimeStart && this.pageParam.lastActionTimeEnd) {
                if(this.pageParam.lastActionTimeStart >  this.pageParam.lastActionTimeEnd) {
                    callback(new Error('结束日期应大于等于起始日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkUnsubscribeTimeStart = (rule, value, callback) => {
            if(this.pageParam.unsubscribeTimeStart && this.pageParam.unsubscribeTimeEnd) {
                if(this.pageParam.unsubscribeTimeStart >  this.pageParam.unsubscribeTimeEnd) {
                    callback(new Error('起始日期应小于等于结束日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkUnsubscribeTimeEnd = (rule, value, callback) => {
            if(this.pageParam.unsubscribeTimeStart && this.pageParam.unsubscribeTimeEnd) {
                if(this.pageParam.unsubscribeTimeStart >  this.pageParam.unsubscribeTimeEnd) {
                    callback(new Error('结束日期应大于等于起始日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            searchRule: {
                subscribeTimeStart: [
                    { validator: checkSubscribeTimeStart, trigger: 'change' }
                ],
                subscribeTimeEnd: [
                    { validator: checkSubscribeTimeEnd, trigger: 'change' }
                ],
                lastActionTimeStart: [
                    { validator: checkLastActionTimeStart, trigger: 'change' }
                ],
                lastActionTimeEnd: [
                    { validator: checkLastActionTimeEnd, trigger: 'change' }
                ],
                unsubscribeTimeStart: [
                    { validator: checkUnsubscribeTimeStart, trigger: 'change' }
                ],
                unsubscribeTimeEnd: [
                    { validator: checkUnsubscribeTimeEnd, trigger: 'change' }
                ]
            },
            tableData: [],
            subscribeStateOptions,
            dbListInSearchBox: [{name: '是', value: '1'}, {name: '否', value: '0'}],
            totalPage: 10,
            account: "",
            openId: "",
            pageParam: pageParamInit(),
            searchFormVisible: false,
            cardSelectBoxVisible: false,
            value1: '',
            value2: '',
            pageParam2: pageParamInit(),
            totalPage2: 10,
            fansData: {},
            accountImg: "",
            userImg: "",
            temp: tempInit(),
            tempMaterial: tempMaterialInit(),
            fansLabelList: [],
            dialogStatus: '昵称',
            messageList: [],
            mOptions: [],
            textarea: "",
            imageUrl: process.env.MATERIAL_API,
            mediaUrl: process.env.MATERIAL_API,
            sendUrl: process.env.MATERIAL_API,
            typeMap: {
                text: 100,
                image: 101,
                voice: 102,
                video: 103,
                link: 107,
                news: 108,
                card: 300
            },
            replyMSG: [
                {
                    name: "你好",
                    value: "你好"
                }, {
                    name: "在的",
                    value: "在的"
                }, {
                    name: "客服电话",
                    value: "客服电话：025-112113114"
                }, {
                    name: "公司地址",
                    value: "公司地址：中国上海"
                }
            ],
            videoSrc: "",
            videoDialogVisible: false,
            dialogFormVisible: false,
            dialogFormVisible2: false,
            emoji: {
                "/::)": "<img class='wechat-emoji' src='/static/emoji/100.gif' alt='微笑' width='24'>",
                "/::~": "<img  class='wechat-emoji' src='/static/emoji/101.gif' alt='伤心'>",
                "/::B": "<img  class='wechat-emoji' src='/static/emoji/102.gif' alt='美女'>",
                "/::|": "<img  class='wechat-emoji' src='/static/emoji/103.gif' alt='发呆'>",
                "/:8-)": "<img  class='wechat-emoji' src='/static/emoji/104.gif' alt='墨镜'>",
                "/::<": "<img  class='wechat-emoji' src='/static/emoji/105.gif' alt='哭'>",
                "/::$": "<img  class='wechat-emoji' src='/static/emoji/106.gif' alt='羞'>",
                "/::X": "<img  class='wechat-emoji' src='/static/emoji/107.gif' alt='哑'>",
                "/::Z": "<img  class='wechat-emoji' src='/static/emoji/108.gif' alt='睡'>",
                "/::'(": "<img  class='wechat-emoji' src='/static/emoji/109.gif' alt='哭'>",
                "/::-|": "<img  class='wechat-emoji' src='/static/emoji/110.gif' alt='囧'> ",
                "/::@": "<img  class='wechat-emoji' src='/static/emoji/111.gif' alt='怒'> ",
                "/::P": "<img  class='wechat-emoji' src='/static/emoji/112.gif' alt='调皮'> ",
                "/::D": "<img  class='wechat-emoji' src='/static/emoji/113.gif' alt='笑'> ",
                "/::O": "<img  class='wechat-emoji' src='/static/emoji/114.gif' alt='惊讶'> ",
                "/::(": "<img  class='wechat-emoji' src='/static/emoji/115.gif' alt='难过'> ",
                "/::+": "<img  class='wechat-emoji' src='/static/emoji/116.gif' alt='酷'> ",
                "/:--b": "<img  class='wechat-emoji' src='/static/emoji/117.gif' alt='汗'> ",
                "/::Q": "<img  class='wechat-emoji' src='/static/emoji/118.gif' alt='抓狂'> ",
                "/::T": "<img  class='wechat-emoji' src='/static/emoji/119.gif' alt='吐'> ",
                "/:,@P": "<img  class='wechat-emoji' src='/static/emoji/120.gif' alt='笑'> ",
                "/:,@-D": "<img  class='wechat-emoji'  src='/static/emoji/121.gif' alt='快乐'> ",
                "/::d": "<img  class='wechat-emoji' src='/static/emoji/122.gif' alt='奇'> ",
                "/:,@o": "<img  class='wechat-emoji' src='/static/emoji/123.gif' alt='傲'> ",
                "/::g": "<img  class='wechat-emoji' src='/static/emoji/124.gif' alt='饿'> ",
                "/:|-)": "<img  class='wechat-emoji' src='/static/emoji/125.gif' alt='累'> ",
                "/::!": "<img  class='wechat-emoji' src='/static/emoji/126.gif' alt='吓'> ",
                "/::L": "<img  class='wechat-emoji' src='/static/emoji/127.gif' alt='汗'> ",
                "/::>": "<img  class='wechat-emoji' src='/static/emoji/128.gif' alt='高兴'> ",
                "/::,@": "<img  class='wechat-emoji' src='/static/emoji/129.gif' alt='闲'> ",
                "/:,@f": "<img  class='wechat-emoji' src='/static/emoji/130.gif' alt='努力'> ",
                "/::-S": "<img  class='wechat-emoji' src='/static/emoji/131.gif' alt='骂'> ",
                "/:?": "<img  class='wechat-emoji' src='/static/emoji/132.gif' alt='疑问'> ",
                "/:,@x": "<img  class='wechat-emoji' src='/static/emoji/133.gif' alt='秘密'> ",
                "/:,@@": "<img  class='wechat-emoji' src='/static/emoji/134.gif' alt='乱'> ",
                "/::8": "<img  class='wechat-emoji' src='/static/emoji/135.gif' alt='疯'> ",
                "/:,@!": "<img  class='wechat-emoji' src='/static/emoji/136.gif' alt='哀'> ",
                "/:!!!": "<img  class='wechat-emoji' src='/static/emoji/137.gif' alt='鬼'> ",
                "/:xx": "<img  class='wechat-emoji' src='/static/emoji/138.gif' alt='打击'> ",
                "/:bye": "<img  class='wechat-emoji' src='/static/emoji/139.gif' alt='bye'> ",
                "/:wipe": "<img  class='wechat-emoji' src='/static/emoji/140.gif' alt='汗'> ",
                "/:dig": "<img  class='wechat-emoji' src='/static/emoji/141.gif' alt='抠'> ",
                "/:handclap": "<img  class='wechat-emoji' src='/static/emoji/142.gif' alt='鼓掌'> ",
                "/:&-(": "<img  class='wechat-emoji' src='/static/emoji/143.gif' alt='糟糕'> ",
                "/:B-)": "<img  class='wechat-emoji' src='/static/emoji/144.gif' alt='恶搞'> ",
                "/:<@": "<img  class='wechat-emoji' src='/static/emoji/145.gif' alt='什么'> ",
                "/:@>": "<img  class='wechat-emoji' src='/static/emoji/146.gif' alt='什么'> ",
                "/::-O": "<img  class='wechat-emoji' src='/static/emoji/147.gif' alt='累'> ",
                "/:>-|": "<img  class='wechat-emoji' src='/static/emoji/148.gif' alt='看'> ",
                "/:P-(": "<img  class='wechat-emoji' src='/static/emoji/149.gif' alt='难过'> ",
                "/::'|": "<img  class='wechat-emoji' src='/static/emoji/150.gif' alt='难过'> ",
                "/:X-)": "<img  class='wechat-emoji' src='/static/emoji/151.gif' alt='坏'> ",
                "/::*": "<img  class='wechat-emoji' src='/static/emoji/152.gif' alt='亲'> ",
                "/:@x": "<img  class='wechat-emoji' src='/static/emoji/153.gif' alt='吓'> ",
                "/:8*": "<img  class='wechat-emoji' src='/static/emoji/154.gif' alt='可怜'> ",
                "/:pd": "<img  class='wechat-emoji' src='/static/emoji/155.gif' alt='刀'> ",
                "/:<W>": "<img  class='wechat-emoji' src='/static/emoji/156.gif' alt='水果'> ",
                "/:beer": "<img  class='wechat-emoji' src='/static/emoji/157.gif' alt='酒'> ",
                "/:basketb": "<img  class='wechat-emoji' src='/static/emoji/158.gif' alt='篮球'> ",
                "/:oo": "<img  class='wechat-emoji' src='/static/emoji/159.gif' alt='乒乓'> ",
                "/:coffee": "<img  class='wechat-emoji' src='/static/emoji/160.gif' alt='咖啡'> ",
                "/:eat": "<img  class='wechat-emoji' src='/static/emoji/161.gif' alt='美食'> ",
                "/:pig": "<img  class='wechat-emoji' src='/static/emoji/162.gif' alt='动物'> ",
                "/:rose": "<img  class='wechat-emoji' src='/static/emoji/163.gif' alt='鲜花'> ",
                "/:fade": "<img  class='wechat-emoji' src='/static/emoji/164.gif' alt='枯'> ",
                "/:showlove": "<img  class='wechat-emoji' src='/static/emoji/165.gif' alt='唇'> ",
                "/:heart": "<img  class='wechat-emoji' src='/static/emoji/166.gif' alt='爱'> ",
                "/:break": "<img  class='wechat-emoji' src='/static/emoji/167.gif' alt='分手'> ",
                "/:cake": "<img  class='wechat-emoji' src='/static/emoji/168.gif' alt='生日'> ",
                "/:li": "<img class='wechat-emoji'  src='/static/emoji/169.gif' alt='电'> ",
                "/:bome": "<imgclass='wechat-emoji'  src='/static/emoji/170.gif' alt='炸弹'> ",
                "/:kn": "<img  class='wechat-emoji' src='/static/emoji/171.gif' alt='刀子'> ",
                "/:footb": "<img  class='wechat-emoji' src='/static/emoji/172.gif' alt='足球'> ",
                "/:ladybug": "<img  class='wechat-emoji' src='/static/emoji/173.gif' alt='瓢虫'> ",
                "/:shit": "<img  class='wechat-emoji' src='/static/emoji/174.gif' alt='翔'> ",
                "/:moon": "<img  class='wechat-emoji' src='/static/emoji/175.gif' alt='月亮'> ",
                "/:sun": "<img  class='wechat-emoji' src='/static/emoji/176.gif' alt='太阳'> ",
                "/:gift": "<img  class='wechat-emoji' src='/static/emoji/177.gif' alt='礼物'> ",
                "/:hug": "<img  class='wechat-emoji' src='/static/emoji/178.gif' alt='抱抱'> ",
                "/:strong": "<imgclass='wechat-emoji'  src='/static/emoji/179.gif' alt='拇指'> ",
                "/:weak": "<imgclass='wechat-emoji'  src='/static/emoji/180.gif' alt='贬低'> ",
                "/:share": "<img  class='wechat-emoji' src='/static/emoji/181.gif' alt='握手'> ",
                "/:v": "<img  class='wechat-emoji' src='/static/emoji/182.gif' alt='剪刀手'> ",
                "/:@)": "<imgclass='wechat-emoji'  src='/static/emoji/183.gif' alt='抱拳'> ",
                "/:jj": "<img  class='wechat-emoji' src='/static/emoji/184.gif' alt='勾引'> ",
                "/:@@": "<img  class='wechat-emoji' src='/static/emoji/185.gif' alt='拳头'> ",
                "/:bad": "<imgclass='wechat-emoji'  src='/static/emoji/186.gif' alt='小拇指'> ",
                "/:lvu": "<imgclass='wechat-emoji'  src='/static/emoji/187.gif' alt='拇指八'> ",
                "/:no": "<img  class='wechat-emoji' src='/static/emoji/188.gif' alt='食指'> ",
                "/:ok": "<img  class='wechat-emoji' src='/static/emoji/189.gif' alt='ok'> ",
                "/:love": "<img  class='wechat-emoji' src='/static/emoji/190.gif' alt='情侣'> ",
                "/:<L>": "<img  class='wechat-emoji' src='/static/emoji/191.gif' alt='爱心'> ",
                "/:jump": "<img  class='wechat-emoji' src='/static/emoji/192.gif' alt='蹦哒'> ",
                "/:shake": "<img  class='wechat-emoji' src='/static/emoji/193.gif' alt='颤抖'> ",
                "/:<O>": "<imgclass='wechat-emoji'  src=''/static/emoji/194.gif' alt='怄气'> ",
                "/:circle": "<img  class='wechat-emoji' src='/static/emoji/195.gif' alt='跳舞'> ",
                "/:kotow": "<img  class='wechat-emoji' src='/static/emoji/196.gif' alt='发呆'> ",
                "/:turn": "<imgclass='wechat-emoji'  src=''/static/emoji/197.gif' alt='背着'> ",
                "/:skip": "<imgclass='wechat-emoji'  src=''/static/emoji/198.gif' alt='伸手'> ",
                "/:oY": "<imgclass='wechat-emoji'  src=''/static/emoji/199.gif' alt='耍帅'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/200.png' alt='微笑'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/201.png' alt='生病'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/202.png' alt='哭泣'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/203.png' alt='吐舌'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/204.png' alt='迷糊'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/205.png' alt='瞪眼'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/206.png' alt='恐怖'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/207.png' alt='忧愁'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/208.png' alt='眨眉'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/209.png' alt='闭眼'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/210.png' alt='鄙视'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/211.png' alt='阴暗'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/212.png' alt='小鬼'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/213.png' alt='礼物'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/214.png' alt='拜佛'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/215.png' alt='力量'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/216.png' alt='金钱'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/217.png' alt='蛋糕'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/218.png' alt='彩带'  width=24'> ",
                "": "<img  class='wechat-emoji' src='/static/emoji/219.png' alt='礼物'  width=24'> "
            },
            showHistroy: false,
            userInfoVisible: false,
            historyMessageList: [],
            searBarVisible: false,
            keyWord: '',
            fansTagSelectSearchBoxVisible:false,
            selectedName:"选择标签",
            userInfoTreeData:[]
        }
    },
    components: {
        fansDetail,
        TagTree
    },
    directives: {
        /*这个是vue的自定义指令,官方文档有详细说明*/
        // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
        'scroll-bottom'(el) {
            //console.log(el.scrollTop);
            setTimeout(function () {
                el.scrollTop += 999999;
            }, 10)
        }
    },
    methods: {
        //  显示用户信息
        getFansList(account, pageParam) {
            GetFansList(account, pageParam)
                .then((response) => {
                    if (response.data) {
                        this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
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
                        this.totalPage = 0
                    }
                })
        },
        getRefreshResult(account) {
            GetRefreshResult(account)
                .then((response) => {
                    if (response.data) {
                        this.$message({
                            message: "同步成功",
                            type: 'success'
                        })
                        return
                    } else {
                        this.$message({
                            message: "同步失败",
                            type: 'success'
                        })
                        return
                    }
                })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getFansList(this.account, this.pageParam)
        },
        onRefresh: function () {
            this.getRefreshResult(this.account);
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        //筛选功能
        search: function () {
            console.log(this.pageParam);
            if (this.pageParam.subscribeTime != "" && this.pageParam.lastActionTime != "") {
                if (this.pageParam.subscribeTime > this.pageParam.lastActionTime) {
                    // console.log('起始时间不能大于结束时间!');
                    this.$message({
                        message: "起始时间不能大于结束时间",
                        type: 'error'
                    })
                    return
                }
            }

            this.getFansList(this.account, this.pageParam);
            this.$refs.pages.changePage(1)
            this.searchFormVisible = false;
        },
        reset: function () {
            this.pageParam = pageParamInit()
            this.selectedName = "选择标签";
        },
        //聊天详情
        handleCancel() {
            this.dialogFormVisible = false;
            this.pageParam2 = pageParamInit()
        },
        handleCancel2() {
            this.dialogFormVisible2 = false;
            this.tempMaterial = tempMaterialInit();
            this.$refs['replyMForm'].resetFields()
        },
        handleCurrentChange2(page) {
            this.pageParam2.page = page;
            this.getHistoryMessage(this.account, this.openId, this.pageParam2)
        },
        quackMsg(message) {
            this.textarea = message;
        },
        onShow(row) {
            this.dialogFormVisible = true;
            this.dialogStatus = row.nickName;
            this.userImg = row.headImgUrl;
            this.openId = row.openId;
            this.userInfoVisible = false
            this.showHistroy = false
            this.searBarVisible = false
            this.getMSGDetailList(this.account, this.openId, this.pageParam);
            this.getFansInfo(this.account, this.openId);
            this.getFansLabelList(this.account, this.openId);
            this.ajax_dialog(this.account, this.openId, this.pageParam)
            this.$nextTick(function () {
                this.$refs.selectBox.showBtn = false
            })
        },
        saveMsg(account, message) {
            SaveMSG(account, message)
                .then((response) => {
                    if (response.data) {

                    } else {
                    }
                })
        },
        sendMSG() {
            this.temp = tempInit()
            this.temp.messageType = "100"
            this.temp.openId = this.openId
            this.temp.msg = this.textarea
            this.temp.content = this.textarea
            this.temp.openId = this.openId
            this.saveMsg(this.account, this.temp)
            this.textarea = ''
            //this.getMSGDetailList(this.account,this.openId, this.pageParam2)
        },
        onMaterial() {
            this.dialogFormVisible2 = true
        },
        getCard() {
            this.cardSelectBoxVisible = true
        },
        closeCard() {
            this.cardSelectBoxVisible = false
        },
        loadMName() {
            if (this.tempMaterial.pushType != "") {
                GetReplyData(this.account, this.tempMaterial.pushType)
                    .then((response) => {
                        if (response.data) {
                            this.mOptions = response.data
                        }
                    })
            }
        },
        ajax_dialog(account, openId, pageParam2) {
            if (this.dialogFormVisible == true && this.$route.path == "/fans-manage/fans") {
                GetUserMsgState(account, openId)
                    .then((response) => {
                        if (response.data) {
                            this.getMSGDetailList(account, openId, pageParam2)
                            this.ajax_dialog(account, openId, pageParam2)
                        } else {
                            this.ajax_dialog(account, openId, pageParam2)
                        }
                    })
            }
        },

        replyMaterial() {
            this.temp.messageType = this.typeMap[this.tempMaterial.pushType]
            if (this.tempMaterial.pushType === 'text') {
                this.temp.msg = this.tempMaterial.content;
                this.temp.content = this.tempMaterial.content;
            } else if (this.tempMaterial.pushType === 'link') {
                this.temp.msg = "link";
                this.temp.content = "link";
                this.tempMaterial.picurl = this.tempMaterial.remoteUrl
                this.temp.scopeType = this.tempMaterial.scopeType;
                this.temp.articles = []
                this.temp.articles.push(JSON.parse(JSON.stringify(this.tempMaterial)))
            } else if (this.tempMaterial.pushType === 'image') {
                this.temp.msg = this.tempMaterial.mediaId
                this.temp.content = this.tempMaterial.mediaId
            } else if (this.tempMaterial.pushType === 'news') {
                this.temp.msg = this.tempMaterial.mediaId;
                this.temp.content = this.tempMaterial.mediaId;
                this.temp.articles = [];
                this.temp.articles.push(JSON.parse(JSON.stringify(this.tempMaterial)))
            } else {
                this.temp.msg = this.tempMaterial.mediaId
                this.temp.content = this.tempMaterial.mediaId
            }
            this.temp.medias = $.extend({}, this.temp.medias, this.tempMaterial);
            this.temp.openId = this.openId
            this.saveMsg(this.account, this.temp)
            this.dialogFormVisible2 = false
        },
        getMSGDetailList(account, openId, pageParam) {
            GetMSGDetailList(account, openId, pageParam)
                .then((response) => {
                    if (response.data) {
                        this.totalPage2 = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
                        this.messageList = response.data
                        for (let i in this.messageList) {
                            this.messageList[i].medias = $.extend({}, this.temp.medias, this.messageList[i].medias)
                            this.messageList[i].messageTime = moment(this.messageList[i].messageTime).format("YYYY-MM-DD HH:mm:ss")
                            Object.keys(this.emoji).forEach(item => {
                                if (this.messageList[i].content) {
                                    this.messageList[i].content = (this.messageList[i].content.split(item)).join(this.emoji[item]);
                                    this.messageList[i].content = this.messageList[i].content.replace(/\n/g, '<br />')

                                }
                            })
                        }
                    } else {
                        this.totalPage2 = 0
                    }
                })
        },
        getFansInfo(account, openId, data) {
            GetFansData(account, openId, data)
                .then((response) => {
                    if (response.data) {
                        this.fansData = response.data
                        switch (this.fansData.language) {
                            case "zh_CN":
                                this.fansData.language = "简体中文";
                                break;
                            default:
                                this.fansData.language = "其他"
                        }
                        if (this.fansData.gender == 1) {
                            this.fansData.gender = '男'
                        } else if (this.temp.gender == 2) {
                            this.fansData.gender = '女'
                        } else {
                            this.fansData.gender = '-'
                        }

                        if (this.fansData.isSubscribe == "1") {
                            this.fansData.isSubscribe = "是"
                        } else {
                            this.fansData.isSubscribe = "否"
                        }
                    }
                })
        },
        getFansLabelList(account, openId) {
            GetFansLabelList(account, openId)
                .then((response) => {
                    if (response.data) {
                        this.fansLabelList = response.data
                    }
                })
        },
        resetForm() {
            // this.getFansMSGList(this.account, this.pageParam)
            this.pageParam2 = pageParamInit()
            this.textarea = ''
        },
        resetForm2() {
            this.$refs['replyMForm'].resetFields();
            this.tempMaterial = tempMaterialInit()

        },
        loadMaterial() {
            if (this.tempMaterial.materialId != '') {
                var ml = this.mOptions
                var i = 0;
                for (var material in ml) {
                    if (ml[i].id == (this.tempMaterial.materialId)) {

                        this.tempMaterial = $.extend({}, this.tempMaterial, ml[i]);
                        break;
                    }
                    i++;
                }
            }
        },
        //视频播放逻辑
        stopPlay() {
            this.videoSrc = ''
        },
        showVideo(url) {
            this.videoDialogVisible = true
            this.videoSrc = this.mediaUrl + url
        },
        getSelectedCard(value, type) {
            this.temp = tempInit()
            this.temp.medias.pushType = 'card'
            this.temp.messageType = this.typeMap["card"]
            this.temp.msg = value.cardId
            this.temp.content = value.cardId
            this.temp.openId = this.openId
            this.temp.medias.title = value.cardTitle
            this.temp.medias.picUrl = value.logoUrlPath
            this.saveMsg(this.account, this.temp)
            this.cardSelectBoxVisible = false
        },
        getSelectedTempMaterial(value, type) {
            this.temp = tempInit()
            this.tempMaterial.pushType = type
            this.tempMaterial.materialId = value.id
            this.tempMaterial.materialName = value.name
            this.tempMaterial.serverUrl = value.serverUrl
            this.tempMaterial.picUrl = value.picUrl
            this.tempMaterial.url = value.url
            this.tempMaterial.content = value.content
            this.tempMaterial.mediaId = value.mediaId
            this.tempMaterial.remoteUrl = value.remoteUrl
            this.tempMaterial.scopeType = value.scopeType;
            if (value.title) {
                this.tempMaterial.title = value.title
            }else {
                this.tempMaterial.title = ''
            }

            this.replyMaterial()
        },
        getHistoryMessage(account, openId, pageParam) {
            GetMSGDetailList(account, openId, pageParam)
                .then((response) => {
                    if (response.data) {
                        this.totalPage2 = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
                        this.historyMessageList = response.data
                        console.log(this.historyMessageList)
                        for (let i in this.historyMessageList) {
                            this.historyMessageList[i].medias = $.extend({}, this.temp.medias, this.historyMessageList[i].medias)
                            this.historyMessageList[i].messageTime = moment(this.historyMessageList[i].messageTime).format("YYYY-MM-DD HH:mm:ss")
                            Object.keys(this.emoji).forEach(item => {
                                this.historyMessageList[i].content = (this.historyMessageList[i].content.split(item)).join(this.emoji[item]);
                                this.historyMessageList[i].content = this.historyMessageList[i].content.replace(/\n/g, '<br />')
                            })
                        }
                    } else {
                        this.totalPage2 = 0
                    }
                })
        },
        showHistory() {
            this.showHistroy = !this.showHistroy;
            this.getHistoryMessage(this.account, this.openId, this.pageParam2)
        },
        showUserInfo() {
            this.userInfoVisible = true
        },
        formatter(row, column) {
            let issub = row[column.property];
            if (issub == '1') {
                return "已关注";
            } else {
                return "已取消";
            }
        },
        gotofansDetail(account, openId) {
            if (this.$store.state.user.roles.indexOf('Fans.Detial') != -1) {
                //this.$router.push({path: '/fans-manage/fans-detail/' + openId});
                this.$refs.fansDetail.getData(account, openId);
            }
        },
        sendKeyBoardMSG(e) {
            if (e.ctrlKey) {
                if (e.ctrlKey && e.keyCode === 13) {
                    this.textarea = this.textarea + '\n'
                }
            } else if (e.keyCode === 13) {
                if (this.textarea == '\n') {
                    this.textarea = ''
                }
                this.sendMSG()

            }
        },
        showSearchBar() {
            this.searBarVisible = !this.searBarVisible
        },
        searchData() {
            console.log(this.keyWord)
            this.getHistoryMessage(this.account, this.openId, this.pageParam2)
        },
        showFansTagSelectBox(){
            this.fansTagSelectSearchBoxVisible = true;
        },
        closeSearchTag(){
            this.fansTagSelectSearchBoxVisible = false;
        },
        getSelectedTag(tag){
            this.fansTagSelectSearchBoxVisible = false;
            this.selectedName = tag.name;
            this.pageParam.tagId = tag.id;
            console.log(tag);
        },
        exportAllFans: function() {
            if(this.tableData.length == 0){
                this.$message({
                    message: "数据为空无法导出",
                    type: 'error'
                })
                return;
            }
            ExportAllFans(this.account, this.pageParam);
        },
        getTreeData: function () {
            GetTreeData().then((response) => {
                this.userInfoTreeData = filterTree(response.data);
            })
        },
        handTags: function (treeTags) {
            let tagIds = [];
            let newTags = [];
            let data = {};
            for(let i in treeTags){
                let flag = true;
                for(let j in this.fansLabelList){
                    if(treeTags[i].id == this.fansLabelList[j].tagId){
                        flag = false;
                    }
                }
                if(flag){
                    tagIds.push(treeTags[i].id)
                    treeTags[i].tagId = treeTags[i].id;
                    treeTags[i].tagName = treeTags[i].name;
                    newTags.push(treeTags[i]);
                }
            }
            if(tagIds.length != 0){
                data = {
                    "account": this.account,
                    "openId": this.openId,
                    "tagIds": tagIds
                }
               HandTags(data).then((response) => {
                    if(response.status == 200) {
                        this.$message({
                            message: "手动打标签成功",
                            type: 'success'
                        })
                        for(let i in newTags){
                            this.fansLabelList.push(newTags[i]);
                        }
                    }else{
                        this.$message({
                            message: "手动打标签失败",
                            type: 'error'
                        })
                    }
                })
            }
        }

    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        nickName: '',
        subscribeTimeStart: '',
        subscribeTimeEnd: '',
        lastActionTimeStart: '',
        lastActionTimeEnd: '',
        unsubscribeTimeStart:'',
        unsubscribeTimeEnd:"",
        isSubscribe: "",
        phoneInfo: 0,
        keyWord: null,
        tagId:''
    }
}


function tempInit() {
    return {
        id: "",
        msg: "",
        createdIndex: "",
        messageTime: "",
        messageType: "100",
        openId: "",
        content: "",
        sendType: 30,
        needSynch: true,
        articles: [],
        scopeType:"",
        // urls:"",
        medias: {
            picurl: "",
            serverUrl: "",
            remoteUrl: "",
            url: "",
            pushType:''
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
        picurl: "",
        title: null,
        remoteUrl : ""
    }
}