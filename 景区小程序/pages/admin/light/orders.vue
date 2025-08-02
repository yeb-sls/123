<template>
  <view class="admin-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <text class="page-title">供灯订单管理</text>
          <text class="page-desc">查看和管理供灯祈福订单</text>
        </view>
        <view class="header-actions">
          <button class="export-btn" @click="exportOrders">
            <text class="btn-icon">📊</text>
            <text>导出订单</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-number">{{ orders.length }}</text>
        <text class="stat-label">总订单数</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ pendingCount }}</text>
        <text class="stat-label">待处理</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ completedCount }}</text>
        <text class="stat-label">已完成</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ totalRevenue }}</text>
        <text class="stat-label">总收入(元)</text>
      </view>
    </view>

    <!-- 筛选器 -->
    <view class="filter-section">
      <view class="filter-group">
        <text class="filter-label">状态筛选：</text>
        <picker 
          :value="statusIndex" 
          :range="statusOptions" 
          @change="onStatusChange"
          class="filter-picker"
        >
          <view class="picker-display">
            <text>{{ statusOptions[statusIndex] }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="orders-list">
      <view class="list-header">
        <text class="list-title">💡 供灯订单列表</text>
        <text class="list-subtitle">共 {{ filteredOrders.length }} 个订单</text>
      </view>
      
      <!-- 空状态 -->
      <view v-if="filteredOrders.length === 0" class="empty-state">
        <text class="empty-icon">💡</text>
        <text class="empty-title">暂无订单</text>
        <text class="empty-desc">当前筛选条件下没有找到订单</text>
      </view>

      <!-- 订单列表 -->
      <view v-else class="order-items">
        <view 
          v-for="(order, index) in filteredOrders" 
          :key="order._id" 
          class="order-item"
          :class="{ 'order-pending': order.status === '待处理', 'order-completed': order.status === '已完成' }"
        >
          <!-- 订单信息 -->
          <view class="order-info">
            <view class="info-header">
              <text class="order-id">订单号：{{ order.orderNo }}</text>
              <text class="order-status" :class="order.status === '待处理' ? 'status-pending' : 'status-completed'">{{ order.status }}</text>
            </view>
            
            <view class="order-details">
              <view class="detail-row">
                <text class="detail-label">供灯人：</text>
                <text class="detail-value">{{ order.applicantName }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">灯塔：</text>
                <text class="detail-value">{{ order.towerName }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">楼层：</text>
                <text class="detail-value">{{ order.floorName }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">许愿语：</text>
                <text class="detail-value">{{ order.wish || '无' }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">功德金：</text>
                <text class="detail-value price">¥{{ order.amount }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">创建时间：</text>
                <text class="detail-value">{{ formatDate(order.createTime) }}</text>
              </view>
            </view>
            
            <!-- 操作按钮 -->
            <view class="order-actions">
              <view class="action-group">
                <button class="detail-btn" @click="viewOrderDetail(order)">
                  <text class="action-icon">👁️</text>
                  <text>查看详情</text>
                </button>
                <button 
                  v-if="order.status === '待处理'" 
                  class="complete-btn" 
                  @click="completeOrder(order)"
                >
                  <text class="action-icon">✅</text>
                  <text>确认完成</text>
                </button>
              </view>
              
              <view class="note-section">
                <input 
                  v-model="order.note" 
                  placeholder="添加备注..." 
                  class="note-input"
                  @blur="updateOrderNote(order)"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单详情弹窗 -->
    <uni-popup :show="showDetailPopup" type="center" @close="closeDetailPopup">
      <view class="popup-content detail-popup">
        <view class="popup-header">
          <text class="popup-title">订单详情</text>
          <button class="close-btn" @click="closeDetailPopup">×</button>
        </view>
        
        <view class="detail-container" v-if="currentOrder">
          <view class="detail-section">
            <text class="section-title">基本信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">订单号</text>
                <text class="item-value">{{ currentOrder.orderNo }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">状态</text>
                <text class="item-value" :class="currentOrder.status === '待处理' ? 'status-pending' : 'status-completed'">{{ currentOrder.status }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">供灯人</text>
                <text class="item-value">{{ currentOrder.applicantName }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">联系电话</text>
                <text class="item-value">{{ currentOrder.phone }}</text>
              </view>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-title">供灯信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">灯塔</text>
                <text class="item-value">{{ currentOrder.towerName }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">楼层</text>
                <text class="item-value">{{ currentOrder.floorName }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">许愿语</text>
                <text class="item-value">{{ currentOrder.wish || '无' }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">功德金</text>
                <text class="item-value price">¥{{ currentOrder.amount }}</text>
              </view>
            </view>
          </view>
          
          <view class="detail-section" v-if="currentOrder.receiverInfo">
            <text class="section-title">收件信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">收件人</text>
                <text class="item-value">{{ currentOrder.receiverInfo.name }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">联系电话</text>
                <text class="item-value">{{ currentOrder.receiverInfo.phone }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">收件地址</text>
                <text class="item-value">{{ currentOrder.receiverInfo.address }}</text>
              </view>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-title">时间信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">创建时间</text>
                <text class="item-value">{{ formatDate(currentOrder.createTime) }}</text>
              </view>
              <view class="detail-item" v-if="currentOrder.completeTime">
                <text class="item-label">完成时间</text>
                <text class="item-value">{{ formatDate(currentOrder.completeTime) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <view class="loading-content">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

// 导入云对象
const commonManagement = uniCloud.importObject('common-management')

export default {
  components: { uniPopup },
  data() {
    return {
      orders: [],
      currentOrder: null,
      statusOptions: ['全部', '待处理', '已完成'],
      statusIndex: 0,
      loading: false,
      showDetailPopup: false
    }
  },
  computed: {
    filteredOrders() {
      if (this.statusIndex === 0) {
        return this.orders
      }
      const status = this.statusOptions[this.statusIndex]
      return this.orders.filter(order => order.status === status)
    },
    pendingCount() {
      return this.orders.filter(order => order.status === '待处理').length
    },
    completedCount() {
      return this.orders.filter(order => order.status === '已完成').length
    },
    totalRevenue() {
      return this.orders.reduce((sum, order) => sum + (order.amount || 0), 0)
    }
  },
  onLoad() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      try {
        this.loading = true
        console.log('开始加载供灯订单数据...')
        
        const result = await commonManagement.getLightOrders()
        console.log('供灯订单数据加载结果:', result)
        
        if (result.success && result.data) {
          this.orders = result.data
          console.log('供灯订单数据加载成功，共', this.orders.length, '条')
        } else {
          this.orders = []
          console.log('供灯订单数据为空')
        }
      } catch (error) {
        console.error('加载供灯订单失败:', error)
        uni.showToast({ 
          title: '加载失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
        this.orders = []
      } finally {
        this.loading = false
      }
    },
    onStatusChange(e) {
      this.statusIndex = e.detail.value
    },
    formatDate(dateString) {
      if (!dateString) return '未知'
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    viewOrderDetail(order) {
      this.currentOrder = { ...order }
      this.showDetailPopup = true
    },
    closeDetailPopup() {
      this.showDetailPopup = false
      this.currentOrder = null
    },
    async completeOrder(order) {
      uni.showModal({
        title: '确认完成',
        content: `确定要将订单"${order.orderNo}"标记为已完成吗？`,
        confirmText: '确认',
        confirmColor: '#007aff',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '处理中...' })
              const result = await commonManagement.updateLightOrderStatus({
                _id: order._id, 
                status: '已完成',
                completeTime: new Date().toISOString()
              })
              if (!result.success) {
                throw new Error(result.message || '状态更新失败')
              }
              
              // 更新本地数据
              const index = this.orders.findIndex(o => o._id === order._id)
              if (index !== -1) {
                this.orders[index].status = '已完成'
                this.orders[index].completeTime = new Date().toISOString()
              }
              
              uni.hideLoading()
              uni.showToast({ 
                title: '订单已完成', 
                icon: 'success',
                duration: 2000
              })
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ 
                title: '操作失败: ' + (error.message || '未知错误'), 
                icon: 'none',
                duration: 3000
              })
              console.error('完成订单失败:', error)
            }
          }
        }
      })
    },
    async updateOrderNote(order) {
      try {
        await commonManagement.updateLightOrderStatus({
          orderId: order._id,
          note: order.note
        })
        uni.showToast({ 
          title: '备注已保存', 
          icon: 'success',
          duration: 1500
        })
      } catch (error) {
        console.error('保存备注失败:', error)
        uni.showToast({ 
          title: '保存备注失败', 
          icon: 'none',
          duration: 2000
        })
      }
    },
    exportOrders() {
      // 导出订单功能
      uni.showToast({ 
        title: '导出功能开发中', 
        icon: 'none',
        duration: 2000
      })
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.page-desc {
  font-size: 28rpx;
  opacity: 0.9;
  display: block;
}

.header-actions {
  display: flex;
  gap: 20rpx;
}

.export-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  color: white;
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 28rpx;
}

.btn-icon {
  font-size: 32rpx;
}

.stats-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #007aff;
  display: block;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.filter-section {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.filter-label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.filter-picker {
  flex: 1;
}

.picker-display {
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 20rpx;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.picker-arrow {
  color: #999;
  font-size: 24rpx;
}

.orders-list {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.list-header {
  margin-bottom: 30rpx;
}

.list-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.list-subtitle {
  font-size: 24rpx;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.order-item {
  background: #f8f9fa;
  border-radius: 20rpx;
  padding: 30rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.order-pending {
  border-left: 8rpx solid #ff9500;
}

.order-completed {
  border-left: 8rpx solid #34c759;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.order-status {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-weight: bold;
}

.status-pending {
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}

.status-completed {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.detail-label {
  font-size: 26rpx;
  color: #666;
  min-width: 120rpx;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.detail-value.price {
  color: #ff6b35;
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  gap: 20rpx;
}

.action-group {
  display: flex;
  gap: 15rpx;
}

.detail-btn, .complete-btn {
  border: none;
  border-radius: 10rpx;
  padding: 15rpx 25rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-btn {
  background: #007aff;
  color: white;
}

.complete-btn {
  background: #34c759;
  color: white;
}

.action-icon {
  font-size: 24rpx;
}

.note-section {
  flex: 1;
}

.note-input {
  width: 100%;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 15rpx;
  font-size: 24rpx;
  background: #fafafa;
  box-sizing: border-box;
}

.popup-content {
  background: white;
  border-radius: 20rpx;
  width: 700rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.detail-popup {
  width: 800rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 40rpx;
  color: #999;
  padding: 0;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-container {
  padding: 40rpx;
}

.detail-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 15rpx;
  background: #f8f9fa;
  border-radius: 10rpx;
}

.item-label {
  font-size: 26rpx;
  color: #666;
  min-width: 120rpx;
}

.item-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.item-value.price {
  color: #ff6b35;
  font-weight: bold;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  border-radius: 20rpx;
  padding: 60rpx;
  text-align: center;
}

.loading-icon {
  font-size: 60rpx;
  display: block;
  margin-bottom: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}
</style> 