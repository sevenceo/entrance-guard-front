import fetch from 'utils/fetch';
import axios from 'axios';
import {Message} from 'element-ui';

export function register(data) {

  return axios({
    method: 'post',
    url: process.env.BASE_API + '/uaa/api/register',
    data: data,
    headers:{
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization" : "Basic d2ViX2FwcDo="
    }
  }).then(function (result) {
    return result
  },error => {
    console.log('err' + error);// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
        showClose: true,
        customClass:'msg-error',
        iconClass:'sc'
    });
    return Promise.reject(error);
  })
}

//export function getInfo(token) {
//  return fetch({
//    url: '/uaa/api/register',
//    method: 'get',
//    headers:{
//      "Authorization": token
//    }
//    // params: { token }
//  });
//}

