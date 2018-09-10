import {getOrginations,Create,Search,Update,getById,BatchEnabled,BatchDisabled,BatchDelete,getHumanByIds,GetHuman,RestHuman} from './api/attendanceApi'
import addAttenDanceGroupHuMan from 'views/attendance/addAttenDanceHuman/addAttenDanceHuman.vue'

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
    components: {addAttenDanceGroupHuMan},
    data() {
        return {
            rowTotalHuman:0,
            title:'新增',
            //查询的结果
            tableData:[],
            //添加页面控制
            dialogVisible: false,
            //查询页面控制
            searchFormVisible:false,
            //总数
            rowTotal:0,
            //考勤组信息
            temp: tempInit(),
            //所属组织
            organizations:[
                {id:1111, label:'组织1'},
                {id:222, label:'组织2'}
            ],
            //选择的组织
            organizationName:'请选择资源',
            //创建或更新
            dialogStatus:'create',
            //分页表单
            pageParam:pageparmInit(),
            //人员分页
            humanPage:humanPageInit(),
            //查询表单
            Param:{
                atnDanceName:'',
                resourceId:''
            },
            //选择的考勤人员
            humanTable:[],
            //规则
            rules:{
                name:
                    [
                        {required: true, message: '请输入考勤组名称', trigger: 'blur'},
                        {max: 50, message: '考勤组名称不得超过50个字符'}
                    ],
                organization:[
                    {required: true, message: '所属资源不得为空'}
                ],
                managerName:[
                    {required: true, message: '考勤组组长不得为空', trigger: 'blur'}
                ]
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            firstLvl:[]
        }
    },
    methods: {
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
                            var ids = this.firstLvl.map(item => item.value)
                            this.pageParam.resourceIds = ids;
                        }
                        this.search(this.pageParam);
                    }
                }
            })
        },
        formatter(row,cloum){
            return row.organizationName;
        },
        //选中组织
        handleNodeClick(data,node){
            this.temp.organization=data.id;
            this.organizationName=data.label;
            $('#organizationTree').hide();
            this.deleteManager();
        },
        handleClose(){
            this.$refs['form'].resetFields();
            this.dialogVisible=false;
        },
        showOrganization(){
            if(this.humanTable.length>0){
                this.$message({
                    message: "存在考勤人员时不能改变组织",
                    type: 'error'
                })
                return;
            }else{
                $('#organizationTree').show();
            }
        },
        closeOrganization(){
            $('#organizationTree').hide();
        },
        //打开添加页面
       onAdd(){
           $('#organization').hide();
           this.temp=tempInit();
           this.organizationName='请选择资源';
           this.title='新增';
           this.humanTable=[];
           this.dialogVisible=true;
           this.dialogStatus='create';
           },
        //编辑
        onEdit(row){
           var id=row.id;
           this.title='编辑';
           this.temp.id=id;
           this.temp.organization=''+row.resourceId+'';
           var data = this.firstLvl;
           this.temp.name=row.name;
           this.temp.managerName=row.managerName;
           this.temp.managerId=row.managerId;
           this.organizationName=row.organizationName;
            //设置分页插件的页数为1
            var page = $('#pagition');
            page.currentpage = 1;
            var data={
                id:id,
                page:1,
                pageSize:10
            }
            //查询考勤人员
            this.getGroupHuman(data);
           this.dialogStatus='edit';
           this.dialogVisible=true;
        },
        //更新考勤组信息
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var ids = this.humanTable.map(item => item.id);
                    var data={
                        id:this.temp.id,
                        name:this.temp.name,
                        resourceId:this.temp.organization,
                        managerId:this.temp.managerId,
                        humanIds:ids
                    }
                    Update(data).then(resp=>{
                        if(resp.code==0){
                            this.search(this.pageParam);
                            this.dialogVisible=false;
                        }
                    })
                }
            });
        },
        //删除一行
        onDelete(row){
            var ids=[];
            ids.push(row.id);
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    BatchDelete(ids)
                        .then(() => {
                            this.search(this.pageParam);
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
                    BatchDelete(ids)
                        .then(() => {
                            this.search(this.pageParam);
                        })
                })

        },
        //人员页面切换
        humanCurrentChange(page){
            var data={
                id:this.temp.id,
                page:page,
                pageSize:10
            }
            this.getGroupHuman(data);
        },
        //页面切换
        handleCurrentChange(page){
            this.pageParam.page = page;
            this.search(this.pageParam);
        },
        //重置
        reset(){
           this.Param={};
        },
        //分页查询
        search(pageParam){
            Search(pageParam,this.Param).then(resp=>{
                this.tableData=resp.data.rows;
                this.rowTotal=resp.data.rowTotal;
            })
        },
        //条件查询
        query(){
            this.search(this.pageParam);
        },
        //添加提交
        onsubmit(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var ids = this.humanTable.map(item => item.id);
                    var data={
                        name:this.temp.name,
                        resourceId:this.temp.organization,
                        managerId:this.temp.managerId,
                        humanIds:ids
                    }
                    Create(data).then(resp=>{
                        if(resp.code==0){
                            this.search(this.pageParam);
                            this.dialogVisible=false;
                        }
                    })
                }
            });
        },
        //设置考勤组组长
        setManager(){
            var data=this.$refs['temp'];
            data.dialogVisible=true;
            data.formInline.organization=this.temp.organization;
            data.resourceId=this.temp.organization;
            data.type = 'setManager';
            data.tableData=[];
            data.searchManager();
        },
        //清除考勤组长
        deleteManager(){
            this.temp.managerId='';
            this.temp.managerName='';
        },
        //获取设置的考勤组长的信息
        setManagerIdAndName(data){
            var temp =data;
            if(data.length>0){
                this.temp.managerId=data[0].id;
                this.temp.managerName=data[0].realName;
            }
        },
        //添加考勤人员
        addHuman(id){
          var data=this.$refs['temp'];
          data.dialogVisible=true;
          data.formInline.organization=this.temp.organization;
          data.resourceId=this.temp.organization;
          data.type = 'addHuman';
          data.groupId = id;
          data.tableData=[];
          data.search();
        },
        //获取选中的考勤人员
        selectHuman(data){
            if(this.humanTable==null){
                this.humanTable=[];
            }
            // var tempData=this.humanTable.concat(data);
            this.humanTable=data.data;
            this.rowTotalHuman=data.msg;
        },

        //获取该考勤组的考勤人员
        getGroupHuman(data){
            //查询考勤人员
            GetHuman(data).then(resp=>{
                if(resp.data!=null &&resp.data.length>0){
                    this.humanTable=resp.data;
                    this.rowTotalHuman = resp.msg;
                }else{
                    this.humanTable=[];
                    this.rowTotalHuman = 0;
                }
            })
        },
        //移除人员
        deleteHuman(row){
            var data={
                id:this.temp.id,
                humanIds:[row.id]
            }
            RestHuman(data).then(resp=>{
                var data={
                    id:this.temp.id,
                    page:this.humanPage.page,
                    pageSize:10
                }
                this.getGroupHuman(data);
            })
           // for(var i=0;i<this.humanTable.length;i++){
           //      if(this.humanTable[i].id==row.id){
           //          this.humanTable.splice(i,1);
           //          return;
           //      }
           // }
        },
        //批量移除
        deleteBathHuman(){
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id);
            this.ConfirmBox('是否确认移除')
                .then(() => {
                    var data={
                        id:this.temp.id,
                        humanIds:ids
                    }
                    RestHuman(data).then(resp=>{
                        var data={
                            id:this.temp.id,
                            page:1,
                            pageSize:10
                        }
                        this.getGroupHuman(data);
                    })
                })
        }
    }
}

function pageparmInit(){
    return {
        page: 1,
        size: 10,
        atnDanceName:'',
        resourceId:'',
        resourceIds:[]
    }
}

function tempInit(){
    return {
        id:'',
        organization: '',
        name: '',
        managerName: '',
        managerId:''
    }
}


function humanPageInit(){
    return {
        page:1,
        size:1,
    }
}
