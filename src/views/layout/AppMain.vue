<template>
        <!--<el-tabs v-model="curRouteName" type="card" @edit="handleTabsEdit" @tab-click="handleClick"-->
                 <!--class="mt-10">-->
            <!--<el-tab-pane class="tabs"-->
                         <!--:key="item.name"-->
                         <!--v-for="(item, index) in reactTabs.tabs"-->
                         <!--:label="item.name"-->
                         <!--:name="item.name"-->
                         <!--:closable="item.name == '首页' ? false : true"-->
                         <!--:path="item.path">-->
                <!--<div slot="label" :path="item.path" class="h100 l-block">-->
                    <!--<span>{{item.name}}</span>-->
                <!--</div>-->
            <!--</el-tab-pane>-->
        <!--</el-tabs>-->
        <!--<transition name="fade" mode="out-in">-->
            <router-view class="app-main"></router-view>
        <!--</transition>-->
</template>

<script>

    import Router from 'router';
    let reactTabs = {};

    export default {
        data() {
            reactTabs = this.$store.state.tabs
            return {
                reactTabs,
                curRouteName:"首页"
            }
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchCurRoute'
        },
        methods: {
            handleTabsEdit(targetName, action) {
                if (action === 'remove') {
                    let tabs = [...reactTabs.tabs]
                    let activeName = this.curRouteName, activePath;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
//                                    activeName = nextTab.name;
                                    activePath = nextTab.path
                                }
                            }
                        });
                    }
                    this.$store.commit('SET_TABS', tabs.filter(tab => tab.name !== targetName))
                    //this.$store.commit('SET_CUR_TAB', activeName)
                    Router.push({path: activePath})
                }
            },
            handleClick(tab, event){
                console.log($(event.currentTarget))
                Router.push($(event.currentTarget).children("div").attr("path"))
            },
            openMenu: function(e) {
                console.log(e.currentTarget)
//                this.viewMenu = true;
//
//                Vue.nextTick(function() {
//                    this.$$.right.focus();
//
//                    this.setMenu(e.y, e.x)
//                }.bind(this));
                e.preventDefault();
            },
            fetchCurRoute () {
//                console.log("this.$route")
//                console.log(this.$route)
                if(this.$route.matched[1].name){
                    this.curRouteName = this.$route.matched[1].name
                    return
                }else if(this.$route.name){
                    this.curRouteName = this.$route.name
                    return
                }else if(this.$route.matched[0].name){
                    this.curRouteName = this.$route.matched[0].name
                }

            }
        },
        name: 'AppMain',
        computed: {
            key() {
                return this.$route.name !== undefined
                        ? this.$route.name + +new Date()
                        : this.$route + +new Date()
            },


        }
    }
</script>

<style>
    .app-main{
        margin-top: 58px;
        width: 100%;
        height: 90%;
    }
</style>
