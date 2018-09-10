<template>
    <div>

        <div class="child-code">

            <!--问卷名称，问卷作者，背景图，问卷说明-->

            <el-form style="width: 800px" ref="temp" :model="temp" label-width="80px">

                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="问卷作者:">
                            {{temp.author}}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="问卷说明:">
                            {{temp.desc}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item :label="'问题'+ ques.id +':' " v-for=" ques in temp.questionAnswerStatis" :key="ques.id">
                            {{ques.questionDesc}}
                            <el-table :data="ques.answerStatis" border stripe class="blue-table">
                                <el-table-column prop="name" label="选项">

                                </el-table-column>
                                <el-table-column prop="desc" label="选项描述">

                                </el-table-column>
                                <el-table-column prop="num" label="数量">

                                </el-table-column>
                                <el-table-column prop="scale" label="百分比/%" :formatter="formatter">

                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="留资字段:">
                            <div  v-for="item in temp.customerItemStatis" style="margin-bottom: 20px;">

                                <!--{{item.fieldZhName}}-->

                                <!--<el-button class="report-btn">{{item.num}}</el-button>-->
                                <!--<el-button class="report-btn"> {{item.scale}}</el-button>-->
                                <el-table :data="item" border stripe class="blue-table">
                                    <el-table-column prop="fieldZhName" label="字段名">

                                    </el-table-column>
                                    <el-table-column prop="num" label="数量">

                                    </el-table-column>
                                    <el-table-column prop="scale" label="百分比/%" :formatter="formatterlz">

                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

    </div>
</template>

<script src="./quesReport.js">

</script>

<style src="./quesReport.scss" scoped>

</style>