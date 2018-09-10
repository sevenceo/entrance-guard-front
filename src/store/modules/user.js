import {loginByEmail, logout, getInfo, accessToken} from 'api/login';
import Cookies from 'js-cookie';

import {Message} from 'element-ui'

const user = {

    state: {
        adminLevel: '',
        userLevel: '',
        user: {
            roles: []
        },
        corporation: {},
        status: '',
        email: '',
        uid: '',
        token: Cookies.get('X-Ivanka-Token'),
        accessToken: Cookies.get('SET_ACCESS_TOKEN'),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        },
        organizationName: '',
        showUserDialog: false
    },

    mutations: {
        SET_ADMIN_LEVEL: (state, level) => {
            state.adminLevel = level;
        },
        SET_USER_LEVEL: (state, userLevel) => {
            state.userLevel = userLevel;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        LOGIN_SUCCESS: () => {
            console.log('login success')
        },
        SET_USER: (state, user) => {
            state.user = user;
        },
        SET_CORPORATION: (state, corporation) => {
            //debugger
            state.corporation = corporation;
        },
        SET_ORGANIZATIONNAME: (state, organizationName) => {
            state.organizationName = organizationName;
        },
        SET_USER_DIALOG: (state, showUserDialog) => {
            "use strict";
            state.showUserDialog = showUserDialog;
        },
        SET_ACCESS_TOKEN: (state, token) => {
            state.accessToken = token;
        }
    },

    actions: {
        // accessToken() {
        //     return new Promise((resolve, reject) => {
        //         accessToken().then(data => {
        //             console.log('access token:' + data)
        //             //console.log(data);
        //             resolve();
        //         });
        //     });
        // },
        // 邮箱登录
        LoginByEmail({commit}, userInfo) {
            let self = this;
            const username = userInfo.username.trim();

            // accessToken().then(response => {
            //     const data = response.data;
            //     Cookies.set('SET_ACCESS_TOKEN', data.token);
            //     commit('SET_ACCESS_TOKEN', data.token);
            //     console.log("accessToken: " + data);
            //     //resolve();
            // });

            //accessToken


            return new Promise((resolve, reject) => {
                loginByEmail(username, userInfo.password)
                    .then(response => {
                        const data = response.data;

                        if (data.code != "0") {
                            reject({message: data.msg})
                            return;
                        }


                        let isok = false;
                        let host2 = document.domain;
                        if(data.corporation){
                            const corpId = data.corporation.id;
                            if (host2 && corpId && corpId != '0') {
                                // 企业或组织
                                if ((data.corporation.domainName).indexOf(host2) > -1) {
                                    isok = true;
                                }
                                /*if ((data.corporation.domain).indexOf(host2) > -1) {
                                    isok = true;
                                }*/
                            } else {
                                // 平台
                                isok = true;
                            }


                            if (!isok) {
                                reject({message: "用户名或密码错误!"})
                                return
                            }
                        }

                        Cookies.set('X-Ivanka-Token', data.token);
                        commit('SET_TOKEN', data.token);

                        getInfo(data.access_token).then(response => {
                            if (localStorage.getItem("isok")) {
                                if (response && response.data && response.data.data) {
                                    const data = response.data.data;
                                    commit('SET_USER', data);
                                    commit('SET_ROLES', data.service);
                                    commit('SET_NAME', data.userName);
                                    commit('SET_USER_LEVEL', data.userLevel);
                                    commit('SET_ORGANIZATIONNAME', data.organizationName)
                                    commit('SET_CORPORATION', data.corporation)
                                }
                            }
                        })
                        resolve();

                    });

            });


        },


        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                // console.log("token")
                // console.log(state.token)
                getInfo(state.token).then(response => {
                    if (response.data.code == '6001') {
                        commit('SET_TOKEN', '');
                        resolve();
                    }
                    else {
                        console.log("action 获取用户信息")
                        console.log(response)
                        var storage = window.localStorage;
                        storage.setItem("sysId", response.data.data.id);
                        const data = response.data.data;
                        commit('SET_USER', data);
                        commit('SET_ROLES', data.service);
                        commit('SET_NAME', data.userName);
                        commit('SET_USER_LEVEL', data.userLevel);
                        commit('SET_ORGANIZATIONNAME', data.organizationName)
                        commit('SET_CORPORATION', data.corporation)
                        // commit('SET_AVATAR', data.avatar);
                        // commit('SET_UID', data.uid);
                        // commit('SET_INTRODUCTION', data.introduction);
                        resolve(response);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },


        // 第三方验证登录
        LoginByThirdparty({commit, state}, code) {
            return new Promise((resolve, reject) => {
                commit('SET_CODE', code);
                loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
                    commit('SET_TOKEN', response.data.token);
                    Cookies.set('X-Ivanka-Token', response.data.token);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                console.log("登出")
                commit('SET_CORPORATION', {});
                commit('SET_USER', {
                    roles: []
                },)
                commit('SET_TOKEN', '');
                commit('SET_ROLES', []);
                Cookies.remove('X-Ivanka-Token');
                resolve();

            });
        },


        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('X-Ivanka-Token');
                resolve();
            });
        }
    }
}


export default user;
