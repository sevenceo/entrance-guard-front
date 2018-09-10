import store from "store"
import moment from 'moment';

export default {
    props:['tableData'],
    data(){
        return {
            multipleSelection: []
        }
    },
    methods: {
        formatter(row, column) {
            let date = row[column.property];
            if(date) {
                if('runTime' == column.property) {
                    date = moment(date).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    date = date.split('T')[0];
                }
            }
            return date;
        },
        formatCategory(row, column) {
            let category = row[column.property];
            if(category == 'AUTO') {
                category = '自动';
            } else {
                category = '手动';
            }
            return category;
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
        showfans(id){
            this.$emit('showfans',id)
        },
        isSelectable(row,index) {
            let flag = false;
            if(row.category == 'AUTO') {
                flag = true;
            }
            return flag;
        }

    }
}