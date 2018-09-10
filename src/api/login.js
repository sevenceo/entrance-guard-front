import fetch from 'utils/fetch';
import axios from 'axios';
import {Message} from 'element-ui';
import ErrorConfig from './config/loginErrMsg.json'

export function loginByEmail(username, password) {

    password = encodeURIComponent(password)
    const data = "grant_type=password&username=" + username + "&password=" + password;
    return axios({
        method: 'post',
        url: process.env.BASE_API+'/accessToken',
        //url: process.env.BASE_API + '/uaa/oauth/token',
        data: data,
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "Basic d2ViX2FwcDo="
        }
    }).then(function (result) {
        if (result && result.data) {
            if (result.data.corporation) {
                localStorage.setItem("corpId", result.data.corporation.id);
            } else {
                localStorage.setItem("corpId", '0');
            }
        }
        return result
    }, error => {
        console.log("login ERR")
        console.log(error)
        console.log(ErrorConfig)
        if (ErrorConfig[error.response.data.error_description]) {
            Message({
                message: ErrorConfig[error.response.data.error_description],
                type: 'error',
                duration: 5 * 1000,
                showClose: true,
                customClass: 'msg-error',
                iconClass: 'sc'
            })
        } else {
            var message = error.response.data.error_description;
            if (error.response.data.error = 'unauthorized' && checkNumber(message)) {
                message = "用户名或密码错误！您还有" + message + "次机会。";
            }
            Message({
                message: message,
                type: 'error',
                duration: 10 * 1000,
                showClose: true,
                customClass: 'msg-error',
                iconClass: 'sc'
            })
        }

        return Promise.reject(error);
    })
}


export function getInfo(token) {
    return fetch({
        url: process.env.BASE_API + '/api/auth/users/current',
        method: 'get',
        headers: {
            "Authorization": token
        }
    });
}

// 获取当前用户的顶级组织结构树形节点信息
export function GetOrganization(uuid) {
    return fetch({
        url: '/organization/api/organizations/tree/' + uuid,
        method: 'get',
    }).then(function (result) {
        return result
    })
}

// 传递公众号,判断公众号权限
export function GetAccountInfo(aid) {
    return fetch({
        url: '/wechat-account/api/accounts/default?account=' + aid,
        method: 'get',
    }).then(function (result) {
        return result
    })
}

export function accessToken() {
    return fetch({
        method: 'post',
        url: process.env.BASE_API + '/accessToken?username=hypersmart&password=123456',
    }).then(function (result) {
        //console.log(result);
        return result;
        //return Promise.reject(result.data.token)
        //return result.data.token;
    }, error => {

        return Promise.reject(error);
    })
}

function checkNumber(theObj) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
        return true;
    }
    return false;
}


