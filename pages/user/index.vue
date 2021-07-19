<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->

		<view v-if="isLogin" class="w-100">
			<view class="header flex column">
				<image class="login-logo m-b-10 m-l-15 m-t-30" mode="widthFix" src="/static/img/logo.png" />
				<text class="font-size-big m-l-15 uni-bold">
					{{$t('Your membership Center')}}
				</text>
				<text class="font-size-normal m-l-15 m-b-20">
					{{$t('More resources for you to promote our projects')}}
				</text>
			</view>
			<view class="data">
				<view class="top_label m-t-15 p-l-20 m-l-15 m-r-15">{{$t('Your Information')}}</view>
				<view class="info_view m-l-15 m-r-15 p-t-20">
					<view class="flex row justify-center align-center m-l-10 m-t-20">
						<image :src="userInfo.avatar == null || userInfo.avatar == undefined? '/static/img/header_sample.png' : userInfo.avatar"
						 class="head"></image>
						<view class="m-l-10" v-if="userInfo.surname != null">
							<view class="font-size-big uni-bold">{{$t("Price") == "价格" ? userInfo.surname + " " + userInfo.name : userInfo.name + " " + userInfo.surname}}</view>
							<view class="font-size-normal">{{userInfo.company}} - {{userInfo.title}}</view>
						</view>
					</view>
					<button class="login-btn m-t-30 m-l-10" @tap="updateInfo">{{$t('Update Personal Information')}}</button>
					<view class="split m-t-30 m-b-30"></view>
					<view class="flex row m-l-10 p-b-30">
						<view class="info_item" @click="gotoProperty">
							<text class="font-size-big uni-bold col-yellow m-t-20">{{savedList.length}}</text>
							<text class="font-size-small col-yellow line-height-1 m-t-5 p-l-10 p-r-10">{{$t('Saved Properties')}}</text>
						</view>
						<view class="info_item m-l-10" @click="gotoReservation">
							<text class="font-size-big uni-bold col-yellow  m-t-20">{{orderList.length}}</text>
							<text class="font-size-small col-yellow line-height-1 m-t-5">{{$t('Reservations')}}</text>
						</view>
					</view>
				</view>

				<view class="top_label m-t-30 p-l-20 m-l-15 m-r-15">{{$t('Your Settings')}}</view>
				<view class="info_view m-l-15 m-r-15" style="margin-bottom:50px;">
					<view class="flex row space-between m-b-10 p-t-10 align-center ">
						<text class="font-size-normal m-l-20">{{$t('APP Display Language')}}</text>
						<view class="m-r-10 flex row align-center">
							<text class="font-size-normal">{{$t('Chinese')}}</text>
							<switch color="#D9C077" :checked="isEn" @change="switch1Change" style="transform:scale(0.7,0.7)" />
							<text class="font-size-normal">{{$t('English')}}</text>
						</view>
					</view>

					<view class="split"></view>
					<view class="flex row space-between m-b-10 m-t-10" @click="gotoPrivacy">
						<text class="font-size-normal m-l-20">{{$t('Privacy Policy')}}</text>
					</view>
					<view class="split"></view>
					<view class="flex row space-between m-b-10 m-t-10" @click="gotoContactUs">
						<text class="font-size-normal m-l-20">{{$t('Contact Us')}}</text>
					</view>
					<view class="split"></view>
					<view class="flex row space-between m-b-10 m-t-10" @click="logout">
						<text class="font-size-normal m-l-20">{{$t('Sign Off')}}</text>
					</view>
					<view class="split"></view>
				</view>
			</view>
		</view>
		<view class="flex column notLogin" v-if="!isLogin">
			<image src="/static/img/logo_icon.png" style="width:100upx;" mode="widthFix" />
			<view class="font-size-medium uni-bold m-t-20">{{$t('Register Your Agent Account')}}</view>
			<view class="font-size-normal  text-center m-t-20">{{$t('to access more project analysing tools for our trusted agents')}}</view>
			<button class="btn m-t-20" @click="gotoLogin">{{$t('Start Registration')}}</button>
		</view>
	</view>
</template>

