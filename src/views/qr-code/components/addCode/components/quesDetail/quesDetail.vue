<template>
    <div>
        <div class="child-code"  v-for="(item, index) in temp" :key="item.id">
            <el-form  class="question-item" ref="temp" label-width="120px" :model="item" :rules="rules">
                <el-row>
                    <el-col  :span="12">
                        <h3 class="title">问题{{index + 1}}:</h3>
                        <el-form-item label="请输入问题描述" prop="questionDesc">
                            <el-input v-model="item.questionDesc" @blur="updateQuestionMessage(item.questionDesc,index)" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="请设置选项数量">
                            <el-select v-model='item.answerItemSize' class="select-item" @change="changeNum(item.answerItemSize,index)" >
                                <el-option
                                        v-for="h in numberOption"
                                        :key="h.key"
                                        :label="h.label"
                                        :value="h.key">
                                </el-option>
                            </el-select>
                            <span style="color:red;font-size: 12px;">随意切换选项数量将导致数据丢失</span>
                            <!--<el-button style="position: absolute;top: 0;width: 100%;opacity: 0;" @click="war"></el-button>-->
                        </el-form-item>
                        <el-form-item label="是否为多选题">
                            <el-checkbox v-model="item.isMultiple" @change="changeIsMultiple(item.isMultiple,index)" :disabled="isDisabled || item.answerItemSize<2"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="最多选几项" v-if="item.isMultiple === true">
                            <el-select v-model="item.maxChooseNum" @change="changeMultiNum(item.maxChooseNum,index)" :disabled="isDisabled">
                                <el-option
                                        v-for="z in multiOption"
                                        :key="z.key"
                                        :label="z.label"
                                        :value="z.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选项">
                            <el-form-item v-for="(x,index2) in item.answerItems" :key="item.id" :label="x.name" class="option-item" :prop="'answerItems['+index2+'].desc'" :rules="[{required: true, message: '请输入选项描述', trigger: 'blur'},{max:120,message:'选项描述不可超过120个字'}]">
                                <el-input v-model="item.answerItems[index2].desc" placeholder="请输入选项描述" @blur="updateMessage(x.desc,index2,index)" :disabled="isDisabled"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <div class="filter-container account-filter-container" v-if="!isDisabled">
                            <el-button class="btn btn-delete" type="danger" @click="deleteQuestion(index)">
                                <svg class="icon icon-delete1" aria-hidden="true">
                                    <use xlink:href="#icon-delete1"></use>
                                </svg>
                                删除
                            </el-button>
                            <el-button class="btn btn-add" type="primary" @click="addQuestion" v-if=" index === questionLength -1">
                                <svg class="icon icon-add1" aria-hidden="true">
                                    <use xlink:href="#icon-add1"></use>
                                </svg>
                                新增
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>

    </div>
</template>

<script src="./quesDetail.js">

</script>

<style src="./quesDetail.scss" scoped>

</style>