<template>
  <view class="success-page">
    <!-- 成功图标 -->
    <view class="success-icon">
      <text class="icon">✅</text>
    </view>

    <!-- 成功标题 -->
    <view class="success-title">
      <text>{{ orderInfo.donateType === '善款' ? '支付成功' : '布施成功' }}</text>
    </view>

    <!-- 成功描述 -->
    <view class="success-desc">
      <text>{{ orderInfo.donateType === '善款' ? '感谢您的善款布施，功德无量！' : '感谢您的布施，功德无量！' }}</text>
    </view>

    <!-- 订单信息 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">📋</text>订单信息
      </view>
      <view class="order-info">
        <view class="info-item">
          <text class="label">订单号：</text>
          <text class="value">{{ orderInfo.orderId }}</text>
        </view>
        <view class="info-item">
          <text class="label">布施类型：</text>
          <text class="value">{{ orderInfo.donateType }}</text>
        </view>
        <view class="info-item" v-if="orderInfo.donateType === '善款'">
          <text class="label">布施金额：</text>
          <text class="value price">¥{{ orderInfo.totalPrice }}</text>
        </view>
        <view class="info-item">
          <text class="label">布施人：</text>
          <text class="value">{{ orderInfo.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">完成时间：</text>
          <text class="value">{{ formatTime(orderInfo.paymentTime || orderInfo.createTime) }}</text>
        </view>
      </view>
    </view>

    <!-- 功德回向 -->
    <view class="card merit-card">
      <view class="card-title">
        <text class="icon">✨</text>功德回向
      </view>
      <view class="merit-content">
        <text>愿以此布施功德，回向给一切众生，愿众生离苦得乐，早证菩提。</text>
        <text>愿以此功德，庄严佛净土，上报四重恩，下济三途苦。</text>
        <text>愿以此功德，回向给您的家人朋友，愿他们身体健康，平安吉祥。</text>
      </view>
    </view>

    <!-- 布施功德 -->
    <view class="card merit-benefits">
      <view class="card-title">
        <text class="icon">🌟</text>布施功德
      </view>
      <view class="benefits-list">
        <view class="benefit-item" v-for="(benefit, index) in benefits" :key="'benefit-' + index">
          <text class="benefit-icon">{{ benefit.icon }}</text>
          <text class="benefit-text">{{ benefit.text }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="btn-group">
      <button class="primary-btn" type="primary" @click="goHome">
        <text class="icon">🏠</text>返回首页
      </button>
      <button class="secondary-btn" type="default" @click="goRecord">
        <text class="icon">📋</text>查看记录
      </button>
    </view>

    <!-- 分享按钮 -->
    <view class="share-section">
      <button class="share-btn" @click="shareOrder">
        <text class="icon">📤</text>分享功德
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: {
        orderId: '',
        donateType: '',
        totalPrice: 0,
        name: '',
        paymentTime: '',
        createTime: ''
      },
      benefits: [
        {
          icon: '✨',
          text: '消除业障，增长福慧'
        },
        {
          icon: '🕊️',
          text: '家庭和睦，事业顺遂'
        },
        {
          icon: '🌺',
          text: '身心健康，平安吉祥'
        },
        {
          icon: '🌟',
          text: '功德无量，利益众生'
        }
      ]
    }
  },
  onLoad() {
    // 从本地存储获取订单信息
    const orders = uni.getStorageSync('gongdeOrders') || []
    if (orders.length > 0) {
      this.orderInfo = { ...this.orderInfo, ...orders[0] }
    } else {
      // 如果没有订单信息，返回上一页
      uni.showToast({ 
        title: '订单信息不存在', 
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }
  },
  methods: {
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    goHome() {
      uni.switchTab({
        url: '/pages/index/index',
        success: () => {
          console.log('返回首页成功')
        },
        fail: (err) => {
          console.error('返回首页失败:', err)
          uni.showToast({ 
            title: '返回失败，请重试', 
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    goRecord() {
      uni.navigateTo({
        url: '/pages/profile/gongde',
        success: () => {
          console.log('跳转到功德记录页成功')
        },
        fail: (err) => {
          console.error('跳转记录页失败:', err)
          // 如果跳转失败，跳转到个人中心
          uni.switchTab({
            url: '/pages/profile/index',
            fail: () => {
              uni.showToast({ 
                title: '页面跳转失败', 
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    },
    shareOrder() {
      const shareText = `我在${this.orderInfo.donateType}布施中完成了布施，功德无量！愿以此功德回向给一切众生。`
      
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        href: 'https://example.com',
        title: '功德布施',
        summary: shareText,
        imageUrl: '/static/logo.png',
        success: () => {
          uni.showToast({ 
            title: '分享成功', 
            icon: 'success',
            duration: 1500
          })
        },
        fail: () => {
          uni.showToast({ 
            title: '分享失败', 
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.success-icon {
  text-align: center;
  margin: 80rpx 0 32rpx 0;
}

.icon {
  font-size: 120rpx;
}

.success-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
  letter-spacing: 2rpx;
}

.success-desc {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 48rpx;
  padding: 0 32rpx;
  line-height: 1.6;
}

.card {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  margin: 24rpx 16rpx 0 16rpx;
  padding: 32rpx 24rpx 12rpx 24rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
}

.order-info {
  margin-top: 16rpx;
}

.info-item {
  display: flex;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.label {
  width: 140rpx;
  color: #666;
  flex-shrink: 0;
}

.value {
  flex: 1;
  color: #333;
  word-break: break-all;
}

.value.price {
  color: #ff4d4f;
  font-weight: bold;
}

.merit-card {
  background: linear-gradient(135deg, #f0f8ff 0%, #fff 100%);
  border: 2rpx solid #b3c6e0;
}

.merit-content {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  padding: 20rpx;
  border-radius: 8rpx;
  border: 2rpx solid #ffd591;
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  text-align: center;
}

.merit-benefits {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border: 2rpx solid #ffd591;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.benefit-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 12rpx;
  border: 2rpx solid #ffd591;
}

.benefit-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.benefit-text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.btn-group {
  display: flex;
  gap: 24rpx;
  margin: 48rpx 16rpx 0 16rpx;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}

.secondary-btn {
  background: #f8f9fa;
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
}

.share-section {
  margin: 24rpx 16rpx 0 16rpx;
}

.share-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  letter-spacing: 2rpx;
}
</style>