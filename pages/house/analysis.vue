<template>
	<view class="flex column w-100">
		<view class="header">
			<text class="font-size-big white uni-bold m-l-15" style="text-shadow: 1px 2px 2px black;">{{$t('Project Investment Anaysis')}}</text>
			<text class="font-size-small white m-l-15" style="text-shadow: 1px 2px 3px black;">{{name}}</text>
		</view>
		<view class="flex column p-l-15 p-r-15">
			<!-- <view class="top_label column flex flex-start m-t-20" style="align-items: flex-start !important;">
				<text>{{$t('Unit Pricing Anaysis')}}</text>	
			</view>
			<view class="swiper_header flex row m-l-10 m-t-20 m-b-10">
				<view class="flex column" @click="unitTypeChange(0)">
					<text :class="unitPos == 0? 'uni-bold font-gray' : 'font-normal font-gray'">{{$t('Best Value')}}</text>
					<view v-if="unitPos ==0" class="bar"></view>
				</view>
				<view class="flex column m-l-20"  @click="unitTypeChange(1)">
					<text :class="unitPos == 1? 'uni-bold font-gray' : 'font-normal font-gray'">{{$t('Lowest Price')}}</text>
					<view v-if="unitPos ==1" class="bar"></view>
				</view>
			</view>
			<swiper v-if="unitArray != undefined" class="unit-swiper m-t-0" :current="unitPos"  @change="unitChange" :style="unitArray.length > 0 ? 'height:' + (unitArray.length * 320) + 'upx' : 'height:400upx'">
				<swiper-item v-if="unitArray != undefined" :style="unitArray.length > 0 ? 'height:' + (unitArray.length * 320) + 'upx' : 'height:400upx'">
					<view class="flex column swiper_item align-center space-between" >					
						<view class="flex column align-center m-t-10 unit-item" v-for="(item,index) in unitArray" :key="index" @click="gotoUnitDetail(item.hash)">
							<view class="flex row space-between w-100 m-b-10">
								<view class="flex column">
									<text class="uni-bold font-gray">{{item.unit_number}}</text>
									<view class="bar"></view>
								</view>
								<view class="flex row align-center">
									<view class="circle_mark" :class="item.sales_status == '2' ? 'back_green' : item.sales_status == '3' ? 'back_yellow' : 'back_red' "></view>
									<text class="uni-bold m-l-10" :class="item.sales_status == '2' ? 'col_green' : item.sales_status == '3' ? 'col_yellow' : 'col_red'">{{item.sales_status == '2' ? $t('Available') : item.sales_status == '3' ? $t('Reserved') : $t('Sold')}}</text>
								</view>
							</view>
							
							<view class="w-100">
								<image src="/static/img/home_plan.png" class="plan m-r-10" style="float:left;"/>
								<view class="flex column m-l-20">
									<text class="font-size-normal uni-bold font-gray">{{$t("Price")}}:{{" " + item.price_total}}</text>
									<text class="font-size-normal uni-bold font-gray">{{item.spec_bed}}{{" " + $t("Bed")}} {{item.spec_bath}}{{" " + $t("Bath")}} </text>
									<view class="flex row" style="flex-flow:wrap">
										<text class="font-size-small font-gray line-one m-r-10" >{{$t('Land Size')}} : {{item.size_land}}{{item.size_land == null || item.size_land == undefined || item.size_land == '' ? '' : item.size_unit}}</text>
										<text class="font-size-small font-gray  line-one" >{{$t('House Size')}} : {{item.size_house_design}}{{item.size_unit}}</text>
									</view>
								</view>
							</view>						
						</view>
					</view>
				</swiper-item>
				<swiper-item v-if="unitLowestArray != undefined" :style="unitLowestArray.length > 0 ? 'height:' + (unitLowestArray.length * 290 + 40) + 'upx' : 'height:400upx'">
					<view class="flex column swiper_item align-center space-between">
						<view class="flex column align-center m-t-10 unit-item" v-for="(item,index) in unitLowestArray" :key="index" @click="gotoUnitDetail(item.hash)">
							<view class="flex row space-between w-100 m-b-10">
								<view class="flex column">
									<text class="uni-bold font-gray">{{item.unit_number}}</text>
									<view class="bar"></view>
								</view>
								<view class="flex row align-center">
									<view class="circle_mark" :class="item.sales_status == '2' ? 'back_green' : item.sales_status == '3' ? 'back_yellow' : 'back_red' "></view>
									<text class="uni-bold m-l-10" :class="item.sales_status == '2' ? 'col_green' : item.sales_status == '3' ? 'col_yellow' : 'col_red'">{{item.sales_status == '2' ? $t('Available') : item.sales_status == '3' ? $t('Reserved') : $t('Sold')}}</text>
								</view>
							</view>
							
							<view class="w-100">
								<image src="/static/img/home_plan.png" class="plan m-r-10" style="float:left;"/>
								<view class="flex column m-l-20">
									<text class="font-size-normal uni-bold font-gray">{{$t("Price")}}:{{" " + item.price_total}}</text>
									<text class="font-size-normal uni-bold font-gray">{{item.spec_bed}}{{$t("Bed")}} {{item.spec_bath}}{{$t("Bath")}} </text>
									<view class="flex row">
										<text class="font-size-small font-gray line-one" >{{$t('Land Size')}} : {{item.size_land}}{{item.size_unit}}</text>
										<text class="font-size-small font-gray m-l-10 line-one" >{{$t('House Size')}} : {{item.size_house_design}}{{item.size_unit}}</text>
									</view>
								</view>
							</view>					
						</view>
					</view>
				</swiper-item>
			</swiper> -->
			
			<view class="top_label column flex flex-start m-t-30" style="align-items: flex-start !important;">
				<text>{{$t('Country Analysis')}}</text>	
			</view>
			<view class="swiper_header flex row m-l-10 m-t-20">
				<view v-if="info!= undefined && info.house_price != undefined" class="flex column" :class="index != firstCountryId? 'm-l-20' : ''"  v-for="(item,index) in info.house_price" :key="index" @click="countryChange(index)">
					<text :class="countryPos == index? 'uni-bold font-gray' : 'font-normal font-gray'">{{index}}</text>
					<view v-if="countryPos ==index" class="bar"></view>
				</view>
			</view>
			<view class="w-100">
				<view class="qiun-charts w-100" >
					<!-- #ifdef APP-PLUS || H5 -->
					<view @click="echarts.onClick" :prop="countryOption" :change:prop="echarts.updateCountryEcharts" id="countryChart" class="echarts"></view>
					<!-- #endif -->
				</view>
			</view>
			
			<view class="top_label column flex flex-start m-t-30" style="align-items: flex-start !important;">
				<text>{{$t('Surburb Sales And Rentals Summary')}}</text>	
			</view>
			
			<view class="swiper_header flex row m-l-5 m-t-20">
				<view v-if="houseTypeArray != undefined" class="flex column" :class="index != 0? 'm-l-20' : ''"  v-for="(item,index) in houseTypeArray" :key="index" @click="surbubChange(index)">
					<text :class="surburbPos == index? 'uni-bold font-gray' : 'font-normal font-gray'">{{item.name}}</text>
					<view v-if="surburbPos ==index" class="bar"></view>
				</view>
			</view>
			<view class="w-100">
				<view class="qiun-charts w-100" >
					<!-- #ifdef APP-PLUS || H5 -->
					<view @click="echarts.onClick" :prop="surburbOption" :change:prop="echarts.updateSurburbEcharts" id="surburbChart" class="echarts"></view>
					<!-- #endif -->
				</view>
			</view>
			
			<!-- <view class="top_label column flex flex-start m-t-30" style="align-items: flex-start !important;">
				<text>{{$t('Current Rental Listings')}}</text>	
			</view>
			
			<view class="swiper_header flex row m-l-5 m-t-20 m-b-10">
				<view v-if="houseTypeArray != undefined" class="flex column" :class="index != 0? 'm-l-20' : ''"  v-for="(item,index) in houseTypeArray" :key="index"  @click="rentalChange(index)">
					<text :class="typePos == index? 'uni-bold font-gray' : 'font-normal font-gray'">{{item.name}}</text>
					<view v-if="typePos ==index" class="bar"></view>
				</view>
			</view>
			<swiper v-if="houseTypeChange != undefined" class="unit-swiper m-t-0" :current="typePos"  @change="houseTypeChange" :style="houseArray.length > 0 ? 'height:' + houseArray.length * 200 + 'upx' : 'height:900upx'">
				<swiper-item v-if="houseArray != undefined" :style="houseArray.length > 0 ? 'height:' + houseArray.length * 200 + 'upx' : 'height:900upx'">
					<view class="house-item"  v-for="(item,indexs) in houseArray" :key="indexs">
						<view class="flex row space-between m-t-10 align-center">
							<view class="flex row align-center">
								<image :src="item.cover_photo + '/format/webp/quality/50'" class="house_img"></image>
								<view class="flex column m-l-10" style="width:320upx;">
									<text class="font-size-normal uni-bold line-one">{{item.advertiser_name}}</text>
									<text class="font-size-small line-one ">{{item.title}}</text>
									<text class="font-size-small ">{{item.bedrooms}}{{" " + $t("Bed")}}  {{item.bathrooms}}{{" " + $t("Bath")}} {{item.carspaces}}{{" " + $t("Car")}}</text>
								</view>
							</view>
							<text class="font-size-normal uni-bold m-r-10" style="text-align: right;">{{item.price}}</text>
						</view>
					</view>
				</swiper-item>
				<swiper-item v-if="apartArray != undefined">
					<view class="house-item"  v-for="(item,indexs) in apartArray" :key="indexs">
						<view class="flex row space-between m-t-10 align-center">
							<view class="flex row align-center">
								<image :src="item.cover_photo + '/format/webp/quality/50'" class="house_img"></image>
								<view class="flex column m-l-10" style="width:320upx;">
									<text class="font-size-normal uni-bold line-one">{{item.advertiser_name}}</text>
									<text class="font-size-small line-one">{{item.title}}</text>
									<text class="font-size-small ">{{item.bedrooms}}{{" " + $t("Bed")}}  {{item.bathrooms}}{{" " + $t("Bath")}} {{item.carspaces}}{{" " + $t("Car")}}</text>
								</view>
							</view>
							<text class="font-size-normal uni-bold m-r-10" style="text-align: right;">{{item.price}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>-->
		</view> 
	</view>	
</template>

<script>
	import apiUrl from "../../common/apiUrl.js"
	import common from "../../common/common.js"
	import uCharts from '@/components/u-charts/u-charts.js';
	
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	
	var canvaLineA=null;
	var canvaLineB = null;
	let surburbChart = null, countryChart = null;
	export default {
		data() {
			return {
				countryOption: {
					tooltip: {},
					legend: {
						data: []
					},
					xAxis: {
						data: []
					},
					yAxis: [{
						type: 'value',
						axisLabel: {
							formatter: function (value, index) {
								if(uni.getStorageSync("language") == "en") {
									return value > 10000 ? "$" + (value / 1000000).toFixed(3) + "M" : value > 1000 ? "$" + (value / 1000).toFixed(0) + "K" : "$" + value .toFixed(0) + "K"
								}
								else {
									return value > 10000 ? (value / 10000).toFixed(1) + this.$t("Million") : value.toFixed(0) + "元" 
								}
							}
						},
						axisLine: {
							lineStyle: {
								color: '#666'
							}
						},
						gridIndex: 0,
					}],
					series: [{
						name: '',
						type: 'line',
						data: []
					}]
				},
				surburbOption: {
					tooltip: {},
					legend: {
						data: []
					},
					xAxis: {
						data: []
					},
					yAxis: [{
						type: 'value',
						axisLabel: {
							formatter: function (value, index) {
								if(uni.getStorageSync("language") == "en") {
									return value > 1000000 ? "$" + (value / 1000000).toFixed(3) + "M" : value > 1000 ? "$" + (value / 1000).toFixed(1) + "K" : "$" + value.toFixed(0) + "K"
								}
								else {
									return value > 10000 ? (value / 10000).toFixed(1) + this.$t("Million") : value.toFixed(0) + "元" 
								}
							}
						},
						axisLine: {
							lineStyle: {
								color: '#666'
							}
						},
						gridIndex: 0,
					}],
					series: [{
						name: '',
						type: 'line',
						data: []
					}]
				},
				hash:'',
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				info:{},
				firstCountryId:'',
				unitPos:0,
				typePos:0,
				countryPos:'',
				surburbPos:'',
				name:'16 Dover St, Oakleigh East VIC',
				counrtyArray:[
					{
						name:'Australia'
					},
					{
						name:'Melbourne'
					}
				],
				houseTypeArray:[
					{
						name:'House'
					},
					{
						name:'Apartment'
					}
				],
				houseArray:[],
				apartArray:[],
				unitArray:[],
				unitLowestArray:[],
				deepList:[],
				
			}
		},
		onLoad(option) {
			this.hash = option.hash
			this.name = option.name
			// this.hash = "HCPP-DGUygntgGK"
			this.getInfo()
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Property Analyse")
			});
		},
		methods:{
			gotoDetail(hash){
				uni.navigateTo({
					url: '../house/detail?hash=' + hash
				});
			},
			unitChange(e){
				this.unitPos = e.detail.current
			},
			houseTypeChange(e){
				this.typePos = e.detail.current
			},
			gotoUnitDetail(hash){
				uni.navigateTo({
					url:"/pages/unit/detail?hash=" + hash
				})
			},
			countryChange(index){
				this.countryPos = index
				let LineA={categories:[],series:[], legend:[],name:''};
				var xData = [], yData = []
				
				var data = this.info.house_price[index]
				for(var i = 0; i < data.length; i++) {
					xData.push(data[i].year)
					yData.push(data[i].medianSoldPrice)
				}
				
				LineA.name = index
				LineA.legend.push(index)
				LineA.series = yData		
				LineA.categories = xData
				this.showLineA(LineA);
			},
			
			surbubChange(index) {
				this.surburbPos = index
				if(index == 0) {
					if(this.info.deep_analysi.house != null && this.info.deep_analysi.house != undefined) {
						var keys = Object.keys(this.info.deep_analysi.house);
						var xData = []
						let LineA={categories:[],series:[],legend:[]};
						
						for(var i = 0; i < keys.length; i++) {
							var yData = []
							xData = []
							var data = this.info.deep_analysi.house[keys[i]].lists
							for(var sub_i = 0; sub_i < data.length; sub_i++) {
								xData.push(data[sub_i].year)
								yData.push(data[sub_i].medianSoldPrice)
							}
							LineA.series.push({"data":yData,"name": this.info.deep_analysi.house[keys[i]].bedrooms + this.$t("Bed"),"type": 'line'});
							LineA.legend.push(this.info.deep_analysi.house[keys[i]].bedrooms + this.$t("Bed"))
						}
						
						LineA.categories = xData	
						this.showLineB(LineA);	
					}					
				}
				else {
					if(this.info.deep_analysi.unit != null && this.info.deep_analysi.unit != undefined) {
						var keys = Object.keys(this.info.deep_analysi.unit);
						let LineA={categories:[],series:[],legend:[]};
						
						for(var i = 0; i < keys.length; i++) {
							var xData = [], yData = []
							
							var data = this.info.deep_analysi.unit[keys[i]].lists
							for(var sub_i = 0; sub_i < data.length; sub_i++) {
								xData.push(data[sub_i].year)
								yData.push(data[sub_i].medianSoldPrice)
							}
							LineA.series.push({"data":yData,"name": this.info.deep_analysi.unit[keys[i]].bedrooms + this.$t("Bed"),"type": 'line'});		
							LineA.legend.push(this.info.deep_analysi.unit[keys[i]].bedrooms + this.$t("Bed"))
						}
						
						LineA.categories=xData;										
						this.showLineB(LineA);	
					}					
				}				
			},			
			getInfo() {
				var that = this
				showLoading(this.$t("Loading"))
				
				uni.request({
					url: apiUrl.deepAnalysis, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						hash: this.hash
					},
					success: (res) => {
						hideLoading()
			
						if(res.data.code == 0) {
							that.info = res.data.data
							that.unitArray = res.data.data.unit_price;
							that.unitLowestArray = res.data.data.unit_lowest_price;
							
							if(uni.getStorageSync("language") == "en") {
								for(var i = 0; i < that.unitArray.length; i++) {
									that.unitArray[i].price_total = "$" + common.currency(that.unitArray[i].price_total);
									// that.unitArray[i].price_total = "$" + (that.unitArray[i].price_total / 1000000).toFixed(3).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + "M"
								}
								for(var i = 0; i < that.unitLowestArray.length; i++) {
									that.unitLowestArray[i].price_total = "$" + common.currency(that.unitLowestArray[i].price_total);
									// that.unitLowestArray[i].price_total = "$" + (that.unitLowestArray[i].price_total / 1000000).toFixed(3).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + "M"
								}
							}
							else {
								for(var i = 0; i < that.unitArray.length; i++) {
									that.unitArray[i].price_total = "$" + common.currency(that.unitArray[i].price_total);
									// that.unitArray[i].price_total = (that.unitArray[i].price_total / 10000).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + that.$t("Million") 
									
								}
								for(var i = 0; i < that.unitLowestArray.length; i++) {
									that.unitLowestArray[i].price_total = "$" + common.currency(that.unitLowestArray[i].price_total);
									// that.unitLowestArray[i].price_total = (that.unitLowestArray[i].price_total / 10000).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + that.$t("Million") 
								}
							}
							
							var keys = Object.keys( res.data.data.house_price );
							that.firstCountryId = keys[0]
							that.countryPos = that.firstCountryId
							that.countryChange(that.firstCountryId)
							that.surbubChange(0)
							
							var houseList = res.data.data.rent.house
							var unitList = res.data.data.rent.unit
							
							for(var i = 0; i < houseList.length; i++) {
								if(uni.getStorageSync("language") == "en") {
									// if(houseList[i].price > 1000) {
									// 	houseList[i].price = "$" + houseList[i].price / 1000 + "M"
									// }
									// else {
									// 	houseList[i].price = "$" + houseList[i].price + "K"
									// }
									houseList[i].price = "$" + common.currency(houseList[i].price)
								}
								else {
									houseList[i].price = "$" + common.currency(houseList[i].price)
									//houseList[i].price = houseList[i].price + this.$t("Million")
								}
								that.houseArray.push(houseList[i])
							}
							
							for(var i = 0; i < unitList.length; i++) {
								if(uni.getStorageSync("language") == "en") {
									// if(unitList[i].price > 1000) {
									// 	unitList[i].price = "$" + unitList[i].price / 1000 + "M"
									// }
									// else {
									// 	unitList[i].price = "$" + unitList[i].price + "K"
									// }
									unitList[i].price = "$" +  common.currency(unitList[i].price)
								}
								else {
									//unitList[i].price = unitList[i].price + this.$t("Million")
									unitList[i].price = "$" +  common.currency(unitList[i].price)
								}
								that.apartArray.push(unitList[i])
								
							}
						}
					}
				});
			},
			showLineA(chartData){
				var that = this
				var option =  {
					tooltip: {
						trigger: 'axis',
						formatter: "{a} {b} : {c} "
					},
					legend: {
						data: chartData.legend
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: chartData.categories
					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							formatter: function (value, index) {
								if(uni.getStorageSync("language") == "en") {
									return value > 1000 ? "$" + (value / 1000).toFixed(1) + "K" : "$" + value.toFixed(0) + "K"
								}
								else {
									return value > 10000 ? (value / 10000).toFixed(1) + that.$t("Million") : value.toFixed(0) + "元" 
								}
							}
						},
						axisLine: {
							lineStyle: {
								color: '#666'
							}
						},
						gridIndex: 0,
					}],
					calculable: true,
					grid: {
					    left: '3%',
					    right: '4%',
						containLabel: true
				    },
					dataZoom : {
						show : true,
						realtime : true,
						start : 30,
						end : 70
					},
					series: [{
						data:chartData.series,
						name:chartData.name,
						type: 'line',
					}],
					
				};
				this.countryOption = option
				//countryChart.setOption(option)
				//this.$refs.countryChart.setChart(countryChart);
				
			},
			showLineB(chartData){
				var that = this
				var option =  {
					tooltip: {
						trigger: 'axis',
					},
					legend: {
						data: chartData.legend,
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: chartData.categories
					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							formatter: function (value, index) {
								if(uni.getStorageSync("language") == "en") {
									return value > 1000 ? "$" + (value / 1000).toFixed(1) + "K" : "$" + value.toFixed(0) + "K"
								}
								else {
									return value > 10000 ? (value / 10000).toFixed(1) + that.$t("Million") : value.toFixed(0) + "元" 
								}
							}
						},
						axisLine: {
							lineStyle: {
								color: '#666'
							}
						},
						gridIndex: 0,
					}],
					calculable: true,
					grid: {
					    left: '3%',
					    right: '4%',
						containLabel: true
				    },
					dataZoom : {
						show : true,
						realtime : true,
						start : 0,
						end : 70
					},
					series:chartData.series,
				};
				this.surburbOption = option
				
				//surburbChart.setOption(option)
				//this.$refs.surburbChart.setChart(surburbChart);
			},
			
			// initSurburbChat(e) {
			// 	let {
			// 		canvas,
			// 		width,
			// 		height
			// 	} = e;
			// 	width = width - 20;
			// 	//let canvas = this.$refs.pieChart.canvas;
			// 	echarts.setCanvasCreator(() => canvas);
			// 	 surburbChart = echarts.init(canvas, null, {
			// 		width: "310",
			// 		height: "280"
			// 	})
			// 	canvas.setChart(surburbChart)
			// 	surburbChart.setOption(this.getOptions(50, 10));
			// 	this.$refs.surburbChart.setChart(surburbChart); 
			// 	//return chart
			// },
			// initCountryChart(e) {
			// 	let {
			// 		canvas,
			// 		width,
			// 		height
			// 	} = e;
			// 	width = width - 20;
			// 	//let canvas = this.$refs.pieChart.canvas;
			// 	echarts.setCanvasCreator(() => canvas);
			// 	countryChart = echarts.init(canvas, null, {
			// 		width: "310",
			// 		height: "280"
			// 	})
			// 	canvas.setChart(countryChart)
			// 	countryChart.setOption(this.getOptions(50, 10));  
			// 	this.$refs.countryChart.setChart(countryChart);  
			// 	//return chart
			// },
		}
	}
