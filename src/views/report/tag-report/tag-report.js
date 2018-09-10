import echarts from 'echarts'
import store from 'store'
import {Tree} from 'element-ui-mike'
import {GetOrgData} from "../../fans-distribution/api/fansDistributionApi";
import {TagAnalysis, GetNodeChildren,GetFormTagsData,ExportTagsFrom} from '../api/reportApi'
import moment from 'moment'

export default {
    created() {
        let oid = JSON.parse(localStorage.accountInfo).account
        this.param.accounts.push(oid);
        this.getEChartData()

    },
    data() {
        return {
            msg: '',
            selectedName:'请选择组织机构',
            fansIncrease: {
                axisNameList: [],
                tagUserCount: [],
                nameIdMap: {}
            },
            searchFormVisible: false,
            treeVisible: false,
            pageParam: {
                names: '',
            },
            radio3: '菜单点击次数',
            legendData: [],
            orgVisible: false,
            param: {
                "accounts": []
            },
            name:'',
            totalPage: 10,
            tableData: [],
            pageParam2: pageParamInit(),
            totalPage2: 10,
            listData:[],
            account: this.$store.state.weChatAccount.accountInfo.account,
            tempSelectedAccount: [],
            selectedAccount: [],
            requestAccount: this.$store.state.weChatAccount.accountInfo.account
        }
    },
    methods:
        {
            setEchart() {
                let fansAdd = echarts.init(document.getElementById('fansAdd'));
                let that = this;
                let fansAddOption = {
                    title: {
                        text: '标签分布',
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
                        data: ['人数'],
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
                            name: '人数',
                            type: 'bar',
                            data: this.fansIncrease.tagUserCount
                        }
                    ]
                };

                // 使用指定的配置项和数据显示图表。
                fansAdd.setOption(fansAddOption);
                fansAdd.on('click',function (param) {
                    that.name = param.name
                    that.getFormTagsData(that.name);
                });
                window.addEventListener("resize", function () {
                    fansAdd.resize();
                });
            },

            getEChartData() {
                TagAnalysis(this.param)
                    .then((response) => {
                        // console.log(response.data);
                        this.fansIncrease = response.data;
                        this.setEchart();
                    })
            },
            onSearch: function () {
                this.searchFormVisible = true;
            },
            handleSelection(data) {
                this.param.accounts = []
                console.log(data)
                for (let i in data) {
                    if (data[i].account) {
                        this.param.accounts.push(data[i].account)
                    } else {
                        for (let m in data[i]) {
                            this.param.accounts.push(data[i][m].account)
                        }
                    }
                }
                this.param.accounts = Array.from(new Set(this.param.accounts))
                console.log(this.param.accounts)
                this.orgVisible = false
            },
            confirmAccounts() {
                if(this.tempSelectedAccount.length === 0){
                    this.param.accounts[0] = this.account
                    this.orgVisible = false
                }else {
                    this.handleSelection(this.tempSelectedAccount)
                }
            },
            handleSelectionChange(val) {
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
            //翻页功能
            handleCurrentChange(page) {
                this.pageParam2.page = page;
                this.getFormTagsData(this.name)
            },
            getOrg() {
                this.orgVisible = true
                GetOrgData(this.account)
                    .then(response => {
                        this.tableData = response.data
                    })
            },
            search: function () {
                this.requestAccount = this.param.accounts[0];
                this.getEChartData()
                this.searchFormVisible = false;
                this.listData = [];
            },
            getFormTagsData(name){
                this.pageParam2.tagId=this.fansIncrease.nameIdMap[name][0]
                this.pageParam2.account=this.requestAccount;
                GetFormTagsData(this.pageParam2)
                    .then((response)=>{{
                        this.totalPage2 = Math.ceil(response.headers['x-total-count'] / this.pageParam2.size * 10)
                        this.listData = response.data;
                        for (let i in this.listData) {
                            this.listData[i].subscribeTime = moment(this.tableData[i].subscribeTime).format("YYYY-MM-DD HH:mm:ss")
                            this.listData[i].unsubscribeTime = moment(this.tableData[i].unsubscribeTime).format("YYYY-MM-DD HH:mm:ss")
                            this.listData[i].lastActionTime = moment(this.tableData[i].lastActionTime).format("YYYY-MM-DD HH:mm:ss")
                        }
                    }})
            },
            exportAllTags: function() {
                if(this.listData.length == 0){
                    this.$message({
                        message: "数据为空无法导出",
                        type: 'error'
                    })
                    return;
                }
                ExportTagsFrom(this.pageParam2);
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
        tagId:''
    }
}
