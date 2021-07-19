<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="status_bar">  
			<view class="top_view"></view>  
		</view>  -->
		<!-- #endif --> 
		<view class="header flex column">
			<image class="login-logo m-b-10 m-l-15 m-t-20" mode="widthFix" src="/static/img/logo.png" />
			<text class="font-size-big m-l-15 uni-bold">
				{{$t('Update Your Personal Information')}}
			</text>
			<text class="font-size-normal m-l-15 m-b-20">
				{{$t('Tell us more about you')}}
			</text>
		</view>
		<view class="data">
			<view class="top_label m-t-15 p-l-20 m-l-15 m-r-15">{{$t('Agents Contact Info')}}</view>
			<view class="info_view m-l-15 m-r-15 p-t-20">
				<text class="font-size-normal uni-bold">{{$t('Your Name')}}</text>
				<view class="row flex m-t-10">
					<input class="uni-input m-r-10" v-model="sirName" placeholder="" />
					<input class="uni-input m-l-10" v-model="lastName" placeholder="" />
				</view>

				<view class="font-size-normal uni-bold m-t-20">{{$t('Your Business Title')}}</view>
				<view class="font-size-small font-xGray">{{$t('Something like “Facebook - Project Manager”')}}</view>
				<view class="row flex m-t-10">
					<input class="uni-input m-r-10" v-model="business" placeholder="" />
					<view class="slash m-t-15"></view>
					<input class="uni-input m-l-10" v-model="job" placeholder="" />
				</view>

				<view class="font-size-normal uni-bold m-t-20">{{$t('Your E-mail')}}</view>
				<view class="font-size-small font-xGray">{{$t('E-mail address can not be changed.')}}</view>
				<view class="row flex m-t-10">
					<input class="uni-input disabled" v-model="email" disabled="true" placeholder="" />
				</view>

				<view class="font-size-normal uni-bold m-t-20">{{$t('Your Phone Number')}}</view>
				<view class="row flex m-t-10">
					<view class="countryCode font-size-normal" style="flex: 0 0 30%;" @click="openCountryPicker">
						<text>{{countryCode}}</text>
						<m-icon color="#666666" type="arrowdown" size="20"></m-icon>
					</view>
					<input class="uni-input " type="number" v-model="phone" placeholder="" />
				</view>
			</view>

			<view class="top_label m-t-30 p-l-20 m-l-15 m-r-15">{{$t('Agents Other Details')}}</view>
			<view class="info_view m-l-15 m-r-15" style="margin-bottom:50px;">
				<view class="font-size-normal uni-bold m-t-20">{{$t('Your Professional Photo')}}</view>
				<view class="font-size-small font-xGray line-height-2 m-b-20">{{$t('This image map appear on the project poster you would created. Best with 3:2 aspect ratio.')}}</view>
				<view class="img_selector flex align-center" @click="getImg(1)">
					<m-icon v-if="avatarUrl == '' || avatarUrl == null || avatarUrl == undefined" color="#666666" type="plusempty" size="50"></m-icon>
					<!-- <img  v-if="avatarUrl == '' || avatarUrl == null || avatarUrl == undefined" src="/static/img/mb-plus.png"></img> -->
					<image v-else mode="aspectFill" class="img"  :src="avatarUrl"></image>
				</view>
				<view class="font-size-normal uni-bold m-t-20">{{$t('Your Business Card')}}</view>
				<view class="font-size-small font-xGray line-height-2 m-b-20">{{$t('This Business Card may appear on the project poster you would created. Best with 3:2 aspect ratio.')}}</view>
				<view class="img_business_selector flex align-center" @click="getImg(2)">
					<m-icon v-if="businessUrl == '' || businessUrl == null || businessUrl == undefined" color="#666666" type="plusempty" size="50"></m-icon>
					<!-- <img v-if="businessUrl == '' || businessUrl == null || businessUrl == undefined" src="/static/img/mb-plus.png"></img> -->
					<image v-else mode="aspectFill" class="img" :src="businessUrl"></image>
				</view>
				<button class="login-btn m-t-30 " @tap="updateInfo">{{$t('Save Changes')}}</button>
			</view>
		</view>

		<view class="mask" v-show="pickerShow">
			<view class="pickerView" v-show="pickerShow">
				<view class="demo-flex">
					<view class="select-time">
						Select Country
					</view>
					<view class="of-sourceof" @click="closemask">
						OK
					</view>
				</view>
				<picker-view class="picker" indicator-class="indicator" :value="pickerValue" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item, index) in countryCodelist" :key="index" @click="selectCountryCode(index)">{{item.name}} + {{item.calling_code}}</view>					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from '../../common/common.js'
	import apiUrl from '../../common/apiUrl.js'
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	
	export default {
		data() {
			return {
				headUrl: "/static/img/head_sample.jpg",
				name: "Michael Gutenburg",
				duty: "金鼎地产 - 市场经理",
				propCnt: 12,
				reserveCnt: 3,
				pickerValue: [0],
				countryCode: 'AUS +61',
				email: "",
				job: '',
				sirName: '',
				lastName: '',
				business: '',
				phone: '',
				pickerShow: false,
				personImgUrl: '',
				businessCardImgUrl: '',
				countryCodelist:[],
				selCountryCode:'',
				avatarUrl:'',
				businessUrl:''
			}
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("User Information")
			});
		},
		created(){
			this.getCountries()
			
		},
		methods: {
			switch1Change() {

			},
			openCountryPicker() {
				this.pickerShow = true
			},
			bindChange(e) {
				console.log(e)
				this.countryCode = this.countryCodelist[e.detail.value[0]].name + " +" + this.countryCodelist[e.detail.value[0]].calling_code 
				this.selCountryCode = this.countryCodelist[e.detail.value[0]].calling_code 
			},
			closemask() {
				this.pickerShow = false

			},
			getImg(type) {
				var that = this
				uni.chooseImage({
					count: 6, // 最多可以选择的图片张数，默认9
					sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
					sourceType: ['album', 'camera'], //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));
						if (res.tempFilePaths.length > 0) {
							if (type == 1) {
								that.personImgUrl = res.tempFilePaths
								that.uploadFile( res.tempFilePaths[0],"person")
							} else if (type == 2) {
								that.businessCardImgUrl = res.tempFilePaths
								that.uploadFile( res.tempFilePaths[0],"business")
							}
						}
					}
				});
			},
			uploadFile(file,type){
				console.log("upload photo:" + file)
				console.log("upload photo:" + type)
				showLoading(this.$t('Uploading'))
				
				uni.uploadFile({
				    url: apiUrl.uploadImage, 
					filePath: file, // uni.chooseImage函数调用后获取的本地文件路劲
					name:'image',     //后端通过'file'获取上传的文件对象					
					header: {  
						'content-type': 'multipart/form-data'  
					},  
					formData: {
				        token: uni.getStorageSync("token"),
						// image:file,
						scene: type=="person" ? common.scene + '16x507' : common.scene + '16x508' ,
				    },
				    success: (res) => {
				        console.log("upload photo: " + JSON.stringify(res));
						console.log("upload photo: " + res.data);
						
						hideLoading()
						if(res.data != '' && res.data != null && res.data != undefined) {
							var result = JSON.parse(res.data)
							if(result.code == 0) {
								if(type == "person") {
									this.avatarUrl = result.data.url
								}
								else if(type == "business"){
									this.businessUrl = result.data.url
								}
								
							}
						}
				    }
				});
			},
			getCountries(){
				uni.request({
				    url: apiUrl.getCountries, 
				    data: {
				        token: uni.getStorageSync("token")
				    },
				    success: (res) => {
				        console.log(res.data);
						if(res.data != null && res.data.code == 0) {
							this.countryCodelist = res.data.data
						}
						this.getUserInfo()
				    }
				});
			},
			getUserInfo(){
				showLoading(this.$t('Loading'))
				var that = this
				uni.request({
				    url: apiUrl.getUserInfo, //仅为示例，并非真实接口地址。
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        token: uni.getStorageSync("token"),
						openid: uni.getStorageSync("userInfo").authToken.token
						
				    },
				    success: (res) => {
				        console.log(res.data);
						hideLoading()
						
						if(res.data.code == 0) {
							this.email = res.data.data.user.email
							this.sirName = res.data.data.user.surname
							this.lastName = res.data.data.user.name
							this.job = res.data.data.user.title
							this.business = res.data.data.user.company
							this.phone = res.data.data.user.mobile
							if (uni.getSystemInfoSync().platform == 'ios') {
								if(res.data.data.user.avatar != null) {
									this.avatarUrl = res.data.data.user.avatar.substring(0,res.data.data.user.avatar.indexOf('?'))
								}
							}
							else {
								this.avatarUrl = res.data.data.user.avatar
							}
							
							if (uni.getSystemInfoSync().platform == 'ios') {
								if(res.data.data.user.business_card != null) {
									this.businessUrl = res.data.data.user.business_card.substring(0,res.data.data.user.business_card.indexOf('?'))
								}
							}
							else {
								this.businessUrl = res.data.data.user.business_card
							}
							
							
							for(var i= 0 ;i < this.countryCodelist.length; i++){
								if(this.countryCodelist[i].calling_code == res.data.data.user.country_code) {
									this.countryCode = this.countryCodelist[i].name + " +" + this.countryCodelist[i].calling_code
									this.selCountryCode = this.countryCodelist[i].calling_code
								}
							}
						}
				    }
				});
			},
			updateInfo(){
				showLoading(this.$t('Loading'))
				var that = this
				uni.request({
				    url: apiUrl.updateUserInfo, //仅为示例，并非真实接口地址。
					method:"POST",
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        token: uni.getStorageSync("token"),
						surname: this.sirName,
						name: this.lastName,
						company: this.business,
						title: this.job,
						country_code: this.selCountryCode,
						mobile: this.phone,
						avatar: this.avatarUrl,
						business_card: this.businessUrl,
						scene: common.scene
				    },
				    success: (res) => {
				        console.log(res.data);
						if(res.data.code == 0) {
							uni.showToast({
							    icon: 'none',
							    title: this.$t("Edit user information success")
							});
						}
						else {
							uni.showToast({
							    icon: 'none',
							    title: res.data.message
							});
						}
						hideLoading()
				    }
				});
			}
		}
	}
