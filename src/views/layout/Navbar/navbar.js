/**
 * Created by Micheal Xiao on 2017/6/2.
 */
// import { GetOrganization } from "src/api/login";

import store from 'store';

export default {
    created() {
        let aInfo = localStorage.getItem("accountInfo");
        let aInfoObj = JSON.parse(aInfo);
        this.$store.commit('SET_ACCOUNT_INFO', aInfoObj);
        this.userName = store.getters.user.user.realName;
        console.log(this.userName);
        if (store.getters.user.user.roles) {
            if (store.getters.user.user.roles.length > 0) {
                let roleType = store.getters.user.user.roles[0].roleType;
                if (roleType == 'CORP' || roleType == 'PLATFORM') {  //  企业 or 平台
                    this.showDropDown = false;
                    this.currentOrgs = {};
                    this.orgName = '';
                    this.showOrg = false;
                }

                if (roleType == 'ORG') {   //  组织
                    if (store.getters.user.user.extend) {
                        if (store.getters.user.user.extend.brands.length > 0) {
                            this.currentOrgs = store.getters.user.user.extend.brands;
                            this.orgName = store.getters.user.user.extend.brands[0].brandName;

                            $(store.getters.user.user.extend.brands).each(function (i, e) {
                                $(e).attr("newName",subStr(e.brandName));
                            });
                            this.showOrg = true;
                        }
                        if (store.getters.user.user.extend.brands.length > 1) {
                            this.showDropDown = true;
                        }
                    }
                }
            }
        }
    },
    mounted() {
        // 改变样式
        if (this.currentOrgs.length > 1) {
            $('#org-dropdown').find("li").find('a').eq(0).css("background", "#0E9DBE");
        }
    },
    data() {
        return {
            activeIndex: '1',
            userID: '',
            userName:'',
        };
    },
    components: {
        // changeAccount
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
        },
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar')
        },
        logout() {
            this.ConfirmBox("确认退出？")
                .then(() => {
                    return this.$store.dispatch('LogOut')
                })
                .then(() => {
                    this.$router.push({path: '/login'})
                })
        },
        // 切换公众号
        changePublicId() {
            this.$emit('showDialogAccount', true);
        },
        editAdmin() {
            this.$emit('showDialogUser', true);
        },
        changeOrg(id) {

            $('#' + id).css("background", "#0E9DBE");
            $(store.getters.user.user.extend.brands).each(function (i, e) {
                let innerName = store.getters.user.user.extend.brands[i].brandName;
                if (e.id == id) {
                    this.orgName = innerName;
                    $('#showOrgName').html(innerName);
                }
                if (e.id == id && i != 0) {
                    store.getters.user.user.extend.brands.splice(i, 1);
                    store.getters.user.user.extend.brands.unshift(e);
                }
            });

            $('#org-dropdown').find("li").each(function (i, e) {
                if ($(e).find('a').attr('id') != id) {
                    $(e).find('a').css("background", "#46be94");
                }
            });

            // 跳转
            this.$router.push({path: '/guard/human', query: {_time: new Date().getTime()}});
            // 事件发送
            this.$root.eventHub.$emit('changeOrg', new Date().getTime());
        }
    }
}

function subStr(str) {
    if (str && str.length > 8) {
        return str.slice(0, 8).concat("...");
    } else {
        return str;
    }
}
