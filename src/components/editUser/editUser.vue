<template>
	<el-dialog class="dialogForm" title="修改个人密码" :visible.sync="$store.state.user.showUserDialog" @close="resetForm">
		<div class="dialogFormBox">
		<el-form class="small-space" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'
				:model="temp"
				ref="userForm"
				:rules="userRules">
			<el-form-item label="真实姓名" prop="realName" v-show="false">
				<el-input v-model="temp.realName" placeholder="请输入真实姓名"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="userName" v-show="false">
				<el-input v-model="temp.userName" placeholder="请输入用户名" :disabled="true"></el-input>
			</el-form-item>
            <el-form-item label="原密码" prop="originalPassword">
                <el-input type="password" v-model="temp.originalPassword" placeholder="请输入密码原密码"></el-input>
            </el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input type="password" v-model="temp.password" placeholder="请输入密码"></el-input>
			</el-form-item>
			<el-form-item label="重复密码" prop="password2">
				<el-input type="password" v-model="temp.password2" placeholder="请重复密码"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email" v-show="false">
				<el-input v-model="temp.email" placeholder="请输入邮箱"></el-input>
			</el-form-item>
			<el-form-item label="手机号码" v-show="false">
				<el-input v-model="temp.phone" placeholder="请输入手机号码"></el-input>
			</el-form-item>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCancel" class="cancel">取 消</el-button>
			<el-button type="primary" class="update"
					@keyup.enter="update('userForm')"
					@click="update('userForm')"
					>
				确 定</el-button>
		</div>
	</el-dialog>
</template>
<script src="./editUser.js"></script>
<style scoped src="./editUser.scss"></style>