import echarts from 'echarts'
import {GetCardData,CreateCard,EditCard,GetCardImage,GetCardReport} from "../../api/cardCouponsApi";
import moment from 'moment';
import { ValidateSkuNum } from "utils/validate"
export default{
    created(){
        this.account = this.$store.state.weChatAccount.accountInfo.account;
        // this.upLoadApi= process.env.UPLOAD_API + 'card-service/api/card/media/uploadimg/'+this.account;
        if(this.$route.params.cardId){
            this.isUpdate=true;
            let _id = this.$route.params.cardId
            this.getCardData(this.account, _id)
            this.getCardImage(this.account, _id)
            this.cardParam.card_id=_id;
        }
    },
    data(){
        return {
            temp: tempInit(),
            onXHR:false,
            cardIncrease:{
                nameList: ["浏览次数", "浏览人数", "领取次数", "领取人数", "使用次数", "使用人数", "转赠次数", "转赠人数", "过期次数","过期人数"],
                valueList: [0, 0, 0,0, 0, 0, 0, 0, 0, 0]
            },
            upLoadApi: process.env.UPLOAD_API + 'material/api/file/upload',
            // upLoadApi: process.env.UPLOAD_API + 'api/card/media/uploadimg/' + this.account,
            cardId: this.$route.params.cardId,
            account: "",
            accountImg: "",
            imageUrl: process.env.MATERIAL_API,
            codeImg: "",
            coverImg: "",
            canSave: true,
            cardParam:cardReportParam(),
            tags: [],
            bgcolor: "",
            value1: "",
            value2: "",
            value1_show: "",
            value2_show: "",
            reportTime1:"",
            reportTime2:"",
            totalPage: 10,
            typeMap: [
                {
                    name: "文本",
                    value: "CODE_TYPE_TEXT"
                }, {
                    name: "一维码",
                    value: "CODE_TYPE_BARCODE"
                }, {
                    name: "二维码",
                    value: "CODE_TYPE_QRCODE"
                }, {
                    name: "二维码无code显示",
                    value: "CODE_TYPE_ONLY_QRCODE"
                }, {
                    name: "一维码无code显示",
                    value: "CODE_TYPE_ONLY_BARCODE"
                }, {
                    name: "不显示code和条形码类型",
                    value: "CODE_TYPE_NONE"
                }
            ],
            colorMap: {
                Color010: "#63b359",
                Color020: "#2c9f67",
                Color030: "#509fc9",
                Color040: "#5885cf",
                Color050: "#9062c0",
                Color060: "#d09a45",
                Color070: "#e4b138",
                Color080: "#ee903c",
                Color090: "#dd6549",
                Color100: "#cc463d"
            },
            time: {
                0: "DATE_TYPE_FIX",
                1: "_TIME_RANGE"
            },
            tableData: [],
            pageParam: pageParamInit(),
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() >Date.now()- 8.64e7;
                }
            },
            rules: {
                "general_coupon.base_info.brand_name": [{
                    required: true, message: '请填写商户名称', trigger: 'blur'
                }
                ],
                "general_coupon.base_info.title": [{
                    required: true, message: '请填写优惠券标题', trigger: 'blur'
                }
                ],
                "timerange": [{
                    required: true, message: '请选择有效期', trigger: 'blur'
                }
                ],
                "general_coupon.base_info.color": [{
                    required: true, message: '请选择卡券颜色', trigger: 'blur'
                }
                ],
                // "general_coupon.base_info.code_type": [{
                //     required: true, message: '请选择编码类型', trigger: 'blur'
                // }
                // ],
                "general_coupon.base_info.logo_url": [{
                    required: true, message: '请上传商户图标', trigger: 'blur'
                }
                ],
                "general_coupon.default_detail": [{
                    required: true, message: '请填写优惠说明', trigger: 'blur'
                }
                ],
                "general_coupon.base_info.sku.quantity": [{
                    required: true, message: '请填写库存', trigger: 'blur'
                },
                    {validator: ValidateSkuNum, trigger: 'blur'}
            ],
                "general_coupon.base_info.description": [{
                    required: true, message: '请填写使用须知', trigger: 'blur'
                }],
                "general_coupon.base_info.get_limit": [{
                    required: true, message: '请填写领券限制', trigger: 'blur'
                },
                    {validator: ValidateSkuNum, trigger: 'blur'}]
            },
            isUpdate:false
        }
     },
    methods: {
        getCardData(account, cardId) {
            GetCardData(account, cardId)
                .then((response) => {
                    if (response.data) {
                        // this.totalPage = Math.ceil(response.headers['x-total-count'] / pageParam.size * 10)
                        this.temp = response.data.card
                        if(this.temp.general_coupon.base_info.date_info.begin_timestamp){
                            var newDate = new Date();
                            newDate.setTime(this.temp.general_coupon.base_info.date_info.begin_timestamp * 1000);
                            this.value1=  moment(newDate).format("YYYY-MM-DD");
                        }
                        if(this.temp.general_coupon.base_info.date_info.end_timestamp){
                            var newDate = new Date();
                            newDate.setTime(this.temp.general_coupon.base_info.date_info.end_timestamp * 1000);
                            if(newDate<new Date()){
                                this.canSave=false
                            }
                            this.value2=  moment(newDate).format("YYYY-MM-DD");
                        }
                        this.temp.general_coupon.base_info.sku.quantity=this.temp.general_coupon.base_info.sku.quantity.toString()
                        this.temp.general_coupon.base_info.get_limit=this.temp.general_coupon.base_info.get_limit.toString()
                        for(var key in this.colorMap) {
                            if (this.temp.general_coupon.base_info.color == this.colorMap[key]) {
                                this.temp.general_coupon.base_info.color=key;
                                break;
                            }
                        }
                    } else {
                        this.totalPage = 0
                    }
                })
        },
        getCardImage(account, cardId) {
            GetCardImage(account, cardId)
                .then((response) => {
                    if (response.data) {
                        if(response.data.logoUrlPath){
                            this.accountImg = response.data.logoUrlPath
                        }
                        if(response.data.iconUrlPath){
                            this.coverImg = response.data.iconUrlPath
                        }
                        if(response.data.qryCodeUrl){
                            this.codeImg = response.data.qryCodeUrl
                        }
                    }
                })
        },
        handleSave(tab, event) {
            if(this.value1!=''&&this.value2!=''){
                this.temp.timerange="hasTimeRange";
            }
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    this.onXHR=true
                    if (this.isUpdate) {
                        if (this.value1 != "" && this.value2 != "") {
                            this.temp.general_coupon.base_info.date_info.begin_timestamp = Date.parse(new Date(this.value1)) / 1000;
                            this.temp.general_coupon.base_info.date_info.end_timestamp = Date.parse(new Date(this.value2)) / 1000;
                            EditCard(this.account, this.$route.params.cardId, this.$route.params.id, this.temp,this.accountImg)
                                .then((response) => {
                                    this.$router.push({name: '卡券服务'});
                                }, () => {

                                    return false

                                })
                        }

                    } else {
                        console.log("这是创建按钮")
                        if (this.value1 != "" && this.value2 != "") {
                            this.temp.general_coupon.base_info.date_info.begin_timestamp = Date.parse(new Date(this.value1)) / 1000;
                            this.temp.general_coupon.base_info.date_info.end_timestamp = Date.parse(new Date(this.value2)) / 1000;
                            CreateCard(this.account, this.temp,this.accountImg,this.coverImg)
                                .then((response) => {
                                    this.$router.push({name: '卡券服务'});
                                }, () => {
                                    return false
                                })
                        }
                    }
                } else {
                    return false;
                }
            });
        },
        handleAvatarSuccess(res, file) {
            // console.log(file)
            this.coverImg = file.response
            // this.temp.serverUrl = file.response
            // this.coverImg = file.response.path
            this.temp.general_coupon.advanced_info.abstract.icon_url_list[0] = file.response
        },
        handleImgSuccess(res, file) {
            // console.log(file)
            this.accountImg = file.response
            // this.accountImg = file.response.path
            this.temp.general_coupon.base_info.logo_url = file.response
        },
        colorChange(){
            this.bgcolor=this.colorMap[this.temp.general_coupon.base_info.color];
        },
        startTimeChange(){
            var s = Date.parse(this.value1)
            var e = Date.parse(this.value2)
            if (e < s) {
                this.$message({
                    message: '开始时间不能晚于结束时间',
                    type: 'error'
                })
                this.value1 = "";
            } else {
                this.value1_show = this.value1==""?"": moment(this.value1).format("YYYY-MM-DD");
            }
        },
        endTimeChange(){
            var s = Date.parse(this.value1)
            var e = Date.parse(this.value2)
            if (e < s) {
                this.$message({
                    message: '开始时间不能晚于结束时间',
                    type: 'error'
                })
                this.value2 = "";
            } else {
                this.value2_show = this.value2==""?"": moment(this.value2).format("YYYY-MM-DD");
            }
        },
        tabchange(tab){
            if(tab.name == "cardReport"){
                this.setEchart();
            }
        },
        searchReport(){
            var s=Date.parse(this.reportTime1)
            var e=Date.parse(this.reportTime2)
            if(this.reportTime1==""){
                this.$message({
                    message: '请选择开始时间',
                    type: 'error'
                });
            }
            else if(this.reportTime2==""){
                this.$message({
                    message: '请选择结束时间',
                    type: 'error'
                });
            }
            else if(s>e){
                this.$message({
                    message: '结束时间要大于开始时间',
                    type: 'error'
                });
            }
            else if((e - s) / 3600 / 1000 / 24>62 ){
                this.$message({
                    message: '相差时间不能大于62天',
                    type: 'error'
                });
            }else {
                this.cardParam.begin_date=moment(this.reportTime1).format("YYYY-MM-DD");
                this.cardParam.end_date=moment(this.reportTime2).format("YYYY-MM-DD");
                GetCardReport(this.account, this.cardParam)
                    .then((response) => {
                        if (response.data) {
                            var list=response.data;
                            this.cardIncrease.valueList=[list.view_cnt,list.view_user,list.receive_cnt,
                                list.receive_user,list.verify_cnt,list.verify_user,list.given_cnt,
                                list.given_user,list.expire_cnt,list.expire_user]
                        }
                        this.setEchart();
                    });
            }
        },
        setEchart(){
            let cardAdd = echarts.init(document.getElementById('cardAdd'));

            let cardAddOption = {
                title:{
                    text: '卡券报表',
                    left:'center',
                    top:10
                },
                tooltip : {
                    trigger: 'axis',
                    // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    // }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        magicType: {type: ['bar']}
                    },
                    top:10,
                    right:40
                },
                legend: {
                    data:['数量'],
                    align: 'left',
                    left:'center',
                    top:40
                },
                grid: {
                    top:90,
                    left: '3%',
                    right: '4%',
                    bottom: '55',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap: false,
                        data : this.cardIncrease.nameList
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start:0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start:0,
                        end: 100
                    }
                ],
                series :[
                    {
                        name:'数量',
                        type:'bar',
                        data:this.cardIncrease.valueList
                    }
                ]
            };

            // 使用指定的配置项和数据显示图表。
            cardAdd.setOption(cardAddOption);
            window.addEventListener("resize",function(){
                cardAdd.resize();
            });
        },
        avatarUpload(file) {
            const isJepg = file.type === 'image/jpeg';
            const isJpg = file.type === 'image/jpg' ;
            const isPng = file.type === 'image/png';
            const isBmp = file.type === 'image/bmp' ;
            const isGif = file.type === 'image/gif' ;
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isJepg && !isJpg && !isPng && !isBmp && !isGif) {
                this.$message(
                    {
                        message: '图片类型必须是gif,jpeg,jpg,png,bmp中的一种',
                        type: 'error'
                    }
                );
                return false
            }

            if (!isLt1M) {
                this.$message(
                    {
                        message: '上传头像图片大小不能超过1MB',
                        type: 'error'
                    }
                );
                return false
            }
        }

    }
}

