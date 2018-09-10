/**
 * Created by zhaimaojin on 2017/8/21.
 */

import{getAllBrandList, GetTree , GetNodeChildren, CreateChildNode, ModifyChildNode, DeleteChildNode, GetNodeChildrenInfo,GetProvinceList,GetCityList,GetAreasList} from './api/structureApi'
import{ Tree } from 'element-ui-mike'
import { validateTel, } from 'utils/validate'
import loadNode from 'utils/tree-loading/treeLoading'


const orgTypeOptions = [
    { label: '主机厂',value:1},
    { label: '品牌',value:2},
    { label: '区域',value:3},
    { label: '经销商',value:4},
    { label: '其他',value:5}
];

export default {
    created(){
        this.getProvince();
        this.getBrands();
    },
    components:{
        Tree
    },
    data() {
        var checkorgType = (rule, value, callback) => {
            if(this.extendTemp.orgType == '') {
                callback(new Error('请选择组织类型'));
            } else {
                callback();
            }
        };
        return {
            structrueData: [],
            defaultProps: {
                children: 'children',
                label:'name'
            },
            dialogFormVisible: false,
            temp: tempInit(),
            extendTemp:extendTempInit(),
            editVisible: false,
            dialogStatus:false,
            textMap: {
                update: '编辑',
                create: '创建'
            },
            curNodeKey: 41,
            defExpKeys:["00000000-0000-0000-0000-000000000001"],
            deleteId : '',
            showFather: '',
            rules: {
                name: [
                    {required: true, message: '请输入机构名称'},
                    {max: 50, message: '最多输入50个字符'}
                ],
                address: [
                    {max: 100, message: '最多输入100个字符'}
                ],
                linkMan: [
                    {max: 50, message: '最多输入50个字符'}
                ],
                tel: [
                    {max: 50, message: '最多输入50个字符'},
                    {validator: validateTel}
                ],

                bewrite: [
                    {max: 200, message: '最多输入200个字符'}
                ]
            },
            extendTemprules: {
                dol: [
                    {max: 15, message: '最多输入15个字符'}
                ],
                sap: [
                    {max: 15, message: '最多输入15个字符'}
                ],
                netIndentifyBrand: [
                    {max: 255, message: '最多输入255个字符'}
                ],
                agencyType: [
                    {max: 50, message: '最多输入50个字符'}
                ],
                agencyShortname: [
                    {max: 255, message: '最多输入255个字符'}
                ],
                dealerCoder: [
                    {max: 36, message: '最多输入36个字符'}
                ],
                orgType:[
                    { validator: checkorgType, trigger: 'change' }
                ]
            },
            deleteFormVisible: false,
            activeName : 'basic',
            provinces:[],
            citys:[],
            areas:[],
            selectedProvince: '',
            selectedCity: '',
            selectedArea:'',
            brands:[],
            selectedbrands:[],
            orgTypeOptions
        }
    },
    methods: {
        loadNode,
        //highlight-click
        handleNodeClick(node,data) {
            this.editVisible = true;
            this.deleteId = node.id
            this.curNodeKey = node.id
        },
        handleCurChange(node, data){
            // console.log("当前节点")
            // console.log(node)
            // console.log(data)
        },
        onAdd(node){
            // console.log(this.$refs.tree)
            // console.log($(".el-tree-node.is-current .el-tree-node__content:first .el-tree-node__expand-icon"))
            this.temp = tempInit();
            this.selectedbrands = [];
            this.extendTemp = extendTempInit();
            this.dialogStatus = 'create'
            this.activeName = 'basic';
            this.temp.father = node.data.name
            this.temp.name = ''
            this.temp.parentId = node.key
            this.selectedProvince =  this.extendTemp.provinceId;
            this.selectedCity =  this.extendTemp.cityId;
            this.selectedArea =  this.extendTemp.areasId;
            this.citys = [];
            this.areas = [];
            this.dialogFormVisible = true;
            event.stopPropagation()
        },
        handleDelete(){
            this.ConfirmBox("是否确认删除")
                .then(()=>{
                return DeleteChildNode(this.deleteId)
            }).then((response)=>{
                if(response.status == 200) {
                    this.$message({
                        message: "删除成功",
                        type: 'success'
                    })
                }
                this.reloadCurParentNode()
            })
        },
        handleClose(){
            this.$refs['temp'].resetFields();
            this.dialogFormVisible = false;
            this.clear();
        },
        onEdit(node){
            console.log('nodekey')
            console.log(node.key)
            GetNodeChildrenInfo(node.key)
                .then((response)=> {
                let editNode =  response.data.org;
                this.temp.name = editNode.name
                this.temp.parentId = editNode.parentId
                this.temp.id = editNode.id
                this.temp.address = editNode.address
                this.temp.linkMan = editNode.linkMan
                this.temp.enable = editNode.enable
                this.temp.tel = editNode.tel
                this.temp.bewrite = editNode.bewrite
                this.temp.id = node.key
                this.extendTemp = response.data.extendorg == null ? extendTempInit() : response.data.extendorg;
                if(this.extendTemp.brands != null && this.extendTemp.brands != ""){
                    this.selectedbrands = this.extendTemp.brands.split(",");
                }else {
                    this.selectedbrands = [];
                }
                this.selectedProvince =  this.extendTemp.provinceId;
                this.selectedCity =  this.extendTemp.cityId;
                this.selectedArea =  this.extendTemp.areasId;
                this.citys = [];
                if(this.extendTemp.provinceId){
                    GetCityList(this.extendTemp.provinceId)
                        .then((response) => {
                            this.citys = response.data;
                        })
                }
                this.areas = [];
                if(this.extendTemp.cityId){
                    GetAreasList(this.extendTemp.cityId)
                        .then((response) => {
                            this.areas = response.data;
                        })
                }
            })
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
            this.activeName = 'basic';
            this.temp.father = node.parent.data.name
            event.stopPropagation()
        },
        cancel(temp){
            this.dialogFormVisible = false;
            this.$refs[temp].resetFields();
            this.clear();
        },

        create(temp,resolve){
            this.$refs['temp'].validate((valid1) => {
                this.$refs['extendTemp'].validate((valid2) => {
                    if(this.selectedbrands != null &&  this.selectedbrands.length != 0) {
                        this.extendTemp.brands = this.selectedbrands.join(",");
                    } else {
                        this.extendTemp.brands =null;
                    }
                    if (valid1 && valid2) {
                        CreateChildNode(this.temp,this.extendTemp)
                            .then((response) => {
                                this.dialogFormVisible = false;
                                this.reloadCurNode()
                                this.$refs['temp'].resetFields();
                                this.$refs['extendTemp'].resetFields();
                                this.clear();
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }})
            });
        },
        update(){
            console.log(this.temp,this.extendTemp)
            this.$refs['temp'].validate((valid) => {
                if (valid) {
                    if(this.selectedbrands != null &&  this.selectedbrands.length != 0) {
                        this.extendTemp.brands = this.selectedbrands.join(",");
                    } else {
                        this.extendTemp.brands =null;
                    }
                    ModifyChildNode(this.temp,this.extendTemp)
                        .then((response) => {
                        delete this.temp['father']
                        this.dialogFormVisible = false;
                    this.reloadCurParentNode()
                    this.$refs['temp'].resetFields();
                    this.$refs['extendTemp'].resetFields();
                    this.clear();
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        getProvince() {
            GetProvinceList()
                .then((response) => {
                this.provinces = response.data;
            })
        },

        getBrands(){
            getAllBrandList().then((response) => {
                this.brands = response.data;
            })
        },

        getAreas(value) {
            if(this.dialogFormVisible && this.activeName != 'basic'){
                this.extendTemp.cityId = value;
                if(value){
                    let obj = {};
                    obj = this.citys.find((item) => {
                        return item.id === value;
                    });
                    this.extendTemp.cityName = obj.name;
                    this.areas = [];
                    this.extendTemp.areasId = "";
                    this.extendTemp.areasName = "";
                    this.selectedArea = "";
                    GetAreasList(value)
                        .then((response) => {
                            this.areas = response.data;
                        })
                }
            }
        },

        getCity(value) {
            if(this.dialogFormVisible && this.activeName != 'basic'){
                this.extendTemp.provinceId = value;
                if(value){
                    let obj = {};
                    obj = this.provinces.find((item) => {
                        return item.id === value;
                    });
                    this.extendTemp.provinceName = obj.name;
                    this.citys = [];
                    this.extendTemp.cityId = "";
                    this.extendTemp.cityName = "";
                    this.selectedCity = "";
                    this.areas = [];
                    this.extendTemp.areasId = "";
                    this.extendTemp.areasName = "";
                    this.selectedArea = "";
                    GetCityList(value)
                        .then((response) => {
                            this.citys = response.data;
                        })
                }
            }
        },

        getAreasName(value){
            if(this.dialogFormVisible && this.activeName != 'basic'){
                this.extendTemp.areasId = value;
                if(value){
                    let obj = {};
                    obj = this.areas.find((item) => {
                        return item.id === value;
                    });
                    this.extendTemp.areasName = obj.name;
                }
            }
        },
        clear(){
            this.selectedProvince =  this.extendTemp.provinceId;
            this.selectedCity =  this.extendTemp.cityId;
            this.selectedArea =  this.extendTemp.areasId;
            this.citys = [];
            this.areas = [];
        },
        getNodeDetails(id){

        },

        reloadCurNode(tempNodeKey = this.curNodeKey){
            $(".el-tree-node.is-current .el-tree-node__content:first .js-refresh").click()
        },

        reloadCurParentNode(){
            $(".el-tree-node.is-current").parent().prev().children(".js-refresh").click()
        },

        findCurNode(tempNodeKey = this.curNodeKey, node = this.$refs.tree.root){
            // console.log("find node function")
            for(let v of node.childNodes) {
                if(v.data.id === tempNodeKey){
                    return {
                        parent: node,
                        node:v
                    }
                }
            }
            for(let v of node.childNodes) {
                let findedNode = this.findCurNode(tempNodeKey, v)
                if(findedNode){
                    return findedNode
                }
            }

        },
        //render edit-button
        renderContent(h, {node, data, store}) {

            function editBtn() {
                if(this.hasAuthority("SystemConfig.Company.Modify")){
                    return(
                        <el-button size="mini" class={{ hide: node.key === '00000000-0000-0000-0000-000000000001' }} on-click={ () => this.onEdit(node) }>
                            <svg class="icon" width='17' height='17' style="fill:#8ab4da" aria-hidden="true">
                                <use xlinkHref="#icon-edit1"></use>
                            </svg>
                        </el-button>)
                }
        }

        function deleteBtn(){
            if(this.hasAuthority("SystemConfig.Company.Create")){
                return(
                    <el-button size="mini" on-click={ () => this.onAdd(node) }>
                         <svg class="icon" width='17' height='17' style="fill:#8ab4da" aria-hidden="true">
                            <use xlinkHref="#icon-add1"></use>
                        </svg>
                    </el-button>)
            }
        }

        function btns(node) {
            if(this.editVisible){
                return (
                    <span style="float: right; margin-right: 20px" class={{ hide: node.id !== this.$refs.tree.currentNode.node.id }}>
                        {editBtn.call(this, node)}
                        {deleteBtn.call(this, node)}
                    </span>
                )
            }
        }

    return (
        <span>
            <span>{node.data.name}</span>
            {btns.call(this, node)}
        </span>)
    }
    }
};

function tempInit() {
    return {
        father: '',
        name: "",
        address: "",
        linkMan: "",
        tel: "",
        bewrite: "",
        enable: true,
        parentId:'',
    }
}
function extendTempInit() {
    return {
        "agencyShortname": "",
        "agencyType": "",
        "dol": "",
        "id": "",
        "netIndentifyBrand": "",
        "sap": "",
        "provinceName":"",
        "cityName":"",
        "areasName":"",
        "provinceId":"",
        "cityId":"",
        "areasId":"",
        "brands":"",
        "dealerCoder":"",
        "orgType":5
    }
}

