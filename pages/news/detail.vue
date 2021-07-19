<template>
	<view class="app">
		<view class="header flex column">
			<text class="title font-size-big uni-bold line-height-2">{{detailInfo.name != null ? detailInfo.name : ''}}</text>
			<view class="flex row space-between m-t-20">
				<text class="update_time font-gray font-size-normal">{{$t('Update')}} : {{detailInfo.publish_time != null ? detailInfo.publish_time : ''}}</text>
				<text class="font-gray font-size-normal border-bottom" @click="gotoContactUs">{{$t("Report Article")}}</text>
			</view>
			
		</view>
		<view class="content">
			<rich-text class="font-size-normal w-100" :nodes="detailInfo.content"></rich-text>
		</view>
		<view class="split"></view>
		<view v-if="detailInfo.source_url != null" class="font-small font-gray p-t-20 p-b-20 p-l-10 p-r-10 source_url" style="">{{$t("Source")}} : {{detailInfo.source_url}}</view>
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
				hash:'',
				detailInfo:{},
				title: 'Rents fall across capital cities but are still unaffordable for many tenants',
				publish_time: '2020-11-23',
			 	content: ''
			 }
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("News Detail")
			});
		},
		onLoad(option){
			this.hash = option.hash
			if(option.time) {
				this.detailInfo.publish_time = option.time
			}
			
			if(option.title) {
				this.detailInfo.name = option.title
			}
			
			// this.title = option.title
			// this.publish_time = option.time
			//this.hash="HCAR-jQqkVb7KfO"
			this.getDetailInfo()
		},		
		methods: {
			getDetailInfo(){
				var that = this
				showLoading(this.$t('Loading'))
				
				uni.request({
				    url: apiUrl.getArticleDetail, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						hash: this.hash
				    },
				    success: (res) => {
						hideLoading()
				        console.log(res.data);		
						if(res.data.code == 0) {
							that.detailInfo = res.data.data
							that.detailInfo.publish_time =  common.timestampToTime(that.detailInfo.publish_time)
						}
				    }
				});
			},
			gotoContactUs(){
				uni.navigateTo({
					url:'/pages/user/contactus'
				})
			},
		}
	}
</script>
<style>
	.app {
		background: #f8f8f8;
	}

	.header {
		background: #f8f8f8;
		padding: 50upx 30upx;
	}

	.title {
		color: black;
	}

	.content {
		background: white;
		font-size: 28upx;
		padding: 20upx 30upx;
		width: 670upx;
	}
	
	.split{
		height: 2upx;
		background-color: #ccc;
		margin:0px 20px;
	}
	
	.source_url {
		background-color: white;
		word-break: break-all;
	}
	
	.border-bottom{
		border-bottom:1px solid #ccc;
	}
</style>
