<template>
	<view class="content p-0">
		<!-- #ifdef APP-PLUS -->
	<!-- 	<view class="status_bar">  
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
		<view class=" m-t-20">
			<text class="m-l-20 m-r-20 uni-bold font-size-big ">{{$t('Step Two: Phone Verification')}}</text>
			<view class="input-row flex column m-t-10">				
				<!-- <view class="flex row" style="justify-content: space-between;">
					<input maxlength="1" class=" digit-input" type="number" focus v-model="code[0]"></input>
					<input maxlength="1" class=" digit-input" type="number"  v-model="code[1]"></input>
					<input maxlength="1" class=" digit-input" type="number"  v-model="code[2]"></input>
					<input maxlength="1" class=" digit-input" type="number"  v-model="code[3]"></input>
					<input maxlength="1" class=" digit-input" type="number"  v-model="code[4]"></input>
					<input maxlength="1" class=" digit-input" type="number"  v-model="code[5]"></input>
					<input @input="inputEvent" class="code-input-input" v-model="code" maxlength="6" type="number" />
				</view> -->
				
				<validcode :maxlength="6" :isPwd="false" @finish="getCode"></validcode> 
			</view>
		</view>
		<view class="btn-row m-b-10">
			<button class="login-btn"  @click="register">{{$t('Finish Registration')}}</button>
		</view>
		<view class="flex row m-l-20" style="align-items: center;" @click="changeCheckStatus">
			<!-- <checkbox-group class="checkBoxGroup"  @change="changeCheckStatus">
				<checkbox class="checkBox black" :checked="agreeCheck">
				</checkbox>
			</checkbox-group> -->
			<image :src="agreeCheck ? '/static/img/checked.png' : '/static/img/unchecked.png'" style="width:18px; height:17px;"></image> 
			<text class="font-size-small m-l-5" style="margin-top:3px;">{{$t('Accept Asialand')}} <text class="col-yellow m-r-5" @click="gotoPrivacy">{{$t('Privacy Policy')}}</text> </text>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
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
			mInput
		},
		data() {
			return {
				agreeCheck:true,
				digitArray:[1,2,3,4,5,6],
				pickerShow: false,
				pickerValue: [0],
				hasProvider: false,
				code: '',
				countryCode: '86',
				phone:''
			}
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Signup")
			});
		},
		onLoad(option) {
			if(option != null ) {
				this.phone = option.mobile != null ? option.mobile : this.phone 
				this.countrycode = option.countryCode != null ? option.countryCode : this.countrycode
			}
		},
		methods: {
			gotoPrivacy() {
				uni.navigateTo({
					url: '/pages/user/privacy'
				})
			},
			getCode(val) {  
				this.code = val
				console.log(val);  
			},  
			changeCheckStatus(){
				if(this.agreeCheck) {
					this.agreeCheck = false;
				}
				else {
					this.agreeCheck = true;
				}
			},
			register(){
				if(this.code.length === 6) {
					if(!this.agreeCheck) {
						uni.showToast({
							icon: 'none',
							title: this.$t('Please accept asialand privacy policy and tos.')
						});
						return;
					}
					
					showLoading()
					uni.request({
					    url: apiUrl.secondcreate, 
						method:"POST",
					    data: {
					        token: uni.getStorageSync("token"),
							country_code:this.countryCode,
							mobile:this.phone,
							smsnumber:this.code,
							scene:common.scene + "21130x",
							basetext:common.basetext,
							openid:uni.getStorageSync("user_hash"),
							name:uni.getStorageSync("user_name") == '' ? '' : uni.getStorageSync("user_name")
					    },
					    success: (res) => {
					        console.log(res.data);
							if(res.data.code == 0) {
								uni.showToast({
									icon: 'none',
									title: this.$t('Signup success!')
								});
								// setTimeout(() => {
								// 	uni.reLaunch({
								// 		url: '../home/home',
								// 	});
								// }, 500)
								
								this.login()
								
							}
							else {
								hideLoading()
								uni.showToast({
									icon: 'none',
									title: res.data.message
								});
							}
					    }
					});
				}
				else {
					uni.showToast({
						icon: 'none',
						title: this.$t('Please input verification code')
					});
				}
			},
			updateClientId() {
				var that = this
				uni.request({
				    url: apiUrl.updateClientId, //仅为示例，并非真实接口地址。
					method:"POST",
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        client_id: uni.getStorageSync("client_id"),
						token: uni.getStorageSync("token")
				    },
				    success: (res) => {
				        console.log(res.data);				
				    }
				});
			},
			login(){
				uni.request({
				    url: apiUrl.login, 
					method:"POST",
				    data: {
						email:uni.getStorageSync("email"),
						password: uni.getStorageSync("password"),
				        token: uni.getStorageSync("token"),
						is_app: 1
				    },
				    success: (res) => {
				        console.log(res.data);
						hideLoading()
						if(res.data.code == 0) {
							getApp().globalData.isLogin = true
							uni.setStorageSync("isLogin",true)
							uni.setStorageSync("userInfo",res.data.data.list[0])
							this.updateClientId()
							uni.reLaunch({
								url:"../register/success"
							})
							// const pages = getCurrentPages()
							// if(pages.length > 1) {
							// 	uni.navigateBack({
							// 		delta: 1
							// 	})
							// }
							// else {
							// 	uni.reLaunch({
							// 		url:"../home/home"
							// 	})
							// }
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
			inputEvent(res){
				console.log("input 1 input code  components : ", res.detail.value);				 
			}
		},
		onReady() {

		}
	}
</script>
<style>
	@import '../../common/uni.css';
	@import '../../colorui/main.css';
	.checkBoxGroup{
		width:55upx;
	}
	
	.code-input-input {
		height: 100upx;
		position: absolute;
		width: 100%;
		outline: none;
		color: transparent;
		text-shadow: 0 0 0 transparent;
		/* width: 300%; */
		/* margin-left: -100%; */
		background: #00000000;
	}

	.digit-input {		
		flex: 0 0 15%;
		height: 100upx;
		line-height: 60upx;
		border-radius: 4upx;
		text-align: center;
		border: 2upx solid rgba(187, 187, 187, 100);
		font-size:44upx !important;
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

	.login-header-view {
		width: 100%;
		padding: 60upx 40upx;
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
		margin-left: 20upx
	}
	
	
</style>
