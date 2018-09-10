<template>
    <div>
        <div>
            <div style="padding-right:20px;width: 115%;margin-left:-15% ;">
                <el-table :data="messageDataList" ref="selectedDealerTable" border
                          style="width: 100%;margin-left: 20px;height: 450px;overflow-y:auto; "
                          class="blue-table" highlight-current-row>
                    <el-table-column :show-overflow-tooltip="true" prop="createTime" label="留资时间">
                    </el-table-column>
                    <el-table-column prop="realName" label="真实姓名">
                    </el-table-column>

                    <el-table-column prop="mobile" label="手机号码">
                    </el-table-column>
                    <el-table-column prop="carSeries" label="意向车系">
                    </el-table-column>

                    <el-table-column prop="expectDate" label="意向购买时间">
                    </el-table-column>

                    <el-table-column prop="organName" label="经销商名称">
                    </el-table-column>
                </el-table>

                <pagination class="item-wrapper-page" :total="totalPage" :pagesize="page.size"
                            v-on:pageChange="handleCurrentChange"></pagination>

                <!--<el-dialog :visible.sync="dealerFormVisible" class="dialogForm" :show-close="false" :modal="false" @open="open">-->
                <!--<el-table :data="dealerList" ref="dealerTable" border-->
                <!--class="blue-table" @selection-change="handleSelectionChange">-->
                <!--<el-table-column-->
                <!--type="selection"-->
                <!--width="55">-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="name" label="经销商名称">-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="tel" label="销售电话">-->
                <!--</el-table-column>-->
                <!--</el-table>-->
                <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button class="btn btn-reset reset" type="default" @click="dealerFormVisible = false">-->
                <!--取消-->
                <!--</el-button>-->

                <!--<el-button class="btn btn-edit search" @click="confirmDealer" type="default">-->
                <!--确定-->
                <!--</el-button>-->

                <!--</div>-->
                <!--</el-dialog>-->
            </div>
        </div>
    </div>
</template>

<script src="./messageConsultation.js">

</script>

<style scoped>

</style>