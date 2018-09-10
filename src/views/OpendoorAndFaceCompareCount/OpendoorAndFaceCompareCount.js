import {
    GetList,ExportExcel,GetList1
} from "./api/OpendoorAndFaceCompareCountApi.js";
import echarts from 'echarts'
import {Message} from 'element-ui'

export default {
    created() {
        this.getFormatDate(0.5,0);
        this.getList(this.pageParam);
    },
    components: {
        echarts
    },
    data() {
        return {
            pageParam :pageParamInit(),
            allReportData: [],
            rowTotal:10,
        }
    },
    methods: {
        getFormatDate(hour,day) {
            var today=new Date();
            var thatTime_milliseconds=today.getTime()- hour*(1000*60*60)- day*(1000*60*60*24);

            var thatTime=new Date();
            thatTime.setTime(thatTime_milliseconds);

            var strYear=thatTime.getFullYear();
            var strDay=thatTime.getDate();
            var strMonth=thatTime.getMonth()+1;
            var strHour = thatTime.getHours();
            var strMin = thatTime.getMinutes();
            var strSecond = thatTime.getSeconds();
            if(strMonth<10)
            {
                strMonth="0"+strMonth;
            }
            if (strDay < 10){
                strDay = '0'+ strDay;
            }
            if (strHour < 10){
                strHour = '0'+ strHour;
            }
            if (strMin < 10){
                strMin = '0'+ strMin;
            }
            if (strSecond < 10){
                strSecond = '0'+ strSecond;
            }
            var strThatTime=strYear+"-"+strMonth+"-"+strDay+' '+strHour+':'+strMin+':'+strSecond;
            this.pageParam.page = 1;
            this.pageParam.beginTime = strThatTime;
        },
        getFormatDateCount(hour,day,e){
            $("span[name='showColor']").removeClass("spanColor");
            console.log($("span[name='showColor']"))
            $(e.currentTarget).addClass("spanColor");
            this.getFormatDate(hour,day);
            this.getList(this.pageParam);
        },
        getList(pageParam){
            GetList(pageParam).then((result)=>{
                this.inintEchart(result);
            })
        },
        getList1(pageParam){
            GetList1(pageParam).then((result)=>{
                this.inintEchart(result);
            })
        },
        inintEchart(result){
            this.allReportData = result.data.rows;
            this.rowTotal = result.data.rowTotal;
            let scenes = [];
            let open = [];
            let compare = [];
            for (var i=0; i<result.data.rows.length; i++){
                scenes.push(result.data.rows[i].sceneName);
                open.push(result.data.rows[i].opendoorCountsInOneSceneLimitTime);
                compare.push(result.data.rows[i].faceCompareCountsInOneSceneLimitTime);
            }

            let newsEchart = document.getElementById('newsEchart1');
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
                    data: ['识别数','开门数' ]
                },
                xAxis: [
                    {
                        type: 'category',
                        data: scenes,
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
                        name: '识别数',
                        type: 'line',
                        data: compare
                    },
                    {
                        name: '开门数',
                        type: 'line',
                        data: open
                    }
                ]
            };

            newsEchartInfo.setOption(option);
            window.addEventListener("resize", function () {
                newsEchartInfo.resize();
            });
        },
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        exportExcel(){
            let type = '';
            let order = '';
            if (this.pageParam.opendoorNumOrder != '' && this.pageParam.opendoorNumOrder != undefined){type =1,order = this.pageParam.opendoorNumOrder}
            if (this.pageParam.faceCompareNumOrder != '' && this.pageParam.faceCompareNumOrder != undefined){type =2,order = this.pageParam.faceCompareNumOrder}
            if (this.pageParam.opendoorTotalOrder != '' && this.pageParam.opendoorTotalOrder != undefined){type =3,order = this.pageParam.opendoorTotalOrder}
            if (this.pageParam.faceCompareTotalOrder != '' && this.pageParam.faceCompareTotalOrder != undefined){type =4,order = this.pageParam.faceCompareTotalOrder}
            ExportExcel(this.pageParam.beginTime,type,order)
        },
        changesort(obj){
            //console.log(obj);
           let prop = obj.prop;
           let order = obj.order;
            this.pageParam.opendoorNumOrder = '';
            this.pageParam.faceCompareNumOrder = '';
            this.pageParam.opendoorTotalOrder = '';
            this.pageParam.faceCompareTotalOrder = '';
            if (prop == 'opendoorCountsInOneSceneLimitTime'){this.pageParam.opendoorNumOrder = order}
           if (prop == 'faceCompareCountsInOneSceneLimitTime'){this.pageParam.faceCompareNumOrder = order}
           if (prop == 'opendoorCountsInOneScene'){this.pageParam.opendoorTotalOrder = order}
           if (prop == 'faceCompareCountsInOneScene'){this.pageParam.faceCompareTotalOrder = order}
           if (prop == 'opendoorCountsInOneSceneLimitTime' || prop == 'faceCompareCountsInOneSceneLimitTime'){
               this.getList(this.pageParam)
           }
           if (prop == 'opendoorCountsInOneScene' || prop == 'faceCompareCountsInOneScene'){
               this.getList1(this.pageParam);
           }
        }
    }
}

function tempInit() {
    return {

    }
}

function pageParamInit() {
    return {
        page: 1,
        pageSize: 10,
        rowTotal: 0,
        beginTime:'',
        opendoorNumOrder:'descending',
        faceCompareNumOrder:'',
        opendoorTotalOrder:'',
        faceCompareTotalOrder:''
    }
}