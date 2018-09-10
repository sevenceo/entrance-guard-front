<template>
    <div>
        <!--面包屑-->
        <breadcrumb></breadcrumb>
        <!--操作区-->
        <div class="filter-container">
            <el-button class="btn btn-add" type="primary" @click="countFans()"   v-authority="'FansGroup.Count'"  :loading="$store.state.app.onXHR">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-jisuan"></use>
                </svg>
                计算
            </el-button>
            <el-button class="btn btn-add" type="primary" @click="exportFanGroup()"   v-authority="'FansGroup.export'" >
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-wendang"></use>
                </svg>
                导出
            </el-button>
        </div>
        <div class="fans-content">
              <div class="formBox">
                <el-row class="formGroups" :gutter="20">
                    <el-col :span="6">
                        粉丝组名称：<span>{{fansGroupData.name}}</span>
                    </el-col>
                  <!--  <el-col :span="4">
                        <el-input v-model="fansGroupData.name" style="ime-mode:disabled" :disabled="true" size="small"></el-input>
                   </el-col> -->
                    <el-col :span="6">
                       状态：<span>{{fansGroupData.state}}</span>
                    </el-col>
                   <!-- <el-col :span="2">
                         <el-input v-model="fansGroupData.state" style="ime-mode:disabled" :disabled="true" size="small"></el-input>
                   </el-col> -->
                    <el-col :span="6">
                        创建时间：<span>{{fansGroupData.createTime}}</span>
                    </el-col>
                   <!-- <el-col :span="4">
                         <el-input v-model="fansGroupData.createTime" style="ime-mode:disabled" :disabled="true" size="small"></el-input>
                   </el-col> -->
                       <el-col :span="6">
                            含粉丝数量：<span>{{fansGroupData.fansInGroupNum}}</span>
                        </el-col>
                   </el-row>
                   <el-row :gutter="20">
                    <!-- <el-col :span="8">
                        含粉丝数量：<span>{{fansGroupData.fansInGroupNum}}</span>
                    </el-col> -->
                   <!-- <el-col :span="4">
                         <el-input v-model="fansGroupData.fansInGroupNum" style="ime-mode:disabled" :disabled="true" size="small"></el-input>
                   </el-col> -->
                </el-row>
                <el-row class="formGroups" :gutter="20">
                   <el-col :span="6">
                    计算周期：<span>{{fansGroupData.runCycle}}</span>
                   </el-col>
                   <!-- <el-col :span="3">
                        <el-input v-model="fansGroupData.runCycle" style="ime-mode:disabled" :disabled="true" size="small"></el-input>
                   </el-col> -->
                   <el-col :span="18">
                        含有标签：<span>{{fansGroupData.chooseTags}}</span>
                   </el-col>
                </el-row>
                <!-- <el-row :gutter="5">
                   <el-col :span="3">
                    含有标签：
                   </el-col>
                   <el-col :span="21">
                         <el-input
                           type="textarea"
                           :rows="2"
                           v-model="fansGroupData.chooseTags"
                           :disabled="true">
                         </el-input>
                   </el-col>
                </el-row> -->
            </div>
            <div>
                <!--表格-->
                <el-table :data="tableData" border stripe style="width: 100%" class="blue-table">
                    <el-table-column prop="headImage" width="70px" label="头像">
                        <template scope="scope">
                            <img v-if="scope.row.headImgUrl" :src="scope.row.headImgUrl" class="head-img">
                            <img v-else  src="~assets/replace.png" class="head-img">
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickName" label="昵称">
                    </el-table-column>
                    <el-table-column prop="newGender" label="性别">
                    </el-table-column>
                    <el-table-column prop="province" label="省份">
                    </el-table-column>
                    <el-table-column prop="city" label="城市">
                    </el-table-column>
                    <el-table-column prop="subscribeTime" label="关注时间">
                    </el-table-column>
                    <el-table-column prop="realName" label="真实姓名">
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号码">
                    </el-table-column>
                </el-table>
                <!--翻页-->
                <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination>
            </div>
        </div>
        
    </div>
</template>
<script src="./fansgroupDeatil.js"></script>
<style scoped src="./fansgroupDeatil.scss"></style>