</script>

<script module="echarts" lang="renderjs">
	let countryChart,surburbChart
	export default {
		mounted() {
			if (typeof window.echarts === 'function') {
				this.initCountryEcharts()
				//this.initSurburbEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				script.src = 'static/echarts.js'
				script.onload = this.initCountryEcharts.bind(this)
				document.head.appendChild(script)
			}
		},
		methods: {
			initCountryEcharts() {
				countryChart = echarts.init(document.getElementById('countryChart'))
				// 观测更新的数据在 view 层可以直接访问到
				countryChart.setOption(this.countryOption)
				
				surburbChart = echarts.init(document.getElementById('surburbChart'))
				surburbChart.setOption(this.surburbOption)
			},
			// initSurburbEcharts() {
			// 	surburbChart = echarts.init(document.getElementById('surburbChart'))
			// 	// 观测更新的数据在 view 层可以直接访问到
			// 	surburbChart.setOption(this.surburbOption)
			// },
			updateCountryEcharts(newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
				countryChart.setOption(newValue)
			},
			updateSurburbEcharts(newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
				surburbChart.setOption(newValue)
			},
			onClick(event, ownerInstance) {
				// 调用 service 层的方法
				ownerInstance.callMethod('onViewClick', {
					test: 'test'
				})
			},
			rentalChange(index){
				this.typePos = index
			},
			unitTypeChange(index){
				this.unitPos = index
			}
		}
	}
