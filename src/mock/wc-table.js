/**
 * Created by zhaimaojin on 2017/8/1.
 */
import Mock from 'mockjs';


const List = [];
const count = 20;


for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        name: '联蔚公众号',
        account: '112233',
        organizationId: '联蔚',
        headImgUrl: '123.img',
        appId: '123'
    }));
}

export default {
    getList: () => List
}