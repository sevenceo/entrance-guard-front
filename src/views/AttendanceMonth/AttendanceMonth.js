export default {
    created(){
        this.found();
    },
    data() {
        return{
            corporationId:'',
            corporationName:'',
            rowTotal:0
        }
    },
    methods: {
        found(){
            var data=this.$store.state.user.corporation;
            this.corporationId=data.id;
            this.corporationName=data.corpName;
        }
    }
}