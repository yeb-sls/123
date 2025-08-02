<template>
  <view class="placeholder-component">
    <view class="placeholder-content">
      <view class="placeholder-icon">⏳</view>
      <view class="placeholder-text">加载中...</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PlaceholderComponent',
  data() {
    return {}
  }
}
</script>

<style scoped>
.placeholder-component {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  min-height: 100rpx;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.placeholder-icon {
  font-size: 32rpx;
  color: #6c757d;
}

.placeholder-text {
  font-size: 24rpx;
  color: #6c757d;
}
</style> 