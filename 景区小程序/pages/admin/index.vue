<template>
  <view class="admin-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <view class="header-left">
          <text class="logo">🏛️</text>
          <view class="title-group">
            <text class="main-title">景区管理系统</text>
            <text class="sub-title">Scenic Area Management</text>
          </view>
        </view>
        <view class="header-right">
          <view class="time-display">
            <text class="time">{{ currentTime }}</text>
            <text class="date">{{ currentDate }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据概览卡片 -->
    <view class="overview-section">
      <view class="overview-grid">
        <view class="overview-card primary">
          <view class="card-icon">👥</view>
          <view class="card-content">
            <text class="card-number">{{ stats.totalUsers || 0 }}</text>
            <text class="card-label">总用户数</text>
          </view>
          <view class="card-trend">
            <text class="trend-icon">↗</text>
            <text class="trend-text">+12%</text>
          </view>
        </view>
        
        <view class="overview-card success">
          <view class="card-icon">📋</view>
          <view class="card-content">
            <text class="card-number">{{ stats.totalOrders || 0 }}</text>
            <text class="card-label">总订单数</text>
          </view>
          <view class="card-trend">
            <text class="trend-icon">↗</text>
            <text class="trend-text">+8%</text>
          </view>
        </view>
        
        <view class="overview-card warning">
          <view class="card-icon">💰</view>
          <view class="card-content">
            <text class="card-number">¥{{ stats.totalRevenue || 0 }}</text>
            <text class="card-label">总收入</text>
          </view>
          <view class="card-trend">
            <text class="trend-icon">↗</text>
            <text class="trend-text">+15%</text>
          </view>
        </view>
        
        <view class="overview-card info">
          <view class="card-icon">📊</view>
          <view class="card-content">
            <text class="card-number">{{ stats.todayOrders || 0 }}</text>
            <text class="card-label">今日订单</text>
          </view>
          <view class="card-trend">
            <text class="trend-icon">↗</text>
            <text class="trend-text">+5%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能模块 -->
    <view class="modules-section">
      <view class="section-header">
        <text class="section-title">功能模块</text>
        <text class="section-subtitle">快速访问各项管理功能</text>
      </view>
      
      <view class="modules-grid">
        <!-- 首页管理 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">🏠</text>
            <text class="group-title">首页管理</text>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/home/banner')">
              <view class="item-icon">🖼️</view>
              <text class="item-name">轮播图</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/home/nav')">
              <view class="item-icon">🔗</view>
              <text class="item-name">导航</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/home/intro')">
              <view class="item-icon">📝</view>
              <text class="item-name">介绍</text>
            </view>
          </view>
        </view>

        <!-- 专场法会管理 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">🕉️</text>
            <text class="group-title">专场法会管理</text>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/fahui/special/index')">
              <view class="item-icon">🏠</view>
              <text class="item-name">管理首页</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/fahui/projects')">
              <view class="item-icon">📅</view>
              <text class="item-name">项目管理</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/fahui/orders')">
              <view class="item-icon">📋</view>
              <text class="item-name">订单管理</text>
            </view>
          </view>
        </view>

        <!-- 合坛法会管理 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">🙏</text>
            <text class="group-title">合坛法会管理</text>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/joint/index')">
              <view class="item-icon">🏠</view>
              <text class="item-name">管理首页</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/joint/projects')">
              <view class="item-icon">📅</view>
              <text class="item-name">项目管理</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/joint/orders')">
              <view class="item-icon">📋</view>
              <text class="item-name">订单管理</text>
            </view>
          </view>
        </view>

        <!-- 供灯管理 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">💡</text>
            <text class="group-title">供灯管理</text>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/light/config')">
              <view class="item-icon">⚙️</view>
              <text class="item-name">配置</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/light/orders')">
              <view class="item-icon">📊</view>
              <text class="item-name">订单</text>
            </view>
          </view>
        </view>

        <!-- 殿堂供品 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">🏛️</text>
            <text class="group-title">殿堂供品</text>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/hall/config')">
              <view class="item-icon">🛍️</view>
              <text class="item-name">配置</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/hall/orders')">
              <view class="item-icon">📦</view>
              <text class="item-name">订单</text>
            </view>
          </view>
        </view>

        <!-- 功德布施 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">💰</text>
            <text class="group-title">功德布施</text>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/gongde/config')">
              <view class="item-icon">🎯</view>
              <text class="item-name">配置</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/gongde/orders')">
              <view class="item-icon">📈</view>
              <text class="item-name">记录</text>
            </view>
          </view>
        </view>

        <!-- 系统通知 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">🔔</text>
            <text class="group-title">系统通知</text>
            <view v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</view>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/notifications')">
              <view class="item-icon">📢</view>
              <text class="item-name">通知管理</text>
            </view>
          </view>
        </view>

        <!-- 活动管理 -->
        <view class="module-group">
          <view class="group-header">
            <text class="group-icon">🎯</text>
            <text class="group-title">活动管理</text>
          </view>
          <view class="group-items">
            <view class="module-item" @click="goToPage('/pages/admin/activity/config')">
              <view class="item-icon">📅</view>
              <text class="item-name">配置</text>
            </view>
            <view class="module-item" @click="goToPage('/pages/admin/activity/orders')">
              <view class="item-icon">👥</view>
              <text class="item-name">报名</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="section-header">
        <text class="section-title">快捷操作</text>
        <text class="section-subtitle">常用功能快速访问</text>
      </view>
      
      <view class="actions-grid">
        <view class="action-item" @click="refreshData">
          <view class="action-icon">🔄</view>
          <text class="action-name">刷新数据</text>
        </view>
        <view class="action-item" @click="exportData">
          <view class="action-icon">📤</view>
          <text class="action-name">导出数据</text>
        </view>
        <view class="action-item" @click="backupSystem">
          <view class="action-icon">💾</view>
          <text class="action-name">系统备份</text>
        </view>
        <view class="action-item" @click="systemSettings">
          <view class="action-icon">⚙️</view>
          <text class="action-name">系统设置</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入云对象
const commonManagement = uniCloud.importObject('common-management')
const notificationSystem = uniCloud.importObject('notification-system')

export default {
  data() {
    return {
      stats: {
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        todayOrders: 0
      },
      currentTime: '',
      currentDate: '',
      unreadCount: 0
    }
  },
  onLoad() {
    this.loadStats()
    this.loadUnreadCount()
    this.updateTime()
    // 每分钟更新时间
    setInterval(this.updateTime, 60000)
  },
  methods: {
    // 跳转到指定页面
    goToPage(url) {
      uni.navigateTo({
        url,
        success: () => {
          console.log('跳转成功:', url)
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    },

    // 加载统计数据
    async loadStats() {
      try {
        const result = await commonManagement.getAdminStats()
        this.stats = result.success && result.data ? result.data : {}
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },

    // 加载未读通知数量
    async loadUnreadCount() {
      try {
        const result = await notificationSystem.getUnreadCount()
        if (result.success) {
          this.unreadCount = result.count || 0
        }
      } catch (error) {
        console.error('加载未读通知数量失败:', error)
      }
    },

    // 更新时间
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
      this.currentDate = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },

    // 刷新数据
    refreshData() {
      this.loadStats()
      uni.showToast({
        title: '数据已刷新',
        icon: 'success'
      })
    },

    // 导出数据
    exportData() {
      uni.showToast({
        title: '导出功能开发中',
        icon: 'none'
      })
    },

    // 系统备份
    backupSystem() {
      uni.showToast({
        title: '备份功能开发中',
        icon: 'none'
      })
    },

    // 系统设置
    systemSettings() {
      uni.showToast({
        title: '设置功能开发中',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

/* 顶部导航栏 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  padding: 40rpx 30rpx 30rpx 30rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.logo {
  font-size: 48rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.sub-title {
  font-size: 24rpx;
  color: #666;
  font-weight: 300;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.time-display {
  text-align: right;
}

.time {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.date {
  font-size: 24rpx;
  color: #666;
  display: block;
}

/* 数据概览 */
.overview-section {
  padding: 30rpx;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.overview-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.overview-card:active {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 48rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
}

.overview-card.primary .card-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.overview-card.success .card-icon {
  background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
  color: white;
}

.overview-card.warning .card-icon {
  background: linear-gradient(135deg, #ff9500 0%, #ff6b35 100%);
  color: white;
}

.overview-card.info .card-icon {
  background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
  color: white;
}

.card-content {
  flex: 1;
}

.card-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.card-label {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.trend-icon {
  font-size: 24rpx;
  color: #34c759;
}

.trend-text {
  font-size: 22rpx;
  color: #34c759;
  font-weight: 500;
}

/* 功能模块 */
.modules-section {
  padding: 0 30rpx 30rpx 30rpx;
}

.section-header {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 8rpx;
}

.section-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.module-group {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 25rpx;
  position: relative;
}

.group-icon {
  font-size: 32rpx;
  width: 60rpx;
  height: 60rpx;
  border-radius: 15rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.notification-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #ff3b30;
  color: white;
  font-size: 20rpx;
  font-weight: bold;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(255, 59, 48, 0.3);
}

.group-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
}

.module-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15rpx;
  padding: 20rpx 15rpx;
  text-align: center;
  transition: all 0.3s ease;
  border: 1rpx solid rgba(0, 0, 0, 0.05);
}

.module-item:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.item-icon {
  font-size: 32rpx;
  margin-bottom: 10rpx;
  display: block;
}

.item-name {
  font-size: 22rpx;
  color: #333;
  font-weight: 500;
  display: block;
}

/* 快捷操作 */
.quick-actions {
  padding: 0 30rpx 40rpx 30rpx;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.action-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.action-item:active {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 15rpx;
  display: block;
}

.action-name {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
  display: block;
}
</style> 