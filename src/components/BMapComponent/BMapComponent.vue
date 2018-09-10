<template>
		<el-row :gutter="20">
            <el-col :span="14">
                <div style="height:400px;">
                    <div id="allmap" v-bind:style="mapStyle"></div>
                    <!-- <img width="22" height="22" src="~assets/Red.png"> -->
                </div>
            </el-col>
            <el-col :span="10">
                <div class="locationList">
                    <el-table :data="OrbitData" border @cell-mouse-leave="handlerowLeave" @cell-mouse-enter="handlerowHover" width="100%" stripe height="400" class="blue-table"
                    :default-sort = "{prop: 'time', order: 'descending'}">
                        <el-table-column type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column label="详情" >
                        	<template scope="scope" >
                        		<p class="locInfo">{{ scope.row.location | getEmptyLoc }}</p>
                        		<p class="locInfo locInfo-time"><i class="el-icon-time" style="margin-right:5px;"></i>{{ scope.row.time | formatter }}</p>
                        	</template>	
                        </el-table-column>
                        <el-table-column slot="empty" prop="time" width="1" label="" >
                        </el-table-column>
                    </el-table>
                    <!--翻页-->
                    <pagination :total="totalPage" v-on:pageChange="handleCurrentChange"></pagination>
                </div>
            </el-col>
        </el-row>
</template>
<style scoped>
	.locInfo{
		margin:2px 5px 0;padding:0;height:20px;line-height:20px;text-align: left;
	}
	.locInfo-time{
		color:#999;
	}
	.blue-table tbody .cell{
		height:50px;line-height:50px;
	}
</style>
<script>
import {GetFansOrbit} from "../../views/fans-manage/api/fansManageApi";
import Vue from 'vue'
import moment from 'moment';
	var map = new BMap.Map("allmap");
	Vue.filter('formatter',function(value){
		return moment(value).format("YYYY-MM-DD HH:mm:ss");
	})
	Vue.filter('getEmptyLoc',function(value){
		if(value == ""){
			return '未知区域'
		}
		return value
	})
	export default {
		created(){
	        //this.getLocation(this.account, this.openId,this.pageMsgParam);
	    },
		data(){
			return{
				mapStyle:{
					width:'100%',
					height:'400px'
				},
				bmap:{},
				account:this.$store.state.weChatAccount.accountInfo.account,
				openId: this.$store.state.weChatAccount.accountInfo.openId,
				tableData: [],
	            OrbitTable: [],
	            OrbitData:[],
	            totalPage: 10,
	            pageParam: pageParamInit(),
	            pageMsgParam: pageParamInit(),
			}
		},
		props:{
			// 地图在该视图上的高度
			mapHeight:{
				type:Number,
				default:400
			}
		},
		methods:{
			mapInit(){
				var map = new BMap.Map("allmap");
				map.clearOverlays();
				this.bmap = map;

				
				map.centerAndZoom(new BMap.Point(116.404,39.925),10);
				var points = [];
				var length = this.OrbitTable.length;
				
				var myIcon = new BMap.Icon("/static/img/Red.png",new BMap.Size(19,25));
				for(var i = 0;i<length;i++){
					var dto = this.OrbitTable[i].locationDTO;
					let pt = new BMap.Point(dto.longitude,dto.latitude);
					
				var marker = new BMap.Marker(pt,{icon:myIcon});
					// var marker = new BMap.Marker(pt);
					map.addOverlay(marker);
					points.push(pt);
				}
				var view = map.getViewport(eval(points));  
				var mapZoom = view.zoom;   
				var centerPoint = view.center; 
				map.centerAndZoom(centerPoint,mapZoom);
				// setTimeout(function(){
				// 	map.panTo(points[0]);   //两秒后移动到最近的位置
				// }, 2000);
				map.enableScrollWheelZoom(true);
			},
			// 请求轨迹接口
	        getLocation(account,openId,page){
	            GetFansOrbit(account,openId,page)
	                .then((response) =>{
	                    if (response.data){
                            this.totalPage = Math.ceil(response.headers['x-total-count'] / page.size * 10)
	                        this.OrbitTable = response.data;
	                        // bdGEO();
	                        this.mapInit();
	                        this.getLocationList();
	                    }
	                })
	        },
            // formatter(row, column) {
            // 	console.log(1111111);
            // 	console.log(row);
            //     return moment(row[column.property]).format("YYYY-MM-DD HH:mm:ss");
            // },
			childMethod(row) {
				var map = this.bmap;
				var points = row.pot;
				var vPoint = JSON.parse(points);
		        var pt = new BMap.Point(vPoint.lng,vPoint.lat);
		        map.centerAndZoom();
		        map.enableScrollWheelZoom(true);
				
				var myIcon = new BMap.Icon("/static/img/Blue.png",new BMap.Size(19,25));
				var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
				map.addOverlay(marker); 
				map.panTo(pt);   
		    },
		    handlerowHover(row){
	            var that = this;
	            this.childMethod(row);
	        },
	        handlerowLeave(row){
	        	var map = this.bmap;
	        	
		        map.enableScrollWheelZoom(true);
				var points = row.pot;
				var vPoint = JSON.parse(points);
		        var pt = new BMap.Point(vPoint.lng,vPoint.lat);
		        var myIcon = new BMap.Icon("/static/img/Red.png",new BMap.Size(19,25));
				var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
				map.addOverlay(marker); 
				map.centerAndZoom(pt);

	        },
	        //翻页功能
	        handleCurrentChange(page) {
	            this.pageParam.page = page;
	            this.getLocation(this.account,this.openId,this.pageParam);
	        },
            getMapData(account,openId){
                this.restVariable(account,openId);
                this.account = account;
                this.openId = openId;
                this.getLocation(this.account, this.openId,this.pageMsgParam);
            },
            restVariable(account,openId){
               this.bmap = {};
               this.account = account;
               this.openId = openId;
               this.tableData = [];
               this.OrbitTable =  [];
               this.OrbitData = [];
               this.totalPage = 10;
               this.pageParam = pageParamInit();
               this.pageMsgParam = pageParamInit();
            },
            // 展示轨迹地址列表
	        getLocationList(){
	            var that = this;
	            // this.OrbitData = [];
	            var iTable = this.OrbitTable;
	            var index = 0;
	            var adds = [];
	            var myGeo = new BMap.Geocoder();

	            // 获取坐标列表
	            $.each(this.OrbitTable,function(i,v){
	                adds.push(new BMap.Point(v.locationDTO.longitude,v.locationDTO.latitude));
	            })
	            $.each(adds,function(i,v){
	                geocodeSearch(v); 
	                index++;
	            })
	            function geocodeSearch(pt){
	                var ii = iTable[index];
	                myGeo.getLocation(pt, function(rs){
	                    var addComp = rs.addressComponents;
	                    that.OrbitData.push({'time':ii.eventTime,'pot':JSON.stringify(pt),'location':addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber});
	                });
	            }
	        },
		},
		mounted(){
　　　　　　
　　　　}
	}
	function getMap(){
		let map = new BMap.Map("allmap");
		return map;
	};
	function pageParamInit() {
	    return {
	        page: 1,
	        size: 10
	    }
	}
</script>