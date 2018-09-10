
import {
    GetDeviceDetailDataById,
    GetDeviceDetailLogDataById
} from '../../OpendoorEarlyWarning/api/OpendoorEarlyWarningApi'

export default {
    created() {
        console.log("123");
        this.getDetailData();
        this.getLogData(this.type);
        this.intervalid = setInterval(() => {
            this.getDetailData();
            this.getLogData(this.type);
        }, 10000)
    },
    beforeDestroy () {
        clearInterval(this.intervalid);
    },
    methods:{
        getDetailData() {
            GetDeviceDetailDataById(this.sceneId, this.code).then((response) => {
                console.log("123");
                this.doorData = response.data;
            });
        },
        getLogData(type) {
            GetDeviceDetailLogDataById(this.sceneId, this.tenantId, type).then((response) => {
                if(typeof(response) != "undefined"  && response.data){
                    this.logData = response.data.rows;
                }
            });

        },
        goBackDoor(){
            // this.$router.push({path:'/earlyWarning/deviceEarlyWarning'});
            window.history.go(-1);
        }
    },
    data() {
        return {
            sceneId: this.$route.params.id,
            tenantId: this.$route.params.tenantId,
            code: this.$route.params.code,
            doorData:doorDataInit(),
            logData: {},
            type: "error",
            temp:{
                errorType: "error"
            },
            options:[{
                value: 'error',
                label: 'error'
            }, {
                value: 'warn',
                label: 'warn'
            }, {
                value: 'info',
                label: 'info'
            }],
        };
    }
};

function doorDataInit() {
    return {
        deviceStateDetail : {version:'',
            cpuStatus:[{usageRate:''}],
            memoryStatus:[{percent:''}],
            diskStatus:[{percent:''}],
        },


    }
}
