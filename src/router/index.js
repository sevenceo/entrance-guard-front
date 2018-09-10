import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

/* layout*/
import Layout from '../views/layout/Layout';
import blankView from 'components/routerView'
/* login*/
import Login from '../views/login/login.vue';

/*register*/
import Register from '../views/register';

// dashboard
const dashboard = resolve => require(['../views/dashboard/index.vue'], resolve);

/* error page*/
const Err404 = resolve => require(['../views/error/404'], resolve);
const Err401 = resolve => require(['../views/error/401'], resolve);

// 微信公众号管理
const wcAccount = resolve => require(['../views/wc-account/wcAccount.vue'], resolve);
const wcMenu = resolve => require(['../views/wcMenu/wcMenu.vue'], resolve);

// 切换微信公众号
const wcChange = resolve => require(['../views/wc-change/wcChange.vue'], resolve);



//门禁管理
const aiServer = resolve => require(['../views/AiServer/AiServer.vue'], resolve);
const human = resolve => require(['../views/Human/Human.vue'], resolve);
const supplier = resolve => require(['../views/Supplier/Supplier.vue'], resolve);
const sensingDevice = resolve => require(['../views/SensingDevice/SensingDevice.vue'], resolve);
const controlDevice = resolve => require(['../views/ControlDevice/ControlDevice.vue'], resolve);
const groupHuman = resolve => require(['../views/GroupHuman/GroupHuman.vue'], resolve);
const resourceType = resolve => require(['../views/ResourceType/ResourceType.vue'], resolve);
const resource = resolve => require(['../views/Resource/Resource.vue'], resolve);
const dataSend = resolve => require(['../views/dataSend/dataSend.vue'], resolve);
const scene = resolve => require(['../views/Scene/Scene.vue'], resolve);
const ldServer = resolve => require(['../views/LdServer/LdServer.vue'], resolve);
const promptManage = resolve => require(['../views/PromptManage/PromptManage.vue'], resolve);
const deviceState = resolve => require(['../views/deviceState/deviceState.vue'], resolve);
const visitorRecord = resolve => require(['../views/visitorRecord/visitorRecord.vue'], resolve);
const version = resolve => require(['../views/Version/Version.vue'], resolve);
const appUpgrade = resolve => require(['../views/AppUpgrade/AppUpgrade.vue'], resolve);
const upgradeRecord = resolve => require(['../views/UpgradeRecord/UpgradeRecord.vue'], resolve);
//意见反馈
const feedBack = resolve => require(['../views/feedBack/feedBack.vue'], resolve);
//开门历史
const opendoorHistory = resolve => require(['../views/OpendoorHistory/OpendoorHistory.vue'], resolve);
const faceCompareHistory = resolve => require(['../views/FaceCompareHistory/FaceCompareHistory.vue'], resolve);
const operateHistory = resolve => require(['../views/OperateHistory/OperateHistory.vue'], resolve);
// const photoWall = resolve => require(['../views/PhotoWall/PhotoWall.vue'], resolve);
const photoWall = resolve => require(['../views/PhotoWall/WelCome.vue'], resolve);

//大屏信息
const screenInformation = resolve => require(['../views/ScreenInformation/ScreenInformation.vue'], resolve);
const userMessage = resolve => require(['../views/UserMessage/UserMessage.vue'], resolve);
/*const faceCompareHistory = resolve => require(['../views/FaceCompareHistory/FaceCompareHistory.vue'], resolve);*/
//白名单设置
const whiteList = resolve => require(['../views/WhiteList/WhiteList.vue'], resolve);
const blackList = resolve => require(['../views/BlackList/BlackList.vue'], resolve);
const redList = resolve => require(['../views/RedList/RedList.vue'], resolve);
//数据统计
const todayCount = resolve => require(['../views/todayCount/todayCount.vue'], resolve);
const historyCount = resolve => require(['../views/historyCount/historyCount.vue'], resolve);
//预警设置
const earlyWarning = resolve => require(['../views/EarlyWarningConfig/EarlyWarningConfig.vue'], resolve);
//开门预警
const opendoorEarlyWarning=resolve=>require(['../views/OpendoorEarlyWarning/OpendoorEarlyWarning.vue'],resolve);
const opendoorEarlyWarningDetail=resolve=>require(['../views/OpendoorEarlyWarning/OpendoorEarlyWarning-detail/OpendoorEarlyWarningDetail.vue'],resolve);

