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
			<text class="font-size-normal font-gray m-l-10">{{$t('Search')}} <text class="m-l-5 m-r-5 uni-bold">{{totalHouseCnt}} </text> {{$t('Asialand Projects')}}</text>
		</view>
		<text class="font-size-medium uni-bold m-t-15 m-b-15">{{$t('Featured Projects')}}</text>
		<uni-swiper-dot class="swiper skeleton-rect" :info="hotArray" :current="current" :mode="mode">
			<swiper class="swiper-box" @change="change">
				<swiper-item class="" v-for="(item, index) in hotArray" :key="index" @click="gotoPropertyDetail(item.hash, item.name, item.price)">
					<view class="flex column swiper_item">
						<text class="swiper_house_addr">{{item.name}}</text>
						<image class="house_img" :src="item.images[0].url + '/format/webp/quality/50'"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="top_label m-t-15 m-b-15 p-l-20 ">{{$t('Latest Market News')}}</view>
		<scroll-view class="scroll_latest skeleton-rect" :scroll-x="true" :show-scrollbar="false">
			<view v-for="(list, idx) in newsList" :key="idx" :id="idx" :data-current="idx" class="small_info column m-r-10" :style="{width: (screenWidth - 20) / 2 + 'px'}" @click="clickNews(list.hash)">
				<image class="img" :style="{width: (screenWidth - 20) / 2 + 'px'}" :src="list.image == null ? '/static/img/ic_room_default.png' : list.image + '/format/webp/quality/50'"></image>
				<text class="font-size-normal house_addr line-one">{{list.name}}</text>
				<text class="font-size-small font-xGray">{{list.published_at}}</text>
			</view>
		</scroll-view>
		<view class="top_label m-t-15 ">{{$t('Our Projects')}}</view>
		<view class="products">
		<scroll-view v-if="houseList != undefined && houseList != null && houseList.length > 0" class="scroll-v list skeleton-rect" enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
			<block v-for="(item, idx) in houseList" :key="idx">
				<house-item class="m-t-20" :info="item" :isSaved.sync="item.isSaved" @saveClick="saveProperty"></house-item>
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
	import HouseItem from '../../components/house-item.vue'

	export default {
		data() {
			return {
				isEndList:false,
				isLoading:false,
				navigateFlag:false,
				pulling: false,
				page:1,
				pageSize:10,
				refreshing : false,
				refreshFlag : false,
				refreshText: "已刷新",
				refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
				toBottom: '',
				screenWidth: 0,
				current: 0,
				mode: 'default',
				tempList:[],
				houseList: [],
				newsList: [],
				hotArray: [],
				showSkeleton:true,
				totalHouseCnt:0
			}
		},
		computed: mapState(['forcedLogin']),
		components:{
			HouseItem,
			skeleton
		},
		onReachBottom: function() {
			if(!this.isEndList && !this.isLoading) {
				this.loadMore()
			}
		},
		onShow() {
			if(uni.getStorageSync("isLogin")) {
				this.getSaveList()
			}
		},
		onLoad(option){
			this.tempList = []
			this.houseList = []
			this.page = 1
			hideLoading()
			
			setTimeout(() => {
				this.isEndList = false
				this.getThirdToken()
			},500)
		},
		methods: {
			getThirdToken(){
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
						
						if(res.data != null) {
							uni.setStorageSync("token",res.data.data.systemToken);
							that.getProperties()
							that.getArticles()
							that.getRecommendedProperties()
						}
				    }
				});
			},
			clickNews(hash){
				if (this.navigateFlag) {
				    return;
				}
				this.navigateFlag = true;
				var title = "", time = ""
				for(var i = 0; i< this.newsList.length; i ++) {
					if(this.newsList[i].hash == hash) {
						title = this.newsList[i].name
						time = this.newsList[i].published_at
					}
				}
				uni.navigateTo({
					url: '../news/detail?hash=' + hash + "&title=" + title + "&time=" + time
				});
				setTimeout(() => {
				    this.navigateFlag = false;
				}, 200)
			},
			attemptLogin() {
				uni.navigateTo({
					url: '../search/search',
				});
			},
			change(e) {
				this.current = e.detail.current;
			},
			getScreenWidth() {
				// this.screenWidth = document.documentElement.clientWidth;
				this.screenWidth = uni.getSystemInfoSync().screenWidth;
			},
			loadMore(e) {
				if(!this.isLoading) {
					this.isLoading = true
					this.isEndList = false
					this.page ++;
					this.getProperties()
				}
			    
			},
			onPullDownRefresh(){
				setTimeout(() => {
					//this.getArticles();
					// this.tempList = []
					// this.houseList = []
					// this.page = 1
					this.page ++;
					this.getProperties();
				},500)	
			},
			bindSearch(){
				uni.navigateTo({
					url:"../search/search"
				})
			},
			getArticles(){
				var that = this
				uni.request({
				    url: apiUrl.getArticlelist, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						page: 1,
						pageSize: 10,
						recommended:1
				    },
				    success: (res) => {
				        console.log(res.data);
						for(var i = 0; i < res.data.data.tops.length; i++) {
							res.data.data.tops[i].published_at = common.timestampToTime(res.data.data.tops[i].published_at)
						}
						that.newsList = res.data.data.tops
						
						for(var i = 0; i < res.data.data.articles.length; i++) {
							res.data.data.articles[i].published_at = common.timestampToTime(res.data.data.articles[i].published_at)
							this.newsList.push(res.data.data.articles[i])
						}
				    }
				});
			},
			getSaveList(){
				var that = this
				uni.request({
				    url: apiUrl.getSaveList, //仅为示例，并非真实接口地址。
					header:{
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
						if(res.data.code == 0 && res.data.data.collects.length > 0) {
							for(var p_i  = 0; p_i < that.tempList.length; p_i ++) {
								for(var i = 0; i < res.data.data.collects.length; i++) {
									if(res.data.data.collects[i].hash == that.tempList[p_i].hash) {
										that.tempList[p_i].isSaved = true
									}
								}	
							}		
						}
						that.houseList = that.tempList
						setTimeout(() => {
							that.showSkeleton = false
						}, 200)						
				    }
				});
			},
			getRecommendedProperties(){
				var that = this
				this.isLoading = true
				uni.request({
				    url: apiUrl.getPropertyList, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						page: this.page,
						pageSize: this.pageSize,
						country: "1",
						is_recommended:"1",
				    },
				    success: (res) => {
						hideLoading()
						uni.stopPullDownRefresh()
						
				        console.log(res.data);
						that.hotArray = res.data.data.properties
						for(var i = 0; i < that.hotArray.length; i++) {
							var price = 0
							if(uni.getStorageSync("language") === "en") {
								// if(that.hotArray[i].price_min_k < 1000) {
								// 	price = "$" + that.hotArray[i].price_min_k + "K" 
								// }
								// else {
								// 	price = "$" + that.hotArray[i].price_min_k / 1000 + "M" 
								// }
								price = "$" + common.currency(that.hotArray[i].price_min * 10000)
							}
							else {
								price = "$" + common.currency(that.hotArray[i].price_min * 10000)
								//price = that.hotArray[i].price_min + that.$t("Million")
								
							}	
							that.hotArray[i].price = price
						}			
						
				    }
				});
			},
			
			getProperties(){
				var that = this
				this.isLoading = true
				uni.request({
				    url: apiUrl.getPropertyList, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						page: this.page,
						pageSize: this.pageSize,
						country: "1",
						unit_is_recommended:"1",
						//is_home:"1"
				    },
				    success: (res) => {
						hideLoading()
						uni.stopPullDownRefresh()
						
				        console.log(res.data);
						if(res.data.code == 0) {
							if(res.data.data.properties != null && res.data.data.properties.length > 0) {
								uni.setStorageSync("property_cnt",res.data.data.total);
								that.tempList = that.tempList.concat(res.data.data.properties)
								that.totalHouseCnt = res.data.data.total;
								
								for(var p_i  = 0; p_i < that.tempList.length; p_i ++) {
									that.tempList[p_i].isSaved = false
								}
								
								if(uni.getStorageSync("isLogin")) {
									that.getSaveList()
								}
								else {
									that.houseList = that.tempList
									setTimeout(() => {
										that.showSkeleton = false
									}, 200)
								}
								that.isLoading = false
								if(res.data.data.properties.length < this.pageSize) {
									that.isEndList = true
								}
							} else {
								setTimeout(() => {
									that.showSkeleton = false
								}, 200)
								
								that.isLoading = false
								that.isEndList = true
							}
						}
						else {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							});
							
							if(res.data.message === "第三方授权登录失败或已过期") {
								common.getThirdToken()
							}
						}
				    }
				});
			},
			gotoPropertyDetail(hash, name, price){
				uni.navigateTo({
					url:'/pages/house/detail?hash=' + hash + "&name=" + name + "&price=" + price
				})
			},
			saveProperty(e){
				showLoading(this.$t('Loading'))
				
				var that = this
				uni.request({
				    url: apiUrl.saveProperty, //仅为示例，并非真实接口地址。
					method:"POST",
				    header:{
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
						for(var i = 0; i < that.tempList.length; i++) {
							if(that.tempList[i].hash == e.hash) {
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
	
	.loading-icon{
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
		height: 310upx;
		white-space: nowrap;
	}

	.small_info {
		white-space: nowrap;
		display: inline-block;
	}

	.small_info>uni-image {
		height: 180upx;
		border-radius: 10upx;
	}

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
	
	.loading-text{
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	
	.loading-more {
		display:flex;
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
		padding:30upx;
		box-sizing: border-box;
		width: 100%;
	}
</style>