</script>
<style>
	.header{
		width:100%;
		height:120upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-image: url(../../static/img/home1.png);
		background-size: 100% 1000%;
		color:white;
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
	
	.content {
		width:100%;
		background: white;
	}
	
	.plan{
		width:150upx;
		height:150upx;
	}
	
	.bar{
		width: 50upx;
		height: 6upx;
		background-color: rgba(217, 192, 119, 100);
		text-align: center;
		border-radius: 2upx;
	}
	
	.unit-item {
		border: 1px solid rgba(217, 192, 119, 100);
		padding:20upx;
		width:100%;
		margin:10upx 20upx;
	}
	
	.col_green{
		color:#52C41A;
	}
	
	.col_yellow{
		color:#FADB14;
	}
	
	.col_red{
		color:#E33005;
	}
	
	.circle_mark{
		width: 20upx;
		height: 20upx;
		border-radius: 20upx;		
	}
	
	.back_green{
		background-color: #52C41A;
	}
	
	.back_yellow{
		background-color: #FADB14;
	}
	
	.back_red{
		background-color: #E33005;
	}
	
	.swiper_item{
		width:100%;
	}
	
	.qiun-charts {
		width: 100%;
		height: 300px;
		background-color: #FFFFFF;
		margin-top:20upx;
	}
	
	.charts {
		width: 100%;
		height: 500upx;
		background-color: #FFFFFF;
	}
	
	.house-item{
		background-color: #F8F8F8 ;
		width:100%;
	}
	
	.house_img{
		width: 200upx;
		height: 160upx;
	}
	
	.ec-canvas {
		display: flex;
		height: 100%;
		flex: 1;
	}

	.canvasView {
		width: 700upx;
		height: 500upx;
	}
		
	.echarts {
		width: 100%;
		height: 300px;
	}
</style>
