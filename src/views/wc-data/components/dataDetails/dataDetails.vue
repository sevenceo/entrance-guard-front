<template>
    <div>
        <breadcrumb></breadcrumb>

        <el-tabs class="v-content" @tab-click="getAccountDataClick">
            <el-tab-pane label="基本信息">

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">名称：</el-col>
                    <el-col class="data-desc"  @click="getId()">{{formData.name}}</el-col>
                </el-col>

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">实例类型：</el-col>
                    <el-col class="data-desc" >{{formData.instanceType}}</el-col>
                </el-col>

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">数据库类型：</el-col>
                    <el-col class="data-desc" >{{formData.databaseType}}</el-col>
                </el-col>
                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">是否空闲：</el-col>
                    <el-col class="data-desc" >{{formData.isFree}}</el-col>
                </el-col>

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">主机名：</el-col>
                    <el-col class="data-desc" >{{formData.host}}</el-col>
                </el-col>

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">端口号：</el-col>
                    <el-col class="data-desc" >{{formData.port}}</el-col>
                </el-col>

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">登录名：</el-col>
                    <el-col class="data-desc" >{{formData.user}}</el-col>
                </el-col>

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">密码：</el-col>
                    <el-col class="data-desc" >{{formData.pwd}}</el-col>
                </el-col>

                <el-col :span="24" class="wrapper">
                    <el-col  class="data-title">摘要信息：</el-col>
                    <el-col class="data-desc" >{{formData.bewrite}}</el-col>
                </el-col>


            </el-tab-pane>
            <el-tab-pane label="公众账号">
                <el-table
                        class="data-table data-details-table"
                        border
                        stripe
                        :data="wcModifyAccount"
                        style="width: 100%">
                    <!--<el-table-column align="center" label="ID" width="65">-->
                    <!--<template scope="scope">-->
                    <!--<span>{{scope.row.id}}</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            width="70px"
                            prop="headImgUrl"
                            label="头像">
                        <template scope="scope">
                            <img v-if="scope.row.headImgUrl" :src="baseUrl + scope.row.headImgUrl" class="head-img">
                            <img v-else  src="~assets/replace.png" class="head-img">
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="account"
                            label="账号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="organizationName"
                            label="组织架构">
                    </el-table-column>
                    
                    <el-table-column
                            label="操作"
                            align="center"
                            width="80px"
                    >
                        <template scope="scope">
                            <el-button @click="onModify(scope.row)" type="text" size="small">
                                迁移
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="迁移历史" style="width: 100%">
                <el-table
                        class="data-table data-details-table"
                        border
                        stripe
                        :data="wcAccountHistory"
                        style="width: 100%;">
                    <!--<el-table-column align="center" label="ID" width="65">-->
                    <!--<template scope="scope">-->
                    <!--<span>{{scope.row.id}}</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            prop="mainDbInstanceName"
                            label="来源数据库名称"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="destDbInstanceName"
                            label="目标数据库名称"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="account"
                            label="公众号账号">
                    </el-table-column>
                    <el-table-column
                            prop="scheduleTime"
                            label="计划迁移时间"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="completeTime"
                            label="完成迁移时间"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="数据迁移结果">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" @click="onMoveComplete(scope.row)">
                                迁移完成
                            </el-button>
                        </template>

                    </el-table-column>
                </el-table>

            </el-tab-pane>
        </el-tabs>
            <!--迁移-->
        <el-dialog class="dialogForm" title="公众号迁移" :visible.sync="dialogFormVisible" @close="resetForm">
            <!--<editor :temp = "temp" :activeTypeOptions="activeTypeOptions" :pickerOptions0="pickerOptions0" ></editor>-->
            <el-form class="small-space" :model="temp" ref="temp" label-position="left" >
                <el-form-item label="迁移至：">

                </el-form-item>
                <el-form-item>
                    <el-radio-group class="radioLabel" v-model="tempHistory.radio">
                        <el-radio v-for="item in history" :key="item.key" :label="item.id">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="请输入密码：" prop="password">
                    <el-input v-model="tempHistory.password" placeholder="请输入密码"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" class="cancel">取 消</el-button>
                <el-button type="primary" @click="update" class="update">确 定</el-button>

            </div>
        </el-dialog>
    </div>
</template>

<script src="./dataDetails.js">

</script>

<style scoped lang="scss">
    .data-details-table{
        //border: none;
        .head-img{
            width: 30px;
            height: 30px;
            margin-top: 6px;
        }

        .el-table__header-wrapper thead {
            .cell{
                height: 50px;
                line-height: 50px;
                border: #68aeef;
                color: #ffffff;
                background: none;
            }
            th{
                height: 50px;
                line-height:50px;
                border: none;
                background-color:#68aeef;
            }
            td{
                border: none;
            }
            .el-checkbox__inner{
                border: 1px solid #fff;
                background-color: #68aeef;
            }
        }

        .el-table__body-wrapper tbody{
            .cell{
                height: 44px;
                line-height: 44px;
                border: none;
            }
            tr{
                height: 44px;
                line-height: 44px;
            }
            td{
                border: none;
            }
            .el-table__row--striped .cell{
                background: #ebf5ff;
            }

        }
    }
    .el-tabs__content{
        min-width:1300px;
    }

    .data-title{
        width: 150px;
        display: inline-block;

    }
    .data-desc{
        display: inline-block;
        width: 500px;
    }

    .wrapper:first-child {
        margin-top: 0;
    }

    .title {
        margin-right: 20px;
        text-align: right;
    }

    .el-radio-group {
        // max-height: 300px;
        overflow-y: auto;
        width: 450px;
    }


    .el-radio-group .el-radio {
        display: block;
        margin-left: 0;
        margin-top: 10px;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis
    }
    .small-space{margin:0 20px;}
    .radioLabel{
        margin-left:45px;
    }
    .wrapper{
        height:40px;line-height:40px;padding-left:20px;
    }
    .v-content {
      
      border:solid 1px #c6cad6;
    }

</style>