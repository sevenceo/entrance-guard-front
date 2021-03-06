import echarts from 'echarts'
import store from 'store'
import{ Tree } from 'element-ui-mike'
import treeCheck from 'src/components/treeCheck/treeCheck.vue';
import{ EfansAdd,GetNodeChildren,GetOrgData,ExportFansFrom,GetFormFansData } from '../api/reportApi'
import {EfansSave} from "../../image-text/api/imageTextApi";
import moment from 'moment'

export default{
    created(){
        let oid = JSON.parse(localStorage.accountInfo).account
        this.param.accounts.push(oid);
        this.getEChartData()
        GetOrgData(this.account)
            .then(response => {
                this.tableData = response.data
                this.tempTableData = $.extend([],response.data)
            })
        this.param.beginDate=moment( this.value7[0]).format("YYYY-MM-DD")
        this.param.endDate=moment( this.value7[1]).format("YYYY-MM-DD")
        this.getFormFansData();
    },
    components:{
        Tree,treeCheck
    },
    data(){
        return{
            msg:'',
            fansIncrease:{},
            searchFormVisible:false,
            searchFormVisible2:false,
            orgVisible:false,
            param: {
                accounts:[],
                beginDate:"",
                endDate:""
            },
            tableData: [],
            listData:[],
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
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            value7: initRefDate(),
            tempTableData:[],
            account: this.$store.state.weChatAccount.accountInfo.account,
            tempSelectedAccount: [],
            selectedAccount:[],
            selectedName:'请选择组织机构',
            requestAccount: this.$store.state.weChatAccount.accountInfo.account
        }
    },
    methods:{

        setEchart(){
            let fansAdd = echarts.init(document.getElementById('fansAdd'));

            let fansAddOption = {
                title:{
                    text: '粉丝增长',
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
                        magicType: {type: ['line', 'bar']}
                    },
                    top:10,
                    right:40
                },
                legend: {
                    data:['取消关注','净增关注','新增关注','粉丝总数'],
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
                        data : this.fansIncrease.axisNameList
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
                series : [
                    {
                        name:'取消关注',
                        type:'line',
                        data:this.fansIncrease.unSubscribeList
                    },
                    {
                        name:'净增关注',
                        type:'line',
                        data:this.fansIncrease.netSubscribeList
                    },
                    {
                        name:'新增关注',
                        type:'line',
                        data:this.fansIncrease.subscribeList
                    },
                    {
                        name:'粉丝总数',
                        type:'line',
                        data:this.fansIncrease.fansCountList
                    }
                ]
            };

            // 使用指定的配置项和数据显示图表。
            fansAdd.setOption(fansAddOption);
            window.addEventListener("resize",function(){
                fansAdd.resize();
            });
        },
        selectRow(row, event, column){
            console.log(row)
        },
        getEChartData(){
            EfansAdd(this.param)
                .then((response)=>{
                    // console.log(response.data);
                    this.fansIncrease = response.data;
                    this.setEchart();
                })
        },
        getFansDate: function(obj){
            if(this.value7 == undefined || this.value7.length != 2){
                this.$message({
                    message: "日期范围选取错误",
                    type: 'error'
                })
                return;
            }
            this.param.beginDate=moment( this.value7[0]).format("YYYY-MM-DD")
            this.param.endDate=moment( this.value7[1]).format("YYYY-MM-DD")
            this.getFormFansData();
        },
        getFormFansData(){
            this.param.account = this.requestAccount;
            this.param.accounts[0] = this.requestAccount;
            GetFormFansData(this.param)
                .then((response)=>{
                    // console.log(response.data);
                    this.listData = response.data;
                    for (let i in this.listData) {
                        this.listData[i].reportDate = moment(this.listData[i].reportDate).format("YYYY-MM-DD HH:mm:ss")
                    }
                })
        },
        exportAllFans: function() {
            this.param.account=this.param.accounts[0];
            if(this.listData.length == 0){
                this.$message({
                    message: "数据为空无法导出",
                    type: 'error'
                })
                return;
            }
            ExportFansFrom(this.param);
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        onSearch2: function () {
            this.searchFormVisible2 = true;
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
            }
        },
        handleSelectionChange(val){
            console.log(val)
            this.tempSelectedAccount = val
            this.tempSelectedAccount = Array.from(new Set(this.tempSelectedAccount))
            console.log(this.tempSelectedAccount)
            if(this.tempSelectedAccount.length>0){
                this.selectedName = this.tempSelectedAccount[0].accountName
                this.confirmAccounts()
            }
            GetOrgData(this.account)
                .then(response => {
                    this.tableData = response.data
                })
        },
        getOrg(){
            this.orgVisible = true
        },
        close(){

        },
        search: function () {
            this.getEChartData()
            this.searchFormVisible = false;
            this.requestAccount = this.param.accounts[0];
            this.getFormFansData();
        },
        search2: function () {
            if(this.param.accounts.length > 1){
                this.$message({
                    message: "请选择单个公众号",
                    type: 'error'
                })
                return;
            }
            if (this.param.beginDate == "" || this.param.endDate == "") {
                this.$message({
                    message: "请选择开始时间和结束时间",
                    type: 'error'
                })
                return
            }
            var now = Date.now();
            var lw = new Date(now - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
            var start=new Date(this.param.beginDate)
            var end=new Date(this.param.endDate)
                if (start>end) {
                    // console.log('起始时间不能大于结束时间!');
                    this.$message({
                        message: "开始时间不能大于结束时间",
                        type: 'error'
                    })
                    return
                }
            if(start<lw||end<lw||start>now||end>now){
                this.$message({
                    message: "时间范围为最近30天内",
                    type: 'error'
                })
                return
            }
            this.param.beginDate=moment( this.param.beginDate).format("YYYY-MM-DD")
            this.param.endDate=moment( this.param.endDate).format("YYYY-MM-DD")
            this.getFormFansData(this.param)
            this.searchFormVisible2 = false;
        },
        reset: function () {
            this.param.accounts = []
            this.param.accounts.push(this.account)
        },
    },
    mounted(){
        // this.setEchart();
    }
}

let tempData = []


function initRefDate() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    return [start,end];
}