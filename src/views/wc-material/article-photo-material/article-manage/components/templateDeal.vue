<template>
    <div @click="handleClick">
    </div>
</template>

<script>
    export default {
        props:["tpl"],
        methods:{
            handleClick(){
//                console.log(this.$el.innerHTML)
                let con = $(this.$el).find("[style-con]")
                console.log(con)
                if(con.length > 0){
                    this.$emit("selectTpl",con[0].innerHTML)
                }else{
                    this.$emit("selectTpl",this.$el.innerHTML)
                }
            },
        },
        mounted(){
//            console.log("mounted")
            let html = $.parseHTML(this.tpl.content)
            let $images = $(html).find("[cell-type='image']")

            $images.each(function (n, v) {
                let imageCon = $.parseHTML('<div style="max-width: 100%; vertical-align: middle; display: inline-block; overflow: visible;width:100%"></div>')
                $(imageCon).html(v.outerHTML.toString())
                $(v).replaceWith(imageCon)
            })

            $(this.$el).html(html)
        }
    }
</script>