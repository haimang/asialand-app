<template>
	<view class="content skeleton">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<skeleton selector="skeleton" bgcolor="transparent" v-if="showSkeleton"></skeleton>
		<view class="header flex row " @click="bindSearch">
			<image class="logo m-l-10" src="/static/img/logo_icon.png"></image>
			<text class="font-size-normal font-gray m-l-10">{{$t('Search')}} <text class="m-l-5 m-r-5 uni-bold">{{totalHouseCnt}}
				</text> {{$t('Asialand Projects')}}</text>
		</view>
		<text class="font-size-medium uni-bold m-t-15 m-b-15">{{$t('Featured Projects')}}</text>
		<uni-swiper-dot class="swiper skeleton-rect" :info="hotArray" :current="current" :mode="mode">
			<swiper class="swiper-box" @change="change">
				<swiper-item class="" v-for="(item, index) in hotArray" :key="index" @click="gotoPropertyDetail(item.hash, item.project_name_en, item.price.symbol,item.price.price_min)">
					<view class="flex column swiper_item">
						<text class="swiper_house_addr">{{item.project_name_en}}</text>
						<image class="house_img" :src="item.primary_image[0].medium + '/format/webp/quality/50'" @error="imageError"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<!-- <block v-if="this.isLogin && this.notificationList != null && this.notificationList.length > 0">
			<view class="top_label m-t-15 m-b-15 p-l-20 ">{{$t('Latest Notifications')}}</view>			
			<swiper class="scroll_latest skeleton-rect" vertical="true" :circular="true" :autoplay="true" :interval="2000" :duration="1000">
				<swiper-item v-for="(list, idx) in notificationList" :key="idx" :id="idx" class="small_info column m-r-10">				
					<view class="flex row push_item" @click="clickNews(list.hash)">
						<image class="push_img" :style="{width: (screenWidth - 40) / 4 + 'px',height: (screenWidth - 40) / 4 / 16 * 10 + 10 + 'px'}"
						 :src="list.image == null ? '/static/img/ic_room_default.png' : list.image + '/format/webp/quality/50'"></image>
						<view class="flex column justify-content-between" :style="{width: (screenWidth - 40) / 4 * 3 - 20 + 'px'}">
							<text class="font-size-small uni-bold line-two">{{list.title}}</text>
							<text class="font-size-small line-one">{{list.des}}</text>
							<text class="font-size-xsmall font-xGray">{{list.updated_at}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</block> -->
		
		<block v-if="this.isLogin && this.notificationList != null && this.notificationList.length > 0">
			<view class="top_label m-t-15 m-b-15 p-l-20 ">{{$t('Latest Notifications')}}</view>			
			<scroll-view class="scroll_latest skeleton-rect" scroll-y="true" show-scrollbar="false" scroll-with-animation="true" :scroll-into-view="scrollIntro">
				<block v-for="(list, idx) in notificationList" :key="idx"  class=" column m-r-10">				
					<view class="flex row small_info push_item" @click="clickNews(list.hash)" :id="'s' + idx">
						<image class="push_img" :style="{width: (screenWidth - 40) / 4 + 'px'}"
						 :src="list.image == null ? '/static/img/ic_room_default.png' : list.image + '/format/webp/quality/50'"></image>
						<view class="flex column justify-content-between" :style="{width: (screenWidth - 40) / 4 * 3 - 20 + 'px'}">
							<text class="font-size-small uni-bold line-two">{{list.title}}</text>
							<text class="font-size-small line-one">{{list.des}}</text>
							<text class="font-size-xsmall font-xGray">{{list.updated_at}}</text>
						</view>
					</view>
				</block>
			</scroll-view>
		</block>

		<view class="top_label m-t-15 flex row flex-wrap p-t-0 p-b-0">
			<view :class="'flex row  m-r-10 ' + (this.category_id == 0 ? 'category_sel_item' : 'category_item')" @click="changeCategory(0)">
				<text class="font-size-normal" :style="this.category_id == 0 ? 'font-weight:bold' : 'font-weight:normal'">{{$t('ALL')}}</text>
				<block v-if="category_id == 0">
					<image class="category_sel_img" src="/static/img/check_yellow-circle.png"></image>
				</block>
			</view>
			<view :class="'flex row  m-r-10 ' + (this.category_id == 1 ? 'category_sel_item' : 'category_item')" @click="changeCategory(1)">
				<text class="font-size-normal" :style="this.category_id == 1 ? 'font-weight:bold' : 'font-weight:normal'">{{$t('Completed')}}</text>
				<block v-if="category_id == 1">
					<image class="category_sel_img" src="/static/img/check_yellow-circle.png"></image>
				</block>
			</view>
			<view :class="'flex row  m-r-10 ' + (this.category_id == 3 ? 'category_sel_item' : 'category_item')" @click="changeCategory(3)">
				<text class="font-size-normal" :style="this.category_id == 3 ? 'font-weight:bold' : 'font-weight:normal'">{{$t('Under Construction')}}</text>
				<block v-if="category_id == 3">
					<image class="category_sel_img" src="/static/img/check_yellow-circle.png"></image>
				</block>
			</view>
			<view :class="'flex row  m-r-10 ' + (this.category_id == 2 ? 'category_sel_item' : 'category_item')" @click="changeCategory(2)">
				<text class="font-size-normal" :style="this.category_id == 2 ? 'font-weight:bold;' : 'font-weight:normal'">{{$t('Off-the-plan')}}</text>
				<block v-if="category_id == 2">
					<image class="category_sel_img" src="/static/img/check_yellow-circle.png"></image>
				</block>
			</view>
			<view :class="'flex row  m-r-10 ' + (this.category_id == 4 ? 'category_sel_item' : 'category_item')" @click="changeCategory(4)">

				<text class="font-size-normal" :style="this.category_id == 4 ? 'uni-bold' : 'font-weight:normal'">{{$t('Other')}}</text>
				<block v-if="category_id == 4">
					<image class="category_sel_img" src="/static/img/check_yellow-circle.png"></image>
				</block>
			</view>
		</view>
		<block v-if='$t("Price") == "价格"'>
			<text class="font-size-small m-t-10 m-l-5">当前“{{this.category_id == 0 ? "全部" : this.category_id == 1 ? "现房" : this.category_id == 2 ? "期房" : this.category_id == 3 ? "建造中" : "其他"}}”筛选项下，为您找到 <text class="uni-bold m-l-5 m-r-5"> {{houseCnt}} </text> 个项目</text>
		</block>
		<block v-else>
			<text class="font-size-small m-t-10 m-l-5">Under the “{{this.category_id == 0 ? "All" : this.category_id == 1 ? "Completed" : this.category_id == 2 ? "Off-the-plan" : this.category_id == 3 ? "Under construction" : "Other"}}”filter，found<text class="uni-bold m-l-5 m-r-5"> {{houseCnt}} </text> items </text>
		</block>
		<view class="products">
			<scroll-view v-if="houseList != undefined && houseList != null && houseList.length > 0" class="scroll-v list skeleton-rect"
			 enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
				<block v-for="(item, idx) in houseList" :key="idx">
					<house-item-v2 class="m-t-20" :info="item" :isSaved.sync="item.isSaved" @saveClick="saveProperty"></house-item-v2>
				</block>
			</scroll-view>
			<view class="loading-more m-t-5" v-if="isLoading">
				<image class="loading-icon" src="data:image/svg+xml;base64,IDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnPjxwYXRoIGZpbGw9J25vbmUnIGQ9J00wIDBoMTAwdjEwMEgweicvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0U5RTlFOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyM5ODk2OTcnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMzAgMTA1Ljk4IDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nIzlCOTk5QScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNBM0ExQTInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNjUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQUJBOUFBJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDEyMCA1OC42NiA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNCMkIyQjInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0JBQjhCOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQzJDMEMxJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQ0JDQkNCJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xMjAgNDEuMzQgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjRDJEMkQyJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC05MCAzNSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNEQURBREEnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTYwIDI0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0UyRTJFMicgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtMzAgLTUuOTggNjUpJy8+PC9zdmc+"></image>
				<text class="loading-more-text m-l-10">{{$t('Loading')}}</text>
			</view>
			<view class="loading-more m-t-5" v-if="isEndList">
				<text class="loading-more-text">{{$t('No more data')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import skeleton from '../../components/skeleton'
	import service from '../../service.js';
	import apiUrl from '../../common/apiUrl.js';
	import common from '../../common/common.js';
	import {
		showLoading,
		hideLoading
	} from 'common/loading'

	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'
	import HouseItemV2 from '../../components/house-item-v2.vue'

	export default {
		data() {
			return {
				isEndList: false,
				isLoading: false,
				navigateFlag: false,
				pulling: false,
				page: 1,
				pageSize: 10,
				refreshing: false,
				refreshFlag: false,
				refreshText: "已刷新",
				refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
				toBottom: '',
				screenWidth: 0,
				current: 0,
				mode: 'default',
				tempList: [],
				houseList: [],
				newsList: [],
				hotArray: [],
				notificationList: [],
				showSkeleton: true,
				totalHouseCnt: 0,
				category_id: 0,
				isLogin: false,
				scrollHeight:0,
				height:0,
				animationData:{},
				scrollIndex:0,
				houseCnt:0,
				scrollIntro:"0",
			}
		},
		computed: mapState(['forcedLogin']),
		components: {
			HouseItemV2,
			skeleton
		},
		onReachBottom: function() {
			if (!this.isEndList && !this.isLoading) {
				this.loadMore()
			}
		},
		onShow() {
			this.isLogin = uni.getStorageSync("isLogin")
			if (uni.getStorageSync("isLogin")) {
				this.getSaveList()
			}
		},
		onLoad(option) {

			this.tempList = []
			this.houseList = []
			this.page = 1
			hideLoading()

			setTimeout(() => {
				this.isEndList = false
				this.getThirdToken()
			}, 500)
		},
		methods: {
			// getHeight(Class) {
			// 	let query = uni.createSelectorQuery().in(this);
			// 	query.selectAll(Class)
			// 		.boundingClientRect(data => {
			// 			this.height = data[0].height;
			// 			console.log(this.height);
			// 		})
			// 		.exec();
			// },
			// newsScroll() {
			// 	let speed = 2000;
			// 	let animation = uni.createAnimation({
			// 		duration: this.getHeight(".scroll_latest") / speed,
			// 		timingFunction:"linear",
			// 		delay:0
			// 	});
			// 	this.animation = animation;
			// 	setInterval(()=>{
			// 		if(this.scrollHeight >= 300) {
			// 			animation.translateY(0).step();
			// 			this.scrollHeight = 0;
			// 			this.animationData = animation.export();
			// 		}
			// 		else {
			// 			this.scrollHeight = this.scrollHeight + 100;
			// 			animation.translateY(-this.scrollHeight).step();
			// 			this.animationData = animation.export()
			// 		}
			// 	}, speed);
			// },
			imageError(e) {
				console.log("image show error:" + e.detail.errMsg);
			},
			getThirdToken() {
				var that = this
				//showLoading(this.$t('Loading'))

				uni.request({
					url: apiUrl.getTokenApi, //仅为示例，并非真实接口地址。
					data: {
						appId: common.appId,
						appSecret: common.appSecret
					},
					success: (res) => {
						console.log(res.data);

						if (res.data != null) {
							uni.setStorageSync("token", res.data.data.systemToken);
							that.getPropertyTotalCount()
							that.getProperties()
							that.getPushList()
							that.getRecommendedProperties()

							if (uni.getStorageSync("isLogin")) {
								that.getUnreadPush()
							}
						}
					}
				});
			},
			clickNews(hash) {
				if (this.navigateFlag) {
					return;
				}
				this.navigateFlag = true;
				var title = "",
					time = ""
				for (var i = 0; i < this.notificationList.length; i++) {
					if (this.notificationList[i].hash == hash) {
						title = this.notificationList[i].title
						time = this.notificationList[i].updated_at
					}
				}
				uni.navigateTo({
					url: "../notification/detail?hash=" + hash + "&title=" + title + "&time=" + time
				})
				setTimeout(() => {
					this.navigateFlag = false;
				}, 200)
			},
			attemptLogin() {
				uni.navigateTo({
					url: '../search/search',
				});
			},
			changeCategory(id) {
				this.category_id = id
				this.isLoading = true
				this.isEndList = false
				this.page = 1;
				this.houseCnt = 0;
				this.houseList = []
				this.tempList = []
				this.getProperties()
			},
			change(e) {
				this.current = e.detail.current;
			},
			getScreenWidth() {
				// this.screenWidth = document.documentElement.clientWidth;
				this.screenWidth = uni.getSystemInfoSync().screenWidth;
			},
			loadMore(e) {
				if (!this.isLoading) {
					this.isLoading = true
					this.isEndList = false
					this.page++;
					this.getProperties()
				}

			},
			getPushList() {
				if (uni.getStorageSync("isLogin")) {
					var that = this
					uni.request({
						url: apiUrl.getPushList, //仅为示例，并非真实接口地址。
						header: {
							Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
						},
						data: {
							token: uni.getStorageSync("token"),
							page: 1,
							pageSize: 9,
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
								
								for(var  i = 0 ;i < 100; i++) {
									that.notificationList = that.notificationList.concat(res.data.data.lists)
								}
								
								this.scrollIndex = 0;
								setInterval(()=>{
									if(this.scrollIndex < this.notificationList.length - 3) {
										this.scrollIndex ++;
									}
									else {
										this.scrollIndex = 0;
									}
									
									this.setScroll()
								},2000);
							} else {
								that.isLoading = false
							}
						}
					});
				}
			},
			setScroll(){
				this.scrollIntro = 's' + this.scrollIndex;
			},
			onPullDownRefresh() {
				setTimeout(() => {
					//this.getArticles();
					// this.tempList = []
					// this.houseList = []
					// this.page = 1
					this.page++;
					this.getProperties();
				}, 500)
			},
			bindSearch() {
				uni.navigateTo({
					url: "../search/search"
				})
			},
			getUnreadPush() {
				var that = this
				uni.request({
					url: apiUrl.getNoReadPush, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						scene:"app"
					},
					header: {
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
					success: (res) => {
						console.log(res.data);
						var unreadCount = res.data.data.unread_notifications
						uni.setStorageSync("unreadCount", unreadCount)

						console.log("unreadCount:" + unreadCount)
						if (unreadCount > 0) {
							uni.setTabBarBadge({
								index: 2,
								text: unreadCount + ""
							})
							if (uni.getStorageSync("isShowNotificationReminder") != 1) {
								if (uni.getStorageSync("language") == "zh_CN") {
									uni.showModal({
										title: "提示",
										content: "您有" + unreadCount + "条未读消息",
										confirmText: '好',
										showCancel: false,
										success: res => {
											if (res.confirm) {
												uni.switchTab({
													url: "/pages/notification/index"
												})
											} else {
												// 否则点击了取消  
											}
										}
									})
								} else {
									uni.showModal({
										title: "Reminder",
										content: "You have " + unreadCount + " unread messages",
										confirmText: 'OK',
										showCancel: false,
										success: res => {
											if (res.confirm) {
												uni.switchTab({
													url: "/pages/notification/index"
												})
											} else {
												// 否则点击了取消  
											}
										}
									})
								}
								uni.setStorageSync("isShowNotificationReminder", 1)
							}

						}
					}
				});
			},
			// getArticles(){
			// 	var that = this
			// 	uni.request({
			// 	    url: apiUrl.getArticlelist, //仅为示例，并非真实接口地址。
			// 	    data: {
			// 	        token: uni.getStorageSync("token"),
			// 			page: 1,
			// 			pageSize: 10,
			// 			recommended:1
			// 	    },
			// 	    success: (res) => {
			// 	        console.log(res.data);
			// 			for(var i = 0; i < res.data.data.tops.length; i++) {
			// 				res.data.data.tops[i].published_at = common.timestampToTime(res.data.data.tops[i].published_at)
			// 			}
			// 			that.newsList = res.data.data.tops

			// 			for(var i = 0; i < res.data.data.articles.length; i++) {
			// 				res.data.data.articles[i].published_at = common.timestampToTime(res.data.data.articles[i].published_at)
			// 				this.newsList.push(res.data.data.articles[i])
			// 			}
			// 	    }
			// 	});
			// },
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
						if (res.data.code == 0 && res.data.data.collects.length > 0) {
							for (var p_i = 0; p_i < that.tempList.length; p_i++) {
								for (var i = 0; i < res.data.data.collects.length; i++) {
									if (res.data.data.collects[i].hash == that.tempList[p_i].hash) {
										that.tempList[p_i].isSaved = true
									}
								}
							}
						}
						that.houseList = that.tempList
						console.log("house count:" + that.houseList.length)
						setTimeout(() => {
							that.showSkeleton = false
						}, 200)
					}
				});
			},
			getRecommendedProperties() {
				var that = this
				this.isLoading = true
				uni.request({
					url: apiUrl.v2_getPropertyList, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						page: this.page,
						pagesize: this.pageSize,
						country: "1",
						scene:"app",
						display_status: "2",    //2:recommended
					},
					success: (res) => {
						hideLoading()
						uni.stopPullDownRefresh()

						console.log(res.data);
						that.hotArray = res.data.data.properties
					}
				});
			},

			getPropertyTotalCount() {
				var that = this
				uni.request({
					url: apiUrl.v2_getPropertyList, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						page: this.page,
						scene:"app",
						pagesize: this.pageSize,
						country: "1",
					},
					success: (res) => {
						if (res.data.code == 0) {
							if (res.data.data.properties != null && res.data.data.properties.length > 0) {
								uni.setStorageSync("property_cnt", res.data.data.total);
								that.totalHouseCnt = res.data.data.total;
							}
						} else {
							if (res.data.message === "第三方授权登录失败或已过期") {
								common.getThirdToken()
							}
						}
					}
				});
			},

			getProperties() {
				var that = this
				this.isLoading = true
				uni.request({
					url: apiUrl.v2_getPropertyList, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						page: this.page,
						pagesize: this.pageSize,
						country: "1",
						progress_status: this.category_id != 0 && this.category_id != 4 ? this.category_id : '',
						show_recommended_units: 1,
						scene:"app",
						keyword: this.category_id == 4 ? "nomination" : ""
						//is_home:"1"
					},
					success: (res) => {
						hideLoading()
						uni.stopPullDownRefresh()

						console.log(res.data);
						if (res.data.code == 0) {
							if (res.data.data.properties != null && res.data.data.properties.length > 0) {
								that.tempList = that.tempList.concat(res.data.data.properties)
								that.houseCnt = res.data.data.total;
								for (var p_i = 0; p_i < that.tempList.length; p_i++) {
									that.tempList[p_i].isSaved = false
								}
								
								if (uni.getStorageSync("isLogin")) {
									that.getSaveList()
								} else {
									that.houseList = that.tempList
									console.log("house count:" + that.houseList.length)
									setTimeout(() => {
										that.showSkeleton = false
									}, 200)
								}
								that.isLoading = false
								if (res.data.data.properties.length < this.pageSize) {
									that.isEndList = true
								}
							} else {
								setTimeout(() => {
									that.showSkeleton = false
								}, 200)

								that.isLoading = false
								that.isEndList = true
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							});

							if (res.data.message === "第三方授权登录失败或已过期") {
								common.getThirdToken()
							}
						}
					}
				});
			},
			gotoPropertyDetail(hash, name, symbol,price) {
				console.log("property detail:" + price) 
				uni.navigateTo({
					url: '/pages/house/detail?hash=' + hash + "&name=" + name + "&price=" + symbol + common.currency(price)
				})
			},
			saveProperty(e) {
				showLoading(this.$t('Loading'))

				var that = this
				uni.request({
					url: apiUrl.saveProperty, //仅为示例，并非真实接口地址。
					method: "POST",
					header: {
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
					data: {
						token: uni.getStorageSync("token"),
						status: e.status ? 1 : 0,
						scene: common.scene + "11410",
						value: e.hash
					},
					success: (res) => {
						console.log(res.data);
						hideLoading()
						for (var i = 0; i < that.tempList.length; i++) {
							if (that.tempList[i].hash == e.hash) {
								that.tempList[i].isSaved = e.status
								break;
							}
						}

						that.houseList = that.tempList
					}
				});
			},
		},
		created() {
			this.getScreenWidth()
		},

		onReady() {}
	}
