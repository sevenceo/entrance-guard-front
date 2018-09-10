<template>
  <div>
    <div class="mainMap">
      <bCrumb />
    </div>
    <div class="filter-container">
    	<div class="dateSwiper">
    		<cDate dType="daterange" />
    	</div>
        <el-button type="primary" icon="delete" >查询</el-button>
        <el-button type="success" icon="plus" >新增</el-button>
        <el-button :plain="true" type="primary" icon="edit">编辑</el-button>
        <el-button type="danger" icon="delete">删除</el-button>
    </div>
    <div class="dataTab">
      <dataTable :sorts="true" :namesorts="true" />
    </div>
  </div>
</template>

<style>
	.dateSwiper{
		float: left;margin:0 10px;
	}
	.dateSwiper .block{
		text-align: left;
		float: left;
	}
</style>
<script>
	import dataTable from 'views/common/table.vue'
	import bCrumb from 'views/common/bCrumb.vue'
	import cDate from 'views/common/cDate.vue'
	import cSelect from 'views/common/cSelect.vue'

	export default{
		data(){
			return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value:""
      }
		},
		components: {
	      dataTable,bCrumb,cDate,cSelect
	    }
	}
</script>