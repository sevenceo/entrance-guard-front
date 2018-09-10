/**
 * Created by Micheal Xiao on 2017/6/2.
 */
export default {
    props:['tableData'],
    data(){
        return {
            multipleSelection: []
        }
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            // console.log("选中row数据")
            // console.log(this.multipleSelection)
            this.$emit('selectionChange',val)
        }
    }
}
