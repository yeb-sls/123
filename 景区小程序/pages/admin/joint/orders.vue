<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会订单管理</text>
      <text class="page-desc">查看和管理合坛法会订单</text>
    </view>
    
    <!-- 订单列表 -->
    <view class="orders-list">
      <view v-for="order in orders" :key="order._id" class="order-card">
        <view class="order-header">
          <view class="order-info">
            <text class="order-id">订单号：{{ order._id }}</text>
            <text class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</text>
          </view>
          <text class="order-time">{{ formatTime(order.createTime) }}</text>
        </view>
        
        <view class="order-content">
          <view class="order-item">
            <text class="item-label">项目名称：</text>
            <text class="item-value">{{ order.projectName }}</text>
          </view>
          <view class="order-item">
            <text class="item-label">法会日期：</text>
            <text class="item-value">{{ order.fahuiDate }}</text>
          </view>
          <view class="order-item">
            <text class="item-label">报名人数：</text>
            <text class="item-value">{{ order.applicants ? order.applicants.length : 0 }}人</text>
          </view>
          <view class="order-item">
            <text class="item-label">总费用：</text>
            <text class="item-value price">¥{{ order.totalCost }}</text>
          </view>
        </view>
        
        <!-- 报名者信息 -->
        <view v-if="order.applicants && order.applicants.length > 0" class="applicants-section">
          <text class="section-title">报名者信息</text>
          <view v-for="(applicant, index) in order.applicants" :key="index" class="applicant-item">
            <text class="applicant-name">{{ applicant.name }}</text>
            <text class="applicant-phone">{{ applicant.phone }}</text>
          </view>
        </view>
        
        <!-- 代办物品 -->
        <view v-if="order.goods && order.goods.length > 0" class="goods-section">
          <text class="section-title">代办物品</text>
          <view v-for="(good, index) in order.goods" :key="index" class="good-item">
            <text class="good-name">{{ good.name }}</text>
            <text class="good-quantity">x{{ good.quantity }}</text>
            <text class="good-price">¥{{ good.price }}</text>
          </view>
        </view>
        
        <!-- 收件信息 -->
        <view v-if="order.receiver" class="receiver-section">
          <text class="section-title">收件信息</text>
          <view class="receiver-info">
            <text class="receiver-name">{{ order.receiver.name }}</text>
            <text class="receiver-phone">{{ order.receiver.phone }}</text>
            <text class="receiver-address">{{ order.receiver.address }}</text>
          </view>
        </view>
        
        <!-- 操作日志 -->
        <view v-if="order.logs && order.logs.length > 0" class="logs-section">
          <text class="section-title">操作日志</text>
          <view v-for="(log, index) in order.logs" :key="index" class="log-item">
            <text class="log-time">{{ formatTime(log.time) }}</text>
            <text class="log-action">{{ log.action }}</text>
            <text class="log-operator">{{ log.operator }}</text>
          </view>
        </view>
        
        <!-- 管理员备注 -->
        <view v-if="order.adminRemarks && order.adminRemarks.length > 0" class="remarks-section">
          <text class="section-title">管理员备注</text>
          <view v-for="(remark, index) in order.adminRemarks" :key="index" class="remark-item">
            <text class="remark-time">{{ formatTime(remark.time) }}</text>
            <text class="remark-content">{{ remark.content }}</text>
            <text class="remark-operator">{{ remark.operator }}</text>
          </view>
        </view>
        
        <!-- 订单操作 -->
        <view class="order-actions">
          <button v-if="order.status === '待确认'" class="action-btn confirm" @click="confirmOrder(order._id)">
            确认订单
          </button>
          <button v-if="order.status === '已确认'" class="action-btn complete" @click="completeOrder(order._id)">
            完成法会
          </button>
          <button class="action-btn remark" @click="showRemarkModal(order._id)">
            添加备注
          </button>
        </view>
      </view>
    </view>
    
    <!-- 备注弹窗 -->
    <uni-popup ref="remarkPopup" type="center" :mask-click="false">
      <view class="remark-popup">
        <view class="popup-header">
          <text class="popup-title">添加备注</text>
          <text class="popup-close" @click="closeRemarkModal">×</text>
        </view>
        
        <view class="popup-content">
          <textarea v-model="remarkContent" class="remark-textarea" placeholder="请输入备注内容" maxlength="500" />
        </view>
        
        <view class="popup-actions">
          <button class="cancel-btn" @click="closeRemarkModal">取消</button>
          <button class="confirm-btn" @click="addRemark">确认</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

