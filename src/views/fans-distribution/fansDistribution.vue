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
                <!--粉丝分布地图-->
                <div id="fansGeoDistion" class="geoDistion"></div>
                <!-- 粉丝分布饼图 -->
	        	<div id="fansDistribution" class="chartShow">	
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
        </el-dialog>
	</div>
    
</template>

<script src="./fansDistribution.js"></script>
<style scoped src="./fansDistribution.scss"></style>
