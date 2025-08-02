<template>
  <view class="test-page">
    <view class="test-container">
      <view class="test-title">供灯祈福功能测试</view>
      
      <view class="test-section">
        <view class="section-title">页面导航测试</view>
        <button class="test-btn" @click="goToLight">进入供灯祈福</button>
        <button class="test-btn" @click="goToConfirm">直接进入确认页</button>
        <button class="test-btn" @click="goToPay">直接进入支付页</button>
        <button class="test-btn" @click="goToSuccess">直接进入成功页</button>
      </view>
      
      <view class="test-section">
        <view class="section-title">数据存储测试</view>
        <button class="test-btn" @click="setTestData">设置测试数据</button>
        <button class="test-btn" @click="getTestData">获取测试数据</button>
        <button class="test-btn" @click="clearTestData">清除测试数据</button>
      </view>
      
      <view class="test-section">
        <view class="section-title">数据展示</view>
        <view class="data-display">
          <text>lightOrder: {{ lightOrderData }}</text>
        </view>
        <view class="data-display">
          <text>lightOrders: {{ lightOrdersData }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      lightOrderData: '',
      lightOrdersData: ''
    }
  },
  onLoad() {
    this.updateDataDisplay()
  },
  methods: {
    goToLight() {
      uni.navigateTo({
        url: '/pages/light/index',
        success: () => {
          console.log('跳转到供灯祈福页面成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '跳转失败', icon: 'none' })
        }
      })
    },
    goToConfirm() {
      uni.navigateTo({
        url: '/pages/light/confirm',
        success: () => {
          console.log('跳转到确认页面成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '跳转失败', icon: 'none' })
        }
      })
    },
    goToPay() {
      uni.navigateTo({
        url: '/pages/light/pay',
        success: () => {
          console.log('跳转到支付页面成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '跳转失败', icon: 'none' })
        }
      })
    },
    goToSuccess() {
      uni.navigateTo({
        url: '/pages/light/success',
        success: () => {
          console.log('跳转到成功页面成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '跳转失败', icon: 'none' })
        }
      })
    },
    setTestData() {
      const testData = {
        towerId: 'towerA',
        levelId: 'L1',
        towerName: '大愿灯塔A',
        levelName: '一层',
        time: '一月',
        price: 188,
        totalPrice: 203,
        name: '测试用户',
        phone: '13800138000',
        idCard: '110101199001011234',
        wish: '愿世界和平，众生安康',
        receiver: {
          name: '测试收件人',
          phone: '13900139000',
          address: '北京市朝阳区测试地址',
          remark: '测试备注'
        },
        timestamp: new Date().getTime()
      }
      
      uni.setStorageSync('lightOrder', testData)
      
      const testOrders = [{
        ...testData,
        orderId: 'L' + Date.now(),
        status: 'pending',
        createTime: new Date().toISOString()
      }]
      
      uni.setStorageSync('lightOrders', testOrders)
      
      this.updateDataDisplay()
      uni.showToast({ title: '测试数据已设置', icon: 'success' })
    },
    getTestData() {
      this.updateDataDisplay()
      uni.showToast({ title: '数据已更新', icon: 'success' })
    },
    clearTestData() {
      uni.removeStorageSync('lightOrder')
      uni.removeStorageSync('lightOrders')
      this.updateDataDisplay()
      uni.showToast({ title: '测试数据已清除', icon: 'success' })
    },
    updateDataDisplay() {
      const lightOrder = uni.getStorageSync('lightOrder')
      const lightOrders = uni.getStorageSync('lightOrders')
      
      this.lightOrderData = lightOrder ? JSON.stringify(lightOrder, null, 2) : '无数据'
      this.lightOrdersData = lightOrders ? JSON.stringify(lightOrders, null, 2) : '无数据'
    }
  }
}
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding: 32rpx 16rpx;
}

.test-container {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.test-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin-bottom: 32rpx;
  letter-spacing: 2rpx;
}

.test-section {
  margin-bottom: 32rpx;
  padding: 24rpx;
  border: 2rpx solid #e0eaff;
  border-radius: 12rpx;
  background: #f8f9fa;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
}

.test-btn {
  width: 100%;
  height: 80rpx;
  margin-bottom: 16rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-display {
  background: #fff;
  padding: 16rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
  border: 1px solid #e0eaff;
}

.data-display text {
  font-size: 24rpx;
  color: #666;
  word-break: break-all;
  line-height: 1.4;
}
</style> 