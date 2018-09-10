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
 * 创建日期：2018-4-8
 * </pre>
 */
import {

} from "./api/UserMessageApi";
import EXIF from "../../utils/exif";
import {Message} from "element-ui";
import {GetResourceTree} from "../humanAudit/api/humanAuditApi";
import {GetList} from '../Resource/api/ResourceApi';

export default {
    created() {
        this.getResourceTree();
        this.getList(this.pageParam);
      /*  this.getListTypeInfo(this.pageParam);*/
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    data() {
        return {
            filterText: '',
            tableData: [],
            treeData: [],
            tableDataSence: [],
            tableDataAddSence: [],
            selectionDataResource: [],
            dialogResourceDetail: false,
            dialogAddData: false,
            tableDataDetail: [],
            tableDataAdd: [],
            rowTotal: 10,
            textMap: {
                create: '新增',
                editor: "编辑"
            },
            enabledFlags: {
                "1": '启用',
                "0": "停用"
            },
            searchFormVisible: false,
            onXHR: false,
            dialogFormVisible: false,
            dialogStatus: 'create',
            isCode: false,
            dialogFormUsers: false,
            temp: tempInit(),
            resourceId: '',
            rules: {


                name:
                    [

                        {required: true, max: 128, message: '资源名称不得超过128个字符'}],
                code:
                    [

                        {required: true, max: 128, message: '资源编码不得超过128个字符'}],
                resourceTypeId:
                    [
                        {required: true, message: '请输入资源类型id', trigger: 'blur'},
                    ],
                /*city:
                    [{required: true, message: '请输入城市', trigger: 'blur'}],*/
                telephone:
                    [{required: true, message: '请输入社区电话', trigger: 'blur'}],
                address:
                    [{
                        required: true, message: '请输入社区地址', trigger: 'blur'
                    }]


            },
            pageParam: pageParamInit(),
            resourceType: resourceType(),
            formVisible: false,
            dialogSceneDetail: false,
            dialogAddHumanSenctData: false,
            errorTip: "",
            errorLine: 5,
            options: [],
            optionsType: [],
            resourceSelective: resourceSelective(),
            imageUrlFlag: false,
            imageUrl: '',
            action: "",
            upLoadData: {
                id: '',
                baseStr: ''
            },
            props: {
                children: 'children',
                id: 'id',
                label: 'label',
                // isLeaf: 'isLeaf'
            },
            selectedResource: {},
            provinceList:[],
            pInfo:{},
            cityList:[],
            cInfo:{},
            allCityList:[],
        }
    },
    components: {
        //etc...
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //显示资源组
        getList(pageParam) {
            var storage = window.localStorage;
            this.pageParam.sysId = storage.getItem("sysId");
            GetList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response && response.data) {
                        this.rowTotal = response.data.rowTotal;
                        this.tableData = response.data.rows;
                    }
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
        handleSelectionChangeRSR(selection) {
            this.selectionDataRSR = selection
        },
        getResourceTree() {
            GetResourceTree()
                .then((response) => {
                    this.treeData = response.data;
                });

        },
        nodeClick(data, node, object) {
            console.log(data);
            this.selectedResource = data;
            this.pageParam.resourceId = data.id;
            this.getList(this.pageParam);
        },
        closeDetailForm() {
            this.temp = tempInit();
            this.tableDataSence = [];
            this.tableDataDetail = [];
            this.tableDataAddSence = [];
            this.dialogSceneDetail = false;
            this.dialogAddData = false;
            this.dialogResourceDetail = false;
            this.dialogAddHumanSenctData = false;
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
            this.getList(this.pageParam)
            this.$refs.pages.changePage(1)
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
        closeForm() {
            this.formVisible = false;
        },


    }
}

function tempInit() {
    return {
        resourceTypeId: '',
        name: '',
        code: '',
        parentId: '',
        left: '',
        right: '',
        lvl: '',
        remark: '',
        resourceId2: '',
        resourceId: '',
        sys: '',
        city: '',
        fullPinYin: '',
        longitude: '',
        latitude: '',
        telephone: '',
        address: '',
        upLoadData: {
            id: '',
            base64: ''
        },
        communityPhoto: '',
        imageUrl: '',
        imageUrlFlag: false,
        provinceId:'',
    }
}

function pageParamInit() {
    return {
        page: 1,
        size: 10,
        rowTotal: 0,
        resourceTypeId: '',
        resourceId: '',
        name: '',
        code: '',
        parentId: '',
        left: '',
        right: '',
        lvl: '',
        remark: '',
        sysId: ''
    }
}

function resourceType() {
    return {
        sysId: ''
    }
}

function resourceSelective() {
    return {
        sysId: '',
        resourceTypeId: ''
    }
}

