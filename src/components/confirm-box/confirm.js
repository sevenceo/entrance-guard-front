/**
 * Created by Micheal Xiao on 2017/6/15.
 */
import { MessageBox } from 'element-ui';
import Vue from 'vue';

export default function ConfirmBox(message = "确认删除",title = "提示",type="warning",isCenter=false) {
    return MessageBox.confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type,
        center:isCenter
    })
}

Vue.prototype.ConfirmBox = ConfirmBox;