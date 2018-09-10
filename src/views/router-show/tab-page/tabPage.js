/**
 * Created by Micheal Xiao on 2017/6/6.
 */
import Router from 'router'
import store from 'store'

export default {
    data() {
        return {
            editableTabsValue: this.$route.params.tabId,
            editableTabs: store.getters.expTabs,
            tabIndex: store.getters.expTabs.length
        }
    },
    methods: {
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex + '';
                let newTab = {
                    title: 'New Tab',
                    name: newTabName,
                }
                // this.editableTabs.push(newTab);
                store.dispatch('AddExpTab',newTab)
                // this.editableTabsValue = newTabName;
            }
            if (action === 'remove') {

                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                store.dispatch('SetExpTab',this.editableTabs)
            }
        },
        handleClick(tab, event){
            Router.push({name:'TAB展示',params:{tabId:tab.name}})
        }

    }
}