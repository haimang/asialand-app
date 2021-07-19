<template>
	<view class="content w-100">
		<view class="header flex column">
			<text class="font-size-big m-l-15 m-t-20 uni-bold">
				{{title}}
			</text>
			<text class="font-size-normal m-l-15 m-b-20  m-t-20 font-xGray">
				{{$t('Published Date')}} : {{publishTime}}
			</text>
		</view>
		<view class="data flex column align-center">		
			<text class="font-size-normal w-100">{{detailInfo.content}}</text>
		</view>
		<view class="footer">
			<button class="login-btn m-t-50"  @tap="gotoItem">{{$t('Go to project')}}</button>
		</view>
		<view class="attachment flex column" v-if="attachList.length > 0">
			<text class="font-size-normal uni-bold m-b-20">{{$t('Attachments')}}</text>
			<view class="m-b-20">
				<view v-for="(item,index) in attachList" class="file_item" :key="index">
					<view class="left flex row">
						<view class="icon"><image src="/static/img/far fa-file-alt.png" mode="widthFix" style="width:32upx;"></image></view>
						<view class="m-l-10">
							<view class="font-size-small font-xGray line-height-5 line-one">{{item.type}}</view>
							<view class="font-size-normal uni-bold  line-height-5 line-one">{{item.display_name}}</view>
						</view>
					</view>
					<view class="btn_group m-l-10" style="float:right">
						<button class="btn" @click="download(item.url)">{{$t('Download')}}</button>
						<button class="btn m-l-10" @click="copy(item.url)">{{$t('Copy')}}</button>
					</view>
				</view>
			</view>
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
	export default {
		data() {
			return {
				detailInfo:{},
				hash:'',
				title:'',
				publishTime:"",
				attachList:[]
			}
		},
		onLoad(options){
			this.hash = options.hash
			if(options.title){
				this.title = options.title
			}
			if(options.time) {
				this.publishTime = options.time
			}			
			this.getPushDetail()
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Notification Detail")
			});
		},
		methods:{
			getPushDetail(){
				showLoading(this.$t("Loading"))
				var that = this
				uni.request({
				    url: apiUrl.getPushDetail, //仅为示例，并非真实接口地址。
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        token: uni.getStorageSync("token"),
						hash: this.hash
				    },
				    success: (res) => {
				        console.log(res.data);
						if(res.data.data != null) {
							that.detailInfo = res.data.data
							that.title = that.detailInfo.title
							that.publishTime = that.detailInfo.updated_at.substring(0,16)
							that.publishTime = that.publishTime.replace("T"," ")
							that.attachList = that.detailInfo.files
							
						} 
						else {
							uni.navigateTo({
								url:"/pages/notification/index"
							})
						}
						hideLoading()
				    }
				});
			},
			gotoItem(){
				var type = this.detailInfo.project.substring(0,4)
				
				if(type == "HCPP") {
					uni.navigateTo({
						url: '/pages/house/detail?hash=' + this.detailInfo.project
					});	
				}
				else if(type == "HCAR") {
					uni.navigateTo({
						url: '/pages/news/detail?hash=' + this.detailInfo.project
					});	
				}
			},
			copy(url){
				uni.setClipboardData({
					data:url,//要被复制的内容
					success:()=>{//复制成功的回调函数
					  uni.showToast({//提示
						icon: 'none',
						title: this.$t('Copy Success')
					  })
					}
				  });
			},
			download(url){
				showLoading(this.$t('Loading'))
				uni.downloadFile({
					url:url,      //文件链接
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
						}
						var filePath = res.tempFilePath;
						console.log(filePath)
						// //保存到本地
						uni.saveFile({
							tempFilePath: filePath,
							success:(res)=>{
								 //保存成功并打开文件
								 hideLoading()
								 console.log(res.savedFilePath)
								 console.log('保存成功');
								 uni.openDocument({
									filePath:res.savedFilePath,
									success:(res)=>console.log('成功打开文档')
								})
							},
							fail:()=>{
								hideLoading()
								console.log('保存失败')
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	.content{
		padding:0px;
		background: white;
	}
	
	.mark{
		width:6px;
		height:20upx;
	}
	
	.header{
		background-color:#f8f8f8;
		width:100%;
	}
	
	.login-logo {
		height: 32upx !important;
		width: 310upx;
		
	}
	
	.data{
		background:white;
		width:100%;
		padding:40upx 30upx;
		box-sizing: border-box;
		margin-bottom:350upx;
	}
	
	.item{
		display:flex;
		flex-direction:row;
		background:white;
		align-items: center;
		margin-top:20upx;
	}
	
	.item_content{
		background-color: white;
		margin-top:-10px;
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
	
	.attachment{
		position:fixed;
		bottom:0px;
		left:0px;
		width:100%;
		border-top: 1px solid rgb(217, 192, 119);
		padding:20px;
		box-sizing: border-box;
		background-color: white;
	}
	
	.icon{
		width: 72upx;
		height: 72upx;
		background-color: rgba(0, 0, 0, 1);
		display:flex;
		justify-content: center;
		align-items: center;
	}
	
	.btn_group{
		display:flex;
		flex-direction: row;
		justify-content: flex-end;
		float:right;
	}
	
	.left{
		float:left;
	}
	
	.btn{
		height:48upx;
		line-height: 48upx;
		border-radius: 10upx;
		background-color: rgba(217, 192, 119, 100);
		color: rgba(16, 16, 16, 100);
		font-size: 20upx;
		text-align: center;
		font-family: Arial;
	}
	
	.login-btn {
		text-align: left;
		height: 100upx;
		line-height: 100upx;
		border-radius: 10upx;
		background-color: rgba(0, 0, 0, 1);
		color: #D9C077;
		font-size: 32upx;
		font-weight: bold;
		font-family: Arial;
		border: 0px;
		margin-left:20upx;
		border: 2px solid rgba(217, 192, 119, 100);
		margin: 0 auto;
	}
	
	.footer {
		background-color: white;
		display:flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height:200upx;
		position: fixed;
		bottom:0px;
		width:100%;
	}
</style>
