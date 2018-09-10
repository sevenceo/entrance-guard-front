<template>
    <div>
        <h1>tab page {{this.$route.params.tabId}}</h1>
        <input type="text">
        <router-link to="/demo">Go to demo</router-link>
    </div>
</template>

<script>
export default{
    data(){
        return{
            text:"test 1"
        }
    }
}
</script>