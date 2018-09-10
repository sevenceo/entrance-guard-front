/**
 * Created by zhaimaojin on 2017/8/16.
 */

import store from "store"

export default {
    props:['tableData'],
    data(){
        return {
            dialogStatus: 'update',
            dialogFormVisible: true,
        }
    },
    methods: {
        onEdit: function (row) {
            console.log(row)
            this.$emit("dialogFormVisible",this.dialogFormVisible,row,this.dialogStatus)
        },
        // showDetails: function (row) {
        //     this.$store.commit('SET_DATA', row)
        // },
        onDelete: function (row) {
            console.log("row")
            console.log(row)
            this.$emit("deleteRow",row)
        }
    }
}