import moment from 'moment'
import echarts from 'echarts'

import store from 'store'

import {GetEchartsData} from "src/views/qr-code/api/qrCodeApi";


//组件级变量
let selectionData = []

export default {
    created() {
        this.$store.commit('SET_ACTIVIINDEX', this.activeIndex)
        this.getEchartsData()
        console.log(this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[0].scene)
    },
    data() {
        return {
            date: '',
            activeIndex: '06',
            account: this.$store.state.weChatAccount.accountInfo.account,
            activityId: this.$router.currentRoute.params.id,
            messageDataList: [],
            page: {
                page: 0,
                size: 10,
                activityId: '',
                activitySceneId: ''
            },
            tempData: '',
            statisticsData: {},
            nameList: [],
            seriesData: [],
            statisticsTableData: []
        }
    },
    mounted() {
        this.getEchartsData()
    },
    methods: {
        onAdd() {
            this.dealerFormVisible = true
        },
        getEchartsData() {
            console.log(this.sceneId)
            GetEchartsData(this.account, this.activityId, this.sceneId)
                .then(response => {
                    this.nameList = []
                    this.seriesData = []
                    this.statisticsData = response.data.jsonDataDetail.activityReportDTO
                    console.log(this.statisticsData)
                    this.handleData(this.statisticsData)
                })
        },
        showAll() {
            GetEchartsData(this.account, this.activityId)
                .then(response => {
                    this.nameList = []
                    this.seriesData = []
                    this.statisticsTableData = []
                    this.statisticsData = response.data.jsonDataDetail.activityReportDTO
                    this.handleData(this.statisticsData)
                })
        },
        getDate(source) {
            const time = new Date(source);

            return time.getFullYear() + "-"
                + (time.getMonth() + 1) + "-"
                + time.getDate()
        },
        handleData(data) {
            for (let i in data.axisNameList) {
                data.axisNameList[i] = this.getDate(data.axisNameList[i])
            }
            let tempTable = []
            for (let i in data.indicators) {
                this.nameList[i] = data.indicators[i].name
                this.seriesData[i] = {
                    name: data.indicators[i].name,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: data.indicators[i].color
                        }
                    },
                    data: data.indicators[i].chartValue
                }

                tempTable[i] = {
                    name: data.indicators[i].name,
                    color: data.indicators[i].color,
                    total: data.indicators[i].totalValue
                }
            }
            this.statisticsTableData = tempTable

            this.setEchart()

        },
        setEchart() {
            let fansAdd = echarts.init(document.getElementById('fansAdd'));

            let fansAddOption = {
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
                    top: 25,
                    right: 22
                },
                legend: {
                    data: this.nameList
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: this.statisticsData.axisNameList,
                        axisLabel:{
                            showMinLabel: true
                        }
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
                // dataZoom: [
                //     {
                //         show: true,
                //         realtime: true,
                //         start: 0,
                //         end: 100
                //     },
                //     {
                //         type: 'inside',
                //         realtime: true,
                //         start: 0,
                //         end: 100
                //     }
                // ],
                series: this.seriesData
            };

            // 使用指定的配置项和数据显示图表。
            fansAdd.setOption(fansAddOption);
            window.addEventListener("resize", function () {
                fansAdd.resize();
            });
        },
    },
    computed: {
        tabIndex() {
            return this.$store.state.weChatActivityData.tabIndex
        },
        sceneId() {
            return this.$store.state.weChatActivityData.activityData.jsonDataDetail.qrDTOS[this.tabIndex].activitySceneId
        }
        // statisticsData(){
        //     return this.$store.state.weChatActivityData.activityData.jsonDataDetail.activityReportDTO
        // }

    },
    watch: {
        tabIndex: function () {
            console.log('执行change')
            this.getEchartsData()
        }
    }
}


function tempMaterialInit() {
    return {
        pushType: "",
        materialId: "",
        materialName: "",
        materialUrl: "",
        serverUrl: "",
        picUrl: "",
        url: "",
        mediaId: "",
        picurl: ""
    }
}

