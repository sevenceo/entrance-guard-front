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
    AddResourceOrganization,
    BatchDelete,
    BatchStatus,
    Create,
    Delete,
    DetailDeleteResourceSceneRef,
    DownloadTemplate,
    Editor,
    GetByIdSenceList,
    GetCode,
    GetCurrentListType,
    GetList,
    GetListSelective,
    GetOrganizationByResourceId,
    GetOrganizations,
    GetResource,
    ResourceSceneInsertBatch,
    Status,
    GetProvinceList,
    GetCityListByProvinceId,
    GetAllCityList,
    GetResourceType,
    GetRootTree,
    GetLeafTree,
    IsOrg,
    TreeSearchFunction,
    GetResultFromAttendance,
    DeleteFromAttendance,
    GetNextResource
} from "./api/resourceApi";
import EXIF from "../../utils/exif";
import {Message} from "element-ui";
import {GetResourceTree} from "../humanAudit/api/humanAuditApi";
import store from "../../store";
import Vue from 'vue'

Vue.component('my-item-zh', {
    functional: true,
    render: function (h, ctx) {
        var item = ctx.props.item;
        return h('li', ctx.data, [
            h('div', { attrs: { class: 'name',title:item.value } }, [item.value]),
        ]);
    },
    props: {
        item: { type: Object, required: true }
    }
});
export default {
    created() {
        this.getList(this.pageParam);
        this.getListTypeInfo(this.pageParam);
        this.initTree();
        this.getAllProvince();
        this.organizationsInit();
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
                editor: "编辑",
                detail: "查看详情",
            },
            enabledFlags: {
                "1": '启用',
                "0": "停用"
            },
            searchFormVisible: false,
            dialogImportVisible: false,
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
                parentId:
                    [{required: true, message: '请选择上级资源', trigger: 'blur'}],
                orgId:
                    [{required: true, message: '请选择关联资源', trigger: 'blur'}],
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
            provinceList: [],
            pInfo: {},
            cityList: [],
            cInfo: {},
            allCityList: [],
            resourceTypeLvl: '0',
            optionSelects: [],
            orgSelects: [],
            addResourceTypeId: '',
            lastCity: '',
            props1: {
                label: 'label',
                id: 'id',
                isLeaf: 'leaf',
                children: 'children',
            },
            rootData: [],
            leafData: [],
            rootTreeData: [],
            node: {},
            resolve: {},
            isOrg: 0,
            importResult: '',
            dialogFileImport: false,
            excel_loading: false,
            dialogImportFail: false,
            dataImportFail: [],
            importType: '1',
            importTypes: [{id: '1', name: '社区类型资源导入'}, {id: '2', name: '企业类型资源导入'}],
            treeSearch: '',
            treeSearchFlag: false,
            lastPoint:{},
        }
    },
    components: {
        //etc...
    },
    methods: {
        treeSearchClick() {
            let param = {
                name: this.treeSearch
            }
            TreeSearchFunction(param).then((response) => {
                if (response.code == 1) {
                    this.initTree();
                    this.treeSearchFlag = false;

                }
                if (response.code == 0) {
                    this.treeSearchFlag = true;
                    setTimeout(() => {
                        this.treeData = response.data;
                    }, 100);

                    // this.initTree();


                }
            })
        },
        importTemp() {
            this.dialogImportVisible = true;
        },
        closeImportFile() {
            this.dialogImportVisible = false;
        },
        download() {
            if (this.importType == '1') {
                location.href = '/template/社区资源导入模板.xlsx';
            } else {
                location.href = '/template/企业资源导入模板.xlsx';
            }

        },
        importFile() {
            this.dialogFileImport = true;
        },
        closeDetailImportForm() {
            this.dialogFileImport = false;
        },

        importExcel() {
            if (this.importType == '1') {
                return '/dealer/resource/importResourceFile'
            } else {
                return '/dealer/resource/importCropResourceFile'
            }
        },
        changeImportType() {
            this.importExcel();
        },
        handleImportSuccess(response) {
            this.dataImportFail = [];
            this.excel_loading = false;
            this.dataImportFail.push({msg: response.msg});
            if (response.code == 0) {
                this.$message({
                    message: "批量导入成功！",
                    type: 'success'
                })
            } else {
                this.dialogImportFail = true;
            }
            this.getList(this.pageParam);
            this.initTree();

        },

        closeBatchImportPane() {
            this.dialogImportFail = false;
        },
        beforeExcelUpload(file) {
            console.log("上传Excel");
            const h = this.$createElement;
            // const extension1 = file.name.split('.')[1].toLowerCase() === 'xls';
            const extension1 = file.name.split('.')[1].toLowerCase() === 'xlsx';
            if (!extension1) {
                console.log('只能导入Excel文件!')
                this.$message({
                    message: "请上传与模板文件格式一致的文件!",
                    type: 'error'
                })
            } else {
                this.excel_loading = true;
            }
            return extension1;
        },

        isCropInit() {
            IsOrg().then((response) => {
                this.isOrg = response.data;
            });

        },
        loadNode1(node, resolve) {
            this.node = node;
            this.resolve = resolve;

            if (node.level === 0) {
                // GetRootTree().then((response) => {
                //     return resolve(response.data);
                // });


            }
            if (node.level >= 1) {
                let param={'parentId':node.data.id}
                this.getLeafTree(param, resolve);
            }
            ;


        },
        initTree() {
            var param = {};
            GetRootTree(param).then((response) => {
                this.rootTreeData = response.data;
            });
        },

        getLeafTree(param, resolve) {
            GetLeafTree(param).then((response) => {
                resolve(response.data);
            })
        },

        createMap() {
            let that = this;
            // 百度地图API功能
            var map = new BMap.Map("allmap");
            var point = new BMap.Point(116.331398, 39.897445);
            map.centerAndZoom(point, 12);

            function myFun(result) {
                var cityName = result.name;
                map.setCenter(cityName);
                // alert("当前定位城市:"+cityName);
            }

            var myCity = new BMap.LocalCity();
            myCity.get(myFun);
            map.enableScrollWheelZoom(true);

            function showInfo(e) {
                that.temp.longitude = e.point.lng;
                that.temp.latitude = e.point.lat;
                map.clearOverlays();
                var point1 = new BMap.Point(e.point.lng, e.point.lat);
                var marker = new BMap.Marker(point1);
                map.addOverlay(marker);
                // $(".longitude").val(this.longitude);
                // $(".latitude").val(this.latitude);
            }

            map.addEventListener("click", showInfo);
        },
        selectCity() {
            let that = this;
            var map = new BMap.Map("allmap");
            var myGeo = new BMap.Geocoder();
            var city = '';
            for (let i = 0; i < this.cityList.length; i++) {
                if (this.temp.city == this.cityList[i].id) {
                    city = this.cityList[i].name;
                }
            }
            // var city = document.getElementById("cityName").value;
            if (city != "") {
                map.centerAndZoom(city, 11);
                this.lastCity = city;
                myGeo.getPoint(city + this.temp.name, function (point) {
                    if (point) {
                        map.centerAndZoom(point, 16);
                        that.temp.longitude = point.lng;
                        that.temp.latitude = point.lat;
                        map.addOverlay(new BMap.Marker(point));
                    } else {
                        map.centerAndZoom(city, 11);
                    }
                }, city);
            } else {
                map.centerAndZoom(this.lastCity, 11);
            }
            // else{
            //     function myFun(result) {
            //         var cityName = result.name;
            //         map.setCenter(cityName);
            //         // alert("当前定位城市:"+cityName);
            //     }
            //
            //     var myCity = new BMap.LocalCity();
            //     myCity.get(myFun);
            // }
            map.enableScrollWheelZoom(true);

            function showInfo(e) {
                that.temp.longitude = e.point.lng;
                that.temp.latitude = e.point.lat;
                map.clearOverlays();
                var point1 = new BMap.Point(e.point.lng, e.point.lat);
                var marker = new BMap.Marker(point1);
                map.addOverlay(marker);

            }

            map.addEventListener("click", showInfo);
        },
        organizationsInit() {
            GetOrganizations()
                .then((response) => {
                    this.orgSelects = response.data.addOrganizations;
                });
        },
        querySearch(queryString, cb) {
            var restaurants = this.optionSelects;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearchOrg(queryString, orgcb) {
            var orgs =[];
            for(let i=0;i<this.orgSelects.length;i++){
                let obj={
                    id:this.orgSelects[i].orgId,
                    value:this.orgSelects[i].orgName,
                }
                orgs.push(obj);
            }
            var results = queryString ? orgs.filter(this.createOrgFilter(queryString)) : orgs;
            // 调用 callback 返回建议列表的数据
            orgcb(results);
        },
        createOrgFilter(queryString) {
            return (org) => {
                return (org.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        // loadAll() {
        //     return this.options;
        // },
        handleSelect(item) {
            console.log(item);
            GetOrganizationByResourceId(item.id).then((response) => {
                this.temp.parentId = item.id;
                this.temp.orgId = response.data.orgId;
                this.temp.orgName = response.data.orgName;

            })

        },
        handleSelectOrg(item) {
            console.log(item);
            this.temp.orgId = item.id;
        },

        getAllProvince() {
            GetProvinceList(1).then((resp) => {
                const obj = {};
                this.provinceList = resp.data;
                if (resp.data != null && resp.data.length > 0) {
                    for (let i = 0; i < resp.data.length; i++) {
                        obj[resp.data[i]['id']] = resp.data[i]['name'];
                    }
                }
                this.pInfo = obj;
            });
        },
        getAllCity() {
            GetAllCityList().then((resp) => {
                this.allCityList = resp.data;
            });
        },
        getCityListByProvinceId(provinceId, city) {
            if (provinceId != null && this.provinceList.length > 0) {
                if (this.pInfo[provinceId] != null && this.pInfo[provinceId] != undefined && this.pInfo[provinceId].length > 0) {
                    GetCityListByProvinceId(provinceId).then((resp) => {
                        if (resp.data != null && resp.data.length > 0) {
                            this.cityList = resp.data;
                            if (this.cityList != null && this.cityList.length > 0) {
                                for (let i = 0; i < this.cityList.length; i++) {
                                    if (this.cityList[i].id == city) {
                                        this.temp.city = city;
                                        break;
                                    } else {
                                        this.temp.city = "";
                                    }
                                }
                            } else {
                                this.cityList = [];
                                this.temp.city = "";
                            }
                        } else {
                            this.cityList = [];
                            this.temp.city = "";
                        }
                    });
                } else {
                    this.temp.provinceId = "";
                }

            } else {
                this.cityList = [];
                this.temp.city = "";
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //显示资源组
        getList(pageParam) {
            var storage = window.localStorage;
            this.pageParam.sysId = storage.getItem("sysId");
            IsOrg().then((resp) => {
                this.isOrg = resp.data;
                GetList(pageParam)
                    .then((response) => {
                        console.log(response);
                        if (response && response.data) {
                            this.rowTotal = response.data.rowTotal;
                            this.tableData = response.data.rows;
                        }
                    })
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
        getListInfo(pageParam) {
            /*GetListInfo(pageParam).then((response) => {
                this.options = response.data;
            })*/
        },
        getListTypeInfo(pageParam) {
            /*GetListTypeInfo(pageParam).then((response) => {
                this.optionsType = response.data;
            })*/
            var storage = window.localStorage;
            this.resourceType.sysId = storage.getItem("sysId");
            GetCurrentListType(this.resourceType).then(response => {
                this.optionsType = response.data;
            })
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

        /*******************************查看场景 关联场景*********************************************************/
        onSenceDetail() {
            if (this.selectedResource.id == undefined || this.selectedResource.id == '') {
                this.$message({
                    message: "请选择一条资源数据",
                    type: 'error'
                })
                return;
            }
            let id = this.selectedResource.id;
            GetResource(id).then((response) => {
                this.temp = $.extend(tempInit(), response.data);
                this.pageParam.resourceId2 = '';
                this.pageParam.resourceId = id;
                this.pageParam.type = "1";
                this.getByIdSenceList(this.pageParam)
                /*弹框查看组成员显示*/
                this.dialogSceneDetail = true;
            });
        },
        getByIdSenceList(pageParam) {
            GetByIdSenceList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataSence = response.data;
                    } else {
                        this.tableDataSence = [];
                    }

                })
        },
        // 删除场景
        onSenceDelete(row) {
            let obj = {};
            obj['resourceId'] = this.pageParam.resourceId;
            obj['sceneId'] = row.id;
            console.log(obj);

            this.ConfirmBox('是否确认删除')
                .then(() => {
                    DetailDeleteResourceSceneRef(obj).then(() => {
                        this.getByIdSenceList(this.pageParam);
                    })
                })

        },
        /*添加场景*/
        addSence() {
            if (this.selectedResource.id == undefined || this.selectedResource.id == '') {
                this.$message({
                    message: "请选择一条资源数据",
                    type: 'error'
                })
                return;
            }
            let id = this.selectedResource.id;
            GetResource(id).then((response) => {
                this.temp = $.extend(tempInit(), response.data);
                this.pageParam.resourceId = '',
                    this.pageParam.resourceId2 = id;
                this.pageParam.type = "1";
                this.addByIdSenceList(this.pageParam)
                /*弹框是否显示*/
                this.dialogAddHumanSenctData = true;
            });
        },
        addByIdSenceList(pageParam) {
            GetByIdSenceList(pageParam)
                .then((response) => {
                    console.log(response);
                    if (response.data != null) {
                        this.rowTotal = response.data;
                        this.tableDataAddSence = response.data;
                    } else {
                        this.tableDataAddSence = [];
                    }

                })
        },
        onBatchAddSenece() {
            if (this.selectionDataRSR == undefined || this.selectionDataRSR.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }

            var param = [];
            var resourceId = this.pageParam.resourceId2;
            var ids = this.selectionDataRSR.map(item =>
                item.id
            )//获取所有选中行的id组成的数组，以逗号分隔
            console.log(ids);
            for (var i = 0; i < ids.length; i++) {
                param.push({
                    resourceId: resourceId,
                    sceneId: ids[i]
                })
            }
            this.ConfirmBox('是否确认关联场景？')
                .then(() => {
                    ResourceSceneInsertBatch(param)
                        .then(() => {
                            this.addByIdSenceList(this.pageParam);
                        })
                })
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
        /*******************************END 查看场景 关联场景*********************************************************/
        onAdd() {
            this.temp = tempInit();
            // this.getListInfo(this.pageParam);
            // this.getListTypeInfo(this.pageParam);
            GetCode().then((response) => {
                this.temp.code = response.data;
                console.log(response.data);
            });
            /*
            * Other init data
            *
            * */
            if (this.selectedResource.id != undefined && this.selectedResource.id != '') {
                GetNextResource(this.selectedResource.id).then((response) => {

                    this.temp.resourceTypeId = response.data.nextResourceType;
                    this.addResourceTypeId = response.data.nextResourceType;
                    this.temp.parentId = response.data.parentId;
                    this.temp.parentName = response.data.parentName;
                    GetOrganizationByResourceId(this.selectedResource.id).then((resp) => {
                        this.temp.orgId = resp.data.orgId;
                        this.temp.orgName = resp.data.orgName;
                    });

                });
            }


            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
            this.isCode = false;

        },
        onDetail(temp) {
            let id;
            if (temp != undefined) {
                id = temp.id;
            } else {
                if (this.selectedResource.id == undefined || this.selectedResource.id == '') {
                    this.$message({
                        message: "请选择一条资源数据",
                        type: 'error'
                    })
                    return;
                }
                id = this.selectedResource.id;
            }

            GetResource(id).then((response) => {
                GetOrganizationByResourceId(id).then((resp) => {
                    this.temp = response.data;
                    if (resp.data != null) {
                        this.temp.orgName = resp.data.orgName;
                    }
                    this.getCityListByProvinceId(response.data.provinceId, response.data.city)
                    this.temp = $.extend(tempInit(), response.data);
                    if (this.temp.communityPhoto != null && this.temp.communityPhoto != '') {
                        this.imageUrl = this.temp.communityPhoto;
                        this.temp.imageUrlFlag = true;
                    }
                    console.log(this.temp);
                    this.temp.resourceTypeId = this.temp.resourceTypeId + "";
                    if (this.temp.resourceTypeId == 1) {
                        this.temp.resourceTypeId = '社区';
                    }
                    if (this.temp.resourceTypeId == 5) {
                        this.temp.resourceTypeId = '写字楼';
                    }
                    console.log(this.optionsType);
                    this.pageParam.id = this.temp.id;
                    this.getListInfo(this.pageParam);
                    this.getListTypeInfo(this.pageParam);
                    /*
                    * Other init data
                    *
                    * */
                    if (this.temp.parentId === "0") {
                        this.temp.parentId = '';
                    }

                    this.dialogFormVisible = true;
                    this.dialogStatus = 'detail';
                    this.isCode = true;


                    for (let j = 0; j < this.allCityList.length; j++) {
                        if (this.temp.city == this.allCityList[j].id) {
                            this.temp.provinceId = this.allCityList[j].provinceId;
                            break;
                        }
                    }
                });
            })


        },
        onEdit(temp) {
            this.dialogStatus = 'editor';
            this.getAllCity();
            let id;
            if (temp != undefined) {
                id = temp.id;
            } else {
                if (this.selectedResource.id == undefined || this.selectedResource.id == '') {
                    this.$message({
                        message: "请选择一条资源数据",
                        type: 'error'
                    })
                    return;
                }
                id = this.selectedResource.id;
            }
            GetResource(id).then((response) => {
                GetOrganizationByResourceId(id).then((resp) => {
                    this.resourceTypeLvl = response.data.level + '';
                    this.getCityListByProvinceId(response.data.provinceId, response.data.city)
                    if (response.data.level == 0 && response.data.isCorp == 0) {
                        this.$message({
                            message: "只有企业用户才能修改社区类型资源",
                            type: 'error'
                        })
                        return;
                    }
                    this.temp = $.extend(tempInit(), response.data);
                    if (resp.data != null) {
                        this.temp.orgName = resp.data.orgName;
                        this.temp.orgId = resp.data.orgId;
                    }
                    this.resourceType.resourceTypeId = this.temp.resourceTypeId;
                    GetListSelective(this.resourceType).then((response) => {
                        this.options = response.data;
                        this.optionSelects = [];
                        for (let i = 0; i < this.options.length; i++) {
                            let obj = {
                                id: this.options[i].id,
                                value: this.options[i].name
                            }
                            this.optionSelects.push(obj);
                        }
                        if (this.temp.communityPhoto != null && this.temp.communityPhoto != '') {
                            this.imageUrl = this.temp.communityPhoto;
                            this.temp.imageUrlFlag = true;
                        }
                        console.log(this.temp);
                        this.pageParam.id = this.temp.id;
                        this.temp.resourceTypeId = this.temp.resourceTypeId + "";
                        this.getListInfo(this.pageParam);
                        this.getListTypeInfo(this.pageParam);
                        /*
                        * Other init data
                        *
                        * */
                        if (this.temp.parentId === "0") {
                            this.temp.parentId = '';
                        }

                        this.dialogFormVisible = true;
                        this.dialogStatus = 'editor';
                        this.isCode = true;
                        if (response.data.level == 0) {
                            setTimeout(() => {
                                this.createMap()
                            }, 1000);
                        }

                        /*for(let j = 0; j <this.allCityList.length; j++) {
                            if(this.temp.city == this.allCityList[j].id){
                                this.temp.provinceId = this.allCityList[j].provinceId;
                                break;
                            }
                        }*/
                        // debugger;
                    })


                });
            });

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

        create() {
            // if(this.temp.resourceTypeId != '1' && this.temp.resourceTypeId != '5'){
            //     if(this.temp.parentId == null || this.temp.parentId == ''){
            //         this.$message({
            //             message: "请选择上级资源",
            //             type: 'error'
            //         });
            //         return ;
            //     }
            // }
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.onXHR = true;
                    var storage = window.localStorage;
                    this.temp.sysId = storage.getItem("sysId");
                    this.temp.baseStr = this.upLoadData.baseStr;
                    Create(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                            this.initTree();
                        })
                } else {
                    return false;
                }
            })
            ;

        },
        update(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.temp.enable) {
                        this.temp.enable = 'true'
                    } else {
                        this.temp.enable = 'false'
                    }
                    this.temp.baseStr = this.upLoadData.baseStr;
                    Editor(this.temp)
                        .then(() => {
                            this.dialogFormVisible = false;
                            this.dialogStatus = 'create';
                            this.getList(this.pageParam);
                            this.temp = tempInit();
                            this.getResourceTree();
                            // this.loadNode1(this.node,this.resolve);
                            this.initTree();
                        })
                    ;
                } else {
                    return false;
                }
            })
            ;

        },
        onDelete(temp) {
            let id = temp.id;
            let ids = [];
            ids.push(id);
            GetResource(id).then((response) => {
                if (response.data.level == 0 && response.data.isCorp == 0) {
                    this.$message({
                        message: "只有企业用户才能修改社区类型资源",
                        type: 'error'
                    })
                    return;
                }
                let message = '是否确认删除？'
                if (temp.level == 0) {
                    this.judgeFromAttendance(ids).then((resp) => {
                        if (resp.data != undefined && resp.data.length != 0) {
                            message = '当前资源下存在考勤组，是否确认删除？'
                        }
                        this.ConfirmBox(message)
                            .then(() => {
                                Delete(id)
                                    .then((response) => {
                                        if (response.code == 0) {
                                            Message({
                                                message: '删除资源成功',
                                                type: 'success',
                                                customClass: 'msg-success',
                                                iconClass: 'ic'
                                            })
                                            this.getList(this.pageParam);
                                            this.initTree();
                                            DeleteFromAttendance(ids);
                                        } else {
                                            Message({
                                                message: response.msg,
                                                type: 'error',
                                                customClass: 'msg-error',
                                                iconClass: 'ic'
                                            })
                                        }
                                    });
                            })
                    });
                } else {
                    this.ConfirmBox(message)
                        .then(() => {
                            Delete(id)
                                .then((response) => {
                                    if (response.code == 0) {
                                        Message({
                                            message: '删除资源成功',
                                            type: 'success',
                                            customClass: 'msg-success',
                                            iconClass: 'ic'
                                        })
                                        this.getList(this.pageParam);
                                        this.initTree();
                                    } else {
                                        Message({
                                            message: response.msg,
                                            type: 'error',
                                            customClass: 'msg-error',
                                            iconClass: 'ic'
                                        })
                                    }
                                })
                        })
                }
            });
        },
        onBatchDelete() {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            let message = '是否确认删除？'
            let flag = false;
            for (let i = 0; i < this.selectionData.length; i++) {
                if (this.selectionData[i].level == 0) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                this.judgeFromAttendance(ids).then((resp) => {
                    if (resp.data != undefined && resp.data.length != 0) {
                        message = '所选资源中有资源存在考勤组，是否确认删除？'
                    }
                    this.ConfirmBox(message)
                        .then(() => {
                            BatchDelete(ids)
                                .then(() => {
                                    if (response.code == 0) {
                                        Message({
                                            message: '删除资源成功',
                                            type: 'success',
                                            customClass: 'msg-success',
                                            iconClass: 'ic'
                                        })
                                        this.getList(this.pageParam);
                                        this.initTree();
                                        DeleteFromAttendance(ids);
                                    } else {
                                        Message({
                                            message: response.msg,
                                            type: 'error',
                                            customClass: 'msg-error',
                                            iconClass: 'ic'
                                        })
                                    }
                                });
                        })
                })
            } else {
                this.ConfirmBox(message)
                    .then(() => {
                        BatchDelete(ids)
                            .then(() => {
                                if (response.code == 0) {
                                    Message({
                                        message: '删除资源成功',
                                        type: 'success',
                                        customClass: 'msg-success',
                                        iconClass: 'ic'
                                    })
                                    this.getList(this.pageParam);
                                    this.initTree();
                                } else {
                                    Message({
                                        message: response.msg,
                                        type: 'error',
                                        customClass: 'msg-error',
                                        iconClass: 'ic'
                                    })
                                }
                            })
                    })
            }

            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            this.ConfirmBox('是否确认批量删除')
                .then(() => {
                    BatchDelete(ids)
                        .then((response) => {
                            if (response.code == 0) {
                                Message({
                                    message: '删除资源成功',
                                    type: 'success',
                                    customClass: 'msg-success',
                                    iconClass: 'ic'
                                })
                                this.getList(this.pageParam);
                                this.initTree();
                            } else {
                                Message({
                                    message: response.msg,
                                    type: 'error',
                                    customClass: 'msg-error',
                                    iconClass: 'ic'
                                })
                            }
                        })
                })

        },
        onStatus(type) {
            if (this.selectedResource.id == undefined || this.selectedResource.id == '') {
                this.$message({
                    message: "请选择一条资源数据",
                    type: 'error'
                })
                return;
            }
            let id = this.selectedResource.id;
            GetResource(id).then((response) => {
                if ((response.data.resourceTypeId == 1 || response.data.resourceTypeId == 5) && response.data.isCorp == 0) {
                    this.$message({
                        message: "只有企业用户才能启用/禁用社区类型资源",
                        type: 'error'
                    })
                    return;
                }
                if (type == '1') {
                    this.ConfirmBox('是否确认禁用？')
                        .then(() => {
                            Status(id, type)
                                .then(() => {
                                    this.getList(this.pageParam);
                                })
                        })
                }
                if (type == '0') {
                    this.ConfirmBox('是否确认启用？')
                        .then(() => {
                            Status(id, type)
                                .then(() => {
                                    this.getList(this.pageParam);
                                })
                        })
                }
            });
        },
        onBatchStatus(type) {
            if (this.selectionData == undefined || this.selectionData.length == 0) {
                this.$message({
                    message: "请至少选择一行数据",
                    type: 'error'
                })
                return;
            }
            var ids = this.selectionData.map(item => item.id)//获取所有选中行的id组成的数组，以逗号分隔
            if (type == '1') {
                this.ConfirmBox('是否确认禁用？')
                    .then(() => {
                        BatchStatus(ids, type)
                            .then((response) => {
                                if(response.code == 0){
                                    Message({
                                        message: '批量禁用成功',
                                        type: 'success',
                                        customClass: 'msg-success',
                                        iconClass: 'ic'
                                    })
                                    this.getList(this.pageParam);
                                }else{
                                    Message({
                                        message: response.msg,
                                        type: 'error',
                                        customClass: 'msg-error',
                                        iconClass: 'ic'
                                    })
                                }

                            })
                    })
            }
            if (type == '0') {
                this.ConfirmBox('是否确认启用？')
                    .then(() => {
                        BatchStatus(ids, type)
                            .then((response) => {
                                    if(response.code == 0){
                                        Message({
                                            message: '批量启用成功',
                                            type: 'success',
                                            customClass: 'msg-success',
                                            iconClass: 'ic'
                                        })
                                        this.getList(this.pageParam);
                                    }else{
                                        Message({
                                            message: response.msg,
                                            type: 'error',
                                            customClass: 'msg-error',
                                            iconClass: 'ic'
                                        })
                                    }

                                })
                            })
            }
        },
        changeValue() {
            /*alert(this.temp.resourceTypeId);*/
            if (this.addResourceTypeId != this.temp.resourceTypeId && this.dialogStatus == 'create') {
                this.temp.parentName = '';
                this.temp.parentId = '';
                this.temp.orgName = '';
                this.temp.orgId = '';
            }

            var storage = window.localStorage;
            this.resourceType.sysId = storage.getItem("sysId");
            this.resourceType.resourceTypeId = this.temp.resourceTypeId;
            if (this.resourceType.resourceTypeId != '' && this.resourceType.resourceTypeId != undefined) {
                GetResourceType(this.resourceType.resourceTypeId).then((response) => {
                    this.temp.level = response.data.level;
                    if (this.temp.level == 0) {
                        this.organizationsInit();
                        setTimeout(() => {
                            this.createMap()
                        }, 1000);
                    }

                    console.log(this.temp);
                    GetListSelective(this.resourceType).then((response) => {
                        this.options = response.data;
                        this.optionSelects = [];
                        for (let i = 0; i < this.options.length; i++) {
                            if (this.options[i].id == this.temp.parentId) {
                                this.temp.parentName = this.options[i].name;
                            }
                            let obj = {
                                id: this.options[i].id,
                                value: this.options[i].name
                            }
                            this.optionSelects.push(obj);
                        }
                        // this.optionSelects = response.data;
                    })
                })

            }

        },
        handleCancel() {
            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        closeForm() {
            this.formVisible = false;
        },
        changeFeature(file, fileList) {
            this.temp.imageUrlFlag = true;
            // this.img_loading = true;
            let self = this;
            let imgContent = {};
            imgContent.name = file.name;

            // 看支持不支持FileReader
            if (!file || (file && !file.raw) || !window.FileReader) return;
            if (/^image/.test(file.raw.type)) {

                var ff = file.raw;
                EXIF.getData(ff, function () {
                    self.Orientation = EXIF.getTag(this, 'Orientation');
                });

                // 创建一个reader
                let fileReader = new FileReader();
                // 读取成功后的回调
                fileReader.onprogress = function (e) {
                    console.log((e.loaded / e.total * 100).toFixed() + "%");
                };
                fileReader.onloadend = function (e) {
                    // let IMG = new Image();
                    let IMG = new Image();
                    IMG.src = this.result;
                    IMG.onload = function () {
                        let w = this.naturalWidth,
                            h = this.naturalHeight,
                            resizeW = 0,
                            resizeH = 0;
                        //压缩设置
                        let maxSize = {
                            width: 1080,      //图片最大宽度
                            height: 1080,     //图片最大高度
                            level: 0.6       //图片保存质量
                        };
                        //计算缩放比例
                        if (w > maxSize.width || h > maxSize.height) {
                            let multiple = Math.max(w / maxSize.width, h / maxSize.height);
                            resizeW = w / multiple;
                            resizeH = h / multiple;
                        } else {
                            resizeW = w;
                            resizeH = h;
                        }
                        let canvas = document.createElement("canvas"),
                            cxt = canvas.getContext('2d');
                        //根据拍摄的角度进行图片旋转调整
                        if (self.Orientation == 3) {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.rotate(Math.PI);
                            cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                        } else if (self.Orientation == 8) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI * 3 / 2);
                            cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                        } else if (self.Orientation == 6) {
                            canvas.width = resizeH;
                            canvas.height = resizeW;
                            cxt.rotate(Math.PI / 2);
                            cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                        } else {
                            canvas.width = resizeW;
                            canvas.height = resizeH;
                            cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                        }
                        //base64,最终输出的压缩文件
                        self.base64 = canvas.toDataURL('image/jpeg', maxSize.level);
                        self.num += 1;
                        self.imgType = 0;
                        // self.img_loading = false;

                        self.upLoadData.baseStr = self.base64;
                        self.imageUrl = self.base64;

                        // 手动上传
                        // UpdateFeature(self.upLoadData);
                        // setTimeout(function () {
                        //     self.dialogImg = false;
                        // }, 3000);
                    }
                };

                fileReader.onerror = function (e) {
                    console.log("图片加载失败");
                };

                // 将图片将转成 base64 格式
                fileReader.readAsDataURL(file.raw);
            }
        },
        OrganizationDetail() {
            if (this.selectedResource.id == undefined || this.selectedResource.id == '') {
                this.$message({
                    message: "请选择一条资源数据",
                    type: 'error'
                })
                return;
            }
            let resourceId = this.selectedResource.id;
            GetResource(resourceId).then((response) => {
                if (response.data.resourceTypeId != 1 && response.data.resourceTypeId != 5) {
                    this.$message({
                        message: "只能查看社区类型资源的组织",
                        type: 'error'
                    })
                    return;
                }
                GetOrganizationByResourceId(resourceId)
                    .then((response) => {
                        this.tableDataDetail.push(response.data);
                        this.dialogResourceDetail = true;
                    });
            });

        },
        OrganizationAdd() {
            if (this.selectedResource.id == undefined || this.selectedResource.id == '') {
                this.$message({
                    message: "请选择一条资源数据",
                    type: 'error'
                })
                return;
            }
            let resourceId = this.selectedResource.id;

            this.resourceId = resourceId;
            GetResource(resourceId).then((response) => {
                if (response.data.resourceTypeId != 1 && response.data.resourceTypeId != 5) {
                    this.$message({
                        message: "只能给社区类型资源关联组织",
                        type: 'error'
                    })
                    return;
                }
                GetOrganizations(resourceId)
                    .then((response) => {
                        this.tableDataAdd = response.data;
                        this.dialogAddData = true;
                    });
            });
        },
        handleSelectionChangeResource(selection) {
            this.selectionDataResource = selection
        },
        addResourceOrganization() {
            if (this.selectionDataResource == undefined || this.selectionDataResource.length == 0 || this.selectionDataResource.length > 1) {
                this.$message({
                    message: "请选择一行数据",
                    type: 'error'
                })
                return;
            }

            var param = {};
            var id = this.resourceId;
            var tenantId = this.selectionDataResource[0].orgId;
            param = {
                id: id,
                tenantId: tenantId
            };
            AddResourceOrganization(param).then((response) => {
                Message({
                    message: '关联组织成功',
                    type: 'success',
                    customClass: 'msg-success',
                    iconClass: 'ic'
                });
                this.dialogAddData = false;
            })
        },
        onResourceDelete() {
            var param = {};
            var id = this.resourceId;
            param = {
                id: id,
                tenantId: ''
            };
            AddResourceOrganization(param).then((response) => {
                Message({
                    message: '删除关联组织成功',
                    type: 'success',
                    customClass: 'msg-success',
                    iconClass: 'ic'
                })
            })
        },
        judgeFromAttendance(ids) {
            return GetResultFromAttendance(ids);
        }

    },
    computed: {
        headers() {
            let c_token, tenantId, xuid, xorgid;
            if (store.getters.token) {
                c_token = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            }
            if (store.getters.corporation) {
                tenantId = store.getters.corporation.id;
            }

            if (store.getters.user.user.id) {
                xuid = store.getters.user.user.id;
            }

            if (store.getters.user.user.extend) {
                if (store.getters.user.user.extend.brands.length > 0) {
                    xorgid = store.getters.user.user.extend.brands[0].id;
                }
            }
            let roleType = store.getters.user.user.roles[0].roleType;
            if (roleType == 'ORG') {
                return {
                    'token': c_token,
                    'tenant-id': tenantId,
                    'x-uid': xuid,
                    'x-org-id': xorgid
                }
            } else {
                return {
                    'token': c_token,
                    'tenant-id': tenantId,
                    'x-uid': xuid,
                }
            }

        },
    }
}

function tempInit() {
    return {
        resourceTypeId: '',
        name: '',
        code: '',
        parentId: '',
        parentName: '',
        orgId: '',
        orgName: '',
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
        provinceId: '',
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

