<template>
  <view class="success-bg">
    <view class="success-container">
      <!-- 成功提示 -->
      <view class="success-header">
        <view class="success-icon">✅</view>
        <view class="success-title">供养成功</view>
        <view class="success-desc">您的殿堂供品已成功提交，功德无量</view>
      </view>

      <!-- 订单信息 -->
      <view class="order-card">
        <view class="card-title">
          <text class="icon">📋</text>订单信息
        </view>
        <view class="order-info">
          <view class="info-item">
            <text class="label">订单号：</text>
            <text class="value">{{ orderData.orderId }}</text>
          </view>
          <view class="info-item">
            <text class="label">殿堂：</text>
            <text class="value">{{ orderData.hallName }}</text>
          </view>
          <view class="info-item">
            <text class="label">供奉者：</text>
            <text class="value">{{ orderData.name }}</text>
          </view>
          <view class="info-item">
            <text class="label">支付金额：</text>
            <text class="value price">¥{{ orderData.totalPrice }}</text>
          </view>
          <view class="info-item">
            <text class="label">支付时间：</text>
            <text class="value">{{ formatTime(orderData.payTime) }}</text>
          </view>
        </view>
      </view>

      <!-- 供品清单 -->
      <view class="offerings-card">
        <view class="card-title">
          <text class="icon">🕯️</text>供品清单
        </view>
        <view class="offerings-list">
          <view v-for="(offering, index) in orderData.offerings" :key="index" class="offering-item">
            <view class="offering-info">
              <text class="offering-icon">{{ getOfferingIcon(offering.name) }}</text>
              <view class="offering-details">
                <text class="offering-name">{{ offering.name }}</text>
                <text class="offering-desc">{{ offering.description }}</text>
              </view>
            </view>
            <view class="offering-qty">
              <text>{{ offering.qty }}{{ offering.unit }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 祈福语 -->
      <view class="wish-card" v-if="orderData.wish">
        <view class="card-title">
          <text class="icon">🙏</text>祈福语
        </view>
        <view class="wish-content">
          <text>{{ orderData.wish }}</text>
        </view>
      </view>

      <!-- 收件信息 -->
      <view class="receiver-card" v-if="orderData.receiver && orderData.receiver.name">
        <view class="card-title">
          <text class="icon">📦</text>收件信息
        </view>
        <view class="receiver-info">
          <view class="info-item">
            <text class="label">收件人：</text>
            <text class="value">{{ orderData.receiver.name }}</text>
          </view>
          <view class="info-item">
            <text class="label">电话：</text>
            <text class="value">{{ orderData.receiver.phone }}</text>
          </view>
          <view class="info-item">
            <text class="label">地址：</text>
            <text class="value">{{ orderData.receiver.address }}</text>
          </view>
          <view class="info-item" v-if="orderData.receiver.remark">
            <text class="label">备注：</text>
            <text class="value">{{ orderData.receiver.remark }}</text>
          </view>
        </view>
      </view>

      <!-- 功德回向 -->
      <view class="merit-card">
        <view class="card-title">
          <text class="icon">✨</text>功德回向
        </view>
        <view class="merit-content">
          <text>愿以此功德，庄严佛净土，上报四重恩，下济三途苦。</text>
          <text>若有见闻者，悉发菩提心，尽此一报身，同生极乐国。</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn primary" @click="goHome">返回首页</button>
        <button class="action-btn secondary" @click="goOrders">查看订单</button>
        <button class="action-btn secondary" @click="goShare">分享功德</button>
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
        hallName: '',
        name: '',
        offerings: [],
        totalPrice: 0,
        wish: '',
        receiver: {},
        payTime: '',
        status: ''
      }
    }
  },
  onLoad() {
    // 从本地存储获取最新的订单数据
    const orders = uni.getStorageSync('hallOrders') || []
    if (orders.length > 0) {
      this.orderData = { ...this.orderData, ...orders[0] }
    } else {
      // 如果没有订单数据，显示默认信息
      this.orderData = {
        orderId: 'H' + Date.now(),
        hallName: '大雄宝殿',
        name: '信众',
        offerings: [
          {
            name: '香',
            description: '清香一炷，祈愿平安',
            qty: 1,
            unit: '炷'
          }
        ],
        totalPrice: 20,
        payTime: new Date().toISOString(),
        status: 'paid'
      }
    }
  },
  methods: {
    getOfferingIcon(name) {
      const iconMap = {
        '香': '🕯️',
        '花': '🌸',
        '灯': '💡',
        '水': '💧',
        '果': '🍎',
        '食': '🍚'
      }
      return iconMap[name] || '🕯️'
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
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
    goOrders() {
      uni.navigateTo({
        url: '/pages/profile/hall',
        success: () => {
          console.log('跳转到我的供养页面成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
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
    goShare() {
      // 模拟分享功能
      uni.showModal({
        title: '分享功德',
        content: '愿将此功德回向给一切众生，愿众生离苦得乐，早证菩提！',
        showCancel: false,
        confirmText: '阿弥陀佛',
        success: () => {
          console.log('分享功德成功')
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
  padding-bottom: 40rpx;
}

.success-container {
  padding: 32rpx 16rpx 0 16rpx;
}

.success-header {
  background: #fff;
  border-radius: 18rpx;
  padding: 48rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  text-align: center;
}

.success-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.success-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 12rpx;
}

.success-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.order-card,
.offerings-card,
.wish-card,
.receiver-card,
.merit-card {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
}

.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
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

.offerings-list {
  margin-bottom: 16rpx;
}

.offering-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.offering-item:last-child {
  border-bottom: none;
}

.offering-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.offering-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.offering-details {
  flex: 1;
}

.offering-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.offering-desc {
  font-size: 24rpx;
  color: #666;
}

.offering-qty {
  font-size: 28rpx;
  color: #666;
}

.wish-content {
  background: #f8f9fa;
  padding: 16rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.receiver-info {
  margin-bottom: 16rpx;
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

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 48rpx;
}

.action-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.primary {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
}
</style> 