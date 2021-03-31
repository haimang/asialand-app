<template>
	<view class="content w-100 skeleton">
		<skeleton selector="skeleton" bgcolor="transparent" v-if="showSkeleton"></skeleton>
		<uni-swiper-dot v-if="promotions.length > 0" class="promo_swiper m-t-0" :info="promotions" :dots-styles="dotsStyles" :current="current" :mode="mode">
			<swiper class="promo_swiper-box" @change="change">
				<swiper-item class="" v-for="(item, index) in promotions" :key="index">
					<view class="flex column promo_swiper_item">
						<view class="font-size-big uni-bold">{{item.title}}</view>
						<view class="des font-size-normal ">{{item.des}}</view>
					</view>					
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<block v-if="detailInfo != undefined">
			<view class="header flex row space-between m-b-30 m-t-20">
				<view class="left flex column m-l-20" style="width:600upx">
					<text class="font-size-big uni-bold m-t-10 ">{{detailInfo.name == undefined ? '' : detailInfo.name}}</text>
					<text class="font-size-normal  m-b-20 " >{{$t('Starting from')}}: <text class="uni-bold m-l-5">{{detailInfo.price}}</text></text>
					<view class="flex row flex-wrap " >
						<block v-if="detailInfo.tags != undefined" v-for="(item,index) in detailInfo.tags" :key="index">
							<view class="header-item flex row align-center m-r-10">
								<image class="icon" src="/static/img/check_yellow.png" ></image>
								<view class="text">{{item}}</view>
							</view>
						</block>
					</view>
				</view>
				<view class="right flex column m-r-20">
					<view class="flex column m-t-10" style="align-items: center;" @click="saveProperty">
						<image class="icon" mode="widthFix" :src="heartSrc"/> 
						<!-- detailInfo.isSaved ? '/static/img/heart_yellow.png' : '/static/img/heart_empty.png'"/> -->
						<text class="text" >{{$t('Save')}}</text>
					</view>
					<view class="flex column m-t-20" style="align-items: center;"  @click="share">
						<image style="width:60upx" mode="widthFix"  src="/static/img/arrow_left.png"/>
						<text class="text">{{$t('Share')}}</text>
					</view>
				</view>
			</view>
			
			<view style="background:white;">
				<view class="w-100 skeleton-rect" style="height: 530upx;" >
					<uni-swiper-dot v-if="detailInfo.images != undefined && detailInfo.images.length > 0" class="img_swiper m-t-0" :info="detailInfo.images" :dots-styles="dotsStyles" :current="img_current" :mode="mode">
						<swiper class="img_swiper-box" @change="imgChange">
							<swiper-item class="" v-for="(item, index) in detailInfo.images" :key="index">
								<view class="flex column img_swiper_item">
									<image class="house_img" mode="aspectFill" :src="item.url" @click="previewPropertyImage"></image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
