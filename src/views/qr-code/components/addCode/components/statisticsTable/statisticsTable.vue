<template>
    <div>
        <div>
            <div class="flex" style="width: 115%;margin-left:-15%;">
                <div class="dashboard-container wd100"
                     style="width:70%;height: 42px;text-align:center;margin-left:20px;">
                    <div class="chartRoom">
                        <h5>统计报表
                            <el-button title="展示全部数据" class="show-all-btn" @click="showAll">
                                <svg class="icon icon-tag" aria-hidden="true">
                                    <use xlink:href="#icon-xianshiquanbu"></use>
                                </svg>
                            </el-button>

                        </h5>
                        <div id="fansAdd" style="width: 100%;height: 405px;" class="chartShow">
                        </div>
                    </div>
                </div>
                <el-table :data="statisticsTableData" ref="selectedDealerTable" border
                          style="width: 30%;margin-left: 20px;height: 450px;"
                          class="blue-table" highlight-current-row>
                    <el-table-column prop="color" width="30px" label="">
                        <template scope="scope">
                                <span v-bind:style="{backgroundColor: scope.row.color,display: 'inline-block',width: '18px',height:'18px', marginTop: '13px'}">
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="统计指标	">
                    </el-table-column>
                    <el-table-column prop="total" label="汇总数值">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script src="./statisticsTable.js">

</script>

<style scoped src="./statisticsTable.scss">

</style>