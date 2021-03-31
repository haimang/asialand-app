<template>
	<view class="content">
		<view class="top flex column">
			<view class="header flex row">
				<image class="logo m-l-10" src="/static/img/logo_icon.png" mode="widthFix"></image>
				<input class="font-size-normal font-gray w-100 m-l-10" v-model="searchWord" :placeholder="$t('Fill in with surburb name or post code')"></input>
			</view>
			<text class="font-size-small font-xGray m-t-10 m-b-20">{{$t("Your may also select following criteria:")}}</text>
			<text class="font-size-normal font-gray uni-bold m-b-10">{{$t('Property Type')}}</text>
			
			<view class="flex row" style="margin-left:-10px;">
				<view class="status_item flex column align-center justify-center" @click="selectType(0)">
					<view class="mark uni-bold back-black" :class="type.length == 0? 'selected' : ''">{{$t('ALL')}}</view>
					<text class="font-size-small font-xGray m-t-5 line-height-1" :class="type.length == 0 ? 'selected_txt' : ''">{{$t('All Types')}}</text>
				</view>
				<view class="status_item flex column align-center justify-center m-l-10" @click="selectType(3)">
					<view class="mark" :class="type.length > 0 && type.includes(3) ? 'selected' : ''">
						<image src="/static/img/icon_townhouse.png" mode="widthFix" class="icon"/>
					</view>
					<text class="font-size-small font-xGray m-t-5 text-center line-height-1" :class="type.length > 0 && type.includes(3)  ? 'selected_txt' : ''">{{$t('Townhouse')}}</text>
				</view>
				<view class="status_item flex column align-center justify-center m-l-10" @click="selectType(25)">
					<view class="mark" :class="type.length > 0 && type.includes(25) ? 'selected' : ''">
						<image src="/static/img/icon_house.png" mode="widthFix" class="icon"/>
					</view>
					<text class="font-size-small font-xGray m-t-5 text-center line-height-1" :class="type.length > 0 && type.includes(25)  ? 'selected_txt' : ''">{{$t('House & Land')}}</text>
				</view>
				
				<view class="status_item flex column align-center justify-center m-l-10" @click="selectType(1)">
					<view class="mark" :class="type.length > 0 && type.includes(1)  ? 'selected' : ''">
						<image src="/static/img/icon_apartment.png" mode="widthFix" class="icon"/>
					</view>
					<text class="font-size-small font-xGray m-t-5 text-center line-height-1" :class="type.length > 0 && type.includes(1) ? 'selected_txt' : ''">{{$t('Apartment')}}</text>
				</view>
			</view>
			<text class="font-size-normal font-gray uni-bold m-t-30 m-b-10">{{$t('Property Status')}}</text>
			<view class="flex row" style="margin-left:-10px;">
				<view class="status_item flex column align-center justify-center"  @click="selectStatus(0)">
					<view class="mark uni-bold back-black" :class="status == 0 ? 'selected' : ''">{{$t('ALL')}}</view>
					<text class="font-size-small font-xGray m-t-5 text-center line-height-1" :class="status == 0 ? 'selected_txt' : ''">{{$t('All Status')}}</text>
				</view>
				<view class="status_item flex column align-center justify-center m-l-10"  @click="selectStatus(2)">
					<view class="mark" :class="status == 2 ? 'selected' : ''">
						<image src="/static/img/fa-battery-quarter.png" mode="widthFix" class="icon"/>
					</view>
					<text class="font-size-small font-xGray m-t-5 text-center line-height-1" :class="status == 2 ? 'selected_txt' : ''">{{$t('Off-the-plan')}}</text>
				</view>
				<view class="status_item flex column align-center justify-center m-l-10"  @click="selectStatus(3)">
					<view class="mark" :class="status == 3 ? 'selected' : ''">
						<image src="/static/img/fa-battery-half.png" mode="widthFix" class="icon"/>
					</view>
					<text class="font-size-small font-xGray m-t-5 text-center line-height-1" :class="status == 3 ? 'selected_txt' : ''">{{$t('Under Construction')}}</text>
				</view>
				<view class="status_item flex column align-center justify-center m-l-10"  @click="selectStatus(1)">
					<view class="mark" :class="status == 1 ? 'selected' : ''">
						<image src="/static/img/fa-battery-full.png" mode="widthFix" class="icon"/>
					</view>
					<text class="font-size-small font-xGray m-t-5 text-center line-height-1" :class="status == 1 ? 'selected_txt' : ''">{{$t('Newly Established')}}</text>
				</view>
			</view>
			<text class="font-size-normal font-gray uni-bold m-t-30">{{$t('Starting Price Range') + " (" + this.rangeMin + " - " + this.rangeMax + ")"}}</text>
			<view class="w-100 m-r-10 m-l-10 fit-width" >
				<RangeSlider
					:width="slideWidth"
					:height="slideHeight"
					:blockSize="slideBlockSize"
					:min="slideMin"
					:max="slideMax"
					:values="rangeValues"
					:step="step"
					:liveMode="isLiveMode"
					:bar-height="barHeight"
					active-color="#d9c077"
					@rangechange="onRangeChange">				
					<view slot="minBlock" class="range-slider-block"></view>
					<!-- 左边滑块的内容 -->
					<view slot="maxBlock" class="range-slider-block"></view>
					<!-- 右边滑块的内容 -->
				</RangeSlider>
			</view>
			<button class="login-btn m-t-20 m-b-20 m-l-0" @tap="bindSearch">
				<image src="/static/img/fa-search.png" class="m-r-5" style="width:40upx;height:40upx;"/>{{$t("Search Properties")}}
			</button>
		</view>
		
		<view class="flex column" id="footer">
			<image class="map_image" src="https://image.maps.api.here.com/mia/1.6/mapview?app_id=rLH3gcQKZ8FDUWfBfckJ&app_code=CWWgJNAXJhCrQcLm4rsUWg&lat=39.909&lon=116.39742&vt=0&z=14&w=700&h=500"></image>
			<text class="text m-l-20 " style="text-shadow: 1px 3px 2px black;">{{text1}}</text>
			<button class="login-btn m-t-20 m-b-20 m-l-20 flex row"  @tap="gotoMap">
				<image src="/static/img/fa-location-arrow.png" class="m-r-5" style="width:40upx;height:40upx;" mode="widthFix"></image>{{$t("Open Property Map")}}
			</button>
		</view>
	</view>