<!-- 					<text v-if="detailInfo.images != undefined && detailInfo.images.length > 0" class="swiper-pos">{{img_current + 1}}/{{detailInfo.images.length}}</text>
 -->				</view>
				<view class="p-l-20 p-r-20" style="box-sizing: border-box;">
					<view class="summary top_label flex row space-between align-center m-t-30" style="height:80upx">
						<text>{{$t('Project Summary')}}</text>
						<view class=" flex row align-center" v-if="detailInfo.video != '' && detailInfo.video != undefined" @click="playVideo">
							<image class="icon" :src="isPlayVideo ? '/static/img/play_icon.png' : '/static/img/stop_icon.png'"/>
							<text class="font-size-small">{{isPlayVideo ? $t('Play Video') : $t('Stop Video')}}</text>
						</view>
					</view>
					
					<view v-if="!isPlayVideo" class="video m-t-10">
						<video class="w-100" autoplay="true" :src="videoUrl" @error="videoErrorCallback" controls></video>
					</view>
					
					<view class="flex column m-t-20 desc skeleton-rect" style="min-height: 330upx;" >
						<text class="font-size-normal uni-bold">{{detailInfo.secondary_description == undefined ? '' : detailInfo.secondary_description}}</text>
						<!-- <rich-text class="font-size-normal m-t-10" :nodes="detailInfo.description == undefined ? '' : detailInfo.description"></rich-text> -->
						<text class="font-size-normal m-t-10">{{detailInfo.description == undefined ? '' : detailInfo.description}}</text>
					</view>
					<view class="agent flex row space-between m-t-30 ">
						<view class="flex column m-l-20" style="margin-top:-10px;" @click="gotoAgent">
							<text class="font-size-medium uni-bold" style="line-height: 1.5;">{{$t("Agent's Package" )}}</text>
							<text class="font-size-xsmall" style="line-height: 1;">{{$t("Access Project Files" )}}</text>
						</view>
						<view class="flex column m-r-20 m-t-10 flex-end text-right" @click="gotoUnit">
							<text class="font-size-xsmall text-right" style="line-height: 1;">{{$t("Start make reservation")}}</text>
							<text class="font-size-medium uni-bold text-right" style="line-height: 1.5;">{{$t("Available Units" )}}</text>
						</view>
					</view>
					<view class="top_label m-t-50 column flex flex-start"  style="align-items: flex-start !important;">
						<text>{{$t('Amenities')}}</text>	
						<text class="font-size-small font-normal m-t-5">{{$t("Click the map below to view location analysis")}}</text>
						
					</view>
					<view class="map m-t-10 flex column skeleton-rect" style="height:380upx;"  @tap="gotoMap"> 
						<block v-if="detailInfo.address != undefined">
							<image class="w-100 map_img" :src="'https://image.maps.api.here.com/mia/1.6/mapview?app_id=rLH3gcQKZ8FDUWfBfckJ&app_code=CWWgJNAXJhCrQcLm4rsUWg&lat=' + detailInfo.address.lat + '&lon=' + detailInfo.address.lng + '&vt=0&z=14&w=700&h=400'"></image>
							<image class="map_mark" mode="widthFix" src="/static/img/map_mark.png"></image>
							<cover-view class="cover line-one" >{{detailInfo.address.address}}</cover-view>
						</block>
					</view>
					<view class="top_label m-t-50 column flex flex-start" style="align-items: flex-start !important;">
						<text>{{$t('Education')}}</text>	
						<text class="font-size-small font-normal m-t-5">{{$t('Swipe left and right to view more details')}}</text>	
					</view>
					<view class="education m-l-5 m-t-20 skeleton-rect" style="height:500upx">
						<view class="header flex row">
							<view class="item " @click="schoolPos=0">
								<text :class="schoolPos == 0? 'uni-bold font-gray line-one' : 'font-small font-gray line-one'">{{$t('Primary')}}</text>
								<view v-if="schoolPos ==0" class="bar"></view>
							</view>
							<view  class="item m-l-20" @click="schoolPos=1">
								<text :class="schoolPos == 1? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Secondary')}}</text>
								<view v-if="schoolPos ==1"  class="bar"></view>
							</view>
							<view  class="item m-l-20" @click="schoolPos=2">
								<text :class="schoolPos == 2? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Combined')}}</text>
								<view v-if="schoolPos == 2"  class="bar"></view>
							</view>
							<view  class="item m-l-20" @click="schoolPos=3">
								<text :class="schoolPos == 3? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Special')}}</text>
								<view v-if="schoolPos == 3"  class="bar"></view>
							</view>
						</view>
						<swiper v-if="detailInfo.school != undefined" class="school-swiper m-t-0" :current="schoolPos"  @change="schoolChange">
							<swiper-item>
								<scroll-view scroll-y="true" v-if="detailInfo.school.Primary != undefined"  :style="detailInfo.school.Primary.length > 5 ? 'height:450upx' : 'height:' + detailInfo.school.Primary.length * 100 + 'upx'">
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
					<!-- <view class="top_label m-t-30 column flex flex-start" style="align-items: flex-start !important;"> -->
					<view class="top_label flex row m-t-50">
	<!-- 					<image src="/static/img/mark.png" class="label_mark"></image>
	 -->					<view class="column flex flex-start " style="align-items: flex-start !important;">
							<text class="line-height-1 uni-bold font-size-medium">{{$t('Featured Units')}}</text>	
							<text class="font-size-small font-normal line-height-1 m-t-5">{{$t('Swipe left and right to view more units')}}</text>	
						</view>
					</view>
					
					<view class="feature m-t-20 m-l-5">
					<view class="header flex row skeleton-rect" style="height:60upx;" v-if="detailInfo.unit_featured != undefined && detailInfo.unit_featured.length > 0">
						<scroll-view scroll-x="true">
							<view class="flex row">
								<view v-for="(item,index) in detailInfo.unit_featured" :key="index" class="item" :class="index != 0? 'm-l-20' : ''" @click="unitPos=index">
									<text :class="unitPos == index? 'uni-bold font-gray line-one' : 'font-normal font-gray line-one'">{{item.unit_number}}</text>
									<view v-if="unitPos ==index" class="bar"></view>
								</view>
							</view>
							
						</scroll-view>
					</view>
					<swiper class="unit-swiper m-t-0 skeleton-rect" style="height:200upx;" :current="unitPos"  @change="unitChange" >
						<block v-if="detailInfo.unit_featured != undefined && detailInfo.unit_featured.length > 0">
							<swiper-item v-for="(item,index) in detailInfo.unit_featured" :key="index">
								<view class="flex row swiper_item align-center space-between m-t-20" @click="gotoUnitDetail(index)">
									<view class="w-100 flex row align-center">
										<image src="/static/img/home_plan.png" class="plan"/>
										<view class="flex column m-l-10">
											<view class="flex row space-between" style="width:450upx;">
												<view class="font-size-normal uni-bold font-gray">{{item.spec_bed}}{{$t("Bed")}}</view>
												<view class="font-size-normal uni-bold font-gray">{{item.spec_bath}}{{$t("Bath")}}</view>
												<view class="font-size-normal uni-bold font-gray">{{$t("Price")}}:{{" " + item.price_total}}</view>
											</view>
											
											<text class="font-size-small font-gray" >{{$t('Land Size')}} : {{item.size_land}} {{item.size_unit}}</text>
											<text class="font-size-small font-gray" >{{$t('House Size')}} : {{item.size_house_design}} {{item.size_unit}}</text>
										</view>
									</view>
								</view>
							</swiper-item>
						</block>					
					</swiper>
					
					<view class="top_label flex row m-t-50">
	<!-- 					<image src="/static/img/mark.png" class="label_mark"></image>
	 -->					<view class="column flex flex-start" style="align-items: flex-start !important;">
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
							<text class="font-size-normal uni-bold font-gray left m-r-10 ">{{detailInfo.suburb}}  </text>
							<text class="font-size-normal font-gray line-one">{{$t('demographic, housing growth rate')}}</text>
						</view>
					</view>
					<view class="flex row align-center m-t-10">
						<view class="ic_mark_small"></view>
						<view class="m-l-10">
							<text class="font-size-normal uni-bold font-gray left m-r-10 " >{{suburb}}  </text>
							<text class="font-size-normal font-gray line-one">{{$t('rental estimation')}}</text>
						</view>
					</view>
				</view>
				</view>
				<view class="btn-row m-b-30">
					<button class="login-btn"  @tap="gotoAnalysis">{{$t('Redirect to Premium Anaysis')}}</button>
				</view>
			</view>
		</block>
		<view class="mask" v-if="isShowSaveDlg">
			<view class="save_dlg flex column align-center">
				<image class="close_icon m-t-10 m-r-10" style="align-self: flex-end;" mode="widthFix" src="/static/img/close-circle.png" @click="closeDlg"></image>
				<image class="icon " src="/static/img/heart_yellow.png" mode="widthFix"/>
				<text class="font-size-medium uni-bold m-t-10">{{$t("Project Saved")}}</text>
				<text class="font-size-small m-t-10 text-center m-b-20 save_des" >{{$t("This Project has been added to your collection. Click again to remove.")}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import skeleton from '../../components/skeleton'
	
	import apiUrl from '../../common/apiUrl.js';
	import common from '../../common/common.js';
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	export default {
		components:{
			skeleton
		},
		data() {
			return {
				heartSrc:'/static/img/heart_empty.png',
				isShowSaveDlg:false,
				detailInfo:{},
				promotions:[],
				current: 0,
				img_current:0,
				price:'',
				dotsStyles: {
					border: '1px rgba(83, 200, 249,0.3) solid',
					color: '#D9C077',
					bottom:10,
					backgroundColor:'#ffffff',
					selectedBackgroundColor: '#D9C077',
				},
				mode: 'default',
				suburb:'',
				isPlayVideo:true,
				detailInfo:{},
				phone:"18712608080",
				name :"",
				price:'',		
				videoUrl:"",
				kind:['Balywn High School District','Shopping Centre','Close to ALL amenities'],
				schoolPos:0,
				unitPos:0,
				latitude: 39.909,
				longitude: 116.39742,
				scale: 7, 
				showSkeleton:true,
				savedList:[]
			}
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Promotion Detail")
			});
		},
		onLoad(option){
			this.promotions = uni.getStorageSync("promotion")
			//this.current = parseInt(option.index)
			this.getSaveList()
			this.getPropertyDetail(this.promotions[this.current].promotional_hcpp,this.current)
		},
		methods:{
			closeDlg(){
				this.isShowSaveDlg = false
			},
			saveProperty(){
				var that = this
				if(uni.getStorageSync("userInfo") == undefined || uni.getStorageSync("userInfo") == "" || uni.getStorageSync("userInfo") == null) {
					this.gotoLogin()
				}
				else {
					showLoading()
					uni.request({
					    url: apiUrl.saveProperty, //陆枚脦陋脢戮脌媒拢卢虏垄路脟脮忙脢碌陆脫驴脷碌脴脰路隆拢
						method:"POST",
					    header:{
					    	Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					    },
						data: {
					        token: uni.getStorageSync("token"),
							status: this.detailInfo.isSaved ? 1 : 0,
							scene: common.scene + "11410",
							value: this.detailInfo.hash
					    },
					    success: (res) => {
					        console.log(res.data);
							hideLoading()
							if(res.data.code == 0) {
								that.detailInfo.isSaved = !that.detailInfo.isSaved
								
								if(that.detailInfo.isSaved) {
									that.isShowSaveDlg = true
								}
								
								that.setHeartIcon()
							}					
					    }
					});
				}
			},
			setHeartIcon(){
				if(!this.detailInfo.isSaved) {
					this.heartSrc = "/static/img/heart_empty.png"
				}
				else {
					this.heartSrc = "/static/img/heart_yellow.png"
				}
			},
			change(e) {
				this.current = parseInt(e.detail.current);
				if(this.promotions[this.current].property == undefined || this.promotions[this.current].property == null) {
					this.detailInfo = {}
					this.price = ""
					this.getPropertyDetail(this.promotions[this.current].promotional_hcpp,this.current)
				}
				else {
					this.detailInfo = this.promotions[this.current].property
					this.setHeartIcon()
				}
			},
			imgChange(e){
				this.img_current = parseInt(e.detail.current);
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
							that.savedList = res.data.data.collects
							if(that.detailInfo.hash != undefined) {
								for(var i = 0; i < res.data.data.collects.length; i++) {
									if(res.data.data.collects[i].hash == that.detailInfo.hash) {
										that.detailInfo.isSaved = true
										break;
									}
								}										
							}
							
							that.setHeartIcon()
						}
				    }
				});
			},
			getPropertyDetail(hash,index){
				var that = this
				this.showSkeleton = true
				// showLoading(this.$t("Loading"))
				uni.request({
				    url: apiUrl.getPropertyDetail, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						hash: hash
				    },
				    success: (res) => {
						// hideLoading()
				        console.log(res.data);
						if(res.data.code == 0){
							if(res.data.data != null) {
								that.detailInfo = res.data.data
								if(uni.getStorageSync("language") == "en") {
									// if(that.detailInfo.price_min_k < 1000) {
									// 	that.detailInfo.price = that.detailInfo.symbol + that.detailInfo.price_min_k + "K" 
									// }
									// else {
									// 	that.detailInfo.price = that.detailInfo.symbol + that.detailInfo.price_min_k / 1000 + "M" 
									// }
									that.detailInfo.price = that.detailInfo.symbol + common.currency(that.detailInfo.price_min)
									that.detailInfo.suburb = that.detailInfo.suburb_en
									if(that.detailInfo.unit_featured.length > 0) {
										for(var i = 0; i < that.detailInfo.unit_featured.length; i++) {
											// that.detailInfo.unit_featured[i].price_total = that.detailInfo.symbol + (that.detailInfo.unit_featured[i].price_total / 1000000).toFixed(3).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + "M" 
											that.detailInfo.unit_featured[i].price_total = that.detailInfo.symbol + common.currency(that.detailInfo.unit_featured[i].price_total)
										}
									}
								}
								else {
									that.detailInfo.price = that.detailInfo.symbol + common.currency(that.detailInfo.price_min)
									
									// that.detailInfo.price = that.detailInfo.price_min + that.$t("Million")
									that.detailInfo.suburb = that.detailInfo.suburb
									if(that.detailInfo.unit_featured.length > 0) {
										for(var i = 0; i < that.detailInfo.unit_featured.length; i++) {
											that.detailInfo.unit_featured[i].price_total = that.detailInfo.symbol + common.currency(that.detailInfo.unit_featured[i].price_total)
											// that.detailInfo.unit_featured[i].price_total = (that.detailInfo.unit_featured[i].price_total / 10000).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + that.$t("Million") 
										}
									}
								}
								that.detailInfo.isSaved = false
								for(var i = 0; i < that.savedList.length; i++) {
									if(that.savedList[i].hash == that.detailInfo.hash) {
										that.detailInfo.isSaved = true
										break;
									}
								}	
								
								that.setHeartIcon()
								that.promotions[index].property = that.detailInfo
							}
						}						
						else {
							uni.showToast({
							    icon: 'none',
							    title: res.data.message
							});
						}
						
						setTimeout(() => {
							that.showSkeleton = false
						}, 200)	
				    }
				});
			},
			schoolChange(e){
				this.schoolPos = e.detail.current
			},
			unitChange(e){
				this.unitPos = e.detail.current
			},
			gotoAnalysis(){
				uni.navigateTo({
					url:"/pages/house/analysis?hash=" + this.detailInfo.hash + "&name=" + this.detailInfo.name
				})
				// uni.navigateTo({
				// 	url:"/pages/house/test"
				// })
			},
			gotoMap(){
				uni.navigateTo({
					url:"/pages/map/map?hash=" + this.detailInfo.hash + "&lat=" + this.detailInfo.address.lat + "&lng=" + this.detailInfo.address.lng
				})
			},
			gotoAgent(){
				uni.navigateTo({
					url:"/pages/agent/index?hash=" + this.detailInfo.hash
				})
			},
			gotoUnit(){
				uni.navigateTo({
					url:"/pages/unit/index?hash=" + this.detailInfo.hash + "&name=" + this.detailInfo.name
				})
			},
			gotoUnitDetail(index){
				uni.navigateTo({
					url:"/pages/unit/detail?hash=" + this.detailInfo.unit_featured[index].hash
				})
			},
			dial(){
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
			playVideo(){
				this.isPlayVideo = !this.isPlayVideo
				this.videoUrl = this.detailInfo.video
			},
			previewPropertyImage(){				
				let imgsArray = []
				for(var i = 0; i < this.detailInfo.images.length; i++) {
					imgsArray.push(this.detailInfo.images[i].url)
				}				
				
				uni.previewImage({
					urls: imgsArray
				});
			},
			gotoLogin(){
				uni.navigateTo({
					url:"../login/login"
				})
			},
			// 分享好友
			share() {
				// 分享图文到微信聊天界面
				if(!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				}
				else {
					var baseStr = "hash=" + this.detailInfo.hash + "&user_hash=" + uni.getStorageSync("userInfo").user.hash
					var base64 = btoa(baseStr)
					var base66 = "c" + base64.substring(0,5) + "t" + base64.substring(5)
					showLoading()
					uni.share({
					provider: "weixin", // 服务商
					scene: "WXSceneSession", // 场景 微信好友WXSceneSession  朋友圈WXSceneTimeLine
					type: 0, // 图文0 文字1 图片2
					href: common.shareUrl, // 分享h5地址
					title: this.detailInfo.name,
					summary: this.detailInfo.address.address, // 描述
					imageUrl: this.detailInfo.images[0].thumb_url,
					success: function (res) {
						hideLoading()
						console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						hideLoading()
						console.log("fail:" + JSON.stringify(err));
					}
					});
				}
			}
		}
	}
