<template>
  <view class="test-page">
    <view class="header">
      <text class="title">合坛法会成功页面测试</text>
    </view>

    <!-- 数据状态 -->
    <view class="section">
      <view class="section-title">数据状态</view>
      <view class="status-card">
        <view class="status-item">
          <text class="status-label">successData:</text>
          <text class="status-value" :class="{ 'exists': hasSuccessData }">
            {{ hasSuccessData ? '存在' : '不存在' }}
          </text>
        </view>
        <view class="status-item">
          <text class="status-label">confirmData:</text>
          <text class="status-value" :class="{ 'exists': hasConfirmData }">
            {{ hasConfirmData ? '存在' : '不存在' }}
          </text>
        </view>
        <view class="status-item">
          <text class="status-label">orderData:</text>
          <text class="status-value" :class="{ 'exists': hasOrderData }">
            {{ hasOrderData ? '存在' : '不存在' }}
          </text>
        </view>
        <view class="status-item">
          <text class="status-label">orderId:</text>
          <text class="status-value">{{ orderId || '无' }}</text>
        </view>
        <view class="status-item">
          <text class="status-label">draftData:</text>
          <text class="status-value" :class="{ 'exists': hasDraftData }">
            {{ hasDraftData ? '存在' : '不存在' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="section">
      <view class="section-title">操作</view>
      <view class="button-group">
        <button class="btn" @click="createTestData">创建测试数据</button>
        <button class="btn" @click="clearAllData">清除所有数据</button>
        <button class="btn" @click="goToSuccess">跳转成功页面</button>
        <button class="btn" @click="showAllData">显示所有数据</button>
      </view>
    </view>

    <!-- 数据详情 -->
    <view v-if="showData" class="section">
      <view class="section-title">数据详情</view>
      <view class="data-card">
        <text class="data-text">{{ dataDetails }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      hasSuccessData: false,
      hasConfirmData: false,
      hasOrderData: false,
      hasDraftData: false,
      orderId: '',
      showData: false,
      dataDetails: ''
    }
  },

  onLoad() {
    this.checkDataStatus()
  },

  methods: {
    checkDataStatus() {
      this.hasSuccessData = !!uni.getStorageSync('joint_fahui_success')
      this.hasConfirmData = !!uni.getStorageSync('joint_fahui_confirm')
      this.hasOrderData = !!uni.getStorageSync('joint_fahui_order')
      this.hasDraftData = !!uni.getStorageSync('joint_fahui_draft')
      this.orderId = uni.getStorageSync('joint_fahui_order_id') || ''
    },

    createTestData() {
      const testData = {
        orderId: 'TEST_' + Date.now(),
        projectName: '测试合坛法会',
        applicantCount: 3,
        totalFee: 600,
        payTime: new Date().toLocaleString(),
        selectedItems: [
          {
            name: '香烛',
            price: 50,
            count: 2
          },
          {
            name: '鲜花',
            price: 30,
            count: 1
          }
        ]
      }

      // 保存到多个位置
      uni.setStorageSync('joint_fahui_success', testData)
      uni.setStorageSync('joint_fahui_confirm', testData)
      uni.setStorageSync('joint_fahui_order_id', testData.orderId)

      this.checkDataStatus()
      uni.showToast({
        title: '测试数据已创建',
        icon: 'success'
      })
    },

    clearAllData() {
      uni.removeStorageSync('joint_fahui_success')
      uni.removeStorageSync('joint_fahui_confirm')
      uni.removeStorageSync('joint_fahui_order')
      uni.removeStorageSync('joint_fahui_order_id')
      uni.removeStorageSync('joint_fahui_draft')

      this.checkDataStatus()
      this.showData = false
      uni.showToast({
        title: '数据已清除',
        icon: 'success'
      })
    },

    goToSuccess() {
      uni.navigateTo({
        url: '/pages/fahui/joint/success'
      })
    },

    showAllData() {
      const allData = {
        successData: uni.getStorageSync('joint_fahui_success'),
        confirmData: uni.getStorageSync('joint_fahui_confirm'),
        orderData: uni.getStorageSync('joint_fahui_order'),
        orderId: uni.getStorageSync('joint_fahui_order_id'),
        draftData: uni.getStorageSync('joint_fahui_draft')
      }

      this.dataDetails = JSON.stringify(allData, null, 2)
      this.showData = true
    }
  }
}
</script>

<style scoped>
.test-page {
  padding: 32rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 48rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.status-card, .data-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-size: 28rpx;
  color: #666;
}

.status-value {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: bold;
}

.status-value.exists {
  color: #52c41a;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.btn {
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 24rpx;
  font-size: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.data-text {
  font-size: 24rpx;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}
</style> 