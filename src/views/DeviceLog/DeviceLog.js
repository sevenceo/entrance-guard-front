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
 * 创建日期：2018-7-7
 * </pre>
 */
import {GetList,GetResourceTree,GetSceneList} from "./api/DeviceLogApi";
import EXIF from "../../utils/exif";
import store from '../../store';

export default {
    watch: {
        filterText(val) {
            this.$refs.tenantTree.filter(val);
        }
    },
    created() {
        this.getList(this.pageParam);
        this.getResourceTree();
    },
    data() {
        return {
            tableData: [],
            filterText: '',
            rowTotal: 10,
            searchFormVisible: false,
            onXHR: false,
            pageParam: pageParamInit(),
            value1:'',
            value2:'',
            pickerOptions0: {
                disabledDate: (time) => {
                    return time.getTime() > Date.now();

                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() > Date.now();
                }
            },
            treeData:[],
            resourceName:'',
            sceneList:[],
            parentTree:false,
            props: {
                children: 'child',
                id: 'id',
                label: 'text',
                // isLeaf: 'isLeaf'
            },

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
        onSearch() {
            this.searchFormVisible = true;
            console.log(this)
        },
        search() {
            if (this.pageParam.page == 1){
                this.getList(this.pageParam)
            }else{
                this.$refs.pages.changePage(1)
            }
            // this.pageParam.page = 1;
            // this.handleCurrentChange1(1)
            this.searchFormVisible = false;
        },
        reset() {
            this.value1 = '';
            this.value2 = '';
            this.pageParam = pageParamInit();
            this.resourceName = '';
        },
        closeForm() {
            this.formVisible = false;
        },
        detail(row) {
            this.compareFaceJson = true;
            this.jsonData = JSON.parse(row.compareJson);
            /*  this.compareJson.push(this.jsonData);
              console.log(this.jsonData);*/
        },
        closeCompareFaceJson(){
            this.compareFaceJson = false;
            /* this.compareJson = [];
             this.jsonData = '';*/
        },
        setBeginDate(val){
            if (val != undefined){
                this.pageParam.beginTime = val
            }
        },
        setEndDate(val) {
            if (val != undefined){
                var start=new Date(this.pageParam.beginTime);
                var end=new Date(val);
                if (start>=end) {
                    this.$message({
                        message: "结束时间必须大于开始时间",
                        type: 'error'
                    })
                    this.value2 ='';
                    return
                }else{
                    this.pageParam.endTime = val;
                }
            }
        },
        getResourceTree(){
            GetResourceTree().then((result) =>{
                this.treeData = result.data;
            })
        },
        showParentTree(){
            this.parentTree = true;
            this.pageParam.sceneId = ''
        },
        //添加界面的树
        loadTreeNode() {
            /* GetResourceTree()
                 .then((response) => {
                     this.treeData = response.data;
                 });*/
        },
        nodeClick(data, node, object){
            // this.selectedCommunity = data;
            //this.pageParam.operator = data.id;
            this.pageParam.sceneId = '';
            this.resourceName = data.text;
            this.parentTree = false;
            if (data.children){
                GetSceneList(data.id,'org').then((result)=>{
                    this.sceneList = result.data;
                    this.pageParam.corpId = '';
                    this.pageParam.orgId = data.id;
                })
            }else{
                GetSceneList(data.id,'corp').then((result)=>{
                    this.sceneList = result.data;
                    this.pageParam.orgId = '';
                    this.pageParam.corpId = data.id;
                })
            }



        },
        filterTenantNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
    }
}

function pageParamInit() {
    return {
        page: 1,
        pageSize: 10,
        rowTotal: 0,
        beginTime:'',
        endTime:'',
        orgId:'',
        corpId:'',
        sceneId:''
    }
}