</script>

<style scoped>
	.loading-icon {
		width: 40upx;
		height: 40upx;
		transition: .3s;
		animation: loading 1s steps(12) infinite;
	}

	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(1turn);
		}
	}

	.logo {
		width: 60upx;
		height: 60upx;
	}

	.refresh {
		width: 750upx;
		height: 64px;
		justify-content: center;
	}

	.header {
		width: 100%;
		height: 110upx;
		border-radius: 10upx;
		background-color: rgba(255, 255, 255, 100);
		text-align: center;
		box-shadow: 0px 4upx 24upx -16upx rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 100);
		align-items: center;
	}

	.house_img {
		width: 100%;
		height: 450upx;
	}

	.swiper,
	.swiper-box {
		height: 450upx;
		z-index:100;
	}

	.swiper_house_addr {
		position: absolute;
		bottom: 60upx;
		z-index: 100;
		width: 100%;
		text-align: center;
		color: white;
		font-weight: bold;
		font-size: 32upx;
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

	.scroll_latest {
		width: 100%;
		height:450upx !important;
		white-space: nowrap;
	}

	.small_info {
		white-space: nowrap;
		height:130upx !important;
		display: inline-block;
	}

/* 	.small_info>uni-image {
		height: 180upx;
		border-radius: 10upx;
	} */

	.house_addr {
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
		overflow: hidden;
	}

	.scroll-v {
		flex: 1;
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
		width: 100%;
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

	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}

	.content {
		padding: 30upx;
		box-sizing: border-box;
		width: 100%;
	}

	.push_img {
		width: 160upx;
		height: 130upx;
		border-radius: 10upx;
		margin-right: 20upx;
	}

	.push_item {
		margin-bottom: 20upx;
	}

	.category_item {
		justify-content: center;
		align-items: center;
		padding:0px 10upx;	
		margin-top:15upx;
		margin-bottom:15upx;
	}
	
	.category_sel_item{
		justify-content: center;
		align-items: center;
		padding:0px 10upx;
		box-shadow: 0px 0px 20upx 0px rgba(217, 192, 119, 1);
		border: 1px solid rgba(217, 192, 119, 100);
		margin-top:15upx;
		margin-bottom:15upx;
	}

	.category_sel_img {
		width: 24upx;
		height: 24upx;
		margin-left: 10upx;
	}
	
	.uni-scroll-view, .uni-scroll-view-content {
		display: flex !important;
		flex-direction: column !important;
	}
</style>
