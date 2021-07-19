<template>
	<view class="content w-100">
		<view class="header flex column p-t-20 p-b-20">
			<text class="font-size-big m-l-15 uni-bold">
				{{$t('Reserve')}} {{name}}
			</text>
			<text class="font-size-normal m-l-15">
				{{address}}
			</text>
		</view>
		<view class="data p-l-15 p-r-15">
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Project and unit summary')}}</text>
			</view>
			<view class="table column m-t-20 w-100">
				<view class="tr item back-gray">
					<view class="td font-size-normal  item">{{$t('Project')}}:</view>
					<view class="td uni-bold m-l-10">{{address}}</view>
				</view>
				<view class="tr item">
					<view class="td font-size-normal item">{{$t('Unit No')}}: </view>
					<view class="td uni-bold  m-l-10">{{name}}</view>
				</view>
				<view class="tr item back-gray">
					<view class="td font-size-normal item">{{$t('Total Price')}}:</view>
					<view class="td uni-bold m-l-10">{{price}}</view>
				</view>
			</view>
			
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t("Agent's info")}}</text>
			</view>
			<view class="table column m-t-20 w-100">
				<view class="tr row font-size-normal back-gray">
					<view class="td font-size-normal item">
						{{$t('Agent Name')}}:
					</view>
					<view class="td">
						<view class="uni-bold  line-height-1 p-l-0 item">{{agentName}}</view>
						<view class="font-normal line-height-1 p-l-0 item" style="margin-top:-40upx">{{company}}</view>
					</view>
				</view>
				<view class="tr ">
					<view class="td font-size-normal item">{{$t('Email')}}:</view>
					<view class="td uni-bold  ">{{email}}</view>
				</view>
				<view class="tr back-gray">
					<view class="td font-size-normal item ">{{$t('Phone')}}:</view>
					<view class="td uni-bold ">{{phone}}</view>
				</view>
			</view>
			
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t("Buyer's Info")}}</text>
			</view>
			<view class="font-small m-t-20">{{$t("Please fill in buyer's information as detailed as possible down below for us to start initiate reservation process.")}}</view>
			<view class="font-small col-yellow">{{$t("*Golden Fields are complosary")}}</view>
			
			<view class="font-size-normal uni-bold m-t-20">{{$t("Buyer's Name")}}</view>
			<view class="row flex m-t-10">
				<input class="uni-input m-r-10" v-model="lastName" :placeholder="this.$t('First Name')" />
				<input class="uni-input m-l-10 golden-border"  v-model="sirName" :placeholder="this.$t('Surname')" />
			</view>
			
			<view class="font-size-normal uni-bold m-t-20">{{$t("Buyer's E-mail")}}</view>
			<view class="row flex m-t-10">
				<input class="uni-input " type="email" v-model="buyerEmail" :placeholder="this.$t('E-mail address')" />
			</view>
			
			<view class="font-size-normal uni-bold m-t-20">{{$t("Buyer's Passport No")}}</view>
			<view class="row flex m-t-10">
				<input class="uni-input" v-model="passport" :placeholder="this.$t('Passport')"/>
			</view>
			
			<view class="font-size-normal uni-bold m-t-20">{{$t("FIRB Status")}}</view>
			<view class="select_view font-size-normal m-t-10 golden-border" @click="openStatus">
				<text>{{statusList[selStatus]}}</text>
				<m-icon color="#666666" type="arrowdown" size="20" ></m-icon>
			</view>
			
			<view class="font-size-normal uni-bold m-t-20">{{$t("Purchase Intention")}}</view>
			<view class="select_view font-size-normal m-t-10 golden-border" @click="openPurchase">
				<text>{{purchaseList[selPurchase]}}</text>
				<m-icon color="#666666" type="arrowdown" size="20" ></m-icon>
			</view>
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Trust Account Details')}}</text>
			</view>
			<view class="font-small m-t-20">{{$t("Asialand deposit trust account information")}}</view>
			<view class="font-size-normal back-gray table column p-l-20 p-r-20 p-t-10 p-b-10 m-t-20" >
				<view class="tr row m-t-10">
					<view class="td font-size-normal item p-l-0 line-height-2" style="width:260upx;">{{$t('Account Name')}}:</view> 
					<view class="td uni-bold  m-l-10 line-height-2" >{{accountName}}</view>
				</view>
				
				<view class="tr row m-t-10">
					<view class="td font-size-normal item p-l-0 m-t-5 line-height-1 " >{{$t('Account Number')}}: </view>
					<view class="td uni-bold  m-l-10">{{accountNumber}}</view>
				</view>
				<view class="tr row m-t-10">
					<view class="td font-size-normal item p-l-0 m-t-5 line-height-1">{{$t('BSB')}}:</view> 
					<view class="td uni-bold  m-l-10">{{bsb}}</view>
				</view>
				<view class="tr row m-t-10">
					<view class="td font-size-normal item p-l-0 m-t-5 line-height-1">{{$t('Bank')}}: </view>
					<view class="td uni-bold  m-l-10">{{bank}}</view>
				</view>
				<view class="tr row m-t-10">
					<view class="td font-size-normal item p-l-0 m-t-5 line-height-1">{{$t('Reference')}}: </view>
					<view class="td  m-l-10">{{address}}</view>
				</view>				
			</view>
			
			<view class="font-size-normal back-gray column p-l-20 p-r-20 p-t-10 p-b-10 m-t-20" style="margin-bottom:100upx;">
				<text class="font-size-xsmall font-xGray item p-l-0">{{$t('International Transfer')}}</text>
				<view class="table">
					<view class="tr row m-t-10">
						<view class="td font-size-normal item p-l-0 line-height-1"  style="width:260upx;">{{$t('Swift Code')}}: </view>
						<view class="td uni-bold  m-l-10" style="line-height: 1;">{{swift_code}}</view>
					</view>
					<view class="tr row m-t-10  m-t-20">
						<view class="td font-size-normal item p-l-0 line-height-2" >{{$t("Bank's Address")}}: </view>
						<view class="td uni-bold  m-l-10 line-height-2">{{bankAddress}}</view>				
					</view>
				</view>
				
			</view>
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Important Notice')}}</text>
			</view>
			<view class="font-size-normal back-gray flex column p-l-20 p-r-20 p-t-10 p-b-10 m-t-20" style="margin-bottom:200upx;">
				<text class="m-t-5">{{$t("Important notice letter")}}</text>
			</view>
		</view>
		<view class="footer" @click="gotoReserveSuccess">
			{{$t('Reserve')}} {{name}}
		</view>
		
		<view class="mask" v-show="pickerStatusShow">
			<view class="pickerView" v-show="pickerStatusShow">
				<view class="demo-flex">
					<view class="select-time">
						{{$t('FIRB Status')}}
					</view>
					<view class="of-sourceof" @click="closeStatusMask">
						{{$t('OK')}}
					</view>
				</view>
				<picker-view class="picker" indicator-class="indicator" @change="bindStatusChange">
					<picker-view-column>
						<view class="picker_item" v-for="(item, index) in statusList" :key="index" @click="selectStatus(index)">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
		
		<view class="mask" v-show="pickerPurchaseShow">
			<view class="pickerView" v-show="pickerPurchaseShow">
				<view class="demo-flex">
					<view class="select-time">
						{{$t('Purchase Intention')}}
					</view>
					<view class="of-sourceof" @click="closePurchaseMask">
						{{$t('OK')}}
					</view>
				</view>
				<picker-view class="picker" indicator-class="indicator" @change="bindPurchaseChange">
					<picker-view-column>
						<view class="picker_item" v-for="(item, index) in purchaseList" :key="index" @click="selectPurchase(index)">{{item}}</view>
					</picker-view-column>
				</picker-view>
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
	
	export default{
		data(){
			return {
				hash:'',
				name:"",
				unitNo:"",
				agentName:'',
				company:'',
				email:'',
				phone:'',
				passport:'',
				buyerEmail:'',
				lastName:'',
				sirName:'',
				firbStatus:'',
				occupier:'',
				price:"",
				address:'',
				pickerValue:"",
				customerHash:"",
				statusList:[this.$t("FIRB Client, Overseas"),this.$t("Non-FIRB Client, Local")],
				purchaseList:[this.$t("Owner Occupier"),this.$t("Investment"),this.$t("Other")],

				pickerStatusShow:false,
				pickerPurchaseShow:false,
				selStatus:[0],
				selPurchase:[0],
				accountName:'Asialand Development Group Sales Trust',
				accountNumber:'365 041',
				bsb:'033 106',
				bank:'Westpac',
				reference:'Property Address',
				swift_code:'WPACAU2S',
				bankAddress:'238 High Street, Ashburton VIC 3147'
			}
		},
		onLoad(option){
			this.hash = option.hash			
			//this.hash = "HCPU-8AoIb3KFD5"
			this.getDetailInfo()
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Unit Reservation")
			});
		},
		methods:{
			//---picker view
			openStatus() {
				this.pickerStatusShow = true
			},
			openPurchase(){
				this.pickerPurchaseShow = true
			},
			bindPurchaseChange(e) {
				console.log(e)
				this.selPurchase = e.detail.value[0]
			},
			bindStatusChange(e) {
				console.log(e)
				this.selStatus = e.detail.value[0]
			},
			closeStatusMask() {
				this.pickerStatusShow = false
			},
			closePurchaseMask(){
				this.pickerPurchaseShow = false
			},
			//---
			
			gotoReserveSuccess(){
				this.createCustomer()
				
			},
			createCustomer() {
				var status = 0, investment = 1
				
				if(this.statusList[this.selStatus] == this.$t("FIRB Client, Overseas")) {
					status = 0
				}
				else {
					status = 1
				}
				
				if(this.purchaseList[this.selPurchase] == this.$t("Owner Occupier")) {
					investment = 1
				}
				else if(this.purchaseList[this.selPurchase] == this.$t("Investment")) {
					investment = 2
				}
				else if(this.purchaseList[this.selPurchase] == this.$t("Other")) {
					investment = 3
				}
				
				if(this.sirName == "") {
					uni.showToast({
					    icon: 'none',
					    title: this.$t('Please input surname')
					});
					return;
				}
				
				showLoading()
				var that = this
				uni.request({
				    url: apiUrl.customerCreate, //仅为示例，并非真实接口地址。
					method:"POST",
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        first_name: this.lastName,
						surname: this.sirName,
						firb:status,
						investment:investment,
						token:uni.getStorageSync("token"),
						email:this.email,
						passport:this.passport,
				    },
				    success: (res) => {
				        console.log(res.data);
						if(res.data.code == 0){
							that.customerHash = res.data.data.hash
							that.createOrder()
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
			createOrder(){				
				uni.request({
				    url: apiUrl.orderCreate, //仅为示例，并非真实接口地址。
					method:"POST",
					header:{
						Authorization: "Bearer " + uni.getStorageSync("userInfo").authToken.token
					},
				    data: {
				        unit_hash: this.hash,
						scene: common.scene + "808",
						customer_hash:this.customerHash,
						token:uni.getStorageSync("token"),
						notes:''
				    },
				    success: (res) => {
						hideLoading()
				        console.log(res.data);
						if(res.data.code == 0){
							uni.navigateTo({
							 	url:"/pages/unit/reserve_success?project_name=" + this.address + "&unit_no=" + this.name + "&price=" + this.price + "&id=" + res.data.data.hash
							})
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
			getDetailInfo() {
				var that = this
				showLoading()
				uni.request({
				    url: apiUrl.getUnitDetail, //仅为示例，并非真实接口地址。
				    data: {
				        token: uni.getStorageSync("token"),
						hash: this.hash
				    },
				    success: (res) => {
						hideLoading()
				        console.log(res.data);
						if(res.data.code == 0){
							var userInfo = uni.getStorageSync("userInfo")
							
							that.detailInfo = res.data.data
							that.name = that.detailInfo.unit_number
							that.address = that.detailInfo.property_name
							if(uni.getStorageSync("language") == "en") {
								this.price = '$' + common.currency(that.detailInfo.price_total);
								// this.price = '$' + (that.detailInfo.price_total.toFixed(2) + "").replace(/\d(?=(\d{3})+\.)/g, '$&,');
								// this.price = this.price.substring(0,this.price.indexOf("."))
								// that.price = "$" + (that.detailInfo.price_total / 1000).toFixed(2) + "K" 
								// that.company = userInfo.webportal.title_en
							}
							else {
								this.price = '$' + common.currency(that.detailInfo.price_total);
								// that.price = (that.detailInfo.price_total / 10000).toFixed(2) + that.$t("Million")								
								that.company = userInfo.webportal.title
							}
														
							that.agentName = userInfo.user.name
							that.email = userInfo.user.email
							that.phone = userInfo.user.mobile
						}
						else {
							uni.showToast({
							    icon: 'none',
							    title: res.data.message
							});
						}
				    }
				});
			}
		}
	}
</script>

<style scoped lang="scss">	
	.content{
		padding:0px;
		background: white;
	}
	
	.header{
		background-color:#000000;
		width:100%;
		color:#D9C077;
	}
	
	.data{
		background-color: white;
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
	
	.picker_item {
		height: 88rpx;
		line-height: 68rpx;
		font-size: 32rpx;
		text-align: center;
	}
	
	.item{
		line-height: 80upx;
		padding-left:30upx;
	}
	
	.mark{
		width:16upx;
		height:60upx;
	}
	
	.back-gray{
		background-color: #f8f8f8;
	}

	.uni-input {
		border: 1px solid #ccc;
		height: 36upx !important;

	}	
	
	.select_view {
		flex: 0 0 30%;
		border: 2upx solid #ccc;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0px 20upx;
		height:70upx;
	}
	
	.footer{
		position:fixed;
		bottom:0;
		left:0;
		width:100%;
		height:100upx;
		font-size:36upx;
		text-align: center;
		line-height: 100upx;
		background-color: black;
		color:#D9C077;
		font-weight: bold;
	}
	
	.golden-border{
		border:1px solid #D9C077;
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
	
	.table    { display: table }
	.tr       { display: table-row }
	.thead    { display: table-header-group }
	.tbody    { display: table-row-group }
	.tfoot    { display: table-footer-group }
	.col      { display: table-column }
	.colgroup { display: table-column-group }
	.td, .th   { display: table-cell }
	.caption  { display: table-caption }
</style>