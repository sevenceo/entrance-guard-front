<template>
    <div>
        <div class="connected-car child-code">
            <el-form labelWidth="80px">
                <!--<el-form-item label="DOSS下发">-->
                    <!--<el-select v-model="temp.jsonDataDetail.carSeriesDTOS[0].dossSend" :disabled="actionType ==='查看'">-->
                        <!--<el-option-->
                                <!--v-for="item in sendOptions"-->
                                <!--:key="item.key"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="选择车系" >
                    <el-table :data="selectedCarData" ref="selectedCarTable" border style="width: 1000px;"
                              class="blue-table" highlight-current-row @cell-click="getCurrentCell">
                        <el-table-column prop="seriesName" label="车系名称">
                        </el-table-column>
                        <el-table-column prop="seriesEnName" label="英文名">
                        </el-table-column>
                        <el-table-column prop="dossCode" label="DOSS码">
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div style="width: 100px;margin-left:990px;">
                <el-button @click="onAdd" v-if="actionType !=='查看'">选择车系</el-button>
            </div>
            <el-dialog :visible.sync="carFormVisible" class="dialogForm" :show-close="false" :modal="false"
                       @close="close" @open="open">
                <div slot>
                    <el-table :data="carData" ref="carTable" border
                              class="blue-table" @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column prop="seriesName" label="车系名称">
                        </el-table-column>
                        <el-table-column prop="seriesEnName" label="英文名">
                        </el-table-column>
                        <el-table-column prop="dossCode" label="DOSS码">
                        </el-table-column>
                        <!--<el-table-column  v-show="false" prop="id" label="id">
                        </el-table-column>-->
                    </el-table>
                </div>

                <div slot="footer" class="dialog-footer">

                    <el-button class="btn btn-reset reset" type="default" @click="carFormVisible = false">
                        取消
                    </el-button>

                    <el-button class="btn btn-edit search" @click="confirmCar" type="default">
                        确定
                    </el-button>

                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script src="./connectedCar.js">

</script>

<style scoped>

</style>