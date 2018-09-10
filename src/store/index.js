/**
 * Created by Micheal Xiao on 2017/5/19.
 */

import 'es6-promise/auto'
import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import tabs from './modules/tabs';
import weChatMenu from './modules/weChatMenu';
import weChatData from './modules/weChatData';
import weChatAccount from './modules/weChatAccount';
import weChatArticle from './modules/weChatArticle';
import weChatActivityData from './modules/weChateActivity';
import getters from './getters';
import permission from './permission'
import {subMenuData} from './modules/weChatMenu'
Vue.use(Vuex);

const myPlugin = store => {
    // 当 store 初始化后调用
    store.subscribe((mutation, state) => {
        // 每次 mutation 之后调用
        // mutation 的格式为 { type, payload }
        subMenuData(mutation)
        // if(mutation.type === "SET_MENU" || mutation.type === "SET_MENU_BUTTON" || mutation.type === "CLEAN_MENU_GROUP"){
        //     console.log("mutation")
        //     co nsole.log(mutation)
        // }
    })
}

const store = new Vuex.Store({
    modules: {
        app,
        user,
        tabs,
        weChatAccount,
        weChatMenu,
        permission,
        weChatData,
        weChatArticle,
        weChatActivityData
    },
    getters,

    plugins: [myPlugin],
});

// vuex watch 调用示例

// store.watch((state) => state.weChatMenu.menuData, (oldValue, newValue) => {
//     console.log('search string is changing')
//     console.log(oldValue)
//     console.log(newValue)
// })

export default store


