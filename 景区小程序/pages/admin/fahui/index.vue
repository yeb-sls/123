<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">法会管理</text>
      <text class="page-desc">管理法会相关配置和订单</text>
    </view>

    <!-- 功能模块 -->
    <view class="module-grid">
      <!-- 专场法会管理 -->
      <view class="module-card" @click="goToSpecial">
        <view class="module-icon">🎯</view>
        <view class="module-info">
          <text class="module-title">专场法会管理</text>
          <text class="module-desc">管理专场法会相关配置和订单</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
      <!-- 合坛法会管理 -->
      <view class="module-card" @click="goToJoint">
        <view class="module-icon">🪔</view>
        <view class="module-info">
          <text class="module-title">合坛法会管理</text>
          <text class="module-desc">管理合坛法会相关配置和订单</text>
        </view>
        <view class="module-arrow">→</view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-section">
      <view class="stats-title">数据统计</view>
      <view class="stats-grid">
        <view class="stats-item">
          <text class="stats-number">{{ stats.totalOrders || 0 }}</text>
          <text class="stats-label">总订单数</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{ stats.pendingOrders || 0 }}</text>
          <text class="stats-label">待确认订单</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{ stats.totalRevenue || 0 }}</text>
          <text class="stats-label">总收入(元)</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{ stats.activeProjects || 0 }}</text>
          <text class="stats-label">活跃项目</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入云对象
const fahuiManagement = uniCloud.importObject('fahui-management')

export default {
  data() {
    return {
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        activeProjects: 0
      }
    }
  },
  
  onLoad() {
    this.loadStats()
  },
  
  methods: {
    // 加载统计数据
    async loadStats() {
      try {
        const result = await fahuiManagement.getStats()
        if (result.success) {
          this.stats = result.data
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },
    
    // 跳转到专场法会管理
    goToSpecial() {
      uni.navigateTo({
        url: '/pages/admin/fahui/special/index'
      })
    },
    // 跳转到合坛法会管理
    goToJoint() {
      uni.navigateTo({
        url: '/pages/admin/fahui/joint/index'
      })
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
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.module-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.module-card:active {
  transform: scale(0.98);
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.15);
}

.module-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.module-info {
  flex: 1;
}

.module-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.module-desc {
  font-size: 26rpx;
  color: #666;
}

.module-arrow {
  font-size: 32rpx;
  color: #999;
}

.stats-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
}

.stats-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.stats-item {
  text-align: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.stats-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  display: block;
  margin-bottom: 8rpx;
}

.stats-label {
  font-size: 24rpx;
  color: #666;
}
</style> 