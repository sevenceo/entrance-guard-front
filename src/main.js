import 'normalize.css/normalize.css';// normalize.css 样式格式化
import 'element-ui/lib/theme-chalk/index.css' //element默认样式
import 'assets/styles/index.scss'; // 全局自定义的css样式
import 'assets/styles/commen.css';
import 'assets/iconfont/iconfont'; // iconfont
import 'components/Icon-svg/index'; // 封装的svg组件
import './directives'; // 自定义指令
import 'components'; // 自定义全局组件
import Mock from './mock/index.js';  // 使用mockjs模拟接口数据
// Mock.bootstrap();
// import './views/add-pic/WeChatEdit/WeChatEdit.js'
// import 'vue2-animate/dist/vue2-animate.css';
// import Velocity from 'velocity-animate';

import 'babel-polyfill'; // 暴力fix IE js 兼容问题

import Vue from 'vue'
import ElementUI, {Message} from 'element-ui'


import App from './App'
import router from './router';

import store from './store';
import permission from 'store/permission';
import * as filters from './filters'; // 全局vue filter

import VueStomp from "vue-stomp";
Vue.use(VueStomp)

import VJstree from 'vue-jstree';
Vue.use(VJstree);

import $ from 'jquery';

Vue.config.productionTip = false
Vue.use(ElementUI)
require('babel-core/register');
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd', '/register'];// 不重定向白名单
router.beforeEach((to, from, next) => {
    // console.log("循环计数")
    if (store.getters.token) { // 判断是否有token
        // console.log("有token")
        hasUserInfo()
            .then(function () {
                if (to.meta && to.meta.role) {// 判断即将进入的页面是否需要权限
                    if (hasPermission(store.getters.roles, to.meta.role)) { // 判断权限
                        next(); // 有权限
                    } else {
                        next({path: '/401', query: {noGoBack: true}}); // 无权限
                    }
                } else {
                    next() //不需要权限
                }
            }, function () {
                store.dispatch('FedLogOut').then(() => {
                    next({path: '/login'})
                });
                // next('/login'); // 获取用户信息失败重定向到登录页
            })
    } else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login'); // 否则全部重定向到登录页
            // NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }

});

Vue.prototype.$message = function (data) {
    if (data.type === 'error') {
        Message({
            message: data.message,
            type: data.type,
            duration: 5 * 1000,
            showClose: true,
            customClass: 'msg-error',
            iconClass: 'sc'
        })
    } else {
        Message({
            message: data.message,
            type: data.type,
            customClass: 'msg-success',
            iconClass: 'ic'
        })
    }
}


//     Message({
//     message: remsg,
//     type: 'error',
//     duration: 0,
//     showClose: true,
//     customClass:'msg-error',
//     iconClass:'sc'
// });
//
// this.$message({
//     type: 'success',
//     message: `保存成功`,
//     customClass:'msg-success',
//     iconClass:'ic'
// })

// permissiom judge
function hasPermission(roles, permissionRoles) {
    // if (roles.indexOf('USER_ADMIN') >= 0) return true; // admin权限 直接通过
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

function hasUserInfo() {
    return new Promise((reslove, reject) => {
        if (store.getters.roles.length < 1) { // 判断当前用户是否已拉取完user_info信息
            store.dispatch('GetInfo').then(res => { // 拉取user_info
                if(res) {
                    const roles = res.data.role;
                    store.dispatch('InitPermission', { // 初始化权限
                        roles: store.getters.roles,
                        router: router.options.routes
                    })
                    reslove()
                }
            }, function () {
                reject()
            })
        } else {
            store.dispatch('InitPermission', { // 初始化权限
                roles: store.getters.roles,
                router: router.options.routes
            })
            // console.log("有role信息")
            reslove()
        }
    })

}

const app = new Vue({
    router,
    // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件，且子组件能通过 this.$store 访问到。
    store,
    render: h => h(App)
    ,data: {
        eventHub: new Vue()
    }
}).$mount('#app')

export default app


//刷新浏览器时重新定向到首页
// router.push({path:'/'})