/**
 * Created by Micheal Xiao on 2017/9/7.
 */
import{ GetTree , GetNodeChildren, } from './treeLoadingApi'
import store from "store"
const loadNode = async function(node, resolve){
    // console.log("loading node")
    // console.log(node)
    if (node.level === 0) {
        let nodeArr = []
        let nodeData = await GetNodeChildren(this.$store.state.user.user.organizationid)
        nodeArr.push(nodeData)
        // console.log("渲染的node0 节点数据")
        // console.log(nodeArr)
        return resolve(nodeArr);
    }else{
        let nodeData = await GetNodeChildren(node.data.id)
        // console.log("渲染的node1 及以下节点数据")
        // console.log(nodeData.children)
        return resolve(nodeData.children);
    }
}

const loadSelectNode = async function(node, resolve){
    if (node.level === 0) {
        let nodeArr = []
        let nodeData = await GetNodeChildren(this.$store.state.user.user.organizationid, true)
        nodeArr.push(nodeData)
        return resolve(nodeArr);
    }else{
        if(store.state.user.userLevel > 2){
            return resolve([]);
        }else{
            let nodeData = await GetNodeChildren(node.data.id, true)
            return resolve(nodeData.children);
        }
    }
}

const NomralUserLoadSelectNode = async function(node, resolve){
    if (node.level === 0) {
        let nodeArr = []
        let nodeData = await GetNodeChildren(this.$store.state.user.user.organizationid, true)
        nodeArr.push(nodeData)
        return resolve(nodeArr);
    }else{
        return resolve([])
    }
}

export { loadSelectNode }
export default loadNode

