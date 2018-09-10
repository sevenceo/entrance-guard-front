import fetch from 'utils/fetch';
import {Message} from 'element-ui'

export function checkIsPlat(data){
    return fetch({
        url: 'attendance/checkIsPlat',
        method: 'get'
    }).then(function (response) {
        return response.data
    });
}

export function holidaycalendar(data){
    return fetch({
        url: 'attendance/HolidayCalendar?resourceId='+data.resourceId+'&checkDate='+data.checkDate,
        method: 'POST'
    }).then(function (response) {
        return response.data
    });
}

export function updateById(id,data){
    return fetch({
        url:"attendance/holiday/"+id,
        method:"PATCH",
        data:data
    }).then(function (response) {
        return response.data
    });
}
