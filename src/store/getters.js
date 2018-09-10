/**
 * Created by Micheal Xiao on 2017/5/19.
 */
import store from "./index"

const getters = {
    sidebar: state => state.app.sidebar,
    // livenewsChannels: state => state.app.livenewsChannels,
    token: state => state.user.token,
    // avatar: state => state.user.avatar,
    name: state => state.user.name,
    //corp: state => state.user.user.corporation,
    // uid: state => state.user.uid,
    // email: state => state.user.email,ß
    // introduction: state => state.user.introduction,
    // auth_type: state => state.user.auth_type,
    // status: state => state.user.status,
    corporation: state => state.user.corporation,
    user: state => state.user,
    roles: state => state.user.roles,
    tabs: state => state.tabs.tabs,
    menuData: state => state.weChatMenu.menuData,
    plattAdmin: state => {
        return state.user.user.roles.some((v) => {
            if (v.permitLevel === 1) {
                return true
            }
        })
    }
    // setting: state => state.user.setting
};
export default getters

