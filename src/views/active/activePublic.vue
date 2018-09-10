<template>
	<div>
		<div class="mainMap">
			<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>活动发布</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="sendAction">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		  		<el-form-item label="活动名称" prop="name">
		    		<el-input v-model="ruleForm.name"></el-input>
		  		</el-form-item>

				<el-form-item label="发布人" prop="creator">
				    <el-select v-model="ruleForm.creator" placeholder="请选择活动区域">
				      <el-option label="管理员" value="shanghai"></el-option>
				      <el-option label="编辑小哥" value="beijing"></el-option>
				    </el-select>
				</el-form-item>

				<el-form-item label="开始时间" required>
				    <el-col :span="11">
				      <el-form-item prop="beginDate">
				        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.beginDate" style="width: 100%;"></el-date-picker>
				      </el-form-item>
				    </el-col>
				</el-form-item>

				<el-form-item label="活动类型" prop="type">
				    <el-checkbox-group v-model="ruleForm.type">
				      <el-checkbox label="技术分享" name="type"></el-checkbox>
				      <el-checkbox label="招聘会" name="type"></el-checkbox>
				    </el-checkbox-group>
				</el-form-item>

				<el-form-item label="活动描述" prop="description">
				    <el-input type="textarea" v-model="ruleForm.description"></el-input>
				</el-form-item>

				<el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
				    <el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		
	</div>
</template>

<style>
	.sendAction{
		width:40%;
	}
</style>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          creator: '',
          beginDate: '',
          type: [],
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          creator:[
          	{required:true,message: '请输入发布人姓名', trigger: 'blur'}
          ],
          beginDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          description: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>