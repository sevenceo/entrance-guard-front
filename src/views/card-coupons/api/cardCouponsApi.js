import fetch from 'utils/fetch';
import {Message} from 'element-ui'
export function GetCardsList(account,page) {
    var p_= page.page - 1
    var s_= page.size
    let params;
    if(page){
        params = {
            page: p_,
            size:s_,
        }
    }
    return  fetch({
        url: '/card-service/api/card/accounts/'+account,
        method: 'post',
        params: params,
        data:{
            cardTitle:page.cardTitle,
            exp:page.exp
        }
    }).then(function (result) {
        // console.log("卡券列表接口")
        return result
    })
}

export function  GetCardData(account, cardId){
    return  fetch({
        url: '/card-service/api/card/card/'+account+'/'+cardId,
        method: 'get'
    }).then(function (result) {
        // console.log("卡券信息接口")
        return result
    })
}
export function  GetCardImage(account, cardId){
    return  fetch({
        url: '/card-service/api/card/qryImage/'+account+'/'+cardId,
        method: 'get'
    }).then(function (result) {
        // console.log("卡券信息接口")
        return result
    })
}
//删
export function DeleteCard(account, cardId){
    return fetch({
        url: '/card-service/api/card/'+account+'/'+cardId,
        method: 'delete',
    }).then(function (result) {
        Message({
            message: '删除成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })

}

//增
export function CreateCard(account,data,accountImg,coverImg) {
    var data2={
        card:{},
        logoUrl:accountImg,
        coverImg:coverImg
    }
    data2.card=data

    return fetch({
        url: '/card-service/api/card/'+account,
        method: 'post',
        data: data2
    }).then(function (result) {
        Message({
            message: '创建成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}


//改
export function EditCard(account,cardId,id,data,accountImg) {
    var data2={
        card_id:'',
        logoUrl:accountImg,
        general_coupon:{
            // base_info:{}
        }
    }
    data2.general_coupon=data.general_coupon
    data2.card_id=cardId

    return fetch({
        url: '/card-service/api/card/'+account+'/'+cardId+'/'+id,
        method: 'put',
        data: data2
    }).then(function (result) {
        Message({
            message: '修改成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}

// 刷新卡券列表接口
export function GetRefreshResult(account) {
    return  fetch({
        url: '/card-service/api/card/syn-account/' + account,
        method: 'get'
    }).then(function (result) {
        return result
    })
}



//改
export function EditSkuNum(account,cardId,id,data) {

    return fetch({
        url: '/card-service/api/card/'+account+'/'+cardId+'/'+id+'/modifystock',
        method: 'post',
        data: data
    }).then(function (result) {
        return result
    })
}
export function  GetCardReport(account, cardParam){
    // var data={
    //     account:account,
    //     info:cardParam
    // }
    return  fetch({
        url: '/card-service/api/card/getcardbizuininfo/'+account,
        method: 'post',
        data: cardParam
    }).then(function (result) {
        // console.log("卡券信息接口")
        return result
    })
}