//设备预警
const deviceEarlyWarning=resolve=>require(['../views/DeviceEarlyWarning/DeviceEarlyWarning.vue'],resolve);
const deviceEarlyWarningDetail=resolve=>require(['../views/DeviceEarlyWarning/DeviceEarlyWarning-detail/DeviceEarlyWarningDetail.vue'],resolve);

const mapCount = resolve => require(['../views/mapCount/mapCount.vue'], resolve);


//用户管理
const account = resolve => require(['../views/user-manage/userManager.vue'], resolve);
const rolesManage = resolve => require(['../views/wc-system/roles-manage/rolesManage.vue'], resolve);
const editorCharacter = resolve => require(['../views/wc-system/character/character.vue'], resolve);
const wcSystemStructure = resolve => require(['../views/wc-system/structure/structure.vue'], resolve);

//企业管理
const company = resolve => require(['../views/company-manage/companyManage.vue'], resolve)

//角色管理
const roleIndex = resolve => require(['../views/role/roleIndex.vue'], resolve);
const role = resolve => require(['../views/role/role.vue'], resolve);
const assigningUsers = resolve => require(['../views/role/assigningUsers.vue'], resolve);

//数据字典
const dataDictionary = resolve => require(['../views/data-dictionary/dataDictionary.vue'], resolve);

//操作管理
const operationManage = resolve => require(['../views/operation-manage/operationManage.vue'], resolve);

//用户授权
const sysUser = resolve => require(['../views/sysUser/sysUser.vue'], resolve);
//组织管理
const saasOrganizationIndex = resolve => require(['../views/saasOrganization/index.vue'], resolve);
const saasOrganization = resolve => require(['../views/saasOrganization/saasOrganization.vue'], resolve);
const saasOrganizationUser = resolve => require(['../views/saasOrganization/users.vue'], resolve);

// module-manage
const moduleManage = resolve => require(['../views/module-manage/moduleManage.vue'], resolve);

// 场景画布
const sceneCanvas = resolve => require(['../views/SceneCanvas/SceneCanvas.vue'], resolve);
//人员审核管理
const humanAudit = resolve => require(['../views/humanAudit/humanAudit.vue'], resolve);
//房产审核设置
const humanAuditSetting = resolve => require(['../views/humanAuditSetting/humanAuditSetting.vue'], resolve);

const opendoorAndFaceCompareCount = resolve => require(['../views/OpendoorAndFaceCompareCount/OpendoorAndFaceCompareCount.vue'], resolve);


//班次管理
const flightManage=resolve=>require(['../views/flightManagement/flightManage.vue'],resolve);

//考勤组管理
const AttendanceManage=resolve=>require(['../views/attendance/attendance.vue'],resolve);
//考勤月
const OrgAttendanceConfig=resolve=>require(['../views/OrgAttendanceConfig/OrgAttendanceConfig.vue'],resolve);

// /补卡审批
const repairAttendenceApply=resolve=>require(['../views/repairAttendenceApply/repairAttendenceApply.vue'],resolve);

// /法定节假日
const Holiday=resolve=>require(['../views/Holiday/Holiday.vue'],resolve);

//排班
const HumanDailyWorkState = resolve => require(['../views/HumanDailyWorkState/HumanDailyWorkState.vue'], resolve);

//日考勤统计
const dailyAttendanceStatistics = resolve => require(['../views/DailyAttendance/DailyAttendance.vue'], resolve);

//月考勤统计
const monthAttendanceStatistics = resolve => require(['../views/Attendancestatisticsreport/Attendancestatisticsreport.vue'], resolve);

//盒子历史
const deviceLog = resolve => require(['../views/DeviceLog/DeviceLog.vue'], resolve);

 //考勤管理
// const attendance = resolve => require(['../views/attendance/attendance.vue'], resolve);
const temporaryMap = resolve => require(['../views/map/map.vue'], resolve);

//节假日
const holidayCalendar=resolve =>require(['components/schudule/schudule.vue'],resolve)

//管理员节假日
const adminHolidayCalendar = resolve =>require(['components/adminSchudule/adminSchudule.vue'],resolve)

