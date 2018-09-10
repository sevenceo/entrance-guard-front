/**
 * Created by Micheal Xiao on 2017/6/14.
 */
/* layout*/
import Layout from '../views/layout/Layout';
/* permission */
const PermissionTest = resolve => require(['../views/permission-test/index'], resolve);

/* active*/

const activeMsg = resolve => require(['../views/active/activeMsg/activeMsg.vue'], resolve);
const activePublic = resolve => require(['../views/active/activePublic.vue'], resolve);
const packageTable = resolve => require(['../views/active/package-table/packageTable.vue'], resolve);

//公共组件
const cButton = resolve => require(['../views/common/cButton.vue'], resolve);
const cInput = resolve => require(['../views/common/cInput.vue'], resolve);
const cSelect = resolve => require(['../views/common/cSelect.vue'], resolve);
const cDate = resolve => require(['../views/common/cDate.vue'], resolve);
const cTree = resolve => require(['../views/common/cTree.vue'], resolve);
const charts = resolve => require(['../views/common/echarts.vue'], resolve);
const upload = resolve => require(['views/common/upLoad.vue'], resolve)
const tab = resolve => require(['src/views/router-show/tab-page/page1.vue'], resolve)

// 演示页面
const list = resolve => require(['../views/demo/list/list.vue'], resolve);

// 路由展示
const tabpage = resolve => require(['../views/router-show/tab-page/tabPage.vue'], resolve);

//用户管理
const account = resolve => require(['../views/user-manage/userManager.vue'], resolve);
const Permission = resolve => require(['../views/permission/permission.vue'], resolve);
const Roles = resolve => require(['../views/roles/roles.vue'], resolve);


//说明文档
const helpDocument = resolve => require(['../views/help-document/helpDocument.vue'], resolve);
const readmeDocument = resolve => require(['../views/help-document/readme.vue'], resolve);
const tableDocument = resolve => require(['../views/help-document/table.vue'], resolve);
const catalogDocument = resolve => require(['../views/help-document/catalog.vue'], resolve);




 let customRoute = [
    {
        path: '/account',
        component: Layout,
        redirect: '/account/userManager',
        name: '用户与权限',
        icon: 'yonghuguanli',
        children: [
            {path: 'userManager', component: account, name: '用户管理'},
            {path: 'permission', component: Permission, name: '权限管理'},
            {path: 'roles', component: Roles, name: '角色管理'}
        ]
    },
    {
        path: '/active',
        component: Layout,
        redirect: '/active/index',
        name: '活动Demo',
        icon: 'mili_huodong',
        children: [
            // {path: 'activeMsg', component: activeMsg, name: '活动管理'},
            {path: 'packageTable', component: packageTable, name: '活动管理'},
            // {path: 'activePublic', component: activePublic, name: '活动发布'}
        ]
    },
    {
        path: '/common',
        component: Layout,
        redirect: '/common/cButton',
        name: '公共组件',
        icon: 'zujian',
        children: [
            {path: 'cButton', component: cButton, name: '按钮'},
            {path: 'cInput', component: cInput, name: '输入框'},
            {path: 'cSelect', component: cSelect, name: 'select选择器'},
            {path: 'cDate', component: cDate, name: '日期选择'},
            {path: 'cTree', component: cTree, name: '树形控件'},
            {path: 'echarts', component: charts, name: '图表'},
            {path: 'upload', component: upload, name: '上传控件'}
        ]
    },{
        path: '/help',//路径
        component: Layout,//layout模板组件
        redirect: '/help/readme',//重新定向到子路由
        name: '帮助文档',//路由名称
        icon: 'wendang',
        children: [//子路由
            {path: 'help',component: helpDocument,name: '使用教程',},
            {path: 'table-help',component: tableDocument,name: '表格文档',},
            {path: 'readme',component: readmeDocument,name: 'readme',},
            {path: 'catalog',component: catalogDocument,name: '目录文档',}
        ]
    },{
        path: '/permission-test',//路径
        component: Layout,//layout模板组件
        redirect: '/permission-test/index',//重新定向到子路由
        name: '权限测试',//路由名称
        icon: 'quanxian',
        meta: {role: ['ROLE_ADMIN']}, //页面需要的权限
        // noDropdown: true,
        children: [//子路由
            {
                path: 'index',
                component: PermissionTest,
                name: '当前用户权限',
                meta: {role: ['ROLE_ADMIN']}  //页面需要的权限
            }]
    }
    // {
    //     path: '/demo',
    //     component: Layout,
    //     redirect: '/demo/list',
    //     name: '列表',
    //     icon: 'liebiao',
    //     children: [
    //         {path: 'list', component: list, name: '列表展示'}
    //     ]
    // },
    // {
    //     path: '/routerpage',
    //     component: Layout,
    //     redirect: '/routerpage/tabpage/1',
    //     name: '路由功能',
    //     icon: 'luyou',
    //     children: [
    //         {
    //             path: 'tabpage', component: tabpage, name: 'Tab展示',
    //             // redirect: '/routerpage/tabpage/1',
    //             children: [
    //                 {
    //                     path: ':tabId', name: 'TAB展示', components: {
    //                     default: tab,
    //                     1: tab,
    //                     2: tab
    //                 }
    //                 }
    //             ]
    //         },
    //     ]
    // },

]

export default customRoute