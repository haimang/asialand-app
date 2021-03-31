<template>
    <view class="content w-100">
		<!-- #ifdef APP-PLUS -->
<!-- 		<view class="status_bar">  
			<view class="top_view"></view>  
		</view>  -->
		<!-- #endif -->
    	<view class="header flex row space-between ">
			<view class="flex column">
				<image class="login-logo m-b-10 m-l-20 m-t-20" mode="widthFix" src="/static/img/logo.png"/>
				<text class="font-size-big m-l-20 uni-bold">
					{{$t('My Reservations')}}
				</text>
				<text class="font-size-normal m-l-20 m-b-20">
					{{$t('You currently have ')}} {{reservCnt}} {{$t('Reservations.')}}
				</text>
			</view>
    	</view>
    	<view class="data">
			<view class="m-l-20 m-r-20">
				<block v-for="(item, idx) in reserveList" :key="idx">
					<view class="product flex column">
						<view class="flex row m-t-20 m-l-10 align-center">
							<text class="font-size-small font-xGray">{{$t('Reservation Tracing ID: ')}}</text>
							<text class="font-size-medium uni-bold m-l-5">{{item.hash}}</text>
						</view>
						
						<view class="flex row m-l-10 align-center">
							<text class="font-size-medium font-gray uni-bold">{{$t('Status')}}:</text>
							<text :style="item.status==0 ? 'color:#52c42f' : ''" class="font-size-medium font-gray uni-bold m-l-5">{{item.status == 0 ? $t("Cancled") : item.status == 1 ? $t("Pending") : item.status == 2 ? $t("Audited") :item.status == 3 ? $t("Swapped") : $t("Completed")}}</text>
						</view>
						<image class="product-image m-t-10" mode="widthFix" :src="item.property_image ? item.property_image : '/static/img/home1.png'" @click="gotoDetail"></image>
						<view class="product-info flex row m-b-10">
							<view class="product-info-view flex column m-t-10  m-l-10">
								<view class="flex row font-size-medium ">
									<text class="font-gray">{{$t('Project')}}:</text>
									<text class="uni-bold m-l-5 line-one">{{item.project_name_en}}</text>
								</view>
								<!-- <view class="flex row font-size-small ">
									<text class="font-gray">{{$t('Address')}}:</text>
									<text class="uni-bold m-l-5 line-one">{{item.address}}</text>
								</view>	 -->						
							</view>
						</view>
						<hr class=" m-l-10 m-r-10">
						<view class="product-more flex column m-t-15  m-l-10 m-b-10">
							<view class="product-more-info flex row space-between">
								<view class="flex row">
									<text class="font-size-small font-xGray" style="line-height:50upx">{{$t('Reserved Unit')}}:</text>
									<text class="uni-bold m-l-5 " style="line-height:50upx">{{item.unit_name}}</text>
								</view>
							</view>
							<!-- <view v-if="item.unit" class="more_items">
								<block v-for="(subitem, idx) in item.linked" :key="idx">
									<view class="flex row align-center m-t-20">
										<view class="ic_mark_small"></view>
										<image :src="subitem.imgUrl" class="img_plan"></image>
										<view class="flex column">
											<text class="m-l-20 uni-bold font-size-small">{{subitem.name}}<text class="m-l-15">{{$t('Price')}}: {{" " + subitem.price}}</text></text>
											<text class="m-l-20 font-size-small font-gray">{{subitem.bed}}{{" " + $t('Bed')}} {{subitem.bath}}{{" " + $t('Bath')}} {{subitem.car}}{{" " + $t('Car')}}</text>
										</view>
									</view>
								</block>
							</view>			 -->
						</view>
					</view>
				</block>
			</view>
			
		</view>
		<view class="loading-more m-t-10 m-b-20" v-if="isLoading">
			<image class="loading-icon" src="data:image/svg+xml;base64,IDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnPjxwYXRoIGZpbGw9J25vbmUnIGQ9J00wIDBoMTAwdjEwMEgweicvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0U5RTlFOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyM5ODk2OTcnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMzAgMTA1Ljk4IDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nIzlCOTk5QScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNBM0ExQTInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNjUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQUJBOUFBJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDEyMCA1OC42NiA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNCMkIyQjInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0JBQjhCOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQzJDMEMxJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQ0JDQkNCJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xMjAgNDEuMzQgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjRDJEMkQyJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC05MCAzNSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNEQURBREEnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTYwIDI0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0UyRTJFMicgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtMzAgLTUuOTggNjUpJy8+PC9zdmc+"></image>    
			<text class="loading-more-text m-l-10">{{$t('Loading')}}</text>
		</view>
		<view class="loading-more m-t-10 m-b-20" v-if="isEndList">
			<text class="loading-more-text">{{$t('No more data')}}</text>
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
	
    export default{
		data(){
			return {
				reservCnt:0,
				pageSize:10,
				page:1,
				isEndList:false,
				isLoading:false,
				reserveList: [],
			}
		},
		onReachBottom: function() {
			if(!this.isEndList) {
				this.loadMore()
			}
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Reservation History")
			});
		},
		onLoad(option){
			this.reserveList = []
			this.page = 1
			this.getReservations()
			hideLoading()
		},
		methods:{
			loadMore(e) {
			    setTimeout(() => {
					this.isLoading = true
					this.isEndList = false
			    }, 500)
				
				this.page ++;
				this.getReservations()
			},
			getReservations() {
				var that = this
				showLoading()
				uni.request({
				    url: apiUrl.orderList, //仅为示例，并非真实接口地址。
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        token: uni.getStorageSync("token"),
						page: this.page,
						pageSize: this.pageSize
				    },
				    success: (res) => {
						hideLoading()
				        console.log(res.data);
						if(res.data.code == 0){
							that.reserveList = that.reserveList.concat(res.data.data.orders)
							that.reservCnt = res.data.data.total
							if(res.data.data.orders != null && res.data.data.orders.length > 0 && res.data.data.orders.length > this.pageSize) {
								that.isLoading = false
								that.isEndList = false
							} else {
								that.isLoading = false
								that.isEndList = true
							}	
						}
						else {
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
    .content{
    	padding:0px;
    	background: white;
		background-color:#f8f8f8;
    }
    
    .header{
    	background-color:#fff;
    	width:100%;
    }
    
    .login-logo {
    	height: 32upx !important;
    	width: 310upx;
    }
    
	.data{
		width:100%;
		background-color:#f8f8f8;
	}
	
	
	.mark {
		width:12upx;
		height:20upx;
	}
	
	.icon {
		width:38upx;
		height:34upx;
	}
	
	.img_plan{
		width:100upx;
		height:100upx;
		margin-left:40upx
	}
	
	.product{
		background-color:white;
		margin-top:40upx;
	}
	
	.product-image{
		width:100%;
		height:450upx;
	}
	
	.loading-more {
		display:flex;
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
	
	.loading-icon{
		width: 40upx;
		height: 40upx;
		transition: .3s;
		animation: loading 1s steps(12) infinite;
	}
		
	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(1turn);
		}
	}
</style>