</script>

<style>
	.content {
		padding: 0px;
		background: white;
	}

	.header {
		background-color: #f8f8f8;
		width: 100%;
	}

	.login-logo {
		height: 32upx !important;
		width: 310upx;
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
	}

	.data {
		background: white;
		width: 100%;
	}

	.info_view {}

	.head {
		width: 128upx;
		height: 128upx;
		border-radius: 128upx;
	}

	.login-btn {
		text-align: left;
		display: inline-block;
		height: 80upx;
		line-height: 80upx;
		border-radius: 10upx;
		background-color: rgba(0, 0, 0, 1);
		color: rgba(217, 192, 119, 100);
		font-size: 32upx;
		font-weight: bold;
		box-shadow: 0px 4upx 12upx 0px rgba(0, 0, 0, 0.4);
		font-family: Arial;
		border: 0px;
	}

	.split {
		width: 100%;
		height: 2upx;
		background-color: rgba(217, 192, 119, 100);
	}

	.info_item {
		width: 180upx;
		height: 200upx;
		border-radius: 20upx;
		background-color: rgba(0, 0, 0, 1);
		text-align: center;
		box-shadow: 0px 0px 5px 0px rgba(238, 238, 238, 100);
		display: flex;
		flex-direction: column;

	}

	.uni-input {
		border: 1px solid #ccc;
		height: 36upx !important;

	}

	.slash {
		width: 30upx;
		height: 2px;
		background-color: rgba(102, 102, 102, 100);
	}

	.mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.countryCode {
		flex: 0 0 30%;
		border: 2upx solid #ccc;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0px 20upx;
		margin-right: 20upx;
	}

	.pickerView {
		width: 100%;
		height: 400upx;
		background-color: #FFFFFF;
		position: absolute;
		bottom: 0;
	}

	.picker {
		background-color: #EEEEEE;
		position: absolute;
		width: 100%;
		height: 288upx;
		bottom: 20rpx;

	}

	.item {
		height: 88rpx;
		line-height: 68rpx;
		font-size: 32rpx;
		text-align: center;
	}

	.content {
		background: white;
	}

	.demo-flex {
		display: flex;
		align-items: center;


	}

	.select-time {
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		font-family: "PingFangSC, PingFangSC-Medium";
		font-weight: 500;
		text-align: center;
		color: #323233;
		flex: 1;
		padding-left: 90rpx;

	}

	.of-sourceof {
		height: 96rpx;
		line-height: 96rpx;
		font-size: 30rpx;
		font-family: "PingFangSC, PingFangSC-Regular";
		text-align: center;
		color: #3388ff;
		padding-right: 32rpx;
	}

	.disabled {
		background-color: #eee;
	}

	.img_business_selector{
		width:375upx;
		height:250upx;
		justify-content: center;
		border: 1px solid rgba(187, 187, 187, 100);
	}
	
	.img_selector {
		width: 250upx;
		height:250upx;
		justify-content: center;
		border: 1px solid rgba(187, 187, 187, 100);
	}

	.icon_plus {
		width: 48upx;
		height: 48upx;
		color: rgba(102, 102, 102, 100);
	}

	.img {
		width: 100%;
		height:100%;
	}
</style>
