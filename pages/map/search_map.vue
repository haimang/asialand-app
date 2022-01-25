<template>
	<!-- <scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto"> -->
	
	<view class="flex column w-100">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">  
			<view class="top_view"></view>  
		</view>  
		<!-- #endif --> 
		<view class="flex column">
			<view class="map-view ">
				<!-- <map id="map" class="map w-100" :scale="scale" :latitude="latitude" :longitude="longitude" @markertap="tapMarker" :markers="markers">
					<cover-view v-if="isClickedMark" class="desc_view" @click="click">
						<cover-view class="flex row">
							<cover-image class="m-l-10" :src="imgUrl" style="width:96upx;height:64upx;"></cover-image>
							<cover-view class="flex column m-l-10" style="text-align: left;">
								<cover-view class="font-size-normal uni-bold">{{address}}</cover-view>
								<cover-view class="font-size-normal font-normal">Starting: {{price}}</cover-view>
							</cover-view>
						</cover-view>
						<cover-view class="next">
							<cover-image src="/static/img/left.png" style="width:32upx;height:32upx;"></cover-image>
						</cover-view>
					</cover-view>
				</map> -->
				<web-view v-if="url != '/static/search-map.html'" :src="url"></web-view>
				 <!--#ifdef APP-PLUS-->
				<!-- <web-view :src="url" @message="onMessage"></web-view> -->
				<!--#endif-->
			</view>
		</view>
	</view>	
</template>

<script>
	import apiUrl from '../../common/apiUrl.js';
	import common from '../../common/common.js';
	export default {
		data() {
			return {
				mapHeight:0,
				screenHeight:0,
				latitude: 27.909,
				keyword:'',
				status:0,
				longitude: 116.39742,
				scale: 7, 
				tabIndex:0,
				price:"A$565,000",
				address:"16 Dover St",
				imgUrl:"/static/img/home1.png",
				isClickedMark:false,
				markers:[],
				url:"/static/search-map.html",
				markArray:[
					{
						id:1,
						latitude: 27.909,
						longitude: 116.39742,
						name:'Balwyn High School'
					}
				],
				type : 0,
				rangeMin : 0,
				rangeMax : 0,
				keyword : '',
				status :''
			}
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Map")
			});
		},
		onLoad(option){
			this.type = option.type
			this.rangeMin = option.rangeMin
			this.rangeMax = option.rangeMax
			this.keyword = option.keyword
			this.status = option.status
			this.search()
			// this.url = this.url + "?type=" + option.type + "&rangeMin=" + option.rangeMin + "&rangeMax=" + option.rangeMax + "&keyword=" + option.keyword +  "&status=" + option.status + "&token="  + uni.getStorageSync("token") + "&language=" + uni.getStorageSync("language")
		},
		methods:{
			setMarkers(){
				let markers = []
				for (var i=0;i< this.markArray.length;i++){
					markers=markers.concat({
						id:this.markArray[i].id,
						iconPath: '/static/img/map_mark.png',
						width:36,
						height:36,
						latitude: this.markArray[i].latitude,//纬度
						longitude: this.markArray[i].longitude,//经度
					})
				}
				this.markers=markers
			},
			tapMarker(e) {
				console.log(e.detail.markerId)
				for(var index in this.markArray) {
					if(this.markArray[index].id == e.detail.markerId) {
						
						this.latitude = this.markArray[index].latitude
						this.longitude = this.markArray[index].longitude
					}
				}
				
				const that = this
				let map = uni.createMapContext('map');
				// map.getCenterLocation({
				// 	success: res => {
						
				// 		that.latitude = res.latitude
				// 		that.longitude = res.longitude

				// 		console.log(that.latitude + " , " + that.longitude)
				// 	},
				// 	fail: () => {
				// 		uni.showToast({
				// 			title: '获取定位失败',
				// 			icon: 'none'
				// 		});
				// 	},
				// 	complete: () => {
				// 	}
				// });
				
				map.moveToLocation({
					longitude:this.longitude,
					latitude:this.latitude
				})

				if(this.isClickedMark) {
					this.isClickedMark = false
				}
				else {
					this.isClickedMark = true
				}
				
			},
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.tabIndex = index
			    this.switchTab(index);
			},
			switchTab(index) {
			},
			search(){
				var that = this
				uni.request({
					url: apiUrl.v2_getPropertyList, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						page: 1,
						pagesize: 10000,	
						scene:"app",
						property_type:that.type,
						price:that.rangeMin + "-" + that.rangeMax,
						keyword:that.keyword,
						country: "1",
						progrress_status:that.status
					},
					success: (res) => {
						uni.stopPullDownRefresh()
						if(res.data.data.properties != null && res.data.data.properties.length > 0 ) {								
							var houseList = [];
							for(var i = 0; i < res.data.data.properties.length; i++) {
								var item = {
									"hash" :res.data.data.properties[i].hash,
									"symbol" : res.data.data.properties[i].price.symbol,
									"price_min" : common.currency(res.data.data.properties[i].price.price_min),
									"price_max" : common.currency(res.data.data.properties[i].price.price_max),
									"address" : res.data.data.properties[i].location[1],
									"image": res.data.data.properties[i].primary_image[0].thumb
								};
								houseList.push(item)
							}
							console.log(houseList);
							
							that.url = that.url + "?houseList=" + JSON.stringify(houseList) + "&language=" + uni.getStorageSync("language")
						} else {
							that.url = that.url + "?houseList=&language=" + uni.getStorageSync("language")
						}
					}
				});
			}
			
		}
	}
</script>

<style>
	.header{
		width: 100%;
		height: 55px;
		background-color: rgba(0, 0, 0, 1);
		box-shadow: 0px 5px 10px -5px rgba(170, 170, 170, 100);
		position:fixed;
		top:0x;
		left:0;
	}
	
	.uni-tab-item{
		justify-content: center;
		align-items: center;
	}
	
	.uni-tab-item-title{
		color: rgba(217, 192, 119, 100);
		font-size: 24upx;
		text-align: left;
		font-family: PingFangSC-regular;
	}
	
	.uni-tab-item-title-active{
		font-weight: bold;
	}
	
	.mark{
		width: 12upx;
		height: 12upx;
		background-color: rgba(217, 192, 119, 100);
		border-radius: 12upx;
		text-align: center;
	}
	
	.map-view{
		width:100%;
		height:100vh;
	}
	
	.map{
		height:100%;
		font-weight: bold;
	}
	
	.desc_view {
		width: 600upx;
		height: 125upx;
		border-radius: 10px 10px 10px 10px;
		color: rgba(16, 16, 16, 100);
		font-size: 14px;
		text-align: center;
		box-shadow: 0px 0px 0px 0px rgba(230, 0, 68, 50);
		font-family: Arial;
		background:white;
		display: flex;
		flex-direct:row;
		align-items: center;
		justify-content: space-between;
		top: 220px;
		position: fixed;
		left: 35px;
	}
	
	
	.next{		
		width: 108upx;
		height: 100%;
		line-height: 20px;
		border-radius: 0px 10px 10px 0px;
		background-color: rgba(0, 0, 0, 1);
		color: rgba(16, 16, 16, 100);
		font-size: 14px;
		text-align: center;
		box-shadow: 0px 0px 0px 0px rgba(102, 102, 102, 100);
		font-family: Arial;
		border: 1px solid rgba(255, 0, 0, 0);
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