// import customRoute from './customRoute'
let routes = [
    {path: '/register', component: Register, hidden: true},
    {path: '/login', component: Login, hidden: true},
    {path: '/wcChange', component: wcChange, hidden: true},
    // {path: '/sceneCanvas', component: sceneCanvas, hidden: true},

    // {path: '/404', component: Err404, hidden: true},
    {path: '/401', component: Err401, hidden: true},
    // {path: '*', redirect: '/404', hidden: true},
    {path: '/404', component: Login, hidden: true},
    {path: '*', redirect: '/login', hidden: true},
    /*{
        path: '',
        component: Layout,
        redirect: '/dashboard',
        name: '首页',
        noDropdown: true,
        meta: {name: '首页'},
        icon: 'homepage',
        hidden: true,
        children: [{path: 'dashboard', component: dashboard, name: '首页 ', meta: {name: '首页'}}]
    },*/

    {
        path: '/guard',
        component: Layout,
        name: '智能门禁',
        meta: {name: '智能门禁', role: ['Fans']},
        icon: 'fensi1',
        redirect: 'sceneCanvas',
        noDropdown: true,
        hidden: true,
        children: [
            {path: 'sceneCanvas', component: sceneCanvas, name: '场景分布', meta: {name: '场景分布'}},
        ]
    },

    // 智能门禁
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     // meta: {name: '智能门禁', role: ['Fans']},
    //     meta: {name: '智能门禁', role: ['M20180613majhkygcj']},
    //     icon: 'fensi1',
    //     redirect: 'aiServer',
    //     noDropdown: true,
    //     children: [
    //         {path: 'aiServer', component: aiServer, name: 'AI智能终端 ', meta: {name: 'AI智能终端'}}
    //     ]
    // },
    {
        path: '/guard',
        component: Layout,
        name: '人员管理',
        meta: {name: '人员管理', role: ['M20180613unhqmdcri']},
        icon: 'fensi1',
        redirect: 'human',
        noDropdown: false,
        children: [
            {path: 'human', component: human, name: '人员管理 ', meta: {name: '人员管理',role:['M20180723lizkhgdyp']}},
            {path: 'groupHuman', component: groupHuman, name: '人员组管理 ', meta: {name: '人员组管理',role:['M20180613xathdlxwr']}},
            {path: 'humanAudit', component: humanAudit, name: '人员房产审核 ', meta: {name: '人员房产审核',role:['M20180630mvfuazpex']}},
            {path: 'visitorRecord', component: visitorRecord, name: '访客管理 ', meta: {name: '访客管理',role:['M20180716ypeoorszr']}},
            {path: 'humanAuditSetting', component: humanAuditSetting, name: '房产审核设置 ', meta: {name: '房产审核设置',role:['M2018096npvhticry']}}
        ]
    },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180613urkdabprj']},
    //     icon: 'fensi1',
    //     redirect: 'photoWall',
    //     noDropdown: true,
    //     children: [
    //         {path: 'photoWall', component: photoWall, name: '照片墙 ', meta: {name: '照片墙'}},
    //     ]
    // },
    {
        path: '/guard',
        component: Layout,
        name: '智能门禁',
        meta: {name: '智能门禁', role: ['M20180613dltunjyao']},
        icon: 'gongyingshang',
        redirect: 'guard/supplier',
        noDropdown: true,
        children: [
            {path: 'supplier', component: supplier, name: '供应商管理 ', meta: {name: '供应商管理',role: ['M20180613dltunjyao']}}
        ]
    },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180613drazccbgf']},
    //     icon: 'ganyingshebei',
    //     redirect: 'guard/sensingDevice',
    //     noDropdown: true,
    //     children: [
    //         {path: 'sensingDevice', component: sensingDevice, name: '感应设备管理 ', meta: {name: '感应设备管理'}}
    //     ]
    // },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180613vazlcegxi']},
    //     icon: 'fensi1',
    //     redirect: 'guard/controlDevice',
    //     noDropdown: true,
    //     children: [
    //         {path: 'controlDevice', component: controlDevice, name: '控制设备管理 ', meta: {name: '控制设备管理'}}
    //     ]
    // },
 /*   {
        path: '/guard',
        component: Layout,
        name: '智能门禁',
        meta: {name: '智能门禁', role: ['M20180613xathdlxwr']},
        icon: 'fensi1',
        redirect: 'guard/groupHuman',
        noDropdown: true,
        children: [
            {path: 'groupHuman', component: groupHuman, name: '人员组管理 ', meta: {name: '人员组管理'}}
        ]
    },*/
/*    {
        path: '/guard',
        component: Layout,
        name: '智能门禁',
        meta: {name: '智能门禁', role: ['M20180613rtnldfeix']},
        icon: 'fensi1',
        redirect: 'guard/resourceType',
        noDropdown: true,
        children: [
            {path: 'resourceType', component: resourceType, name: '资源类型管理 ', meta: {name: '资源类型管理'}}
        ]
    },*/
    {
        path: '/guard',
        component: Layout,
        name: '资源管理',
        meta: {name: '资源管理', role: ['M20180613axyaknvnr']},
        icon: 'ziyuanguanli',
        redirect: 'guard/resource',
        noDropdown: false,
        children: [
            {path: 'resource', component: resource, name: '资源管理 ', meta: {name: '资源管理',role:['M20180723twhqekkuu']}},
            {path: 'resourceType', component: resourceType, name: '资源类型管理 ', meta: {name: '资源类型管理',role:['M20180613rtnldfeix']}}
        ]
    },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180613axyaknvnr']},
    //     icon: 'fensi1',
    //     redirect: 'guard/dataSend',
    //     noDropdown: true,
    //     children: [
    //         {path: 'dataSend', component: dataSend, name: '数据发放 ', meta: {name: '数据发放'}}
    //     ]
    // },
    {
        path: '/guard',
        component: Layout,
        name: '场景管理',
        meta: {name: '场景管理', role: ['M20180613sqqbmxioj']},
        icon: 'changjingguanli',
        redirect: 'guard/scene',
        noDropdown: false,
        children: [
            {path: 'scene', component: scene, name: '场景管理 ', meta: {name: '场景管理',role: ['M20180613sqqbmxioj']}}
        ]
    },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180630txedfdkoz']},
    //     icon: 'fensi1',
    //     redirect: 'guard/ldServer',
    //     noDropdown: true,
    //     children: [
    //         {path: 'ldServer', component: ldServer, name: '终端服务管理 ', meta: {name: '终端服务管理'}}
    //     ]
    // },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180630gnhcuvgev']},
    //     icon: 'banbenguanli',
    //     redirect: 'guard/version',
    //     noDropdown: true,
    //     children: [
    //         {path: 'version', component: version, name: '版本管理 ', meta: {name: '版本管理'}}
    //     ]
    // },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180630kfffctmqh']},
    //     icon: 'yingyongshengji',
    //     redirect: 'guard/appUpgrade',
    //     noDropdown: true,
    //     children: [
    //         {path: 'appUpgrade', component: appUpgrade, name: '应用升级管理 ', meta: {name: '应用升级管理'}}
    //     ]
    // },
    {
        path: '/guard',
        component: Layout,
        name: '升级管理',
        meta: {name: '升级管理', role: ['M20180723hvgpylczv']},
        icon: 'shengjijilu',
        redirect: 'guard/upgradeRecord',
        noDropdown: false,
        children: [
            {path: 'version', component: version, name: '版本管理 ', meta: {name: '版本管理',role:['M20180630gnhcuvgev']}},
            {path: 'appUpgrade', component: appUpgrade, name: '应用升级管理 ', meta: {name: '应用升级管理',role:['M20180630kfffctmqh']}},
            {path: 'upgradeRecord', component: upgradeRecord, name: '升级记录管理 ', meta: {name: '升级记录管理',role:['M20180630yggdmhpsc']}}
        ]
    },
    // {
    //     path: '/guard',
    //     component: Layout,
    //     name: '智能门禁',
    //     meta: {name: '智能门禁', role: ['M20180630mvfuazpex']},
    //     icon: 'renyuanshenhe',
    //     redirect: 'guard/humanAudit',
    //     noDropdown: true,
    //     children: [
    //         {path: 'humanAudit', component: humanAudit, name: '人员审核管理 ', meta: {name: '人员审核管理'}}
    //     ]
    // },
    {
        path: '/device',
        component: Layout,
        name: '设备管理',
        meta: {name: '设备管理', role: ['M20180630fawzqyxsx']},
        icon: 'shebeiguanli',
        redirect: 'device/aiServer',
        noDropdown: false,
        children: [
            {path: 'aiServer', component: aiServer, name: 'AI智能终端 ', meta: {name: 'AI智能终端', role: ['M20180613majhkygcj']}},
            {path: 'sensingDevice', component: sensingDevice, name: '感应设备管理 ', meta: {name: '感应设备管理', role: ['M20180613drazccbgf']}},
            {path: 'controlDevice', component: controlDevice, name: '控制设备管理 ', meta: {name: '控制设备管理', role: ['M20180613vazlcegxi']}},
            {path: 'ldServer', component: ldServer, name: '终端服务管理 ', meta: {name: '终端服务管理', role: ['M20180630txedfdkoz']}},
            {path: 'promptManage', component: promptManage, name: '提示语管理 ', meta: {name: '提示语管理', role: ['M20180718cnyvthtsq']}},
            {path: 'deviceState', component: deviceState, name: '设备状态管理 ', meta: {name: '设备状态管理', role: ['M20180630txedfdkoz']}}

        ]
    },
    {
        path: '/history',
        component: Layout,
        name: '历史记录',
        meta: {name: '历史记录', role: ['M2018074qxmelkxdr']},
        icon: 'lishijiluNew',
        redirect: 'history/opendoorHistory',
        noDropdown: false,
        children: [
            {path: 'opendoorHistory', component: opendoorHistory, name: '开门历史 ', meta: {name: '开门历史', role: ['M2018074zlfcmdgiq']}},
            {path: 'faceCompareHistory', component: faceCompareHistory, name: '识别历史 ', meta: {name: '识别历史', role: ['M2018077aczjanvnl']}},
            {path: 'operateHistory', component: operateHistory, name: '操作历史 ', meta: {name: '操作历史', role: ['M20180719webafbrkh']}},
            {path: 'deviceLog', component: deviceLog, name: '盒子历史 ', meta: {name: '盒子历史', role: ['M2018086jashgjdsc']}}
        ]
    },
    {
        path: '/screen',
        component: Layout,
        name: '大屏信息设置',
        meta: {name: '大屏信息设置', role: ['M20180712lkmkyvbit']},
        icon: 'dapingxinxi',
        redirect: 'screenInformation/screenInformation',
        noDropdown: false,
        children: [
            {path: 'screenInformation', component: screenInformation, name: '大屏信息设置 ', meta: {name: '大屏信息设置', role: ['M20180712qfuhbhcwn']}},
            //{path: 'userMessage', component: userMessage, name: '用户消息设置 ', meta: {name: '用户消息设置', role: ['M20180712qfuhbhcwn']}},
        ]
    },

    {
        path: '/list',
        component: Layout,
        name: '黑白红名单设置',
        meta: {name: '黑白红名单设置', role: ['M20180723azrhbbibd']},
        icon: 'heibaimingdan',
        redirect: 'list/whiteList',
        noDropdown: false,
        children: [
            {path: 'whiteList', component: whiteList, name: '白名单设置 ', meta: {name: '白名单设置', role: ['M20180723covqgcutm']}},
            {path: 'blackList', component: blackList, name: '黑名单设置 ', meta: {name: '黑名单设置', role: ['M20180723covqgcutm']}},
            {path: 'redList', component: redList, name: '红名单设置 ', meta: {name: '红名单设置', role: ['M20180723covqgcutm']}},
            // {path: 'AttendanceManage', component: AttendanceManage, name: '考勤组管理 ', meta: {name: '考勤组管理'}},
            // {path: 'flightManage', component: flightManage, name: '班次管理 ', meta: {name: '班次管理'}},
            // {path: 'resourceType', component: resourceType, name: '排班管理 ', meta: {name: '排班管理'}}
        ]
    },
    // {
    //     path: '/list',
    //     component: Layout,
    //     name: '黑白名单设置',
    //     meta: {name: '黑白名单设置', role: ['M20180723azrhbbibd']},
    //     icon: 'heibaimingdan',
    //     redirect: 'list/whiteList',
    //     noDropdown: false,
    //     children: [
    //         {path: 'whiteList', component: whiteList, name: '白名单设置 ', meta: {name: '白名单设置', role: ['M20180723covqgcutm']}},
    //         {path: 'AttendanceManage', component: AttendanceManage, name: '考勤组管理 ', meta: {name: '考勤组管理'}},
    //         {path: 'flightManage', component: flightManage, name: '班次管理 ', meta: {name: '班次管理'}},
    //         {path: 'resourceType', component: resourceType, name: '排班管理 ', meta: {name: '排班管理'}}
    //     ]
    // },
    {
        path: '/feedBack',
        component: Layout,
        name: '意见反馈',
        meta: {name: '意见反馈', role: ['M20180723slxkxmdde']},
        icon: 'yijianfankui',
        redirect: 'feedBackInformation/feedBackInformation',
        noDropdown: false,
        children: [
            {path: 'feedBackInformation', component: feedBack, name: '意见反馈 ', meta: {name: '意见反馈', role: ['M20180723slxkxmdde']}},
        ]
    },

    {
        path: '/todayCount',
        component: Layout,
        name: '报表分析',
        meta: {name: '报表分析', role: ['M2018081qxuhgpdpj']},
        icon: 'baobiaofenxi',
        redirect: 'todayCount/todayCount',
        noDropdown: false,
        children: [
            {path: 'todayCount', component: todayCount, name: '今日统计 ', meta: {name: '今日统计', role: ['M2018081bstctaxhe']}},
            {path: 'todayCount/:id', component: todayCount, name: '今日统计 ', meta: {name: '今日统计'},hidden: true},
            {path: 'historyCount', component: historyCount, name: '历史统计 ', meta: {name: '历史统计', role: ['M2018081vxwquxvea']}},
            {path: 'historyCount/:id', component: historyCount, name: '历史统计 ', meta: {name: '历史统计'},hidden: true},
            {path: 'opendoorAndFaceCompareCount', component: opendoorAndFaceCompareCount, name: '开门统计 ', meta: {name: '开门统计', role: ['M2018081bpxlgilre']}},
            // {path: 'todayCount', component: todayCount, name: '今日统计 ', meta: {name: '今日统计', role: ['M20180723covqgcutm']}},
            // {path: 'historyCount', component: historyCount, name: '历史统计 ', meta: {name: '历史统计', role: ['M20180723covqgcutm']}},
            {path: 'mapCount', component: mapCount, name: '数据总览 ', meta: {name: '数据总览', role: ['M2018081fuqanytfe']}},
        ]
    },

    {
        path: '/earlyWarning',
        component: Layout,
        name: '预警配置',
        meta: {name: '预警配置', role: ['M2018088aedgbggig']},
        icon: 'lishijilu',
        redirect: 'earlyWarning/earlyWarning',
        noDropdown: false,
        children: [
            {path: 'earlyWarning', component: earlyWarning, name: '预警设置 ', meta: {name: '预警设置'},role:['M2018088pvvduhqli']},
            {path: 'opendoorEarlyWarning', component: opendoorEarlyWarning, name: '开门预警 ', meta: {name: '开门预警'},role:['M2018088xqffwqyfo']},
            {path: 'opendoorEarlyWarningDetai/:id/:tenantId/:code', component: opendoorEarlyWarningDetail, name: '设备信息 ', hidden: true},
            {path: 'deviceEarlyWarning', component: deviceEarlyWarning, name: '设备预警 ', meta: {name: '设备预警'},role:['M2018088emqvajtho']},
            {path: 'deviceEarlyWarningDetai/:id/:tenantId/:code', component: deviceEarlyWarningDetail, name: '设备信息 ', hidden: true}
        ]
    },
    // {
    //     path: '/screen',
    //     component: Layout,
    //     name: '开门预警',
    //     meta: {name: '开门预警'},
    //     icon: 'kaimenyujing',
    //     redirect: 'opendoorEarlyWarning/opendoorEarlyWarning',
    //     noDropdown: true,
    //     children: [
    //         {path: 'opendoorEarlyWarning', component: opendoorEarlyWarning, name: '开门预警 ', meta: {name: '开门预警'}},
    //         {path: 'opendoorEarlyWarningDetai/:id', component: opendoorEarlyWarningDetail, name: '设备信息 ', hidden: true}
    //     ]
    // },
    // {
    //     path: '/screen',
    //     component: Layout,
    //     name: '设备预警',
    //     meta: {name: '设备预警'},
    //     icon: 'shebeiyujing',
    //     redirect: 'deviceEarlyWarning/deviceEarlyWarning',
    //     noDropdown: true,
    //     children: [
    //         {path: 'deviceEarlyWarning', component: deviceEarlyWarning, name: '设备预警 ', meta: {name: '设备预警'}},
    //         {path: 'deviceEarlyWarningDetai/:id', component: deviceEarlyWarningDetail, name: '设备信息 ', hidden: true}
    //     ]
    // },
    {
        path: '/attendance',
        component: Layout,
        name: '考勤管理',
        meta: {name: '考勤管理',role:['Attendance']},
        icon: 'sucai',
        noDropdown: false,
        children: [
            {path: 'AttendanceManage', component: AttendanceManage, name: '考勤组管理 ', meta: {name: '考勤组管理',role:['AttendanceManage']}},
            {path: 'flightManage', component: flightManage, name: '班次管理 ', meta: {name: '班次管理',role:['flightManage']}},
            {path: 'HumanDailyWorkState', component: HumanDailyWorkState, name: '排班管理 ', meta: {name: '排班管理',role:['HumanDailyWorkState']}},
            {path: 'OrgAttendanceConfig', component: OrgAttendanceConfig, name: '考勤月设置 ', meta: {name: '考勤月设置',role:['OrgAttendanceConfig']}},
            // {path: 'Holiday', component: Holiday, name: '节假日管理 ', meta: {name: '节假日管理',role:['Holiday']}}
            {path: 'Holiday', component: holidayCalendar, name: '节假日管理 ', meta: {name: '节假日管理',role:['Holiday']}},
            {path: 'AdminHoliday', component: adminHolidayCalendar, name: '法定节假日管理 ', meta: {name: '法定节假日管理',role:['AdminHoliday']}}
        ]
    },
    {
        path: '/guard',
        component: Layout,
        name: '考勤审批',
        meta: {name: '考勤审批', role: ['RepairAttendence']},
        icon: 'fensi1',
        redirect: 'guard/resource',
        noDropdown: false,
        children: [
            // {path: 'resource', component: resource, name: '班次调整审批 ', meta: {name: '班次调整审批'}},
            {path: 'repairAttendenceApply', component: repairAttendenceApply, name: '补卡审批 ', meta: {name: '补卡审批',role:['RepqirReissueCard']}}
        ]
    },
    {
        path: '/screen',
        component: Layout,
        name: '考勤统计',
        meta: {name: '考勤统计', role: ['AttendanceStatistics']},
        icon: 'tongji1',
        redirect: 'screenInformation/screenInformation',
        noDropdown: false,
        children: [
            {path: 'dailyAttendanceStatistics', component: dailyAttendanceStatistics, name: '日考勤统计 ', meta: {name: '日考勤统计',role:['dailyAttendanceStatistics']}},
            {path: 'monthAttendanceStatistics', component: monthAttendanceStatistics, name: '月度考勤统计 ', meta: {name: '月度考勤统计',role:['dailyAttendanceStatistics']}},
        ]
    },
    {
        path: '/map',
        component: Layout,
        name: '地图',
        meta: {name: '地图', role: ['MmmmtemporaryMap']},
        icon: 'location1',
        redirect: 'map/temporaryMap',
        noDropdown: false,
        children: [
            {path: 'temporaryMap', component: temporaryMap, name: '行为轨迹 ', meta: {name: '行为轨迹', role: ['MmmmtemporaryMap']}},
        ]
    },
    // {
    //     path: '/weChat',
    //     component: Layout,
    //     redirect: '/weChat/structure',
    //     name: '基础管理',
    //     icon: 'stealth',
    //     meta: {name: '基础管理', role: ["SystemConfig"]},
    //     children: [
    //         {
    //             path: 'module-manage',
    //             component: moduleManage,
    //             name: '模块管理',
    //             meta: {name: '模块管理'}
    //         },
    //         {
    //             path: 'role',
    //             component: roleIndex,
    //             redirect: 'role/index',
    //             name: '角色管理',
    //             meta: {name: '角色管理'},
    //             children: [
    //                 {
    //                     path: 'index',
    //                     component: role,
    //                     name: '角色列表',
    //                     meta: {name: '角色列表'},
    //                     hidden: true
    //                 },
    //                 {
    //                     path: 'assigningUsers',
    //                     component: assigningUsers,
    //                     name: '角色分配',
    //                     meta: {name: '角色分配'},
    //                     hidden: true
    //                 },
    //             ]
    //         },
    //         {
    //             path: 'sysUser',
    //             component: sysUser,
    //             name: '用户授权',
    //             meta: {name: '用户授权'},
    //         },
    //         {
    //             path: 'saasOrganization',
    //             component: saasOrganizationIndex,
    //             redirect: 'saasOrganization/index',
    //             name: '组织管理',
    //             meta: {name: '组织管理'},
    //             children: [
    //                 {
    //                     path: 'index',
    //                     component: saasOrganization,
    //                     name: '组织列表',
    //                     meta: {name: '组织列表'},
    //                     hidden: true
    //                 },
    //                 {
    //                     path: 'users',
    //                     component: saasOrganizationUser,
    //                     name: '关联用户',
    //                     meta: {name: '关联用户'},
    //                     hidden: true
    //                 },
    //             ]
    //         },
    //         // {
    //         //     path: 'structure',
    //         //     component: wcSystemStructure,
    //         //     name: '组织架构',
    //         //     meta: {role: ["SystemConfig.Company"], name: '组织架构'}
    //         // },
    //         // {
    //         //     path: 'users-manage',
    //         //     component: account,
    //         //     name: '用户管理',
    //         //     meta: {role: ['SystemConfig.SystemUser'], name: '用户管理'}
    //         // },
    //
    //         // {
    //         //     path: 'roles-manage',
    //         //     component: blankView,
    //         //     redirect: 'roles-manage/main',
    //         //     meta: {role: ['SystemConfig.UserRole']},
    //         //     name: '角色管理',
    //         //     children: [
    //         //         {path: 'main', component: rolesManage, name: ''},
    //         //         {
    //         //             path: 'edit-role/:id',
    //         //             component: editorCharacter,
    //         //             name: '编辑用户角色',
    //         //             meta: {name: '编辑用户角色'},
    //         //             hidden: true
    //         //         },
    //         //         {
    //         //             path: 'new-role',
    //         //             component: editorCharacter,
    //         //             name: '新建用户角色',
    //         //             meta: {name: '新建用户角色'},
    //         //             hidden: true
    //         //         },
    //         //     ],
    //         //     meta: {role: ['SystemConfig.UserRole'], name: '角色管理'}
    //         // },
    //
    //
    //         {path: 'company', component: company , name: '企业管理', meta: {name:'企业管理'}},
    //
    //         {path: 'dataDictionary', component: dataDictionary , name: '数据字典', meta: {name:'数据字典'}},
    //
    //         {path: 'operationManage', component: operationManage , name: '操作管理', meta: {name:'操作管理'}},
    //     ]
    // }


    // 基础管理 暂时注释，使用鉴权中心前端管理页面
    {
        path: '/system',
        systemCodes: ['WECHAT','DEALER','AUTH'],
        component: Layout,
        redirect: '/system/structure',
        name: '鉴权中心',
        icon: 'stealth',
        meta: {name: '鉴权中心', role: ["M2018081vvbujttos"]},
        children: [
            {
                path: 'module-manage',
                component: moduleManage,
                name: '模块管理',
                meta: {name: '模块管理',role:["AUTH_MODULE"]}
            },
            // {
            //     path: 'role',
            //     component: roleIndex,
            //     redirect: 'role/index',
            //     name: '角色管理',
            //     meta: {name: '角色管理',role:["AUTH_ROLE"]},
            //     children: [
            //         {
            //             path: 'index',
            //             component: role,
            //             name: '角色列表',
            //             meta: {name: '角色列表'},
            //             hidden: true
            //         },
            //         {
            //             path: 'assigningUsers',
            //             component: assigningUsers,
            //             name: '角色分配',
            //             meta: {name: '角色分配'},
            //             hidden: true
            //         },
            //     ]
            // },
            // {
            //     path: 'sysUser',
            //     component: sysUser,
            //     name: '用户授权',
            //     meta: {name: '用户授权',role:["AUTH_USER_PERMIT"]},
            // },
            // {
            //     path: 'saasOrganization',
            //     component: saasOrganizationIndex,
            //     redirect: 'saasOrganization/index',
            //     name: '组织管理',
            //     meta: {name: '组织管理',role:["SAAS_ORGANIZATION"]},
            //     children: [
            //         {
            //             path: 'index',
            //             component: saasOrganization,
            //             name: '组织列表',
            //             meta: {name: '组织列表'},
            //             hidden: true
            //         },
            //         {
            //             path: 'users',
            //             component: saasOrganizationUser,
            //             name: '关联角色',
            //             meta: {name: '关联角色'},
            //             hidden: true
            //         },
            //     ]
            // },

            {path: 'company', component: company , name: '企业管理', meta: {name:'企业管理',role:["SAAS_CORP"]}},

            {path: 'dataDictionary', component: dataDictionary, name: '数据字典', meta: {name: '数据字典',role:["DICTIONARY"]}},
            //
            {path: 'operationManage', component: operationManage, name: '操作管理', meta: {name: '操作管理',role:["AUTH_OPERATOR"]}}
        ]
    },
]
export default new Router({
    routes: routes
})

//全局组件
import breadcrumb from 'components/breadcrumb/breadcrumb.vue'

Vue.component('breadcrumb', breadcrumb)

import pagination from 'components/pagination/pagination.vue'

Vue.component('pagination', pagination)

import smallPagination from 'components/smallPagination/smallPagination.vue'

Vue.component('smallPagination', smallPagination)

import organizationTree from 'components/organization-tree/organizationTree.vue'

Vue.component('organizationTree', organizationTree)

import MaterialSelectBox from 'components/materialSelectBox/materialSelectBox.vue'

Vue.component('MaterialSelectBox', MaterialSelectBox)


import CardSelectBox from 'components/cardSelectBox/cardSelectBox.vue'

Vue.component('CardSelectBox', CardSelectBox)

import FansTagSelectBox from 'components/fansTagSelectBox/fansTagSelectBox.vue'

Vue.component('FansTagSelectBox', FansTagSelectBox)

import FansGroupSelectBox from 'components/fansGroupSelectBox/fansGroupSelectBox.vue'

Vue.component('FansGroupSelectBox', FansGroupSelectBox)
