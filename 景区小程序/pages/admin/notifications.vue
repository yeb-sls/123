<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">管理员通知</text>
      <text class="page-desc">查看系统通知和提醒</text>
      <view class="header-actions">
        <button class="mark-all-read-btn" @click="markAllAsRead">全部已读</button>
        <button class="refresh-btn" @click="loadNotifications">刷新</button>
        <button class="debug-btn" @click="toggleDebugInfo">调试信息</button>
      </view>
    </view>
    
    <!-- 调试信息区域 -->
    <view v-if="showDebug" class="debug-section">
      <view class="debug-header">
        <text class="debug-title">🔧 调试信息</text>
        <button class="close-debug-btn" @click="hideDebugInfo">关闭</button>
      </view>
      <view class="debug-content">
        <view class="debug-item">
          <text class="debug-label">通知总数：</text>
          <text class="debug-value">{{ notifications.length }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">未读数量：</text>
          <text class="debug-value">{{ unreadCount }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">有订单号的通知：</text>
          <text class="debug-value">{{ notificationsWithOrderId.length }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">通知类型统计：</text>
          <text class="debug-value">{{ notificationTypeStats }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">最后更新时间：</text>
          <text class="debug-value">{{ lastUpdateTime }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">云对象状态：</text>
          <text class="debug-value">{{ cloudObjectStatus }}</text>
        </view>
      </view>
      
      <!-- 详细通知数据 -->
      <view class="debug-details">
        <text class="debug-subtitle">📋 通知详细数据</text>
        <view v-for="(notification, index) in notifications.slice(0, 5)" :key="index" class="debug-notification">
          <text class="debug-notification-title">通知 {{ index + 1 }}:</text>
          <view class="debug-notification-data">
            <text class="debug-data-item">ID: {{ notification._id }}</text>
            <text class="debug-data-item">标题: {{ notification.title }}</text>
            <text class="debug-data-item">类型: {{ notification.type }}</text>
            <text class="debug-data-item">order_id: {{ notification.order_id || 'undefined' }}</text>
            <text class="debug-data-item">orderNo: {{ notification.orderNo || 'undefined' }}</text>
            <text class="debug-data-item">已读: {{ notification.is_read ? '是' : '否' }}</text>
            <text class="debug-data-item">创建时间: {{ formatTime(notification.create_time) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 通知列表 -->
    <view class="notifications-list">
      <view v-for="notification in notifications" :key="notification._id" class="notification-card" :class="{ unread: !notification.is_read }">
        <view class="notification-header">
          <view class="notification-info">
            <text class="notification-title">{{ notification.title }}</text>
            <text class="notification-time">{{ formatTime(notification.create_time) }}</text>
          </view>
          <view class="notification-status">
            <text v-if="!notification.is_read" class="unread-badge">未读</text>
            <text v-if="notification.priority === 'high'" class="priority-badge">重要</text>
          </view>
        </view>
        
        <view class="notification-content">
          <text class="content-text">{{ notification.content }}</text>
          <view v-if="notification.order_id" class="order-info">
            <text class="order-label">订单号：</text>
            <text class="order-number">{{ notification.order_id }}</text>
          </view>
          <view v-if="notification.orderNo" class="order-info">
            <text class="order-label">订单号：</text>
            <text class="order-number">{{ notification.orderNo }}</text>
          </view>
        </view>
        
        <view class="notification-actions">
          <button v-if="!notification.is_read" class="mark-read-btn" @click="markAsRead(notification._id)">
            标记已读
          </button>
          <button v-if="notification.type === 'joint_order_paid'" class="view-order-btn" @click="viewOrder(notification.order_id)">
            查看订单
          </button>
        </view>
      </view>
      
      <view v-if="notifications.length === 0" class="empty-state">
        <text class="empty-text">暂无通知</text>
      </view>
    </view>
  </view>
</template>

<script>
// 导入云对象
const notificationSystem = uniCloud.importObject('notification-system')

export default {
  data() {
    return {
      notifications: [],
      showDebug: false,
      lastUpdateTime: '',
      cloudObjectStatus: '未知'
    }
  },
  
  computed: {
    unreadCount() {
      return this.notifications.filter(n => !n.is_read).length
    },
    
    notificationsWithOrderId() {
      return this.notifications.filter(n => n.order_id || n.orderNo)
    },
    
    notificationTypeStats() {
      const stats = {}
      this.notifications.forEach(n => {
        stats[n.type] = (stats[n.type] || 0) + 1
      })
      return Object.entries(stats).map(([type, count]) => `${type}: ${count}`).join(', ')
    }
  },
  
  onLoad() {
    this.loadNotifications()
  },
  
  methods: {
    async loadNotifications() {
      try {
        console.log('开始加载通知数据...')
        const result = await notificationSystem.getNotifications()
        console.log('通知数据加载结果:', result)
        
        if (result.success) {
          this.notifications = result.data || []
          console.log('通知列表:', this.notifications)
          
          // 检查每个通知的订单号信息
          this.notifications.forEach((notification, index) => {
            console.log(`通知${index}:`, {
              title: notification.title,
              order_id: notification.order_id,
              orderNo: notification.orderNo,
              type: notification.type
            })
          })
        } else {
          uni.showToast({ title: result.message, icon: 'none' })
        }
        
        // 更新调试信息
        this.updateDebugInfo()
      } catch (error) {
        console.error('加载通知失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    toggleDebugInfo() {
      this.showDebug = !this.showDebug
      if (this.showDebug) {
        this.updateDebugInfo()
      }
    },
    
    hideDebugInfo() {
      this.showDebug = false
    },
    
    updateDebugInfo() {
      this.lastUpdateTime = new Date().toLocaleString()
      this.cloudObjectStatus = typeof notificationSystem === 'object' ? '已加载' : '未加载'
      console.log('🔧 调试信息已更新')
      console.log('📊 通知统计:', {
        总数: this.notifications.length,
        未读: this.unreadCount,
        有订单号: this.notificationsWithOrderId.length,
        类型统计: this.notificationTypeStats
      })
    },
    
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    
    async markAsRead(notificationId) {
      try {
        const result = await notificationSystem.markAsRead({ notificationId })
        if (result.success) {
          await this.loadNotifications()
          uni.showToast({ title: '已标记为已读', icon: 'success' })
        } else {
          uni.showToast({ title: result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('标记已读失败:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    async markAllAsRead() {
      try {
        const result = await notificationSystem.markAllAsRead()
        if (result.success) {
          await this.loadNotifications()
          uni.showToast({ title: `已标记 ${result.updatedCount} 条通知为已读`, icon: 'success' })
        } else {
          uni.showToast({ title: result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('标记全部已读失败:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    viewOrder(orderId) {
      // 跳转到订单详情页面
      uni.navigateTo({
        url: `/pages/admin/joint/orders?orderId=${orderId}`
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

.header-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.mark-all-read-btn, .refresh-btn, .debug-btn {
  padding: 15rpx 30rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.mark-all-read-btn {
  background: #007aff;
  color: #fff;
}

.refresh-btn {
  background: #f0f0f0;
  color: #333;
}

.debug-btn {
  background: #ff9500;
  color: #fff;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.notification-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  border-left: 6rpx solid #007aff;
}

.notification-card.unread {
  border-left-color: #ff3b30;
  background: #fff9f9;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.notification-info {
  flex: 1;
}

.notification-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.notification-time {
  font-size: 24rpx;
  color: #999;
}

.notification-status {
  display: flex;
  gap: 10rpx;
}

.unread-badge, .priority-badge {
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.unread-badge {
  background: #ff3b30;
  color: #fff;
}

.priority-badge {
  background: #ff9500;
  color: #fff;
}

.notification-content {
  margin-bottom: 20rpx;
}

.content-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.order-info {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
  padding: 12rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border-left: 4rpx solid #007aff;
}

.order-label {
  font-size: 26rpx;
  color: #495057;
  font-weight: bold;
  margin-right: 12rpx;
}

.order-number {
  font-size: 26rpx;
  color: #007aff;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.notification-actions {
  display: flex;
  gap: 20rpx;
}

.mark-read-btn, .view-order-btn {
  padding: 12rpx 24rpx;
  border-radius: 6rpx;
  font-size: 26rpx;
  border: none;
}

.mark-read-btn {
  background: #f0f0f0;
  color: #333;
}

.view-order-btn {
  background: #007aff;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 调试信息样式 */
.debug-section {
  background: #f8f9fa;
  border: 2rpx solid #dee2e6;
  border-radius: 12rpx;
  margin: 20rpx 0;
  padding: 24rpx;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #dee2e6;
}

.debug-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #495057;
}

.close-debug-btn {
  padding: 8rpx 16rpx;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.debug-content {
  margin-bottom: 24rpx;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #e9ecef;
}

.debug-label {
  font-size: 28rpx;
  color: #495057;
  font-weight: bold;
}

.debug-value {
  font-size: 28rpx;
  color: #007aff;
  font-weight: bold;
}

.debug-details {
  border-top: 2rpx solid #dee2e6;
  padding-top: 20rpx;
}

.debug-subtitle {
  font-size: 30rpx;
  font-weight: bold;
  color: #495057;
  margin-bottom: 16rpx;
  display: block;
}

.debug-notification {
  background: white;
  border: 1rpx solid #dee2e6;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
}

.debug-notification-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #495057;
  margin-bottom: 12rpx;
  display: block;
}

.debug-notification-data {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.debug-data-item {
  font-size: 24rpx;
  color: #6c757d;
  font-family: 'Courier New', monospace;
}
</style> 