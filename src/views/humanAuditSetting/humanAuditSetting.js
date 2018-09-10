import {SetHumanAudit,GetHumanAuditSetting} from "../humanAuditSetting/api/humanAuditSettingApi";

export default {
    created() {
        this.getSettings();
    },
    data() {
        return {
            humanAuditSetting: humanAuditSettingInit(),
            rules: { },
            declareVisible:false
        }

    },
    components: {
        //etc...
    },
    methods: {
        getSettings(){
            GetHumanAuditSetting().then((response)=>{
                console.log(response);
                if(response.data){
                    this.humanAuditSetting.certificateTypeFlag = response.data.certificateTypeFlag+"";
                    this.humanAuditSetting.idCardPhotoFlag = response.data.idCardPhotoFlag;
                    this.humanAuditSetting.idCardNoFlag = response.data.idCardNoFlag;
                    this.humanAuditSetting.certificateFlag = response.data.certificateFlag;
                }
            })
        },
        set(){
            console.log(this.humanAuditSetting);
            SetHumanAudit(this.humanAuditSetting).then((response)=>{
                /*console.log(response);*/
                if(response.code==0){
                    this.$message({
                        message: "设置成功！",
                        type: 'success'
                    });
                    this.getSettings();
                }else{
                    this.$message({
                        message: "设置失败！",
                        type: 'error'
                    })
                }
            })
        },
        read(){
            this.declareVisible=true;
        }
    }
}

function humanAuditSettingInit() {
    return {
        idCardNoFlag:true,
        idCardPhotoFlag: true,
        certificateFlag: true,
        certificateTypeFlag: '0',
        readFlag:false
    }
}