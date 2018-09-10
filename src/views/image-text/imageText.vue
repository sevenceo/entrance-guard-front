<template>
	<div>
        <breadcrumb></breadcrumb>
		<div class="filter-container dataRport">
            <el-button class="btn btn-edit" type="primary" @click="onSearch">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-filter"></use>
                </svg>
                筛选
            </el-button>
	    </div>
		<div class="dashboard-container wd100" style="text-align:center;">
	        <div class="chartRoom">
	        	<!-- <h5>图文分析</h5> -->
	        	<div id="imgText" class="chartShow">	
	        	</div>
	        </div>
    	</div>
    	<!--筛选区-->
        <el-dialog :visible.sync="searchFormVisible" class="search-dialog" :show-close="false" :modal="false">
            <el-form v-model="param">
                <el-form-item label="组织机构">
                    <el-button style="width: 70%" v-model="param.accounts" @click="getOrg"><span>{{selectedName}}</span></el-button>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-reset reset" @click="reset" type="default">
                    重置
                </el-button>
                <el-button class="btn btn-edit search" @click="search" type="default">
                    筛选
                </el-button>
            </div>
        </el-dialog>
        <el-dialog class="dialogFans360Form" :title="title" :visible.sync="showFlag" @close="resetForm">
            <el-button class="btn btn-add" type="primary" @click="exportArticleDetail()">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                    导出
            </el-button>
            <el-table :data="articleDetails" border stripe style="width: 100%" class="blue-table" height="450">
                <el-table-column
                prop="statDate"
                label="时间"
                width="150"
                :formatter="formatter">
                </el-table-column>
                <el-table-column
                label="图文页阅读"
                width="220">
                    <el-table-column
                            prop="intPageReadUser"
                            label="人数"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="intPageReadCount"
                            label="次数"
                            width="110">
                    </el-table-column>
                </el-table-column>


                <el-table-column
                label="从公众号会话打开"
                width="200">
                <el-table-column
                        prop="intPageFromSessionReadUser"
                        label="人数"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="intPageFromSessionReadCount"
                        label="次数"
                        width="100">
                </el-table-column>
                </el-table-column>

                <el-table-column
                label="从朋友圈打开"
                width="200">
                <el-table-column
                        prop="intPageFromFeedReadUser"
                        label="人数"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="intPageFromFeedReadCount"
                        label="次数"
                        width="100">
                </el-table-column>
                </el-table-column>

                <el-table-column
                label="分享转发"
                width="200">
                <el-table-column
                        prop="shareUser"
                        label="人数"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="shareCount"
                        label="次数"
                        width="100">
                </el-table-column>
                </el-table-column>

                <el-table-column
                label="微信收藏人数"
                width="200">
                <el-table-column
                        prop="addToFavUser"
                        label="人数"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="addToFavCount"
                        label="次数"
                        width="100">
                </el-table-column>
                </el-table-column>


            </el-table>
            <pagination :total="totalPage" ref="pages" v-on:pageChange="handleCurrentChange"></pagination>

        </el-dialog>
        <el-dialog title="选择组织机构" :visible.sync="orgVisible" class="tree-dialog" :show-close="true" :modal="true">
            <el-table :data="tableData" class="filter-table" border stripe style="width: 100%">
                <el-table-column prop="orgName" label="组织机构" width="200">
                </el-table-column>
                <el-table-column label="公众号" align="center">
                    <template scope="scope">
                        <el-table :data="scope.row.accountInfos" :ref="scope.row.orgId" class="inner-table"
                            @selection-change="handleSelectionChange" highlight-current-row style="width: 100%">
                        <el-table-column prop="account">
                            </el-table-column>
                            <el-table-column prop="accountName">
                            </el-table-column>
                            <el-table-column
                                    type="selection"
                                    width="55">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div slot="footer" class="dialog-footer">
                <el-button class="btn btn-edit search" @click="confirmAccounts" type="default">
                    确定
                </el-button>
            </div>-->
        </el-dialog>

        <el-date-picker
            v-model="value7"
            :clearable = "false"
            type="daterange"
            align="left"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change = "getArticleDate"
            :picker-options="pickerOptions2">
        </el-date-picker>
        <div class="block">
                <el-table
                  :data="articleData"
                  height="300"
                  class="data-table"
                  border
                  stripe
                  style="width: 100%">
                  <el-table-column
                    prop="title"
                    label="文章标题"
                    min-width="130">
                  </el-table-column>
                  <el-table-column
                    prop="refDate"
                    label="时间"
                    min-width="120"
                    :formatter="formatter">
                  </el-table-column>
                  <el-table-column
                    prop="targetUser"
                    label="送达人数"
                    min-width="60">
                  </el-table-column>
                  <el-table-column
                  prop="pageReadUser"
                  label="图文阅读人数"
                  min-width="60">
                  </el-table-column>
                  <el-table-column
                  prop="shareUser"
                  label="分享人数"
                  min-width="60">
                  </el-table-column>
                  <el-table-column prop="type" fixed="right" label="操作" align="center" width="80px">
                  <template scope="scope">
                      <el-button type="default" title="查看" class="check" @click="onShow(scope.row)" size="small">
                            <svg class="icon icon-check" aria-hidden="true">
                                <use xlink:href="#icon-check"></use>
                            </svg>
                      </el-button>
                  </template>
                  </el-table-column>

                </el-table>

            </div>
        </div>
</template>

<script src="./imageText.js"></script>
<style scoped src="./imageText.scss"></style>
