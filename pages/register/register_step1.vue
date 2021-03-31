<template>
    <view class="content p-0">
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="status_bar">  
			<view class="top_view"></view>  
		</view>  -->
		<!-- #endif -->
		<view class="login-header-view flex column">
			<image class="login-logo m-b-10" src="/static/img/logo.png"/>
			<text class="uni-bold font-size-big">
				{{$t('Join Us')}}
			</text>
			<text class="font-size-normal gray">
				{{$t('Register your account and started selling')}}
			</text>
		</view>
        <view class="m-l-20 m-r-20 m-t-20">
			<text class=" uni-bold font-size-big ">{{$t('Step one: Login Details')}}</text>
            <view class="input-row flex column m-t-10 w-100">
                <text class="title uni-bold">{{$t('Your Name')}}</text>
				<view class="flex row space-between w-100">
					<m-input class="m-input w-50 m-r-10 font-size-normal" style="float:left" type="text" focus v-model="firstName" :placeholder="$t('First Name')"></m-input>
					<m-input class="m-input m-input w-50 font-size-normal" style="float:right" type="text"  v-model="surname" :placeholder="$t('Surname')"></m-input>
				</view>
            </view>
			<view class="input-row flex column m-t-10">
			    <text class="title uni-bold">{{$t('Your E-mail')}}</text>
				<text class="font-size-small font-xGray line-height-2 m-b-10" >{{$t("Please make sure you have the right E-mail address below, since you will not be able to update/change E-mail address on your own.")}}</text>
			    <m-input class="m-input font-size-normal w-100" type="text" v-model="email" placeholder="E-mail address"></m-input>
			</view>
			<view class="input-row flex column m-t-10">
			    <text class="title uni-bold">{{$t('Your Password')}}</text>
			    <m-input class="m-input font-size-normal w-100" type="password" displayable v-model="password" placeholder=""></m-input>
			</view>
            <view class="input-row flex column m-t-10">
                <text class="title uni-bold">{{$t('Confirm Password')}}</text>
                <m-input class="m-input font-size-normal w-100" type="password" displayable v-model="confirmPsw" placeholder=""></m-input>
            </view>
        </view>
        <view class="btn-row m-b-30">
            <button class="login-btn"  @tap="bindSignup">{{$t('Continue Registration')}}</button>
        </view>
    </view>
</template>

<script>
    import service from '../../service.js';
	import common from '../../common/common.js'
	import apiUrl from '../../common/apiUrl.js'
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
                providerList: [],
                hasProvider: false,
                account: '',
                password: '',
				confirmPsw: '',
				email:'',
                positionTop: 0,
				firstName: '',
				surname: '',
				
            }
        },
        computed: mapState(['forcedLogin']),
		onLoad(){
			this.getThirdToken()
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Signup")
			});
		},
        methods: {
			getThirdToken(){
				var that = this
				uni.request({
				    url: apiUrl.getTokenApi, //仅为示例，并非真实接口地址。
				    data: {
				        appId: common.appId,
						appSecret: common.appSecret
				    },
				    success: (res) => {
				        console.log(res.data);
						
						if(res.data != null) {
							uni.setStorageSync("token",res.data.data.systemToken);
						}
				    }
				});
			},
            bindSignup() {	
				this.firstName = this.firstName.trim()
				this.surname = this.surname.trim()
				this.email = this.email.trim()
				
                if(this.firstName == "" || !/^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/.test(this.firstName)){
                	uni.showToast({
                	    icon: 'none',
                	    title: this.$t('Please input correct first name')
                	});
                	return;
                } else if(this.surname == "" || !/^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/.test(this.surname)){
                	uni.showToast({
                	    icon: 'none',
                	    title: this.$t('Please input correct surname')
                	});
                	return;
                } else if(!common.isEmail(this.email)){
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
                } else if(this.password != this.confirmPsw) {
					uni.showToast({
					    icon: 'none',
					    title: this.$t('Please input correct confirm password')
					});
					return;
				}
				showLoading(this.$t('Loading'))
				uni.request({
				    url: apiUrl.signUp, //仅为示例，并非真实接口地址。
					method: "POST",
				    data: {
				        token: uni.getStorageSync("token"),
						email: this.email,
						basetext: common.basetext,
						scene: common.scene + "21130x",
						password: this.password,
						nickName: this.firstName,
						surname: this.surname,
						ad_id: '',
						is_portal: 1
				    },
				    success: (res) => {
				        console.log(res.data);
						hideLoading()
						if(res.data != null && res.data.code == 0) {
							uni.setStorageSync("user_name", this.firstName )
							uni.setStorageSync("email",this.email)
							uni.setStorageSync("password",this.password)
							uni.setStorageSync("user_hash",res.data.data.hash)
							uni.reLaunch({
							    url: '../register/register_step2',
							});
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
            oauth(value) {
                uni.login({
                    provider: value,
                    success: (res) => {
                        uni.getUserInfo({
                            provider: value,
                            success: (infoRes) => {
                                /**
                                 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
                                 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
                                 */
                                this.toMain(infoRes.userInfo.nickName);
                            }
                        });
                    },
                    fail: (err) => {
                        console.error('授权登录失败：' + JSON.stringify(err));
                    }
                });
            },
            toMain(userName) {
                this.login(userName);
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../information/information',
                    });
                } else {
                    uni.navigateBack();
                }

            }
        },
        onReady() {

        }
    }
</script>

<style>
	@import '../../common/uni.css';
	.content {
		background:white;
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
		width:100%;
		padding:60upx 40upx;
		padding-top:30upx;
		background-color: #F8F8F8;
	}
	
	.login-logo {
		height: 32upx !important;
		width: 310upx;
		
	}
	
	.btn-row {
		
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
		margin-left:20upx
	}
</style>
