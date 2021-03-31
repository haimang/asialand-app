<script>
	import apiUrl from 'common/apiUrl.js'; 
	import common from 'common/common.js';
	
	export default {
		globalData: {  
			isLogin: false,
			language:'en'
		},
		onLaunch: function() {
			uni.loadFontFace({
			  family: 'Bitstream Vera Serif Bold',
			  source: 'url("https://sungd.github.io/Pacifico.ttf")',
			  success() {
			      console.log('success')
			  }
			})
			
			if(uni.getStorageSync("language") == "en") {
				uni.setTabBarItem({
				  index: 0,
				  text: 'Search',
				})
				uni.setTabBarItem({
				  index: 1,
				  text: 'Promotions',
				})
				uni.setTabBarItem({
				  index: 2,
				  text: 'Notifications',
				})
				uni.setTabBarItem({
				  index: 3,
				  text: 'Member',
				})
			}
			else if(uni.getStorageSync("language") == "zh_CN") {
				uni.setTabBarItem({
				  index: 0,
				  text: '搜  索',
				})
				uni.setTabBarItem({
				  index: 1,
				  text: '推  广',
				})
				uni.setTabBarItem({
				  index: 2,
				  text: '推  送',
				})
				uni.setTabBarItem({
				  index: 3,
				  text: '成  员',
				})
			}
			
			//this.setPushSetting();
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			this.getThirdToken()
			uni.setTabBarItem({
			  index: 0,
			  text: this.$t("Search")//'搜  索',
			})
			uni.setTabBarItem({
			  index: 1,
			  text: this.$t("Promotions") //'推  广',
			})
			uni.setTabBarItem({
			  index: 2,
			  text: this.$t("Notifications") //'推  送',
			})
			uni.setTabBarItem({
			  index: 3,
			  text: this.$t("Member") //'成  员',
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		
		methods:{
			setPushSetting(){
				this.claerBadge()
				// #ifdef APP-PLUS
				var pinf = plus.push.getClientInfo();
				var cid = cid = pinf.clientid;		
				if(cid == null) {
					pinf = plus.push.getClientInfo();
					cid = cid = pinf.clientid;
				}
				console.log('cid：' + cid);
				uni.setStorageSync("client_id",cid);
				if(uni.getStorageSync("isLogin")) {
					this.updateClientId(cid);
				}			
				
				plus.push.addEventListener(
					'click',
					function(msg) {
						this.claerBadge()
						console.log("push message : " + msg)
						if(msg.payload != null) {
							var type = msg.payload.substring(0,4)
							console.log("payload : " + msg.payload)
							console.log("push type : " + type)
							
							if(type == "HCPP") {
								console.log("Push Click : GO TO HOUSE : " + '/pages/house/detail?hash=' + msg.payload)
								uni.navigateTo({
									url: '/pages/house/detail?hash=' + msg.payload
								});	
							}
							else if(type == "HCAR") {
								console.log("Push Click : GO TO ARTICLE")
								uni.navigateTo({
									url: '/pages/news/detail?hash=' + msg.payload
								});	
							}
							else if(type == "HCMS") {
								console.log("Push Click : GO TO PUSH DETAIL")
								uni.navigateTo({
									url: '/pages/notification/detail?hash=' + msg.payload
								});	
							}
						}
					},
					false
				);
				plus.push.addEventListener(
					'receive',
					function(msg) {
						// uni.navigateTo({
						// 	url: 'pages/new_order/new_order'
						// });
					},
					false
				);
				// #endif
			},
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
				
				setTimeout(function () { this.getThirdToken()}.bind(this), 1000* 600)
			},
			updateClientId(cId) {
				var that = this
				uni.request({
				    url: apiUrl.updateClientId, //仅为示例，并非真实接口地址。
					method:"POST",
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        client_id: cId,
						token: uni.getStorageSync("token")
				    },
				    success: (res) => {
				        console.log(res.data);				
				    }
				});
			},
			createLocalMsg(msg) {  
				plus.push.createMessage(msg.content, this.paramsURL(msg.payload), {  
					title: msg.title,  
					delay: 0,  
					sound: 'system'  
				})  
			},
			claerBadge(){
				if (uni.getSystemInfoSync().platform == 'ios') {
					//导入ios UIApplication  
					var UIApplication = plus.ios.import("UIApplication");  
					var app = UIApplication.sharedApplication();  
					//获取应用图标的数量  
					// var oldNum = app.applicationIconBadgeNumber();  
					// var newNum = oldNum - 1;  
					//设置应用图标的数量  
					plus.runtime.setBadgeNumber(0);  
					//导入个推原生类  
					var GeTuiSdk = plus.ios.importClass('GeTuiSdk');  
					GeTuiSdk.setBadge(0);
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	page,
	view {
		// display: flex;/* uni-app默认使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。若不需要flex布局可删除本行*/
	}
	
	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
	}
	
	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	
	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	
	/* #endif */
	
	/* #ifdef MP-ALIPAY */
	page {
		min-height: 100vh;
	}
	
	/* #endif */
	
	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	
	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #f8f8f8;
		padding: 20upx;
	}
	
	.input-group {
		background-color: #ffffff;
		margin-top: 40upx;
		position: relative;
	}
	
	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
		font-size:28upx;
	}
	
	.input-row .title {		
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 0upx;
		line-height: 50upx;
		font-size:28upx;
	}
	
	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15upx;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.btn-row {
		margin-top: 50upx;
		padding: 20upx;
	}
	
	button.primary {
		background-color: #0faeff;
	}
	
	.uni-input-placeholder {
		text-align: left;
		font-size:28upx;
	}
	
	.uni-checkbox-input{ background: transparent !important; border-color:#333333 !important; width:30upx !important;height:30upx !important;}
	.uni-checkbox-input-checked{ background: transparent !important; border-color:#333333 !important;color:#333333 !important; width:30upx!important;height:30upx!important;}

	.notLogin{
		background-color:white; 
		justify-content: center;
		align-items: center;
		text-align: center;
		padding:0px 40upx;
		position: absolute;
		bottom: 100px;
		width:100%;
	}
	
	.status_bar {
	    height: var(--status-bar-height);  
	    width: 100%;  
	    background-color: #f8f8f8;  
	}  
	.top_view {  
	    height: var(--status-bar-height);  
	    width: 100%;  
	    position: fixed;  
	    background-color: #f8f8f8;  
	    top: 0;  
	    z-index: 999;  
	} 
</style>

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
	
	.fit-width{
		box-sizing: border-box !important;
	}
	

</style>
