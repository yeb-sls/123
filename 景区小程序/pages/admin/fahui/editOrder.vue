<template>
  <view class="edit-order-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <button class="back-btn" @click="goBack">
            <text class="back-icon">←</text>
          </button>
          <text class="page-title">编辑专场法会订单</text>
        </view>
        <view class="header-actions">
          <button class="save-btn" @click="saveOrder" :disabled="loading">
            <text class="btn-icon">💾</text>
            <text>{{ loading ? '保存中...' : '保存' }}</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading && !orderDetail" class="loading-state">
      <view class="loading-content">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加载中...</text>
      </view>
    </view>

    <!-- 编辑表单 -->
    <view v-else-if="orderDetail" class="edit-content">
      <!-- 基本信息 -->
      <view class="form-card">
        <view class="card-header">
          <text class="card-title">📋 基本信息</text>
        </view>
        <view class="form-content">
          <view class="form-group">
            <text class="form-label">订单号</text>
            <text class="form-value">{{ orderDetail.orderNo || orderDetail.order_id }}</text>
          </view>
          <view class="form-group">
            <text class="form-label">法会项目</text>
            <text class="form-value">{{ orderDetail.projectName || orderDetail.project_name || '未指定' }}</text>
          </view>
          <view class="form-group">
            <text class="form-label">订单状态</text>
            <picker @change="onStatusChange" :value="statusIndex" :range="statusOptions" range-key="label">
              <view class="picker-item">
                <text class="picker-text">{{ statusOptions[statusIndex].label }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">总金额</text>
            <text class="form-value amount">¥{{ orderDetail.totalCost || orderDetail.total_fee || orderDetail.amount || 0 }}</text>
          </view>
          <view class="form-group">
            <text class="form-label">创建时间</text>
            <text class="form-value">{{ formatDate(orderDetail.createTime || orderDetail.create_time) }}</text>
          </view>
        </view>
      </view>

      <!-- 报名人信息 -->
      <view v-if="orderDetail.applicants && orderDetail.applicants.length > 0" class="form-card">
        <view class="card-header">
          <text class="card-title">👥 报名人信息</text>
        </view>
        <view class="form-content">
          <view 
            v-for="(applicant, index) in orderDetail.applicants" 
            :key="index"
            class="applicant-section"
          >
            <view class="section-title">报名人 {{ index + 1 }}</view>
            <view class="form-group">
              <text class="form-label">姓名</text>
              <input 
                v-model="applicant.name" 
                class="form-input"
                placeholder="请输入姓名"
              />
            </view>
            <view class="form-group">
              <text class="form-label">电话</text>
              <input 
                v-model="applicant.phone" 
                class="form-input"
                placeholder="请输入电话"
                type="number"
              />
            </view>
            <view class="form-group" v-if="applicant.idCard">
              <text class="form-label">身份证</text>
              <input 
                v-model="applicant.idCard" 
                class="form-input"
                placeholder="请输入身份证号"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 操作记录 -->
      <view class="form-card">
        <view class="card-header">
          <text class="card-title">📝 操作记录</text>
        </view>
        <view class="operations-list">
          <view v-if="orderDetail.operations && orderDetail.operations.length > 0">
            <view 
              v-for="(operation, index) in orderDetail.operations" 
              :key="index"
              class="operation-item"
            >
              <view class="operation-header">
                <text class="operation-type">{{ operation.type }}</text>
                <text class="operation-time">{{ formatDate(operation.time) }}</text>
              </view>
              <view class="operation-details">
                <text class="operation-operator">操作人：{{ operation.operator }}</text>
                <text v-if="operation.remark" class="operation-remark">备注：{{ operation.remark }}</text>
              </view>
            </view>
          </view>
          <view v-else class="empty-operations">
            <text class="empty-text">暂无操作记录</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else class="error-state">
      <view class="error-content">
        <text class="error-icon">❌</text>
        <text class="error-text">订单不存在或加载失败</text>
        <button class="retry-btn" @click="loadOrderDetail">
          <text>重新加载</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      orderDetail: null,
      loading: true,
      statusIndex: 0,
      statusOptions: [
        { label: '待支付', value: '待支付' },
        { label: '待确认', value: '待确认' },
        { label: '处理中', value: '处理中' },
        { label: '已完成', value: '已完成' },
        { label: '已取消', value: '已取消' }
      ]
    }
  },

  onLoad(options) {
    console.log('✏️ 专场法会编辑订单页面加载，参数:', options)
    console.log('✏️ 页面路径:', getCurrentPages()[getCurrentPages().length - 1].route)
    
    if (options.id) {
      this.orderId = options.id
      console.log('✏️ 接收到的订单ID:', this.orderId)
      this.loadOrderDetail()
    } else {
      console.error('❌ 订单ID参数不存在')
      uni.showToast({
        title: '订单ID不存在',
        icon: 'none'
      })
      setTimeout(() => {
        this.goBack()
      }, 1500)
    }
  },

  methods: {
    async loadOrderDetail() {
      try {
        this.loading = true
        console.log('加载专场法会订单详情，ID:', this.orderId)
        
        const fahuiManagement = uniCloud.importObject('fahui-management')
        
        // 临时使用 getOrders 方法获取订单详情
        console.log('🔄 使用临时方案获取订单详情...')
        const ordersResult = await fahuiManagement.getOrders()
        
        if (ordersResult.success && ordersResult.data) {
          const orderDetail = ordersResult.data.find(order => 
            order._id === this.orderId || 
            order.order_id === this.orderId || 
            order.orderNo === this.orderId
          )
          
          if (orderDetail) {
            this.orderDetail = orderDetail
            // 设置状态索引
            const currentStatus = this.orderDetail.status || '待支付'
            this.statusIndex = this.statusOptions.findIndex(option => option.value === currentStatus)
            if (this.statusIndex === -1) this.statusIndex = 0
            
            console.log('专场法会订单详情加载成功:', this.orderDetail)
          } else {
            this.orderDetail = null
            console.error('专场法会订单详情加载失败: 未找到订单')
            uni.showToast({
              title: '订单不存在',
              icon: 'none'
            })
          }
        } else {
          this.orderDetail = null
          console.error('专场法会订单详情加载失败:', ordersResult.message)
          uni.showToast({
            title: ordersResult.message || '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载专场法会订单详情失败:', error)
        this.orderDetail = null
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    onStatusChange(e) {
      this.statusIndex = e.detail.value
      this.orderDetail.status = this.statusOptions[this.statusIndex].value
    },

    formatDate(date) {
      if (!date) return '未知时间'
      
      const d = new Date(date)
      return d.toLocaleString('zh-CN')
    },

    async saveOrder() {
      if (!this.orderDetail) {
        uni.showToast({
          title: '订单数据不存在',
          icon: 'none'
        })
        return
      }

      try {
        this.loading = true
        uni.showLoading({ title: '保存中...' })
        
        const fahuiManagement = uniCloud.importObject('fahui-management')
        
        // 临时使用 updateOrderStatus 方法更新订单
        console.log('🔄 使用临时方案更新订单...')
        const result = await fahuiManagement.updateOrderStatus({
          orderId: this.orderId,
          status: this.orderDetail.status,
          operator: '管理员编辑'
        })
        
        if (result.success) {
          uni.hideLoading()
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
          
          // 返回上一页
          setTimeout(() => {
            this.goBack()
          }, 1500)
        } else {
          uni.hideLoading()
          uni.showToast({
            title: result.message || '保存失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error('保存订单失败:', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.edit-order-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 24rpx 32rpx 24rpx;
  color: white;
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

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 32rpx;
  color: white;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 16rpx;
}

.save-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: white;
  font-size: 28rpx;
}

.save-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

.btn-icon {
  font-size: 24rpx;
}

/* 加载状态 */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400rpx;
}

.loading-content {
  text-align: center;
}

.loading-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.loading-text {
  font-size: 32rpx;
  color: #666;
}

/* 编辑内容 */
.edit-content {
  padding: 24rpx;
}

.form-card {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 24rpx;
  color: white;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
}

.form-content {
  padding: 24rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.form-value {
  display: block;
  font-size: 28rpx;
  color: #333;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e0e0e0;
}

.form-value.amount {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 32rpx;
}

.form-input {
  width: 100%;
  padding: 16rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fafafa;
}

.form-input:focus {
  border-color: #007aff;
  background: white;
}

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background: #f8f9fa;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  font-size: 24rpx;
  color: #666;
}

/* 报名人信息 */
.applicant-section {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.applicant-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

/* 操作记录 */
.operations-list {
  padding: 24rpx;
}

.operation-item {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.operation-item:last-child {
  margin-bottom: 0;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.operation-type {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.operation-time {
  font-size: 24rpx;
  color: #666;
}

.operation-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.operation-operator {
  font-size: 26rpx;
  color: #666;
}

.operation-remark {
  font-size: 26rpx;
  color: #007aff;
  background: #e3f2fd;
  padding: 8rpx 12rpx;
  border-radius: 6rpx;
}

.empty-operations {
  text-align: center;
  padding: 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 错误状态 */
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400rpx;
}

.error-content {
  text-align: center;
}

.error-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.error-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 32rpx;
  display: block;
}

.retry-btn {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
}
</style> 