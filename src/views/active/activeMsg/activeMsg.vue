<template>
  <div>
    <div class="mainMap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <div class="filter-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="活动名称">
          <el-input v-model="formInline.user" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="formInline.region" placeholder="活动类型">
            <el-option label="类型一" value="shanghai"></el-option>
            <el-option label="类型二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button type="primary" icon="plus" @click="onAdd" v-if="hasAuthority('ROLE_ADMIN')">新增</el-button>
          <el-button type="primary" icon="edit" @click="onAdd" v-if="hasAuthority('ROLE_ADMIN')">编辑</el-button>
          <!--<el-button type="danger" icon="delete" @click="onDel">删除</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <div class="dataTab">
      <dataTable :tableData ="formData" v-on:increment="incrementTotal" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>


        <el-form-item label="名称">
          <el-input v-model="temp.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  activeTypeOptions" :key="item.key" :label="item.display_name" :value="item.display_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="temp.beginDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.description">
          </el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script src="./activeMsg.js"></script>
