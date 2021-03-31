<template>
    <view class="content">
		
		
		<view class="aboutme" v-if="hasLogin">
		<view class="uni-comment-list">
			<view class="uni-comment-face"><image src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png" mode="widthFix"></image></view>
			<view class="uni-comment-body">
				<view class="uni-comment-top">
					<text>子鱼</text>
				</view>
				
				<view class="uni-comment-content">请叫我子鱼</view>
			</view>
		</view>
		</view>
		
		<view class="section" v-if="hasLogin">
		<uni-list>
			<uni-list-item title="我的积分" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" @click='toUserPoint'/>
			
			
		</uni-list>
		</view>	
			
			
		<view class="section" v-if="hasLogin">
		<uni-list>
			<uni-list-item title="我的资讯" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" @tap='toUserInfo'/>
			<uni-list-item title="我的公告" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" @tap='toUserNotice'/>
			<uni-list-item title="我的调研" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" @tap='toUserSurvey'/>
			<uni-list-item title="我的社群" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" @tap='toUserForum'/>
			<!-- <uni-list-item title="我的课程" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" /> -->
			<!-- <uni-list-item title="资料收藏" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" /> -->
			
			
		</uni-list>
		</view>	
		
		<view class="section" v-if="hasLogin">
		<uni-list>
			<uni-list-item title="意见反馈" thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" @click='toUserFeedback'/>
			
		</uni-list>
		</view>	
		
        <view class="btn-row">
            <button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
            <button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
        </view>
    </view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
		components: {
			uniList,
			uniListItem
		},
		
        computed: {
            ...mapState(['hasLogin', 'forcedLogin'])
        },
        methods: {
            ...mapMutations(['logout']),
            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },
            bindLogout() {
                this.logout();
                /**
                 * 如果需要强制登录跳转回登录页面
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../login/login',
                    });
                }
            },
			
			
			
			toUserForum() {
				uni.navigateTo({
					url: './forum'
				});
			},
			toUserInfo() {
				uni.navigateTo({
					url: './info'
				});
			},
			toUserFeedback() {
				uni.navigateTo({
					url: './feedback'
				});
			},
			toUserNotice() {
				uni.navigateTo({
					url: './notice'
				});
			},
			toUserPoint() {
				uni.navigateTo({
					url: './point'
				});
			},
			toUserSurvey() {
				uni.navigateTo({
					url: './survey'
				});
			}
			
			
			
			
			
			
			
			
			
        }
    }
</script>

<style>
	
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #f8f8f8
	}
	
	view {
		font-size: 28upx;
		line-height: inherit
	}
	.section {
		margin-top: 40upx;
	}
	
	
	.example-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		color: #464e52;
		padding: 30upx 30upx 30upx 50upx;
		margin-top: 20upx;
		position: relative;
		background-color: #fdfdfd;
		border-bottom: 1px #f5f5f5 solid
	}
	
	.example-title__after {
		position: relative;
		color: #031e3c
	}
	
	.example-title:after {
		content: '';
		position: absolute;
		left: 30upx;
		margin: auto;
		top: 0;
		bottom: 0;
		width: 6upx;
		height: 32upx;
		background-color: #ccc
	}
	
	.example .example-title {
		margin: 40upx 0
	}
	
	.example-body {
		padding: 30upx;
		background: #fff
	}
	
	.example-info {
		padding: 30upx;
		color: #3b4144;
		background: #fff
	}
	

</style>
