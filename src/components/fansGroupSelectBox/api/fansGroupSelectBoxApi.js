import fetch from 'utils/fetch';

export function SearchGroupList(param,tags) {
    let page = {
        page:param.page-1,
        size:param.size
    }
    let dataParams = $.extend({},param);
    if(dataParams.state == '') {
        dataParams.state = 'NONE';
    }
    dataParams.tags = '';
    if(tags.length != 0) {
        for(var i = 0; i < tags.length; i++) {
            if(i==0) {
                dataParams.tags = tags[i].name;;
            } else {
                dataParams.tags = dataParams.chooseTags + ',' + tags[i].name;
            }
        }
    }
    // dataParams.createTime = new Date(getDate(dataParams.createTime));
    // dataParams.createTimeEnd = new Date(getDate(dataParams.createTimeEnd));
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/page/search/'+dataParams.master,
        method: 'post',
        params: page,
        data:dataParams
    }).then(function (response) {
        return response
    })
}