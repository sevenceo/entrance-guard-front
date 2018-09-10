/**
 * Created by Micheal Xiao on 2017/8/2.
 */
export default {
    getList: () => ({
        "msg": "执行成功!",
        "data": {
            account: Math.random().toString().slice(2),
            activityCode: Math.random().toString().slice(2),
            activityName: Math.random().toString().slice(2),
            activityTemplateCode: Math.random().toString().slice(2),
            activityTemplateName: Math.random().toString().slice(2),
            activityTypeCode: Math.random().toString().slice(2),
            activityTypeName: Math.random().toString().slice(2),
            activityRegionId: Math.random().toString().slice(2),
            activityRegionName: Math.random().toString().slice(2),
            beginDate: Math.random().toString().slice(2),
            endDate: Math.random().toString().slice(2),
            description: Math.random().toString().slice(2),
            jsonDataDetail: {
                qrDTOS: [
                    {
                        qrCodeName: '默认二维码',
                        qrUrl: Math.random().toString().slice(2),
                        scene: Math.random().toString().slice(2),
                        materialId: Math.random().toString().slice(2),
                        materialName: Math.random().toString().slice(2),
                        materialType: Math.random().toString().slice(2),
                        materialContent: '{"picUrl":"","url":"","mediaId":"","serverUrl":"","content":""}',
                        organDTOS: [
                            {
                                organName: "",
                                qrCodeName: "",
                                tel: ""
                            }
                        ]
                    },
                ],
                carSeriesDTOS: [{
                    dossSend: Math.random().toString().slice(2),
                    seriesName: Math.random().toString().slice(2),
                    seriesEnName: Math.random().toString().slice(2),
                    dossCode: Math.random().toString().slice(2)
                }]
            },
            templateDTO : {
                "templateCode" : "001",
                "templateName" : "扫码活动留资",
                "tabs" : [ {
                    "tabEnName" : "basic",
                    "tabName" : "基本信息",
                    "tabCode" : "01"
                }, {
                    "tabEnName" : "qrCode",
                    "tabName" : "二维码",
                    "tabCode" : "02"
                }, {
                    "tabEnName" : "organ",
                    "tabName" : "经销商",
                    "tabCode" : "03"
                }, {
                    "tabEnName" : "series",
                    "tabName" : "关联车系",
                    "tabCode" : "04"
                }, {
                    "tabEnName" : "customer",
                    "tabName" : "留资报表",
                    "tabCode" : "05"
                }, {
                    "tabEnName" : "statistics",
                    "tabName" : "统计报表",
                    "tabCode" : "06"
                } ]
            }
        }
        ,
        "code": "1000",
        "timestamp": 0
    })
};