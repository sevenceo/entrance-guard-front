<template>
    <div>
        <div class="child-code">
            <el-form style="width: 800px" ref="temp" :model="temp" label-width="80px" :rules="rules">

                <el-row :gutter="30">
                    <el-col :span="12">
                       <el-form-item label="活动名称" prop="activityName">
                            <el-input v-model="temp.activityName" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="活动模板" prop="activityTemplateCode">
                            <el-select v-model="temp.activityTemplateCode" :disabled="isDisabled"
                                       @change="changeTemplate">
                                <el-option
                                        v-for="item in templateOptions"
                                        :key="item.templateCode"
                                        :label="item.templateName"
                                        :value="item.templateCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="活动类型" prop="activityTypeCode">
                            <el-select v-model="temp.activityTypeCode" :disabled="isDisabled" @change="changeType">
                                <el-option
                                        v-for="item in typeOptions"
                                        :key="item.typeCode"
                                        :label="item.typeName"
                                        :value="item.typeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动区域" prop="activityRegionId">
                            <el-select v-model="temp.activityRegionId" :disabled="isDisabled" @change="changeRegion">
                                <el-option
                                        v-for="item in regionOptions"
                                        :key="item.regionCode"
                                        :label="item.regionName"
                                        :value="item.regionCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="起始时间" prop="beginDate">
                            <el-date-picker
                                    v-model="temp.beginDate"
                                    type="date"
                                    placeholder="选择日期范围"
                                    :picker-options="pickerOptions0"
                                    @change="selectBeginDate"
                                    :editable="false"
                                    :disabled="isDisabled"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间" prop="endDate">
                            <el-date-picker
                                    v-model="temp.endDate"
                                    type="date"
                                    placeholder="选择日期范围"
                                    :picker-options="pickerOptions1"
                                    @change="selectEndDate"
                                    :editable="false"
                                    :disabled="isDisabled || temp.beginDate === ''"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="摘要信息" prop="description">
                            <el-input type="textarea" :disabled="isDisabled" v-model="temp.description"
                                      :autosize="{ minRows: 6, maxRows: 8}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

    </div>
</template>

<script src="./basicInfo.js">

</script>

<style scoped>

</style>