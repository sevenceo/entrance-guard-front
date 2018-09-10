/**************************************************************************/
/*                                                                        */
/* Copyright (c) 2017 HyperSmart Company                                  */
/* 深圳市超智慧信息科技有限公司版权所有                                     */
/*                                                                        */
/* PROPRIETARY RIGHTS of HyperSmart Company are involved in the           */
/* subject matter of this material. All manufacturing, reproduction, use, */
/* and sales rights pertaining to this subject matter are governed by the */
/* license agreement. The recipient of this software implicitly accepts   */
/* the terms of the license.                                              */
/* 本软件文档资料是深圳市超智慧信息科技有限公司的资产，任何人士阅读和        */
/* 使用本资料必须获得相应的书面授权，承担保密责任和接受相应的法律约束。      */
/*                                                                        */
/**************************************************************************/

/**
 * <pre>
 * 作   者：Allison
 * 创建日期：2018-7-31
 * </pre>
 */
import {Create, GetSettings} from "./api/earlyWarningConfigApi";
import {Message} from "element-ui";

export default {
    created() {
        console.log(1234);
        this.getList()
    },
    data() {
        return {
            // temp: tempInit(),
            rules: {
                opendoorRotationTime:
                    [
                        {required: true, message: '请输入轮训时间'},
                        // {required: true,max:3, message: '不得超过三位数'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                redWarningTime:
                    [
                        {required: true, message: '请输入红色报警时间'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                orangeWarningTime:
                    [
                        {required: true, message: '请输入橙色报警时间'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                yellowWarningTime:
                    [
                        {required: true, message: '请输入黄色报警时间'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                deviceRotationTime:
                    [
                        {required: true, message: '请输入轮训时间'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                redCPUWarning:
                    [
                        {required: true, message: '请输入CPU（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                redDiskWarning:
                    [
                        {required: true, message: '请输入硬盘（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                redRAMWarning:
                    [
                        {required: true, message: '请输入内存（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                orangeCPUWarning:
                    [
                        {required: true, message: '请输入CPU（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                orangeDiskWarning:
                    [
                        {required: true, message: '请输入硬盘（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                orangeRAMWarning:
                    [
                        {required: true, message: '请输入内存（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                yellowCPUWarning:
                    [
                        {required: true, message: '请输入CPU（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                yellowDiskWarning:
                    [
                        {required: true, message: '请输入硬盘（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                yellowRAMWarning:
                    [
                        {required: true, message: '请输入内存（报警阈值）'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],
                delayedTime:
                    [
                        {required: true, message: '请输入最大上报延时时间'},
                        {
                            required: true,
                            pattern: /^[0-9]*[1-9][0-9]*$/,
                            message: '只能输入整数',
                        }
                    ],

            },
            pageParam: pageParamInit(),
            email: '',
            emailList: [],
            timeSelection: [{
                'label': 'm',
                'value': '分'
            },
                {
                    'label': 'h',
                    'value': '时'
                },
                {
                    'label': 'd',
                    'value': '天'
                },
            ],
            timeSlot: timeSlotInit(),
            opendoorEarlyWarningTemp: opendoorEarlyWarningTempInit(),
            deviceEarlyWarningTemp: deviceEarlyWarningTempInit(),
            selectedEmail: '',
            updateFlag:false
        }
    },
    components: {
        //etc...
    },
    methods: {
        //显示
        getList() {
            GetSettings().then((response)=>{
                if(response.data!=null){
                    let data = response.data;
                    let emailStr = data.inUseEmail;
                    this.emailList = emailStr.split(",");
                    this.deviceEarlyWarningTemp = data.deviceEarlyWarning;
                    this.deviceEarlyWarningTemp.deviceFlag = data.deviceEarlyWarning.deviceFlag+"";
                    this.opendoorEarlyWarningTemp = data.opendoorEarlyWarning;
                    if(this.opendoorEarlyWarningTemp.timesBegin == null){
                        this.opendoorEarlyWarningTemp.timesBegin = 0;
                    }
                    if(this.opendoorEarlyWarningTemp.timesEnd == null){
                        this.opendoorEarlyWarningTemp.timesEnd = 23;
                    }
                    this.opendoorEarlyWarningTemp.opendoorFlag = data.opendoorEarlyWarning.opendoorFlag+"";
                    if(this.deviceEarlyWarningTemp.timesBegin == null){
                        this.deviceEarlyWarningTemp.timesBegin = 0;
                    }
                    if(this.deviceEarlyWarningTemp.timesEnd == null){
                        this.deviceEarlyWarningTemp.timesEnd = 23;
                    }
                }

            });
        },

        save() {

            if (this.emailList.length < 1) {
                Message({
                    message: '邮箱不能为空',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                });

                return;
            }
            this.$refs['opendoorForm'].validate((valid) => {
                if (valid) {
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            let inUseEmail = this.emailList.join() + ",";
                            let opendoorEarlyWarning = this.opendoorEarlyWarningTemp;
                            let deviceEarlyWarning = this.deviceEarlyWarningTemp;

                            let param = {
                                inUseEmail: inUseEmail.substring(0,inUseEmail.length-1),
                                opendoorEarlyWarning: opendoorEarlyWarning,
                                deviceEarlyWarning: deviceEarlyWarning

                            }
                            Create(param);

                        } else {
                            return false;
                        }
                    });
                }else {
                    return false;
                }
            });
        },
        addEmail() {
            if (this.email.replace(/\s+/g, "") == '') {
                Message({
                    message: '邮箱不能为空',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                });

                return;
            }
            let value = this.email.replace(/\s+/g, "");
            var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (value != '') {
                if (!regEmail.test(value)) {
                    Message({
                        message: '邮箱格式不正确',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    });

                    return;
                }
            }
            if (this.email != null && this.email != '') {
                for (let i = 0; i < this.emailList.length; i++) {
                    if (this.email.replace(/\s+/g, "") == this.emailList[i].replace(/\s+/g, "")) {
                        Message({
                            message: '邮箱不能重复',
                            type: 'error',
                            customClass: 'msg-error',
                            iconClass: 'ic'
                        });

                        return;

                    }
                }
                this.emailList.push(this.email);
            }
            this.email = '';
        },
        updateEmailSave() {
            if (this.email.replace(/\s+/g, "") == '') {
                Message({
                    message: '邮箱不能为空',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                });

                return;
            }
            let value = this.email.replace(/\s+/g, "");
            var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (value != '') {
                if (!regEmail.test(value)) {
                    Message({
                        message: '邮箱格式不正确',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    });

                    return;
                }
            }
            for (let i = 0; i < this.emailList.length; i++) {
                if (this.email.replace(/\s+/g, "") == this.emailList[i].replace(/\s+/g, "") && i != this.selectedEmail) {
                    Message({
                        message: '邮箱不能重复',
                        type: 'error',
                        customClass: 'msg-error',
                        iconClass: 'ic'
                    });

                    return;

                }
            }
            this.emailList[this.selectedEmail] = this.email;
            this.email = '';
            this.selectedEmail = '';
            this.updateFlag = false;
        },
        deleteEmail(index) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    this.emailList.splice(index, 1);
                    this.email = '';
                });

        },
        // selectEmail(index) {
        //     this.email = this.emailList[index];
        //     this.selectedEmail = index;
        //     // this.emailList.splice(index,1);
        //     // $(".tr"+index).css("background-color",'#20a1ff');
        //     // let flag = false;
        //     // $("table tr").find(".checked").each(function () {
        //     //     if ($(this).attr("id") != 'tr'+index) {
        //     //         $(this).removeClass('checked');
        //     //         flag = false;
        //     //     }
        //     //
        //     // })
        //     // if (!flag) {
        //     //     $("table tr").find("#" + 'tr'+index).addClass('checked');
        //     //
        //     //     flag = true;
        //     // } else {
        //     //     $("table tr").removeClass('checked');
        //     //     flag = false;
        //     // }
        // },
        updateEmail(index){
            this.email = this.emailList[index];
            this.selectedEmail = index;
            this.updateFlag = true;
        },


    }
}

function opendoorEarlyWarningTempInit() {
    return {
        timesBegin:0,
        timesEnd:23,
        opendoorRotationTime: '',
        rotationTimeType: 'm',
        redWarningTime: '',
        redWarningTimeType: 'm',
        orangeWarningTime: '',
        orangeWarningTimeType: 'm',
        yellowWarningTime: '',
        yellowWarningTimeType: 'm',
        opendoorFlag: '1'
    }
}

function deviceEarlyWarningTempInit() {
    return {
        deviceRotationTime: '',
        rotationTimeType: 'm',
        redCPUWarning: '',
        redDiskWarning: '',
        redRAMWarning: '',
        orangeCPUWarning: '',
        orangeDiskWarning: '',
        orangeRAMWarning: '',
        yellowCPUWarning: '',
        yellowDiskWarning: '',
        yellowRAMWarning: '',
        deviceFlag: '1',
        delayedTime: ''
    }
}

function pageParamInit() {
    return {}
}

function timeSlotInit() {
    let timeArray=[];
    for(var i=0;i<24;i++){
        let obj = {
            label:i,
            value:i,
        }
        timeArray.push(obj);
    }
    return timeArray;
}

