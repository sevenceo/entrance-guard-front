/**
 * Created by Micheal Xiao on 2017/7/5.
 */
import {GetCatalog} from './api/getCatalog'

export default{
    data(){
        return{
            catalogData: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created(){
        this.getCatalog();
    },
    methods: {
        getCatalog(){
            GetCatalog().then((response) => {
                this.catalogData = response.data;
            })
        },
        handleNodeChange(data){
            console.log(data);
            console.log(this.$refs.fileTree.data)
            let tree = this.$refs.fileTree.data;
            tree.forEach(function (val, n) {
                if(val.$treeNode == data.$treeNode){
                    tree[n]
                }
            })
        }
    }
}