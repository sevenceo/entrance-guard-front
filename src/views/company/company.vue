<template>
    <div>
        <breadcrumb></breadcrumb>
        <el-row>
            <!--查询条件-->
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <el-row>
                        <el-col :span="6">
                            <el-input
                                    placeholder="请输入企业编码"
                                    v-model="input1"
                            >
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input
                                    placeholder="请输入企业名称"
                                    v-model="input1"
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-button type="primary" v-on:click="searchTree">查询</el-button>
                            <el-button type="primary" @click="bbb">新增</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-col>

            <!--右侧列表-->
            <el-col :span="18">
                <div class="grid-content bg-purple-dark">
                    <template>
                        <el-table
                                :data="tableData"
                                style="width: 100%">
                            <el-table-column
                                    label="企业编码"
                                    width="180">
                                <template scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="企业名称"
                                    width="180">
                                <template scope="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>姓名: {{ scope.row.name }}</p>
                                        <p>住址: {{ scope.row.address }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage4"
                            :page-sizes="[100, 200, 300, 400]"
                            :page-size="100"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script src="./company.js"></script>
<style scoped src="./company.scss"></style>