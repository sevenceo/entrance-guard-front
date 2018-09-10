import {getOrginations} from '../api/attendanceApi'
import {SearchHuman,SearchAttenDanceHuman,AddHuman,GetHuman,SearchManagerHuman} from './api/addAttenDanceHumanApi'

export default {
    created(){
        //获取当前用户所管理的组织
        getOrginations().then(resp=>{
            if(resp!=null){
                this.organizations=resp.data;
            }
        })
    },
    data() {
        return {
            resourceId:'',
            groupId:'',
            type:'addHuman',
            rowTotal:0,
            organizationName:'',
            dialogVisible:false,
            formInline:formInlineInit(),
            pageParam:pageparmInit(),
            organizations:[
                {id:'1111',label:'组织1'},
                {id:'222',label:'组织2'}
            ],
            tableData:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    methods: {
        clearOrgId(){
            this.formInline.organization='';
            this.organizationName='';
        },
        showOrganization(){
            $('#organization').show();
        },
        closeOrganization(){
            $('#organization').hide();
        },
        //选中组织
        handleNodeClick(data,node){
            this.formInline.organization=data.id;
            this.organizationName=data.label;
            $('#organization').hide();
        },
        //记录选择状态
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        setManager(){
            if(this.selectionData.length>1){
                this.$message({
                    message: "请选择一行数据",
                    type: 'error'
                })
                return;
            }
            this.$emit("Manager",this.selectionData);
            this.dialogVisible=false;
        },
        addHuman(){
            var humanIds = this.selectionData.map(item => item.id);
            var data={
                ids:humanIds,
                id:this.groupId
            }
            AddHuman(data).then(resp=>{
                if(resp.code==0){
                    GetHuman(this.groupId).then(resp=>{
                        this.$emit("selection",resp);
                        this.dialogVisible=false;
                    })
                }
            })
        },
        searchManager(){
            let data={
                page:this.pageParam.page,
                pageSize:this.pageParam.size,
                realName:this.formInline.name,
                resourceId:this.resourceId
            }
            SearchManagerHuman(data).then(resp=>{
                this.tableData=resp.data.rows;
                this.rowTotal=resp.data.rowTotal;
                for(var i=0;i<this.tableData.length;i++){
                    if(this.tableData[i]==null){
                        this.tableData.splice(i,1);
                    }
                }
            })
        },
        search(){
            let data={
                page:this.pageParam.page,
                pageSize:this.pageParam.size,
                realName:this.formInline.name,
                resourceId:this.resourceId
            }
            SearchAttenDanceHuman(data).then(resp=>{
                this.tableData=resp.data.rows;
                this.rowTotal=resp.data.rowTotal;
                for(var i=0;i<this.tableData.length;i++){
                    if(this.tableData[i]==null){
                        this.tableData.splice(i,1);
                    }
                }
            })
            // SearchHuman(data).then(resp=>{
            //     this.tableData=resp.data.rows;
            //     this.rowTotal=resp.data.rowTotal;
            //     for(var i=0;i<this.tableData.length;i++){
            //         if(this.tableData[i]==null){
            //             this.tableData.splice(i,1);
            //         }
            //     }
            // })
        },
        handleCurrentChange(page){
            this.pageParam.page = page;
            if(this.type=='addHuman'){
                this.search();
            }else{
                this.searchManager();
            }
        }
    }
}

function pageparmInit(){
    return {
        page: 1,
        size: 10,
        rowTotal: 0
    }
}

function formInlineInit(){
    return {
        organization: '',
        name: '',
    }
}