<template>
  <view class="confirm-page">
    <!-- 步骤提示 -->
    <view class="step-bar">
      <view class="step">1. 选择供品</view>
      <view class="step active">2. 信息确认</view>
      <view class="step">3. 支付</view>
    </view>

    <!-- 殿堂信息确认 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">🏛️</text>殿堂信息
      </view>
      <view class="info-item">
        <text class="label">殿堂：</text>
        <text class="value">{{ confirmData.hallName }}</text>
      </view>
    </view>

    <!-- 供品清单 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">🕯️</text>供品清单
      </view>
      <view class="offerings-list">
        <view v-for="(offering, index) in confirmData.offerings" :key="index" class="offering-item">
          <view class="offering-info">
            <view class="offering-header">
              <text class="offering-icon">{{ getOfferingIcon(offering.name) }}</text>
              <view class="offering-details">
                <view class="offering-name">{{ offering.name }}</view>
                <view class="offering-desc">{{ offering.description }}</view>
              </view>
            </view>
          </view>
          <view class="offering-details">
            <text class="offering-qty">{{ offering.qty }}{{ offering.unit }}</text>
            <text class="offering-price">¥{{ offering.price * offering.qty }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 供奉者信息 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">👤</text>供奉者信息
      </view>
      <view class="info-item">
        <text class="label">姓名：</text>
        <text class="value">{{ confirmData.name }}</text>
      </view>
      <view class="info-item">
        <text class="label">电话：</text>
        <text class="value">{{ confirmData.phone }}</text>
      </view>
      <view class="info-item">
        <text class="label">身份证：</text>
        <text class="value">{{ confirmData.idCard }}</text>
      </view>
      <view class="info-item">
        <text class="label">地址：</text>
        <text class="value">{{ confirmData.address }}</text>
      </view>
    </view>

    <!-- 祈福语 -->
    <view class="card" v-if="confirmData.wish">
      <view class="card-title">
        <text class="icon">🙏</text>祈福语
      </view>
      <view class="wish-content">
        <text>{{ confirmData.wish }}</text>
      </view>
    </view>

    <!-- 收件信息 -->
    <view class="card" v-if="confirmData.receiver && confirmData.receiver.name">
      <view class="card-title">
        <text class="icon">📦</text>收件信息
      </view>
      <view class="info-item">
        <text class="label">收件人：</text>
        <text class="value">{{ confirmData.receiver.name }}</text>
      </view>
      <view class="info-item">
        <text class="label">电话：</text>
        <text class="value">{{ confirmData.receiver.phone }}</text>
      </view>
      <view class="info-item">
        <text class="label">地址：</text>
        <text class="value">{{ confirmData.receiver.address }}</text>
      </view>
      <view class="info-item" v-if="confirmData.receiver.remark">
        <text class="label">备注：</text>
        <text class="value">{{ confirmData.receiver.remark }}</text>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="card price-card">
      <view class="card-title">
        <text class="icon">💰</text>费用明细
      </view>
      <view class="price-item">
        <text>供品费用：</text>
        <text class="price">¥{{ confirmData.totalPrice }}</text>
      </view>
      <view class="price-item" v-if="confirmData.receiver && confirmData.receiver.name">
        <text>邮寄费用：</text>
        <text class="price">¥{{ shippingFee }}</text>
      </view>
      <view class="price-total">
        <text>总计：</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="btn-group">
      <button class="confirm-btn" type="primary" :loading="loading" @click="submitOrder">
        <text v-if="!loading">确认供奉</text>
        <text v-else>提交中...</text>
      </button>
      <button class="edit-btn" type="default" @click="goBack">返回修改</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      confirmData: {
        hallId: -1,
        hallName: '',
        offerings: [],
        totalPrice: 0,
        name: '',
        phone: '',
        idCard: '',
        address: '',
        wish: '',
        receiver: {
          name: '',
          phone: '',
          address: '',
          remark: ''
        }
      },
      shippingFee: 15
    }
  },
  computed: {
    totalPrice() {
      const basePrice = this.confirmData.totalPrice
      const shipping = this.confirmData.receiver && this.confirmData.receiver.name ? this.shippingFee : 0
      return basePrice + shipping
    }
  },
  onLoad() {
    // 从本地存储获取数据
    const data = uni.getStorageSync('hallOrder')
    if (data) {
      this.confirmData = { ...this.confirmData, ...data }
    } else {
      // 如果没有数据，返回上一页
      uni.showToast({ 
        title: '请先填写供品信息', 
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
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
    submitOrder() {
      this.loading = true
      
      // 模拟提交订单
      setTimeout(() => {
        this.loading = false
        
        // 保存订单信息
        const orderData = {
          ...this.confirmData,
          orderId: 'H' + Date.now(),
          status: 'pending',
          totalPrice: this.totalPrice,
          createTime: new Date().toISOString()
        }
        
        // 保存到本地存储
        const orders = uni.getStorageSync('hallOrders') || []
        orders.unshift(orderData)
        uni.setStorageSync('hallOrders', orders)
        
        // 清除临时数据
        uni.removeStorageSync('hallOrder')
        
        uni.showToast({ 
          title: '提交成功', 
          icon: 'success',
          duration: 1500
        })
        
        setTimeout(() => {
          // 跳转到支付页面
          uni.navigateTo({
            url: '/pages/hall/pay',
            success: () => {
              console.log('跳转到支付页面成功')
            },
            fail: (err) => {
              console.error('跳转支付页面失败:', err)
              // 如果跳转失败，跳转到成功页面
              uni.navigateTo({
                url: '/pages/hall/success'
              })
            }
          })
        }, 1500)
      }, 1000)
    },
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回修改成功')
        },
        fail: (err) => {
          console.error('返回修改失败:', err)
          // 如果返回失败，跳转到殿堂供品页面
          uni.navigateTo({ 
            url: '/pages/hall/form',
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
.confirm-page {
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
  flex: 1;
}

.offering-header {
  display: flex;
  align-items: center;
  margin-bottom: 4rpx;
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
  margin-bottom: 2rpx;
}

.offering-desc {
  font-size: 24rpx;
  color: #666;
}

.offering-qty {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.offering-price {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.wish-content {
  background: #f8f9fa;
  padding: 16rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
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

.btn-group {
  display: flex;
  gap: 24rpx;
  margin: 48rpx 16rpx 0 16rpx;
}

.confirm-btn {
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

.edit-btn {
  flex: 1;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f8f9fa;
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>