<script>
	import common from '../../common/common.js'
	import apiUrl from '../../common/apiUrl.js'
	import {
		showLoading,
		hideLoading
	} from 'common/loading'

	export default {
		data() {
			return {
				headUrl: "/static/img/head_sample.jpg",
				name: "Michael Gutenburg",
				duty: "金鼎地产 - 市场经理",
				propCnt: 12,
				reserveCnt: 3,
				isLogin: false,
				userInfo: {},
				savedList: [],
				orderList: [],
				isEn: true,
			}
		},
		onLoad() {
			this.isLogin = uni.getStorageSync("isLogin")
			if (this.isLogin) {
				showLoading(this.$t('Loading'))
			}
		},
		onShow() {
			this.isLogin = uni.getStorageSync("isLogin")
			if (this.isLogin) {
				this.getUserInfo()
				this.getSaveList()
				this.getOrderList()
				if (uni.getStorageSync("language") == "en") {
					this.isEn = true
				} else {
					this.isEn = false
				}
			}
		},
		methods: {
			switch1Change(e) {
				uni.setStorageSync("language", !e.target.value ? 'zh_CN' : 'en')
				this._i18n.locale = uni.getStorageSync("language");

				uni.setTabBarItem({
					index: 0,
					text: this.$t("Search") //'搜  索',
				})
				uni.setTabBarItem({
					index: 1,
					text: this.$t("Promotions") //'推  广',
				})
				uni.setTabBarItem({
					index: 2,
					text: this.$t("Notifications") //'推  送',
				})
				uni.setTabBarItem({
					index: 3,
					text: this.$t("Member") //'成  员',
				})
			},
			gotoContactUs() {
				uni.navigateTo({
					url: '/pages/user/contactus'
				})
			},
			gotoPrivacy() {
				uni.navigateTo({
					url: '/pages/user/privacy'
				})
			},
			updateInfo() {
				uni.navigateTo({
					url: '/pages/user/info'
				})
			},
			gotoProperty() {
				uni.navigateTo({
					url: '/pages/user/properties'
				})
			},
			gotoReservation() {
				uni.navigateTo({
					url: '/pages/user/reservations'
				})
			},
			gotoLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			getUserInfo() {

				var that = this
				uni.request({
					url: apiUrl.getUserInfo, //仅为示例，并非真实接口地址。
					header: {
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
					data: {
						token: uni.getStorageSync("token"),
						openid: uni.getStorageSync("userInfo").authToken.token

					},
					success: (res) => {
						console.log(res.data);
						hideLoading()
						if (res.data.code == 0) {
							that.userInfo = res.data.data.user
							if (uni.getSystemInfoSync().platform == 'ios') {
								if (that.userInfo.avatar != null) {
									that.userInfo.avatar = that.userInfo.avatar.substring(0, that.userInfo.avatar.indexOf('?'))
								}
							}
						}
					}
				});
			},
			getSaveList() {
				var that = this
				uni.request({
					url: apiUrl.getSaveList, //仅为示例，并非真实接口地址。
					header: {
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
					data: {
						token: uni.getStorageSync("token"),
						type: "HCPP",
						page: 1,
						pageSize: 100000
					},
					success: (res) => {
						console.log(res.data);
						hideLoading()
						that.savedList = res.data.data.collects;

					}
				});
			},
			getOrderList() {
				var that = this
				uni.request({
					url: apiUrl.orderList, //仅为示例，并非真实接口地址。
					header: {
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
					data: {
						token: uni.getStorageSync("token"),
						page: 1,
						pageSize: 100000
					},
					success: (res) => {
						console.log(res.data);
						that.orderList = res.data.data.orders;
					}
				});
			},
			logout() {
				uni.setStorageSync("isLogin", false)
				uni.removeStorageSync("userInfo")
				uni.navigateTo({
					url: "../login/login"
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

	.top_label {
		background-image: url(/static/img/label_bg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		font-size: 32upx;
		line-height: 32upx;
		font-weight: bold;
		color: #D9C077;
		padding: 20upx 30upx;
	}

	.data {
		background: white;
		width: 100%;
	}

	.info_view {
		background: #F8F8F8;
	}

	.head {
		width: 128upx;
		height: 128upx;
		border-radius: 128upx;
	}

	.login-btn {
		text-align: left;
		display: inline-block;
		height: 80upx;
		line-height: 80upx;
		border-radius: 10upx;
		background-color: rgba(0, 0, 0, 1);
		color: rgba(217, 192, 119, 100);
		font-size: 32upx;
		font-weight: bold;
		box-shadow: 0px 4upx 12upx 0px rgba(0, 0, 0, 0.4);
		font-family: Arial;
		border: 0px;
	}



	.info_item {
		width: 180upx;
		height: 200upx;
		border-radius: 20upx;
		background-color: rgba(0, 0, 0, 1);
		text-align: center;
		box-shadow: 0px 0px 5px 0px rgba(238, 238, 238, 100);
		display: flex;
		flex-direction: column;
	}

	.split {
		width: 100%;
		height: 2upx;
		background-color: rgba(217, 192, 119, 100);
	}
</style>
