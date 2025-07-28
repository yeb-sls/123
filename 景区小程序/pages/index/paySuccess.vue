<template>
  <view class="pay-success-page">
    <view class="success-box">
      <image src="/static/success.png" class="success-img" />
      <view class="success-text">报名成功</view>
      <view class="success-subtext">您的订单已支付成功，感谢您的参与</view>
    </view>

    <view class="order-summary">
      <view class="order-item">
        <text>法会项目：</text>
        <text class="value">{{ order?.project?.name || '-' }}</text>
      </view>
      <view class="order-item">
        <text>人数：</text>
        <text class="value">{{ order?.participants?.length || 0 }} 人</text>
      </view>
      <view class="order-item">
        <text>支付金额：</text>
        <text class="value">￥{{ order?.totalAmount || 0 }}</text>
      </view>
    </view>

    <view class="btn-group">
              <button class="primary-btn" @click="goToOrders">查看我的专场法会</button>
        <button class="secondary-btn" @click="goHome">返回首页</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      order: null
    }
  },
  onLoad() {
    // 此处应该通过参数或缓存传入订单信息
    const tempOrder = uni.getStorageSync('lastFahuiOrder')
    if (tempOrder) {
      this.order = tempOrder
    }
  },
  methods: {
    goToOrders() {
      uni.switchTab({ url: '/pages/profile/index' }) // 或者跳转个人中心专场法会页
    },
    goHome() {
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
}
</script>

<style scoped>
.pay-success-page {
  padding: 60rpx 30rpx;
  text-align: center;
}
.success-box {
  margin-bottom: 40rpx;
}
.success-img {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}
.success-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #2ecc71;
}
.success-subtext {
  font-size: 24rpx;
  color: #666;
  margin-top: 12rpx;
}
.order-summary {
  margin-top: 40rpx;
  text-align: left;
  font-size: 28rpx;
}
.order-item {
  display: flex;
  justify-content: space-between;
  margin: 12rpx 0;
}
.order-item .value {
  color: #333;
  font-weight: 500;
}
.btn-group {
  margin-top: 60rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.primary-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}
.secondary-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