</script>

<style>
	.promo_swiper, .promo_swiper-box {
		height: 250upx;
	}
	
	.promo_swiper_item{
		color:#D9C077;
		background: #2a2a2a;
		padding:20px;
		height: 250upx;
	}
	.swiper, .swiper-box {
		height: 500upx;
	}
	.des {
		 overflow: hidden;
		   text-overflow: ellipsis;
		   display: -webkit-box;
		   -webkit-line-clamp: 2; /* number of lines to show */
		   -webkit-box-orient: vertical;
	}
	
	.uni-swiper__dots-nav{
		justify-content: flex-end !important;
		background-color: transparent !important;
		color: #D9C077 !important;
	}
	
	.uni-swiper__dots-box {
		margin-bottom:60upx;
		justify-content: flex-start !important;
		margin-left:20px;
	}
		
	.header-item .text {
		height: 44upx;
		line-height: 44upx;
		background-color: rgba(0, 0, 0, 1);
		text-align: center;
		border:1px solid rgb(0,0,0);
		border-radius: 4upx;
		color:#d9c077;
		font-size:20upx;
		padding:0upx 20upx;
	}
	
	.header-item .icon{
		width:18px;
		height:18px;
	}
	
	.header-item {
		margin-top:20upx;
	}
	
	.right .icon{
		width: 48upx;
	}
	
	.content{
		background:#f8f8f8;
		padding:0px;
	}
	
	.house_img {
		width: 100%;
		height: 500upx;
	}
	
	.img_swiper, .img_swiper-box {
		height: 500upx;
	}
	
	.swiper-pos{
		position:absolute;
		right:20px;
		z-index: 100000;
		margin-top:-35px;
		color:#000;
		font-weight: bold;
	}
	
	
	.label_mark{
		width:16upx;
		height:60upx;
	}
	
	.map_img {
		height:380upx;
	}
	
	.map_mark{
		width:64upx;
		height:68upx;
		position: absolute;
		align-self: center;
		margin-top: 160upx;
		z-index:10000;
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
		display:flex;
	}
	
	.agent {
		background-image: url(/static/img/back.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		height:130upx;
		align-items: center;
	}
	
	.summary .text{
		font-size:32upx;
		font-weight: bold;
	}
	
	.summary .icon{
		margin-right:10upx;
		width:20px;
		height:20px;
	}
	
	.desc{
		margin-left:5px;
	}
	
	.map {
		width:100%;
		height:380upx;
	}
		
	.cover{
		margin-top:-70upx;
		background: rgba(0,0,0,0.3);;
		height:70upx;
		line-height:70upx;
		width:100%;
		text-align: left;
		display: flex;
		align-items: center;
		color:white;
		font-weight: bold;
		z-index:100;
		padding: 0px 10px;
		box-sizing: border-box;
	}
	
	.mark{
		width:12upx;
		height:20upx;
	}
	
	.bar{
		width: 50upx;
		height: 6upx;
		background-color: rgba(217, 192, 119, 100);
		text-align: center;
		border-radius: 2upx;
	}
	
	.plan{
		width:150upx;
		height:150upx;
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
		margin-left:20upx;
		border: 2px solid rgba(217, 192, 119, 100);
		display:inline-block;
		margin-bottom:160upx;
	}
	
	.school-swiper{
		height: 450upx;
	}
	
	.unit-swiper {
		height:200upx;
	}
	
	.mask {
		width:100%;
		height:100vh;
		display:flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0,0,0,0.3);
	}

	.save_dlg{
		border-radius: 20upx;
		width:560upx;
		box-shadow: 1px 1px 5px #333;
		justify-content: center;
		background:#F8F8F8;
	}
	
	.save_dlg .icon {
		width:40px;
	}
	
	.save_dlg .close_icon{
		width:32upx;
/* 		position: absolute;
		margin-top: -130upx;
		margin-left: 230upx; */
	}
	
	.save_des{
		padding: 0px 30px;
		box-sizing: border-box;
	}
</style>
