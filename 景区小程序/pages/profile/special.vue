<template>
  <view class="special-bg">
    <view class="special-container">
      <!-- 页面标题 -->
      <view class="page-header">
        <text class="page-title">我的专场法会</text>
        <text class="page-subtitle">查看您的专场法会报名记录</text>
      </view>

      <!-- 统计信息 -->
      <view class="stats-section">
        <view class="stat-item">
          <text class="stat-number">{{ totalCount }}</text>
          <text class="stat-label">总报名</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ pendingCount }}</text>
          <text class="stat-label">待确认</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ confirmedCount }}</text>
          <text class="stat-label">已确认</text>
        </view>
      </view>

      <!-- 订单列表 -->
      <view class="orders-section" v-if="orders.length > 0">
        <view class="section-title">报名记录</view>
        <view class="order-list">
          <view v-for="(order, index) in orders" :key="index" class="order-item" @click="viewOrderDetail(order)">
            <view class="order-header">
              <text class="order-type">专场法会</text>
              <text class="order-status" :class="order.status === 'pending' ? 'status-pending' : order.status === 'confirmed' ? 'status-confirmed' : order.status === 'cancelled' ? 'status-cancelled' : order.status === 'completed' ? 'status-completed' : 'status-pending'">{{ getStatusText(order.status) }}</text>
            </view>
            <view class="order-content">
              <view class="order-info">
                <text class="order-title">{{ order.title }}</text>
                <text class="order-date">报名时间：{{ formatDate(order.createTime) }}</text>
                <text class="order-participants">参与人数：{{ order.participantCount }}人</text>
              </view>
              <view class="order-price">
                <text class="price-label">总费用</text>
                <text class="price-amount">¥{{ order.totalAmount }}</text>
              </view>
            </view>
            <view class="order-footer">
              <button class="action-btn detail" @click.stop="viewOrderDetail(order)">查看详情</button>
              <button v-if="order.status === 'pending'" class="action-btn cancel" @click.stop="cancelOrder(order)">取消报名</button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-section" v-else>
        <text class="empty-icon">📋</text>
        <text class="empty-title">暂无专场法会记录</text>
        <text class="empty-desc">您还没有报名过专场法会</text>
        <button class="empty-btn" @click="goToSpecial">立即报名</button>
      </view>

      <!-- 返回按钮 -->
      <view class="back-section">
        <button class="back-btn" @click="goBack">返回上页</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      totalCount: 0,
      pendingCount: 0,
      confirmedCount: 0
    }
  },
  onLoad() {
    this.loadOrders()
  },
  onShow() {
    this.loadOrders()
  },
  methods: {
    loadOrders() {
      // 从本地存储加载订单数据
      const allOrders = uni.getStorageSync('fahuiOrders') || []
      this.orders = allOrders.filter(order => order.type === 'special')
      
      // 计算统计数据
      this.totalCount = this.orders.length
      this.pendingCount = this.orders.filter(order => order.status === 'pending').length
      this.confirmedCount = this.orders.filter(order => order.status === 'confirmed').length
    },
    getStatusClass(status) {
      const statusMap = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'cancelled': 'status-cancelled',
        'completed': 'status-completed'
      }
      return statusMap[status] || 'status-pending'
    },
    getStatusText(status) {
      const statusMap = {
        'pending': '待确认',
        'confirmed': '已确认',
        'cancelled': '已取消',
        'completed': '已完成'
      }
      return statusMap[status] || '待确认'
    },
    formatDate(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    viewOrderDetail(order) {
      // 保存当前订单到本地存储
      uni.setStorageSync('currentOrder', order)
      uni.navigateTo({
        url: '/pages/profile/orderDetail',
        success: () => {
          console.log('跳转到订单详情页成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '页面跳转失败', icon: 'none' })
        }
      })
    },
    cancelOrder(order) {
      uni.showModal({
        title: '确认取消',
        content: '确定要取消这个专场法会报名吗？',
        success: (res) => {
          if (res.confirm) {
            // 更新订单状态
            const allOrders = uni.getStorageSync('fahuiOrders') || []
            const orderIndex = allOrders.findIndex(o => o.id === order.id)
            if (orderIndex !== -1) {
              allOrders[orderIndex].status = 'cancelled'
              uni.setStorageSync('fahuiOrders', allOrders)
              this.loadOrders()
              uni.showToast({ title: '取消成功', icon: 'success' })
            }
          }
        }
      })
    },
    goToSpecial() {
      uni.navigateTo({
        url: '/pages/fahui/special',
        success: () => {
          console.log('跳转到专场法会页面成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '页面跳转失败', icon: 'none' })
        }
      })
    },
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回上页成功')
        },
        fail: (err) => {
          console.error('返回上页失败:', err)
          uni.navigateTo({ 
            url: '/pages/profile/index',
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
.special-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}
.special-container {
  padding: 20rpx;
}
.page-header {
  text-align: center;
  padding: 40rpx 0 20rpx 0;
}
.page-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
}
.page-subtitle {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}
.stats-section {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 32rpx 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}
.stat-item {
  text-align: center;
}
.stat-number {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 8rpx;
}
.stat-label {
  font-size: 24rpx;
  color: #666;
}
.orders-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 20rpx;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.order-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.order-type {
  font-size: 26rpx;
  color: #666;
  background: #f0f8ff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.order-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}
.status-confirmed {
  background: #f6ffed;
  color: #52c41a;
}
.status-cancelled {
  background: #fff2f0;
  color: #ff4d4f;
}
.status-completed {
  background: #f0f8ff;
  color: #2d8cf0;
}
.order-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}
.order-info {
  flex: 1;
}
.order-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}
.order-date, .order-participants {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
}
.order-price {
  text-align: right;
}
.price-label {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-bottom: 4rpx;
}
.price-amount {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b35;
}
.order-footer {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
}
.action-btn {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  border: none;
}
.action-btn.detail {
  background: #2d8cf0;
  color: #fff;
}
.action-btn.cancel {
  background: #fff;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
}
.empty-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 80rpx 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}
.empty-icon {
  display: block;
  font-size: 80rpx;
  margin-bottom: 20rpx;
}
.empty-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}
.empty-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 32rpx;
}
.empty-btn {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  font-weight: bold;
}
.back-section {
  margin-top: 24rpx;
}
.back-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>