export default {
  components: { uniPopup },
  
  data() {
    return {
      orders: [],
      remarkContent: '',
      currentOrderId: ''
    }
  },
  
  onLoad() {
    this.loadOrders()
  },
  
  methods: {
    async loadOrders() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getJointOrders'
        })
        this.orders = res.result && res.result.data ? res.result.data : []
      } catch (error) {
        console.error('加载合坛法会订单失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    getStatusClass(status) {
      const statusMap = {
        '待支付': 'pending',
        '已支付': 'paid',
        '待确认': 'waiting',
        '已确认': 'confirmed',
        '已完成': 'completed',
        '已取消': 'cancelled'
      }
      return statusMap[status] || 'default'
    },
    
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    
    async confirmOrder(orderId) {
      try {
        await uniCloud.callFunction({
          name: 'updateJointOrderStatus',
          data: { 
            orderId, 
            status: '已确认',
            action: '确认订单'
          }
        })
        await this.loadOrders()
        uni.showToast({ title: '订单已确认' })
      } catch (error) {
        console.error('确认订单失败:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    async completeOrder(orderId) {
      try {
        await uniCloud.callFunction({
          name: 'updateJointOrderStatus',
          data: { 
            orderId, 
            status: '已完成',
            action: '完成法会'
          }
        })
        await this.loadOrders()
        uni.showToast({ title: '法会已完成' })
      } catch (error) {
        console.error('完成法会失败:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    showRemarkModal(orderId) {
      this.currentOrderId = orderId
      this.remarkContent = ''
      this.$refs.remarkPopup.open()
    },
    
    closeRemarkModal() {
      this.$refs.remarkPopup.close()
    },
    
    async addRemark() {
      if (!this.remarkContent.trim()) {
        uni.showToast({ title: '请输入备注内容', icon: 'none' })
        return
      }
      
      try {
        await uniCloud.callFunction({
          name: 'addJointOrderRemark',
          data: { 
            orderId: this.currentOrderId, 
            content: this.remarkContent 
          }
        })
        await this.loadOrders()
        this.closeRemarkModal()
        uni.showToast({ title: '备注已添加' })
      } catch (error) {
        console.error('添加备注失败:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.order-id {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.order-status {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-status.paid {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status.waiting {
  background: #fff3cd;
  color: #856404;
}

.order-status.confirmed {
  background: #d4edda;
  color: #155724;
}

.order-status.completed {
  background: #cce5ff;
  color: #004085;
}

.order-status.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-time {
  font-size: 24rpx;
  color: #999;
}

.order-content {
  margin-bottom: 20rpx;
}

.order-item {
  display: flex;
  margin-bottom: 10rpx;
}

.item-label {
  font-size: 26rpx;
  color: #999;
  width: 160rpx;
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

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.applicants-section, .goods-section, .receiver-section, .logs-section, .remarks-section {
  margin-bottom: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.applicant-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.applicant-name {
  font-size: 26rpx;
  color: #333;
}

.applicant-phone {
  font-size: 26rpx;
  color: #666;
}

.good-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.good-name {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.good-quantity {
  font-size: 26rpx;
  color: #666;
  margin: 0 20rpx;
}

.good-price {
  font-size: 26rpx;
  color: #ff6b35;
}

.receiver-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.receiver-name, .receiver-phone, .receiver-address {
  font-size: 26rpx;
  color: #333;
}

.log-item, .remark-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
  padding: 10rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.log-time, .remark-time {
  font-size: 24rpx;
  color: #999;
}

.log-action, .remark-content {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  margin: 0 20rpx;
}

.log-operator, .remark-operator {
  font-size: 24rpx;
  color: #667eea;
}

.order-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.action-btn.confirm {
  background: #28a745;
  color: #fff;
}

.action-btn.complete {
  background: #17a2b8;
  color: #fff;
}

.action-btn.remark {
  background: #6c757d;
  color: #fff;
}

.remark-popup {
  background: #fff;
  border-radius: 12rpx;
  width: 500rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.popup-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.popup-content {
  padding: 30rpx;
}

.remark-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.popup-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background: #667eea;
  color: #fff;
}
</style> 