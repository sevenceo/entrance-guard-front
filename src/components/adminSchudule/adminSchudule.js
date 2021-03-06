import {getOrginations} from "../../views/attendance/api/attendanceApi";
import {Create} from "../../views/Holiday/api/HolidayApi";
import {checkIsPlat,holidaycalendar,updateById} from "./api/adminSchuduleApi";
import {Message} from "element-ui";

export default {
    data(){
        return{
            resourceId:0,
            tableData:[],
            dialogVisible:false,
            currentMonth: 10,
            currentYear: 2018,
            currentWeek: 1,
            firstLvl:[],
            temp:tempInit(),
            rules:{},
            resourceName:"",
            props: {
                id: 'id',
                label: 'label',
            },
            startDay:1,
        }
    },
    created: function() {
        this.initTime();
        this.isPlat();
    },
    methods: {
        isPlat(){
            checkIsPlat().then(resp=>{
                if(resp){
                    this.userType=1;
                }
            })
        },
        update(){
            var data={
                holidayStartDate:this.temp.start,
                holidayEndDate:this.temp.start,
                workOrRest:this.temp.workOrRest,
            }
            updateById(this.temp.id,data).then(resp=>{
                if(resp.code==0){
                    this.dialogVisible=false;
                    this.getGengle();
                }
            })
        },
        create(){
            if(this.temp.end==null||this.temp.end==''||this.temp.end==undefined){
                Message({
                    message: '结束时间不能为空',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                })
                return;
            }
            var data={};
            if(this.userType==1){
                data = {
                    holidayStartDate:this.temp.start,
                    holidayEndDate:this.temp.end,
                    workOrRest:this.temp.workOrRest,
                };
            }else{
                data = {
                    holidayStartDate:this.temp.start,
                    holidayEndDate:this.temp.end,
                    workOrRest:this.temp.workOrRest,
                    resourceIds:[this.resourceId]
                };
            }
            Create(data).then(resp=>{
                if(resp){
                    this.getGengle();
                    this.dialogVisible=false;
                }
            })
        },
        handleClose(){
          this.temp= tempInit();
          this.dialogVisible=false;
        },
        //初始化时间
        initTime(){
            var myDate = new Date();
            this.currentYear = myDate.getFullYear();
            this.currentMonth = myDate.getMonth()+1;
            this.getGengle();
        },
        //查询日历
        getGengle() {
            var date = this.currentYear + '-' + this.currentMonth
            let that = this;
            var data = {
                "resourceId": 0,
                "checkDate": date
            };

            holidaycalendar(data).then(resp=>{
                that.tableData =resp.data;
            })
        },
        //年增加
        addYear(){
            this.currentYear=this.currentYear+1;
            this.getGengle();
        },
        //月增加
        addMonth(){
            if(this.currentMonth==12){
                this.currentMonth=1;
                this.currentYear=this.currentYear+1;
            }else{
                this.currentMonth=this.currentMonth+1;
            }
            this.getGengle();
        },
        //年减少
        subYear(){
            this.currentYear=this.currentYear-1;
            this.getGengle();
        },
        //月减少
        subMonth(){
            if(this.currentMonth==1){
                this.currentMonth=12;
                this.currentYear=this.currentYear-1;
            }else{
                this.currentMonth=this.currentMonth-1;
            }
            this.getGengle();
        },
        //编辑时间
        editDate(row, column, cell, event){
            //初始化
            this.type = 'create';
            var data ={};
            this.temp = tempInit();
            var index = cell.cellIndex;
            switch(index){
                case 0:
                    data=row.monday;
                    break;
                case 1:
                    data=row.tuesday;
                    break;
                case 2:
                    data=row.wednesday;
                    break;
                case 3:
                    data=row.thursday;
                    break;
                case 4:
                    data=row.friday;
                    break;
                case 5:
                    data=row.saturday;
                    break;
                case 6:
                    data=row.sunday;
                    break;
            }
            if(data==null){
                this.dialogVisible=false;
            }else{
                this.temp.start=this.currentYear+'-'+this.currentMonth+'-'+data.date;
                this.temp.id = data.id;
                this.temp.workOrRest = data.state;
                this.dialogVisible=true;
            }
        }
    },
}

function tempInit(){
    return{
        id:"",
        workOrRest:1,
        startAndEnd:[],
        start:"",
        end:"",
        type:"",
    }
}