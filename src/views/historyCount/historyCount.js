import {
    GetAllScene,
    GetCountBySceneIds,
    GetHistoryCountAndTimeBySceneIds,
    ExportNewsTableData
} from "./api/historyCountApi.js";
import echarts from 'echarts'
import {Message} from 'element-ui'
export default {
    created() {
        this.getNewsTime();
        this.getAllScene();
        this.getCountBySceneIds();
        this.getCountAndTimeBySceneIdsInit();
    },
    components: {
        echarts
    },
    data() {
        return {
            scenes: [],
            checkedItems: [],
            checkAll: true,
            isIndeterminate: false,
            countBySceneIds: {},
            checked: true,
            newsTime: "",
            pickerOptions2: {
                shortcuts: [{
                    text: '最近7天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近30天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            allReportData:[],
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
        getNewsTime() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            this.newsTime = [this.getTime(start), this.getTime(end)];

            //let timesInfo = this.addTimeSecond(this.newsTime);
            return this.newsTime;
        },
        getTime(time) {
            let year = time.getFullYear(); //得到年份
            let month = time.getMonth();//得到月份
            let date = time.getDate();//得到日期
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            let str = "";
            return str = year + "-" + month + "-" + date;
        },
        getDays(strDateStart, strDateEnd) {
            let oDate1;
            let oDate2;
            let iDays;
            oDate1 = strDateStart.split("-");
            oDate2 = strDateEnd.split("-");
            let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
            let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
            iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
            return iDays;
        },
        dateFormat(date) {
            date = new Date(date);
            let month = '';
            let monthE = date.getMonth() + 1;
            let day = '';
            let dayE = date.getDate();
            if(monthE <10){
                month = "0"+monthE;
            }else{
                month = monthE+'';
            }
            if(dayE <10){
                day = '0'+dayE;
            }else{
                day = dayE+'';
            }
            return date.getFullYear() + '-' + month + '-' + day;
        },
        getCountAndTimeBySceneIds() {
            // let dateRange = this.newsTime;
            if (this.newsTime != null && this.newsTime != "" && this.newsTime.length > 0) {

                let day = this.getDays(this.dateFormat(this.newsTime[0]), this.dateFormat(this.newsTime[1]));
                if (day > 30) {
                    Message({
                        message: '时间范围不能大于30天！',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    });

                    return;
                }
            } else {
                this.getNewsTime();
            }
            let searchData = this.dateFormat(this.newsTime[0]) + "至" + this.dateFormat(this.newsTime[1]);
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
                    sceneIds: this.checkedItems,
                    searchDate:searchData
                }
                GetHistoryCountAndTimeBySceneIds(param).then((response) => {
                    this.allReportData = response.data.countExportDTOList;
                    console.log(this.allReportData);
                    let historyCompareCountMap = response.data.historyCompareCountMap;
                    let historyOpenCountMap = response.data.historyOpenCountMap;
                    let dates = response.data.dates;
                    let compare =[];
                    let open =[];
                    let historyDate =[];
                    for(let i=0;i<dates.length;i++){
                        compare.push(historyCompareCountMap[dates[i]]);
                        open.push(historyOpenCountMap[dates[i]]);
                        historyDate.push(dates[i]);
                    }

                    console.log(historyDate);
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
                                data: ['历史开门数量','历史识别数量' ]
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: historyDate,
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
                                    name: '历史开门数量',
                                    type: 'line',
                                    data: open
                                },
                                {
                                    name: '历史识别数量',
                                    type: 'line',
                                    data: compare
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
            // let dateRange = this.newsTime;
            if (this.newsTime != null && this.newsTime != "" && this.newsTime.length > 0) {

                let day = this.getDays(this.dateFormat(this.newsTime[0]), this.dateFormat(this.newsTime[1]));
                if (day > 30) {
                    Message({
                        message: '时间范围不能大于30天！',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    });

                    return;
                }
            } else {
                this.getNewsTime();
            }
            let searchData = this.dateFormat(this.newsTime[0]) + "至" + this.dateFormat(this.newsTime[1]);
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
                    sceneIds: this.checkedItems,
                    searchDate:searchData
                }
                GetHistoryCountAndTimeBySceneIds(param).then((response) => {
                    this.allReportData = response.data.countExportDTOList;
                    console.log(this.allReportData);
                    let historyCompareCountMap = response.data.historyCompareCountMap;
                    let historyOpenCountMap = response.data.historyOpenCountMap;
                    let dates = response.data.dates;
                    let compare =[];
                    let open =[];
                    let historyDate =[];
                    for(let i=0;i<dates.length;i++){
                        compare.push(historyCompareCountMap[dates[i]]);
                        open.push(historyOpenCountMap[dates[i]]);
                        historyDate.push(dates[i]);
                    }

                    console.log(historyDate);
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
                                data: ['历史开门数量','历史识别数量' ]
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: historyDate,
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
                                    name: '历史开门数量',
                                    type: 'line',
                                    data: open
                                },
                                {
                                    name: '历史识别数量',
                                    type: 'line',
                                    data: compare
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
        exportNewsTableData() {
            if (this.newsTime != null && this.newsTime != "" && this.newsTime.length > 0) {

                let day = this.getDays(this.dateFormat(this.newsTime[0]), this.dateFormat(this.newsTime[1]));
                if (day > 30) {
                    Message({
                        message: '时间范围不能大于30天！',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    });

                    return;
                }
            } else {
                this.getNewsTime();
            }
            // let param = this.allReportData;
            let sceneIds = '';
            if(this.checkedItems.length>0){
                sceneIds = this.checkedItems.join(",");
            }
            let searchData = this.dateFormat(this.newsTime[0]) + "至" + this.dateFormat(this.newsTime[1]);

            ExportNewsTableData(sceneIds,searchData);
        },

    }
}