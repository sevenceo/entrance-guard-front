/**
 *
 */
import store from "store"
import moment from 'moment';

export default {
    props:['tableData'],
    data(){
        return {
            dialogStatus: 'update',
            dialogFormVisible: true,
            multipleSelection:[],
            brandData:''
        }
    },
    methods: {
        onEdit: function (row) {
            this.$emit("dialogFormVisible",this.dialogFormVisible,row,this.dialogStatus)
        },
        onDelete: function (row) {
            this.$emit("deleteRow",row)
        },
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
        },
        formatter(row, column) {
            let date = row[column.property];
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        },
        getBrandName(row, column){
            let brandId = row[column.property];
            let brandName = "";

            for(let i in this.brandData){
                if(brandId == this.brandData[i].id){
                    brandName  = this.brandData[i].name;
                    break;
                }
            }
            return brandName;
        }
    }
}