import store from 'store';
import Vue from 'vue'

const permission = {
    state: {
        permissionRoutes: []
    },
    mutations:{
        INIT_PERMISSION: (state, permissionRoutes) => {
            state.permissionRoutes = permissionRoutes
        },
    },


    actions: {
        InitPermission: ({commit}, data) => {
            const { roles, router } = data;
            let routerArr = $.extend(true, [], router)
            let permissionRoutes = routerArr.filter(v => {
                // if (roles.indexOf('ROLE_ADMIN') >= 0) return true;
                if (hasPermission(roles, v)) {
                    if (v.children && v.children.length > 0) {
                        v.children = v.children.filter(child => {
                            if (hasPermission(roles, child)) {
                                return true
                            }
                            return false;
                        });
                        return true
                    } else {
                        return true
                    }
                }
                return false;
            });
            commit('INIT_PERMISSION',permissionRoutes)
        },
    },
    hasPermission(roles, route) {
        if (route.meta && route.meta.role) {
            return roles.some(role => route.meta.role.indexOf(role) >= 0)
        } else {
            return true
        }
    },
    hasAuthority(permitRoles){

        if(typeof permitRoles === "string"){
            permitRoles = [permitRoles]
        }
        return store.getters.roles.some(role => permitRoles.indexOf(role) >= 0)
        // console.log("用户权限")
        // console.log(store.getters.roles)
    }
};

function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
        return true
    }
}

export default permission;

//全局绑定
Vue.prototype.hasAuthority = permission.hasAuthority
