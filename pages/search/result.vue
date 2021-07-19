<template>
	<view class="content p-0 m-0">
		<view class="header flex column">
			<image class="login-logo m-b-10 m-l-20 m-t-30" src="/static/img/logo.png"/>
			<text class="font-size-normal m-l-20 m-t-10" v-if="type_str != '' || keyword != ''">
				{{$t('Searching')}}<text class="uni-bold m-r-5" v-if="type_str != ''">“{{type_str}}”</text><text class="m-l-5">{{$t('Projects in')}}</text><text class="uni-bold" v-if="keyword != ''">“{{keyword}}”</text>
			</text>
			<button class="login-btn m-t-20 m-b-30 m-l-20" @tap="bindSearch">
				<image src="/static/img/fa-search.png" style="width:20px;margin-right:5px;" mode="widthFix"/>{{$t('New Search')}}
			</button>
		</view>
		<view class="data">
			<text class="font-size-normal">{{$t('Find')}} <text class="uni-bold m-l-5 m-r-5 ">{{totalCnt}}</text> {{$t('Projects')}}</text>
			<scroll-view class="scroll-v list" enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
				<view class="m-t-20 w-100">
					<view class="m-t-20" v-for="(item, idx) in houseList" :key="idx">
						<house-item class="m-t-20" :info="item" :isSaved.sync="item.isSaved" @saveClick="saveProperty"></house-item>
					</view>
				</view>
				<view class="loading-more m-t-5" v-if="isLoading">
					<image class="loading-icon" src="data:image/svg+xml;base64,IDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnPjxwYXRoIGZpbGw9J25vbmUnIGQ9J00wIDBoMTAwdjEwMEgweicvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0U5RTlFOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyM5ODk2OTcnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMzAgMTA1Ljk4IDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nIzlCOTk5QScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNBM0ExQTInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNjUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQUJBOUFBJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDEyMCA1OC42NiA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNCMkIyQjInIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0JBQjhCOScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQzJDMEMxJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjQ0JDQkNCJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xMjAgNDEuMzQgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPScjRDJEMkQyJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC05MCAzNSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9JyNEQURBREEnIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTYwIDI0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0nI0UyRTJFMicgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtMzAgLTUuOTggNjUpJy8+PC9zdmc+"></image>    
					<text class="loading-more-text m-l-10">{{$t('Loading')}}</text>
				</view>
				<view class="loading-more m-t-5" v-if="isEndList">
					<text class="loading-more-text">{{$t('No more data')}}</text>
				</view>
			</scroll-view>
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
	
	import HouseItem from '../../components/house-item.vue'
	export default {
		data() {
			return {
				type:0,
				keyword:'',
				rangeMin:"300000",
				rangeMax:"5000000",
				status:0,
				houseList: [],
				templist: [],
				isEndList:false,
				isLoading:false,
				page:1,
				pageSize:10,
				type_str:'',
				totalCnt:0,
			}
		},
		components:{
			HouseItem
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Search Result")
			});
		},
		onLoad(option) {
			this.type = option.type
			console.log(this.type)
			var list = this.type.split(",")
			if(list.length > 0) {
				for(var i = 0; i < list.length; i++) {
					if(list[i] == 25) {
						this.type_str += this.$t('House & Land')
						this.type_str += " "
					}
					else if(list[i] == 3) {
						this.type_str += this.$t('Townhouse')
						this.type_str += " "
					}
					else if(list[i] == 1) {
						this.type_str += this.$t('Apartment')
						this.type_str += " "
					}			
				}	
			}
			this.status = option.status
			this.keyword = option.keyword
			this.rangeMin = option.rangeMin
			this.rangeMax= option.rangeMax
			this.houseList = []
			this.tempList = []
			this.page = 1
			this.search()
		},
		onReachBottom: function() {
			if(!this.isEndList) {
				this.loadMore()
			}
		},
		methods:{
			bindSearch(){
				uni.navigateBack({
					delta:1
				})
			},
			onPullDownRefresh(){
				setTimeout(() => {
					this.houseList = []
					this.tempList = []
					this.page = 1
					this.search();
				},500)	
			},
			loadMore(e) {
			    setTimeout(() => {
					this.isLoading = true
					this.isEndList = false
			    }, 500)
				
				this.page ++;
				this.search()
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
						hideLoading()
				        console.log(res.data);
						if(res.data.code == 0 && res.data.data.collects.length > 0) {
							for(var p_i  = 0; p_i < that.tempList.length; p_i ++) {
								for(var i = 0; i < res.data.data.collects.length; i++) {
									if(res.data.data.collects[i].hash == that.tempList[p_i].hash) {
										that.tempList[p_i].isSaved = true
									}
								}	
							}		
						}
						that.houseList = that.tempList					
				    }
				});
			},
			search(){
				showLoading()
				var that = this
				uni.request({
					url: apiUrl.getPropertyList, //仅为示例，并非真实接口地址。
					data: {
						token: uni.getStorageSync("token"),
						page: this.page,
						pageSize: this.pageSize,						
						prop_type:this.type,
						price:this.rangeMin + "-" + this.rangeMax,
						keyword:this.keyword,
						country: "1",
						unit_is_recommended:"1",
						status:this.status
					},
					success: (res) => {
						uni.stopPullDownRefresh()
						hideLoading()
						console.log(res.data);
						if(res.data.data.properties != null && res.data.data.properties.length > 0 ) {								
							that.tempList = that.tempList.concat(res.data.data.properties)
							that.totalCnt = res.data.data.total
							for(var p_i  = 0; p_i < that.tempList.length; p_i ++) {
								that.tempList[p_i].isSaved = false
							}
							
							if(uni.getStorageSync("isLogin")) {
								that.getSaveList()
							}
							else {
								that.houseList = that.tempList
							}
							
							that.isLoading = false
							if( res.data.data.properties.length < this.pageSize) {
								that.isEndList = true
							}
							else {
								that.isEndList = false;
							}
						} else {
							that.isLoading = false
							that.isEndList = true
						}
					}
				});
			}
		}
	}
</script>

<style>
	.login-logo {
		height: 32upx !important;
		width: 310upx;
		
	}
	.header{
		width:100%;
		background: #ffffff;
	}
	
	.login-btn {
		text-align: left;
		height: 72upx;
		line-height: 72upx;
		border-radius: 10upx;
		background-color: rgba(0, 0, 0, 1);
		color: rgba(217, 192, 119, 100);
		font-size: 28upx;
		font-weight: bold;
		box-shadow: 0px 4upx 12upx 0px rgba(0, 0, 0, 0.4);
		font-family: Arial;
		border: 0px;
		display:flex;
		align-items: center;
	}
	
	.content{
		background-color: #f8f8f8;
	}	
	
	.data{
		width: 100%;	
		padding:40upx 20upx;
		background-color: #f8f8f8;
		box-sizing: border-box;
	}
	
	.loading-text{
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
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
