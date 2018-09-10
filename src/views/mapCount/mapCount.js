import {
    GetAllScene,
    GetCountBySceneIds,
    GetCountAndTimeBySceneIds,
    GetAllDetail,
    GetCount,
    GetResourceCount,
    GetDeviceDetailDataById
} from "./api/mapCountApi.js";

import echarts from 'echarts';
import chinaJson from 'echarts/map/json/china.json';
import {Message} from 'element-ui'
export default {
    created() {
        /*this.getAllScene();
        this.getCountBySceneIds();
        this.getCountAndTimeBySceneIds();*/

        this.getMapData();
        this.getCount();
        /*const ecahrts = require('echarts');
        const china = require('echarts/map/js/china.js');*/
    },
    components: {
        echarts
    },
    data() {
        return {
            mapData : [
                /*{name: '览笛-西斯莱小区', value: 100},
                {name: '南方花园', value: 100},
                {name: '南京世茂梦享家', value: 100},
                {name: '世茂香槟湖一期', value: 100},
                {name: '锦绣花园', value: 100},
                {name: '测试社区', value: 100},
                {name: '世茂大观二期', value: 100}*/
            ],
            geoCoordMap : {
               /* '览笛-西斯莱小区':[113,28.21],
                '南方花园':[118.88,28.97],
                '南京世茂梦享家':[116.7,39.53],
                '世茂香槟湖一期':[115.480656,35.23375],
                '锦绣花园' :[117.27,31.86],
                '测试社区':[114.31,30.52],
                '世茂大观二期':[125.03,46.58]*/
            },
            dataArr: dataInit(),
            scenes: [],
            checkedItems: [],
            isIndeterminate: false,
            countBySceneIds: {},
            checked: true,
            newsTime: "",
            echartsCount: {},
            resourceCount: resourceInit(),
            skipbtn: false,
            tableData: [],
            scene: scene(),
            doorData: doorDataInit(),
            skipResourceId:"",
            ldServerCode:""
        }
    },
    methods: {
        getMapData(){
            let that = this;
            console.log(1234567);
            GetAllDetail().then((response) => {
                if(response.data!=null){
                    for(var i=0; i<response.data.length; i++){
                        that.dataArr = dataInit();
                        that.dataArr.name = response.data[i].resourceName;
                        that.dataArr.value = 100;
                        that.mapData.push(that.dataArr);
                        that.geoCoordMap[response.data[i].resourceName]=[parseFloat(response.data[i].longitude),parseFloat(response.data[i].latitude)];
                    }
                }
                let clrIn = setInterval(() => {
                    let that = this;
                    let newsEchart = document.getElementById('newsEchart1');
                    if (newsEchart != undefined && newsEchart != null) {
                        clearInterval(clrIn);
                    } else {
                        return;
                    }
                    echarts.registerMap('china', chinaJson);
                    let newsEchartInfo = echarts.init(newsEchart);
                    let option = {
                        backgroundColor: '#404a59',
                        /*title: {
                            text: '全国主要城市空气质量',
                            subtext: 'data from PM25.in',
                            sublink: 'http://www.pm25.in',
                            left: 'center',
                            textStyle: {
                                color: '#fff'
                            }
                        },*/
                        /*tooltip : {
                            trigger: 'item'
                        },*/
                        /*legend: {
                            orient: 'vertical',
                            y: 'bottom',
                            x:'right',
                            data:['pm2.5'],
                            textStyle: {
                                color: '#fff'
                            }
                        },*/
                        geo: {
                            map: 'china',
                            label: {
                                emphasis: {
                                    show: false
                                }
                            },
                            roam: true,
                            itemStyle: {
                                normal: {
                                    areaColor: '#323c48',
                                    borderColor: '#111'
                                },
                                emphasis: {
                                    areaColor: '#2a333d'
                                }
                            }
                        },
                        series : [
                            {
                                name: 'pm2.5',
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                data: that.convertData(that.mapData),
                                symbolSize: function (val) {
                                    return val[2] / 10;
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: false
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#ddb926'
                                    }
                                }
                            },
                            {
                                name: 'Top 5',
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                data: that.convertData(that.mapData.sort(function (a, b) {
                                    return b.value - a.value;
                                }).slice(0, this.mapData.length)),
                                symbolSize: function (val) {
                                    return val[2] / 10;
                                },
                                showEffectOn: 'render',
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                hoverAnimation: true,
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#f4e925',
                                        shadowBlur: 10,
                                        shadowColor: '#333'
                                    }
                                },
                                zlevel: 1
                            }
                        ]
                    };

                    newsEchartInfo.setOption(option);
                    newsEchartInfo.on('click',function (params) {
                        /*alert(params.name);
                        alert(params.color);*/
                        if(params.data!==undefined){
                            that.resourceCount.resourceName= "查询中";
                            that.resourceCount.allOpenNum = "查询中";
                            that.resourceCount.todayOpenNum = "查询中";
                            that.resourceCount.allRecognitionNum = "查询中";
                            that.resourceCount.todayRecognitionNum = "查询中";
                            that.skipResourceId = params.data.resourceId;
                            GetResourceCount(params.data).then((response)=>{
                                if(response.data){
                                    that.resourceCount=response.data;
                                    that.ldServerCode = that.resourceCount.ldServerCode;
                                    that.skipbtn = true;
                                    if(response.data.scenes!=null){
                                        this.tableData = [];
                                        for(var i=0;i<response.data.scenes.length;i++){
                                            that.scene = scene();
                                            that.scene.sceneName = response.data.scenes[i].sceneName;
                                            that.scene.sceneId = response.data.scenes[i].id;
                                            that.scene.tenantId = response.data.scenes[i].tenantId;
                                            that.tableData.push(that.scene);
                                        }
                                        if(that.tableData.length>0){
                                            GetDeviceDetailDataById(that.tableData[0].sceneId,that.resourceCount.ldServerCode).then((response)=>{
                                                /*that.doorData = response.data;*/
                                                if(response){
                                                    that.doorData.cpu = response.data.deviceStateDetail.cpuStatus[0].usageRate;
                                                    that.doorData.memory = response.data.deviceStateDetail.memoryStatus[0].percent;
                                                    that.doorData.disk = response.data.deviceStateDetail.diskStatus[0].percent;
                                                }
                                            })
                                        }
                                    }
                                }else{
                                    that.resourceCount.resourceName= "暂无数据";
                                    that.resourceCount.allOpenNum = "暂无数据";
                                    that.resourceCount.todayOpenNum = "暂无数据";
                                    that.resourceCount.allRecognitionNum = "暂无数据";
                                    that.resourceCount.todayRecognitionNum = "暂无数据";
                                    that.doorData.cpu = 0.0;
                                    that.doorData.memory = 0.0;
                                    that.doorData.disk = 0.0;
                                }
                            });
                        }

                        params.color = "#f00";
                        newsEchartInfo.setOption(option);
                    })
                    window.addEventListener("resize", function () {
                        newsEchartInfo.resize();
                    });
                }, 100);
            })
        },
        convertData(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = this.geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name.substring(0,data[i].name.indexOf(",")) ,
                        value: geoCoord.concat(data[i].value),
                        resourceId: data[i].name.substring(data[i].name.indexOf(",")+1,data[i].name.length),
                    });
                }
            }
            return res;
        },
        formatCount(data) {
            return data/100;
        },
        getCount() {
            GetCount().then((response)=>{
                /*console.log("----:"+response.data);*/
                this.echartsCount = response.data;
                if(this.echartsCount.openingNum > 10000 && this.echartsCount.openingNum < 100000000){
                    this.echartsCount.openingNum = (this.echartsCount.openingNum/10000).toFixed(2) + "万";
                }else if(this.echartsCount.openingNum > 100000000){
                    this.echartsCount.openingNum = (this.echartsCount.openingNum/100000000).toFixed(2) + "亿";
                }else{
                    this.echartsCount.openingNum = this.echartsCount.openingNum;
                }
                if(this.echartsCount.recognitionNum > 10000 && this.echartsCount.recognitionNum < 100000000){
                    this.echartsCount.recognitionNum = (this.echartsCount.recognitionNum/10000).toFixed(2) + "万";
                }else if(this.echartsCount.recognitionNum > 100000000){
                    this.echartsCount.recognitionNum = (this.echartsCount.recognitionNum/100000000).toFixed(2) + "亿";
                }else{
                    this.echartsCount.recognitionNum = this.echartsCount.recognitionNum;
                }
            })
        },
        skip(a){
            /*alert(this.skipResourceId);*/
            this.$router.push(a + this.skipResourceId);
        },
        alert(row, event, column){
            this.$router.push({path:'/earlyWarning/deviceEarlyWarningDetai/'+row.sceneId+'/'+row.tenantId+'/'+this.ldServerCode});
        }

    }
}

function dataInit() {
    return {
        name: "",
        value: ""
    }
}

function resourceInit() {
    return {
        resourceName: "",
        allOpenNum : "",
        todayOpenNum : "",
        allRecognitionNum :"",
        todayRecognitionNum : "",
        ldServerCode: ""
    }
}

function scene() {
    return {
        sceneId: "",
        sceneName: "",
        tenantId: ""
    }
}

function doorDataInit() {
    return {
        cpu: "",
        memory: "",
        disk: ""
    }
}