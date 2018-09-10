/**
 * Created by zhaimaojin on 2017/8/30.
 */
import{ Tree } from 'element-ui-mike'
import{ GetTree , GetNodeChildren} from 'src/views/wc-system/structure/api/structureApi'
import { loadSelectNode } from 'utils/tree-loading/treeLoading'


export default {
    created(){

    },
    mounted() {
        document.body.appendChild(this.$refs.dialog.$el);
    },
    components:{
        Tree
    },
    props: ['organizationName'],
    data() {
        return {
            structrueData: [],
            dialogTreeVisible: false,
            curNodeKey: 41,
            editVisible:false,
            defExpKeys:["00000000-0000-0000-0000-000000000001"],
            organizationKey: ''
        }
    },
    methods: {
        loadSelectNode,
        onShow(){
            this.dialogTreeVisible= true
        },

        confirm(node){
          this.organizationKey = node.id;
          this.$emit("organizationKey",this.organizationKey,node.name);
          this.dialogTreeVisible= false;
          event.stopPropagation();
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
            // this.editVisible = true;

            this.deleteId = node.id
            this.curNodeKey = node.id
            this.confirm(node);
        },
        renderContent(h, {node, data, store}) {
            // if (this.editVisible) {
            //     return (
            //         <span>
            //         <span>{node.data.name}</span>
            //     <span style="float: right; margin-right: 20px"class={{ hide: node.id != this.$refs.tree.currentNode.node.id }} >
            //         <el-button size="mini" on-click={ () => this.confirm(node) }>确认
            //     </el-button>
            //     </span>
            //     </span>
            // );
            // }
            // else
            // {
                // console.log(node);
                return (
                    <span>
                    <span>{node.data.name}</span>
            </span>
            )
            // }
        }

    }
}