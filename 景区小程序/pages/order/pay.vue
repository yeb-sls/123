<template>
  <view class="pay-bg">
    <view class="pay-container">
      <view class="pay-title">活动报名支付</view>
      
      <view class="fee-section">
        <view class="fee-title">报名费用</view>
        <view class="fee-amount">¥{{ feeAmount }}</view>
        <view class="fee-desc">感谢您的参与，祝您活动愉快！</view>
      </view>

      <view class="info-section">
        <view class="section-title">报名信息</view>
        <view class="info-item">
          <text class="label">活动：</text>
          <text class="value">{{ form.activity }}</text>
        </view>
        <view class="info-item">
          <text class="label">报名人：</text>
          <text class="value">{{ form.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ form.phone }}</text>
        </view>
      </view>

      <button class="pay-btn" type="primary" @click="handlePay">
        立即支付
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      feeAmount: 50
    }
  },
  onLoad() {
    this.form = uni.getStorageSync('orderForm') || {};
    // 根据活动类型设置费用
    this.setFeeAmount();
  },
  methods: {
    setFeeAmount() {
      const feeMap = {
        '祈福法会': 100,
        '超度法会': 150,
        '开光法会': 200,
        '放生法会': 80,
        '扶贫助学': 50,
        '敬老助残': 30,
        '环保公益': 20,
        '医疗救助': 100,
        '佛学讲座': 60,
        '禅修体验': 120,
        '文化展览': 40,
        '音乐会': 80
      };
      this.feeAmount = feeMap[this.form.activity] || 50;
    },
    handlePay() {
      const loadingText = '支付中...';
      uni.showLoading({ title: loadingText });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 跳转到成功页面
        uni.navigateTo({ 
          url: '/pages/order/success',
          success: () => {
            console.log('跳转到活动报名成功页成功');
          },
          fail: (err) => {
            console.error('跳转成功页失败:', err);
            uni.showToast({ 
              title: '跳转失败，请重试', 
              icon: 'none',
              duration: 2000
            });
          }
        });
      }, 1200);
    }
  }
}
</script>

<style scoped>
.pay-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.pay-container {
  padding: 32rpx 16rpx 40rpx 16rpx;
}
.pay-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin-bottom: 32rpx;
  letter-spacing: 2rpx;
}
.fee-section {
  background: #fff;
  border-radius: 18rpx;
  padding: 40rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  text-align: center;
}
.fee-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}
.fee-amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #ff6b35;
  margin-bottom: 8rpx;
}
.fee-desc {
  font-size: 24rpx;
  color: #999;
}
.info-section {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  letter-spacing: 2rpx;
}
.info-item {
  display: flex;
  margin-bottom: 16rpx;
  align-items: flex-start;
}
.label {
  font-size: 28rpx;
  color: #666;
  min-width: 120rpx;
  flex-shrink: 0;
}
.value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
.pay-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  letter-spacing: 2rpx;
  margin-top: 32rpx;
}
</style>