</template>

<script>
	import RangeSlider from '../../components/range-slider/range-slider.vue'
	import common from '../../common/common.js'
	
	export default {
		components:{
			RangeSlider
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Search")
			});
		},
		data() {
			return {
				rangeMin:'',
				rangeMax:'',
				rangeValues: [300000, 5000000],
				slideWidth: 640,
				slideHeight: 80,
				slideBlockSize: 40,
				slideMin: 300000,
				slideMax: 5000000,
				barHeight:10,
				isLiveMode: true,
				step: 1000,
				//
				timeMinValue: 300000,
				timeMaxValue: 5000000,
				rangeValues2: [300000, 5000000],
				serTime: '02:24:00-14:24:00',
				rangeValues3: [300000, 5000000],
				text1:"Or Discover Asialand 34 properties",
				type:[],
				status:0,
				searchWord:'',
				propertyCnt: 0
			}
		},
		onLoad(option) {
			if(uni.getStorageSync("language") == "en") {
				this.rangeMin = "$300,000" 
				this.rangeMax = "$5,000,000"
			}
			else {
				// this.rangeMin = "30" + this.$t("Million")
				// this.rangeMax= "500" + this.$t("Million")
				this.rangeMin = "$300,000"
				this.rangeMax = "$5,000,000"
			}
			
			this.propertyCnt = uni.getStorageSync("property_cnt");
			this.text1 = this.$t("Or Discover Asialand") + " " + this.propertyCnt + " " + this.$t("properties")
 		},
		methods:{
			pad: function(num, n) {
				return Array(n - ('' + num).length + 1).join(0) + num;
			},
			gotoMap(){
				var typeStr = ""
				for(var i = 0; i < this.type.length; i++) {
					typeStr = this.type[i] 
					if(i < this.type.length) {
						typeStr += ","
					}
				}
				
				uni.navigateTo({
					url:"../map/search_map?type=" + typeStr + "&keyword=" + this.searchWord + "&rangeMin=" +  (this.rangeValues[0] / 10000).toFixed(2) + "&rangeMax=" + (this.rangeValues[1] / 10000).toFixed(2) + "&status=" + this.status
				})
			},
			selectType(type_id){
				if(type_id == 0) {
					this.type = []
				}
				else {
					if(this.type.includes(type_id)){
						this.type.splice(this.type.indexOf(type_id),1)
					}
					else {
						this.type.push(type_id)
					}	
				}				
				console.log(JSON.stringify(this.type))
			},
			selectStatus(status_id){
				this.status = status_id
			},
			formatMoney(number, decPlaces, decSep, thouSep) {
				decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
				decSep = typeof decSep === "undefined" ? "." : decSep;
				thouSep = typeof thouSep === "undefined" ? "," : thouSep;
				var sign = number < 0 ? "-" : "";
				var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
				var j = (j = i.length) > 3 ? j % 3 : 0;
				
				return sign + (j ? i.substr(0, j) + thouSep : "") + i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
					(decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
			},
			onRangeChange: function(e) {
				this.rangeValues = [e.minValue, e.maxValue];
				if(uni.getStorageSync("language") == "en") {
					// var formatter = Intl.NumberFormat('en-US', {
					// 	style: 'currency',
					// 	currency: 'USD',
					// 	minimumFractionDigits:0,
					// 	maximumFractionDigits:0});
					e.minValue = e.minValue + ".0"
					e.maxValue = e.maxValue + ".0"
					this.rangeMin = '$' + common.currency(e.minValue)
					this.rangeMax = '$' + common.currency(e.maxValue)
					// this.rangeMin = '$' + e.minValue.replace(/\d(?=(\d{3})+\.)/g, '$&,'); //(e.minValue / 1000).toFixed(2) + "K"
					// this.rangeMin = this.rangeMin.substring(0, this.rangeMin.indexOf("."))
					// this.rangeMax = '$' + e.maxValue.replace(/\d(?=(\d{3})+\.)/g, '$&,'); //e.maxValue / 1000).toFixed(2) + "K"
					// this.rangeMax = this.rangeMax.substring(0, this.rangeMax.indexOf("."))
				}
				else {
					this.rangeMin = '$' + common.currency(e.minValue)
					this.rangeMax = '$' + common.currency(e.maxValue)
					// this.rangeMin = (e.minValue / 10000).toFixed(2) + this.$t("Million")
					// this.rangeMax = (e.maxValue / 10000).toFixed(2) + this.$t("Million")
				}
				console.log(this.rangeValues)
			},
			test: function() {
				this.rangeValues = [4.2, 6.6];
			},
			onRangeChange2: function(e) {
				let startTime = this.formatTimeBySliderValue(e.originalValue.minValue);
				let endTime = this.formatTimeBySliderValue(e.originalValue.maxValue);
				this.serTime = startTime + '-' + endTime;
			},
			onRangeChange3: function(e) {
				this.rangeValues3 = [e.minValue, e.maxValue];
			},
			formatTimeBySliderValue(value) {
				//按比例，将滑块上面的数值进行转换为时间形式
				//转换为分钟数
				let minutes = (24 * 60 * value) / this.slideMax;
				//转换为小时数
				let hours = parseInt(minutes / 60);
				//剩余分钟数
				let minutes_min = parseInt(minutes % 60);
				return '' + this.pad(hours, 2) + ':' + this.pad(minutes_min, 2) + ':' + '00';
			},
			bindSearch(){
				var typeStr = ""
				for(var i = 0; i < this.type.length; i++) {
					typeStr += this.type[i] 
					if(i < this.type.length) {
						typeStr += ","
					}
				}
				uni.navigateTo({
					url:"/pages/search/result?type=" + typeStr + "&keyword=" + this.searchWord + "&rangeMin=" + (this.rangeValues[0] / 10000).toFixed(2)+ "&rangeMax=" + (this.rangeValues[1] / 10000).toFixed(2) + "&status=" + this.status
				})
			}
		}
	}
	
