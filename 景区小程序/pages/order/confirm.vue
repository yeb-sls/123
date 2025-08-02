<template>
  <view class="confirm-bg">
    <view class="confirm-container">
      <view class="confirm-title">活动报名确认</view>

      <view class="info-section">
        <view class="section-title">活动信息</view>
        <view class="info-item">
          <text class="label">活动类型：</text>
          <text class="value">{{ form.activityType || '未选择' }}</text>
        </view>
        <view class="info-item">
          <text class="label">具体活动：</text>
          <text class="value">{{ form.activity || '未选择' }}</text>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">报名人信息</view>
        <view class="info-item">
          <text class="label">姓名：</text>
          <text class="value">{{ form.name || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ form.phone || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="label">身份证号：</text>
          <text class="value">{{ form.idCard || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系地址：</text>
          <text class="value">{{ form.address || '未填写' }}</text>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">紧急联系人</view>
        <view class="info-item">
          <text class="label">姓名：</text>
          <text class="value">{{ form.emergencyName || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ form.emergencyPhone || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="label">关系：</text>
          <text class="value">{{ form.emergencyRelation || '未填写' }}</text>
        </view>
      </view>

      <view class="info-section" v-if="form.specialNeeds">
        <view class="section-title">特殊需求</view>
        <view class="special-needs-content">{{ form.specialNeeds }}</view>
      </view>

      <view class="btn-group">
        <button class="btn btn-secondary" @click="goBack">返回修改</button>
        <button class="btn btn-primary" @click="confirmSubmit">确认提交</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  onLoad() {
    this.form = uni.getStorageSync('orderForm') || {};
    // 调试输出
    console.log('活动报名确认页读取到的表单数据:', this.form);
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    confirmSubmit() {
      uni.showLoading({ title: '跳转支付...' });
      
      setTimeout(() => {
        uni.hideLoading();
        // 跳转到支付页面
        uni.navigateTo({ 
          url: '/pages/order/pay',
          success: () => {
            console.log('跳转到活动报名支付页成功');
          },
          fail: (err) => {
            console.error('跳转支付页失败:', err);
            uni.showToast({ 
              title: '跳转失败，请重试', 
              icon: 'none',
              duration: 2000
            });
          }
        });
      }, 800);
    }
  }
}
</script>

<style scoped>
.confirm-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.confirm-container {
  padding: 32rpx 16rpx 40rpx 16rpx;
}
.confirm-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin-bottom: 32rpx;
  letter-spacing: 2rpx;
}
.info-section {
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
.info-item {
  display: flex;
  margin-bottom: 16rpx;
  align-items: flex-start;
}
.label {
  font-size: 28rpx;
  color: #666;
  min-width: 160rpx;
  flex-shrink: 0;
}
.value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
.special-needs-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 16rpx;
  border-radius: 8rpx;
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