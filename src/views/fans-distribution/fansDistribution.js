import store from 'store'
import echarts from 'echarts'
import china from 'utils/china';
import{ Tree } from 'element-ui-mike'
import treeCheck from 'src/components/treeCheck/treeCheck.vue';
import{ EfansSave,GetNodeChildren,GetOrgData, FansGeo } from './api/fansDistributionApi'
import {EfansAdd} from "../report/api/reportApi";

export default{
    mounted(){
        let oid = JSON.parse(localStorage.accountInfo).account
        this.param.accounts.push(oid);
        this.getEChartData()
	},
	components:{
        Tree,treeCheck
    },
	data(){
		return{
			msg:'',
			fansIncrease:{},
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
            tempTableData:[],
            account: this.$store.state.weChatAccount.accountInfo.account,
            tempSelectedAccount: [],
            selectedAccount:[],
            selectedName:'请选择组织机构',
            fansGeoList:[
                {
                    "name": "北京",
                    "value": 160
                },
                {
                    "name": "天津",
                    "value": 54
                },
                {
                    "name": "上海",
                    "value": 629
                },
                {
                    "name": "重庆",
                    "value": 604
                },
                {
                    "name": "河北",
                    "value": 135
                },
                {
                    "name": "河南",
                    "value": 261
                },
                {
                    "name": "云南",
                    "value": 107
                },
                {
                    "name": "辽宁",
                    "value": 64
                },
                {
                    "name": "黑龙江",
                    "value": 34
                },
                {
                    "name": "湖南",
                    "value": 151
                },
                {
                    "name": "安徽",
                    "value": 199
                },
                {
                    "name": "山东",
                    "value": 241
                },
                {
                    "name": "新疆",
                    "value": 38
                },
                {
                    "name": "江苏",
                    "value": 416
                },
                {
                    "name": "浙江",
                    "value": 301
                },
                {
                    "name": "江西",
                    "value": 113
                },
                {
                    "name": "湖北",
                    "value": 167
                },
                {
                    "name": "广西",
                    "value": 55
                },
                {
                    "name": "甘肃",
                    "value": 35
                },
                {
                    "name": "山西",
                    "value": 53
                },
                {
                    "name": "内蒙古",
                    "value": 47
                },
                {
                    "name": "陕西",
                    "value": 108
                },
                {
                    "name": "吉林",
                    "value": 33
                },
                {
                    "name": "福建",
                    "value": 77
                },
                {
                    "name": "贵州",
                    "value": 101
                },
                {
                    "name": "广东",
                    "value": 396
                },
                {
                    "name": "青海",
                    "value": 11
                },
                {
                    "name": "西藏",
                    "value": 9
                },
                {
                    "name": "四川",
                    "value": 172
                },
                {
                    "name": "宁夏",
                    "value": 24
                },
                {
                    "name": "海南",
                    "value": 34
                },
                {
                    "name": "台湾",
                    "value": 9
                },
                {
                    "name": "香港",
                    "value": 12
                },
                {
                    "name": "澳门",
                    "value": 17
                }
            ]
        }
	},
	methods:{
        async getEChartData(){
            this.fansIncrease = await EfansSave(this.param)
                .then((response)=>{
                    return response.data;
                })
            this.fansGeoList = await FansGeo(this.param.accounts[0])
                .then((response)=>{
                    return response.data.region;
                })
            this.setEchart();
        },
		setEchart(){
            function initEchart(chartId){
                return echarts.init(document.getElementById(chartId));
            }

            let fansDistribution = initEchart('fansDistribution'),
                fansGeoDistion = initEchart('fansGeoDistion')

	        let fansDistributionOption = {
				title : {
					text:'粉丝分布',
			        x:'center',
			        left:'center',
			        top:10
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        data:[{
			        		name:'性别分布',
			        		icon:'circle',
			        	},{
			        		name:'活跃度'
			        	}

			        ],
			        align: 'left',
			        left:'center',
			        top:40
			        // ['男','女','未知','活跃','不活跃']
			    },
			    series : [
			        {
			            name: '性别分布',
			            type: 'pie',
			            radius : '55%',
			            center: ['25%', '60%'],
			            data:this.fansIncrease.genderDistributed,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        },
			        {
			            name: '活跃度',
			            type: 'pie',
			            radius : '55%',
			            center: ['75%', '60%'],
			            data:this.fansIncrease.activeDistributed,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};

            let fansGeoOption = {
                title : {
                    text: '粉丝地区分布',
                    // textStyle:{ color:'#72889d',fontSize:16,fontWeight:'normal' },
                    left:'center',
                    top:15
                },
                tooltip : {
                    trigger: 'item'
                },
                visualMap: {
                    min: 0,
                    max: this.getGeoMax(),
                    show:false,
                },
                series : [
                    {
                        name: '粉丝分布',
                        type: 'map',
                        mapType: 'china',
                        top:'20%',

                        itemStyle:{
                            normal:{ borderColor:'#dedede' }
                        },
                        label: {
                            normal: { show: false },
                        },
                        data:this.fansGeoList
                    }
                ]
            }

	        // 使用指定的配置项和数据显示图表。
	        fansDistribution.setOption(fansDistributionOption);
            fansGeoDistion.setOption(fansGeoOption);
			window.addEventListener("resize",function(){
					fansDistribution.resize();
		        });
		},
        getGeoMax () {
            let max = 0;
            for (let v of this.fansGeoList.values()){
                if(v.value > max){max = v.value}
            }
            return max
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
            }
        },
        handleSelectionChange(val){
            console.log(val)
            this.tempSelectedAccount = val;
            if(this.tempSelectedAccount.length>0){
                this.param.accounts = []
                this.selectedName = this.tempSelectedAccount[0].accountName
                this.param.accounts.push(this.tempSelectedAccount[0].account)
                this.param.accounts = Array.from(new Set(this.param.accounts))
                this.orgVisible = false
            }

    //this.tempSelectedAccount.push(val)
            //this.tempSelectedAccount = Array.from(new Set(this.tempSelectedAccount))
            //console.log(this.tempSelectedAccount)
        },
        getOrg(){
            this.orgVisible = true
            GetOrgData(this.account).then(response => {
                this.tableData = response.data
            })
        },
        search: function () {
            this.getEChartData()

            this.searchFormVisible = false;
        },
        reset: function () {
            this.param.accounts = []
            this.param.accounts.push(this.account)
        }
	},
}
