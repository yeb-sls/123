<template>
  <view class="success-bg">
    <view class="success-container">
      <!-- 成功图标 -->
      <view class="success-icon">
        <view class="icon-circle">
          <text class="icon-text">✓</text>
        </view>
      </view>

      <!-- 成功标题 -->
      <view class="success-title">供灯成功</view>
      <view class="success-subtitle">您的供灯祈福已成功提交</view>

      <!-- 订单信息 -->
      <view class="order-section">
        <view class="section-title">订单信息</view>
        <view class="order-item">
          <text class="label">订单号：</text>
          <text class="value">{{ orderData.orderId }}</text>
        </view>
        <view class="order-item">
          <text class="label">灯塔：</text>
          <text class="value">{{ orderData.towerName }}</text>
        </view>
        <view class="order-item">
          <text class="label">楼层：</text>
          <text class="value">{{ orderData.levelName }}</text>
        </view>
        <view class="order-item">
          <text class="label">时间：</text>
          <text class="value">{{ orderData.time }}</text>
        </view>
        <view class="order-item">
          <text class="label">供灯人：</text>
          <text class="value">{{ orderData.name }}</text>
        </view>
        <view class="order-item" v-if="orderData.receiver && orderData.receiver.name">
          <text class="label">收件人：</text>
          <text class="value">{{ orderData.receiver.name }}</text>
        </view>
        <view class="order-item">
          <text class="label">支付金额：</text>
          <text class="value amount">¥{{ orderData.totalPrice }}</text>
        </view>
        <view class="order-item">
          <text class="label">支付方式：</text>
          <text class="value">{{ orderData.paymentMethod }}</text>
        </view>
        <view class="order-item">
          <text class="label">支付时间：</text>
          <text class="value">{{ formatTime(orderData.payTime) }}</text>
        </view>
      </view>

      <!-- 温馨提示 -->
      <view class="tips-section">
        <view class="section-title">温馨提示</view>
        <view class="tips-content">
          <view class="tip-item">• 您的供灯祈福将在24小时内生效</view>
          <view class="tip-item">• 可在"个人中心-我的供灯"中查看详情</view>
          <view class="tip-item">• 如有疑问请联系客服</view>
          <view class="tip-item">• 感谢您的虔诚供养，愿您心愿达成</view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="btn-group">
        <button class="btn btn-secondary" @click="goHome">返回首页</button>
        <button class="btn btn-primary" @click="goProfile">查看订单</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderData: {
        orderId: '',
        towerName: '',
        levelName: '',
        time: '',
        name: '',
        totalPrice: 0,
        paymentMethod: '',
        payTime: '',
        receiver: {}
      }
    }
  },
  onLoad() {
    // 从本地存储获取最新的订单数据
    const orders = uni.getStorageSync('lightOrders') || []
    if (orders.length > 0) {
      this.orderData = { ...this.orderData, ...orders[0] }
    } else {
      // 如果没有订单数据，生成模拟数据
      this.orderData = {
        orderId: 'L' + Date.now(),
        towerName: '大愿灯塔A',
        levelName: '一层',
        time: '一月',
        name: '张三',
        totalPrice: 188,
        paymentMethod: '微信支付',
        payTime: new Date().toISOString(),
        receiver: {}
      }
    }
  },
  methods: {
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
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
            title: '返回首页失败', 
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    goProfile() {
      uni.navigateTo({ 
        url: '/pages/profile/light',
        success: () => {
          console.log('跳转到我的供灯成功')
        },
        fail: (err) => {
          console.error('跳转我的供灯失败:', err)
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
  font-size: 28rpx;
  line-height: 1.5;
}

.order-item .label {
  color: #666;
  flex-shrink: 0;
  width: 140rpx;
}

.order-item .value {
  color: #333;
  flex: 1;
  text-align: right;
  word-break: break-all;
}

.order-item .amount {
  color: #ff6b35;
  font-weight: bold;
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
  display: flex;
  align-items: center;
  justify-content: center;
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