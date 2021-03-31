<template>
	<view class="flex column w-100">	
		<view class="header">
			<text class="font-size-big white uni-bold m-l-20" style="text-shadow: 1px 3px 2px black;">{{$t("Agent's Package")}}</text>
			<text class="font-size-small white m-l-20" style="text-shadow: 1px 2px 2px black;">{{detailInfo.name}}</text>
		</view>
		<view class="data flex column p-l-20 p-r-20">
			<view v-if="detailInfo.agent_notes !=undefined"  class="top_label column flex flex-start m-t-20" style="align-items: flex-start !important;">
				<text>{{$t('Agents Notes')}}</text>	
			</view>
			<text v-if="detailInfo.agent_notes !=undefined" class="font-size-normal p-b-30 m-t-10 p-t-10 p-l-10 p-r-10" style="background-color: #f8f8f8;">
				{{detailInfo.agent_notes}}
			</text>
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Factsheet')}}</text>
			</view>
			<view class="flex column m-t-10">
				<text class="font-size-normal item">{{$t('Project Type')}}: <text class="uni-bold m-l-10">{{type}}</text></text>
				<text class="font-size-normal item back-gray">{{$t('Location')}}: <text class="uni-bold  m-l-10">{{Object.keys(detailInfo).length !== 0 ? detailInfo.address.address : ''}}</text></text>
<!--			<text class="font-size-normal item">{{$t('Developer')}}: <text class="uni-bold m-l-10">{{detailInfo.developer}}</text></text>-->
 				<text class="font-size-normal item ">{{$t('Completion')}}: <text class="uni-bold m-l-10">{{detailInfo.settle_date}}</text></text>
				<text class="font-size-normal item back-gray">{{$t('Total Volume')}}: <text class="uni-bold m-l-10">{{detailInfo.unit_num}}</text></text>
				<text class="font-size-normal item ">{{$t('Price Range')}}: <text class="uni-bold m-l-10">{{price_min + " - "}}{{price_max}}</text></text>
			</view>
			
			<view class="label flex row m-t-50">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Commission')}}</text>
			</view>
			<view class="flex column m-t-10 m-b-30">
				<text class="font-size-normal item back-gray">{{$t('Commission')}}: <text class="uni-bold  m-l-10">{{Object.keys(detailInfo).length !== 0  && detailInfo.commission.value != null ? detailInfo.commission.value + '%' : ''}}</text></text>
				<text class="font-size-normal item">{{$t('Comment')}}: \n<text class="uni-bold">{{Object.keys(detailInfo).length !== 0 && detailInfo.commission.comment != null ? detailInfo.commission.comment : ''}}</text></text>
			</view>
			
			<view class="label flex row m-t-50 align-center">
				<view class="ic_mark"></view>
				<view class="flex column">
					<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Files and Documents')}}</text>
					<text class="font-small font-xGray m-l-10 line-height-2">{{$t('click download button to view, or copy down load link')}}</text>
				</view>				
			</view>
			
			<view class="m-t-10 m-b-50">
				<view v-for="(item,index) in detailInfo.file" class="file_item" :key="index">
					<view class="left flex row">
						<view class="icon"><image src="/static/img/far fa-file-alt.png" mode="widthFix" style="width:32upx;"></image></view>
						<view class="m-l-10" style="width:280upx;">
							<view class="font-size-small font-xGray line-height-5 line-one">{{$t("Price") == "价格" ? item.type : item.type_en}}</view>
							<view class="font-size-normal uni-bold  line-height-5 line-one">{{item.display_name}}</view>
						</view>
					</view>
					<view class="btn_group m-l-10 m-r-10">
						<button class="btn" @click="download(item.url)">{{$t('Download')}}</button>
						<button class="btn m-l-10" @click="copy(item.url)">{{$t('Copy')}}</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import apiUrl from "../../common/apiUrl.js"
	import common from "../../common/common.js"
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	export default{
		data(){
			return {
				hash:'',
				type:'',
				detailInfo:{},
				name:'',
				note:"Settlement of this project will be started on Nov 23rd, 2020.",
				type:"",
				location:"",
				developer:"",
				completion:"",
				total_volume:0,
				range:"",
				price_min:'',
				price_max:'',				
				commission:0,
				comment:'',
				attachList:[]
			}
		},
		onLoad(option) {
			this.hash = option.hash
			this.getDetail()
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Agent's Package")
			});
		},
		methods:{
			getDetail(){
				var that = this
				showLoading(this.$t("Loading"))
				uni.request({
				    url: apiUrl.getPropertyDetail, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						hash: this.hash
				    },
				    success: (res) => {
						hideLoading()
				        console.log(res.data);
						if(res.data.code == 0){
							this.detailInfo = res.data.data
							if(uni.getStorageSync("language") == "en") {
								
								this.price_min = this.detailInfo.symbol + common.currency(this.detailInfo.price_min)
								this.price_max = this.detailInfo.price_max == null ? '' :  this.detailInfo.symbol + common.currency(this.detailInfo.price_max)
								// this.price_max = this.detailInfo.symbol + (this.detailInfo.price_max / 100).toFixed(3) + "M" 								
								this.type = this.detailInfo.proptype_en
							}
							else {
								this.price_min = this.detailInfo.symbol + common.currency(this.detailInfo.price_min)
								this.price_max = this.detailInfo.price_max == null ? '' : this.detailInfo.symbol + common.currency(this.detailInfo.price_max)
								// this.price_min = this.detailInfo.price_min + this.$t("Million")
								// this.price_max = this.detailInfo.price_max + this.$t("Million")
								this.type = this.detailInfo.proptype
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
					},
					fail:()=>{
						hideLoading()
						console.log('下载失败')
					}
				})
			},
			copy(url){
				uni.setClipboardData({
					data:url,//要被复制的内容
					success:()=>{//复制成功的回调函数
					  uni.showToast({//提示
						title: this.$t('Copy Success')
					  })
					}
				  });
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
	
	.data{
		background-color: white;
		width:100%;
	}
	
	.mark{
		width:16upx;
		height:60upx;
	}
	
	.item{
		line-height:80upx;
		padding-left:30upx;
	}
	
	.back-gray{
		background-color: #f8f8f8;
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
		background-color: rgba(217, 192, 119, 100) !important;
		color: rgba(16, 16, 16, 100) !important;
		box-shadow:0px 0px 0px 0px;
		font-size: 20upx;
		text-align: center;
		font-weight: normal;
	}
	
	.icon{
		width: 72upx;
		height: 72upx;
		background-color: rgba(0, 0, 0, 1);
		display:flex;
		justify-content: center;
		align-items: center;
	}
	
	.file_item{
		display:flex;
		flex-direction:row;
		background:white;
		align-items: center;
		margin-top:20upx;
		justify-content: space-between;
	}
</style>