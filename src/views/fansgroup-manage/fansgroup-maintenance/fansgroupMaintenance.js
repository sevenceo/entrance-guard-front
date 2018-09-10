/**
 * Created by zyk on 2017/9/28.
 */
import {GetFansGroupManufacturerData,GetFansGroupAgencyData,GetFansList,GetTreeData,ModifyAgencyData,ModifyManufacturerData,CreateManufacturerData,CreateAgencyData,CountFansGroup} from '../api/fansgroupManageApi'
import store from 'store';
import moment from 'moment';

const fansGroupStateOptions = [
    {key: 'ON', label: '启用'},
    {key: 'OFF', label: '停用'},
];

const runCycleOptions = [
    {key: 'Day', label:'Day'},
    {key: 'Week',label:'Week'},
    {key: 'Month',label:'Month'}
];

let showflag = 'add';
export default {
    created() {
        showflag = this.$route.params.id;
        if(this.id != 'add') {
            this.getFansGroupData();
        }
        this.getTreeData();
    },
    watch: {
        /**
         *  过滤树
         */
        filterChooseText(val) {
            this.$refs.chooseTree.filter(val);
        },
        filterExculdeText(val) {
            this.$refs.exculdeTree.filter(val);
        }
    },
    methods: {
        getFansGroupData: function () {
            if((this.isMaster+"")=="true") {
                GetFansGroupManufacturerData(this.id,this.account).then((response) => {
                    this.fansGroupData = response.data;
                    this.handleJsonString();
                 })
            } else {
                GetFansGroupAgencyData(this.id,this.account).then((response) => {
                    this.fansGroupData = response.data;
                    this.handleJsonString();
                })
            }
        },
        /**
         *  新建标签
         */
        create(tempform) {
            this.$refs[tempform].validate((valid) => {
                if (valid) {
                        if(this.auth == 'Manufacturer') {
                            this.fansGroupData.id = null;
                            CreateManufacturerData(this.fansGroupData).then((response) => {
                            this.chooseTags = [];
                            this.excludeTags = [];
                            this.chooseChecked = [];
                            this.exculdeChecked = [];
                            this.fansGroupData = fansGroupInit();
                            this.$refs[tempform].resetFields();
                            this.exeTask(response);
                        });
                    } else {
                        this.fansGroupData.id = null;
                        CreateAgencyData(this.fansGroupData).then((response) => {
                        this.chooseTags = [];
                        this.excludeTags = [];
                        this.chooseChecked = [];
                        this.exculdeChecked = [];
                        this.fansGroupData = fansGroupInit();
                        this.$refs[tempform].resetFields();
                        this.exeTask(response);
                     });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        exeTask(response){
            if(response.status == 201) {
                if(this.status == 'speed'){
                    CountFansGroup(response.data,this.account);
                    this.$message({
                        message: "保存成功！标签组计算中...",
                        type: 'success'
                    })

                } else {
                    this.$message({
                        message: "创建成功",
                        type: 'success'
                    })
                    this.$router.push({ name: '标签组'});
                }

            }

        },
        /**
         *  修改标签
         */
        modify(tempform) {
            this.$refs[tempform].validate((valid) => {
                if (valid) {
                    //ModifyAgencyData
                    if(this.fansGroupData.isMaster) {
                        ModifyManufacturerData(this.fansGroupData)
                            .then((response) => {
                            if(response.status == 200) {
                                this.$message({
                                    message: "修改成功",
                                    type: 'success'
                                })
                            }
                        })
                    } else {
                        ModifyAgencyData(this.fansGroupData)
                            .then((response) => {
                            if(response.status == 200) {
                                this.$message({
                                    message: "修改成功",
                                    type: 'success'
                                })
                            }
                        })
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleDelChooseTags : function(index,row) {
            this.chooseTags.splice(this.chooseTags.indexOf(row),1);
        },
        handleDelExcludeTags : function(index,row) {
            this.excludeTags.splice(this.excludeTags.indexOf(row),1);
        },
        clearChooseTags: function() {
            this.chooseTags = [];
        },
        clearExcludeTags: function() {
            this.excludeTags = [];
        },
        showChooseTree: function() {
            this.chooseTreeVisible = true;
            this.setChooseTreeCheckedNodes();
        },
        showExcludeTree: function() {
            this.excludeTreeVisible = true;
            this.setExcludeTreeCheckedNodes();
        },
        closeChooseTree: function() {
            this.chooseTreeVisible = false;
        },
        closeExcludeTree: function() {
            this.excludeTreeVisible = false;
        },
        cancelChooseTree: function() {
            this.chooseTreeVisible = false;
        },
        cancelExcludeTree: function() {
            this.excludeTreeVisible = false;
        },
        getChooseTreeCheckedNodes: function() {
            this.chooseTreeVisible = false;
            if(this.$refs.chooseTree)  {
                let data = this.$refs.chooseTree.getCheckedNodes();
                let result = [];
                for(let i in data) {
                    for(let index in this.excludeTags){
                        if(this.excludeTags[index].name == data[i].name) {
                            this.$message({
                                message: "标签条件叠加与排除标签不能相互包含",
                                type: 'error'
                            })
                            return
                        }
                    }
                    if(data[i].format == '文本') {
                        result.push(data[i]);
                    }
                }
                this.chooseTags = this.handleDataSort(this.chooseTags,result);
            }
        },
        getExcludeTreeCheckedNodes: function() {
            this.excludeTreeVisible = false;
            if(this.$refs.exculdeTree) {
                let data = this.$refs.exculdeTree.getCheckedNodes();
                let result = [];
                for(let i in data) {
                    for(let index in this.chooseTags){
                        if(this.chooseTags[index].name == data[i].name) {
                            this.$message({
                                message: "标签条件叠加与排除标签不能相互包含",
                                type: 'error'
                            })
                            return
                        }
                    }
                    if(data[i].format == '文本') {
                        result.push(data[i]);
                    }
                }
                this.excludeTags = this.handleDataSort(this.excludeTags,result);
            }
        },
        handleDataSort: function(tagsdata,adddata) {
            // 将旧节点数据先放入数组
            let result = [];
            let flag = true;
            for(let i in tagsdata) {
                flag = false;
                for(let j in adddata) {
                    if(tagsdata[i].id ==  adddata[j].id) {
                        flag = true;
                        break;
                    }
                }
                if(flag) {
                    result.push(tagsdata[i]);
                }
            }
            // 在放入新节点数据
            let newdata = [];
            for(let i in adddata) {
                flag = true;
                for(let j in result) {
                    if(adddata[i].id ==  result[j].id) {
                        flag = false;
                        break;
                    }
                }
                if(flag) {
                    newdata.push(adddata[i]);
                }
            }
            for(let i in newdata) {
                result.push(newdata[i]);
            }
            return result;
        },
        setChooseTreeCheckedNodes: function() {
            if(this.$refs.chooseTree) {
                this.$refs.chooseTree.setCheckedNodes(this.chooseTags);
            }
        },
        setExcludeTreeCheckedNodes: function() {
            if(this.$refs.exculdeTree) {
                this.$refs.exculdeTree.setCheckedNodes(this.excludeTags);
            }
        },
        resetChooseTreeChecked: function() {
            if(this.$refs.chooseTree) {
                this.$refs.chooseTree.setCheckedKeys([]);
            }
        },
        resetExcludeTreeChecked: function() {
            if(this.$refs.exculdeTree) {
                this.$refs.exculdeTree.setCheckedKeys([]);
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        getTreeData: function () {
            GetTreeData().then((response) => {
                this.chooseTreeData = this.treeAppendRelation(response.data);
                this.exculdeTreeData = $.extend([],this.chooseTreeData);
            })
        },
        save: function (tempform) {
            let jsonString = '';
            let data = [];
            this.handleChooseTags(this.chooseTags,jsonString);
            this.handleExculdeTags(this.excludeTags,jsonString);
            data = this.handleChooseTags(this.chooseTags,jsonString);
            this.fansGroupData.chooseTags = data[0];
            data = this.handleExculdeTags(this.excludeTags,data[1]);
            this.fansGroupData.excludeTags =data[0];
            this.fansGroupData.jsonString = data[1];
            if(this.fansGroupData.chooseTags == "") {
                this.$message({
                    message: "标签条件叠加不能为空",
                    type: 'error'
                })
                return
            }
            if(this.id == 'add') {
                this.create(tempform);
            } else {
                this.modify(tempform);
            }
        },
        handleChooseTags: function(tags,jsonString){
            jsonString = "{chooseTagsIds:'";
            let value = "";
            let result = "";
            let data = [];
            for(let i in tags) {
                if(i == 0) {
                    value =  tags[i].id;
                    result = tags[i].name + ',' + tags[i].relation;
                } else {
                    value =  value + ',' + tags[i].id;
                    result = result + ',' + tags[i].name + ',' + tags[i].relation;
                }
            }
            jsonString = jsonString + value + "'";
            data.push(result);
            data.push(jsonString);
            return data;
        },
        handleExculdeTags : function(tags, jsonString) {
            let data = [];
            jsonString = jsonString + ',' + "excludeTagsIds:'";
            let value = "";
            let result = "";
            for(let i in tags) {
                if(i == 0) {
                    value =  tags[i].id;
                    result = tags[i].name;
                } else {
                    value =  value + ',' + tags[i].id;
                    result = result + ',' + tags[i].name;
                }
            }
            jsonString = jsonString + value + "'}";
            data.push(result);
            data.push(jsonString);
            return data;
        },
        treeAppendRelation: function(treeData) {
            let data = $.extend([],treeData);
            for(var i in  data) {
                this.appendRelation(data[i]);
            }
            console.log(data);
            return data;
        },
        appendRelation: function(item) {
            if(item.childTags) {
                for(var i in  item.childTags) {
                    this.appendRelation(item.childTags[i]);
                }
            } else {
                item.relation = 'and';
            }
        },
        handleJsonString: function() {
            let json = eval('('+this.fansGroupData.jsonString+')');
            let chooseIds = json['chooseTagsIds'];
            let excudleIds = json['excludeTagsIds'];
            let data = [];
            if(chooseIds) {
                let choose = chooseIds.split(',');
                let choosetag = this.fansGroupData.chooseTags.split(',');
                for(let i in choose) {
                    let item = {};
                    item.id = choose[i];
                    item.name = choosetag[2 * i];
                    item.relation = choosetag[2 * i + 1];
                    data.push(item);
                    this.chooseChecked.push(choose[i]);
                }
                this.chooseTags = data;
            }
            data = [];
            if(excudleIds) {
                let excudle = excudleIds.split(',');
                let excudletag = this.fansGroupData.excludeTags.split(',');
                for(let i in excudle) {
                    let item = {};
                    item.id = excudle[i];
                    item.name = excudletag[i];
                    data.push(item);
                    this.exculdeChecked.push(excudle[i]);
                }
                this.excludeTags = data;
            }
        },
        goBackFansGroup: function(){
            if(this.status == "speed"){
                this.$router.push({name: '图文群发'});
            }else{
                this.$router.push({name: '标签组'});
            }

        },
        showCheckbox: function(data, node){
            return false;
        }
    },
    data() {
        return {
            chooseTreeData:[],
            exculdeTreeData:[],
            defaultProps: {
                children: 'childTags',
                label: 'name',
                disabled: function(data,node){
                        let nowDate = new Date(moment(new Date()).format("YYYY-MM-DD"));
                        let validateEnd1 = new Date(moment(data.validateEnd).format("YYYY-MM-DD"));
                        let validateStart1 = new Date(moment(data.validateStart).format("YYYY-MM-DD"));
                        let flag = nowDate < validateStart1 || nowDate > validateEnd1;
                        return ((data.format =="文本" && data.state == "OFF") || flag);
                }
            },
            filterChooseText: '',
            filterExculdeText :'',
            id: this.$route.params.id,
            isMaster: this.$route.params.isMaster,
            auth:this.$route.params.auth,
            fansGroupStateOptions,
            runCycleOptions,
            fansGroupData: fansGroupInit(),
            account: localStorage.getItem("aid"),
            chooseTreeVisible: false,
            excludeTreeVisible: false,
            chooseTags: [],
            excludeTags: [],
            chooseChecked:[],
            exculdeChecked:[],
            rules: {
                name: [
                    {required: true, message: '请输入名称'},
                    {max:50, message:"最多输入50个字符", trigger:'blur'}
                ]
            },
            status:this.$route.params.status
        };
    }
};

function fansGroupInit() {
    return {
        "account": localStorage.getItem("aid"),
        "chooseTags": "",
        "createIndex": 0,
        "createTime": "",
        "createTimeEnd": "",
        "createUser": "",
        "excludeTags": "",
        "fansInGroupNum": "",
        "fansNum": "",
        "id": "",
        "jsonString": "",
        "name": "",
        "runCycle": "Day",
        "sqlStr": "",
        "state": "ON",
        "system": false,
        "updateTime": "",
        "updateUser": ""
    }
}