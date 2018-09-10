<template>
    <div>
        <breadcrumb></breadcrumb>
        <div class="user-filter-container">
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
    </div>

        <div>
            <el-table :date="table"  border stripe style="width: 100%" class="blue-table">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="realName" label="申请人员">
                </el-table-column>
                <el-table-column prop="attendanceGroudName" label="考勤组名称">
                </el-table-column>
                <el-table-column prop="repairTime" label="申请类型" :formatter="fomatterTime">
                </el-table-column>
                <el-table-column prop="repairCause" label="开始时间">
                </el-table-column>
                <el-table-column prop="repairCause" label="结束时间">
                </el-table-column>
                <el-table-column prop="state" label="审批状态" :formatter="fomatterState">
                </el-table-column>
                <el-table-column prop="type" label="操作" width="130">
                    <template scope="scope">
                        <el-button type="default" title="审批历史" class="el-icon-view" @click="onEdit(scope.row)"size="small">
                        </el-button>
                        <el-button type="default" title="同意" class="el-icon-check" @click="onagree(scope.row)"size="small"
                                   v-if="scope.row.state==1" v-authority="'RepqirReissueCard.Agree'">
                        </el-button>
                        <el-button type="default" title="驳回" class="el-icon-close" @click="onRejected(scope.row)"
                                   size="small" v-if="scope.row.state==1" v-authority="'RepqirReissueCard.Reject'">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--翻页-->
            <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
        </div>
</template>