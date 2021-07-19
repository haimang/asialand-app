<template>
	<view class="content p-0">
		<!-- #ifdef APP-PLUS -->
<!-- 		<view class="status_bar">  
			<view class="top_view"></view>  
		</view>  -->
		<!-- #endif -->
		<view class="login-header-view flex column">
			<image class="login-logo m-b-10" src="/static/img/logo.png"></image>
			<text class="uni-bold font-size-big">
				{{$t('Join Us')}}
			</text>
			<text class="font-size-normal gray">
				{{$t('Register your account and started selling')}}
			</text>
		</view>
		<view class="m-l-15 m-r-15 m-t-20">
			<text class=" uni-bold font-size-big ">{{$t('Step Two: Phone Verification')}}</text>
			<view class="input-row flex column m-t-10">
				<text class="title uni-bold">{{$t('Your Mobile Phone number')}}</text>
				<view class="flex row">
					<view class="countryCode font-size-normal" style="flex: 0 0 30%;width:100px" @click="openCountryPicker">
						<text class="line-one">{{countryCode}}</text>
						<m-icon color="#666666" type="arrowdown" size="20" @click="clear"></m-icon>
					</view>
					<m-input class="m-input w-80 font-size-normal" type="number" focus v-model="phone" placeholder=""></m-input>
				</view>
			</view>
		</view>
		<view class="btn-row m-b-30">
			<button class="login-btn" @tap="requestVerifyCode" >{{$t('Send Verification Code')}}</button>
		</view>
		<view class="mask" v-show="pickerShow">
			<view class="pickerView" v-show="pickerShow">
				<view class="demo-flex">
					<view class="select-time">
						{{$t('Select Country')}}
					</view>
					<view class="of-sourceof" @click="closemask">
						{{$t('OK')}}
					</view>
				</view>
				<picker-view class="picker" indicator-class="indicator" :value="pickerValue" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item, index) in countryCodelist" :key="index" @click="selectCountryCode(index)">{{item.name}} + {{item.calling_code}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import mIcon from '../../components/m-icon/m-icon.vue'
	import apiUrl from '../../common/apiUrl.js'
	import common from '../../common/common.js'
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'

	export default {
		components: {
			mInput,
		},
		data() {
			return {
				pickerShow: false,
				pickerValue: [0],
				countryCodelist: [],
				hasProvider: false,
				phone: '',
				countryCode: 'AUS +61',
				selCountryCode :'61',
			}
		},
		computed: mapState(['forcedLogin']),
		async created(){
			this.getCountries()
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Signup")
			});
		},
		methods: {
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
			gotoNext(){
				uni.navigateTo({
					url: '../register/register_step3?countryCode=' + this.selCountryCode + "&mobile=" + this.phone,
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
				    }
				});
			},
			requestVerifyCode(){
				showLoading();
				// if(this.phone.length === 11 && !/^([0-9\u4e00-\u9fa5\路]{1,10})$/.test(this.phone)) {
					uni.request({
					    url: apiUrl.reqeustVerifyCode, 
						method:"POST",
					    data: {
					        token: uni.getStorageSync("token"),
							country_code:this.selCountryCode,
							mobile:this.phone,
							openid:''
					    },
					    success: (res) => {
					        console.log(res.data);
							hideLoading()
							if(res.data.code == 0) {
								if(res.data.data.success == true) {
									uni.showToast({
										icon: 'none',
										title: this.$t('Send verification code successfully!')
									});
									uni.hideLoading()
									this.gotoNext();
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
				// }
				// else {
				// 	uni.showToast({
				// 	    icon: 'none',
				// 	    title: this.$t('Please input correct phone number')
				// 	});
				// 	return;
				// }
			}
		},
		onReady() {

		}
	}
</script>
<style scoped lang="scss">	
	.mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.demo-flex {
		display: flex;
		align-items: center;

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
</style>
<style>
	@import '../../common/uni.css';
	.countryCode{
		flex: 0 0 30%;
		border:2upx solid #e7e7e7;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0px 20upx;
		margin-right:20upx;
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

	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 20upx;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		width: 100upx;
		height: 100upx;
		border: 1upx solid #dddddd;
		border-radius: 100upx;
		margin: 0 40upx;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 60upx;
		height: 60upx;
		margin: 20upx;
	}

	.login-header-view {
		width: 100%;
		padding: 60upx 30upx;
		padding-top:30upx;
		background-color: #F8F8F8;
	}

	.login-logo {
		height: 32upx !important;
		width: 310upx;

	}
	
	.login-btn {
		text-align: left;
		padding-top: 30upx;
		height: 100upx;
		display: inline-block;	
		line-height: 40upx;
		border-radius: 10upx;
		background-color: rgba(0, 0, 0, 1);
		color: rgba(217, 192, 119, 100);
		font-size: 32upx;
		font-weight: bold;
		box-shadow: 0px 4upx 12upx 0px rgba(0, 0, 0, 0.4);
		font-family: Arial;
		border: 0px;
		margin-left: 10upx;
	}
</style>
