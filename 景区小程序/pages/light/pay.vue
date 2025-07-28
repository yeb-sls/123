<template>
  <view class="pay-bg">
    <view class="pay-container">
      <!-- 步骤提示 -->
      <view class="step-bar">
        <view class="step">1. 选择供灯</view>
        <view class="step">2. 信息确认</view>
        <view class="step active">3. 支付</view>
      </view>

      <!-- 费用信息 -->
      <view class="fee-section">
        <view class="fee-title">支付金额</view>
        <view class="fee-amount">¥{{ orderData.totalPrice }}</view>
        <view class="fee-desc">供灯祈福费用</view>
      </view>

      <!-- 支付方式 -->
      <view class="payment-section">
        <view class="section-title">选择支付方式</view>
        <view class="payment-options">
          <view 
            v-for="(option, index) in paymentOptions" 
            :key="index"
            class="payment-option"
            :class="{ active: selectedPayment === index }"
            @click="selectPayment(index)"
          >
            <view class="option-left">
              <text class="payment-icon">{{ option.icon }}</text>
              <text class="payment-name">{{ option.name }}</text>
            </view>
            <view class="option-right">
              <view class="radio" :class="{ checked: selectedPayment === index }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="order-section">
        <view class="section-title">订单信息</view>
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
      </view>

      <!-- 费用明细 -->
      <view class="detail-section">
        <view class="section-title">费用明细</view>
        <view class="detail-item">
          <text>供灯费用：</text>
          <text class="price">¥{{ orderData.price }}</text>
        </view>
        <view class="detail-item" v-if="orderData.receiver && orderData.receiver.name">
          <text>邮寄费用：</text>
          <text class="price">¥{{ shippingFee }}</text>
        </view>
        <view class="detail-total">
          <text>总计：</text>
          <text class="total-price">¥{{ orderData.totalPrice }}</text>
        </view>
      </view>

      <!-- 支付按钮 -->
      <button class="pay-btn" type="primary" :loading="loading" @click="handlePay">
        <text v-if="!loading">立即支付</text>
        <text v-else>支付中...</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      selectedPayment: 0,
      paymentOptions: [
        {
          name: '微信支付',
          icon: '💳'
        },
        {
          name: '支付宝',
          icon: '💰'
        }
      ],
      orderData: {
        towerName: '',
        levelName: '',
        time: '',
        name: '',
        price: 0,
        totalPrice: 0,
        receiver: {}
      },
      shippingFee: 15
    }
  },
  onLoad() {
    // 从本地存储获取订单数据
    const data = uni.getStorageSync('lightOrder')
    if (data) {
      this.orderData = { ...this.orderData, ...data }
    } else {
      // 如果没有数据，返回上一页
      uni.showToast({ 
        title: '请先填写供灯信息', 
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }
  },
  methods: {
    selectPayment(index) {
      this.selectedPayment = index
    },
    handlePay() {
      this.loading = true
      
      // 模拟支付过程
      setTimeout(() => {
        this.loading = false
        
        // 更新订单状态
        const orders = uni.getStorageSync('lightOrders') || []
        if (orders.length > 0) {
          orders[0].status = 'paid'
          orders[0].payTime = new Date().toISOString()
          orders[0].paymentMethod = this.paymentOptions[this.selectedPayment].name
          uni.setStorageSync('lightOrders', orders)
        }
        
        uni.showToast({ 
          title: '支付成功', 
          icon: 'success',
          duration: 2000
        })
        
        setTimeout(() => {
          // 跳转到成功页面
          uni.navigateTo({ 
            url: '/pages/light/success',
            success: () => {
              console.log('跳转到成功页面成功')
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
        }, 2000)
      }, 2000)
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

.step-bar {
  display: flex;
  justify-content: space-between;
  margin: 0 0 32rpx 0;
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

.payment-section {
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

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.payment-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-radius: 12rpx;
  border: 2rpx solid #f0f0f0;
  transition: all 0.3s;
}

.payment-option.active {
  border-color: #2d8cf0;
  background: #f8f9ff;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.payment-icon {
  font-size: 40rpx;
}

.payment-name {
  font-size: 32rpx;
  color: #333;
}

.option-right {
  display: flex;
  align-items: center;
}

.radio {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  position: relative;
}

.radio.checked {
  border-color: #2d8cf0;
  background: #2d8cf0;
}

.radio.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #fff;
}

.order-section {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
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

.detail-section {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  border: 2rpx solid #ffd591;
}

.detail-item {
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

.detail-total {
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
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 