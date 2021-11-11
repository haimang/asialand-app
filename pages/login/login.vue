<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
<!-- 		<view class="status_bar">  
			<view class="top_view"></view>  
		</view>  -->
		<!-- #endif -->
		<view class="header flex column">
			<image class="login-logo m-b-10 m-l-15 m-t-20" src="/static/img/logo.png" />
			<text class="font-size-big m-l-15 uni-bold">
				{{$t('Welcome Back')}}
			</text>
			<text class="font-size-normal m-l-15 m-b-20">
				{{$t('Use your E-mail account to proceed')}}
			</text>
		</view>
		<view class="data">
			<view class="flex column m-t-10 w-100">
			    <text class="title uni-bold">{{$t('Your E-mail')}}</text>
				<input class="uni-input font-size-normal w-100" v-model="email" :placeholder="this.$t('E-mail address')"/>
			</view>
			<view class="flex column m-t-10 w-100">
			    <text class="title uni-bold">{{$t('Your Password')}}</text>
			    <m-input class="m-input font-size-normal w-100" type="password" displayable v-model="password" :placeholder="$t('Password')"></m-input>
			</view>
			<view class="flex row m-t-20" style="align-items: center;" @click="changeCheckStatus">
				<!-- <checkbox-group class="checkBoxGroup"  @change="changeCheckStatus">
					<checkbox class="checkBox black" :checked="agreeCheck">
					</checkbox>
				</checkbox-group> -->
				<image :src="agreeCheck ? '/static/img/checked.png' : '/static/img/unchecked.png'" style="width:18px; height:17px;"></image> 
				<text class="font-size-small m-l-5" style="margin-top:3px;">{{$t('Accept Asialand')}} <text class="col-yellow m-r-5" @click="gotoPrivacy">{{$t('Privacy Policy')}}</text> </text>
			</view>
			<view class="m-t-50 m-b-50">
				<button class="btn" style="float:left" @click="login()">{{$t("Login")}}</button>
				<button class="btn m-l-20" @click="register()">{{$t("Signup")}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input.vue'
	import apiUrl from '../../common/apiUrl.js'
	import common from '../../common/common.js'
	import {
	    showLoading,
	    hideLoading
	} from 'common/loading'
	
	export default{
		components: {
		    mInput
		},
		data(){
			return {
				agreeCheck:true,
				email:'',
				password:''
			}
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Login")
			});
		},
		methods:{
			gotoPrivacy() {
				uni.navigateTo({
					url: '/pages/user/privacy'
				})
			},
			register(){
				uni.navigateTo({
					url:"../register/register_step1"
				})
			},
			changeCheckStatus(){
				if(this.agreeCheck) {
					this.agreeCheck = false;
				}
				else {
					this.agreeCheck = true;
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
				        console.log("updateClientID:" + res.data.message);				
				    }
				});
			},
			login() {
				if(!common.isEmail(this.email)){
					uni.showToast({
					    icon: 'none',
					    title: this.$t('Please input correct email')
					});
					return;
				} else if (this.password.length < 6) {
				    uni.showToast({
				        icon: 'none',
				        title: this.$t('Please input your password as 6~20 letters and numbers')
				    });
				    return;
				} 
				
				if(!this.agreeCheck) {
					uni.showToast({
						icon: 'none',
						title: this.$t('Please accept asialand privacy policy and tos.')
					});
					return;
				}
				showLoading()
				console.log("client_id:" + uni.getStorageSync("client_id"))
				uni.request({
				    url: apiUrl.login, 
					method:"POST",
				    data: {
						email: this.email,
						password: this.password,
				        token: uni.getStorageSync("token"),
						is_app: 1,
						scene:common.scene + "86x@",
						getui_clientid: uni.getStorageSync("client_id") != null ? uni.getStorageSync("client_id") : ''
				    },
				    success: (res) => {
				        console.log(res.data);
						setTimeout(() => {
							hideLoading()
						},1000);						
						if(res.data.code == 0) {
							getApp().globalData.isLogin = true
							uni.setStorageSync("isLogin",true)
							uni.setStorageSync("userInfo",res.data.data.list[0])
							this.updateClientId()
							uni.reLaunch({
								url:"../home/home"
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
							if(res.data.code == 218) {
								uni.showToast({
								    icon: 'none',
								    title: this.$t('LOGIN_NOT_ACTIVATED_USER'),
									duration: 5000
								});
							} else if(res.data.code == 220) { 
								uni.navigateTo({
									url: '../register/register_step2',
								})
							}
							else {
								uni.showToast({
								    icon: 'none',
								    title: res.data.message,
									duration: 5000
								});
							}
						}
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
	
	.uni-input {
		border: 1px solid #e7e7e7;
		height: 40px !important;
	
	}	
	
	.header {
		background-color: #f8f8f8;
		width: 100%;
	}
	
	.login-logo {
		height: 32upx !important;
		width: 310upx;
	}
	
	.data{
		width:100%;
		padding:40upx 30upx;
		box-sizing: border-box;
	}
	
	.head{
		width: 160upx;
		height: 160upx;
	}
	
	.title {
		height: 25px;
		min-height: 25px;
		padding: 7px 0;
		padding-left: 0px;
		line-height: 25px;
		font-size: 14px;
	}
</style>
