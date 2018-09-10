import fetch from 'utils/fetch';

export function SearchHuman(data){
    return fetch({
        url: 'dealer/human/getHumanForAttendance',
        method: 'POST',
        data: data
    }).then(function (result) {
        return result.data
    })
}

export function SearchAttenDanceHuman(data){
    return fetch({
        url: 'attendance/getHumanForAttendance',
        method: 'POST',
        data: data
    }).then(function (result) {
        return result.data
    })
}

export function SearchManagerHuman(data){
    return fetch({
        url: 'attendance/getManegerForAttendance',
        method: 'POST',
        data: data
    }).then(function (result) {
        return result.data
    })
}


//获取考勤人员
export function GetHuman(data){
    return fetch({
        url: 'attendance/getHuman/'+data+'/1/10',
        method: 'GET'
    }).then(function (result) {
        return result.data
    })
}


//添加考勤人员
export function AddHuman(data){
    let vo={
        humanIds:data.ids,
        id:data.id
    }
    return fetch({
        url: 'attendance/addHumanRel',
        method: 'POST',
        data:vo
    }).then(function (result) {
        return result.data
    })
}
