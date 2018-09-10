import axios from 'axios';
import {Message} from 'element-ui';
import store from '../store';
// import router from '../router';
import Vue from '../main'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 10000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {


    // Do something before request is sent
    store.commit('SET_ONXHR')
    //let corp = this.$store.state.user.user.corporation;
    //console.log(corp);
    if (store.getters.token) {
        config.headers['token'] = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    // if (store.getters.user) {
    //     console.log(store.getters.user);
    // }

    /*if (store.getters.corporation) {
        config.headers['tenant-id'] = store.getters.corporation.id;
        //console.log(store.getters.corporation);
    }*/

    if (store.getters.user.user.id) {
        config.headers['x-uid'] = store.getters.user.user.id;
    }

    if (store.getters.user.user.roles) {
        if (store.getters.user.user.roles.length > 0) {
            let roleType= store.getters.user.user.roles[0].roleType;
            if(roleType =='ORG'){   //  组织
                if (store.getters.user.user.extend) {
                    if (store.getters.user.user.extend.brands.length > 0) {
                        config.headers['x-org-id'] = store.getters.user.user.extend.brands[0].id;
                    }
                }
            }
            if(roleType =='CORP'){  //  企业
                if (store.getters.corporation) {
                    config.headers['tenant-id'] = store.getters.corporation.id;
                    //console.log(store.getters.corporation);
                }
            }

            if(roleType=='PLATFORM'){   //  平台

            }
        }
    }

    if (!!!config[`Content-Type`]) {
        config[`Content-Type`] = "application/json";
    }

    //Add by huyuezheng  统一添加网关的token 2018.03.13 16：26
    // if(store.getters.accessToken){
    //     config.headers['token'] = store.getters.accessToken;
    // }

    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    response => {
        store.commit('SET_NOTXHR')
        console.log("qweqweqw")
        if (response.headers && response.headers['content-disposition'] && (response.headers['content-disposition'].indexOf('attachment;') != -1)) {
            return response;
        }
        const code = response.data.code;

        // -1:业务异常
        if (code === -1) {
            console.log(response.data.msg);

            Message({
                message: response.data.msg,
                type: 'error',
                customClass: 'msg-error',
                iconClass: 'ic'
            })

            // Message({
            //     message: response.data.msg,
            //     type: 'error',
            //     duration: 5 * 1000
            // });

            return false;
        }
        else if (code == 6001) {
            Message({
                message: response.data.msg,
                type: 'error',
                customClass: 'msg-error',
                iconClass: 'ic'
            })
            // 登出
            store.dispatch('FedLogOut').then(() => {
                router.push({path: '/login'})
            });
        }
        else {
            return response
        }
    }
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    // const code = response.data.code;
    // // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
    // if (code === 50008 || code === 50014 || code === 50012) {
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   });
    //   // 登出
    //   store.dispatch('FedLogOut').then(() => {
    //     router.push({ path: '/login' })
    //   });
    // } else {
    //   return response
    // }
    ,
    error => {
        store.commit('SET_NOTXHR')
        console.log("fetch ERR")
        console.log(error)

        let msg = ""
        if (error.response.status === 504) {
            msg = '请求超时'
        } else {

            if (typeof error.response.data.description === 'string') {
                msg = error.response.data.description
            } else {
                msg = error.response.data.description[0]
            }
        }
        const h = Vue.$createElement;
        let remsg = h('p', null, [
            h('span', null, msg),
            h('br'),
            h('span', {class: 'errorCode'}, '错误码： ' + error.response.data.errorId)
        ])
        Message({
            message: remsg,
            type: 'error',
            duration: 5 * 1000,
            showClose: true,
            customClass: 'msg-error',
            iconClass: 'sc'
        });


        return Promise.reject(error);
    }
)

export default service;
