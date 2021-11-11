<template>
	<view class="content w-100">
		<view class="header flex column">
			<text class="font-size-big m-l-15 uni-bold">
				{{detailInfo.unit_number}}
			</text>
			<text class="font-size-normal m-l-15 m-b-20">
				{{$t('Total Price')}}: <text class="uni-bold m-l-5">{{detailInfo.price_total}}</text>
			</text>
			<view class="flex row m-l-15 m-b-20">
				<view class="desc_view font-size-normal">
					<text>{{detailInfo.spec_bed}} {{" " + $t('Bed')}}</text>
				</view>
				<view class="desc_view font-size-normal">
					<text>{{detailInfo.spec_bath}} {{" " + $t('Bath')}}</text>
				</view>
				<view class="desc_view font-size-normal">
					<text>{{detailInfo.spec_car}} {{" " + $t('Car')}}</text>
				</view>
			</view>
		</view>
		<view class="data p-l-15 p-r-15">
			<!-- <uni-swiper-dot class="swiper m-t-0" :info="unitArray" :dots-styles="dotsStyles" :current="current" :mode="mode">
				<swiper class="swiper-box" @change="change">
					<swiper-item class="" v-for="(item, index) in unitArray" :key="index">
						<view class="flex column swiper_item align-center">
							<image class="house_img" :src="item.imgUrl"></image>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot> -->

			<view class="flex column swiper_item align-center">
				<image class="house_img" :src="detailInfo.floorplan + '/format/webp/quality/50'" @click="preview" mode="widthFix"></image>
			</view>

			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Specsheet')}}</text>
			</view>
			<view class="flex column m-t-20">
				<text class="font-size-normal item back-gray">{{$t('Configuration')}}: <text class="uni-bold m-l-10">{{detailInfo.spec_bed}}{{" " + $t('Bed')}}						{{detailInfo.spec_bath}}{{" " + $t('Bath')}} {{detailInfo.spec_car}}{{" " + $t('Car')}}</text></text>
				<block v-if="detailInfo.prop_type == 1">				
					<text class="font-size-normal item ">{{$t('Internal Size')}}: <text class="uni-bold m-l-10">{{detailInfo.size_interior}}{{detailInfo.size_interior == null || detailInfo.size_interior == undefined || detailInfo.size_interior == '' ? '' : detailInfo.size_unit}}</text></text>
					<text class="font-size-normal item back-gray">{{$t('External Size')}}: <text class="uni-bold  m-l-10">{{detailInfo.size_exterior}}{{detailInfo.size_exterior == null || detailInfo.size_exterior == undefined || detailInfo.size_exterior == '' ? '' : detailInfo.size_unit}}</text></text>
				</block>
				<block v-if="detailInfo.prop_type == 2">				
					<text class="font-size-normal item">{{$t('Land Size')}}: <text class="uni-bold  m-l-10">{{detailInfo.size_land}}{{detailInfo.size_land == null || detailInfo.size_land == undefined || detailInfo.size_land == '' ? '' : detailInfo.size_unit}}</text></text>
					<text class="font-size-normal item back-gray">{{$t('House Size')}}: <text class="uni-bold m-l-10">{{detailInfo.size_house_design}}{{detailInfo.size_unit}}</text></text>
				</block>
				<block v-if="detailInfo.prop_type == 3">
					<text class="font-size-normal item">{{$t('Land Size')}}: <text class="uni-bold  m-l-10">{{detailInfo.size_land}}{{detailInfo.size_land == null || detailInfo.size_land == undefined || detailInfo.size_land == '' ? '' : detailInfo.size_unit}}</text></text>
					<text class="font-size-normal item back-gray">{{$t('House Size')}}: <text class="uni-bold m-l-10">{{detailInfo.size_house_design}}{{detailInfo.size_unit}}</text></text>
				</block>

				<!-- 				<text class="font-size-normal item">{{$t('House Level')}}: <text class="uni-bold m-l-10">{{detailInfo.level_house}}</text></text>
 -->
				<text class="font-size-normal item" style="word-wrap: break-word;">{{$t('Notes')}}: <text class="uni-bold m-l-10">{{detailInfo.notes}}</text></text>
			</view>

			<view class="m-t-30" style="margin-bottom:200upx;">
				<view v-for="(item,index) in attachList" class="file_item" :key="index">
					<view class="left flex row">
						<view class="icon">
							<image src="/static/img/far fa-file-alt.png" mode="widthFix" style="width:32upx;"></image>
						</view>
						<view class="m-l-10">
							<view class="font-size-small font-xGray line-height-5 line-one">{{item.type}}</view>
							<view class="font-size-normal uni-bold  line-height-5 line-one">{{item.name}}</view>
						</view>
					</view>
					<view class="btn_group m-l-10" style="float:right">
						<button class="btn" @click="download(item.downloadUrl)">{{$t('Download')}}</button>
						<button class="btn m-l-10" @click="copy(item.downloadUrl)">{{$t('Copy')}}</button>
					</view>
				</view>
			</view>
		</view>
		<view class="share_view">
			<view class="share_btn m-l-20" style="margin-top:-10px;" @click="share">
				<image mode="widthFix" style="width:30px" src="../../static/img/arrow_left_white.png"></image>
			</view>
		</view>
		<view class="footer" @click="gotoReserve">
			{{$t('Reserve this unit')}}
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
				name: "",
				bath: 2.5,
				bed: 2,
				car: 1,
				price: "",
				address: '',
				landSize: 256,
				houseSize: 156,
				level: "",
				note: '',
				current: 0,
				mode: 'default',
				detailInfo: {},
				dotsStyles: {
					border: '1px rgba(83, 200, 249,0.3) solid',
					color: '#000',
					bottom: 0
				},
				unitArray: [],
				attachList: [],
				propertyInfo: {}
			}
		},
		onLoad(option) {
			this.hash = option.hash
			// this.hash = "HCPU-OZ8Icty8dc"
			this.getDetail()
		},
		onShow() {
			uni.setNavigationBarTitle({ // 修改头部标题
				title: this.$t("Unit Details")
			});
		},
		methods: {
			preview() {
				let imgsArray = []
				imgsArray.push(this.detailInfo.floorplan)
				uni.previewImage({
					urls: imgsArray
				});
			},
			change(e) {
				this.current = e.detail.current;
			},
			gotoReserve() {
				if (uni.getStorageSync("userInfo") == undefined || uni.getStorageSync("userInfo") == null || uni.getStorageSync(
						"userInfo") == "") {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				} else {
					var userInfo = uni.getStorageSync("userInfo")
					if (userInfo.webportal == null || userInfo.webportal == undefined) {
						uni.navigateTo({
							url: "/pages/login/login"
						})
					} else {
						if (userInfo.webportal.confirmed_status == 2 && userInfo.webportal.protal_type != "company" && userInfo.webportal
							.portal_user_type != 1) {
							uni.navigateTo({
								url: "/pages/unit/reserve?hash=" + this.hash
							})
						} else {
							if (userInfo.webportal.confirmed_status == 1) {
								uni.showToast({
									icon: 'none',
									title: this.$t("If you want reserve unit, please verify your account first"),
									duration: 5000
								})
							} else if (userInfo.webportal.portal_user_type == 1 || userInfo.webportal.protal_type == "company") {
								uni.showToast({
									icon: 'none',
									title: this.$t("You can't reserve unit"),
									duration: 5000
								})
							}
						}
					}

				}
			},
			getDetail() {
				var that = this
				showLoading(this.$t('Loading'))
				uni.request({
					url: apiUrl.getUnitDetail, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: this.hash
					},
					success: (res) => {

						console.log(res.data);
						that.detailInfo = res.data.data
						if (uni.getStorageSync("language") === "en") {
							this.detailInfo.price_total = '$' + (this.detailInfo.price_total.toFixed(2) + "").replace(/\d(?=(\d{3})+\.)/g,
								'$&,');
							this.detailInfo.price_total = this.detailInfo.price_total.substring(0, this.detailInfo.price_total.indexOf(
								"."))

							// this.detailInfo.price_total = "$" + (this.detailInfo.price_total / 1000).toFixed(2) + "K" 
						} else {
							this.detailInfo.price_total = (this.detailInfo.price_total / 10000).toFixed(2) + that.$t("Million")
						}
						that.getPropertyDetail(res.data.data.property_hash)
					}
				});
			},
			copy(url) {
				uni.setClipboardData({
					data: url, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							icon: 'none',
							title: this.$t('Copy Success')
						})
					}
				});
			},
			download(url) {
				showLoading(this.$t('Loading'))
				uni.downloadFile({
					url: url, //文件链接
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
						}
						var filePath = res.tempFilePath;
						console.log(filePath)
						// //保存到本地
						uni.saveFile({
							tempFilePath: filePath,
							success: (res) => {
								//保存成功并打开文件
								hideLoading()
								console.log(res.savedFilePath)
								console.log('保存成功');
								uni.openDocument({
									filePath: res.savedFilePath,
									success: (res) => console.log('成功打开文档')
								})
							},
							fail: () => {
								hideLoading()
								console.log('保存失败')
							}
						})
					}
				})
			},
			getPropertyDetail(hash) {
				var that = this
				uni.request({
					url: apiUrl.getPropertyDetail, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: hash
					},
					success: (res) => {
						// hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							if (res.data.data != null) {
								this.propertyInfo = res.data.data
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

						hideLoading();
					}
				});
			},
			gotoLogin() {
				uni.navigateTo({
					url: "../login/login"
				})
			},
			// 分享好友
			share() {
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				} else {
					// 分享图文到微信聊天界面
					var baseStr = "hash=" + this.detailInfo.property_hash + "&user_hash=" + uni.getStorageSync("userInfo").user.hash +
						"&timestamp=" + Date.now() + "&unit=" + this.detailInfo.hash
					var base64 = btoa(baseStr)
					var base66 = "c" + base64.substring(0, 5) + "t" + base64.substring(5)

					var title = ""
					var desc = ""

					//不是公司成员
					if (uni.getStorageSync("userInfo").user.company_portal_hash == null || uni.getStorageSync("userInfo").user.company_portal_hash ==
						'') {
						desc = this.propertyInfo.secondary_description
						if (uni.getStorageSync("language") == 'en') {
							title = this.propertyInfo.name + " - " + this.detailInfo.unit_number
						} else {
							title = this.propertyInfo.name + " - " + "户型推荐: " + this.detailInfo.unit_number
						}
					} else { //公司成员
						if (uni.getStorageSync("language") == 'en') {
							title = this.propertyInfo.name + " - " + this.detailInfo.unit_number
							desc = "Project shared by Asialand - " + uni.getStorageSync("userInfo").user.name + " " + uni.getStorageSync(
								"userInfo").user.surname
						} else {
							title = this.propertyInfo.name + " - " + "户型推荐: " + this.detailInfo.unit_number
							desc = "由 Asialand - " + uni.getStorageSync("userInfo").user.surname + " " + uni.getStorageSync("userInfo").user
								.name + "为您分享"

						}
					}

					showLoading()

					uni.share({
						provider: "weixin", // 服务商
						scene: "WXSceneSession", // 场景 微信好友WXSceneSession  朋友圈WXSceneTimeLine
						type: 0, // 图文0 文字1 图片2
						href: uni.getStorageSync("language") != 'en' ? common.shareUrl + "property/" + base66 : common.shareUrl_en +
							"property/" + base66, // 分享h5地址
						title: title,
						summary: desc, // 描述
						imageUrl: this.propertyInfo.images[0].thumb_url,
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
			},
		},
	}
