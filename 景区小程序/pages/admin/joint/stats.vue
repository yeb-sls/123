<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会数据统计</text>
      <text class="page-desc">查看合坛法会相关数据统计信息</text>
    </view>
    
    <!-- 统计概览 -->
    <view class="stats-overview">
      <view class="stats-grid">
        <view class="stat-card primary">
          <view class="stat-icon">📊</view>
          <view class="stat-content">
            <text class="stat-number">{{ stats.totalOrders || 0 }}</text>
            <text class="stat-label">总订单数</text>
          </view>
        </view>
        
        <view class="stat-card success">
          <view class="stat-icon">💰</view>
          <view class="stat-content">
            <text class="stat-number">¥{{ stats.totalRevenue || 0 }}</text>
            <text class="stat-label">总收入</text>
          </view>
        </view>
        
        <view class="stat-card warning">
          <view class="stat-icon">👥</view>
          <view class="stat-content">
            <text class="stat-number">{{ stats.totalApplicants || 0 }}</text>
            <text class="stat-label">总报名人数</text>
          </view>
        </view>
        
        <view class="stat-card info">
          <view class="stat-icon">📅</view>
          <view class="stat-content">
            <text class="stat-number">{{ stats.activeProjects || 0 }}</text>
            <text class="stat-label">进行中项目</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 订单状态统计 -->
    <view class="stats-section">
      <view class="section-header">
        <text class="section-title">订单状态统计</text>
      </view>
      
      <view class="status-stats">
        <view class="status-item" v-for="(count, status) in stats.orderStatus" :key="status">
          <view class="status-info">
            <text class="status-name">{{ getStatusName(status) }}</text>
            <text class="status-count">{{ count }}</text>
          </view>
          <view class="status-bar">
            <view class="status-progress" :style="{ width: getStatusPercentage(count) + '%' }"></view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 项目统计 -->
    <view class="stats-section">
      <view class="section-header">
        <text class="section-title">项目统计</text>
      </view>
      
      <view class="project-stats">
        <view v-for="project in stats.projectStats" :key="project._id" class="project-item">
          <view class="project-info">
            <text class="project-name">{{ project.name }}</text>
            <text class="project-count">{{ project.orderCount }}单</text>
          </view>
          <view class="project-revenue">
            <text class="revenue-label">收入：</text>
            <text class="revenue-amount">¥{{ project.revenue }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 时间统计 -->
    <view class="stats-section">
      <view class="section-header">
        <text class="section-title">时间统计</text>
      </view>
      
      <view class="time-stats">
        <view class="time-item">
          <text class="time-label">今日订单</text>
          <text class="time-count">{{ stats.todayOrders || 0 }}</text>
        </view>
        <view class="time-item">
          <text class="time-label">本周订单</text>
          <text class="time-count">{{ stats.weekOrders || 0 }}</text>
        </view>
        <view class="time-item">
          <text class="time-label">本月订单</text>
          <text class="time-count">{{ stats.monthOrders || 0 }}</text>
        </view>
      </view>
    </view>
    
    <!-- 刷新按钮 -->
    <view class="refresh-section">
      <button class="refresh-btn" @click="refreshStats">🔄 刷新数据</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        totalApplicants: 0,
        activeProjects: 0,
        orderStatus: {},
        projectStats: [],
        todayOrders: 0,
        weekOrders: 0,
        monthOrders: 0
      }
    }
  },
  
  onLoad() {
    this.loadStats()
  },
  
  methods: {
    async loadStats() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getJointStats'
        })
        if (res.result && res.result.data) {
          this.stats = res.result.data
        }
      } catch (error) {
        console.error('加载合坛法会统计数据失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    getStatusName(status) {
      const statusMap = {
        'pending': '待支付',
        'paid': '已支付',
        'waiting': '待确认',
        'confirmed': '已确认',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    },
    
    getStatusPercentage(count) {
      const total = Object.values(this.stats.orderStatus).reduce((sum, val) => sum + val, 0)
      return total > 0 ? Math.round((count / total) * 100) : 0
    },
    
    async refreshStats() {
      uni.showLoading({ title: '刷新中...' })
      await this.loadStats()
      uni.hideLoading()
      uni.showToast({ title: '数据已刷新' })
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

.stats-overview {
  margin-bottom: 20rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.stat-card.primary {
  border-left: 4rpx solid #667eea;
}

.stat-card.success {
  border-left: 4rpx solid #28a745;
}

.stat-card.warning {
  border-left: 4rpx solid #ffc107;
}

.stat-card.info {
  border-left: 4rpx solid #17a2b8;
}

.stat-icon {
  font-size: 48rpx;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.stats-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.status-stats {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-name {
  font-size: 28rpx;
  color: #333;
}

.status-count {
  font-size: 28rpx;
  font-weight: bold;
  color: #667eea;
}

.status-bar {
  height: 8rpx;
  background: #f0f0f0;
  border-radius: 4rpx;
  overflow: hidden;
}

.status-progress {
  height: 100%;
  background: #667eea;
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.project-stats {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.project-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.project-count {
  font-size: 24rpx;
  color: #666;
}

.project-revenue {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.revenue-label {
  font-size: 26rpx;
  color: #666;
}

.revenue-amount {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b35;
}

.time-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.time-item {
  text-align: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.time-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.time-count {
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
}

.refresh-section {
  text-align: center;
  margin-top: 40rpx;
}

.refresh-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}
</style> 