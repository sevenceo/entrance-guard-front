import {GetFansData, GetEventPage, GetMessagePage,GetFansTag,GetTreeData,HandTags,ExportEvent,filterTree} from "../api/fansManageApi";
import moment from 'moment';
import MapView from '../../../components/BMapComponent/BMapComponent.vue'
import TagTree from '../../../components/TagTree/TagTree.vue'
export default{
    created(){
        // this.account = this.$store.state.weChatAccount.accountInfo.account;
        // this.accountImg = this.$store.state.weChatAccount.accountInfo.accountImg;
        // this.getFansData(this.account, this.openId),
        // this.getEventPage(this.account, this.openId, this.pageParam)
        // this.getMessagePage(this.account, this.openId, this.pageMsgParam)
        // this.getFansTag(this.account, this.openId)
    },
    data(){
        return {
            activeName:"basicInfo",
            temp: tempInit(),
            openId: "",
            account: "",
            accountImg: "",
            tags:[],
            totalPage: 10,
            totalMSGPage: 10,
            showFans360Dialog:false,
            typeMap: {
                0: "未知消息类型",
                1: "服务器接入验证消息",
                100: "文本消息",
                101: "图片消息",
                102: "语音消息",
                103: "视频消息",
                104: "小视频消息",
                105: "地理位置消息",
                106: "链接消息",
                107: "链接消息",
                108: "链接消息",
                200: "搜索关注",
                201: "扫码关注",
                202: "取消关注",
                203: "扫码",
                204: "自定义菜单事件",
                205: "点击菜单跳转链接时的事件推送",
                206: "上报地理位置事件",
                300: "发送卡券",
                303: "卡券领取事件推送",
                301: "卡券审核通过事件推送",
                302: "卡券审核通过事件推送",
                400: "模版消息发送任务完成"
            },
            tableData: [],
            pageParam: pageParamInit(),
            pageMsgParam: pageParamInit(),
            messageList: [],
            imageUrl:process.env.MATERIAL_API,
            mediaUrl:process.env.MATERIAL_API,
            videoSrc:"",
            videoDialogVisible:false,
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
            height:"400px",
            treeData:[],
            myGeo:new BMap.Geocoder()
            // 百度map
    //         loc:[],
            // longitude:118.77807441,
            // latitude:32.0572355
           
            
        }
    },
    components:{
        MapView,
        TagTree
    },
    methods: {
        
        //  显示用户信息
        getFansData(account, openId){
            GetFansData(account,openId)
                .then((response) => {
                    if (response.data) {
                        this.temp = response.data
                        switch (this.temp.language) {
                            case "zh_CN":
                                this.temp.language = "简体中文";
                                break;
                            default:
                                this.temp.language = "其他"
                        }
                        if (this.temp.gender == 1) {
                            this.temp.gender = '男'
                        } else if (this.temp.gender == 2) {
                            this.temp.gender = '女'
                        } else {
                            this.temp.gender = '-'
                        }

                        if (this.temp.isSubscribe == "1") {
                            this.temp.isSubscribe = "是"
                            this.temp.unsubscribeTime="-"
                        } else {
                            this.temp.isSubscribe = "否"
                        }
                    }
                })
        },
        getFansTag(account, openId){
            GetFansTag(this.account, this.openId)
                .then((response) => {
                    this.tags = response.data;
                })
        },
        getEventPage(account, openId, pageParam){
            GetEventPage(this.account, this.openId, this.pageParam)
                .then((response) => {
                    if (response.data) {
                        this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
                        this.tableData = response.data
                        let point = null;
                        let pt = null;
                        let addressMap = [];
                        let $this = this;
                        for (let i in this.tableData) {
                            if(response.data[i].eventType == '203'){
                                this.tableData[i].eventParms = JSON.parse(this.tableData[i].eventParms).activityName;
                            }
                            if(response.data[i].eventType == '206'){
                                point = JSON.parse(this.tableData[i].eventParms);
                                pt = new BMap.Point(point.longitude,point.latitude);
                                this.myGeo.getLocation(pt, function(rs){
                                    $this.tableData[i].eventParms = rs.addressComponents.province + rs.addressComponents.city + rs.addressComponents.district + rs.addressComponents.street + rs.addressComponents.streetNumber;
                                });
                            }
                            this.tableData[i].eventType = this.typeMap[this.tableData[i].eventType]
                            this.tableData[i].eventTime = moment(this.tableData[i].eventTime).format("YYYY-MM-DD HH:mm:ss")
                        }
                    } else {
                        this.totalPage = 0
                    }
                })
        },
        getMessagePage(account, openId, pageParam){
            GetMessagePage(account,openId,pageParam)
                .then((response) => {
                    if (response.data) {
                        this.totalMSGPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
                        this.messageList = response.data;
                        for (let i in this.messageList) {
                            this.messageList[i].medias=$.extend({},this.temp.medias,this.messageList[i].medias)
                            this.messageList[i].messageTime = moment(this.messageList[i].messageTime).format("YYYY-MM-DD HH:mm:ss")
                            Object.keys(this.emoji).forEach(item => {
                                this.messageList[i].content = this.messageList[i].content.replace(item, this.emoji[item])
                            })
                        }
                    } else {
                        this.totalMSGPage = 0
                    }
                })
        },
        //翻页功能
        handleCurrentChange1(page){
            this.pageParam.page = page;
            this.getEventPage(this.account, this.openId, this.pageParam)
        },
        //翻页功能
        handleCurrentChange2(page){
            this.pageMsgParam.page = page;
            this.getMessagePage(this.account, this.openId, this.pageMsgParam)
        },
        //视频播放逻辑
        stopPlay() {
            this.videoSrc = ''
        },
        showVideo(url) {
            this.videoDialogVisible = true
            this.videoSrc =  this.mediaUrl+url
        },
        resetForm(){
            this.showFans360Dialog = false;
        },
        getData(account,openId){
            this.resetVariable();
            this.$store.state.weChatAccount.accountInfo.openId = openId;
            this.account = this.$store.state.weChatAccount.accountInfo.account;
            this.accountImg = this.$store.state.weChatAccount.accountInfo.accountImg;
            this.openId = openId;
            this.getTreeData();
            this.getFansData(this.account, this.openId),
            this.getEventPage(this.account, this.openId, this.pageParam)
            this.getMessagePage(this.account, this.openId, this.pageMsgParam)
            this.getFansTag(this.account, this.openId)
            this.showFans360Dialog = true;
        },
        tabchange(tab){
            if(tab.name == "fansMap"){
                tab.$children[0].getMapData(this.account,this.openId);
            }
        },
        resetVariable(){
            this.activeName = "basicInfo";
            this.temp = tempInit();
            this.openId = "";
            this.account = "";
            this.accountImg = "";
            this.tags = [];
            this.totalPage = 10;
            this.totalMSGPage =  10;
            this.tableData = [];
            this.OrbitTable = [];
            this.OrbitData = [];
            this.pageParam = pageParamInit();
            this.pageMsgParam = pageParamInit();
            this.messageList = [];
            this.videoSrc = "";
            this.videoDialogVisible = false;
        },
        getTreeData: function () {
            GetTreeData().then((response) => {
                this.treeData = filterTree(response.data);
            })
        },
        exportEvent(){
            ExportEvent(this.account, this.openId);
        },
        handTags: function (treeTags) {
            let tagIds = [];
            let newTags = [];
            let data = {};
            for(let i in treeTags){
                let flag = true;
                for(let j in this.tags){
                    if(treeTags[i].id == this.tags[j].tagId){
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
                           this.tags.push(newTags[i]);
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

function tempInit() {
    return {
        id: "",
        content: "",
        msg: "",
        createdIndex: "",
        messageTime: "",
        messageType: "100",
        openId: "",
        content: "",
        sendType:30,
        needSynch: true,
        articles:[],
        imageUrl:process.env.MATERIAL_API,
        medias:{
            picUrl:"",
            serverUrl:"",
            remoteUrl:"",
            url:""
        }
    }
}


function pageParamInit() {
    return {
        page: 1,
        size: 10
    }
}

