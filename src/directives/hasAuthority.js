import Vue from 'vue';
import store from 'store';

Vue.directive('focus', {
    // When the bound element is inserted into the DOM...
    inserted: function (el) {
        // Focus the element
        el.focus()
    }
})

Vue.directive('authority', {

    bind: function (el, arg) {
        let permitRoles;
        if(typeof arg.value === "string"){
            permitRoles = [arg.value]
        }else{
            permitRoles = arg.value
        }
        if(store.getters.roles.some(role => permitRoles.indexOf(role) >= 0)){
            $(el).show()
        }else{
            $(el).hide()
        }
    }
})