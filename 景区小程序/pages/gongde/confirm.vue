<template>
  <view class="confirm-page">
    <!-- 步骤提示 -->
    <view class="step-bar">
      <view class="step">1. 选择布施</view>
      <view class="step active">2. 信息确认</view>
      <view class="step">3. 支付</view>
    </view>

    <!-- 布施类型确认 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">🎁</text>布施类型
      </view>
      <view class="info-item">
        <text class="label">类型：</text>
        <text class="value">{{ confirmData.donateType }}</text>
      </view>
    </view>

    <!-- 布施内容 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">📝</text>布施内容
      </view>
      
      <!-- 善款布施 -->
      <view v-if="confirmData.donateType === '善款'">
        <view class="info-item">
          <text class="label">布施金额：</text>
          <text class="value price">¥{{ confirmData.amount }}</text>
        </view>
      </view>

      <!-- 实物布施 -->
      <view v-if="confirmData.donateType === '实物'">
        <view class="info-item">
          <text class="label">物品名称：</text>
          <text class="value">{{ confirmData.itemName }}</text>
        </view>
        <view class="info-item">
          <text class="label">物品数量：</text>
          <text class="value">{{ confirmData.itemCount }}</text>
        </view>
        <view class="info-item" v-if="confirmData.itemDesc">
          <text class="label">物品详情：</text>
          <text class="value">{{ confirmData.itemDesc }}</text>
        </view>
      </view>

      <!-- 服务布施 -->
      <view v-if="confirmData.donateType === '服务'">
        <view class="info-item">
          <text class="label">服务内容：</text>
          <text class="value">{{ confirmData.serviceDesc }}</text>
        </view>
        <view class="info-item" v-if="confirmData.serviceTime">
          <text class="label">服务时间：</text>
          <text class="value">{{ confirmData.serviceTime }}</text>
        </view>
      </view>
    </view>

    <!-- 布施人信息 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">👤</text>布施人信息
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

    <!-- 许愿语 -->
    <view class="card" v-if="confirmData.wish">
      <view class="card-title">
        <text class="icon">🙏</text>许愿语
      </view>
      <view class="wish-content">
        <text>{{ confirmData.wish }}</text>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="card price-card">
      <view class="card-title">
        <text class="icon">💰</text>费用明细
      </view>
      <view class="price-item" v-if="confirmData.donateType === '善款'">
        <text>布施金额：</text>
        <text class="price">¥{{ confirmData.totalPrice }}</text>
      </view>
      <view class="price-item" v-else>
        <text>布施类型：</text>
        <text class="price">{{ confirmData.donateType }}</text>
      </view>
      <view class="price-total">
        <text>总计：</text>
        <text class="total-price">{{ confirmData.donateType === '善款' ? '¥' + confirmData.totalPrice : '免费布施' }}</text>
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

    <!-- 操作按钮 -->
    <view class="btn-group">
      <button class="confirm-btn" type="primary" :loading="loading" @click="submitOrder">
        <text v-if="!loading">确认布施</text>
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
        donateType: '',
        amount: '',
        itemName: '',
        itemCount: '',
        itemDesc: '',
        serviceDesc: '',
        serviceTime: '',
        name: '',
        phone: '',
        idCard: '',
        address: '',
        wish: '',
        totalPrice: 0
      }
    }
  },
  onLoad() {
    // 从本地存储获取数据
    const data = uni.getStorageSync('gongdeOrder')
    if (data) {
      this.confirmData = { ...this.confirmData, ...data }
    } else {
      // 如果没有数据，返回上一页
      uni.showToast({ 
        title: '请先填写布施信息', 
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }
  },
  methods: {
    submitOrder() {
      this.loading = true
      
      // 模拟提交订单
      setTimeout(() => {
        this.loading = false
        
        // 保存订单信息
        const orderData = {
          ...this.confirmData,
          orderId: 'G' + Date.now(),
          status: 'pending',
          createTime: new Date().toISOString()
        }
        
        // 保存到本地存储
        const orders = uni.getStorageSync('gongdeOrders') || []
        orders.unshift(orderData)
        uni.setStorageSync('gongdeOrders', orders)
        
        // 清除临时数据
        uni.removeStorageSync('gongdeOrder')
        
        uni.showToast({ 
          title: '提交成功', 
          icon: 'success',
          duration: 1500
        })
        
        setTimeout(() => {
          // 跳转到支付页面（如果是善款布施）
          if (this.confirmData.donateType === '善款') {
            uni.navigateTo({
              url: '/pages/gongde/pay',
              success: () => {
                console.log('跳转到支付页面成功')
              },
              fail: (err) => {
                console.error('跳转支付页面失败:', err)
                // 如果跳转失败，跳转到成功页面
                uni.navigateTo({
                  url: '/pages/gongde/success'
                })
              }
            })
          } else {
            // 非善款布施直接跳转到成功页面
            uni.navigateTo({
              url: '/pages/gongde/success'
            })
          }
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
          // 如果返回失败，跳转到功德布施页面
          uni.navigateTo({ 
            url: '/pages/gongde/form',
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

.value.price {
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