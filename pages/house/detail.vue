<template>
	<view class="content">
		<view class="w-100 ">
			<view class="header flex row space-between m-b-30" :style="showSkeleton ? 'height:120px' : 'height:auto'">
				<view class="left flex column m-l-15" style="width:600upx">
					<text class="font-size-big uni-bold m-t-10 ">{{detailInfo.name == undefined ? '' : detailInfo.name}}</text>
					<text class="font-size-normal  m-b-20 ">{{$t('Starting from')}}: <text class="uni-bold m-l-5">{{price}}</text></text>
					<view class="flex row flex-wrap ">
						<block v-if="isEnglish">
							<block v-if="tags != undefined" v-for="(item,index) in tags" :key="index">
								<view class="header-item flex row align-center m-r-15">
									<image class="icon" src="/static/img/check_yellow.png"></image>
									<view class="text">{{item}}</view>
								</view>
							</block>
						</block>
						<block v-else>
							<block v-if="tags_cn != undefined" v-for="(item,index) in tags_cn" :key="index">
								<view class="header-item flex row align-center m-r-15">
									<image class="icon" src="/static/img/check_yellow.png"></image>
									<view class="text">{{item}}</view>
								</view>
							</block>
						</block>
					</view>
				</view>
				<view class="right flex column m-r-20">
					<view class="flex column m-t-10" style="align-items: center;" @click="saveProperty">
						<image class="icon" mode="widthFix" :src="isSaved ? '/static/img/heart_yellow.png' : '/static/img/heart_empty.png'" />
						<text class="text">{{$t('Save')}}</text>
					</view>
					<!-- 					<view class="flex column m-t-10" style="align-items: center;" @click="share">
						<image style="width:60upx" mode="widthFix" src="/static/img/arrow_left.png" />
						<text class="text">{{$t('Share')}}</text>
					</view> -->
				</view>
			</view>

			<view style="background:white;" class="skeleton">
				<skeleton selector="skeleton" ref="skeleton" bgcolor="transparent" v-if="showSkeleton"></skeleton>

				<view class="w-100 skeleton-rect" style="height: 530upx;">
					<uni-swiper-dot v-if="detailInfo.images != undefined && detailInfo.images.length > 0" class="swiper m-t-0" :info="detailInfo.images"
					 :dots-styles="dotsStyles" :current="current" :mode="mode">
						<swiper class="swiper-box" @change="change">
							<swiper-item class="" v-for="(item, index) in detailInfo.images" :key="index">
								<view class="flex column swiper_item">
									<image class="house_img" mode="aspectFill" :src="item.url + '/format/webp/quality/50'" @click="previewPropertyImage"></image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
					<text v-if="detailInfo.images != undefined && detailInfo.images.length > 0" class="swiper-pos">{{current + 1}}/{{detailInfo.images.length}}</text>
				</view>

				<view class="p-l-15 p-r-15" style="box-sizing: border-box;">
					<view class="summary top_label flex row space-between align-center m-t-30" style="height:80upx">
						<text>{{$t('Project Summary')}}</text>
						<view class=" flex row align-center" v-if="detailInfo.video != '' && detailInfo.video != undefined" @click="playVideo">
							<image class="icon" :src="isPlayVideo ? '/static/img/play_icon.png' : '/static/img/stop_icon.png'" />
							<text class="font-size-small">{{isPlayVideo ? $t('Play Video') : $t('Stop Video')}}</text>
						</view>
					</view>

					<view v-if="!isPlayVideo" class="video m-t-10">
						<video class="w-100" autoplay="true" :src="videoUrl" @error="videoErrorCallback" controls></video>
					</view>

					<view class="flex row m-t-20" v-if='$t("Price") == "价格"'>
						<view v-if="isEnglish" class="flex row align-center translate-btn" @click="changeTranslate(0)">
							<image class="translate-icon m-l-10" src="/static/img/ic_eng_chi.png"></image>
							<text class="font-size-normal m-l-10 m-r-10">{{$t("englishToChinese")}}</text>
						</view>

						<view v-if="!isEnglish" class="flex row align-center translate-btn-active" @click="changeTranslate(1)">
							<image class="translate-icon m-l-10" src="/static/img/ic_eng_chi.png"></image>
							<text class="font-size-normal m-l-10 m-r-10">{{$t("chineseToEnglish")}}</text>
						</view>
					</view>

					<view class="flex column m-t-20 desc skeleton-rect" style="min-height: 330upx;">
						<text class="font-size-normal uni-bold">{{isEnglish ? (detailInfo.secondary_description == undefined ? '' : detailInfo.secondary_description) : secDesCn}}</text>
						<!-- <rich-text class="font-size-normal m-t-10" :nodes="detailInfo.description == undefined ? '' : detailInfo.description"></rich-text> -->
						<text class="font-size-normal m-t-10" :class="!isReadAll ? 'elllipse' : ''">
							{{isEnglish ? (detailInfo.description == undefined ? '' : detailInfo.description) : desCn}}
						</text>
					</view>
					<view class="font-size-normal uni-bold btn-read-more m-t-15 m-b-10" @click="showAllDesc">{{$t("read more")}}</view>
					<view class="top_label flex row m-t-50">
						<view class="column flex flex-start " style="align-items: flex-start !important;">
							<view class="flex row align-center">
								<text class="line-height-1 uni-bold font-size-medium">{{$t('Featured Units')}}</text>
								<text class="line-height-1 font-normal font-size-medium m-l-5">({{unitNum}})</text>
							</view>
							<text class="font-size-small font-normal line-height-1 m-t-5">{{$t('Swipe left and right to view more units')}}</text>
						</view>
					</view>

					<view class="feature m-t-15 m-l-5 flex row align-center space-between skeleton-rect" style="height:320upx;">
						<image mode="widthFix" class="m-l-5 m-r-5" style="width:20px;" src="../../static/img/arrow_cursor_left.png"></image>

						<swiper class="unit_swiper_item unit-swiper m-t-0 " style="height:280upx;" :current="unitPos" @change="unitChange">
							<block v-if="detailInfo.unit_featured != undefined && detailInfo.unit_featured.length > 0">
								<swiper-item v-for="(item,index) in detailInfo.unit_featured" :key="index">
									<view class="flex row  align-center space-between " @click="gotoUnitDetail(index)">
										<view class="w-100 flex column">
											<view class="w-100 flex row align-center">
												<image :src="item.floorplan != null ? item.floorplan + '/format/webp/quality/50' : '/static/img/home_plan.png'"
												 class="plan" />
												<view class="flex column m-l-20">
													<view class="flex column m-b-10">
														<text class="uni-bold font-gray line-one">{{item.unit_number}}</text>
														<view class="bar"></view>
													</view>
													<view class="font-size-normal font-gray">{{$t("Price")}}: <text class="uni-bold">{{" " + item.price_total}}</text></view>
													<view class="flex row ">
														<view class="font-size-normal uni-bold font-gray">{{item.spec_bed}}{{" " + $t("Bed")}}</view>
														<view class="font-size-normal uni-bold font-gray m-l-10">{{item.spec_bath}}{{" " + $t("Bath")}}</view>
														<view class="font-size-normal uni-bold font-gray m-l-10">{{item.spec_car}}{{" " + $t("Car")}}</view>
													</view>
												</view>
											</view>
											<view class="split m-t-15 m-b-15"></view>
											<view class="flex row">
												<view class="font-size-small font-gray">{{$t('Land Size')}} : <text class="uni-bold m-l-5">{{item.size_land}}{{item.size_land == null || item.size_land == undefined || item.size_land == '' ? '' : item.size_unit}}</text></view>
												<view class="font-size-small font-gray m-l-20">{{$t('House Size')}} : <text class="uni-bold m-l-5">{{item.size_house_design}}{{item.size_unit}}</text></view>
											</view>
										</view>

									</view>
								</swiper-item>
							</block>
						</swiper>
						<image mode="widthFix" class="m-l-5 m-r-5" style="width:20px;" src="../../static/img/arrow_cursor_right.png"></image>
					</view>

					<view class="top_label m-t-50 column flex flex-start" style="align-items: flex-start !important;">
						<text>{{$t('Amenities')}}</text>
						<text class="font-size-small font-normal m-t-5">{{$t("Click the map below to view location analysis")}}</text>

					</view>
					<view class="map m-t-15 flex column skeleton-rect" style="height:380upx;" @tap="gotoMap">
						<block v-if="detailInfo.address != undefined">
							<image class="w-100 map_img" :src="'https://image.maps.api.here.com/mia/1.6/mapview?app_id=rLH3gcQKZ8FDUWfBfckJ&app_code=CWWgJNAXJhCrQcLm4rsUWg&lat=' + detailInfo.address.lat + '&lon=' + detailInfo.address.lng + '&vt=0&z=14&w=700&h=400'"></image>
							<image class="map_mark" mode="widthFix" src="/static/img/map_mark.png"></image>
							<cover-view class="cover line-one">{{detailInfo.address.address}}</cover-view>
						</block>
					</view>

					<view class="top_label m-t-50 column flex flex-start" style="align-items: flex-start !important;">
						<text>{{$t('Education')}}</text>
						<text class="font-size-small font-normal m-t-5">{{$t('Swipe left and right to view more details')}}</text>
					</view>
					<view class="education m-l-5 m-t-15 skeleton-rect" style="height:500upx">
						<view class="header flex row" v-if="detailInfo != null && detailInfo.school != null">
							<view class="item " @click="schoolPos=0" v-if="detailInfo.school.Primary != null && detailInfo.school.Primary.length > 0">
								<text :class="schoolPos == 0? 'uni-bold font-gray line-one' : 'font-small font-gray line-one'">{{$t('Primary')}}</text>
								<view v-if="schoolPos ==0" class="bar"></view>
							</view>
							<view class="item m-l-20" @click="schoolPos=1" v-if="detailInfo.school.Secondary != null && detailInfo.school.Secondary.length > 0">
								<text :class="schoolPos == 1? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Secondary')}}</text>
								<view v-if="schoolPos ==1" class="bar"></view>
							</view>
							<view class="item m-l-20" @click="schoolPos=2" v-if="detailInfo.school.Combined != null && detailInfo.school.Combined.length > 0">
								<text :class="schoolPos == 2? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Combined')}}</text>
								<view v-if="schoolPos == 2" class="bar"></view>
							</view>
							<view class="item m-l-20" @click="schoolPos=3" v-if="detailInfo.school.Special != null && detailInfo.school.Special.length > 0">
								<text :class="schoolPos == 3? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Special')}}</text>
								<view v-if="schoolPos == 3" class="bar"></view>
							</view>
						</view>
						<swiper v-if="detailInfo.school != undefined" class="school-swiper m-t-0" :current="schoolPos" @change="schoolChange">
							<swiper-item>
								<scroll-view scroll-y="true" v-if="detailInfo.school.Primary != undefined" :style="detailInfo.school.Primary.length > 5 ? 'height:450upx' : 'height:' + detailInfo.school.Primary.length * 100 + 'upx'">
									<block v-for="(item,index) in detailInfo.school.Primary" :key="index">
										<view class="flex row swiper_item align-center space-between m-t-10">
											<view class="flex row align-center">
												<view class="ic_mark_small"></view>
												<view class="flex column m-l-10" style="width:530upx;">
													<text class="font-size-normal uni-bold font-gray line-one">{{item.name}}</text>
													<text class="font-size-small font-gray" style="line-height: 1;">{{item.year}}/{{item.sector}}</text>
												</view>
											</view>
											<text class="font-size-small font-gray">{{(item.distance / 1000).toFixed(2)}}km</text>
										</view>
									</block>
								</scroll-view>
							</swiper-item>
							<swiper-item>
								<scroll-view scroll-y="true" v-if="detailInfo.school.Secondary != undefined" :style="detailInfo.school.Secondary.length > 5 ? 'height:450upx' : 'height:' + detailInfo.school.Secondary.length * 100 + 'upx'">
									<block v-for="(item,index) in detailInfo.school.Secondary" :key="index">
										<view class="flex row swiper_item align-center space-between m-t-10">
											<view class="flex row align-center">
												<view class="ic_mark_small"></view>
												<view class="flex column m-l-10" style="width:530upx;">
													<text class="font-size-normal uni-bold font-gray">{{item.name}}</text>
													<text class="font-size-small font-gray" style="line-height: 1;">{{item.year}}/{{item.sector}}</text>
												</view>
											</view>
											<text class="font-size-small font-gray">{{(item.distance / 1000).toFixed(2)}}km</text>
										</view>
									</block>
								</scroll-view>
							</swiper-item>
							<swiper-item>
								<scroll-view scroll-y="true" v-if="detailInfo.school.Combined != undefined" :style="detailInfo.school.Combined.length > 5 ? 'height:450upx' : 'height:' + detailInfo.school.Combined.length * 100 + 'upx'">
									<block v-for="(item,index) in detailInfo.school.Combined" :key="index">
										<view class="flex row swiper_item align-center space-betwesen m-t-10">
											<view class="flex row align-center">
												<view class="ic_mark_small"></view>
												<view class="flex column m-l-10" style="width:530upx;">
													<text class="font-size-normal uni-bold font-gray">{{item.name}}</text>
													<text class="font-size-small font-gray" style="line-height: 1;">{{item.year}}/{{item.sector}}</text>
												</view>
											</view>
											<text class="font-size-small font-gray">{{(item.distance / 1000).toFixed(2)}}km</text>
										</view>
									</block>
								</scroll-view>
							</swiper-item>
							<swiper-item>
								<scroll-view scroll-y="true" v-if="detailInfo.school.Special != undefined" :style="detailInfo.school.Special.length > 5 ? 'height:450upx' : 'height:' + detailInfo.school.Special.length * 100 + 'upx'">
									<block v-for="(item,index) in detailInfo.school.Special" :key="index">
										<view class="flex row swiper_item align-center space-betwesen m-t-10">
											<view class="flex row align-center">
												<view class="ic_mark_small"></view>
												<view class="flex column m-l-10" style="width:530upx;">
													<text class="font-size-normal uni-bold font-gray">{{item.name}}</text>
													<text class="font-size-small font-gray" style="line-height: 1;">{{item.year}}/{{item.sector}}</text>
												</view>
											</view>
											<text class="font-size-small font-gray">{{(item.distance / 1000).toFixed(2)}}km</text>
										</view>
									</block>
								</scroll-view>
							</swiper-item>
						</swiper>
					</view>

					<view class="m-t-20 m-l-5">
						<view class="top_label flex row m-t-50">
							<view class="column flex flex-start" style="align-items: flex-start !important;">
								<text class="uni-bold font-size-medium">{{$t('Investment Analysis')}}</text>
							</view>
						</view>

						<view class="font-size-normal font-xGray m-t-10">{{$t("Our premium investment analysis provides you with insights that uncover best investment opportunities. ")}}</view>
						<view class="flex row align-center m-t-10">
							<view class="ic_mark_small"></view>
							<view class="flex row m-l-10">
								<text class="font-size-normal uni-bold font-gray">{{$t('Best valued')}}</text>
								<text class="font-size-normal font-gray m-l-10">{{$t('available units')}}</text>
							</view>
						</view>
						<view class="flex row align-center m-t-10">
							<view class="ic_mark_small"></view>
							<view class="flex row m-l-10">
								<text class="font-size-normal uni-bold font-gray">{{$t('National')}}</text>
								<text class="font-size-normal font-gray m-l-10">{{$t('Housing Market Growth')}}</text>
							</view>
						</view>
						<view class="flex row align-center m-t-10">
							<view class="ic_mark_small"></view>
							<view class="m-l-10">
								<text class="font-size-normal uni-bold font-gray left m-r-10 ">{{suburb}} </text>
								<text class="font-size-normal font-gray line-one">{{$t('demographic, housing growth rate')}}</text>
							</view>
						</view>
						<view class="flex row align-center m-t-10">
							<view class="ic_mark_small"></view>
							<view class="m-l-10">
								<text class="font-size-normal uni-bold font-gray left m-r-10 ">{{suburb}} </text>
								<text class="font-size-normal font-gray line-one">{{$t('rental estimation')}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="btn-row m-b-30">
					<button class="login-btn" @tap="gotoAnalysis">{{$t('Redirect to Premium Anaysis')}}</button>
				</view>
			</view>
			<view class="share_view">
				<view class="share_btn m-l-20" style="margin-top:-10px;" @click="share">
					<image mode="widthFix" style="width:30px" src="../../static/img/arrow_left_white.png"></image>
				</view>
			</view>

			<view class="agent-footer" v-if="isLogined">
				<view class="agent flex row space-between ">
					<view class="flex column m-l-20" style="margin-top:-10px;" @click="gotoAgent">
						<text class="font-size-medium uni-bold" style="line-height: 1.5;">{{$t("Agent's Package" )}}</text>
						<text class="font-size-xsmall" style="line-height: 1;">{{$t("Access Project Files" )}}</text>
					</view>
					<view class="flex column m-r-20 m-t-10 flex-end text-right" @click="gotoUnit">
						<text class="font-size-xsmall text-right" style="line-height: 1;">{{$t("Start make reservation")}}</text>
						<text class="font-size-medium uni-bold text-right" style="line-height: 1.5;">{{$t("Available Units" )}}</text>
					</view>
				</view>
			</view>
			<view class="footer" style="display: none;">
				<view class="flex row">
					<image src="/static/img/home1.png" class="head_icon m-l-20" />
					<view class="flex column m-l-10">
						<text class="font-size-normal uni-bold font-gray">Johnson Whitebud </text>
						<text class="font-size-small font-gray m-t-5 text-left" style="line-height: 1;">Asialand - 项目助理</text>
					</view>
				</view>
				<view class="flex row m-r-20">
					<image src="/static/img/dial_icon.png" class="dial" @click="dial"></image>
					<image src="/static/img/email_icon.png" class="dial"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import skeleton from '../../components/skeleton'

	import apiUrl from "../../common/apiUrl.js"
	import common from "../../common/common.js"
	import {
		showLoading,
		hideLoading
	} from 'common/loading'

	export default {
		components: {
			skeleton
		},
		data() {
			return {
				tags: [],
				tags_cn: [],
				desCn: '',
				secDesCn: '',
				desEn: '',
				secDesEn: '',
				isReadAll: false,
				isEnglish: true,
				isLogined: false,
				showSkeleton: true,
				hash: '',
				mode: 'default',
				schoolPos: 0,
				unitPos: 0,
				latitude: 39.909,
				longitude: 116.39742,
				scale: 7,
				current: 0,
				suburb: '',
				isPlayVideo: true,
				detailInfo: {},
				phone: "18712608080",
				name: "",
				price: '',
				videoUrl: "",
				kind: ['Balywn High School District', 'Shopping Centre', 'Close to ALL amenities'],
				dotsStyles: {
					border: '1px rgba(83, 200, 249,0.3) solid',
					color: '#000',
					bottom: 20
				},
				isSaved: false,
				unitNum: ''
			}
		},
		onReady() {

			this.showSkeleton = true;
		},
		onShow() {
			uni.setNavigationBarTitle({ // 修改头部标题
				title: this.$t("Project Details")
			});
		},
		onLoad(option) {
			this.hash = option.hash
			if (option.name) {
				this.detailInfo.name = option.name
			}

			if (option.price) {
				this.price = option.price
			}

			this.isLogined = uni.getStorageSync("isLogin")
			//this.hash = "HCPP-DGUygntgGK"
			this.getDetail()
			if (this.isLogined) {
				this.getSaveList()
			}

			this.getTranslate('zh')
		},
		methods: {

			change(e) {
				this.current = e.detail.current;
			},
			schoolChange(e) {
				this.schoolPos = e.detail.current
			},
			unitChange(e) {
				this.unitPos = e.detail.current
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
						if (res.data.code == 0 && res.data.data.collects.length > 0) {
							for (var i = 0; i < res.data.data.collects.length; i++) {
								if (res.data.data.collects[i].hash == that.hash) {
									that.isSaved = true
									break;
								}
							}
						}
					}
				});
			},
			gotoLogin() {
				uni.navigateTo({
					url: "../login/login"
				})
			},
			saveProperty() {
				if (uni.getStorageSync("userInfo") == undefined || uni.getStorageSync("userInfo") == "" || uni.getStorageSync(
						"userInfo") == null) {
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
							value: this.hash
						},
						success: (res) => {
							console.log(res.data);
							hideLoading()
							if (res.data.code == 0) {
								this.isSaved = !this.isSaved
							}
						}
					});
				}
			},
			getTranslate(lang) {
				var that = this
				// showLoading(this.$t("Loading"))
				uni.request({
					url: apiUrl.getTranslate, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: this.hash,
						lang: lang
					},
					success: (res) => {
						// hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							if (res.data.data != null) {
								if (lang == "zh") {
									that.desCn = res.data.data.description_cn
									this.secDesCn = res.data.data.secondary_description_cn
								} else {
									that.desEn = res.data.data.description_en
									this.secDesEn = res.data.data.secondary_description_en
								}

								if (uni.getStorageSync("language") != "en") {
									if (res.data.data.tags_cn != null && res.data.data.tags_cn != '') {
										that.tags_cn = res.data.data.tags_cn[0].split("、")
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
			getDetail() {
				var that = this
				// showLoading(this.$t("Loading"))
				uni.request({
					url: apiUrl.getPropertyDetail, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: this.hash
					},
					success: (res) => {
						// hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							if (res.data.data != null) {
								this.detailInfo = res.data.data
								this.tags = this.detailInfo.tags

								if (uni.getStorageSync("language") == "en") {
									this.unitNum = "Total " + this.detailInfo.unit_num + " units"
									this.suburb = this.detailInfo.suburb_en
									if (this.detailInfo.unit_featured.length > 0) {
										for (var i = 0; i < this.detailInfo.unit_featured.length; i++) {
											this.detailInfo.unit_featured[i].price_total = this.detailInfo.symbol + common.currency(this.detailInfo.unit_featured[
												i].price_total)
										}
									}

								} else {
									this.unitNum = "共计 " + this.detailInfo.unit_num + " 户型"
									this.suburb = this.detailInfo.suburb
									if (this.detailInfo.unit_featured.length > 0) {
										for (var i = 0; i < this.detailInfo.unit_featured.length; i++) {
											// this.detailInfo.unit_featured[i].price_total = (this.detailInfo.unit_featured[i].price_total / 10000).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + this.$t("Million") 
											this.detailInfo.unit_featured[i].price_total = this.detailInfo.symbol + common.currency(this.detailInfo.unit_featured[
												i].price_total)
										}
									}
								}

								this.price = this.detailInfo.symbol + common.currency(this.detailInfo.price_min_k + "000")
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

						setTimeout(() => {
							that.showSkeleton = false
						}, 200)
					}
				});
			},
			gotoAnalysis() {
				uni.navigateTo({
					url: "/pages/house/analysis?hash=" + this.hash + "&name=" + this.detailInfo.name
				})
				// uni.navigateTo({
				// 	url:"/pages/house/test"
				// })
			},
			gotoMap() {
				uni.navigateTo({
					url: "/pages/map/map?hash=" + this.hash + "&lat=" + this.detailInfo.address.lat + "&lng=" + this.detailInfo.address
						.lng + "&nearby=" + this.detailInfo.nearby
				})
			},
			gotoAgent() {
				uni.navigateTo({
					url: "/pages/agent/index?hash=" + this.hash
				})
			},
			gotoUnit() {
				uni.navigateTo({
					url: "/pages/unit/index?hash=" + this.hash + "&name=" + this.detailInfo.name
				})
			},
			gotoUnitDetail(index) {
				uni.navigateTo({
					url: "/pages/unit/detail?hash=" + this.detailInfo.unit_featured[index].hash
				})
			},
			dial() {
				var userInfo = uni.getStorageSync('userInfo')
				uni.makePhoneCall({
					phoneNumber: userInfo.user.mobile,
					success: (res) => {
						console.log('调用成功!')
					},
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			videoErrorCallback: function(e) {
				console.log(e)
			},
			playVideo() {
				this.isPlayVideo = !this.isPlayVideo
				this.videoUrl = this.detailInfo.video
			},
			previewPropertyImage() {
				let imgsArray = []
				for (var i = 0; i < this.detailInfo.images.length; i++) {
					imgsArray.push(this.detailInfo.images[i].url)
				}

				uni.previewImage({
					urls: imgsArray
				});
			},
			// 分享好友
			share() {
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				} else {
					// 分享图文到微信聊天界面
					var baseStr = "hash=" + this.detailInfo.hash + "&user_hash=" + uni.getStorageSync("userInfo").user.hash
					var base64 = btoa(baseStr)
					var base66 = "c" + base64.substring(0, 5) + "t" + base64.substring(5)

					var title = ""
					var desc = ""

					//不是公司成员
					if (uni.getStorageSync("userInfo").user.company_portal_hash == null || uni.getStorageSync("userInfo").user.company_portal_hash ==
						'') {
						desc = this.detailInfo.secondary_description
						if (uni.getStorageSync("language") == 'en') {
							title = this.detailInfo.proptype_en + ": " + this.detailInfo.name
						} else {
							title = this.detailInfo.proptype + ": " + this.detailInfo.name
						}
					} else { //公司成员
						if (uni.getStorageSync("language") == 'en') {
							title = this.detailInfo.proptype_en + ": " + this.detailInfo.name
							desc = "Project shared by Asialand - " + uni.getStorageSync("userInfo").user.name + " " + uni.getStorageSync(
								"userInfo").user.surname
						} else {
							title = this.detailInfo.proptype + ": " + this.detailInfo.name
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
						imageUrl: this.detailInfo.images[0].thumb_url,
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
			changeTranslate(index) {
				if (index == 0) {
					this.isEnglish = false;
				} else {
					this.isEnglish = true;
				}
			},
			showAllDesc() {
				this.isReadAll = !this.isReadAll
			}
		}
	}
</script>

<style scoped>
	.content {
		background-color: #f8f8f8;
		padding: 0px;
		width: 100%;
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

	.right .icon {
		width: 48upx;
	}

	.right .text {
		color: rgba(153, 153, 153, 100);
		font-size: 20upx;
	}

	.swiper,
	.swiper-box {
		height: 500upx;
	}

	.school-swiper {
		height: 450upx;
	}

	.unit-swiper {
		height: 200upx;
	}

	.house_img {
		width: 100%;
		height: 500upx;
	}

	.swiper-pos {
		position: absolute;
		right: 20px;
		z-index: 100000;
		margin-top: -35px;
		color: #000;
		font-weight: bold;
	}

	.uni-swiper__dots-nav {
		justify-content: flex-end !important;
		background-color: transparent !important;
		color: #000000 !important;
	}

	.uni-swiper__dots-box {
		margin-bottom: 60upx;
		justify-content: flex-start !important;
		margin-left: 20px;
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
		align-items: center;
		display: flex;
	}

	.agent-footer {
		position: fixed;
		bottom: 0px;
		height: 170upx;
		display: flex;
		align-items: center;
		background-color: white;
		justify-content: center;
		width: 100%;
		z-index: 100000;
	}

	.share_view {
		position: fixed;
		bottom: 200upx;
		height: 100upx;
		display: flex;
		align-items: center;
		background-color: transparent;
		justify-content: flex-end;
		width: 100%;
		z-index: 100000;
	}

	.agent {
		background-image: url(/static/img/back.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		height: 130upx;
		align-items: center;
		width: 680upx;
		box-sizing: border-box;
	}

	.summary .text {
		font-size: 32upx;
		font-weight: bold;
	}

	.summary .icon {
		margin-right: 10upx;
		width: 20px;
		height: 20px;
	}

	.desc {
		margin-left: 5px;
	}

	.map {
		width: 100%;
		height: 380upx;
	}

	.cover {
		margin-top: -70upx;
		background: rgba(0, 0, 0, 0.3);
		;
		height: 70upx;
		line-height: 70upx;
		width: 100%;
		text-align: left;
		display: flex;
		align-items: center;
		color: white;
		font-weight: bold;
		z-index: 100;
		padding: 0px 10px;
		box-sizing: border-box;
	}

	.mark {
		width: 12upx;
		height: 20upx;
	}

	.bar {
		width: 50upx;
		height: 6upx;
		background-color: rgba(217, 192, 119, 100);
		text-align: center;
		border-radius: 2upx;
	}

	.plan {
		width: 150upx;
		height: 150upx;
	}

	.login-btn {
		text-align: left;
		height: 100upx;
		line-height: 100upx;
		border-radius: 10upx;
		background-color: rgba(0, 0, 0, 1);
		color: white;
		font-size: 32upx;
		font-weight: bold;
		font-family: Arial;
		border: 0px;
		margin-left: 20upx;
		border: 2px solid rgba(217, 192, 119, 100);
		display: inline-block;
		margin-bottom: 160upx;
	}

	.footer {
		width: 100%;
		height: 140upx;
		line-height: 40upx;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
		background: white;
		z-index: 101;
	}

	.dial {
		width: 76upx;
		height: 72upx;
		margin-left: 20upx;
	}

	.head_icon {
		width: 96upx;
		height: 96upx;
		border-radius: 96upx;
	}

	.label_mark {
		width: 16upx;
		height: 60upx;
	}

	.map_img {
		height: 380upx;
	}

	.map_mark {
		width: 64upx;
		height: 68upx;
		position: absolute;
		align-self: center;
		margin-top: 160upx;
		z-index: 10000;
	}

	.translate-btn {
		height: 60upx;
		line-height: 60upx;
		border-radius: 10upx;
		background-color: white;
		text-align: center;
		border: 1px solid #D9C077;
	}

	.translate-btn-active {
		height: 60upx;
		line-height: 60upx;
		border-radius: 10upx;
		background-color: #D9C077;
		text-align: center;
		border: 1px solid #D9C077;

	}

	.translate-icon {
		width: 36upx;
		height: 36upx;
	}


	.btn-read-more {
		color: #D9C077;
	}

	.elllipse {
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 6;
	}

	.feature {
		border: 1px solid #D9C077;
	}

	.unit_swiper_item {
		padding: 40upx 0upx;
		width: 620upx;
	}

	.split {
		width: 100%;
		height: 2upx;
		background-color: #aaa;
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
