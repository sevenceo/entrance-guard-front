import store from 'store'
import echarts from 'echarts'
import china from 'utils/china';
import{ EfansSave,Global,Target } from './api/dashboardApi'

export default{
	created(){
		let aid = localStorage.getItem("aid");

        EfansSave(aid)
            .then((response)=>{
                this.dashboarData = response.data;
                if(this.dashboarData.lively > 100){
                	this.dashboarData.lively = 100
                };
                this.setEchart();
            })
	},
	beforMount(){
		window.addEventListener("resize",function(){
		            ecFansZhl.resize();
		            ecFansHyd.resize();
		            ecFansSex.resize();
		            fansSave.resize();
					fansAction.resize();
					fansPlace.resize();
		        });
	},
	data(){
		return{
			msg:'',
			gaugeTitle:{
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 16,
                fontStyle: 'italic'
			},
			detailOption: {
		                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                formatter: function (value) {
		                    value = (value + '').split('.');
		                    console.log(value);
		                    if (value.length < 2 && value.push('00')){
		                    	return (value[0])+'%';
		                    }
		                    
		                },
		                fontWeight: 'bolder',
		                fontSize:20,
		                textBorderWidth: 0,
		                textShadowBlur: 0,
		                textShadowColor: '#333',
		                textShadowOffsetX: 0,
		                textShadowOffsetY: 0,
		                fontFamily: 'Arial',
		                width: 40,
		                color: '#333',
		                rich: {}
		            },

			dashboarData:{
				    "subscribe": 0,
				    "unSubscribe": 0,
				    "netSubscribe": 0,
				    "fansCount": 0,
				    "remain": 0,
				    "lively": 0,
				    "conver": 0,
				    "axisNameList": [],
				    "subscribeList": [],
				    "unSubscribeList": [],
				    "netSubscribeList": [],
				    "fansCountList": [],
				    "scanCountList": [],
				    "messageCountList": [],
				    "menuClickCountList": []
				},
		}
	},
	methods:{
		backTop:function(){
			var sc=$(window).scrollTop();
   			$('.main-container').animate({scrollTop:0},500);
		},
		setEchart(){
			// echarts初始化 传入容器id
			function initEchart(chartId){
				return echarts.init(document.getElementById(chartId));
			}
			let ecFansZhl = initEchart('ecFans-zhl'),
				ecFansHyd = initEchart('ecFans-hyd'),
				ecFansSex = initEchart('ecFans-sex'),
				fansSave = initEchart('fansSave'),
				fansAction = initEchart('fansAction'),
				fansPlace = initEchart('ecFans-dqfb');
			
			// 将取消关注数组转换成负值
			var data2 = [];
			// this.dashboarData.axisNameList = ["10-18","10-19","10-20","10-21","10-22","10-23","10-24","10-25","10-26","10-27","10-28","10-29","10-30","10-31","11-01"]
			$.each(this.dashboarData.unSubscribeList,function(i,v){
				data2.push(0-v);
			})
			this.dashboarData.unSubscribeList = data2;

			// 环状图默认样式
			let itemStyleDef = {
				normal: {
                    color: '#dee8f1',
                    value:100,
                    left:'center',
                    label: {
                        show: true,//标签是否显示
                        position: 'center',//饼图可选为：'outer'（外部） | 'inner'（内部）/饼图可选为：'outer'（外部） | 'inner'（内部）
                        formatter: '{b}',//饼图、雷达图、仪表盘、漏斗图: a（系列名称），b（数据项名称），c（数值）, d（饼图：百分比 | 雷达图：指标名称）
                        textStyle: { baseline: 'center',color: '#dee8f1'}
                    },
                    labelLine: { show: false }
                },  
			};

			// 环状图活动数据样式
			let itemStyleAction = {
				normal: {
	                      color: '#8ab4da',
	                      label: {
	                          show: true,//标签是否显示
	                          position: 'center',
	                          formatter: '{b}',
	                          textStyle: { fontSize:18,left:'center',top:'50%',color: '#5c8cb4' }
	                      },
	                      labelLine: { show: false }
	                 	}
			}
			let emphasis = { barBorderWidth: 1 };
			function EchartOption(tooltip,series){
				let obj = new Object();
				obj.title = {
								text: '转化率',
								textStyle:{ color:'#72889d',fontSize:16,fontWeight:'normal' },
						        left:'center',
						        top:15
							};
				obj.tooltip = tooltip;
				obj.series = [series];
				return obj;
			}
			
			// 粉丝转化率环形图
			let ecFansZhlOption = new EchartOption(
				{ show: false },
				{
                 	center: ['50%', '57%'],
                 	type: "pie",
                 	radius: ['50%', '70%'],
                 	hoverOffset:0,
            	 	legendHoverLink:false,
                 	hoverAnimation:false,
                 	"itemStyle": itemStyleDef,
                 	"clockWise": false,//是否顺时针
                 	"data": [
                        { name: this.dashboarData.conver+'%', value: this.dashboarData.conver, itemStyle: itemStyleAction },
                        { value: 100-this.dashboarData.conver }
                    ]
              	}
			);

			// 粉丝活跃度环形图
			let ecFansHydOption = new EchartOption(
					{ show: false },
					{
                        "center": ['50%', '57%'],
                        "type": "pie",
                        radius: ['50%', '70%'],
                        hoverOffset:0,
	                	legendHoverLink:false,
	                    hoverAnimation:false,
                        "itemStyle": itemStyleDef,
                        "clockWise": false,//是否顺时针
                        "data": [
		                            {
		                                 name: this.dashboarData.lively+'%', 
		                                 value: this.dashboarData.lively, 
		                                 itemStyle: itemStyleAction
		                            },
		                            { value: 100-this.dashboarData.lively }
	                            ]
		            }
				);
			ecFansHydOption.title.text = '粉丝活跃率'

			// 粉丝地区分布图表配置
	        let fansPlaceOption = {
	        	title : {
			        text: '粉丝地区分布',
			        textStyle:{ color:'#72889d',fontSize:16,fontWeight:'normal' },
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
			            data:this.dashboarData.region
			        }
			    ]
	        }
			// 粉丝性别占比
			let ecFansSexOption = {
				title:{
					text: '粉丝性别占比',
					textStyle:{
						color:'#72889d',
						fontSize:16,
						fontWeight:'normal',
					},
			        left:'center',
			        top:15
				},
				tooltip: {
			        trigger: 'item',
			        show:false,
			        // formatter: "{b}: {c}"
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'left',
			        show:false,
			        data:['男','女','未知']
			    },
			    color:['#8ab4da', '#f39c74','#6976a2'],
			    series: [
			        {
			            // name:'访问来源',
			        	center: ['50%', '57%'],
                        type: "pie",
                        clockWise: false,//是否顺时针
                        // hoverOffset:0,
	                	// legendHoverLink:false,
	                    // hoverAnimation:false,
			            radius: ['50%', '70%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    formatter: "{b}\n{d}%",
			                    position: 'center',
			                    textStyle: {
			                        fontSize: '16',
			                        // fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:this.dashboarData.gender
			        }
			    ]
			};
			// 粉丝增长情况分析图表配置
	        let fansSaveOption = {
	        	title: {
			        text: '粉丝留存度',
			        left:'center',
			        top:10
			    },
			    legend: {
			        data: ['新增人数', '取消关注', '净增人数'],
			        align: 'left',
			        left:'center',
			        top:40
			    },
			    
			    tooltip: {},
			    xAxis: {
			        data: this.dashboarData.axisNameList,
			        silent: false,
			        axisLine: {onZero: true},
			        splitLine: {show: false},
			        splitArea: {show: false}
			    },
			    yAxis: {
			        inverse: false,
			        splitArea: {show: false}
			    },
			    grid: {
			        left: 25,
			        right: 30,
			        bottom: 20,
			        top:80,
			        containLabel: true
			    },
			    series: [
			        {
			            name: '新增人数',
			            type: 'bar',
			            stack: 'one',
			            itemStyle: {
			            	normal: {
						    	color:"#8ab4da"
						    },
						    emphasis:emphasis
			            },
			            data: this.dashboarData.subscribeList
			        },
			        {
			            name: '取消关注',
			            type: 'bar',
			            stack: 'two',
			            itemStyle: {
			            	normal: {
						    	color:"#dee8f1"
						    },
						    emphasis:emphasis
			            },
			            data: this.dashboarData.unSubscribeList
			        },
			        {
			            name: '净增人数',
			            type: 'line',
			            smooth: true,
			            stack: 'three',
			            itemStyle: {
			            	normal: {
						    	color:"#fe9168"
						    },
						    emphasis:emphasis
			            },
			            data: this.dashboarData.netSubscribeList
			        }
			    ]
			};
			// 粉丝活跃度图表配置
	        let fansActionOption = {
	            title: {
			        text: '粉丝活跃度',
			        left:'center',
			        top:10
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow',
			            // label: {
			            //     backgroundColor: '#6a7985'
			            // }
			        }
			    },
			    legend: {
			        data:['菜单点击','消息总数','扫码总数'],
			        top:40,
			    },
			    grid: {
			        left: 30,
			        right: 30,
			        bottom: 20,
			        top:80,
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : this.dashboarData.axisNameList
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'扫码总数',
			            type:'bar',
			            stack: '总量',
			            itemStyle: {
			            	normal: {
						    	color:"#195180"
						    }
			            },
			            data:this.dashboarData.scanCountList
			        },
			        {
			            name:'消息总数',
			            type:'bar',
			            stack: '总量',
			            itemStyle: {
			            	normal: {
						    	color:"#5388b4"
						    }
			            },
			            data:this.dashboarData.messageCountList
			        },
			        {
			            name:'菜单点击',
			            type:'bar',
			            stack: '总量',
			            itemStyle: {
			            	normal: {
						    	color:"#8ab4da"
						    }
			            },
			            data:this.dashboarData.menuClickCountList
			        }
			    ]
	        };

	        
	        // 使用指定的配置项和数据显示图表。
	        ecFansZhl.setOption(ecFansZhlOption);
	        ecFansHyd.setOption(ecFansHydOption);
	        ecFansSex.setOption(ecFansSexOption);
	        fansSave.setOption(fansSaveOption);
	        fansAction.setOption(fansActionOption);
	        fansPlace.setOption(fansPlaceOption);
	        
			window.addEventListener("resize",function(){
		            ecFansZhl.resize();
		            ecFansHyd.resize();
		            ecFansSex.resize();
		            fansSave.resize();
					fansAction.resize();
					fansPlace.resize();
		        });
		},
        getGeoMax () {
            let max = 0;
            for (let v of this.dashboarData.region.values()){
                if(v.value > max){max = v.value}
            }
            return max
        },
	},
	mounted(){
		// this.setEchart();	
	}
}
