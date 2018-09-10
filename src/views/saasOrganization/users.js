import {
    Unassigned,
    Delete,
    Create,
    AlreadyAssigned
} from './api/usersApi';
import {Message} from 'element-ui';

export default {
    created() {
        this.getListAlready();
    },
    data() {
        return {
            queryParameter: queryParameterInit(),
            userQueryParameter: userParameterInit(),
            dialogFormVisible: false,
            usersFormVisible: false,
            assigningUsersFormVisible: false,
            searchFormVisible: false,
            dialogStatus: 'create',
            rowTotal: 10,
            rowTotal1: 10,
            unassignedTableData: [],
            alreadyAssignedTableData: [],
            parentUser: {},
            selectedUsers: [],
        }
    },
    methods: {
        //翻页功能
        handleCurrentChange(page) {
            this.queryParameter.page = page;
            this.getListAlready()
        },
        handleCurrentChange1(page) {
            this.userQueryParameter.page = page;
            this.getListUnassigned()
        },
        getListAlready(){
            if (this.$route.query == null
                || this.$route.query == undefined
                || this.$route.query.org == null
                || this.$route.query.org == undefined
                || this.$route.query.org.orgId == null
                || this.$route.query.org.orgId == undefined) {
                this.$router.push('/weChat/saasOrganization/index');
            }
            let queryParams = this.$route.query.org;
            this.queryParameter.corporationId=queryParams.corporationId;
            this.queryParameter.orgId=queryParams.orgId;
            AlreadyAssigned(this.queryParameter).then((data) => {
                let rowTotal = data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.rows;
                    this.rowTotal = rowTotal;
                    this.alreadyAssignedTableData = rows;
                }
            });
        },
        getListUnassigned(){
            this.userQueryParameter.orgId = this.queryParameter.orgId;
            this.userQueryParameter.corporationId = this.queryParameter.corporationId;
            Unassigned(this.userQueryParameter).then((data) => {
                let rowTotal = data.data.rowTotal;
                if (rowTotal != null && rowTotal != undefined && rowTotal != "") {
                    let rows = data.data.rows;
                    this.rowTotal1 = rowTotal;
                    this.unassignedTableData = rows;
                } else {
                    this.rowTotal1 = 0;
                    this.unassignedTableData = [];
                }
            });
        },
        onAssigningUsersFormVisible: function () {
            this.assigningUsersFormVisible = true;
            this.getListUnassigned();
        },
        //多选绑定
        handleSelectionChange(val) {
            this.selectedUsers = val;
        },
        onDelete(row) {
            this.ConfirmBox('是否确认删除')
                .then(() => {
                    Delete(row.id)
                        .then(() => {
                            this.getListAlready();
                        })
                })

        },
        resetForm() {

        },
        handleCancel() {

            this.dialogFormVisible = false;
            this.temp = tempInit()
            this.$refs['form'].resetFields()
        },
        reset: function () {
            this.userQueryParameter.userName = null;
            this.userQueryParameter.mobile = null;
        },
        onSearch: function () {
            this.searchFormVisible = true;
        },
        doSearch: function () {
            this.getListUnassigned();
        },
        create() {
            if (this.selectedUsers.length > 0) {
                this.onXHR = true;
                let userIds = [];
                this.selectedUsers.forEach(function (p) {
                    userIds.push(p.id);
                });
                let saveData = {
                    orgId: this.queryParameter.orgId,
                    userIds: userIds
                }
                Create(saveData).then(() => {
                    this.assigningUsersFormVisible = false;
                    this.getListAlready();
                })
            } else {
                Message({
                    message: '请选择用户',
                    type: 'error',
                    customClass: 'msg-error',
                    iconClass: 'ic'
                })
            }

        },
        back:function () {
            this.$router.push('/weChat/saasOrganization/index');
        }
    }
};
function queryParameterInit() {
    return {
        corporationId: null,
        orgId:null,
        id: null,
        page: 1,
        size: 10,
        pageNum: 1,
        pageSize: 10,
    };
}
function userParameterInit() {
    return {
        account: null,
        mobile: null,
        orgId:null,
        corporationId: null,
        page: 1,
        size: 10,
        pageNum: 1,
        pageSize: 10,
    };
}

