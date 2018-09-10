/**
 * Created by Micheal Xiao on 2017/7/26.
 */

import{ Tree } from 'element-ui-mike'
import{ GetTree , GetNodeChildren , GetNodeAccount } from './api/wcChangeApi'
import { GetOrganization } from "src/api/login"
import loadNode from "utils/tree-loading/treeLoading"

//组件级变量
let selectionData = []

export default {
    created(){
        let oid = this.$store.state.user.user.organizationid;

        // console.log("当前组织机构");
        // console.log(oid);
        if(this.loc != "#/wcChange"){
            this.isLogin = false
        }else{
            this.isLogin = true
        };
        GetNodeAccount(oid)
                .then((response)=>{
                    this.formData = response.data;
                    for(let i in this.formData){
                        this.formData[i].headImgUrl = this.baseUrl + this.formData[i].headImgUrl;
                    }
                });
        GetOrganization(oid)
                .then((response)=>{
                    if(response.data.parent){
                      this.$store.commit('SET_ACCOUNT', true)                    
                    }
                })
        console.log(123321)
    },
    components:{
        Tree
    },
    data() {
        return {
            structrueData: [],
            dialogTreeVisible: false,
            curNodeKey: 41,
            editVisible:false,
            defExpKeys:["00000000-0000-0000-0000-000000000001"],
            organizationKey: '',
            pageParam: {
                page: 1,
                size: 10
            },
            loc:location.hash,
            isLogin:true,
            // totalPage: 10,
            formData: [],
            baseUrl: process.env.MATERIAL_API
            // actTypeOptions
            // activityType: ''
        }
    },
    methods: {
        setAccount(index,row){
            console.log(row)
            this.$emit('changeAid',false);

            let aobj = {
                        "name":row.name,
                        "account":row.account,
                        "accountImg":row.headImgUrl,
                        "organizationName":row.organizationName,
                        "organizationId":row.organizationId
                    };
            localStorage.setItem("aid",row.account);
            localStorage.setItem("accountInfo",JSON.stringify(aobj));

            // let loc = location.hash;
            if(this.loc != "#/wcChange"){
                location.reload();
                // this.goPrice(0); 
            }
            
        },
        loadNode,
        getBackLogin(){
            this.$router.push({path: '/login'});
        },
        getNodeAccount(id){
            return GetNodeAccount(id)
                .then((response)=>{
                    this.formData = response.data
                    for(let i in this.formData){
                        this.formData[i].headImgUrl = this.baseUrl + this.formData[i].headImgUrl;
                    }
                })
        },
        loadAccountTable(node){
            console.log(node);
            this.getNodeAccount(node.id);
        },
        reloadCurNode(tempNodeKey = this.curNodeKey){
            $(".el-tree-node.is-current .el-tree-node__content:first .js-refresh").click()
        },
        reloadCurParentNode(){
            $(".el-tree-node.is-current").parent().prev().children(".js-refresh").click()
        },
        findCurNode(tempNodeKey = this.curNodeKey, node = this.$refs.tree.root){
            for(let v of node.childNodes) {
                if(v.data.id === tempNodeKey){
                    return {
                        parent: node,
                        node:v
                    }
                }
            }
            for(let v of node.childNodes) {
                let findedNode = this.findCurNode(tempNodeKey, v)
                if(findedNode){
                    return findedNode
                }
            }

        },
        handleNodeClick(node,data) {
            // this.editVisible = true;
            this.deleteId = node.id
            this.curNodeKey = node.id
            this.loadAccountTable(node);
        },
        renderContent(h, {node, data, store}) {
            // if (this.editVisible) {
            //     return (
            //         <span>
            //         <span>{node.data.name}</span>
            //     <span style="float: right; margin-right: 20px"class={{ hide: node.id != this.$refs.tree.currentNode.node.id }} >
            //         <el-button size="mini" on-click={ () => this.loadAccountTable(node) }>确认
            //     </el-button>
            //     </span>
            //     </span>
            // );
            // }
            // else
            // {
            if(node.data.accountNum != '0' && node.data.accountNum != undefined && node.data.accountNum != null){
                return (
                    <span>
                        <span>{node.data.name} </span>
                        <span>({node.data.accountNum})</span>
                    </span>
                    )
            }
            return (
                <span>
                    <span>{node.data.name}</span>
                </span>
            )
            // }
        }

    }
}

