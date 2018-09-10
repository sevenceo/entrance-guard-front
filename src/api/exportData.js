import fetch from 'utils/fetch';

export async function ExportData(url, method, params, fileName) {

   return fetch({
        url: url,
        method: method,
        params: method.toLowerCase() === 'get' ? params : null,
        data: method.toLowerCase() === 'post' ? params : null,
        responseType: "blob",
    }).then(res => {
        /*
        let contentDisp = res.headers['content-disposition']
        console.log("content-disposition", contentDisp)
        if (!!contentDisp && (contentDisp.endsWith(".xls") || contentDisp.endsWith(".xlsx"))) {
            contentDisp = contentDisp.replace("attachment;filename=","");
            contentDisp = decodeURIComponent(contentDisp);

        } else {
            contentDisp = "报表数据.xlsx";
        }
        let saveFileName = fileName || contentDisp;
        */
        let saveFileName = fileName || "报表数据.xlsx";
        var fileDownload = require('js-file-download');
        fileDownload(res.data, saveFileName);
    }).catch(error => {
        console.error(error)
        Message({
            message: "数据导出异常",
            type: 'error',
            customClass: 'msg-error',
            iconClass: 'ic'
        })
    })
}