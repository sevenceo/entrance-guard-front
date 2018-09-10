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
  * 作   者：Allen
  * 创建日期：2018-7-26
  * </pre>
  */
import {GetList, Create, Editor, Delete, BatchDelete, Status, BatchStatus,GetOrgTreeInfo} from "./api/humanDailyWorkStateApi";
import {getOrginations,getHumanByIds} from '../attendance/api/attendanceApi';

// import {getOrginations} from '../api/AttenDanceApi'

export default {
    created() {
        var that = this;
        that.tablehead();
        // console.log('that.days=============');
        // console.log(that.days);
        // this.initTree();
        // this.search();
        this.getFirstLvl();
    },
    data() {
        return {
            title:'',
            year:"",
            month:"",
            days:[],
            tableData: [],
            columnData:[],
            treeLeftData: [],
            organizations:[
            ],
            props: {
                children: 'children',
                label: 'label'
            },
            leftTreeFilterText: '',
            organizationId:'',
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            dialogFormUsers: false,
            temp: tempInit(),
            addDailyWorkState:false,
            rules: {
            //     endDate:
            //         [
            //                 {required: true, message: '请输入结束时间', trigger: 'blur'},
            //                 {max: 1, message: '结束时间不得为空'}],
            //     workState:
            //         [
            //                 {required: true, message: '请输入工作状态', trigger: 'blur'},
            //                 {max: 1, message: '工作状态不得为空'}],
            },
            pageParam: pageParamInit(),
            formVisible: false,
            spanArr: [],
            errorTip: "",
            errorLine: 5,
            firstLvl:[]
    }
    },
    components: {
        //etc...
    },
    methods: {

        getFirstLvl(){
            getOrginations().then(resp=>{
                if(resp!=null){
                var data = resp.data;
                if(data!=null){
                    for(var i = 0;i<data.length;i++){
                        this.firstLvl[i]={
                            value:data[i].id,
                            label:data[i].label
                        }
                    }
                    if(this.firstLvl.length>0){
                        var ids = this.firstLvl.map(item => item.value)
                        this.pageParam.resourceIds = ids;
                    }
                    this.getList(this.pageParam);
                    // this.GetAttenDanceGroups();
                }
            }
        })
        },

        //显示
        getList(pageParam) {
            GetList(pageParam)
                .then((response) => {
                if( response.data!="undefined"  && response.data.rows!=[] ) {
                    var that = this;
                    that.tableData = response.data.rows;
                    that.columnData = response.data.rows;
                    that.getSpanArr(response.data.rows);
                    var ids = that.tableData.map(item => item.humanId);
                    getHumanByIds(ids).then(resp => {
                        var data = resp.data;
                        for (var i = 0; i < that.tableData.length; i++) {
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].id == that.tableData[i].humanName) {
                                    var name = data[j].realName;
                                    that.tableData[i].humanName = name;
                                }
                            }
                        }
                    })

                    console.log(response);
                }
            this.rowTotal = response.data.rowTotal;
            // this.tableData = response.data;
            // this.getSpanArr(response.data);
        })
        },
        getCellClass({row, column, rowIndex, columnIndex}) {
            if (column.label =="日" || column.label =="六") {
                return 'warning-row'
            }
        },

        tableDbEdit(row, column, cell, event) {
                var label = parseInt(column.property.split('_')[1]);
                if(label>=1 && label<=32) {
                    this.title = '修改工作状态';
                    this.temp = this.setTempValue(row,label);
                    this.organizationName = '';
                    this.organizationId = '';
                    // this.attenDanceGroups=[];
                    // this.$refs['form'].resetFields();
                    this.dialogStatus = 'create';
                    this.addDailyWorkState = true;
                }
        },

        tablehead:function(){
            var that = this;
            that.days=[];
            var date = new Date();
            if(that.pageParam.month!="") {
                date = new Date(that.pageParam.month);
                that.days=[];
            }
            var a = new Array("日", "一", "二", "三", "四", "五", "六");
            this.year = date.getFullYear();
            this.month = date.getMonth()+1;
            var d = new Date(this.year, this.month, 0);
            for(var  i=0;i< d.getDate();i++ ) {
                date.setDate(i+1);
                var week =date.getDay();
                that.days.push({value: 'day_'+(i+1), name:''+(i+1)+'',week: ""+a[week]})
            }
        },
        getSpanArr(data) {
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].humanName === data[i - 1].humanName) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },

        // 合并单元格
        cellMerge({ row, column, rowIndex, columnIndex }) {
            // console.log("columnIndex===================");
            // console.log(columnIndex);
                if (columnIndex === 0 || columnIndex === 1) {
                    if (rowIndex % 2 === 0) {
                        const _row = this.spanArr[rowIndex];
                        const _col = _row > 0 ? 1 : 0;
                        return {
                            rowspan: 2,
                            colspan: 1
                        }
                    }
                    else
                    {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },

        /**
         * 树筛选
         */
        leftTreeSearch: function (val) {
            this.$refs.treeLeft.filter(val);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
        /**
         * 组装树  数据
         * @param data
         * @returns {{treeData: Array, treeHashContainer: {}}}
         * @private
         */
        _treeDataHandler: function (data) {
            let orgId = this.$store.state.user.user.orgId;
            ;
            let treeHashContainer = {};
            let rootNodes = [];
            for (let i = 0; i < data.length; i++) {

                let d = data[i];
                treeHashContainer[d.id] = d;
            }
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                var parent = treeHashContainer[d.parentId];
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push(d);
                    d.parent = parent;
                } else {
                    rootNodes.push(d);
                }
            }
            return {treeData: rootNodes, treeHashContainer: treeHashContainer};
        },

        //翻页功能
        handleCurrentChange(page) {
            this.pageParam.page = page;
            this.getList(this.pageParam)
        },
        handleSelectionChange(selection) {
            this.selectionData = selection
        },
        onAdd() {
            this.temp = tempInit();

            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
        },
        onEdit(row) {
            this.temp = $.extend(tempInit(), row);

            /*
            * Other init data
            *
            * */

            this.dialogFormVisible = true;
            this.dialogStatus = 'editor';
        },

        resetForm() {
            this.$refs['form'].resetFields();
            this.temp = tempInit()

        },
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            this.tablehead();
            this.getFirstLvl();
            // this.getList(this.pageParam)
            // this.$refs.pages.changePage(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.pageParam = pageParamInit()
        },

        create() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    Create(this.temp)
                        .then(() => {
                        this.dialogFormVisible = false;
                    this.dialogStatus = 'create';
                    this.getList(this.pageParam);
                })
                } else {
                    return false;
        }
        })
            ;

        },
        update(formName) {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var that = this;
                    if(that.temp.endDate!=that.temp.startDate) {
                        var year = that.temp.endDate.getFullYear();
                        var month = (that.temp.endDate.getMonth() + 1).toString();
                        var day = (that.temp.endDate.getDate()).toString();
                        var dateTime = year + "-" + month + "-" + day;
                        that.temp.endDate = dateTime;
                    }
                    Editor(that.temp)
                        .then(() => {
                        this.addDailyWorkState = false;
                    // this.dialogStatus = 'create';
                    that.getList(this.pageParam);
                    that.temp = tempInit()
                })
                    ;
                } else {
                    return false;
        }
        })
            ;
        },
    setTempValue(row,label) {
        var  time =this.year+'-'+this.month+'-'+label;
        if(row.am!=null)
            var  startAmOrPm=row.am;
        else
            var  startAmOrPm=row.pm;

        return {
            humanId : row.humanId,
            humanName:row.humanName,
            date : time,
            startDate:time,
            startAmOrPm:startAmOrPm,
            endDate:time,
            endAmOrPm:'',
            workState:'',
            amWorkState : '',
            pmWorkState : '',
            amCheckTime : '',
            pmCheckTime : '',
        }
    },
        handleCancel() {
            this.addDailyWorkState = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        closeForm() {
            this.formVisible = false;
        }

    }
}


function tempInit() {
    return {
                humanId : '',
                humanName:'',
                date : '',
                startDate:'',
                startAmOrPm:'',
                endDate:'',
                endAmOrPm:'',
                workState:'',
                amWorkState : '',
                pmWorkState : '',
                amCheckTime : '',
                pmCheckTime : '',
                            }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
            humanId : '',
            month : '',
            amWorkState : '',
            pmWorkState : '',
            amCheckTime : '',
            pmCheckTime : '',
            resourceIds:[],
    }
}