function tempInit() {
    return  {
        card_type: "GENERAL_COUPON",
        general_coupon: {
            base_info: {
                logo_url: "",
                brand_name: "",
                code_type: "CODE_TYPE_QRCODE",
                title: "",
                color: "",
                notice: "",
                service_phone: "",
                description: "",
                date_info: {
                    type: "DATE_TYPE_FIX_TIME_RANGE",
                    begin_timestamp: 1511193600,
                    end_timestamp: 1511971200
                },
                sku: {
                    // quantity: 0
                },
                // use_limit: 100,
                // get_limit: 0,
                // use_custom_code: false,
                // bind_openid: false,
                // can_share: true,
                // can_give_friend: true,
                // location_id_list: [
                //     123,
                //     12321,
                //     345345
                // ],
                // center_title: "顶部居中按钮",
                // center_sub_title: "按钮下方的wording",
                // center_url: "www.qq.com",
                // custom_url_name: "立即使用",
                // custom_url: "http://www.qq.com",
                // custom_url_sub_title: "6个汉字tips",
                // promotion_url_name: "更多优惠",
                // promotion_url: "http://www.qq.com",
                // source: "大众点评"
            },
            advanced_info: {
                use_condition: {
                    // accept_category: "鞋类",
                    // reject_category: "阿迪达斯",
                    can_use_with_other_discount: true
                },
                abstract: {
                    abstract: "",
                    icon_url_list: [
                        ""
                    ]
                }
            },
            default_detail: ""
        }
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10
    }
}

function cardReportParam() {
    return {
        begin_date: "",
        end_date: "",
        cond_source: 1,
        card_id: ""
    }
}

