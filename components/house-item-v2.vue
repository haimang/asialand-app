<template>
	<view class="product">
		<view class="product-title">{{info.project_name_en}}</view>
		<image class="product-image" mode="aspectFill" :src="info.primary_image[0].medium + + '/format/webp/quality/50' ? info.primary_image[0].medium + '/format/webp/quality/50' : '/static/img/home1.png'"
		 @click="gotoDetail"></image>
		<view class="product-info flex row m-b-10">
			<view class="product-info-view flex column m-t-10">
				<view class="font-size-small ">
					<text class="font-gray m-r-5" style="float:left;">{{$t('Address')}}:</text>
					<text class="uni-bold m-l-5 line-one">{{info.location[1].address}}</text>
				</view>
				<view class="flex row font-size-small">
					<text class="font-gray">{{$t('Starting from') == "起售价" ? info.project_type_cn : info.project_type_en}} | </text>
					<text class="font-gray m-l-10">{{$t('Starting from')}}:</text>
					<text class="uni-bold m-l-5" style="width:70px;">{{$t('Starting from') == "起售价" ? price_cn : price_en}}</text>
				</view>
			</view>
			<view class="flex row product-btn">
				<image :src="!isSaved ? '/static/img/heart_black.png' : '/static/img/heart_yellow.png'" class="icon" mode="widthFix" @click="saveProperty"></image>
				<image src="/static/img/arrow_left.png" mode="widthFix" style="width:46upx" class="m-l-10" @click="share"></image>
			</view>
		</view>
		<hr>
		<view class="product-more flex column m-t-10">
			<view class="product-more-info flex row space-between">
				<view class="flex row">
					<!-- <image src="/static/img/mark.png" class="mark"></image> -->
					<view class="ic_mark_small"></view>
					<text class="m-l-10 uni-bold font-size-small">{{info.unit.featured.length}} {{$t('Featured Units')}}</text>
				</view>
				<view class="flex row" @click="clickShowMore">
					<text class="font-gray font-size-small">{{isShowMore ? $t('Collapse') : $t('Show more')}}</text>
					<image :src="isShowMore ? '/static/img/arrow_up.png' : '/static/img/arrow_down.png'" class="arrow m-l-5"></image>
				</view>
			</view>
			<view v-if="isShowMore && info.unit != undefined && info.unit.featured != null" class="more_items">
				<block v-for="(item, idx) in info.unit.featured" :key="idx">
					<view class="flex row align-center m-t-20" @click="gotoUnitDetail(idx)">
						<!-- <image src="/static/img/mark.png" class="mark"></image> -->
						<view class="ic_mark_small"></view>
						<image :src="item.medias.image.url" mode="aspectFill" class="img_plan"></image>
						<view class="flex column">
							<view class="flex row">
								<text class="m-l-20 uni-bold font-size-small">{{item.unit_number}}</text>
								<view class="unit_status_mark font-size-small">{{item.config.sales_status == 2 ? $t('Available unit') : item.config.sales_status == 3 ? $t('Booked') :  $t('Sold out')}}</view>
							</view>

							<text class="m-l-20 font-size-small font-gray">{{item.specs != undefined && item.specs.bed != null && item.specs.bed != undefined ? item.specs.bed + " " + $t('Bed') : ''}} {{item.specs != undefined && item.specs.bath != null && item.specs.bath != undefined ? item.specs.bath + " " + $t('Bath'): ''}} {{item.specs != undefined && item.specs.car != undefined && item.specs.car != null ? item.specs.car + " " + $t('Car') : ""}}</text>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>
