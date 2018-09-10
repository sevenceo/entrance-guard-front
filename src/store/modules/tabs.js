/**
 * Created by Micheal Xiao on 2017/6/8.
 */
import Vue from 'vue'

const tabs = {
    state: {
        tabs:[{
            path: "/",
            name: "首页",
        }],
        currentName:"首页"
    },

    mutations: {
        ADD_TAB: (state, tab) => {
            state.tabs.push(tab)
        },
        // SET_CUR_TAB: (state, name) => {
        //     state.currentName = name
        // },
        SET_TABS:(state, tabs) => {
            state.tabs = tabs
        },
    },

    actions: {
        AddTab({commit, state},tab){
            return new Promise(()=>{
                //commit('SET_CUR_TAB', tab.name)
                let bool = state.tabs.findIndex((val)=>{
                    if(val.name === tab.name){
                        return true
                    }
                })
                if(bool === -1){
                    //console.log("没有发现同路由")
                    commit('ADD_TAB', tab);
                }
                // else{
                //     commit('SET_CUR_TAB', tab.name);
                // }
            })
        },
    }
};




export default tabs;