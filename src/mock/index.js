import Mock from 'mockjs';
import loginAPI from './login';
import remoteSearchAPI from './remoteSearch';
import wcAccountAPI from './wcAccountMock'
import wcMenuAPI from './wcMenuMock'
import roleManage from './roleManageMock'
import fansManage from './fansManageMock'
import dashboard from './dashboardMock'
import wcMaterial from './wc-material'
import artPhotoApi from './articlePhoto'
import wcActivityDataApi from './wcActivityData'

let baseApi = process.env.BASE_API
// // 登录相关
//Mock.mock(/\/accessToken/, 'post', loginAPI.loginByEmail);
// 获取用户信息
 Mock.mock(baseApi + '/uaa/api/users/current', 'get', loginAPI.getInfo)
// 传递公众号,判断公众号权限
 Mock.mock(/\/wechat-account\/api\/accounts\/default/, 'get', loginAPI.getAccountInfo);
 Mock.mock(/\/login\/logout/, 'post', loginAPI.logout);

//dashboard页面相关
 Mock.mock(/\/report-service\/api\/report\/dashboard/, 'get', dashboard.getDashboardData)

// 图文相关
Mock.mock(baseApi + '/material/api/tpls', 'get', artPhotoApi.getArtTps)

// // wc-account相关
Mock.mock(/\/WeChatAccount\/getWeChatAccount/, 'post', wcAccountAPI.getList);
Mock.mock(/\/accounts/, 'delete', wcAccountAPI.deleteAccount());
Mock.mock(/\/accounts/, 'post', wcAccountAPI.createAccount());
Mock.mock(/\/accounts/, 'put', wcAccountAPI.modifyAccount());

// wc-menu相关
Mock.mock(process.env.BASE_API + '/wechat-menu-service/api/menus/2', 'get', wcMenuAPI.getMenuData);
Mock.mock(/\/api\/menus/, 'put', wcMenuAPI.getMenuData);


// roles-manage
Mock.mock(/\/api\/roles\?pageNum/, 'get', roleManage.getList)
Mock.mock(/\/api\/roles\/\d/, 'get', roleManage.GetRole)
Mock.mock(/\/api\/roles\/modules/, 'get', roleManage.getCheckboxModules)


// roles-manage
Mock.mock(/\/api\/roles\?pageNum/, 'get', roleManage.getList)
Mock.mock(/\/api\/roles\/\d/, 'get', roleManage.GetRole)
Mock.mock(/\/api\/roles\/modules/, 'get', roleManage.getCheckboxModules)

// fans-manage
Mock.mock(/\/fans-service\/api\/fans/, 'get', fansManage.getFansList)
Mock.mock(/\/fans-service\/api\/fans\/gh_81afe2009c7b\/id11\/userinfo/, 'get', fansManage.getFansData)
Mock.mock(/\/fans-service\/api\/fans\/gh_81afe2009c7b\/id11\/event/, 'get', fansManage.getEventList)
Mock.mock(/\/report-service\/api\/report\/dashboard/, 'get', dashboard.getDashboardData);

// fans-msg-manage
 Mock.mock(/\/fans-msg-service\/api\/fans-msg/, 'get', fansManage.getFansMSGList)

Mock.mock(/\/fans-service\/api\/reply/, 'get', fansManage.getReplyList)
Mock.mock(/\/fans-service\/api\/reply\/data/, 'get', fansManage.getReplyData)
Mock.mock(/\/fans-service\/api\/fans\/gh_81afe2009c7b\/id11\/event/, 'get', fansManage.getEventList)

Mock.mock(baseApi + '/activity/api/we-chat-activity/', 'get', wcActivityDataApi.GetActivityById)



export default Mock;

// import mock from './mock';
//
// export default mock;
