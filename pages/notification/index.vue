<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view v-if="isLogin" class="w-100">
			<view class="header flex column">
				<image class="login-logo m-b-10 m-l-15 m-t-30" src="/static/img/logo.png" />
				<text class="font-size-big m-l-15 uni-bold">
					{{$t('Notifications')}}
				</text>
				<view class="m-b-10">
					<text class="font-size-normal m-l-15 ">
						{{$t('Projects update and sales promotions')}}
					</text>
					<button class="small-btn m-r-10" style="float:right;" @click="setReadAll()">{{$t("Read all")}}</button>
				</view>
			</view>
			<view class="data">
				<view class="item  m-t-30" v-for="(item, idx) in notificationList" :key="idx" @click="gotoDetail(item)">
					<view class="flex row align-center w-100">
						<!-- <view class="ic_mark_small"></view> -->
						<!-- <image class="mark" src="/static/img/mark.png" @click="gotoDetail"></image> -->
						<view class="img">
							<image class="img" :src="item.image != '' ? item.image  : '/static/img/ic_room_default.png'"></image>
						</view>

						<view class="item_content flex column m-l-10">
							<text :class="item.status == 0 ? 'font-size-medium uni-bold' : item.status == 1 ? 'font-size-medium uni-bold font-xGray' : ''">{{item.title}}</text>
							<text :class="item.status == 0 ? 'font-size-small' : item.status == 1 ? 'font-size-small font-xGray' : ''">{{item.des}}</text>
						</view>
					</view>
					<text class="font-size-small font-xGray" style="width:100px;">{{item.updated_at}}</text>
				</view>
			</view>
		</view>

		<view class="flex column notLogin" v-if="!isLogin">
			<image src="/static/img/logo_icon.png" style="width:100upx;height:100upx" />
			<view class="font-size-medium uni-bold m-t-20">{{$t('Register Your Agent Account')}}</view>
			<view class="font-size-normal  text-center m-t-20">{{$t('to receive Project updates and sales promotions notifications')}}</view>
			<button class="btn m-t-20" @tap="gotoLogin">{{$t('Start Registration')}}</button>
		</view>

		<view class="loading-more m-t-5" v-if="isLoading">
			<image class="loading-icon" src="data:image/svg+xml;base64,IDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnPjxwYXRoIGZpbGw9J25vbmUnIGQ9J00wIDBoMTAwdjEwMEgweicvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0U5RTlFOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyM5ODk2OTcnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMzAgMTA1Ljk4IDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nIzlCOTk5QScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNBM0ExQTInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNjUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQUJBOUFBJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDEyMCA1OC42NiA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNCMkIyQjInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0JBQjhCOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQzJDMEMxJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQ0JDQkNCJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xMjAgNDEuMzQgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjRDJEMkQyJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC05MCAzNSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNEQURBREEnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTYwIDI0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0UyRTJFMicgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtMzAgLTUuOTggNjUpJy8+PC9zdmc+"></image>
			<text class="loading-more-text m-l-10">{{$t('Loading')}}</text>
		</view>
		<view class="loading-more-nodata m-t-5" v-if="isEndList">
			<text class="loading-more-text">{{$t('No more data')}}</text>
		</view>
	</view>
</template>

