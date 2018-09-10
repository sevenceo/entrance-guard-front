/**
 * Created by xinquan.yu on 2017/6/13.
 */

 import { MessageBox } from 'element-ui';
 import Vue  from 'vue';

export function confirmInfo(){

    Vue.$confirm('此操作将会删除该记录，是否继续？', '提示', {confirmButtonText: '确定',
        cancelButtonText: '取消', type: 'warning'}).then(() => {

        }).catch(() => {

        });

    }




