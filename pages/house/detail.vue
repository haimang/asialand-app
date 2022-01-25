<template>
	<view class="content">
		<view class="w-100 ">
			<view class="header flex row space-between m-b-30" :style="showSkeleton ? 'height:120px' : 'height:auto'">
				<view class="left flex column m-l-15" style="width:600upx">
					<text class="font-size-big uni-bold m-t-10 ">{{v2DetailInfo == undefined || v2DetailInfo.project_name_en == undefined ? '' : v2DetailInfo.project_name_en}}</text>
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
				
				<view class="w-100 skeleton-rect" style="height: 530upx;" >
					<uni-swiper-dot v-if="v2DetailInfo.image != undefined && v2DetailInfo.image.contents != undefined && v2DetailInfo.image.contents.length > 0" class="swiper m-t-0" :info="v2DetailInfo.image.contents"
					 :dots-styles="dotsStyles" :current="current" :mode="mode">
						<swiper class="swiper-box" @change="change">
							<swiper-item class="" v-for="(item, index) in v2DetailInfo.image.contents" :key="index">
								<view class="flex column swiper_item">
									<image class="house_img" mode="aspectFill" :src="v2DetailInfo.image.properties.cos_prefix + item.relative_url + v2DetailInfo.image.properties.ci_surfix + v2DetailInfo.image.properties.ci_medium + v2DetailInfo.image.properties.ci_quality" @click="previewPropertyImage"></image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
					<text v-if="v2DetailInfo.image != undefined && v2DetailInfo.image.contents != undefined && v2DetailInfo.image.contents.length > 0" class="swiper-pos">{{current + 1}}/{{v2DetailInfo.image.contents.length}}</text>
				</view>
				
				<view class="p-l-15 p-r-15" style="box-sizing: border-box;">
					
					<view class="summary top_label flex row space-between align-center m-t-30" style="height:80upx">
						<text>{{$t('Project Summary')}}</text>
						<view class=" flex row align-center" v-if="v2DetailInfo.video != undefined && v2DetailInfo.video.contents != '' && v2DetailInfo.video.contents != undefined && v2DetailInfo.video.contents.length > 0" @click="playVideo">
							<image class="icon" :src="isPlayVideo ? '/static/img/play_icon.png' : '/static/img/stop_icon.png'" />
							<text class="font-size-small">{{isPlayVideo ? $t('Play Video') : $t('Stop Video')}}</text>
						</view>
					</view>

					<view v-if="!isPlayVideo" class="video m-t-10">
						<video class="w-100" autoplay="true" :src="videoUrl" @error="videoErrorCallback" controls></video>
					</view>
						
					<block v-if="v2DetailInfo != undefined">
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
							<text class="font-size-normal uni-bold">{{isEnglish ? (v2DetailInfo.descriptions == undefined ? '' : v2DetailInfo.descriptions.secondary_des_en) : secDesCn}}</text>
							<!-- <rich-text class="font-size-normal m-t-10" :nodes="detailInfo.description == undefined ? '' : detailInfo.description"></rich-text> -->
							<text class="font-size-normal m-t-10" :class="!isReadAll ? 'elllipse' : ''">
								{{isEnglish ? (v2DetailInfo.descriptions == undefined ? '' : v2DetailInfo.descriptions.full_des_en) : desCn}}
							</text>
						</view>
					</block>
					<block v-if="v2DetailInfo.descriptions != '' && v2DetailInfo.descriptions != undefined">
						<view class="font-size-normal uni-bold btn-read-more m-t-15 m-b-10" @click="showAllDesc">{{$t("read more")}}</view>
					</block>
					
					<view class="top_label flex row m-t-50">
						<view class="column flex flex-start " style="align-items: flex-start !important;">
							<view class="flex row align-center">
								<text class="line-height-1 uni-bold font-size-medium">{{$t('Project information')}}</text>
							</view>
						</view>
					</view>
					<block v-if="v2DetailInfo != undefined">					
						<view class="flex column m-t-10 " v-if="v2DetailInfo != undefined">
							<text class="font-size-normal item">{{$t('Project Type')}}: <text class="uni-bold m-l-10">{{type}}</text></text>
							<text class="font-size-normal item back-gray">{{$t('Location')}}: <text class="uni-bold  m-l-10">{{ v2DetailInfo.location != undefined ? v2DetailInfo.location[1].address : ""}}</text></text>
			<!--			<text class="font-size-normal item">{{$t('Developer')}}: <text class="uni-bold m-l-10">{{detailInfo.developer}}</text></text>-->
							<text class="font-size-normal item ">{{$t('Completion')}}: <text class="uni-bold m-l-10">{{v2DetailInfo.factsheet != undefined ? v2DetailInfo.factsheet.date_construct : ""}}</text></text>
							<text class="font-size-normal item back-gray">{{$t('Total Volume')}}: <text class="uni-bold m-l-10">{{v2DetailInfo.unit != undefined ?  v2DetailInfo.unit.total_number : ""}}</text></text>
							<text class="font-size-normal item ">{{$t('Price Range')}}: <text class="uni-bold m-l-10">{{price_min + " - "}}{{price_max}}</text></text>
						</view>
					</block>
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
							<block v-if="v2DetailInfo.unit != undefined && v2DetailInfo.unit.featured.length > 0">
								<swiper-item v-for="(item,index) in v2DetailInfo.unit.featured" :key="index">
									<view class="flex row  align-center space-between " @click="gotoUnitDetail(index)">
										<view class="w-100 flex column">
											<view class="w-100 flex row align-center">
												<image :src="item.medias.image.url != null && item.medias.image.url != '' ? item.medias.image.url : '/static/img/home_plan.png'"
												 class="plan" />
												<view class="flex column m-l-20">
													<view class="flex column m-b-10">
														<view class="flex row align-center">
															<text class="uni-bold font-gray line-one">{{item.unit_number}}</text>
															<view class="unit_status_mark font-size-small">{{item.config.sales_status == 2 ? $t('Available unit') : item.config.sales_status == 3 ? $t('Booked') :  $t('Sold out')}}</view>
														</view>
														<view class="bar"></view>
													</view>
													<view class="font-size-normal font-gray">{{$t("Price")}}: <text class="uni-bold">{{" " + item.price.symbol + item.price.price}}</text></view>
													<view class="flex row ">
														<view class="font-size-normal uni-bold font-gray m-r-10" v-if="item.specs.bed != 0">{{item.specs.bed}}{{" " + $t("Bed")}}</view>
														<view class="font-size-normal uni-bold font-gray m-r-10" v-if="item.specs.bath != 0">{{item.specs.bath}}{{" " + $t("Bath")}}</view>
														<view class="font-size-normal uni-bold font-gray " v-if="item.specs.car != 0">{{item.specs.car}}{{" " + $t("Car")}}</view>
													</view>
												</view>
											</view>
											<view class="split m-t-15 m-b-15"></view>
											<view class="flex row">
												<block v-if="item.property_type==1">
													<view class="font-size-small font-gray flex row" v-if="item.sizes.internal != null && item.sizes.internal != 0 && item.sizes.internal != ''">
														<view class="font-size-small">{{$t('Internal Size')}} :</view>
														<view class="font-size-small uni-bold m-l-5">{{item.sizes.internal}}{{item.sizes.size_unit}}</view>
													</view>
													<view class="font-size-small font-gray flex row m-l-10" v-if="item.sizes.external != null && item.sizes.external != 0 && item.sizes.external != ''">
														<view class="font-size-small">{{$t('External Size')}} :<text class="font-size-small uni-bold m-l-5">{{item.sizes.external}}{{item.sizes.size_unit}}</text></view>
													</view>
												</block>
												<block v-if="item.property_type==2">
													<view class="font-size-small font-gray flex row" v-if="item.sizes.external != null && item.sizes.external != 0 && item.sizes.external != ''">
														<view class="font-size-small">{{$t('Land Size')}} :<text class="font-size-small uni-bold m-l-5">{{item.sizes.external}}{{item.sizes.size_unit}}</text></view>
													</view>
													<view class="font-size-small font-gray m-l-10 flex row" v-if="item.sizes.internal != null && item.sizes.internal != 0 && item.sizes.internal != ''">
														<view class="font-size-small">{{$t('House Size')}} :</view>
														<view class="font-size-small uni-bold m-l-5">{{item.sizes.internal}}{{item.sizes.size_unit}}</view>
													</view>
												</block>
												<block v-if="item.property_type==3">
													<view class="font-size-small font-gray flex row" v-if="item.sizes.external != null && item.sizes.external != 0 && item.sizes.external != ''">
														<view class="font-size-small">{{$t('Land Size')}} :<text class="font-size-small uni-bold m-l-5">{{item.sizes.external}}{{item.sizes.size_unit}}</text></view>
													</view>
													<view class="font-size-small font-gray m-l-10 flex row" v-if="item.sizes.internal != null && item.sizes.internal != 0 && item.sizes.internal != ''">
														<view class="font-size-small">{{$t('House Size')}} :</view>
														<view class="font-size-small uni-bold m-l-5">{{item.sizes.internal}}{{item.sizes.size_unit}}</view>
													</view>
												</block>
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
						<block v-if="v2DetailInfo.location != undefined && v2DetailInfo.location[1].address != undefined">
							<image class="w-100 map_img" :src="'https://image.maps.api.here.com/mia/1.6/mapview?app_id=rLH3gcQKZ8FDUWfBfckJ&app_code=CWWgJNAXJhCrQcLm4rsUWg&lat=' + v2DetailInfo.location[1].lat + '&lon=' + v2DetailInfo.location[1].lon + '&vt=0&z=14&w=700&h=400'"></image>
							<image class="map_mark" mode="widthFix" src="/static/img/map_mark.png"></image>
							<cover-view class="cover line-one">{{v2DetailInfo.location[1].address}}</cover-view>
						</block>
					</view>
					
					<view v-if="v2DetailInfo.relate_hashes != undefined && v2DetailInfo.relate_hashes.education != null" class="top_label m-t-50 column flex flex-start" style="align-items: flex-start !important;">
						<text>{{$t('Education')}}</text>
						<text class="font-size-small font-normal m-t-5">{{$t('Swipe left and right to view more details')}}</text>
					</view>
					<view v-if="v2DetailInfo.relate_hashes != undefined && v2DetailInfo.relate_hashes.education != null" class="education m-l-5 m-t-15 skeleton-rect" style="height:500upx">
						<view class="header flex row" v-if="educationInfo != null ">
							<view class="item " @click="schoolPos=0" v-if="educationInfo.Primary != null && educationInfo.Primary.length > 0">
								<text :class="schoolPos == 0? 'uni-bold font-gray line-one' : 'font-small font-gray line-one'">{{$t('Primary')}}</text>
								<view v-if="schoolPos ==0" class="bar"></view>
							</view>
							<view class="item" @click="schoolPos=1" v-if="educationInfo.Secondary != null && educationInfo.Secondary.length > 0">
								<text :class="schoolPos == 1? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Secondary')}}</text>
								<view v-if="schoolPos ==1" class="bar"></view>
							</view>
							<view class="item" @click="schoolPos=2" v-if="educationInfo.Combined != null && educationInfo.Combined.length > 0">
								<text :class="schoolPos == 2? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Combined')}}</text>
								<view v-if="schoolPos == 2" class="bar"></view>
							</view>
							<view class="item" @click="schoolPos=3" v-if="educationInfo.Special != null && educationInfo.Special.length > 0">
								<text :class="schoolPos == 3? 'uni-bold font-gray line-one' : 'font-small font-gray line-one' ">{{$t('Special')}}</text>
								<view v-if="schoolPos == 3" class="bar"></view>
							</view>
						</view>
						<swiper v-if="educationInfo != undefined" class="school-swiper m-t-0" :current="schoolPos" @change="schoolChange">
							<swiper-item>
								<scroll-view scroll-y="true" v-if="educationInfo.Primary != undefined" :style="educationInfo.Primary .length > 5 ? 'height:450upx' : 'height:' + educationInfo.Primary .length * 100 + 'upx'">
									<block v-for="(item,index) in educationInfo.Primary" :key="index">
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
								<scroll-view scroll-y="true" v-if="educationInfo.Secondary != undefined" :style="educationInfo.Secondary.length > 5 ? 'height:450upx' : 'height:' + educationInfo.Secondary.length * 100 + 'upx'">
									<block v-for="(item,index) in educationInfo.Secondary" :key="index">
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
								<scroll-view scroll-y="true" v-if="educationInfo.Combined != undefined" :style="educationInfo.Combined.length > 5 ? 'height:450upx' : 'height:' + educationInfo.Combined.length * 100 + 'upx'">
									<block v-for="(item,index) in educationInfo.Combined" :key="index">
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
								<scroll-view scroll-y="true" v-if="educationInfo.Special != undefined" :style="educationInfo.Special.length > 5 ? 'height:450upx' : 'height:' + educationInfo.Special.length * 100 + 'upx'">
									<block v-for="(item,index) in educationInfo.Special" :key="index">
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
			<!-- 			<view class="agent-footer" v-if="isLogined && userType != 'client'">
 -->
			<view class="agent-footer" v-if="isLogined ">
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
				price_min:0,
				price_max:0,
				schoolPos: 0,
				unitPos: 0,
				latitude: 39.909,
				longitude: 116.39742,
				scale: 7,
				current: 0,
				suburb: '',
				isPlayVideo: true,
				v2DetailInfo: {},
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
				unitNum: '',
				nearbyInfo:{},
				educationInfo:{},
				type:''
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
				this.v2DetailInfo.project_name_en = option.name
				console.log("name:" + this.v2DetailInfo.project_name_en)
			}

			if (option.price) {
				this.price = option.price
				console.log("price:" + this.price)
			}

			this.isLogined = uni.getStorageSync("isLogin")
			// this.userType = uni.getStorageSync("userInfo").user.type
			// //this.hash = "HCPP-DGUygntgGK"
			this.getV2Detail()    //call for amenities
			
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
						}
					}
				});
			},
			getV2Detail() {
				var that = this
				showLoading(this.$t("Loading"))
				console.log("call v2 detail info:" + this.hash)
				uni.request({
					url: apiUrl.v2_getPropertyDetail, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: this.hash,
						scene:"app"
					},
					success: (res) => {
						// hideLoading()
						console.log("v2 detail info:" + res.data.data)
						if (res.data.code == 0) {
							if (res.data.data != null) {
								this.v2DetailInfo = res.data.data
								this.tags = this.v2DetailInfo.descriptions.tags_en
								
								if (uni.getStorageSync("language") == "en") {
									this.unitNum = "Total " + this.v2DetailInfo.unit.total_number + " units"
									this.suburb = this.v2DetailInfo.location.suburb_en
									this.type = this.v2DetailInfo.project_type_en
								
								} else {
									this.unitNum = "共计 " + this.v2DetailInfo.unit.total_number + " 户型"
									this.suburb = this.v2DetailInfo.location.suburb_cn
									this.type = this.v2DetailInfo.project_type_cn
								}	
															
								if (this.v2DetailInfo.unit.featured.length > 0) {
									for (var i = 0; i < this.v2DetailInfo.unit.featured.length; i++) {
										this.v2DetailInfo.unit.featured[i].price_total = this.v2DetailInfo.unit.featured[i].price.symbol + common.currency(this.v2DetailInfo.unit.featured[i].price.price)
									}
								}
								
								this.price_min = this.v2DetailInfo.price.symbol + common.currency(this.v2DetailInfo.factsheet.price_min)
								this.price_max = this.v2DetailInfo.factsheet.price_max == null ? '' :  this.v2DetailInfo.price.symbol  + common.currency(this.v2DetailInfo.factsheet.price_max)
								
								console.log("amenities hash:" + this.v2DetailInfo.location[2].amenities)
								if(this.v2DetailInfo.relate_hashes.education != undefined && this.v2DetailInfo.relate_hashes.education != null && this.v2DetailInfo.relate_hashes.education != "") {
									this.getEducationInfo()
								}
								else {
									this.showSkeleton = false;
									hideLoading()
								}
							}
						} else {
							this.showSkeleton = false
							hideLoading();
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
			getEducationInfo() {
				var that = this
				console.log("education info:" + this.hash)
				uni.request({
					url: apiUrl.getEducationInfo, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: this.v2DetailInfo.relate_hashes.education,
						scene:"app"
					},
					success: (res) => {
						hideLoading()
						this.showSkeleton = false
						console.log("education info:" + res.data.data)
						if (res.data.code == 0) {
							this.educationInfo = res.data.data.education
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
			
			gotoAnalysis() {
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				}
				else {
					if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2) {
						uni.navigateTo({
							url: "/pages/error/403"
						})
					} else {
						var imageUrl = ""
						if (this.v2DetailInfo.image.contents.length > 0) {
							imageUrl = this.v2DetailInfo.image.properties.cos_prefix + this.v2DetailInfo.image.contents[0].relative_url + this.v2DetailInfo.image.properties.ci_surfix + this.v2DetailInfo.image.properties.ci_thumb +  this.v2DetailInfo.image.properties.ci_quality;
							for (var i = 0; i < this.v2DetailInfo.image.contents.length; i++) {
								if (this.v2DetailInfo.image.contents[i].is_primary == 1) {
									imageUrl = this.v2DetailInfo.image.properties.cos_prefix + this.v2DetailInfo.image.contents[i].relative_url + this.v2DetailInfo.image.properties.ci_surfix + this.v2DetailInfo.image.properties.ci_medium +  this.v2DetailInfo.image.properties.ci_quality;
									break;
								}
							}
						}
						
						uni.navigateTo({
							url: "/pages/house/analysis?hash=" + this.hash + "&name=" + this.v2DetailInfo.project_name_en + "&primaryImage=" + imageUrl
						})
					}
					}
			},
			gotoMap() {
				uni.navigateTo({
					url: "/pages/map/map?hash=" + this.v2DetailInfo.location[2].amenities + "&lat=" + this.v2DetailInfo.location[1].lat + "&lng=" + this.v2DetailInfo.location[1].lon
				})
			},
			gotoAgent() {
				
				if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2 ) {
					uni.navigateTo({
						url: "/pages/error/403"
					})
				} else {
					var imageUrl = ""
					if (this.v2DetailInfo.image.contents.length > 0) {
						imageUrl = this.v2DetailInfo.image.properties.cos_prefix + this.v2DetailInfo.image.contents[0].relative_url + this.v2DetailInfo.image.properties.ci_surfix + this.v2DetailInfo.image.properties.ci_thumb +  this.v2DetailInfo.image.properties.ci_quality;
						for (var i = 0; i < this.v2DetailInfo.image.contents.length; i++) {
							if (this.v2DetailInfo.image.contents[i].is_primary == 1) {
								imageUrl = this.v2DetailInfo.image.properties.cos_prefix + this.v2DetailInfo.image.contents[i].relative_url + this.v2DetailInfo.image.properties.ci_surfix + this.v2DetailInfo.image.properties.ci_medium +  this.v2DetailInfo.image.properties.ci_quality;
								break;
							}
						}
					}

					uni.navigateTo({
						url: "/pages/agent/index?hash=" + this.hash + "&primaryImage=" + imageUrl
					})
				}
			},
			gotoUnit() {
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				}
				else {
					if ( uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2 ) {
						uni.navigateTo({
							url: "/pages/error/403"
						})
					} else {
						uni.navigateTo({
							url: "/pages/unit/index?hash=" + this.hash + "&name=" + this.v2DetailInfo.project_name_en
						})
					}
				}
				
			},
			gotoUnitDetail(index) {
				if (!uni.getStorageSync("isLogin")) {
					this.gotoLogin()
				}
				else {
					if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.is_double_activated != 2 ) {
						uni.navigateTo({
							url: "/pages/error/403"
						})
					} else {
						uni.navigateTo({
							url: "/pages/unit/detail?hash=" + this.v2DetailInfo.unit.featured[index].hash
						})
					}
				}
			},
			dial() {
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
			playVideo() {
				this.isPlayVideo = !this.isPlayVideo
				this.videoUrl = this.v2DetailInfo.video.contents[0]
			},
			previewPropertyImage() {
				let imgsArray = []
				for (var i = 0; i < this.v2DetailInfo.image.contents.length; i++) {
					imgsArray.push(this.v2DetailInfo.image.properties.cos_prefix + this.v2DetailInfo.image.contents[i].relative_url + this.v2DetailInfo.image.properties.ci_surfix + this.v2DetailInfo.image.properties.ci_large )
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
					var baseStr = "hash=" + this.v2DetailInfo.hash + "&user_hash=" + uni.getStorageSync("userInfo").hash
					var base64 = btoa(baseStr)
					var base66 = "c" + base64.substring(0, 5) + "t" + base64.substring(5)

					var title = ""
					var desc = ""

					//不是公司成员
					if (uni.getStorageSync("userInfo").user_status[1].is_portal_user.status == null || uni.getStorageSync("userInfo").user_status[1].is_portal_user.status == 0) {
						desc = this.v2DetailInfo.descriptions.secondary_des_en
						if (uni.getStorageSync("language") == 'en') {
							title = this.v2DetailInfo.project_type_en + ": " + this.v2DetailInfo.project_name_en
						} else {
							title = this.v2DetailInfo.project_type_cn + ": " + (this.v2DetailInfo.project_name_cn != "" ? this.v2DetailInfo.project_name_cn : this.v2DetailInfo.project_name_en)
						}
					} else { //公司成员
						if (uni.getStorageSync("language") == 'en') {
							title = this.v2DetailInfo.project_type_en + ": " + this.v2DetailInfo.project_name_en
							desc = "Project shared by Asialand - " + uni.getStorageSync("userInfo").user_info.first_name + " " + uni.getStorageSync(
								"userInfo").user_info.last_name
						} else {
							title = this.v2DetailInfo.project_type_cn + ": " + (this.v2DetailInfo.project_name_cn != "" ? this.v2DetailInfo.project_name_cn : this.v2DetailInfo.project_name_en)
							desc = "由 Asialand - " + uni.getStorageSync("userInfo").user_info.first_name + " " + uni.getStorageSync("userInfo").user_info.last_name + "为您分享"

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
						imageUrl: this.v2DetailInfo.image.properties.cos_prefix + this.v2DetailInfo.image.contents[0].relative_url + this.v2DetailInfo.image.properties.ci_surfix + this.v2DetailInfo.image.properties.ci_thumb +  this.v2DetailInfo.image.properties.ci_quality,
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
			},
			copyDes() {
				uni.setClipboardData({
					data: this.isEnglish ? (this.v2DetailInfo.descriptions.full_des_en == undefined ? '' : this.v2DetailInfo.descriptions.full_des_en) : this.desCn, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							icon: 'none',
							title: this.$t('Copy Success')
						})
					}
				});

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

	.copy-icon {
		width: 32upx;
		height: 32upx;
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
	
	
	.item{
		line-height:80upx;
		padding-left:30upx;
	}
	.back-gray{
		background-color: #f8f8f8;
	}
</style>
