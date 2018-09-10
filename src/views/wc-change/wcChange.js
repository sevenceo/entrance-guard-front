/**
 * Created by Micheal Xiao on 2017/7/26.
 */

import moment from 'moment'
import store from 'store'
import{ Tree } from 'element-ui-mike'
// import{ GetTree , GetNodeChildren } from 'src/views/wc-system/structure/api/structureApi'
import changeAccount from 'src/components/changeAccount/changeAccount.vue';
import{ GetTree , GetNodeChildren , GetNodeAccount } from './api/wcChangeApi'
// import{ Tree } from 'element-ui-mike'
// import {GetList, DeleteAccount, CreateAccount, ModifyAccount, AvatarUpload, GetOrganizationName, GetSelection} from './api/wcAccountApi'
// import {Message} from 'element-ui';


//组件级变量
let selectionData = []

export default {
    created(){
        let oid = this.$store.state.user.user.organizationid;
        GetNodeAccount(oid)
                .then((response)=>{
                    this.formData = response.data
                })
    },
    components:{
        Tree,changeAccount
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
            // totalPage: 10,
            formData: [],
            // actTypeOptions
            // activityType: ''
        }
    },
    methods: {
        setAid(msg){
                if(!msg){
                    // this.$router.replace({path: '/dashboard'});
                    // this.$router.push({path: 'guard/controlDevice'});    // 登陸成功，展示控制設備頁面
                    this.$router.push({path: '/guard/human'});    // 登陸成功，展示控制設備頁面
                }
                // this.$store.commit('SET_ACC_DIALOG', msg);
        },
        async loadNode(node, resolve){
            if (node.level === 0) {
                let nodeArr = []
                let node0 = await this.getNode0()
                nodeArr.push(node0)
                return resolve(nodeArr);
            }else{
                if(node.data.parent){
                    let nodeArr = await this.getChildNode(node.data.id)
                    return resolve(nodeArr);
                }else{
                    return resolve([])
                }
            }
        },
        getNode0(){
            return GetTree()
                .then((response)=> {
                    return response.data
                })
        },
        getChildNode(id){
            return GetNodeChildren(id)
                .then((response)=>{
                    return response.data.children
                })
        },
        getNodeAccount(id){
            return GetNodeAccount(id)
                .then((response)=>{
                    this.formData = response.data
                })
        },
        loadAccountTable(node){
            this.getNodeAccount(node.data.id);
        },
        reloadCurNode(tempNodeKey = this.curNodeKey){
            $(".el-tree-node.is-current .el-tree-node__content:first .js-refresh").click()
        },
        reloadCurParentNode(){
            $(".el-tree-node.is-current").parent().prev().children(".js-refresh").click()
        },
        findCurNode(tempNodeKey = this.curNodeKey, node = this.$refs.tree.root){
            // console.log("find node function")
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
            this.editVisible = true;
            this.deleteId = node.id
            this.curNodeKey = node.id
        },
        renderContent(h, {node, data, store}) {
            if (this.editVisible) {
                return (
                    <span>
                    <span>{node.data.name}</span>
                <span style="float: right; margin-right: 20px"class={{ hide: node.id != this.$refs.tree.currentNode.node.id }} >
                    <el-button size="mini" on-click={ () => this.loadAccountTable(node) }>确认
                </el-button>
                </span>
                </span>
            );
            }
            else
            {
                return (
                    <span>
                    <span>{node.data.name}</span>
            </span>
            )
            }
        }

    }
}

