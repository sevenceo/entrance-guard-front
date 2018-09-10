<template>
  <div>
    <div class="mainMap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>列表展示</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--测试按钮-->
    <el-form>
      <!--<el-button type="primary" @click="userInfoGet">click</el-button>-->
      <el-button type="default" @clkck="showInfo('pageParam')">用户信息</el-button>
    </el-form>
    <!--数据表格-->
    <div>
      <el-table :data="tableData" border stripe style="width: 100%">
        <!--<el-table-column align="center" label="ID" width="65">-->
          <!--<template scope="scope">-->
            <!--<span>{{scope.row.id}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column  prop="login"  label="用户名"  width="180">
          <template scope="scope">
            <span class="link-type" >{{scope.row.login}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="email"  label="邮箱"   width="200">
        </el-table-column>
        <el-table-column  prop="createdBy" label="发布人"> </el-table-column>
        <el-table-column  prop="createdDate"  label="发布时间" > </el-table-column>
        <el-table-column  prop="lastModifiedBy" label="上次修改人"> </el-table-column>
        <el-table-column  prop="type" label="操作" align="center" width="150">
          <template scope="scope">
            <el-button type="danger" size="small" @click="delUsers(scope)" v-if="hasAuthority('ROLE_ADMIN')">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--翻页-->
      <pagination :total="totalPage" v-on:pageChange="handleCurrentChange1"></pagination>
    </div>
  </div>
</template>
<script>
  import { GetUserList } from 'api/getUserList'
  import moment from 'moment'
  import {DeleteUsers} from 'api/getUserList'
  import permission from 'store/permission'

  //每页显示的记录数
  let pageParam = {
    page:1,
    size:10
  }
  export default{
    created(){
      //console.log(this.hasAuthority("ROLE_ADMIN"));
      this.showInfo(pageParam);
    },
    data(){
        return{
            //初始化
          tableData:[],
          totalPage: 10,
        }
    },
    components:{
        //tableData
    },
    methods: {
      hasAuthority:permission.hasAuthority,
      showInfo(pageParam){
        GetUserList(pageParam)
          .then( (response)=> {
            //console.log(response)
            this.totalPage = response.headers['x-total-count']
            this.tableData = response.data
          })
      },
      // 删除用户
      delUsers(scope){
        DeleteUsers(scope.row.login)
          .then(()=>{
            this.tableData.splice(scope.$index, 1)
          })
      },
      //翻页功能
      handleCurrentChange1(page){
        pageParam.page = page;
        this.showInfo(pageParam)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
