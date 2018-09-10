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
  * 作   者：胡跃峥
  * 创建日期：2018-7-19
  * </pre>
  */
import {GetList, ReplyFeedBack} from "./api/feedBackApi";
import moment from "moment/moment";

export default {
    created() {
        this.getList(this.pageParam);
    },
    data() {
        return {
            tableData: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogReplyFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            currentLoginName: '',
            temp: tempInit(),
            rules: {
                feedbackWords:
                    [
                            {required: true, message: '请输入意见文字', trigger: 'blur'},
                            {max: 1000, message: '意见文字不得超过1,000个字符'}],
                replyContent:
                    [
                            {required: true, message: '请输入回复文字', trigger: 'blur'},
                            {max: 1000, message: '意见文字不得超过1,000个字符'}]
            },
            pageParam: pageParamInit(),
            formVisible: false,
            errorTip: "",
            errorLine: 5
    }
    },
    components: {
        //etc...
    },
    methods: {
        //显示
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                console.log(response);
            this.rowTotal = response.data.rowTotal;
            this.tableData = response.data.rows;
        })
        },
        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        onLook(row) {
            this.temp = $.extend(tempInit(), row);
            // this.temp.feedbackVoice="http://www.w3school.com.cn/i/song.mp3";
            this.dialogFormVisible = true;
        },
        onReply(row) {
            this.temp = $.extend(tempInit(), row);

            this.dialogReplyFormVisible = true;
        },
        createReply(row){
            this.$refs["replyDialogForm"].validate((valid) => {
                if (valid) {
                    let jsonObj = {"id":this.temp.id, "replyContent":this.temp.replyContent};
                    ReplyFeedBack(jsonObj).then(()=>{
                        this.dialogFormVisible = false;
                        this.$message({
                            message: '回复成功',
                            type: 'success'
                        })
                        this.getList(this.pageParam);
                    })
                }
            });
        },
        close(){
            this.dialogFormVisible = false;
        },
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            this.getList(this.pageParam);
            this.$refs.pages.changePage(1);
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.pageParam = pageParamInit()
        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        formatterTime(row, column) {
            let date = row[column.property];
            if(date){
                return moment(date).format("YYYY-MM-DD");
            }
            return "";
        },
        formatSex(row, column){
            let sex = row[column.property];
            if(sex == 1) {
                return "男";
            } else if(sex == 2  ) {
                return "女";
            } else {
                return "未知";
            }
        }

    }
}

function tempInit() {
    return {
        humanId : '',
        feedbackWords : '',
        feedbackVoice : '',
        feedbackImage : '',
        tenantId : '',
        replyTime : '',
        adminName : '',
        replyContent:''
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        realName : '',
        feedbackWords : ''
    }
}


