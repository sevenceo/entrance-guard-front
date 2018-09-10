import store from 'store'
import echarts from 'echarts'
import{ Tree } from 'element-ui-mike'
import treeCheck from 'src/components/treeCheck/treeCheck.vue';
import{ EfansSave,GetOrgData,GetArticleData,GetArticleDetails,ExportArticleDetail } from './api/imageTextApi'
import moment from 'moment';
// import {GetOrgData} from "../fans-distribution/api/fansDistributionApi";

export default{
	created(){
        let oid = JSON.parse(localStorage.accountInfo).account
        this.param.accounts.push(oid);
        this.getEChartData()
        this.getArticleDate();
	},
	components:{
        Tree,treeCheck
    },
	data(){
		return{
			msg:'',
			imgTxt:{},
			searchFormVisible:false,
			treeVisible:false,
			pageParam:{
				names:'',
			},
            orgVisible:false,
            param: {
                "accounts":[]
            },
            tableData: [],
            account: this.$store.state.weChatAccount.accountInfo.account,
            tempSelectedAccount: [],
            pickerOptions2: {
                shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            value7: initRefDate(),
            articleData:[],
            showFlag:false,
            articleDetails:[],
            pageParam: pageParamInit(),
            totalPage: 10,
            msgId:"",
            title:"",
            selectedName:"选择组织机构",
            requestAccount: this.$store.state.weChatAccount.accountInfo.account
		}
	},
	methods:{
        getEChartData(){
            EfansSave(this.param)
                .then((response)=>{
                    // console.log(response.data);
                    this.imgTxt = response.data;
                    this.setEchart();
                })
        },
		setEchart(){
			let imgText = echarts.init(document.getElementById('imgText'));

	        let imgTextOption = {
	        	title:{
					text: '图文分析',
					left:'center',
			        top:10
				},
				tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
    			},
    			toolbox: {
			        feature: {
			            dataZoom: {
			                yAxisIndex: 'none'
			            },
			            magicType: {type: ['line', 'bar']},
			        },
			        top:10,
			        right:40
			    },
			    legend: {
			        data:['图文阅读人数','分享转发次数','微信收藏次数'],
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
			            data : this.imgTxt.axisNameList
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
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
			    series : [
			        {
			            name:'图文阅读人数',
			            type:'line',
			            data:this.imgTxt.intPageReadUser
			        },
			        {
			            name:'分享转发次数',
			            type:'line',
			            data:this.imgTxt.shareCount
			        },
			        {
			            name:'微信收藏次数',
			            type:'line',
			            data:this.imgTxt.addToFavCount
			        },
			    ]
			};

	        // 使用指定的配置项和数据显示图表。
	        imgText.setOption(imgTextOption);
			window.addEventListener("resize",function(){
					imgText.resize();
		        });
		},
        onSearch: function () {
            this.searchFormVisible = true;
        },
        handleSelection(data){
            this.param.accounts = []
            console.log(data)
            for(let i in data){
                if(data[i].account){
                    this.param.accounts.push(data[i].account)
                }else {
                    for(let m in data[i]){
                        this.param.accounts.push(data[i][m].account)
                    }
                }
            }
            this.param.accounts = Array.from(new Set(this.param.accounts))
            console.log(this.param.accounts)
            this.orgVisible = false
        },
        confirmAccounts(){
            if(this.tempSelectedAccount.length === 0){
                this.param.accounts[0] = this.account
                this.orgVisible = false
            }else {
                this.handleSelection(this.tempSelectedAccount)
            }        },
        handleSelectionChange(val){
            /*console.log(val)
            this.tempSelectedAccount.push(val)
            this.tempSelectedAccount = Array.from(new Set(this.tempSelectedAccount))
            console.log(this.tempSelectedAccount)*/
            this.tempSelectedAccount = val;
            if(this.tempSelectedAccount.length>0){
                this.param.accounts = []
                this.selectedName = this.tempSelectedAccount[0].accountName
                this.param.accounts.push(this.tempSelectedAccount[0].account)
                this.param.accounts = Array.from(new Set(this.param.accounts))
                this.orgVisible = false
            }
        },
        getOrg(){
            this.orgVisible = true
            GetOrgData(this.account)
                .then(response => {
                    this.tableData = response.data
                })
        },
        search: function () {
            this.getEChartData()
            this.searchFormVisible = false;
            if(this.param.accounts.length == 0){
                return;
            }
            this.requestAccount = this.param.accounts[0];
            GetArticleData(this.param.accounts[0],this.value7[0],this.value7[1])
                .then((response)=>{
                    this.articleData = response.data;
             });
        },
        reset: function () {
            this.param.accounts = []
            this.param.accounts.push(this.account)
        },
        getArticleDate: function(obj){
            if(this.value7 == undefined || this.value7.length != 2){
                this.$message({
                    message: "日期范围选取错误",
                    type: 'error'
                })
                return;
            }

           GetArticleData(this.requestAccount,this.value7[0],this.value7[1])
                .then((response)=>{
                    this.articleData = response.data;
                });
        },
        getArticleDetails:function(account,msgid){
            GetArticleDetails(account,msgid,this.pageParam).then((response) => {
                if (response.data) {
                    this.totalPage = response.data.totalElements
                    this.articleDetails = response.data.content
                } else {
                    this.totalPage = 0
                }
            })
        },
        onShow:function(row){
            this.showFlag = true;
            this.totalPage = 10;
            this.pageParam = pageParamInit();
            this.msgId = "";
            this.msgId = row.msgid;
            this.title = "";
            this.title = row.title;

            this.getArticleDetails(this.account,this.msgId);
        },
        resetForm(){
            this.showFlag = false;
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getArticleDetails(this.account,this.msgId);
        },
        exportArticleDetail(){
            if(this.articleDetails.length == 0){
                this.$message({
                    message: "数据为空无法导出",
                    type: 'error'
                })
                return;
            }
            ExportArticleDetail(this.account,this.msgId);
        },
        formatter(row, column) {
            let date = row[column.property];
            if(date) {
                date = moment(date).format("YYYY-MM-DD");
            }
            return date;
        }
	},
	mounted(){
		// this.setEchart();	
	}
}

function initRefDate() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    return [start,end];
}

function pageParamInit() {
    return {
        page: 1,
        size: 10
    }
}
