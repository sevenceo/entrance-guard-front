/**
 * Created by Micheal Xiao on 2017/7/12.
 */
// 导入 Vue.js 和组件，进行测试
import Vue from 'vue'
// import demo from '@/components/demo.vue'

function add(x, y) {
    return x + y
}

describe('加法函数的测试', function() {
    it('1 加 1 应该等于 2', function() {
        expect(add(1, 1)).to.be.equal(2);
    });

    it('任何数加0等于自身', function() {
        expect(add(1, 0)).to.be.equal(1);
        expect(add(0, 0)).to.be.equal(0);
    });
});