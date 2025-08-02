<template>
  <view class="pay-page">
    <!-- 步骤提示 -->
    <view class="step-bar">
      <view class="step">1. 选择布施</view>
      <view class="step">2. 信息确认</view>
      <view class="step active">3. 支付</view>
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
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="card" v-if="orderInfo.donateType === '善款'">
      <view class="card-title">
        <text class="icon">💳</text>选择支付方式
      </view>
      <view class="payment-methods">
        <view 
          class="method-item" 
          v-for="(method, index) in paymentMethods" 
          :key="'benefit-' + index"
          :class="{ active: selectedMethod === index }"
          @click="selectMethod(index)"
        >
          <view class="method-icon">{{ method.icon }}</view>
          <view class="method-info">
            <view class="method-name">{{ method.name }}</view>
            <view class="method-desc">{{ method.desc }}</view>
          </view>
          <view class="method-check">
            <text v-if="selectedMethod === index">✓</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="card price-card">
      <view class="card-title">
        <text class="icon">💰</text>费用明细
      </view>
      <view class="price-item" v-if="orderInfo.donateType === '善款'">
        <text>布施金额：</text>
        <text class="price">¥{{ orderInfo.totalPrice }}</text>
      </view>
      <view class="price-item" v-else>
        <text>布施类型：</text>
        <text class="price">{{ orderInfo.donateType }}</text>
      </view>
      <view class="price-total">
        <text>应付金额：</text>
        <text class="total-price">{{ orderInfo.donateType === '善款' ? '¥' + orderInfo.totalPrice : '免费布施' }}</text>
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
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="btn-group">
      <button 
        class="pay-btn" 
        type="primary" 
        :loading="loading" 
        :disabled="orderInfo.donateType === '善款' && selectedMethod === null"
        @click="handlePayment"
      >
        <text v-if="!loading">{{ orderInfo.donateType === '善款' ? '立即支付' : '确认布施' }}</text>
        <text v-else>处理中...</text>
      </button>
      <button class="cancel-btn" type="default" @click="goBack">取消</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      selectedMethod: null,
      orderInfo: {
        orderId: '',
        donateType: '',
        totalPrice: 0,
        name: ''
      },
      paymentMethods: [
        {
          icon: '💳',
          name: '微信支付',
          desc: '推荐使用微信支付'
        },
        {
          icon: '💰',
          name: '支付宝',
          desc: '使用支付宝支付'
        },
        {
          icon: '🏦',
          name: '银行卡',
          desc: '使用银行卡支付'
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
    selectMethod(index) {
      this.selectedMethod = index
    },
    handlePayment() {
      if (this.orderInfo.donateType === '善款' && this.selectedMethod === null) {
        uni.showToast({ 
          title: '请选择支付方式', 
          icon: 'none' 
        })
        return
      }

      this.loading = true

      // 模拟支付过程
      setTimeout(() => {
        this.loading = false

        // 更新订单状态
        const orders = uni.getStorageSync('gongdeOrders') || []
        if (orders.length > 0) {
          orders[0].status = 'paid'
          if (this.orderInfo.donateType === '善款') {
            orders[0].paymentMethod = this.paymentMethods[this.selectedMethod].name
          }
          orders[0].paymentTime = new Date().toISOString()
          uni.setStorageSync('gongdeOrders', orders)
        }

        uni.showToast({ 
          title: this.orderInfo.donateType === '善款' ? '支付成功' : '布施成功', 
          icon: 'success',
          duration: 1500
        })

        setTimeout(() => {
          // 跳转到成功页面
          uni.navigateTo({
            url: '/pages/gongde/success',
            success: () => {
              console.log('跳转到成功页面')
            },
            fail: (err) => {
              console.error('跳转成功页面失败:', err)
              uni.showToast({ 
                title: '页面跳转失败', 
                icon: 'none',
                duration: 2000
              })
            }
          })
        }, 1500)
      }, 2000)
    },
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回上一页成功')
        },
        fail: (err) => {
          console.error('返回上一页失败:', err)
          // 如果返回失败，跳转到功德布施主页
          uni.navigateTo({ 
            url: '/pages/gongde/index',
            fail: () => {
              uni.showToast({ 
                title: '返回失败，请重试', 
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
.pay-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.step-bar {
  display: flex;
  justify-content: space-between;
  margin: 32rpx 16rpx 24rpx 16rpx;
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.step {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #bbb;
  position: relative;
}

.step.active {
  color: #2d8cf0;
  font-weight: bold;
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

.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
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

.payment-methods {
  margin-top: 16rpx;
}

.method-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border: 2rpx solid #e0eaff;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  background: #fff;
  transition: all 0.3s ease;
}

.method-item.active {
  border-color: #2d8cf0;
  background: linear-gradient(135deg, #f0f8ff 0%, #fff 100%);
}

.method-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.method-info {
  flex: 1;
}

.method-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.method-desc {
  font-size: 24rpx;
  color: #999;
}

.method-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #2d8cf0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
}

.price-card {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border: 2rpx solid #ffd591;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  font-size: 28rpx;
  color: #666;
}

.price {
  color: #ff6b35;
  font-weight: bold;
}

.price-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1px solid #ffd591;
  font-size: 30rpx;
  font-weight: bold;
}

.total-price {
  color: #ff4d4f;
  font-size: 32rpx;
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

.btn-group {
  display: flex;
  gap: 24rpx;
  margin: 48rpx 16rpx 0 16rpx;
}

.pay-btn {
  flex: 1;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  letter-spacing: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-btn[disabled] {
  background: #ccc;
  box-shadow: none;
}

.cancel-btn {
  flex: 1;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 