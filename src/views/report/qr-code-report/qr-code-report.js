import echarts from 'echarts'
import store from 'store'
import {Tree} from 'element-ui-mike'
import treeCheck from 'src/components/treeCheck/treeCheck.vue';
import {QrCodeAnalysis, GetNodeChildren, GetOrgData,GetFormScansData,ExportScansFrom} from '../api/reportApi'
import moment from 'moment'


export default {
    created() {
        let oid = JSON.parse(localStorage.accountInfo).account
        this.param.accounts.push(oid);
        this.getEChartData()

    },
    components: {
        Tree, treeCheck
    },
    data() {
        return {
            msg: '',
            fansIncrease: {
                axisNameList: [],
                scanCount: [],
                leadCount: [],
                subscribeCount: []
            },
            searchFormVisible: false,
            treeVisible: false,
            pageParam: {
                names: '',
            },
            pageParam2: pageParamInit(),
            orgVisible:false,
            param: {
                "accounts":[]
            },
            totalPage: 10,
            pageParam2: pageParamInit(),
            totalPage2: 10,
            tableData: [],
            listData:[],
            index:'',
            type:'',
            typeMap:{
                "扫码数":"scanUserPage",
                "留资数":"customerUserPage",
                "关注数":"subUserPage"
            },
            account: this.$store.state.weChatAccount.accountInfo.account,
            tempSelectedAccount: [],
            selectedAccount:[],
            selectedAccountName:"请选择组织机构",
            requestAccount: this.$store.state.weChatAccount.accountInfo.account
        }
    },
    methods: {
        handleData() {
            for (let i in this.fansIncrease.menuClickUser.series) {
                this.legendData[i] = this.fansIncrease.menuClickUser.series[i].name
            }
        },
        setEchart() {
            // this.handleData()
            console.log(this.legendData)
            let fansAdd = echarts.init(document.getElementById('fansAdd'));
            let that = this;
            let fansAddOption = {
                title: {
                    text: '二维码分布',
                    left: 'center',
                    top: 10
                },
                tooltip: {
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
                    top: 10,
                    right: 40
                },
                legend: {
                    data: ['扫码数', '留资数', '关注数'],
                    align: 'left',
                    left: 'center',
                    top: 40
                },
                grid: {
                    top: 90,
                    left: '3%',
                    right: '4%',
                    bottom: '55',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        // boundaryGap: false,
                        data: this.fansIncrease.axisNameList
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                series: [
                    {
                        name: '扫码数',
                        type: 'bar',
                        data: this.fansIncrease.scanCount
                    },
                    {
                        name: '留资数',
                        type: 'bar',
                        data: this.fansIncrease.leadCount
                    },
                    {
                        name: '关注数',
                        type: 'bar',
                        data: this.fansIncrease.subscribeCount
                    },
                ]
            };

            fansAdd.on('click',function (param) {
                console.log(param)
                var name = param.seriesName;
                that.type=that.typeMap[name]
                that.index = param.dataIndex
                that.getFormScansData(that.index,that.type);
            });
            // 使用指定的配置项和数据显示图表。
            fansAdd.setOption(fansAddOption);
            window.addEventListener("resize", function () {
                fansAdd.resize();
            });
        },
        getEChartData(){
            QrCodeAnalysis(this.param)
                .then((response)=>{
                    // console.log(response.data);
                    this.fansIncrease = response.data;
                    this.setEchart();
                })
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
                this.selectedAccountName = this.tempSelectedAccount[0].accountName
                this.param.accounts.push(this.tempSelectedAccount[0].account)
                this.param.accounts = Array.from(new Set(this.param.accounts))
                this.orgVisible = false
            }

        },
        getFormScansData(index,type){
            this.pageParam2.activityId=this.fansIncrease.activityIdList[index]
            this.pageParam2.account=this.requestAccount;
            GetFormScansData(this.pageParam2)
                .then((response)=>{{
                    this.totalPage2 = response.data[type].totalPages;
                    // this.totalPage2 = Math.ceil(response.headers['x-total-count'] / this.pageParam2.size * 10)
                    this.listData = response.data[type].content;
                    for (let i in this.listData) {
                        this.listData[i].subscribeTime = moment(this.tableData[i].subscribeTime).format("YYYY-MM-DD HH:mm:ss")
                        this.listData[i].unsubscribeTime = moment(this.tableData[i].unsubscribeTime).format("YYYY-MM-DD HH:mm:ss")
                        this.listData[i].lastActionTime = moment(this.tableData[i].lastActionTime).format("YYYY-MM-DD HH:mm:ss")
                    }
                }})
        },
        exportAllScans: function() {
            if(this.listData.length == 0){
                this.$message({
                    message: "数据为空无法导出",
                    type: 'error'
                })
                return;
            }
            ExportScansFrom(this.pageParam2);
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam2.page = page;
            this.getFormScansData(this.index, this.type)
        },
        getOrg(){
            this.orgVisible = true
            GetOrgData(this.account)
                .then(response => {
                    this.tableData = response.data
                })
        },
        search: function () {
            this.requestAccount = this.param.accounts[0];
            this.getEChartData()
            this.listData = [];
            this.searchFormVisible = false;
        },
        reset: function () {
            this.param.accounts = []
            this.param.accounts.push(this.account)
        }
    },
    mounted() {
        // this.setEchart();
    }
}


function pageParamInit() {
    return {
        page: 1,
        size: 10,
        account:'',
        activityId:''
    }
}
