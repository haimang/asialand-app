<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="status_bar">  
			<view class="top_view"></view>  
		</view>  -->
		<!-- #endif -->
		<view class="header flex row space-between">
			<view class="flex column">
				<image class="login-logo m-b-10 m-l-15 m-t-20" mode="widthFix" src="/static/img/logo.png" />
				<text class="font-size-big m-l-15 uni-bold">
					{{$t('Save Properties')}}
				</text>
				<text class="font-size-normal m-l-15 m-b-20">
					{{$t('Access most important ones')}}
				</text>
			</view>
			<button class="btn m-b-20 m-r-20 flex align-center" style="height:60upx;margin-top:50px;" @tap="gotoMap">
				<image src="/static/img/fa-location-arrow.png" mode="widthFix" style="width:18px;margin-right:5px;" />
				<text class="font-size-small uni-bold">{{$t('Property Map')}}</text>
			</button>
		</view>
		<view class="data m-b-50">
			<view class="font-size-normal m-l-15 m-t-10 m-b-10">{{header_txt}}</view>
			<view class="m-l-15 m-r-15" v-if="propertyList != undefined && propertyList != null && propertyList.length > 0">
				<block v-for="(item, idx) in propertyList" :key="idx">
					<house-item class="m-t-10" :info="item" :isSaved="true" @saveClick="share"></house-item>
				</block>
			</view>

		</view>
	</view>
</template>

<script>
	import HouseItem from '../../components/house-item.vue'
	import common from '../../common/common.js'
	import apiUrl from '../../common/apiUrl.js'
	import {
		showLoading,
		hideLoading
	} from 'common/loading'

	export default {
		components: {
			HouseItem
		},
		onShow() {
			uni.setNavigationBarTitle({ // 修改头部标题
				title: this.$t("Saved Properties")
			});
		},
		data() {
			return {
				header_txt: '',
				savedList: [],
				propertyList: [],
				houseList: [{
					name: 'Oakleigh best townhouse',
					address: '16 Dover St, Oakleigh East VIC',
					price: '$120k - 150k',
					imgUrl: '/static/img/home1.png',
					moreCount: '44',
					linked: [{
							imgUrl: '/static/img/home_plan.png',
							name: 'Lot1',
							bed: '2',
							bath: '2',
							car: '1'
						},
						{
							imgUrl: '/static/img/home_plan.png',
							name: 'Lot1',
							bed: '2',
							bath: '2',
							car: '1'
						},
						{
							imgUrl: '/static/img/home_plan.png',
							name: 'Lot1',
							bed: '2',
							bath: '2',
							car: '1'
						}
					]
				}],
			}
		},
		onLoad(option) {
			this.getSaveList()
			this.propertyList = []
		},
		methods: {
			share(e) {
				for (var index in this.propertyList) {
					if (this.propertyList[index].hash == e.hash && e.isSaved) {
						this.propertyList.splice(index, 1)
						break;
					}
				}
				if (uni.getStorageSync("language") === "en") {
					this.header_txt = "You have " + this.propertyList.length + " saved projects"
				} else {
					this.header_txt = "您有" + this.propertyList.length + "个保存的项目"
				}
			},
			getDetail(hash) {
				showLoading(this.$t("Loading"))

				var that = this
				uni.request({
					url: apiUrl.getPropertyDetail, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: hash
					},
					success: (res) => {
						hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							if (res.data.data != null) {
								that.detailInfo = res.data.data

								if (uni.getStorageSync("language") == "en") {
									if (that.detailInfo.unit_featured.length > 0) {
										for (var i = 0; i < that.detailInfo.unit_featured.length; i++) {
											that.detailInfo.unit_featured[i].price_total = that.detailInfo.symbol + (that.detailInfo.unit_featured[i]
												.price_total / 1000000).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + "M"
										}
									}
								} else {
									if (that.detailInfo.unit_featured.length > 0) {
										for (var i = 0; i < that.detailInfo.unit_featured.length; i++) {
											that.detailInfo.unit_featured[i].price_total = (that.detailInfo.unit_featured[i].price_total / 10000).toFixed(
												2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + that.$t("Million")
										}
									}
								}

								for (var i = 0; i < that.savedList.length; i++) {
									if (that.savedList[i].hash == that.detailInfo.hash) {
										that.propertyList.push(that.detailInfo)
									}
								}
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							});
						}

					}
				});
			},
			getSaveList() {
				var that = this
				showLoading(this.$t("Loading"))
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
						if (that.savedList.length > 0) {
							for (var i = 0; i < that.savedList.length; i++) {
								that.savedList[i].isSaved = true
								that.getDetail(that.savedList[i].hash)
							}

							if (uni.getStorageSync("language") === "en") {
								that.header_txt = "You have " + that.savedList.length + " saved projects"
							} else {
								that.header_txt = "您有" + that.savedList.length + "个保存的项目"
							}
						}
					}
				});
			},
			gotoMap() {
				uni.navigateTo({
					url: "../map/search_map?type=&keyword=&rangeMin=30&rangeMax=500"
				})
			}
		}
	}
</script>

<style>
	.content {
		padding: 0px;
		background: white;
		background-color: #f8f8f8;
	}

	.header {
		background-color: white;
		width: 100%;
	}

	.login-logo {
		height: 32upx !important;
		width: 310upx;
	}

	.data {
		width: 100%;
		background-color: #f8f8f8;
	}

	uni-toast {
		background: white;
	}
</style>
