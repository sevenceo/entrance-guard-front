<template>
    <span>{{rolesStr}}</span>
</template>

<script>
    export default{
        props: ["roles"],
        name:"trRoles",
        data(){
            return {
                rolesStr:""
            }
        },
        created(){

        },
        watch: {
            roles(){
//                console.log(this.roles)
                let rolesArr = []
                this.roles.row.roles.forEach((v)=>{
                    rolesArr.push(v.name)
                })
                this.rolesStr = rolesArr.join(',');
            }
        }
    }
</script>
<style scoped lang="scss">
</style>