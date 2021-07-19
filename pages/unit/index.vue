<template>
	<view class="content w-100">
		<view class="header flex column">
			<text class="font-size-big m-l-15 uni-bold">
				{{this.totalCnt}} {{$t('Total Available Units')}}
			</text>
			<text class="font-size-normal m-l-15 m-b-20">
				{{address}}
			</text>
			<view class="flex row m-l-15 m-b-20">
				<view class="picker_view font-size-normal" style="flex: 0 0 30%;" @click="openBedPicker">
					<text>{{bed}}</text>
					<image class="select-icon" src="/static/img/antOutline-caret-down.png"></image>
				</view>
				<!-- <view class="picker_view font-size-normal" style="flex: 0 0 30%;" @click="openCountryPicker">
					<text>{{price}}</text>
					<image src="/static/img/antOutline-caret-down.png" style="width:24upx;height:24upx;"></image>
				</view> -->
			</view>
		</view>
		<view class="data p-t-10 p-l-15 p-r-15">
			<text class="font-size-normal">{{$t("Select an Available unit below to start reservation")}}</text>
		</view>

		<view class="flex column align-center m-t-10 unit-item m-l-15 m-r-15" v-for="(item,index) in showUnits" :key="index"
		 @click="gotoDetail(item.hash)">
			<view class="flex row space-between w-100 m-b-10">
				<view class="flex column">
					<text class="uni-bold font-gray">{{item.unit_number}}</text>
					<view class="bar"></view>
				</view>
				<view class="flex row align-center">
					<view class="circle_mark" :class="item.sales_status == '2' ? 'back_green' : item.sales_status == '3' ? 'back_yellow' : 'back_red'"></view>
					<text class="uni-bold m-l-10" :class="item.sales_status == '2' ? 'col_green' : item.sales_status == '3' ? 'col_yellow' : 'col_red'">{{item.sales_status == '2' ? $t('Available') : item.sales_status == '3' ? $t('Reserved') : $t('Sold')}}</text>
				</view>
			</view>

			<view class="w-100">
				<image :src="item.floorplan + '/format/webp/quality/50'" style="float:left" class="plan m-r-10" mode="widthFix" />
				<view class="flex column m-l-20">
					<text class="font-size-normal font-gray">{{$t("Total Price")}}:<text class="uni-bold m-l-10">{{item.price_total}}</text></text>
					<text class="font-size-normal uni-bold font-gray">{{item.spec_bed}}{{" " + $t("Bed")}} {{item.spec_bath}}{{" " + $t("Bath")}}{{" " + item.spec_car}}{{" " + $t("Car")}}
					</text>
					<view class="flex column flex-wrap">
						<view class="font-size-small font-gray m-r-10">{{$t('Land Size')}} : {{item.size_land}}{{item.size_land == null || item.size_land == undefined || item.size_land == '' ? '' : item.size_unit}}</view>
						<view class="font-size-small font-gray  ">{{$t('House Size')}} : {{item.size_house_design}}{{item.size_unit}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loading-more m-t-5" v-if="noData">
			<text class="loading-more-text">{{$t('No data')}}</text>
		</view>
		<view class="m-t-30 m-b-30"></view>
		<view class="mask" v-show="pickerShow">
			<view class="pickerView" v-show="pickerShow">
				<view class="demo-flex">
					<view class="select-time">
						{{$t("Select Bedrooms count")}}
					</view>
					<view class="of-sourceof" @click="selectBedCount">
						{{$t("Ok")}}
					</view>
				</view>
				<picker-view class="picker" indicator-class="indicator" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item, index) in bedPickArray" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
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
				address: '',
				availableCnt: 4,
				bed: this.$t("ALL"),
				price: "Price",
				hash: "",
				page: 1,
				pageSize: 999,
				unitArray: [],
				showUnits: [],
				bedPickArray: [],
				pickerShow: '',
				pickerValue: [0],
				noData: false,
				totalCnt: 0
			}
		},
		onLoad(option) {
			this.hash = option.hash
			this.address = option.name
			// this.hash = "HCPP-zxLfuXalzS"
			this.getPropertyDetail()
			this.getUnitList()

			this.bedPickArray.push(this.$t("ALL"))
			if (uni.getStorageSync("language") == "en") {
				for (var i = 1; i < 5; i++) {
					this.bedPickArray.push(i + " " + this.$t("Bed"))
				}
			} else {
				for (var i = 1; i < 5; i++) {
					this.bedPickArray.push(i + " " + this.$t("Bed"))
				}
			}
		},
		onShow() {
			uni.setNavigationBarTitle({ // 修改头部标题
				title: this.$t("Available Units")
			});
		},
		methods: {
			openBedPicker() {
				this.pickerShow = true
			},
			bindChange(e) {
				console.log(e)
				this.pickerValue = e.detail.value[0]
			},
			closemask() {
				this.pickerShow = false
			},
			selectBedCount() {
				this.bed = this.bedPickArray[this.pickerValue]
				this.showUnits = []
				if (this.bed === this.$t("ALL")) {
					this.showUnits = this.unitArray;
				} else {
					for (var i = 0; i < this.unitArray.length; i++) {
						if (this.unitArray[i].spec_bed == this.bed.substring(0, 1)) {
							this.showUnits.push(this.unitArray[i])
						}
					}
				}

				if (this.showUnits.length == 0) {
					this.noData = true
				} else {
					this.noData = false
				}
				this.closemask()
			},
			gotoDetail(hash) {
				uni.navigateTo({
					url: "/pages/unit/detail?hash=" + hash
				})
			},
			getPropertyDetail() {
				var that = this
				uni.request({
					url: apiUrl.getPropertyDetail,
					data: {
						token: uni.getStorageSync("token"),
						hash: this.hash
					},
					success: (res) => {
						hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							that.address = res.data.data.address.address
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							});
						}
					}
				});
			},
			getUnitList() {
				showLoading(this.$t("Loading"))
				uni.request({
					url: apiUrl.getUnitList,
					header: {
						Authorization: "Bearer " + (uni.getStorageSync("isLogin") ? uni.getStorageSync("userInfo").authToken.token : '')
					},
					data: {
						token: uni.getStorageSync("token"),
						page: this.page,
						pageSize: this.pageSize,
						hash: this.hash
					},
					success: (res) => {
						console.log(res.data);
						hideLoading()
						if (res.data.code == 0) {
							this.unitArray = res.data.data.units
							this.totalCnt = res.data.data.total
							for (var i = 0; i < this.unitArray.length; i++) {
								if (uni.getStorageSync("language") == "en") {
									this.unitArray[i].price_total = '$' + common.currency(this.unitArray[i].price_total);
									// this.unitArray[i].price_total = '$' + (this.unitArray[i].price_total.toFixed(2) + "").replace(
									// 	/\d(?=(\d{3})+\.)/g, '$&,');
									// this.unitArray[i].price_total = this.unitArray[i].price_total.substring(0, this.unitArray[i].price_total.indexOf(
									// 	"."))
									// this.unitArray[i].price_total = "$" + (this.unitArray[i].price_total / 1000).toFixed(2) + "K" 
								} else {
									this.unitArray[i].price_total = '$' + common.currency(this.unitArray[i].price_total);
									// this.unitArray[i].price_total = (this.unitArray[i].price_total / 10000).toFixed(2) + this.$t("Million")
								}
							}

							this.showUnits = this.unitArray
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							});
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

	.header {
		background-color: rgba(248, 248, 248, 100);
		width: 100%;
	}

	.picker_view {
		flex: 0 0 30%;
		background-color: #eee;
		;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 10upx;
		height: 80upx;
		line-height: 80upx;
		justify-content: space-between;
		padding: 0px 20upx;
		margin-right: 20upx;
	}

	.data {
		background-color: white;
	}


	.plan {
		width: 150upx;
		height: 150upx;
	}

	.bar {
		width: 50upx;
		height: 6upx;
		background-color: rgba(217, 192, 119, 100);
		text-align: center;
		border-radius: 2upx;
	}

	.unit-item {
		border: 1px solid rgba(217, 192, 119, 100);
		padding: 20upx;
	}

	.col_green {
		color: #52C41A;
	}

	.col_yellow {
		color: #FADB14;
	}

	.col_red {
		color: #E33005;
	}

	.circle_mark {
		width: 20upx;
		height: 20upx;
		border-radius: 20upx;
	}


	.back_green {
		background-color: #52C41A;
	}

	.back_yellow {
		background-color: #FADB14;
	}

	.back_red {
		background-color: #E33005;
	}

	.countryCode {
		flex: 0 0 30%;
		border: 2upx solid #e7e7e7;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0px 20upx;
		margin-right: 20upx;
	}

	.pickerView {
		width: 100%;
		height: 400upx;
		background-color: #FFFFFF;
		position: absolute;
		bottom: 0;
	}

	.picker {
		background-color: #EEEEEE;
		position: absolute;
		width: 100%;
		height: 288upx;
		bottom: 20upx;
	}

	.item {
		height: 68upx;
		line-height: 68upx;
		font-size: 32upx;
		text-align: center;
	}
</style>


<style scoped lang="scss">
	.mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.demo-flex {
		display: flex;
		align-items: center;

		.select-time {
			height: 96upx;
			line-height: 96upx;
			font-size: 32upx;
			font-family: "PingFangSC, PingFangSC-Medium";
			font-weight: 500;
			text-align: center;
			color: #323233;
			flex: 1;
			padding-left: 90upx;

		}
	}

	.select-time {
		height: 96upx;
		line-height: 96upx;
		font-size: 32upx;
		font-family: "PingFangSC, PingFangSC-Medium";
		font-weight: 500;
		text-align: center;
		color: #323233;
		flex: 1;
		padding-left: 90upx;

	}

	.of-sourceof {
		height: 96upx;
		line-height: 96upx;
		font-size: 30upx;
		font-family: "PingFangSC, PingFangSC-Regular";
		text-align: center;
		color: #3388ff;
		padding-right: 32upx;
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

	.select-icon {
		width: 30upx;
		height: 20upx;
	}
</style>
