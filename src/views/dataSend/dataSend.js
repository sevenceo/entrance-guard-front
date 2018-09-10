import {getCommunity,dataSend} from "./api/dataSendApi.js"

export default {
    created() {
        this.getCommunities();
    },
    data() {
        return{
            community:[],
            params:{
                resourceId:''
            }
        }
    },
    components: {
        //etc...
    },
    methods: {
        getCommunities(){
            getCommunity()
                .then((response) =>{
                    this.community = response.data;
            });
        },
        send(){
            dataSend()
                .then((reps) =>{

                });
            console.log(this.params);
        }
    }
}