<template>
    <div class="dashboard-container wd100" style="text-align:center;">
        <div class="dataCard" style="margin-top:70px;">
        	<el-row class="cardList">
        		<el-col :span="5">
					<div class="cl-show">
						<label class="cl-fcount" for="">{{dashboarData.fansCount}}</label>
						<span>今日粉丝总数</span>
					</div>
				</el-col>
				<el-col :span="5">
					<div class="cl-show cl-line">
						<label for="">{{dashboarData.subscribe}}</label>
						<span>今日新增关注</span>
					</div>
				</el-col>
				<el-col :span="5">
					<div class="cl-show">
						<label for="">{{dashboarData.unSubscribe}}</label>
						<span>今日取消关注</span>
					</div>
				</el-col>
				<el-col :span="5">
					<div class="cl-show cl-line">
						<label for="">{{dashboarData.netSubscribe}}</label>
						<span>今日净增粉丝</span>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="cl-show">
						<label class="cl-fsave" for="">{{dashboarData.remain+'%'}}</label>
						<span>今日粉丝留存率</span>
					</div>
				</el-col>
			</el-row>
        </div>
        <div class="chartCard">
        	<el-row :gutter="10">
        		<el-col :span="6">
					<div id="ecFans-zhl" class="ec-show">
					</div>
				</el-col>
				<el-col :span="6">
					<div id="ecFans-hyd" class="ec-show">	
					</div>
				</el-col>
				<el-col :span="6">
					<div id="ecFans-sex" class="ec-show">
					</div>
				</el-col>
				<el-col :span="6">
					<div id="ecFans-dqfb" class="ec-show">	
					</div>
				</el-col>
			</el-row>
        </div>
        <div class="chartRoom">
        	<!-- <h5>粉丝留存率趋势</h5> -->
        	<div id="fansSave" class="chartShow">	
        	</div>
        </div>
        <div class="chartRoom">
        	<!-- <h5>粉丝活跃度趋势</h5> -->
        	<div id="fansAction" class="chartShow">	
        	</div>
        </div>
        <div class="quiteLinks">
            <router-link to="/fans-msg-manage/main/fans-msg"> 
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-kefu"></use>
                </svg>
                <p>客 服</p>
            </router-link>
            <router-link to="/push-message/message">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-qunfa"></use>
                </svg>
                <p>群 发</p>
            </router-link>
            <router-link to="/activity/qr-code">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-huodongzhongxin"></use>
                </svg>
                <p>活 动</p>
            </router-link>
            <router-link to="/sys-material/my-material/myMaterialExternalLink">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                </svg>
                <p>素 材</p>
            </router-link>
            <a @click="backTop">
                <svg class="icon icon-add1" aria-hidden="true">
                    <use xlink:href="#icon-iconzd1-copy"></use>
                </svg>
            </a>
        </div>
    </div>
</template>

<style scoped src="./dashboard.scss"></style>
<script src="./china.js"></script>
<script src="./dashboard.js"></script>

<!--[if IE]>
<style scoped>
    .el-row .ec-show{
        width:100%;min-width:271px;
    }
</style>
<![endif]-->
