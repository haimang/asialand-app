<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
<!-- 		<view class="status_bar">
			<view class="top_view"></view>
		</view> -->
		<!-- #endif -->
		<view class="header flex column">
			<image class="login-logo m-b-10 m-l-20 m-t-20" src="/static/img/logo.png" />
			<text class="font-size-big m-l-20 uni-bold">
				{{$t('Contact Us')}}
			</text>
			<text class="font-size-normal m-l-20 m-b-20">
				{{$t('Let us know your feedback.')}}
			</text>
		</view>
		<view class="data m-b-50">
			<view v-if="isLogin" class="font-size-big uni-bold m-b-20">{{$t('Dear')}} {{name}}</view>
			<text class="font-size-normal">{{$t("Contact Us Letter")}}</text>
			<view class="flex row m-t-20 align-center">
				<view class="flex column ">
					<text class="font-size-normal uni-bold">Asialand</text>
					<text class="font-size-normal ">{{$t('Email')}} : {{email}}</text>
					<text class="font-size-normal ">{{$t('Mobile')}} : {{mobile}}</text>
				</view>
			</view>
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

	export default {
		data() {
			return {
				name: "",
				personArr: [],
				isLogin:false,
				email:'info@asialand.com.au',
				mobile:"+61 3 8686 8388"
			}
		},
		onLoad(option) {
			this.isLogin = uni.getStorageSync("isLogin")
			this.getUserCard("HCUR-oNCV8vZASn")
			this.getUserCard("HCUR-RFE00l4kHZ")
			if(uni.getStorageSync("userInfo").user != null) {
				this.name = uni.getStorageSync("userInfo").user.name
			}
		},
		onShow() {
			uni.setNavigationBarTitle({ // 修改头部标题
				title: this.$t("Contact Us")
			});
		},
		methods: {
			getUserCard(user_hash) {
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
						if (res.data.code == 0) {
							that.personArr.push(res.data.data)
						}

						hideLoading()
					}
				});
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

	.data {
		width: 100%;
		padding: 40upx;
		box-sizing: border-box;
	}

	.head {
		width: 160upx;
		height: 160upx;
	}
</style>
