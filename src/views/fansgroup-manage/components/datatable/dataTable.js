import store from "store";
import moment from 'moment';

export default {
    props:['tableData'],
    created() {
        let flag1 = false;
        let flag2 = false;
        let roles = this.$store.state.user.roles;
        for(let i in roles){
            if(roles[i] == 'FansGroup.Agency.Maintenance'){
                flag1 = true;
            }
            if(roles[i] == 'FansGroup.Manufacturer.Maintenance'){
                flag2 = true;
            }
        }
        if(flag1 && flag2) {
            this.agencyModVisible = false;
        } else {
            this.agencyModVisible = true;
        }
    },
    methods: {
        formatter(row, column) {
            let date = row[column.property];
            if(date) {
                date = moment(date).format("YYYY-MM-DD HH:mm:ss");
            }
            return date;
        },
        formatterIsMaster(row, column){
            let isMaster = row[column.property];
            if(isMaster) {
                return "主机厂";
            } else {
                return "经销商";
            }
        }
    },
    data() {
        return {
            agencyModVisible : true
        }
    }
}