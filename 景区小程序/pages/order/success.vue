<template>
  <view class="success-bg">
    <view class="success-container">
      <view class="success-icon">
        <view class="icon-circle">
          <text class="icon-text">✓</text>
        </view>
      </view>
      <view class="success-title">报名成功</view>
      <view class="success-subtitle">您的活动报名已成功提交</view>
      
      <view class="order-section">
        <view class="section-title">报名信息</view>
        <view class="order-item">
          <text class="label">活动类型：</text>
          <text class="value">{{ form.activityType }}</text>
        </view>
        <view class="order-item">
          <text class="label">具体活动：</text>
          <text class="value">{{ form.activity }}</text>
        </view>
        <view class="order-item">
          <text class="label">报名人：</text>
          <text class="value">{{ form.name }}</text>
        </view>
        <view class="order-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ form.phone }}</text>
        </view>
        <view class="order-item">
          <text class="label">报名费用：</text>
          <text class="value">¥{{ feeAmount }}</text>
        </view>
      </view>

      <view class="tips-section">
        <view class="section-title">温馨提示</view>
        <view class="tips-content">
          <view class="tip-item">• 感谢您的参与，祝您活动愉快！</view>
          <view class="tip-item">• 活动开始前会收到短信通知</view>
          <view class="tip-item">• 可在"个人中心-我的活动"中查看记录</view>
          <view class="tip-item">• 如有疑问请联系客服</view>
        </view>
      </view>

      <view class="btn-group">
        <button class="btn btn-secondary" @click="goHome">返回首页</button>
        <button class="btn btn-primary" @click="goProfile">查看记录</button>
      </view>
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
    goHome() {
      uni.switchTab({ 
        url: '/pages/index/index',
        success: () => {
          console.log('返回首页成功');
        },
        fail: (err) => {
          console.error('返回首页失败:', err);
          uni.showToast({ 
            title: '返回首页失败', 
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    goProfile() {
      uni.navigateTo({ 
        url: '/pages/profile/activity',
        success: () => {
          console.log('跳转到活动记录页成功');
        },
        fail: (err) => {
          console.error('跳转记录页失败:', err);
          uni.showToast({ 
            title: '跳转失败，请重试', 
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.success-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.success-container {
  padding: 32rpx 16rpx 40rpx 16rpx;
}
.success-icon {
  text-align: center;
  margin: 48rpx 0 32rpx 0;
}
.icon-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 8rpx 24rpx #b3c6e0;
}
.icon-text {
  font-size: 48rpx;
  color: #fff;
  font-weight: bold;
}
.success-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin-bottom: 16rpx;
  letter-spacing: 2rpx;
}
.success-subtitle {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 48rpx;
}
.order-section {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  letter-spacing: 2rpx;
}
.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.order-item .label {
  font-size: 28rpx;
  color: #666;
}
.order-item .value {
  font-size: 28rpx;
  color: #333;
}
.tips-section {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.tips-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.tip-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
.btn-group {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}
.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
}
.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
}
.btn-primary {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}
</style> 