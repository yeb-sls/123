<template>
  <view class="success-bg">
    <view class="success-container">
      <!-- 成功图标 -->
      <view class="success-icon">
        <text class="icon">✅</text>
      </view>
      
      <!-- 成功标题 -->
      <view class="success-title">报名成功</view>
      <view class="success-subtitle">您的专场法会报名已提交</view>
      
      <!-- 成功提示 -->
      <view class="success-msg">
        工作人员将在24小时内与您联系确认具体日期，请保持电话畅通。
      </view>

      <!-- 订单信息 -->
      <view class="order-section">
        <view class="section-title">订单信息</view>
        <view class="order-card">
          <view class="order-item">
            <text class="order-label">订单编号</text>
            <text class="order-value">{{ orderInfo.orderNumber }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">法会项目</text>
            <text class="order-value">{{ orderInfo.fahuiProject ? orderInfo.fahuiProject.name : '' }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">报名人数</text>
            <text class="order-value">{{ orderInfo.applicants ? orderInfo.applicants.length : 0 }} 人</text>
          </view>
          <view class="order-item">
            <text class="order-label">支付金额</text>
            <text class="order-value total-price">¥{{ orderInfo.totalFee }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">支付方式</text>
            <text class="order-value">{{ paymentMethodText }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">支付时间</text>
            <text class="order-value">{{ payTimeText }}</text>
          </view>
        </view>
      </view>

      <!-- 报名人信息 -->
      <view class="applicants-section">
        <view class="section-title">报名人信息</view>
        <view class="applicants-card">
          <view v-for="(applicant, index) in orderInfo.applicants" :key="'applicant-' + index" class="applicant-item">
            <view class="applicant-header">
              <text class="applicant-title">报名人 {{ index + 1 }}</text>
            </view>
            <view class="applicant-info">
              <text class="info-text">{{ applicant.name }} | {{ applicant.gender }} | {{ applicant.phone }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 代办物品（如果有） -->
      <view v-if="orderInfo.goods && orderInfo.goods.length > 0" class="goods-section">
        <view class="section-title">代办物品</view>
        <view class="goods-card">
          <view v-for="(item, index) in orderInfo.goods" :key="'goods-' + index" class="goods-item">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-qty">{{ item.qty }} 个</text>
            <text class="goods-price">¥{{ item.price * item.qty }}</text>
          </view>
        </view>
      </view>

      <!-- 收件信息（如果有） -->
      <view v-if="orderInfo.receiver && orderInfo.receiver.name" class="receiver-section">
        <view class="section-title">收件信息</view>
        <view class="receiver-card">
          <view class="receiver-item">
            <text class="receiver-label">收件人</text>
            <text class="receiver-value">{{ orderInfo.receiver.name }}</text>
          </view>
          <view class="receiver-item">
            <text class="receiver-label">联系电话</text>
            <text class="receiver-value">{{ orderInfo.receiver.phone }}</text>
          </view>
          <view class="receiver-item">
            <text class="receiver-label">收件地址</text>
            <text class="receiver-value">{{ orderInfo.receiver.address }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="btn-group">
        <button class="primary-btn" @click="goOrder">查看订单</button>
        <button class="secondary-btn" @click="goHome">返回首页</button>
      </view>

      <!-- 联系信息 -->
      <view class="contact-section">
        <view class="contact-title">如有疑问，请联系我们</view>
        <view class="contact-info">
          <text class="contact-item">📞 客服电话：400-123-4567</text>
          <text class="contact-item">💬 微信客服：fahui_service</text>
          <text class="contact-item">⏰ 服务时间：9:00-18:00</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: {}
    }
  },
  computed: {
    paymentMethodText() {
      const methodMap = {
        'wechat': '微信支付',
        'alipay': '支付宝'
      };
      return methodMap[this.orderInfo.paymentMethod] || '未知';
    },
    payTimeText() {
      if (!this.orderInfo.payTime) return '';
      const date = new Date(this.orderInfo.payTime);
      return this.formatTime(date);
    }
  },
  onLoad() {
    // 获取订单信息
    const orderData = uni.getStorageSync('fahuiOrder');
    if (orderData) {
      this.orderInfo = orderData;
    } else {
      uni.showToast({ title: '未找到订单信息', icon: 'none' });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    formatTime(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    goOrder() {
      // 直接跳转到订单列表页面，避免 switchTab 嵌套 navigateTo
      uni.navigateTo({
        url: '/pages/profile/orders',
        fail: () => {
          uni.showToast({ title: '页面跳转失败', icon: 'none' });
        }
      });
    },
    goHome() {
      uni.switchTab({
        url: '/pages/index/index',
        success: () => {
          console.log('返回首页成功');
        },
        fail: () => {
          uni.showToast({ title: '返回首页失败', icon: 'none' });
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
  padding-bottom: 40rpx;
  padding-top: 1rpx;
}
.success-icon {
  text-align: center;
  margin: 48rpx 0 24rpx 0;
}
.icon {
  font-size: 120rpx;
  color: #4caf50;
}
.success-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin-bottom: 8rpx;
}
.success-subtitle {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 24rpx;
}
.success-msg {
  font-size: 26rpx;
  color: #666;
  text-align: center;
  line-height: 1.6;
  margin: 0 32rpx 32rpx 32rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.order-section, .applicants-section, .goods-section, .receiver-section {
  background: #fff;
  margin: 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
}
.order-card, .applicants-card, .goods-card, .receiver-card {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
}
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.order-item:last-child {
  margin-bottom: 0;
}
.order-label {
  font-size: 28rpx;
  color: #333;
}
.order-value {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}
.total-price {
  color: #ff4d4f;
  font-weight: bold;
}
.applicant-item {
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #e0eaff;
}
.applicant-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}
.applicant-header {
  margin-bottom: 8rpx;
}
.applicant-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #2d8cf0;
}
.applicant-info {
  margin-bottom: 8rpx;
}
.info-text {
  font-size: 26rpx;
  color: #666;
}
.goods-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.goods-item:last-child {
  margin-bottom: 0;
}
.goods-name {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
.goods-qty {
  font-size: 26rpx;
  color: #666;
  margin: 0 16rpx;
}
.goods-price {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}
.receiver-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.receiver-item:last-child {
  margin-bottom: 0;
}
.receiver-label {
  font-size: 28rpx;
  color: #333;
}
.receiver-value {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  flex: 1;
  text-align: right;
}
.btn-group {
  margin: 48rpx 16rpx 24rpx 16rpx;
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
.contact-section {
  margin: 32rpx 16rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.contact-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin-bottom: 16rpx;
}
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.contact-item {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}
</style> 