/**
 * Created by Micheal Xiao on 2017/8/7.
 */
import Vue from 'vue'
import {GetMenuData} from 'views/wcMenu/api/wcMenuApi.js'
import store from '../index'
import {isEmptyObject} from 'utils'

const weChatMenu = {
    state: {
        menuData:{
            menuGroup01:[],
            menuGroup02:[],
            menuGroup03:[],
        },
        prevMenuData:[],
        showIndex : 0,
    },

    mutations: {
        SET_MENU:(state, menuData) => {
            state.menuData = menuData

            // let prevMenuData = []
            // commit('SET_PREV_MENU', prevMenuData)
        },

        SET_MENU_BUTTON:(state, buttonData) => {
            state.menuData['menuGroup0' + buttonData.group][buttonData.index] = buttonData;
        },
        CLEAN_MENU_BUTTON:(state, buttonData) => {
            state.menuData['menuGroup0' + buttonData.group][buttonData.index] = {}
        },
        CLEAN_MENU_GROUP:(state, group) => {
            let groupData = state.menuData['menuGroup0' + group]
            groupData.forEach(function (v, n) {
                groupData[n] = {}
            })
        },
        SET_PREV_MENU:(state, prevMenuData) => {
            state.prevMenuData = prevMenuData;
        },
        SET_SHOW_INDEX:(state, showIndex) =>{
            state.showIndex = showIndex;
        }
    },

    actions: {
        GetWeChatMenu({commit}) {
            return new Promise((resolve, reject) => {
                GetMenuData()
                    .then(response => {

                        let reMenuData = JSON.parse(response.data.menuButtonGroup)
                        // let reMenuData = response.data.data.weChatMenuButtonGroup
                        console.log(reMenuData)
                        let menuData = {}
                        for (let n in reMenuData) {
                            menuData[n] = reMenuData[n]
                            if(menuData[n].length < 6){
                                let dif = 6 - menuData[n].length
                                menuData[n] = completeMenu(menuData[n], dif)
                            }
                        }
                        console.log("处理之后的menu data")
                        console.log(menuData)
                        commit('SET_MENU', menuData)
                        resolve(response);
                    });
            });
        },
    }
};

function completeMenu(arr, dif) {
    let conArr = [];
    for(let i = 0; i < dif; i++){
        conArr.unshift({})
    }
    return conArr.concat(arr)
}

function trimButtons(buttons = []){
    let reButtons = []
    buttons.forEach(function (v, n) {
        if(v.text){
            reButtons.push(v.text)
        }
    })
    return reButtons
}

export default weChatMenu;
export function subMenuData(mutation) {
    let watchList = ["SET_MENU","SET_MENU_BUTTON","CLEAN_MENU_GROUP","CLEAN_MENU_BUTTON","SET_SHOW_INDEX"]
    // let showIndex = store.state.weChatMenu.showIndex;
    // store.commit("SET_SHOW_INDEX",showIndex)

    if(watchList.indexOf(mutation.type) != -1){
        // console.log("mutation")
        // console.log(mutation)
        // console.log(store.state.weChatMenu.menuData)
        let menuData = store.state.weChatMenu.menuData
        let prevMenuData = [];

        for(let n in menuData){
            if(!isEmptyObject(menuData[n][5])){
                prevMenuData.push({subButton:menuData[n].slice(5,6)[0],buttons:trimButtons(menuData[n].slice(0,5))})
            }else{
                prevMenuData.push({})
            }
        }

        store.commit("SET_PREV_MENU",prevMenuData)

    }
}