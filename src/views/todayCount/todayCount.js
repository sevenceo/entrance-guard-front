import {
    GetAllScene,
    GetCountBySceneIds,
    GetCountAndTimeBySceneIds
} from "./api/todayCountApi.js";
import echarts from 'echarts'

export default {
    created() {
        console.log(this.resourceId);
        this.getAllScene();
        this.getCountBySceneIds();
        this.getCountAndTimeBySceneIdsInit();
    },
    components: {
        echarts
    },
    data() {
        return {
            isExpand:false,
            scenes: [],
            checkedItems: [],
            checkAll: true,
            isIndeterminate: false,
            countBySceneIds: {},
            checked: true,
            resourceId:this.$route.params.id,
        }
    },
    methods: {
        getAllScene() {
            if(this.resourceId == undefined){
                this.resourceId = 0;
            }
            GetAllScene(this.resourceId).then((response) => {
                this.scenes = response.data;
                if (this.checkedItems.length == 0) {
                    for (let i = 0; i < this.scenes.length; i++) {
                        this.checkedItems.push(this.scenes[i].id);
                    }
                }
                let param = {
                    sceneIds: this.checkedItems
                }
                GetCountBySceneIds(param).then((resp) => {
                    this.countBySceneIds = resp.data;
                })
            })
        },
        checkCheck() {
            if (this.checkedItems.length == this.scenes.length) {
                this.checkAll = true;
                this.checked = true;
                this.isIndeterminate = false;
            } else if (this.checkedItems.length > 0) {
                this.isIndeterminate = true;
            } else {
                this.checked = false
                this.isIndeterminate = false;
            }
            this.getCountBySceneIds();
            this.getCountAndTimeBySceneIds();
            console.log(this.checkedItems);
        },
        getCountBySceneIds() {
            // if(this.checkedItems.length == 0){
            //     for(let i=0;i<this.scenes.length;i++){
            //         this.checkedItems.push(this.scenes[i].id);
            //     }
            // }
            let param = {
                sceneIds: this.checkedItems
            }
            GetCountBySceneIds(param).then((response) => {
                this.countBySceneIds = response.data;
            })
        },
        checkCheckAll() {
            if (!this.checked) {
                this.checkedItems = [];
            } else {
                this.checked = true;
                this.isIndeterminate = false;
                this.checkedItems = [];
                for (let i = 0; i < this.scenes.length; i++) {
                    this.checkedItems.push(this.scenes[i].id);
                }
            }
            this.getCountBySceneIds();
            this.getCountAndTimeBySceneIds();
        },
        getCountAndTimeBySceneIds() {
            if(this.resourceId == undefined){
                this.resourceId = 0;
            }
            GetAllScene(this.resourceId).then((response) => {
                this.scenes = response.data;
                // if (this.checkedItems.length == 0) {
                //     for (let i = 0; i < this.scenes.length; i++) {
                //         this.checkedItems.push(this.scenes[i].id);
                //     }
                // }
                let param = {
                    sceneIds: this.checkedItems
                }
                GetCountAndTimeBySceneIds(param).then((response) => {
                    let dailyOpenMap = response.data.dailyCountMap;
                    let dailyCompareMap = response.data.dailyCompareCountMap;
                    let clrIn = setInterval(() => {
                        let newsEchart = document.getElementById('newsEchart1');
                        if (newsEchart != undefined && newsEchart != null) {
                            clearInterval(clrIn);
                        } else {
                            return;
                        }
                        let newsEchartInfo = echarts.init(newsEchart);
                        let option = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                },
                                formatter: function (params) {
                                    // console.log(params);
                                    let res = "<div>";
                                    res += "<span>"+ params[0]['marker'] + params[0]['name'] + "</span><br/>";
                                    res += "<span>" + params[0]['marker'] + params[0]['seriesName'] + ":" + params[0]['value'] + "</span><br/>";
                                    res += "<span>" + params[1]['marker'] + params[1]['seriesName'] + ":" + params[1]['value'] + "</span><br/>";
                                    res += "</div>";
                                    return res;
                                },
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            legend: {
                                data: ['今日开门数量','今日识别数量' ]
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: ['0点','1点','2点','3点','4点','5点','6点','7点','8点','9点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点'],
                                    // axisPointer: {
                                    //     type: 'shadow'
                                    // }
                                    splitLine: {show: false},//去除网格线
                                    splitArea: {show: true}//保留网格区域
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    //interval: 50,
                                    axisLabel: {
                                        formatter: '{value}'
                                    },
                                    splitLine: {show: false},//去除网格线
                                    splitArea: {show: true}//保留网格区域
                                },
                            ],
                            series: [
                                {
                                    name: '今日开门数量',
                                    type: 'line',
                                    // itemStyle : {
                                    //     normal : {
                                    //         lineStyle:{
                                    //             color:'#00FF00'
                                    //         }
                                    //     }
                                    // },
                                    data: [dailyOpenMap['00'],dailyOpenMap['01'],dailyOpenMap['02'],dailyOpenMap['03'],dailyOpenMap['04'],dailyOpenMap['05'],dailyOpenMap['06'],dailyOpenMap['07'],dailyOpenMap['08'],dailyOpenMap['09'],dailyOpenMap['10'],dailyOpenMap['11'],dailyOpenMap['12'],dailyOpenMap['13'],dailyOpenMap['14'],dailyOpenMap['15'],dailyOpenMap['16'],dailyOpenMap['17'],dailyOpenMap['18'],dailyOpenMap['19'],dailyOpenMap['20'],dailyOpenMap['21'],dailyOpenMap['22'],dailyOpenMap['23']]
                                },
                                {
                                    name: '今日识别数量',
                                    type: 'line',
                                    // itemStyle : {
                                    //     normal : {
                                    //         lineStyle:{
                                    //             color:'#66ccff'
                                    //         }
                                    //     }
                                    // },
                                    data: [dailyCompareMap['00'],dailyCompareMap['01'],dailyCompareMap['02'],dailyCompareMap['03'],dailyCompareMap['04'],dailyCompareMap['05'],dailyCompareMap['06'],dailyCompareMap['07'],dailyCompareMap['08'],dailyCompareMap['09'],dailyCompareMap['10'],dailyCompareMap['11'],dailyCompareMap['12'],dailyCompareMap['13'],dailyCompareMap['14'],dailyCompareMap['15'],dailyCompareMap['16'],dailyCompareMap['17'],dailyCompareMap['18'],dailyCompareMap['19'],dailyCompareMap['20'],dailyCompareMap['21'],dailyCompareMap['22'],dailyCompareMap['23']]
                                }
                            ]
                        };

                        newsEchartInfo.setOption(option);
                        window.addEventListener("resize", function () {
                            newsEchartInfo.resize();
                        });
                    }, 100);
                })
            })


        },
        getCountAndTimeBySceneIdsInit() {
            if(this.resourceId == undefined){
                this.resourceId = 0;
            }
            GetAllScene(this.resourceId).then((response) => {
                this.scenes = response.data;
                if (this.checkedItems.length == 0) {
                    for (let i = 0; i < this.scenes.length; i++) {
                        this.checkedItems.push(this.scenes[i].id);
                    }
                }
                let param = {
                    sceneIds: this.checkedItems
                }
                GetCountAndTimeBySceneIds(param).then((response) => {
                    let dailyOpenMap = response.data.dailyCountMap;
                    let dailyCompareMap = response.data.dailyCompareCountMap;
                    let clrIn = setInterval(() => {
                        let newsEchart = document.getElementById('newsEchart1');
                        if (newsEchart != undefined && newsEchart != null) {
                            clearInterval(clrIn);
                        } else {
                            return;
                        }
                        let newsEchartInfo = echarts.init(newsEchart);
                        let option = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                },
                                formatter: function (params) {
                                    // console.log(params);
                                    let res = "<div>";
                                    res += "<span>"+ params[0]['marker'] + params[0]['name'] + "</span><br/>";
                                    res += "<span>" + params[0]['marker'] + params[0]['seriesName'] + ":" + params[0]['value'] + "</span><br/>";
                                    res += "<span>" + params[1]['marker'] + params[1]['seriesName'] + ":" + params[1]['value'] + "</span><br/>";
                                    res += "</div>";
                                    return res;
                                },
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            legend: {
                                data: ['今日开门数量','今日识别数量' ]
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: ['0点','1点','2点','3点','4点','5点','6点','7点','8点','9点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点'],
                                    // axisPointer: {
                                    //     type: 'shadow'
                                    // }
                                    splitLine: {show: false},//去除网格线
                                    splitArea: {show: true}//保留网格区域
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    //interval: 50,
                                    axisLabel: {
                                        formatter: '{value}'
                                    },
                                    splitLine: {show: false},//去除网格线
                                    splitArea: {show: true}//保留网格区域
                                },
                            ],
                            series: [
                                {
                                    name: '今日开门数量',
                                    type: 'line',
                                    data: [dailyOpenMap['00'],dailyOpenMap['01'],dailyOpenMap['02'],dailyOpenMap['03'],dailyOpenMap['04'],dailyOpenMap['05'],dailyOpenMap['06'],dailyOpenMap['07'],dailyOpenMap['08'],dailyOpenMap['09'],dailyOpenMap['10'],dailyOpenMap['11'],dailyOpenMap['12'],dailyOpenMap['13'],dailyOpenMap['14'],dailyOpenMap['15'],dailyOpenMap['16'],dailyOpenMap['17'],dailyOpenMap['18'],dailyOpenMap['19'],dailyOpenMap['20'],dailyOpenMap['21'],dailyOpenMap['22'],dailyOpenMap['23']]
                                },
                                {
                                    name: '今日识别数量',
                                    type: 'line',
                                    data: [dailyCompareMap['00'],dailyCompareMap['01'],dailyCompareMap['02'],dailyCompareMap['03'],dailyCompareMap['04'],dailyCompareMap['05'],dailyCompareMap['06'],dailyCompareMap['07'],dailyCompareMap['08'],dailyCompareMap['09'],dailyCompareMap['10'],dailyCompareMap['11'],dailyCompareMap['12'],dailyCompareMap['13'],dailyCompareMap['14'],dailyCompareMap['15'],dailyCompareMap['16'],dailyCompareMap['17'],dailyCompareMap['18'],dailyCompareMap['19'],dailyCompareMap['20'],dailyCompareMap['21'],dailyCompareMap['22'],dailyCompareMap['23']]
                                }
                            ]
                        };

                        newsEchartInfo.setOption(option);
                        window.addEventListener("resize", function () {
                            newsEchartInfo.resize();
                        });
                    }, 100);
                })
            })


        }
    }
}