<script>
	import apiUrl from '../common/apiUrl.js';
	import common from '../common/common.js';
	import {
		showLoading,
		hideLoading
	} from 'common/loading'

	export default {
		name: 'HouseItemV2',
		props: {
			info: {
				type: Object,
				default: {}
			},
			isSaved: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				isShowMore: false,
				type: '',
				price_en: '',
				price_cn: ''
			}
		},
		onShow: function() {
			console.log("show home")
		},
		mounted() {
			if (this.info != null && this.info.unit_featured != undefined) {
				this.info.units = this.info.unit_featured
			}

			// if(this.info.price_min_k < 1000) {
			// 	this.price_en = this.info.symbol + this.info.price_min_k + "K" 
			// }
			// else {
			// 	this.price_en = this.info.symbol + this.info.price_min_k / 1000 + "M" 
			// }

			this.price_en = this.info.price.symbol + common.currency(this.info.price.price_min)
			this.price_cn = this.info.price.symbol + common.currency(this.info.price.price_min)

			if (uni.getStorageSync("language") === "en") {
				if (this.info.project_type_en != null && this.info.project_type_en != undefined) {
					this.info.project_type_en = this.info.project_type_en
				}
			} else {
				if (this.info.project_type_cn != null && this.info.project_type_cn != undefined) {
					this.info.project_type_cn = this.info.project_type_cn
				}
			}
		},
		methods: {
			clickShowMore() {
				if (this.isShowMore) {
					this.isShowMore = false
				} else {
					this.isShowMore = true
				}
			},
			gotoDetail() {
				uni.navigateTo({
					url: '/pages/house/detail?hash=' + this.info.hash + "&name=" + this.info.project_name_en + "&price=" + (this.$t('Price') ==
						"价格" ? this.price_cn : this.price_en)
				})
			},
			gotoLogin() {
				uni.navigateTo({
					url: "../login/login"
				})
			},
			gotoUnitDetail(index) {
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				} else {
					if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2) {
						uni.navigateTo({
							url: "../error/403"
						})
					} else {
						uni.navigateTo({
							url: "../unit/detail?hash=" + this.info.unit.featured[index].hash
						})
					}
				}
			},
			saveProperty() {
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				} else {
					showLoading()
					uni.request({
						url: apiUrl.saveProperty, //陆枚脦陋脢戮脌媒拢卢虏垄路脟脮忙脢碌陆脫驴脷碌脴脰路隆拢
						method: "POST",
						header: {
							Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
						},
						data: {
							token: uni.getStorageSync("token"),
							status: this.isSaved ? 1 : 0,
							scene: common.scene + "11410",
							value: this.info.hash
						},
						success: (res) => {
							console.log(res.data);
							hideLoading()
							this.isSaved = !this.isSaved
							if (res.data.code == 0) {
								this.$emit("saveClick", {
									isSaved: !this.isSaved,
									hash: this.info.hash
								}, this.info.hash);
							}
						}
					});
				}
			},
			// 分享好友
			share() {
				// 分享图文到微信聊天界面
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				} else {
					var baseStr = "hash=" + this.info.hash + "&user_hash=" + uni.getStorageSync("userInfo").user.hash
					var base64 = btoa(baseStr)
					var base66 = "c" + base64.substring(0, 5) + "t" + base64.substring(5)
					showLoading()

					var title = ""
					var desc = ""

					//不是公司成员
					if (uni.getStorageSync("userInfo").user.company_portal_hash == null || uni.getStorageSync("userInfo").user.company_portal_hash ==
						'') {
						desc = this.info.secondary_description
						if (uni.getStorageSync("language") == 'en') {
							title = this.info.prop_type_en + ": " + this.info.name
						} else {
							title = this.info.prop_type + ": " + this.info.name
						}
					} else { //公司成员
						if (uni.getStorageSync("language") == 'en') {
							title = this.info.prop_type_en + ": " + this.info.name
							desc = "Project shared by Asialand - " + uni.getStorageSync("userInfo").user.name + " " + uni.getStorageSync(
								"userInfo").user.surname
						} else {
							title = this.info.prop_type + ": " + this.info.name
							desc = "由 Asialand - " + uni.getStorageSync("userInfo").user.surname + " " + uni.getStorageSync("userInfo").user
								.name + "为您分享"

						}
					}

					uni.share({
						provider: "weixin", // 服务商
						scene: "WXSceneSession", // 场景 微信好友WXSceneSession  朋友圈WXSceneTimeLine
						type: 0, // 图文0 文字1 图片2
						href: uni.getStorageSync("language") != 'en' ? common.shareUrl + "property/" + base66 : common.shareUrl_en +
							"property/" + base66, // 分享h5地址
						title: title,
						summary: desc, // 描述
						imageUrl: this.info.images[0].thumb_url,
						success: function(res) {
							hideLoading()
							console.log("success:" + JSON.stringify(res));
						},
						fail: function(err) {
							hideLoading()
							console.log("fail:" + JSON.stringify(err));
						}
					});
				}
			}
		},
	}
</script>

<style>
	.product {
		display: flex;
		flex-direction: column;
		background-color: white;
		padding-bottom: 20upx;
	}

	.product-image {
		width: 100%;
		height: 450upx;
	}

	.product-title {
		width: 100%;
		font-size: 32upx;
		font-weight: bold;
		margin: 20upx;
	}

	.product-price {
		font-size: 28upx;
		position: relative;
	}

	.product-price-original {
		color: #E80080;
	}

	.product-price-favour {
		color: #888888;
		text-decoration: line-through;
		margin-left: 10upx;
	}

	.product-tip {
		position: absolute;
		right: 10upx;
		background-color: #FF3333;
		color: #FFFFFF;
		padding: 0 10upx;
		border-radius: 5upx;
	}

	.product-info {
		align-items: center;
		justify-content: space-between;
		padding: 20upx 30upx;
	}

	.product-more {
		padding: 20upx 40upx;
		padding-right: 30upx;
	}

	.product-more-info {
		justify-content: space-between;
		align-items: center;

	}

	.product-more-info>view {
		align-items: center;
	}

	hr {
		margin: 0 20upx;
	}

	.mark {
		width: 12upx;
		height: 20upx;
	}

	.icon {
		width: 44upx;
	}

	.arrow {
		width: 36upx;
		height: 36upx;
	}

	.product-btn {
		margin-top: 5px;
	}

	.img_plan {
		width: 100upx;
		height: 100upx;
		margin-left: 40upx
	}

	.product-info-view {
		width: 500upx
	}

	.unit_status_mark {
		padding-left: 20upx;
		padding-right: 20upx;
		margin-left: 30upx;
		border-radius: 2px;
		background-color: rgba(46, 45, 43, 100);
		color: rgba(217, 192, 119, 100);
		font-size: 14upx;
		text-align: center;
		font-family: Arial;
		height: 18px;
		line-height: 18px;
	}
</style>
