import rowModule from "./components/rowModule.vue"
import {GetCheckboxModules, GetRole, CreateRole, EditorRole} from "../api/rolesManageApi"

export default {
    data() {
        return {
            roleInfo:roleInfoInit(),
            checked: true,
            checkList: ['选中且禁用','复选框 A'],
            tableList:[],
            rules: {
                name: [
                    {required: true, message: '请输入角色名称'},
                    {max: 50, message: '最多输入50个字'}
                ],
                description: [
                    {max: 200, message: '最多输入200个字'}
                ],

            }
        }
    },
    created(){
        this.getCheckboxModules()
        if(this.$route.params.id){
            let _id = this.$route.params.id
            this.getRole(_id)
        }
    },
    mounted() {


    },

    methods: {
        handleSave(tab, event) {
            let checkboxList = $(".js-checkbox-con :checkbox")
            let authoritiesArr = []
            checkboxList.each((n, v)=>{
                if($(v).prop("checked")){
                    authoritiesArr.push($(v).attr("name"))
                }
            })
            console.log(authoritiesArr)
            // let roleData = {
            //     name:this.roleInfo.name,
            //     description:this.roleInfo.description,
            //     service:authoritiesArr
            // }
            this.roleInfo.service = authoritiesArr;

            this.$refs['roleInfo'].validate((valid) => {
                if (valid) {
                    if(this.$route.params.id){
                        console.log("这是修改按钮")
                        // roleData.id = this.$route.params.id
                        EditorRole(this.roleInfo)
                            .then((response)=>{

                                if (this.roleInfo.name){
                                    this.$router.push({name: '角色管理'});

                                }
                            },()=>{

                                return false

                            })

                    }else{
                        console.log("这是创建按钮")
                        CreateRole(this.roleInfo)
                            .then((response)=>{
                                this.$router.push({name: '角色管理'});
                            },()=>{

                                return false

                            })

                    }
                } else {

                    console.log('error submit!!');
                    return false;
                }
            })





        },
        getCheckboxModules(){
            GetCheckboxModules()
                .then((response)=>{
                    this.tableList = response.data
                })
        },
        getRole(id){
            GetRole(id)
                .then((response)=>{
                    this.roleInfo = response.data
                    // this.roleInfo = {
                    //     name:response.data.name,
                    //     description:response.data.description,
                    //     service : response.data.service
                    // }
                    setTimeout(function () {
                        response.data.service.forEach((v)=>{
                            $(`[name="${v}"]`).prop("checked","checked")
                        })
                    },100)


                })
        }
    },
    components:{
        rowModule,
    }

};

function roleInfoInit() {
    return {
        name: "",
        description: "",
        service:[]
    }
}



