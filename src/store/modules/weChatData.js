/**
 * Created by zhaimaojin on 2017/8/16.
 */

const weChatData= {
    state: {
        formData:[],
        deleteData: []
    },
    mutations: {
        SET_DATA : (state,formData) => {
            state.formData = formData
            // console.log(formData)
        },
        // SET_DELETE : (state,deleteData) => {
        //     state.deleteData = deleteData
        // }
    }
}

export default weChatData;