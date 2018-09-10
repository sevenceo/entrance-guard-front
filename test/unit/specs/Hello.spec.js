import Vue from 'vue'
import Hello from '@/components/Hello'

describe('Hello.vue', () => {
    const Constructor = Vue.extend(Hello)
    const vm = new Constructor().$mount()
    it('should render correct contents', () => {

        expect(vm.$el.querySelector('.hello h1').textContent)
            .to.equal('Welcome to Your Vue.js App')
    })
})
