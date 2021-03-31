<template>
	<view class="content w-100">
		<view class="header flex column p-t-30 p-b-20">
			<text class="font-size-big m-l-20 uni-bold">
				{{$t('Reservation Result of')}} {{$t("Successful")}}
			</text>
			<text class="font-size-normal m-l-20">
				{{projectName}}
			</text>
		</view>
		<view class="data p-l-20 p-r-20">
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t('Successful')}}</text>
			</view>
			<view class="font-size-normal m-t-20">{{$t('Congradulations on your successful reservation on thefollowing property')}}:</view>
			<view class="flex column m-t-20">
				<text class="font-size-normal item back-gray">{{$t('Project')}}: <text class="uni-bold m-l-10">{{projectName}}</text></text>
				<text class="font-size-normal item">{{$t('Unit No')}}: <text class="uni-bold  m-l-10">{{unitNo}}</text></text>
				<text class="font-size-normal item back-gray">{{$t('Total Price')}}: <text class="uni-bold m-l-10">{{price}}</text></text>
				<text class="font-size-normal item">{{$t('Time')}}: <text class="uni-bold  m-l-10">{{time}}</text></text>
				<text class="font-size-normal item back-gray">{{$t('Reservation ID')}}: <text class="uni-bold m-l-10">{{id}}</text></text>
			</view>
			
			<view class="label flex row m-t-30">
				<view class="ic_mark"></view>
				<text class="font-size-medium font-gray m-l-10 uni-bold">{{$t("Further Actions and Notice")}}</text>
			</view>
			
			<view class="font-size-normal back-gray flex column p-l-20 p-r-20 p-t-10 p-b-10 m-t-20" style="margin-bottom:200upx;">
				
			</view>
		</view>
		<view class="footer">
			{{$t('Contact Us')}}
		</view>
	</view>
</template>

<script>
	import common from '../../common/common.js';
	
	export default{
		data(){
			return {
				name:"",
				unitNo:"",
				agentName:'',
				company:'',
				email:'',
				price:"",
				time:"",
				id:"",
				projectName:'',
			}
		},
		onLoad(option){
			this.projectName = option.project_name
			this.unitNo = option.unit_no
			this.price = option.price
			this.time = common.getCurrentTime()
			this.id = option.id
		},
		onShow(){
			uni.setNavigationBarTitle({// 修改头部标题
				title: this.$t("Unit Reservation")
			});
		},
		methods:{
			change(e) {
				this.current = e.detail.current;
			},
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
</style>