<script>
	import apiUrl from '../../common/apiUrl.js';
	import common from '../../common/common.js';
	import {
		showLoading,
		hideLoading
	} from 'common/loading'

	export default {
		data() {
			return {
				isLogin: false,
				isEndList: false,
				isLoading: false,
				notificationList: [],
				page: 1,
				pageSize: 10
			}
		},
		// onLoad(option) {
		// 	this.isLogin = uni.getStorageSync("isLogin")
		// 	if (uni.getStorageSync("isLogin")) {
		// 		this.getPushList()
		// 	}
		// },
		onShow() {
			console.log("notification list onshow");
			
			
			this.isLogin = uni.getStorageSync("isLogin")
			if (uni.getStorageSync("isLogin")) {
				this.notificationList = []
				this.page = 1
				this.getPushList()
			}
			
		},
		onReachBottom: function() {
			if (uni.getStorageSync("isLogin")) {
				if (!this.isEndList && !this.isLoading) {
					this.loadMore()
				}
			}
		},
		methods: {
			onPullDownRefresh() {
				if (uni.getStorageSync("isLogin")) {
					setTimeout(() => {
						this.notificationList = []
						this.page = 1
						this.getPushList();
					}, 500)
				}
			},
			gotoDetail(item) {
				if(item.status == 0) {
					var unreadCount = uni.getStorageSync("unreadCount")
					unreadCount = unreadCount - 1
					console.log("notification unreadCount:" + unreadCount);
					if (unreadCount > 0) {
						uni.setTabBarBadge({
							index: 2,
							text: unreadCount + ""
						})
					} else {
						uni.removeTabBarBadge({
							index: 2
						})
					}
					
					uni.setStorageSync("unreadCount",unreadCount )
					console.log("set unread count:" + unreadCount);
				}
				uni.navigateTo({
					url: "detail?hash=" + item.hash + "&title=" + item.title + "&time=" + item.updated_at
				})
			},
			gotoLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			loadMore(e) {
				if (!this.isLoading) {
					this.isLoading = true
					this.isEndList = false
					this.page++;
					this.getPushList()
				}
			},
			setReadAll() {
				var that = this
				uni.request({
					url: apiUrl.setReadAllPush, //仅为示例，并非真实接口地址。
					header: {
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
					data: {
						token: uni.getStorageSync("token"),
						hashs: "all",
						scene:"app"
					},
					success: (res) => {
						uni.stopPullDownRefresh()
						console.log(res.data);
						if (res.data.code == 0) {
							uni.removeTabBarBadge({
								index: 2
							})

							setTimeout(() => {
								that.isLoading = true
								that.notificationList = []
								that.page = 1
								that.getPushList();
							}, 500)
						}

					}
				});
			},
			getPushList() {
				var that = this
				uni.request({
					url: apiUrl.getPushList, //仅为示例，并非真实接口地址。
					header: {
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
					data: {
						token: uni.getStorageSync("token"),
						page: this.page,
						pageSize: this.pageSize,
					},
					success: (res) => {
						uni.stopPullDownRefresh()
						console.log(res.data);
						if (res.data.data.lists != null && res.data.data.lists.length > 0) {
							that.isLoading = false

							for (var index in res.data.data.lists) {
								res.data.data.lists[index].updated_at = res.data.data.lists[index].updated_at.substring(0, 16)
								res.data.data.lists[index].updated_at = res.data.data.lists[index].updated_at.replace("T", " ")
							}

							that.notificationList = that.notificationList.concat(res.data.data.lists)

							if (res.data.data.lists.length < this.pageSize) {
								that.isEndList = true
							}
						} else {
							that.isLoading = false
							that.isEndList = true
						}
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

	.mark {
		width: 6px;
		height: 20upx;
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
		background: white;
		width: 100%;
	}

	.item {
		margin: 40upx 30upx;
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
	}

	.item_content {
		background-color: white;
		margin-top: -10px;
	}

	.header-item .text {
		height: 44upx;
		line-height: 44upx;
		background-color: rgba(0, 0, 0, 1);
		text-align: center;
		border: 1px solid rgb(0, 0, 0);
		border-radius: 4upx;
		color: #d9c077;
		font-size: 20upx;
		padding: 0upx 20upx;
	}

	.header-item .icon {
		width: 18px;
		height: 18px;
	}

	.header-item {
		margin-top: 20upx;
	}

	.loading-text {
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.loading-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 10px;
		padding-bottom: 10px;
		text-align: center;
	}

	.loading-more-nodata {
		position: fixed;
		bottom: 10px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 10px;
		padding-bottom: 10px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}

	.loading-icon {
		width: 40upx;
		height: 40upx;
		transition: .3s;
		animation: loading 1s steps(12) infinite;
	}

	.img {
		width: 100upx;
		height: 80upx;
	}
</style>
