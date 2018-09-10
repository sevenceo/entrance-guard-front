<template>
    <div>
        <el-row>
            <el-col :span="8">
                <input type="checkbox" :id="row.id" :name="row.id">
                <label :for="row.id" @click="handleTitLabel($event)">{{row.name}}</label>
            </el-col>
            <el-col :span="16">
                <el-checkbox-group>
                    <span v-for="(item,index) in row.actions" :key="index">
                        <input type="checkbox" :id="item.id" :name="item.id">
                        <label :for="item.id" @click="handleContentLabel">{{item.name}}</label>
                    </span>
                </el-checkbox-group>
            </el-col>
        </el-row>
        <div v-if="row.modules.length > 0" v-for="(modules,index) in row.modules" class="box_dlc">
            <el-row>
                <el-col :span="8">
                    <input type="checkbox" :id="modules.id" :name="modules.id">
                    <label style="margin-left: 30px" :for="modules.id"  @click="handleTitLabel($event)">{{modules.name}}</label>
                </el-col>
                <el-col :span="16">
                    <el-checkbox-group>
                        <span v-for="(item,index) in modules.actions" :key="index">
                            <input type="checkbox" :id="item.id" :name="item.id">
                            <label :for="item.id" @click="handleContentLabel">{{item.name}}</label>
                        </span>
                    </el-checkbox-group>
                </el-col>
            </el-row>
        </div>
    </div>

</template>

<script>
    export default{
        props:["row"],
        methods:{
            handleTitLabel(event){
                let $ct =$(event.currentTarget).siblings(":checkbox");
                let $nt = $(event.currentTarget).parent().next();
                let $cot = $(event.currentTarget).parent().parent().parent()
                let $mods = $(event.currentTarget).parent().parent().next()
                if($ct.prop("checked")){
                    $nt.find(":checkbox").prop("checked",false)
                }
                else {
                    $nt.find(":checkbox").prop("checked",true)
                }
                // 如果是module子节点则找到父节点勾选
                if($cot.hasClass("box_dlc")){
                    if(!$ct.prop("checked")){
                        $cot.siblings(".el-row").find(":checkbox").prop("checked","checked")
                    }
                }
                // 如果是module父节点则找到子节点勾选
                else if($mods.hasClass("box_dlc")){
                    if(!$ct.prop("checked")){
                        setTimeout(()=>{
                            $mods.parent().find(":checkbox").prop("checked",true)
                        },10)
                    }else{
                        // 全不选
                        setTimeout(()=>{
                            $mods.parent().find(":checkbox").prop("checked",false)
                        },10)
                    }
                }
            },
            handleContentLabel(event){
                let $el =$(event.currentTarget).parents(".el-col").siblings();
                $el.find(":checkbox").prop("checked",true)
                let $cot = $el.parent().parent()
                if($cot.hasClass("box_dlc")){
                    $cot.siblings(".el-row").find(":checkbox").prop("checked","checked")
                }
            }
        }
    }

</script>
<style scoped>
    .el-col-8{width: 20%}
    .el-col-16{width: 80%}
    .el-col{
        line-height:42px;
        padding-left: 25px;
        font-size: 14px;
    }
    .el-checkbox-group span{
        display: inline-block;
        width:20%;
        box-sizing: border-box;
    }
    input[type="checkbox"]{
        /* width: 40px; */
        /* height: 40px; */
        /* -webkit-border-radius: 50%; */
        display: none;
    }
    input[type="checkbox"]+label {
        display: inline-block;
        text-align: left;font-weight: normal;
        -webkit-box-sizing: border-box;
    }

    label::before {
        content: "";
        display: inline-block;
        width: 18px;
        height: 18px;
        background: #ffffff;
        vertical-align: middle;
        -webkit-border-radius: 25%;
        margin-right: 15px;
        -webkit-box-sizing:border-box;
        border: 1px #c8cbd0 solid;cursor: pointer;
    }

    input[type="checkbox"]:checked+label::before{
        border: 1px #dddddd solid;cursor: pointer;
        border-color:rgb(65,142,212);
        background: url("../../../../assets/selected.png") 50% 50% no-repeat;
    }

    /*.box_dlc:nth-child(even){*/
        /*background: #dddddd;*/
    /*}*/

    /*.box_dlc:nth-child(odd){*/
        /*background: #ffffff;*/
    /*}*/

</style>