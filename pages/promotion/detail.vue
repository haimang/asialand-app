<template>
	<view class="content w-100">
		<uni-swiper-dot v-if="promotions.length > 0" class="promo_swiper m-t-0" :style="'height:' + swiperHeight + 'px'" :info="promotions" :dots-styles="dotsStyles" :current="current" :mode="mode">
			<swiper sw="promo_swiper-box"  :style="'height:' + swiperHeight + 'px'" @change="change">
				<swiper-item :style="'height:' + swiperHeight + 'px'" class="" v-for="(item, index) in promotions" :key="index">
					<view class="flex column promo_swiper_item" :style="'height:' + swiperHeight + 'px'">
						<view class="font-size-big uni-bold">{{item.title}}</view>
						<view :class="'des font-size-small promo_des_' + index">{{item.des}}</view>						
					</view>					
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<block v-if="detailInfo != undefined">
			<view class="header flex row space-between m-b-30 m-t-20" :style="showSkeleton ? 'height:120px' : 'height:auto'">
				<view class="left flex column m-l-15" style="width:600upx">
					<text class="font-size-big uni-bold m-t-10 ">{{detailInfo.name == undefined ? '' : detailInfo.name}}</text>
					<text class="font-size-normal  m-b-20 " >{{$t('Starting from')}}: <text class="uni-bold m-l-5">{{detailInfo.price}}</text></text>
					<view class="flex row flex-wrap " >
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
				<view class="right flex column m-r-15">
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
			
			<view style="background:white;" class="skeleton">
				<skeleton selector="skeleton" bgcolor="transparent" v-if="showSkeleton"></skeleton>
				
				<view class="w-100 skeleton-rect" style="height: 530upx;" >
					<uni-swiper-dot v-if="detailInfo.images != undefined && detailInfo.images.length > 0" class="img_swiper m-t-0" :info="detailInfo.images" :dots-styles="dotsStyles" :current="img_current" :mode="mode">
						<swiper class="img_swiper-box" @change="imgChange">
							<swiper-item class="" v-for="(item, index) in detailInfo.images" :key="index">
								<view class="flex column img_swiper_item">
									<image class="house_img" mode="aspectFill" :src="item.url " @click="previewPropertyImage"></image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
					<text v-if="detailInfo.images != undefined && detailInfo.images.length > 0" class="swiper-pos">{{img_current + 1}}/{{detailInfo.images.length}}</text>
				</view>
				<view class="p-l-15 p-r-15" style="box-sizing: border-box;">
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
					
					<view class="flex row m-t-20" v-if='$t("Price") == "价格"'>
						<view v-if="isEnglish" class="flex row align-center translate-btn" @click="changeTranslate(0)">
							<image class="translate-icon m-l-10" src="/static/img/ic_eng_chi.png"></image>
							<text class="font-size-normal m-l-10 m-r-10">{{$t("englishToChinese")}}</text>
						</view>
					
						<view v-if="!isEnglish" class="flex row align-center translate-btn-active" @click="changeTranslate(1)">
							<image class="translate-icon m-l-10" src="/static/img/ic_eng_chi.png"></image>
							<text class="font-size-normal m-l-10 m-r-10">{{$t("chineseToEnglish")}}</text>
						</view>
						
						<view class="flex row copy_clipboard align-center m-l-10" @click="copyDes()">
							<image class="copy-icon m-l-10" src="/static/img/copy_icon.png"></image>
							<text class="font-size-normal m-l-10 m-r-10">{{$t("CopyText")}}</text>
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
					<!-- <view class="header flex row skeleton-rect" style="height:60upx;" v-if="detailInfo.unit_featured != undefined && detailInfo.unit_featured.length > 0">
						<scroll-view scroll-x="true">
							<view class="flex row">
								<view v-for="(item,index) in detailInfo.unit_featured" :key="index" class="item" :class="index != 0? 'm-l-20' : ''" @click="unitPos=index">
									<text :class="unitPos == index? 'uni-bold font-gray line-one' : 'font-normal font-gray line-one'">{{item.unit_number}}</text>
									<view v-if="unitPos ==index" class="bar"></view>
								</view>
							</view>
							
						</scroll-view>
					</view> -->
					<swiper class="unit_swiper_item unit-swiper m-t-0 skeleton-rect" style="height:280upx;" :current="unitPos" @change="unitChange">
						<block v-if="detailInfo.unit_featured != undefined && detailInfo.unit_featured.length > 0">
							<swiper-item v-for="(item,index) in detailInfo.unit_featured" :key="index">
								<view class="flex row  align-center space-between " @click="gotoUnitDetail(index)">
									<view class="w-100 flex column">
										<view class="w-100 flex row align-center">
											<image :src="item.floorplan != null ? item.floorplan : '/static/img/home_plan.png'" class="plan" />
											<view class="flex column m-l-20">
												<view class="flex column m-b-10">
													<view class="flex row align-center">
														<text class="uni-bold font-gray line-one">{{item.unit_number}}</text>
														<view class="unit_status_mark font-size-small">{{item.sales_status == 2 ? $t('Available unit') : item.sales_status == 3 ? $t('Booked') :  $t('Sold out')}}</view>
													</view>
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
											<block v-if="item.prop_type==1">
												<view class="font-size-small font-gray flex row" v-if="item.size_interior != null && item.size_interior != 0 && item.size_interior != ''"><view  class="font-size-small">{{$t('Internal Size')}} :</view> <view class="font-size-small uni-bold m-l-5">{{item.size_interior}}{{item.size_unit}}</view></view>
												<view class="font-size-small font-gray flex row m-l-10" v-if="item.size_exterior != null && item.size_exterior != 0 && item.size_exterior != ''"><view class="font-size-small">{{$t('External Size')}} :<text class="font-size-small uni-bold m-l-5">{{item.size_exterior}}{{item.size_unit}}</text></view> </view>												
											</block>
											<block v-if="item.prop_type==2">	
												<view class="font-size-small font-gray flex row" v-if="item.size_land != null && item.size_land != 0 && item.size_land != ''"><view class="font-size-small">{{$t('Land Size')}} :<text class="font-size-small uni-bold m-l-5">{{item.size_land}}{{item.size_unit}}</text></view> </view>
												<view class="font-size-small font-gray m-l-10 flex row" v-if="item.size_house_design != null && item.size_house_design != 0 && item.size_house_design != ''"><view  class="font-size-small">{{$t('House Size')}} :</view> <view class="font-size-small uni-bold m-l-5">{{item.size_house_design}}{{item.size_unit}}</view></view>
											</block>
											<block v-if="item.prop_type==3">
												<view class="font-size-small font-gray flex row" v-if="item.size_land != null && item.size_land != 0 && item.size_land != ''"><view class="font-size-small">{{$t('Land Size')}} :<text class="font-size-small uni-bold m-l-5">{{item.size_land}}{{item.size_unit}}</text></view> </view>
												<view class="font-size-small font-gray m-l-10 flex row" v-if="item.size_house_design != null && item.size_house_design != 0 && item.size_house_design != ''"><view  class="font-size-small">{{$t('House Size')}} :</view> <view class="font-size-small uni-bold m-l-5">{{item.size_house_design}}{{item.size_unit}}</view></view>
											</block>
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
		
		<view class="agent-footer" v-if="isLogined">
			<view class="agent flex row space-between">
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
				swiperHeight:120,
				tags:[],
				tags_cn:[],
				isLogined:'',
				desCn: '',
				secDesCn: '',
				desEn: '',
				secDesEn: '',
				isReadAll: false,
				isEnglish: true,
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
				showSkeleton:false,
				savedList:[],
				userType:''
			}
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Promotion Detail")
			});
		},
		onReady(){
			
		},
		onLoad(option){
			this.promotions = uni.getStorageSync("promotion")
			this.isLogined = uni.getStorageSync("isLogin")
			this.userType = uni.getStorageSync("userInfo").user_status[1].is_portal_user.role_type
			
			this.getSaveList()
			this.getPropertyDetail(this.promotions[this.current].promotional_hcpp,this.current)
			setTimeout(()=>{
				this.getElementHeight('.promo_des_0')
			},1000)
		},
		methods:{
			getElementHeight(element){
				setTimeout(()=>{
					let query = uni.createSelectorQuery().in(this);
					query.select(element).boundingClientRect();
					query.exec((res) => {
						if(!res) {
							this.getElementHeight();
						}
						else {
							if(res[0].height > 0) {
								this.swiperHeight = res[0].height * 1.3  + uni.upx2px(100) + 30
							}
							else {
								this.swiperHeight = uni.upx2px(100) + 30 + 20 * 2
							}
							
							this.showSkeleton = true
						}
					})
				},20)
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
			},
			getTranslate(hash, lang) {
				var that = this
				// showLoading(this.$t("Loading"))
				uni.request({
					url: apiUrl.getTranslate, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: hash,
						lang: lang
					},
					success: (res) => {
						// hideLoading()
						console.log(res.data);
						if (res.data.code == 0) {
							if (res.data.data != null) {
								if (lang == "zh") {
									that.desCn = res.data.data.description_cn
									that.secDesCn = res.data.data.secondary_description_cn
								} else {
									that.desEn = res.data.data.description_en
									that.secDesEn = res.data.data.secondary_description_en
								}
								
								if(uni.getStorageSync("language") != "en") {
									if(res.data.data.tags_cn != null && res.data.data.tags_cn != '' ) {
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
			
						setTimeout(() => {
							that.showSkeleton = false
						}, 200)
					}
				});
			},
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
				this.getElementHeight('.promo_des_' + this.current)
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
								
								that.tags = that.detailInfo.tags
								if(uni.getStorageSync("language") == "en") {
									// if(that.detailInfo.price_min_k < 1000) {
									// 	that.detailInfo.price = that.detailInfo.symbol + that.detailInfo.price_min_k + "K" 
									// }
									// else {
									// 	that.detailInfo.price = that.detailInfo.symbol + that.detailInfo.price_min_k / 1000 + "M" 
									// }
									that.detailInfo.price = that.detailInfo.symbol + common.currency(that.detailInfo.price_min * 10000)
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
								
								that.getTranslate(hash,'zh')
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
				if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2) {
					uni.navigateTo({
						url: "/pages/error/403"
					})
				}
				else {
					uni.navigateTo({
						url:"/pages/house/analysis?hash=" + this.detailInfo.hash + "&name=" + this.detailInfo.name
					})
				}
			},
			gotoMap(){
				uni.navigateTo({
					url:"/pages/map/map?hash=" + this.detailInfo.hash + "&lat=" + this.detailInfo.address.lat + "&lng=" + this.detailInfo.address.lng
				})
			},
			gotoAgent(){
if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2) {					
				uni.navigateTo({
						url: "/pages/error/403"
					})
				}
				else {
					uni.navigateTo({
						url:"/pages/agent/index?hash=" + this.detailInfo.hash
					})
				}
			},
			gotoUnit(){
if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2) {					uni.navigateTo({
						url: "/pages/error/403"
					})
				}
				else {
					uni.navigateTo({
						url:"/pages/unit/index?hash=" + this.detailInfo.hash + "&name=" + this.detailInfo.name
					})
				}
			},
			gotoUnitDetail(index){
if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2) {					uni.navigateTo({
						url: "/pages/error/403"
					})
				}
				else {
					if(this.isLogined) {   //3:普通成员
						uni.navigateTo({
							url:"/pages/unit/detail?hash=" + this.detailInfo.unit_featured[index].hash
						})
					}
				}
			},
			dial(){
				var userInfo = uni.getStorageSync('userInfo')
				uni.makePhoneCall({
				    phoneNumber: userInfo.user_info.mobile, 
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
			copyDes(){
				uni.setClipboardData({
					data:this.isEnglish ? (this.detailInfo.description == undefined ? '' : this.detailInfo.description) : this.desCn,//要被复制的内容
					success:()=>{//复制成功的回调函数
					  uni.showToast({//提示
						icon: 'none',
						title: this.$t('Copy Success')
					  })
					}
				  });
				
			},
			// 分享好友
			share() {
				// 分享图文到微信聊天界面
				if(!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				}
				else {
					var baseStr = "hash=" + this.detailInfo.hash + "&user_hash=" + uni.getStorageSync("userInfo").hash
					var base64 = btoa(baseStr)
					var base66 = "c" + base64.substring(0,5) + "t" + base64.substring(5)
					
					var title = ""
					var desc = ""
					
					//不是公司成员
					if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.status == null || uni.getStorageSync("userInfo").user_status[1].is_portal_user.status == 0) {
						desc = this.detailInfo.secondary_description
						if(uni.getStorageSync("language") == 'en') {
							title = this.detailInfo.proptype_en + ": " + this.detailInfo.name
						}
						else {
							title = this.detailInfo.proptype + ": " + this.detailInfo.name
						}
					}
					else {  //公司成员
						if(uni.getStorageSync("language") == 'en') {
							title = this.detailInfo.proptype_en + ": " + this.detailInfo.name
							desc = "Project shared by Asialand - " + uni.getStorageSync("userInfo").user_info.first_name + " " + uni.getStorageSync("userInfo").user_info.last_name
						}
						else {
							title = this.detailInfo.proptype + ": " + this.detailInfo.name
							desc = "由 Asialand - " + uni.getStorageSync("userInfo").user_info.first_name + " " + uni.getStorageSync("userInfo").user_info.last_name + "为您分享"
							
						}
					}
					
					showLoading()
					uni.share({
						provider: "weixin", // 服务商
						scene: "WXSceneSession", // 场景 微信好友WXSceneSession  朋友圈WXSceneTimeLine
						type: 0, // 图文0 文字1 图片2
						href: uni.getStorageSync("language") != 'en' ? common.shareUrl + "property/" + base66 : common.shareUrl_en + "property/" + base66, // 分享h5地址					
						title: title,
						summary: desc, // 描述
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
/* 	.promo_swiper, .promo_swiper-box {
		height: 250upx;
	} */
	
	.promo_swiper_item{
		color:#D9C077;
		background: #2a2a2a;
		padding:40upx 30upx;
		/* //height: 250upx; */
	}
	
	.swiper, .swiper-box {
		height: 500upx;
	}
	.des {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3; /* number of lines to show */
		-webkit-box-orient: vertical;
		line-height: 1.3;
	}
	
	.uni-swiper__dots-nav{
		justify-content: flex-end !important;
		background-color: transparent !important;
		color: #D9C077 !important;
	}
	
	.promo_swiper .uni-swiper__dots-box {
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
		margin-top:-25px;
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
		height: 130upx;
		align-items: center;
		width: 680upx;
		box-sizing: border-box;
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
	
	.unit_swiper_item {
		border: 1px solid #D9C077;
		padding: 40upx;
	}
	
	.split {
		width: 100%;
		height: 2upx;
		background-color: #aaa;
	}
	
	.agent-footer{
		position: fixed;
		bottom:0px; 
		height:170upx;
		display:flex;
		align-items: center;
		background-color: white;
		justify-content: center;
		width: 100%;
		z-index:100000;
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
	
	.copy_clipboard {
		border-radius: 10upx;
		background-color: rgba(217, 192, 119, 100);
		text-align: center;
		border: 1px solid rgba(217, 192, 119, 100);
	}
	
	.copy-icon{
		width: 32upx;
		height: 32upx;
	}
</style>