</script>

<style scoped>
		
	.top{
		width: 100%;
		
		padding:40upx;
		background-color: #f8f8f8;
		box-sizing:border-box;

	}
	.content{
		width:100%;
		padding:0px;
	}
	.mark {
		width: 96upx;
		height: 96upx;
		border-radius: 96upx;
		background-color: rgba(255, 255, 255, 100);
		color: rgba(217, 192, 119, 100);
		text-align: center;
		border: 1px solid rgba(0,0,0,0.1);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.all_mark{
		width: 96upx;
		height: 96upx;
		border-radius: 96upx;
		line-height: 96upx;
		background-color: rgba(0, 0, 0, 1);
		color: rgba(217, 192, 119, 100);
		font-size: 14px;
		text-align: center;
		font-family: Arial;
		border: 1px solid rgba(217, 192, 119, 100);
	}
	
	.icon{
		width: 60upx;
		height:60upx;
	}
	.logo {
		width: 60upx;
		height: 60upx;
	}
	
	.header {
		width: 100%;
		height: 110upx;
		border-radius: 10upx;
		background-color: rgba(255, 255, 255, 100);
		box-shadow: 0px 4upx 24upx -16upx rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 100);
		align-items: center;
	}
	
	.sliderBox {
		justify-content: center;
		margin-right: 50rpx;
	}
	.text-center {
		justify-content: center;
	}
	.rowBox {
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.mrg10T {
		margin-top: 10rpx;
	}
	.tips {
		color: #999;
		font-size: 24rpx;
		text-align: center;
		margin-top: 100rpx;
	}
	.testBtn {
		margin-top: 50rpx;
	}
	.part {
		flex-direction: column;
		justify-content: center;
		border-top: 1rpx solid #ccc;
		padding-top: 50rpx;
		.title {
			font-size: 32rpx;
			padding: 0 30rpx;
		}
	}
	.part2 {
		margin-top: 100rpx;
	}
	.login-btn {
		text-align: left;
		height: 100upx;
		line-height: 100upx;
		border-radius: 10upx;
		background-color: rgba(0, 0, 0, 1);
		color: rgba(217, 192, 119, 100);
		font-size: 32upx;
		font-weight: bold;
		box-shadow: 0px 4upx 12upx 0px rgba(0, 0, 0, 0.4);
		font-family: Arial;
		border: 0px;
		display:flex;
		align-items: center;
	}
	
	#footer{
		width:100%;
		height:450upx;
		justify-content: center;
	}
	
	#footer .map_image{
		width: 100%;
		position: absolute;
	}
	#footer .text{
		color: rgba(255, 255, 255, 100);
		font-size: 18px;
		font-weight:bold;
		text-align: left;
		font-family: PingFangSC-bold;
		z-index:1;
	}

	.selected{
		border: 1px solid rgba(217, 192, 119, 100);	
	}	
	
	.selected_txt{
		color: #D9C077;
	}
	
	.status_item{
		width:90px;
	}
	
	.text-center{
		text-align: center;
	}
	
	.block{
		width:20px;
		height:20px;
	}
	
	.back-black {
		background-color: #000000;
	}
</style>
