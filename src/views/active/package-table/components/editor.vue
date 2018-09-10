<template>
    <div>
        <h1>test</h1>
        <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="名称">
                <el-input v-model="temp.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
                    <el-option v-for="item in  activeTypeOptions" :key="item.key" :label="item.display_name" :value="item.display_name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker
                        v-model="temp.beginDate"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.description">
                </el-input>
            </el-form-item>

        </el-form>
        <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
            <!--<el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>-->
            <!--<el-button v-else type="primary" @click="update">确 定</el-button>-->
        <!--</div>-->
    </div>

</template>

<script>
    export default {
        props:['temp','activeTypeOptions','pickerOptions0'],
        template: '<div>${require("./editor.html")}</div>'
    }
</script>