<template>
	<view class="content w-100">
		<!-- #ifdef APP-PLUS -->
<!-- 		<view class="status_bar">
			<view class="top_view"></view>
		</view> -->
		<!-- #endif -->
		<view class="data m-b-50 m-l-10 m-r-10 m-t-10">
			<web-view :src="url" class="m-l-10 m-r-10 m-t-20"></web-view>
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

	export default {
		data() {
			return {
				url:"https://portal.asialand.com.au/asialand/public/privacy-asialand"
			}
		},
		onShow() {
			uni.setNavigationBarTitle({ // 修改头部标题
				title: this.$t("Privacy Policy")
			});
		},
		methods: {
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

	.data {
		width: 100%;
		padding: 40upx;
		box-sizing: border-box;
	}

	.head {
		width: 160upx;
		height: 160upx;
	}
</style>
