/**
 * Created by Micheal Xiao on 2017/10/22.
 */
const weChatArticle= {
    state: {
        focusEle: focusEleInit(),
        hasFocusEle:false,
    },
    mutations: {
        SET_FOCUSELE : (state, focusEle) => {
            state.focusEle = focusEle;
            state.hasFocusEle = true;
        },
        CLEAR_FOCUSELE : (state) => {
            state.focusEle = focusEleInit();
            state.hasFocusEle = false;
        },

    }
}

export default weChatArticle;

function focusEleInit(){
    return {
        element: '',
        cellType: '',
    }
}
