<template>
  <view class="orders-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <view class="title">我的订单</view>
      <view class="refresh-btn" @click="loadOrders">
        <text class="refresh-icon">🔄</text>
        <text class="refresh-text">刷新</text>
      </view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="orders.length === 0" class="empty">暂无订单</view>
    <view v-else class="order-list">
      <view v-for="order in orders" :key="order._id" class="order-item" @click="goDetail(order)">
        <view class="order-header">
          <view class="order-title">{{ getOrderTitle(order) }}</view>
          <view class="order-status" :class="{
            'status-pending': order.status === 'pending' || order.status === '待确认',
            'status-confirmed': order.status === 'confirmed' || order.status === '已确认',
            'status-cancelled': order.status === 'cancelled' || order.status === '已取消',
            'status-paid': order.status === 'paid' || order.status === '已支付',
            'status-default': !order.status || (order.status !== 'pending' && order.status !== 'confirmed' && order.status !== 'cancelled' && order.status !== 'paid' && order.status !== '待确认' && order.status !== '已确认' && order.status !== '已取消' && order.status !== '已支付')
          }">
            {{ getStatusText(order.status) }}
          </view>
        </view>
        <view class="order-content">
          <view class="order-info">
            <text class="info-label">报名人：</text>
            <text class="info-value">{{ getApplicantsText(order) }}</text>
          </view>
          <view class="order-info">
            <text class="info-label">金额：</text>
            <text class="info-value price">¥{{ order.amount || order.totalFee || 0 }}</text>
          </view>
          <view class="order-info">
            <text class="info-label">支付时间：</text>
            <text class="info-value">{{ formatDate(order.payTime) }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="order-time">{{ formatDate(order.createTime) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入云对象
const fahuiManagement = uniCloud.importObject('fahui-management')
const jointManagement = uniCloud.importObject('joint-management')

export default {
  data() {
    return {
      orders: [],
      loading: false
    }
  },
  onShow() {
    this.loadOrders()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    async loadOrders() {
      this.loading = true
      try {
        // 获取专场法会订单
        const fahuiResult = await fahuiManagement.getOrders()
        let fahuiOrders = []
        if (fahuiResult.success) {
          fahuiOrders = fahuiResult.data || []
        }
        
        // 获取合坛法会订单
        const jointResult = await jointManagement.getOrders()
        let jointOrders = []
        if (jointResult.success) {
          jointOrders = jointResult.data || []
        }
        
        // 合并订单并按时间倒序排列
        this.orders = [...fahuiOrders, ...jointOrders].sort((a, b) => {
          const timeA = new Date(a.createTime || a.create_time || 0)
          const timeB = new Date(b.createTime || b.create_time || 0)
          return timeB - timeA
        })
        
      } catch (error) {
        console.error('加载订单失败：', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    getOrderTitle(order) {
      if (order.fahuiType === 'joint') {
        return '合坛法会'
      } else {
        return order.fahuiName || (order.fahuiProject && order.fahuiProject.name) || '专场法会'
      }
    },
    
    getApplicantsText(order) {
      if (order.applicants && order.applicants.length > 0) {
        return order.applicants.map(a => a.name).join('、')
      } else if (order.participantName) {
        return order.participantName
      } else {
        return '未知'
      }
    },
    
    getStatusText(status) {
      const statusMap = {
        'paid': '已支付',
        'pending': '待确认',
        'confirmed': '已确认',
        'cancelled': '已取消',
        '待确认': '待确认',
        '已确认': '已确认',
        '已取消': '已取消',
        '已支付': '已支付',
        '待支付': '待支付'
      }
      return statusMap[status] || status || '未知'
    },
    
    getStatusClass(status) {
      switch (status) {
        case '待确认':
        case 'pending':
          return 'status-pending'
        case '已确认':
        case 'confirmed':
          return 'status-confirmed'
        case '已取消':
        case 'cancelled':
          return 'status-cancelled'
        case '已支付':
        case 'paid':
          return 'status-paid'
        default:
          return 'status-default'
      }
    },
    
    formatDate(date) {
      if (!date) return '-'
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },
    
    goDetail(order) {
      uni.setStorageSync('orderDetail', order);
      uni.navigateTo({ url: '/pages/profile/orderDetail' });
    }
  }
}
</script>
<style scoped>
.orders-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 0;
}

.header {
  background: #2d8cf0;
  color: white;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.back-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.refresh-btn {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.refresh-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.loading {
  text-align: center;
  color: #666;
  margin-top: 100rpx;
  font-size: 28rpx;
}

.empty {
  text-align: center;
  color: #aaa;
  margin-top: 100rpx;
  font-size: 28rpx;
}

.order-list {
  padding: 20rpx;
}

.order-item {
  background: white;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.order-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.order-status {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
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

.status-paid {
  background: #e6f7ff;
  color: #1890ff;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

.order-content {
  margin-bottom: 16rpx;
}

.order-info {
  display: flex;
  margin-bottom: 8rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  width: 120rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
}

.order-footer {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 12rpx;
}

.order-time {
  color: #999;
  font-size: 24rpx;
}
</style> 