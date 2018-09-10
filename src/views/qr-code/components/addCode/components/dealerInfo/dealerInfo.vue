<template>
    <div>
        <div>
            <div style="margin:0px 0px 50px 50px;">
                <el-table :data="selectedDealerList" ref="selectedDealerTable" border
                          class="blue-table" highlight-current-row>
                    <el-table-column prop="name" label="经销商名称">
                    </el-table-column>
                    <el-table-column prop="tel" label="销售电话">
                    </el-table-column>
                </el-table>

                <div class="add-btn-container" >
                    <el-button @click="onAdd" v-if="actionType !=='查看'">添加经销商</el-button>
                </div>
                <el-dialog :visible.sync="dealerFormVisible" class="dialogForm" :show-close="false" :modal="false" @open="open">
                    <el-table :data="dealerList" ref="dealerTable" border
                              class="blue-table" @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column prop="name" label="经销商名称">
                        </el-table-column>
                        <el-table-column prop="tel" label="销售电话">
                        </el-table-column>
                    </el-table>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="btn btn-reset reset" type="default" @click="dealerFormVisible = false">
                            取消
                        </el-button>

                        <el-button class="btn btn-edit search" @click="confirmDealer" type="default">
                            确定
                        </el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script src="./dealerInfo.js">

</script>

<style scoped>
    .blue-table{
        margin-right: 20px;max-height: 450px;overflow-y:auto;
    }
    .add-btn-container{
        width: 100px;float: right;margin-top:20px;margin-right: 2px;
    }
</style>