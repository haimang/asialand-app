<template>
	<!-- <scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto"> -->
	<view class="flex column w-100">
		<!-- <view class="header flex row space-between align-center">
		    <view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item flex column " :class="index==0? 'm-l-20' : index==tabBars.length - 1 ? 'm-r-20' : ''" :id="tab.id" :data-current="index" @click="ontabtap">
		        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
				<view class="mark" :style="tabIndex==index? 'visibility: visible' : 'visibility: hidden'"></view>
		    </view>
		</view> -->
		<!-- </scroll-view> -->
	<!-- 	<view class="flex column">
			<view class="map-view m-t-10" :style="'height:' + mapHeight + 'px'">
				<map id="map" :show-compass="true" :enable-overlooking="true" class="map w-100" :scale="scale" :latitude="latitude" :longitude="longitude"  :markers="markers">
				</map>
			</view>
		</view> -->
		
		<web-view :src="url" ></web-view>
		 <!--#ifdef APP-PLUS-->
<!-- 		<web-view :src="url" @message="onMessage"></web-view>
 -->		<!--#endif-->
	</view>	
</template>

<script>
	import apiUrl from "../../common/apiUrl.js"
	import common from "../../common/common.js"
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	export default {
		data() {
			return {
				detailInfo:{},
				mapHeight:0,
				screenHeight:0,
				latitude: 27.909,
				longitude: 116.39742,
				scale: 10, 
				tabIndex:0,
				url:"/static/heremap.html",
				tabBars:[
					{
						name:this.$t("school")//'院校'
					},
					{
						name:this.$t("shopping")//'购物'
					},
					{
						name:this.$t("restaurant")//'餐饮'
					},
					{
						name:this.$t("transport")//'交通'
					},
					{
						name:this.$t("leisure")//'休闲'
					},
					{
						name:this.$t("hospital")//'医院'
					}
				],
				markers:[],
				markArray:[],
				nearByInfo:{},
				
			}
		},
		onReady() {
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Amenities Map")
			});
		},
		onLoad(option){
			// this.hash = "HCPP-zxLfuXalzS"
			// this.latitude = "-33.7126"
			// this.longitude = "150.81835"
			this.hash = option.hash
			this.latitude = option.lat
			this.longitude = option.lng
			this.nearByInfo = JSON.stringify(option.nearby)
			this.url = this.url + "?lat=" + this.latitude + "&log=" + this.longitude + "&hash=" + this.hash + "&token="  + uni.getStorageSync("token") + "&language=zh_CN" + "&nearby=" + this.nearByInfo //+ uni.getStorageSync("language")
			
			//this.getDetail()
		},
		methods:{
			 
		}
	}
</script>

<style>
	.header{
		width: 100%;
		height: 55px;
		background-color: rgba(0, 0, 0, 1);
		box-shadow: 0px 5px 10px -5px rgba(170, 170, 170, 100);
		position:fixed;
		top:0px;
		left:0;
	}
	
	.uni-tab-item{
		justify-content: center;
		align-items: center;
	}
	
	.uni-tab-item-title{
		color: rgba(217, 192, 119, 100);
		font-size: 24upx;
		text-align: left;
		font-family: PingFangSC-regular;
	}
	
	.uni-tab-item-title-active{
		font-weight: bold;
	}
	
	.mark{
		width: 12upx;
		height: 12upx;
		background-color: rgba(217, 192, 119, 100);
		border-radius: 12upx;
		text-align: center;
	}
	
	.map-view{
		width:100%;
		margin-top:110upx;
	}
	
	.map{
		height:100%;
		font-weight: bold;
	}
	
</style>
