const weChatAccount= {
    state: {
        isParent:false,
        showAccountDialog:false,
        accountInfo:{}
    },
    mutations: {
        SET_ACCOUNT : (state,isParent) => {
            state.isParent = isParent
            // console.log(formData)
        },
        SET_ACC_DIALOG: (state,showAccountDialog) => {
            state.showAccountDialog = showAccountDialog
        },
        SET_ACCOUNT_INFO: (state,accountInfo) => {
            // console.log(111);
            // console.log(accountInfo);
            state.accountInfo = accountInfo
        }
        // SET_DELETE : (state,deleteData) => {
        //     state.deleteData = deleteData
        // }
    }
}

export default weChatAccount;