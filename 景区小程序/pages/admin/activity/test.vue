<template>
  <view class="test-container">
    <text class="test-title">活动管理测试页面</text>
    <text class="test-desc">这是一个测试页面，用于验证编译是否正常</text>
    <button class="test-btn" @click="goBack">返回</button>
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
.test-container {
  padding: 40rpx;
  text-align: center;
}

.test-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.test-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 40rpx;
}

.test-btn {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}
</style> 