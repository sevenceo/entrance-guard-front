<template>
  <div>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <!--<el-table-column-->
        <!--type="selection"-->
        <!--width="55">-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="活动名称"
        width="180">
        <template scope="scope">
          <span class="link-type" v-on:click="increment(scope.row)">{{scope.row.name}}</span>
          <!--<el-tag>{{scope.row.type | typeFilter}}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="beginDate"
        label="开始时间"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="活动类型"
        :formatter="formatter">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="发布人">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="100"
        :filters="[{ text: '技术分享', value: '技术分享' }, { text: '招聘会', value: '招聘会' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template scope="scope">
          <el-tag
            :type="scope.row.type === '技术分享' ? 'primary' : 'success'"
            close-transition>{{scope.row.type}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="操作" width="150" v-if="hasAuthority('ROLE_ADMIN')">
        <template scope="scope">
          <!--<el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleModifyStatus(scope.row,'published')">发布-->
          <!--</el-button>-->
          <!--<el-button v-if="scope.row.status!='draft'" size="small" @click="handleModifyStatus(scope.row,'draft')">草稿-->
          <!--</el-button>-->
          <el-button size="small" type="danger"
            @click="delActive(scope)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <dataPages/>
  </div>
</template>

<script>
  import {DeleteActive} from 'api/activities'
  import permission from 'store/permission';

  import dataPages from './pagiNation.vue'
  export default {
    props:['tableData'],
    data() {
      return {

      }
    },
    components: {
      dataPages
    },
    created(){
//      console.log(this.hasAuthority("ROLE_ADMIN"));
    },
    methods: {
      hasAuthority:permission.hasAuthority,
      formatter(row, column) {
        return row.type;
      },
      filterTag(value, row) {
        return row.type === value;
      },
      delActive(scope){
        DeleteActive(scope.row.id)
          .then(()=>{
            this.tableData.splice(scope.$index, 1)
          })
      },
      increment: function (row) {
        this.$emit('increment',row)
      },
      activeUpdate(row){

      }
    }
  }
</script>
