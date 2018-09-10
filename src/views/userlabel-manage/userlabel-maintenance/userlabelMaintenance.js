/**
 * Created by zyk on 2017/9/25.
 */
import {GetTreeData, ModifyData, CreateData, GetDataById, UploadFile,DeleteFile} from '../api/userlabelManageApi';
import {Message} from 'element-ui';

const tagStateOptions = [
    {key: 'ON', label: '启用'},
    {key: 'OFF', label: '停用'},
];

const tagTypeOptions = [
    {key: '基础信息', label: '基础信息'},
    {key: '活动', label: '活动'},
    {key: '成交', label: '成交'},
    {key: '社媒体', label: '社媒体'},
    {key: '产品', label: '产品'}
];

const runCycleOptions = [
    {key: 'Day', label:'Day'},
    {key: 'Week',label:'Week'},
    {key: 'Month',label:'Month'}
];

const categoryOptions = [
    {key: 'AUTO', label:'自动'},
    {key: 'HAND',label:'手动'}
];

export default {
    created() {
        this.getTreeData();
    },
    watch: {
        /**
         *  过滤树
         */
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        /**
         *  保存
         */
        save(tempform) {
            if(this.temp.category == 'HAND') {
                handleTempData(this.temp);
            }
            if(this.saveStatus == 'create') {
                this.create(tempform);
            } else {
                this.modify(tempform);
            }
        },
        /**
         *  新建标签
         */
        create(tempform) {
            this.$refs[tempform].validate((valid) => {
                if (valid) {
                    if(this.isTopTreeAddFalg) {
                        this.temp.parentId = '';
                    } else {
                        this.temp.parentId = this.parentId == 'add' ? '' : this.parentId;
                    }
                    this.temp.id = null;
                    CreateData(this.temp).then((response) => {
                        this.temp = tempInit();
                        this.getTreeData();
                        this.$refs[tempform].resetFields();
                        if(response.status == 201) {
                            this.$message({
                                message: "创建成功",
                                type: 'success'
                            })
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /**
         *  修改标签
         */
        modify(tempform) {
            this.$refs[tempform].validate((valid) => {
                if (valid) {
                    ModifyData(this.temp).then((response) => {
                        this.temp = tempInit();
                        this.getTreeData();
                        this.$refs[tempform].resetFields();
                        if(response.status == 201) {
                            this.$message({
                                message: "修改成功",
                                type: 'success'
                            })
                        }
                     })
                } else {
                    console.log('error submit!!');
                    return false;
                }
             });
        },
        /**
         *  添加层节点
         */
        addTopTreeNode() {
            this.isTopTreeAddFalg = true;
            // 清楚添加按钮
            this.isTreeLoadCompleteFlag = false;
            this.tagId = 'add';
            // 复位编辑表单
            this.$refs['temp'].resetFields();
            this.temp = tempInit();
            // 创建
            this.saveStatus == 'create'
            this.temp.format = '分类';
        },
        /**
         *  根据Id获取标签信息
         */
        getDataById(id) {
            GetDataById(id).then((response) => {
                this.temp = response.data;
                this.fileList = [];
                if(response.data.mediaPath) {
                    this.temp.fileName = response.data.mediaPath.split('fileName=')[response.data.mediaPath.split('fileName=').length-1];
                    this.fileList.push({name:this.temp.fileName,url:this.temp.mediaPath});
                }
                if(this.temp.temprunCycle == 'None') {
                    this.temp.temprunCycle = '';
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(node,data) {
            console.log(node)
            if(this.isClickEnableFlag) {
                this.isTreeLoadCompleteFlag = true;
                this.isTopTreeAddFalg = false;
                this.parentId = node.id;
                this.saveStatus = 'modify';
                this.tagId = node.id;
                this.temp.format = '文本';
            }
            this.isClickEnableFlag = true;
        },
        append(store, data){
            this.fileList = [];
            this.saveStatus = 'create';
            this.temp.format = '文本';
            this.$refs['temp'].resetFields();
            this.temp = tempInit();
            this.isClickEnableFlag = false;
            this.tagId = data.id;
        },
        getTreeData() {
            GetTreeData().then((response) => {
                this.labelData = response.data;
            })
        },
        tagTypeChange: function(tagType) {
            if(tagType == 'HAND') {
                this.formVisible = false;
            } else {
                this.formVisible = true;
            }
        },
        beforeUpload(file) {
            this.uploadFileFlag = true;
            const isLt2M = file.size / 1024 / 1024 <= 2;
            if (!isLt2M) {
                Message({
                    message: "上传文件大小不能超过 2MB!",
                    type: 'error',
                    duration: 5*1000,
                    showClose: true,
                    customClass:'msg-error',
                    iconClass:'sc'
                })
                this.uploadFileFlag = false;
                return false;
            }
            let formData = new FormData();
            formData.append("file", file,encodeURI(file.name));
            return true;
        },
        handleSuccess(res, file,fileList){
            this.uploadFileFlag = false;
            this.temp.mediaPath = "";
            this.temp.fileName = "";
            this.fileList = [];
            this.temp.mediaPath = process.env.BASE_API + '/wechat-userlabel' + res.ipDetail.split('fileName=')[0]+"fileName="+file.name;
            this.temp.fileName = file.name;
            this.fileList.push({name:this.temp.fileName,url:this.temp.mediaPath});
        },
        handleError(res, file,fileList){
            this.uploadFileFlag = false;
        },
        handleRemove(file, fileList) {
            DeleteFile(this.temp.mediaPath).then((response) => {
                this.fileList = [];
                this.temp.mediaPath = "";
                this.temp.fileName = "";
            });
        },
        handlePreview(file) {
            window.location.href = this.temp.mediaPath;
        },
        goBackUserLabel:function(){
            this.$router.push({name: '标签管理'});
        },
        renderContent(h, { node, data, store }){
            if(node.data.id == this.tagId) {
                this.getDataById(this.tagId);
            }
            if(this.tagId == 'add') {
                this.saveStatus = 'create';
            } else {
                this.saveStatus = 'modify';
            }
            let flag = true;
            if(this.isTreeLoadCompleteFlag) {
                flag = node.id != this.$refs.tree.currentNode.node.id;
            } else {
                flag = node.data.id != this.tagId;
            }
            return (
                <span>
                    <span>{node.label}</span>
                    <span style="float: right; margin-right: 20px" class={{ hide: node.data.id != this.tagId }}>
                        <el-button size="mini" on-click={ () => this.append(store, data) }>+</el-button>
                    </span>
                </span>);
        }
    },
    data() {
        var checkValidateStart = (rule, value, callback) => {
            if(this.temp.validateStart && this.temp.validateEnd) {
                if(this.temp.validateStart >  this.temp.validateEnd) {
                    callback(new Error('起始日期应小于等于结束日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var checkValidateEnd = (rule, value, callback) => {
            if(this.temp.validateStart && this.temp.validateEnd) {
                if(this.temp.validateStart >  this.temp.validateEnd) {
                    callback(new Error('截止日期应大于等于起始日期'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            tagId: this.$route.params.id,
            isTreeLoadCompleteFlag: false,
            filterText: '',
            // 修改、还是新建
            saveStatus : 'create',
            tagStateOptions,
            tagTypeOptions,
            runCycleOptions,
            categoryOptions,
            temp: tempInit(),
            labelData: [],
            defaultProps: {
                children: 'childTags',
                label: 'name'
            },
            fileList: [],
            parentId:this.$route.params.id,
            isTopTreeAddFalg : false,
            isClickEnableFlag : true,
            rules: {
                name: [
                    {required: true, message: '请输入标签名称'},
                    {max:50, message:"最多输入50个字符", trigger:'blur'}
                ],
                validateStart: [
                    {required: true, message: '请选择标签有效起始日期'},
                    { validator: checkValidateStart, trigger: 'change' }
                ] ,
                validateEnd: [
                    {required: true, message: '请选择标签有效截止日期'},
                    { validator: checkValidateEnd, trigger: 'change' }
                ]
            },
            formVisible:true,
            upLoadApi:process.env.UPLOAD_API + 'wechat-userlabel/api/file/upload',
            uploadFileFlag : false
        };
    }
};

function tempInit() {
    return {
        id:'',
        name: '',
        state: 'ON',
        type: "基础信息",
        parentId: "",
        format: "文本",
        validateStart: "",
        validateEnd: "",
        runCycle: 'Day',
        sqlStr: '',
        isSystem:false,
        isBasic:false,
        comment:'',
        mediaPath:'',
        isInvalid:true ,
        createTime:'',
        createUser:'',
        updateTime:'',
        updateUser:'',
        runTime:'',
        category:'AUTO',
        fileName : ''
    }
}

function handleTempData(temp) {
    temp.runCycle = 'None';
    temp.sqlStr = '';
    temp.comment = '';
    temp.mediaPath = '';
}