<template>
    <div style="width:100%;height:100%;">
        <el-dialog title="添加" :visible.sync="dialogVisible"  :modal="true" ref="dialog">
            <div class="dialogFormBox">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="姓名">
                        <el-input v-model="formInline.name" placeholder="请输入姓名" @focus="closeOrganization"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-left:50px;">
                    <el-table :data="tableData"  @selection-change="handleSelectionChange" border stripe style="width: 100%;" class="blue-table">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column label="人员名称" prop="realName" >
                        </el-table-column>
                        <el-table-column  label="联系方式" prop="mobilePhone">
                        </el-table-column>
                    </el-table>
                </div>
                <pagination ref="pages" :total="rowTotal" v-on:pageChange="handleCurrentChange"></pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false" class="cancel">取 消</el-button>
                <el-button type="primary" class="confirm," @click="addHuman" v-if="type=='addHuman'">
                    确 定
                </el-button>
                <el-button type="primary" class="confirm," @click="setManager" v-else>
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script src="./addAttenDanceHuman.js"></script>