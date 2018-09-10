<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->
        <div class="filter-container">
            <el-button class="btn btn-add" type="primary" v-authority="'UserLabel.Maintenance'" @click="goAddUserLabel()">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-add1"></use>
                </svg>
                新增
            </el-button>
             <el-button class="btn btn-add" type="primary" @click="countUserLabel" v-authority="'UserLabel.Count'" :loading="$store.state.app.onXHR">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-jisuan"></use>
                </svg>
                    计算
             </el-button>
             <el-button class="btn btn-edit" type="primary" @click="onSearch"  >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
        </div>
        <!--内容区-->
        <dataTable :tableData = "formData" v-on:showfans="showfans"   v-on:selectionChange="handleSelectionChange" />
        <!--筛选区-->
        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form :model="pageParam" :rules = "searchRule" ref="pageParam">
                <el-form-item label="标签名称" >
                    <el-input v-model="pageParam.name" style="ime-mode:disabled" placeholder="标签名称支持模糊查询"></el-input>
                </el-form-item>
                <el-form-item label="标签状态">
                    <el-select class="filter-item" v-model="pageParam.state" placeholder="请选择状态">
                        <el-option v-for="item in  tagStateOptions" :key="item.key" :label="item.label"
                                   :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运算周期">
                    <el-select class="filter-item" v-model="pageParam.runCycle" placeholder="请选择运算周期">
                        <el-option v-for="item in  runCycleOptions" :key="item.key" :label="item.label"
                                   :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签分类">
                    <el-select class="filter-item" v-model="pageParam.type" placeholder="请选择标签类型">
                        <el-option v-for="item in  tagTypeOptions" :key="item.key" :label="item.label"
                                   :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效期：" prop="validateStart">
                      <el-date-picker
                            v-model="pageParam.validateStart"
                            type="date"
                            placeholder="选择有效开始日期"
                            >
                      </el-date-picker>
                </el-form-item>
                <el-form-item prop="validateEnd">
                      <el-date-picker
                            v-model="pageParam.validateEnd"
                            type="date"
                            placeholder="选择有效结束日期"
                            >
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="最近执行日" prop="runTimeStart">
                      <el-date-picker
                            v-model="pageParam.runTimeStart"
                            type="date"
                            placeholder="选择日期"
                            >
                      </el-date-picker>
                </el-form-item>
                <el-form-item prop="runTimeEnd">
                      <el-date-picker
                            v-model="pageParam.runTimeEnd"
                            type="date"
                            placeholder="选择日期"
                            >
                      </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" @click="reset" type="default">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" @click="search('pageParam')" type="default">
                    筛选
                </el-button>
            </div>
        </el-dialog>
        <!--分页-->
        <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination>

        <el-dialog class="dialogShowFansForm" title="粉丝列表" :visible.sync="showFans" @close="resetForm">
                <!--表格-->
            <div class="user-filter-container">
                <el-button class="btn btn-add" type="primary" @click="exportAll()">
                    <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                导出
                </el-button>
            </div>
            <div>
                <el-table :data="tableData" border stripe style="width: 100%;" class="blue-table">
                    <el-table-column prop="headImage" width="70px" label="头像">
                    <template scope="scope">
                        <img v-if="scope.row.headImgUrl" :src="scope.row.headImgUrl"
                        onerror="this.onerror=null;this.src='/static/img/replace.bbbb6a7.png'" class="head-img">
                        <img v-else src="~assets/replace.png" class="head-img">
                    </template>
                    </el-table-column>
                    <el-table-column prop="nickName" label="昵称">
                    <template scope="scope">
                        <div class="text" v-html="scope.row.nickName"></div>
                    </template>
                    </el-table-column>
                    <el-table-column prop="gender" label="性别" min-width="60">
                    </el-table-column>
                    <el-table-column prop="province" label="省份" min-width="70">
                    </el-table-column>
                    <el-table-column prop="city" label="城市" min-width="70">
                    </el-table-column>
                    <el-table-column prop="isSubscribe" label="关注状态" :formatter="formatter1" min-width="80">
                            </el-table-column>
                    <el-table-column prop="lastActionTime" label="最近活跃时间"  width="150">
                    </el-table-column>
                    <el-table-column prop="subscribeTime" label="关注时间"  width="150">
                    </el-table-column>
                    <el-table-column prop="unsubscribeTime" label="取消关注时间"  min-width="100">
                    </el-table-column>
                    <el-table-column prop="realName" label="真实姓名">
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号码"  min-width="100">
                    </el-table-column>
                </el-table>
                    <!--翻页-->
                <pagination :total="fansTotalPage" ref="pages" v-on:pageChange="handleCurrentChange3"></pagination>
            </div>
        </el-dialog>

    </div>
</template>
<script src="./userlabelManage.js"></script>
<style scoped src="./userlabelManage.scss"></style>