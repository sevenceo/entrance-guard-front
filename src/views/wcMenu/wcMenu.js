/**
 * Created by zhaimaojin on 2017/8/1.
 */

import{GetMenuData, SaveMenuData, TestError} from "./api/wcMenuApi"
import menuGroup from "./components/menu-group/menuGroup.vue"
import store from "store"
import {isEmptyObject} from "utils"

export default {
    created(){
        this.getMenuData()
    },
    components:{
        menuGroup,
    },
    data(){
        return {

            isNavigation: false,
            wcButtonVisible: true,
            wcButtonSection: {},
            isAdmin : true,
            // visibleItems: ['first','second','third'],
            // status: ''
        }
    },
    methods: {
        testError(){
            TestError()
        },
        toggleVisible(index){
            let _showIndex = index;
            this.$store.commit('SET_SHOW_INDEX', _showIndex)
        },
        getMenuData(){
            store.dispatch("GetWeChatMenu");
        },
        handleSave(){
            let postMenuData = {};
            for(let n in this.menuData){
                postMenuData[n] = trimGroupData(this.menuData[n])
            }
            // console.log(postMenuData)
            SaveMenuData(postMenuData)
                .then(()=>{
                    this.getMenuData()
                    this.$message({
                        type: 'success',
                        message: `保存成功`,
                        customClass:'msg-success',
                        iconClass:'ic'
                    })
                })
        },
        refresh(){
            this.getMenuData()
        }
    },
    computed:{
        menuData(){
            return store.state.weChatMenu.menuData
        },
        prevMenuData(){
            // return store.getters.prevMenuData
            return store.state.weChatMenu.prevMenuData
        },
        showIndex(){
            return store.state.weChatMenu.showIndex
        },
        prevTrueLength(){
            return this.prevMenuData.filter((v)=>{
                if(isEmptyObject(v)){
                    return false;
                }else{
                    return true
                }
            }).length
        }
    }
}

function trimGroupData(groupData) {
    let reGroupData = [];
    groupData.forEach(function (v) {
        if(!isEmptyObject(v)){
            reGroupData.push(v)
        }
    })
    return reGroupData
}
