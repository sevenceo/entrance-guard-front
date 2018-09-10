/**
 * Created by Micheal Xiao on 2017/10/12.
 */

import Vue from 'vue'

export default Vue.component('my-component', {
    // template: this.item,

    data(){
        return{
            msg: 'hello',
            // item: null,
            rendTpl: null,
            getData: false
        }
    },
    render: function(createElement) {
        if (!this.getData) {
            return createElement('div', '<span>loading...</span>');
        } else {
            return this.rendTpl();
        }
    },
    // render: res.render,
    // staticRenderFns: res.staticRenderFns
    props:['item'],
    watch:{
        item: function (val, oldVal) {
            console.log(val)
            let self = this;
            if(val){
                self.getData = true;
                self.rendTpl = Vue.compile(val).render;
            }
        }  
    },
    mounted() {
        console.log(this.item)
        let tpl = "<div><span>test</span></div>"
        console.log(tpl)
        // let tpl = "<div data-v-36ee7d26=\"\"><span data-v-36ee7d26=\"\">test</span></div>"
        this.rendTpl = Vue.compile(tpl).render;
        this.getData = true;
        // let self = this;
        // setTimeout(function() {
        //     self.item = true;
        //     self.rendTpl = Vue.compile('<div><span>{{ msg }}</span></div>').render;
        // }, 1000);
    }
})