</script>

<style scoped lang="scss">
	.content {
		padding: 0px;
		background: white;
	}

	.header {
		background-color: #f8f8f8;
		width: 100%;
	}

	.desc_view {
		background-color: white;
		border: 2upx solid #d9c077;
		height: 60upx;
		line-height: 60upx;
		justify-content: space-between;
		padding: 0px 20upx;
		margin-right: 20upx;
	}

	.data {
		background-color: white;
	}

	.uni-swiper__dots-nav {
		justify-content: flex-end !important;
		background-color: transparent !important;
		color: #000000 !important;
	}

	.swiper {
		.uni-swiper__dots-box {
			justify-content: flex-start !important;
			margin-left: 20px;
			display: block !important;
			align-items: flex-start !important;
		}
	}

	.house_img {
		width: 100%;
		padding-top: 40upx;
		padding-bottom: 40upx;
	}

	.swiper,
	.swiper-box {
		height: 480upx;
	}

	.mark {
		width: 16upx;
		height: 60upx;
	}

	.back-gray {
		background-color: #f8f8f8;
	}

	.item {
		line-height: 80upx;
		padding-left: 30upx;
	}

	.file_item {
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
		margin-top: 20upx;
		justify-content: space-between;
	}

	.btn_group {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		float: right;
	}

	.left {
		float: left;
	}

	.btn {
		height: 48upx;
		line-height: 48upx;
		border-radius: 10upx;
		background-color: rgba(217, 192, 119, 100) !important;
		color: rgba(16, 16, 16, 100) !important;
		box-shadow: 0px 0px 0px 0px;
		font-size: 20upx;
		text-align: center;
		font-weight: normal;
	}

	.icon {
		width: 72upx;
		height: 72upx;
		background-color: rgba(0, 0, 0, 1);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		font-size: 36upx;
		text-align: center;
		line-height: 100upx;
		background-color: black;
		color: #D9C077;
		font-weight: bold;
	}

	.share_view {
		position: fixed;
		bottom: 100upx;
		height: 150upx;
		display: flex;
		align-items: center;
		background-color: transparent;
		justify-content: flex-end;
		width: 100%;
		z-index: 100000;
	}

	.share_btn {
		border: 1px solid #d9c077;
		height: 40px;
		width: 40px;
		border-radius: 50px;
		box-shadow: 0px 3px 10px #d9c077;
		justify-content: center;
		align-items: center;
		display: flex;
		margin-right: 30upx;
		background-color: #d9c077;
	}
</style>
