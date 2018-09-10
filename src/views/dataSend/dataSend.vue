<template>

    <div>
        <breadcrumb></breadcrumb>
        <div class="" style="padding-top:60px">
            <el-form class="small-space" label-position="left" label-width="100px"
                     style='width: 400px; margin-left:50px;'
                     >
            <el-form-item label="社区名陈">
                <el-select v-model="params.resourceId" placeholder="请选择">
                    <el-option
                            v-for="item in community"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
                <el-button class="btn btn-add" type="primary" @click="send">
                    数据发放
                </el-button>
            </el-form>

        </div>
    </div>
</template>

<script src="./dataSend.js">
</script>
