<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">  
			<view class="top_view"></view>  
		</view>  
		<!-- #endif -->
		<view class="header flex column">
			<image class="login-logo m-b-10 m-l-15 m-t-30" src="/static/img/logo.png" />
			<text class="font-size-big m-l-15 uni-bold">
				{{$t('Welcome Letter')}}
			</text>
			<text class="font-size-normal m-l-15 m-b-20">
				{{$t('We are honored to have you on board')}}
			</text>
		</view>
		<view class="data">
			<view class="font-size-big uni-bold m-b-20">{{$t('Dear')}} {{name}}</view>
			<text class="font-size-normal">{{$t("Signup welcome letter")}}</text>
			<view class="flex row m-t-20 align-center" v-for="(item, index) in personArr" :key="index">
				<image :src="item.avatar == null ? '/static/img/header_sample.png' : item.avatar" class="head"/>
				<view class="flex column m-l-10" >
					<text class="font-size-normal uni-bold">{{item.name}}</text>
					<text class="font-size-normal ">{{item.company != null ? item.company : '' + " - " + item.title != null ? item.title : ''}}</text>
					<text class="font-size-small ">{{$t('Mobile')}} : {{item.mobile}}</text>
					<text class="font-size-small ">{{$t('Email')}} : {{item.email}}</text>
				</view>
			</view>
			
			<button class="btn m-t-50 m-b-50" @click="gotoHome">{{$t("Start Browsing Projects")}}</button>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import common from '../../common/common.js'
	import apiUrl from '../../common/apiUrl.js'
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	
	export default{
		data(){
			return {
				name:"Sean Zheng",
				personArr:[				
				]
			}
		},
		onLoad(option) {			
			this.getUserCard("HCUR-oNCV8vZASn")
			this.getUserCard("HCUR-RFE00l4kHZ")
			this.name = uni.getStorageSync("userInfo").user.name
			
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Signup")
			});
		},
		methods:{
			getUserCard(user_hash){
				showLoading()
				var that = this
				uni.request({
				    url: apiUrl.getUserCard, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						hash: user_hash
				    },
				    success: (res) => {
				        console.log(res.data);
						if(res.data.code == 0) {
							that.personArr.push(res.data.data)
						}
						
						hideLoading()
				    }
				});
			},
			gotoHome(){
				uni.reLaunch({
					url:"../home/home"
				})
			}
		}
	}
</script>

<style>	
	.content {
		padding: 0px;
		background: white;
	}
	
	.header {
		background-color: #f8f8f8;
		width: 100%;
	}
	
	.login-logo {
		height: 32upx !important;
		width: 310upx;
	}
	
	.data{
		width:100%;
		padding:40upx 30upx;
		box-sizing: border-box;
	}
	
	.head{
		width: 160upx;
		height: 160upx;
	}
</style>
