<template>
    <el-table
            class="mt-10"
            :data="tableData"
            :height="hpx"
            style="width: 100%">
        <el-table-column
                prop="date"
                :sortable="sorts"
                label="日期"
                width="180">
        </el-table-column>
        <el-table-column
                prop="name"
                :sortable="namesorts"
                label="姓名"
                width="180">
        </el-table-column>
        <el-table-column
                prop="address"
                :sortable="addresssorts"
                label="地址">
        </el-table-column>
        <el-table-column
                prop="tel"
                :sortable="addresssorts"
                label="电话">
        </el-table-column>
    </el-table>
</template>
<script>
    var objTable = {
        tableData: [{
            date: '2016-05-02',
            name: '王小虎7',
            address: '上海市普陀区金沙江路 1518 弄',
            tel: '13456753423'
        }, {
            date: '2016-05-04',
            name: '王小虎2',
            address: '上海市普陀区金沙江路 1517 弄',
            tel: '13456753423'
        }, {
            date: '2016-05-01',
            name: '王小虎1',
            address: '上海市普陀区金沙江路 1519 弄',
            tel: '13456753423'
        }, {
            date: '2016-05-03',
            name: '王小虎5',
            address: '上海市普陀区金沙江路 1516 弄',
            tel: '13456753423'
        }, {
            date: '2016-05-03',
            name: '王小虎5',
            address: '上海市普陀区金沙江路 1516 弄',
            tel: '13456753423'
        }, {
            date: '2016-05-03',
            name: '王小虎5',
            address: '上海市普陀区金沙江路 1516 弄',
            tel: '13456753423'
        }]
    };
    export default {
        props: ['hpx', 'sorts', 'namesorts', 'addresssorts'],
        data() {
            return objTable
        }
    }
</script>