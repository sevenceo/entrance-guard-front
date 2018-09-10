import {Create,Search,bathDelete,bathDisable,bathEnable,Update,getGroup} from './api/flightManageApi'
import {getOrginations} from "../attendance/api/attendanceApi";
export default {
    created(){
        // //获取当前用户所管理的组织
        // getOrginations().then(resp=>{
        //     if(resp!=null){
        //         this.organizations=resp.data;
        //     }
        // })
        this.getFirstLvl();
    },
    data() {
        return {
            title:'',
            searchOrganizationName:'',
            attenDanceGroups:[],
            organizationId:[],
            firstLvl:[],
            organizationName:'',
            organizations:[],
            searchFormVisible:false,
            Param:'',
            ruletype:[
                {value:'1',label:'上下班打卡'},
                {value:'0',label:'上班打卡'}
            ],
            dialogStatus:'create',
            temp:tempInit(),
            page:pageInit(),
            Param:parmInit(),
            rules:{
                scheduleName:[
                        {required: true, message: '请输入班次名称', trigger: 'blur'},
                        {max: 50, message: '班次名称不得超过50个字符'}
                    ],
                scheduleCode:[
                    {required: true, message: '请输入班次编码', trigger: 'blur'},
                    {max: 50, message: '班次编码不得超过50个字符'}
                ],
                workingStartTime:[
                    {required: true, message: '班次开始时间不得为空'}
                ],
                workingEndTime:[
                    {required: true, message: '班次结束时间不得为空'}
                ],
                effectiveDate:[
                    {required: true, message: '开始时间不得为空'}
                ],
                workList:[
                    {required: true, message: '工作日不得为空'}
                ],
                checkTime:[
                    {required: true, message: '最早上班打卡时间不得为空'}
                ],
                flag1:[
                    {required: true}
                ],
                flag2:[
                    {required: true}
                ],
            },
            addFlight:false,
            tableData:'',
            rowTotal:0,
            tableData:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            props: {
                label:"name",
                value: 'id',
                children: 'cities'
            }
        }
    },
    methods: {
        getGoupByOrgan(id){
            getGroup(id).then(resp=>{
                this.attenDanceGroups=resp.data;
            })
        },
        getOrganId(id){
            var data = this.firstLvl;
            for(var i=0;i<data.length;i++){
                if(data[i].id=id){
                    return i;
                }
            }
        },
        handleItemChange(id){
            getGroup(id[0]).then(resp=>{
                var i = this.getOrganId(id);
                this.firstLvl[i].cities=resp.data;
                var data = this.firstLvl;
                // this.attenDanceGroups=resp.data;
            })
        },
        //获取当前用户管理资源的顶级
        getFirstLvl(){
            getOrginations().then(resp=>{
                if(resp!=null){
                    var data = resp.data;
                    if(data!=null){
                        for(var i = 0;i<data.length;i++){
                            this.firstLvl[i]={
                                value:data[i].id,
                                label:data[i].label
                            }
                        }
                        if(this.firstLvl.length>0){
                            this.search();
                        }
                    }
                }
            })
        },
        formatterStart(row){
            var timestamp = row.startTime;
            var d = new Date(timestamp); //根据时间戳生成的时间对象
            var date = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate());
            return date;
        },
        formatterEnd(row){
            var timestamp = row.endTime;
            var d = new Date(timestamp); //根据时间戳生成的时间对象
            var date = (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate());
            return date;
        },
        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit()
            this.attenDanceGroups=[];
        },
        reset(){
            this.organizationId='';
            this.searchOrganizationName='';
            // this.attenDanceGroups=[];
            this.Param=parmInit();
        },
        changeType(){
          if(this.temp.isDefault==0){
              $('#organization').show();
          }
        },
        //选中组织
        handleNodeClick(data,node){
            this.attenDanceGroups=[];
            getGroup(data.id).then(resp=>{
                this.attenDanceGroups=resp.data;
            })
            this.organizationName=data.label;
            this.temp.attendenceId='';
            $('#organization').hide();
        },
        closeOrganization(){
            $('#organization').hide();
        },
        handleNodeClickSearch(data,node){
            getGroup(data.id).then(resp=>{
                this.attenDanceGroups=resp.data;
            })
            this.searchOrganizationName=data.label;
            this.Param.resourceId=data.id;
            $('#organization').hide();
        },

        showOrganization(){
            $('#organization').show();
        },
        closeOrganization(){
            $('#organization').hide();
        },
        //打开添加页面
        onAdd(){
            this.title='新增';
            this.temp=tempInit();
            this.organizationName='';
            this.organizationId='';
            // this.attenDanceGroups=[];
            // this.$refs['form'].resetFields();
            this.dialogStatus='create';
            this.addFlight=true;
        },
        //查询
        search(){
            var ids = this.firstLvl.map(item => item.value);
            let data={
                resourceIds:ids,
                scheduleName:this.Param.scheduleName,
                scheduleCode:this.Param.scheduleCode,
                checkRuleType:this.Param.checkRuleType,
                effectiveDate:this.Param.effectiveDate,
                attendenceId:this.Param.attendenceId,
                resourceId:this.Param.resourceId
            };
            Search(this.page,data).then(resp=>{
                this.tableData=resp.data.rows;
                this.rowTotal=resp.data.rowTotal;
            })
        },
        //判断
        check(){
          if(this.attenDanceGroups.length<=0){
              methis.$message({
                  message: "请先选择组织",
                  type: 'error'
              })
          }
        },
        //添加
        create(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var data=this.temp;
                    if(data.isDefault==1){
                        data.attendenceId='';
                    }else if(data.isDefault==0){
                        if(data.attendenceId==null||data.attendenceId==undefined||data.attendenceId==''){
                            this.$message({
                                message: "非默认时考勤组必填",
                                type: 'error'
                            })
                            return;
                        }
                    }
                    if(data.isDefault=='1'){
                        data.attendenceId = null;
                    }
                    Create(data).then(resp=>{
                        if(resp.code==1){
                            this.search();
                            this.addFlight=false;
                        }
                    })
                }
            })
        },
        update(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var dates=[];
                    var data=this.temp;
                    for(var i=0;i<data.effectiveDate.length;i++){
                        var date=data.effectiveDate[i];
                        if(!isNaN(date)){
                            dates[i]=date
                        }else{
                            if(date.indexOf('-')>0){
                                date = date.replace(/-/g,'/');
                            }
                            dates[i]=new Date(date).getTime();
                        }
                    }
                    data.effectiveDate=dates;
                    if(data.isDefault=='1'){
                        data.attendenceId = null;
                    }
                    Update(data).then(resp=>{
                        if(resp.code==1){
                            this.search();
                            this.addFlight=false;
                        }
                    })
                }
            })
        },
        handleCancel() {
            this.addFlight = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        //编辑
        onEdit(row){
            this.title='编辑';
            if(row.isDefault=='1'){
                row.isDefault='1';
            }else if(row.isDefault=='0'){
                row.isDefault='0';
            }
            if(row.checkRuleType=='1'){
                row.checkRuleType='1';
            }else if(row.checkRuleType=='0'){
                row.checkRuleType='0';
            }
            if(row.higherThanHoliday=='1'){
                row.higherThanHoliday='1';
            }else if(row.higherThanHoliday=='0'){
                row.higherThanHoliday='0';
            }
            row.workList=[];
            if(row.monday==1){
                row.workList.push('周一');
            }
            if(row.tuesday==1){
                row.workList.push('周二');
            }
            if(row.wednesday==1){
                row.workList.push('周三');
            }
            if(row.thursday==1){
                row.workList.push('周四');
            }
            if(row.friday==1){
                row.workList.push('周五');
            }
            if(row.saturday==1){
                row.workList.push('周六');
            }
            if(row.sunday==1){
                row.workList.push('周日');
            }
            this.temp=$.extend(tempInit(), row);
            this.organizationId = ''+row.resourceId;
            this.organizationName=row.organizationName;
            getGroup(row.resourceId).then(resp=>{
                this.attenDanceGroups=resp.data;
                this.temp.attendenceId=row.attendenceId;
                this.temp.effectiveDate=row.effectDateString;
                this.temp.flag1=1;
                this.temp.flag2=1;
                this.dialogStatus='edit';
                this.addFlight=true;
            })
        },
        //删除一行
        onDelete(row){
            var ids=[];
            ids.push(row.id);
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    bathDelete(ids)
                        .then(() => {
                            this.search();
                        })
                })
        },
        //记录选择状态
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        //批量删除
        onBatchDelete() {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认批量删除')
                .then(() => {
                    bathDelete(ids)
                        .then(() => {
                            this.search();
                        })
                })

        },
        //批量禁用
        onBatchStatus(type) {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id);//获取所有选中行的id组成的数组，以逗号分隔
            if (type == '1') {
                this.ConfirmBox('是否确认停用？')
                    .then(() => {
                        bathDisable(ids)
                            .then(() => {
                                this.search();
                            })
                    })
            }
            if (type == '0') {
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        bathEnable(ids)
                            .then(() => {
                                this.search();
                            })
                    })
            }
        },
        //更换状态
        onChange(row){
            var ids=[];
            ids.push(row.id);
            if(row.enabledFlag==1){
                this.ConfirmBox('是否确认停用？')
                    .then(() => {
                        bathDisable(ids)
                            .then(() => {
                                this.search();
                            })
                    })
            }else if(row.enabledFlag==0){
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        bathEnable(ids)
                            .then(() => {
                                this.search();
                            })
                    })
            }
        },
        //页面切换
        handleCurrentChange(page){
            this.pageParam.page = page;
        }
    }
}

function tempInit(){
    return{
        scheduleName:'',
        scheduleCode:'',
        isDefault:'0',
        checkRuleType:'1',
        workList:[],
        workingStartTime:'',
        workingEndTime:'',
        effectiveDate:'',
        endTime:'',
        gapTime:'',
        higherThanHoliday:'0',
        flag1:1,
        flag2:2,
        checkTime:'',
        attendenceId:''
    }
}

function pageInit(){
    return{
        page:1,
        size:10
    }
}

function parmInit(){
    return{
        scheduleName:'',
        scheduleCode:'',
        checkRuleType:'',
        effectiveDate:[],
        attendenceId:'',
        resourceId:''
    }
}
