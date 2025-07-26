<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">活动配置管理</text>
      <text class="page-desc">管理活动项目和报名配置</text>
    </view>

    <view class="content">
      <text class="info-text">活动管理功能正在开发中...</text>
      <button class="back-btn" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  color: white;
  text-align: center;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.page-desc {
  font-size: 28rpx;
  opacity: 0.9;
  display: block;
}

.content {
  background: white;
  border-radius: 20rpx;
  padding: 60rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.info-text {
  font-size: 32rpx;
  color: #666;
  display: block;
  margin-bottom: 40rpx;
}

.back-btn {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}
</style> 