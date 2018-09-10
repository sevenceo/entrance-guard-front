<template>
    <el-table
            :data="tableData"
            border
            stripe
            @selection-change="handleSelectionChange"
            style="width: 100%">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <!--<el-table-column align="center" label="ID" width="65">-->
        <!--<template scope="scope">-->
        <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
                prop="name"
                label="名称">
        </el-table-column>
        <el-table-column
                prop="authType"
                label="类型"
                width="180">
        </el-table-column>
        <el-table-column
                prop="description"
                label="描述"
                width="180">
        </el-table-column>
        <el-table-column
                prop="module"
                label="模型">
        </el-table-column>
        <el-table-column
                prop="service"
                label="服务">
        </el-table-column>
        <el-table-column
                prop="status"
                label="状态">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        props:['tableData'],
        data(){
            return {
                multipleSelection: []
            }
        },
        methods: {
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log("选中row数据")
                console.log(this.multipleSelection)
                this.$emit('selectionChange',val)
            }
        }
    }
</script>