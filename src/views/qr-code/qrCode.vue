<template>
    <div>
        <div class="code-part">
            <!--面包屑-->
            <breadcrumb></breadcrumb>

            <div class="filter-container account-filter-container">

                <el-button class="btn btn-add" type="primary" @click="onAdd" v-authority="'Activity.Create'">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-add1"></use>
                    </svg>
                    新增
                </el-button>
                <!--<el-button class="btn btn-add" type="primary" @click="onEdit">-->
                <!--<svg class="icon icon-edit1" aria-hidden="true">-->
                <!--<use xlink:href="#icon-edit1"></use>-->
                <!--</svg>-->
                <!--编辑-->
                <!--</el-button>-->
                <el-button class="btn btn-edit" type="primary" @click="onSearch">
                    <svg class="icon icon-add1" aria-hidden="true">
                        <use xlink:href="#icon-filter"></use>
                    </svg>
                    筛选
                </el-button>
                <!--<el-button class="btn btn-delete" type="danger" @click="onDel">-->
                <!--<svg class="icon icon-delete1" aria-hidden="true">-->
                <!--<use xlink:href="#icon-delete1"></use>-->
                <!--</svg>-->
                <!--删除-->
                <!--</el-button>-->
            </div>
            <div>
                <!--表格-->
                <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="activityCode" label="活动编码">
                    </el-table-column>
                    <el-table-column prop="activityName" label="活动名称">
                    </el-table-column>
                    <el-table-column prop="activityTypeName" label="活动类型">
                    </el-table-column>
                    <el-table-column prop="activityRegionName" label="活动区域">
                    </el-table-column>
                    <el-table-column prop="activityTemplateName" label="活动模版">
                    </el-table-column>
                    <el-table-column prop="beginDate" label="开始日期">
                    </el-table-column>
                    <el-table-column prop="endDate" label="结束日期">
                    </el-table-column>
                    <el-table-column prop="type" fixed="right" label="操作" align="center" width="80px">
                        <template scope="scope">
                            <!--<router-link :to="'view-activity/basic/' + scope.row.id">-->
                            <el-button class="icon-btn edit" @click="onShow(scope.row.id)" title="查看" type="default"
                                       size="small">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-check"></use>
                                </svg>
                            </el-button>
                            <!--</router-link>-->

                            <el-button type="default" title="删除" class="icon-btn edit" size="small" v-authority="'Activity.Remove'"
                                       @click="onDel(scope.row.id)">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>



            <!--筛选区-->

            <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
                <el-form ref="searchForm">
                    <el-form-item label="活动编码">
                        <el-input style="ime-mode:disabled" v-model="pageParam.activityCode" placeholder="请输入活动编码"></el-input>
                    </el-form-item>
                    <el-form-item label="活动名称">
                        <el-input style="ime-mode:disabled" v-model="pageParam.activityName" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="起始时间">
                        <el-date-picker
                                v-model="pageParam.beginDate"
                                type="date"
                                placeholder="选择日期范围"
                                @change="selectBeginDate"
                                :editable="false"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                v-model="pageParam.endDate"
                                type="date"
                                placeholder="选择日期范围"
                                :picker-options="pickerOptions1"
                                @change="selectEndDate"
                                :disabledDate=" pageParam.beginDate === '' "
                                :editable="false"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn btn-reset reset" type="default" @click="resetSearchForm">
                        重置
                    </el-button>
                    <el-button class="btn btn-edit search" type="default" @click="search">
                        筛选
                    </el-button>
                </div>
            </el-dialog>


            <pagination :total="totalPage" ref="pages"  :pagesize="pageParam.size" v-on:pageChange="handleCurrentChange"></pagination>
        </div>
    </div>
</template>

<script src="./qrCode.js">

</script>

<style scoped>

</style>