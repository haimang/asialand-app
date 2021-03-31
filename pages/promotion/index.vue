<template>
	<view class="content w-100 skeleton">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">  
			<view class="top_view"></view>  
		</view>  
		<!-- #endif --> 
		
		<view v-if="isLogin" class="w-100">
			<skeleton selector="skeleton" bgcolor="transparent" v-if="showSkeleton"></skeleton>
			
			<view class="header flex column">
				<image class="login-logo m-b-10 m-l-20 m-t-30" src="/static/img/logo.png"/>
				<text class="font-size-big m-l-20 uni-bold">
					{{$t('Promotions')}}
				</text>
				<text class="font-size-normal m-l-20 m-b-20">
					{{$t('Recent vendors and Agents incentives')}}
				</text>
			</view>
			<view class="data">
				<view class="item flex column skeleton-rect" height="height:400upx;" v-for="(item, idx) in promotions" :key="idx" :style="{backgroundImage:`url(${item.image})`,backgroundSize: 'cover'}" @click="gotoDetail(idx)">
					<view v-if="item.title != ''" class="tag flex column" style="float:right">
						<text class="font-size-medium uni-bold">{{item.promotional_tags_1}}</text>
						<text class="font-size-small">{{item.promotional_tags_2}}</text>
					</view>
					<view v-if="item.title != ''" class="item_footer flex column">
						<text class="font-size-medium m-t-5 m-l-10 uni-bold line-one">{{item.title}}</text>
						<text class="font-size-small m-b-5 m-l-10 line-one">{{item.des}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="flex column notLogin"  v-if="!isLogin">
			<image src="/static/img/logo_icon.png" style="width:100upx;height:100upx"/>
			<view class="font-size-medium uni-bold m-t-20">{{$t('Register Your Agent Account')}}</view>
			<view class="font-size-normal  text-center m-t-20">{{$t('to unlock most recent sales incentives for buyers and Agents')}}</view>
			<button class="btn m-t-20" @tap="gotoLogin">{{$t('Start Registration')}}</button>
		</view>
	</view>
</template>

<script>
	import skeleton from '../../components/skeleton'
	import apiUrl from '../../common/apiUrl.js';
	import common from '../../common/common.js';
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	export default {
		components:{
			skeleton
		},
		data() {
			return {
				isLogin:false,
				promotions: [
					{
						title:""
					},
					{
						title:""
					},
					{
						title:""
					}
				],
				showSkeleton:true
			}
		},
		onShow() {
			this.isLogin = uni.getStorageSync("isLogin")
		},
		onLoad(){
			this.isLogin = uni.getStorageSync("isLogin")
			if(this.isLogin) {
				this.getPromoList()
			}
		},
		methods:{
			getPromoList(){
				this.showSkeleton = true
				var that = this
				// showLoading(this.$t('Loading'))
				
				uni.request({
				    url: apiUrl.promoList, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						scene: common.scene + "11318"
				    },
				    success: (res) => {
				        console.log(res.data);
						that.promotions = res.data.data.promo
						setTimeout(() => {
							that.showSkeleton = false
						}, 500)	
						// hideLoading()
				    }
				});
			},
			gotoDetail(index){
				var temp = []
				for(var item in this.promotions) {
					temp.push(this.promotions[item])
				}
				var info = temp[0]
				temp[0] = temp[index]
				temp[index] = info
				uni.setStorageSync("promotion",temp)
				uni.navigateTo({
					url:'/pages/promotion/detail'
				})
			},
			gotoLogin(){
				uni.navigateTo({
					url:"/pages/login/login"
				})
			}
		}
		
	}
</script>

<style>
	.content{
		padding:0px;
		background-color: white;
	}
	
	.product-image {
		width: 100%;
		height: 400upx;
	}
	
	.header{
		background-color:#f8f8f8;
		width:100%;
	}
	
	.login-logo {
		height: 32upx !important;
		width: 310upx;
		
	}
	
	.data{
		background:white;
		width:100%;
	}
	
	.item{
		margin:10px;
		box-sizing: border-box;
		height:400upx;
		justify-content: space-between;
	}
	
	.tag{
		width: 90px;
		height: 90px;
		background-color: rgba(42, 42, 42, 100);
		text-align: center;
		color:#D9C077;
		border-radius: 80px;
		justify-content: center;
		align-items: center;
		margin-right:20upx;
		margin-top:20upx;
		align-self: flex-end;
	}
	
	.item_footer {
		background-color: rgba(0,0,0,0.3);
		color: white;
		height:65px;
		width: 100%;
		z-index:100;
	}
	
	.header-item .text {
		height: 44upx;
		line-height: 44upx;
		background-color: rgba(0, 0, 0, 1);
		text-align: center;
		border:1px solid rgb(0,0,0);
		border-radius: 4upx;
		color:#d9c077;
		font-size:20upx;
		padding:0upx 20upx;
	}
	
	.header-item .icon{
		width:18px;
		height:18px;
	}
	
	.header-item {
		margin-top:20upx;
	}
	
</style>
