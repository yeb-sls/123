<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会管理系统</text>
      <text class="page-desc">管理合坛法会相关配置和订单</text>
    </view>
    
    <view class="module-grid">
      <view class="module-card" @click="goToBanner">
        <view class="module-icon">🖼️</view>
        <view class="module-info">
          <text class="module-title">板块头图</text>
          <text class="module-desc">管理合坛法会页面头图</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      
      <view class="module-card" @click="goToIntro">
        <view class="module-icon">📝</view>
        <view class="module-info">
          <text class="module-title">图文介绍</text>
          <text class="module-desc">管理合坛法会介绍内容</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      
      <view class="module-card" @click="goToProjects">
        <view class="module-icon">🕯️</view>
        <view class="module-info">
          <text class="module-title">法会项目</text>
          <text class="module-desc">管理合坛法会项目及日期设置</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      
      <view class="module-card" @click="goToGoods">
        <view class="module-icon">🛍️</view>
        <view class="module-info">
          <text class="module-title">代办物品</text>
          <text class="module-desc">管理合坛法会代办物品及价格</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      
      <view class="module-card" @click="goToReceiver">
        <view class="module-icon">📦</view>
        <view class="module-info">
          <text class="module-title">收件信息</text>
          <text class="module-desc">管理合坛法会收件信息模块</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      
      <view class="module-card" @click="goToOrders">
        <view class="module-icon">📋</view>
        <view class="module-info">
          <text class="module-title">订单管理</text>
          <text class="module-desc">查看和管理合坛法会订单</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      
      <view class="module-card" @click="goToStats">
        <view class="module-icon">📊</view>
        <view class="module-info">
          <text class="module-title">数据统计</text>
          <text class="module-desc">查看合坛法会数据统计</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      
      <view class="module-card" @click="goToTest">
        <view class="module-icon">🧪</view>
        <view class="module-info">
          <text class="module-title">功能测试</text>
          <text class="module-desc">测试合坛法会管理功能</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goToBanner() {
      uni.navigateTo({ url: '/pages/admin/joint/banner' })
    },
    goToIntro() {
      uni.navigateTo({ url: '/pages/admin/joint/intro' })
    },
    goToProjects() {
      uni.navigateTo({ url: '/pages/admin/joint/projects' })
    },
    goToGoods() {
      uni.navigateTo({ url: '/pages/admin/joint/goods' })
    },
    goToReceiver() {
      uni.navigateTo({ url: '/pages/admin/joint/receiver' })
    },
    goToOrders() {
      uni.navigateTo({ url: '/pages/admin/joint/orders' })
    },
    goToStats() {
      uni.navigateTo({ url: '/pages/admin/joint/stats' })
    },
    goToTest() {
      uni.showToast({ title: '功能开发中', icon: 'none' })
      // uni.navigateTo({ url: '/pages/admin/joint/test' })
    }
  }
}
</script>

<style scoped>
.admin-container { 
  padding: 20rpx; 
  background: #f5f5f5; 
  min-height: 100vh; 
}

.page-header { 
  background: #fff; 
  padding: 30rpx; 
  border-radius: 12rpx; 
  margin-bottom: 20rpx; 
}

.page-title { 
  font-size: 36rpx; 
  font-weight: bold; 
  color: #333; 
  display: block; 
  margin-bottom: 10rpx; 
}

.page-desc { 
  font-size: 28rpx; 
  color: #666; 
}

.module-grid { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 20rpx; 
}

.module-card { 
  background: #fff; 
  border-radius: 12rpx; 
  padding: 24rpx; 
  flex: 1 1 45%; 
  min-width: 300rpx; 
  display: flex; 
  align-items: center; 
  cursor: pointer; 
  transition: box-shadow 0.2s; 
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); 
}

.module-card:hover { 
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08); 
}

.module-icon { 
  font-size: 48rpx; 
  margin-right: 20rpx; 
}

.module-info { 
  flex: 1; 
}

.module-title { 
  font-size: 30rpx; 
  font-weight: bold; 
  color: #333; 
}

.module-desc { 
  font-size: 24rpx; 
  color: #999; 
}

.module-arrow { 
  font-size: 32rpx; 
  color: #bbb; 
  margin-left: 10rpx; 
}
</style> 