<template>
  <view class="order-detail-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <button class="back-btn" @click="goBack">
            <text class="back-icon">←</text>
          </button>
          <text class="page-title">专场法会订单详情</text>
        </view>
        <view class="header-actions">
          <button class="action-btn edit-btn" @click="editOrder">
            <text class="btn-icon">✏️</text>
            <text>编辑</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <view class="loading-content">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加载中...</text>
      </view>
    </view>

    <!-- 订单详情 -->
    <view v-else-if="orderDetail" class="order-content">
      <!-- 订单基本信息 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">📋 基本信息</text>
        </view>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">订单号：</text>
            <text class="info-value">{{ orderDetail.orderNo || orderDetail.order_id }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">法会项目：</text>
            <text class="info-value">{{ orderDetail.projectName || orderDetail.project_name || '未指定' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">订单状态：</text>
            <view class="status-badge" :class="getStatusClass(orderDetail.status)">
              <text class="status-text">{{ orderDetail.status || '未知' }}</text>
            </view>
          </view>
          <view class="info-item">
            <text class="info-label">总金额：</text>
            <text class="info-value amount">¥{{ orderDetail.totalCost || orderDetail.total_fee || orderDetail.amount || 0 }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">创建时间：</text>
            <text class="info-value">{{ formatDate(orderDetail.createTime || orderDetail.create_time) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">报名人数：</text>
            <text class="info-value">{{ getApplicantCount(orderDetail) }}人</text>
          </view>
        </view>
      </view>

      <!-- 报名人信息 -->
      <view v-if="orderDetail.applicants && orderDetail.applicants.length > 0" class="info-card">
        <view class="card-header">
          <text class="card-title">👥 报名人信息</text>
        </view>
        <view class="applicants-list">
          <view 
            v-for="(applicant, index) in orderDetail.applicants" 
            :key="index"
            class="applicant-item"
          >
            <view class="applicant-header">
              <text class="applicant-title">报名人 {{ index + 1 }}</text>
            </view>
            <view class="applicant-info">
              <view class="info-row">
                <text class="info-label">姓名：</text>
                <text class="info-value">{{ applicant.name || '未填写' }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">电话：</text>
                <text class="info-value">{{ applicant.phone || '未填写' }}</text>
              </view>
              <view class="info-row" v-if="applicant.idCard">
                <text class="info-label">身份证：</text>
                <text class="info-value">{{ applicant.idCard }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作记录 -->
      <view class="info-card">
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

      <!-- 备注管理 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">💬 备注管理</text>
        </view>
        <view class="remark-section">
          <view class="remark-input-area">
            <textarea 
              v-model="newRemark"
              placeholder="请输入备注内容..."
              class="remark-input"
              maxlength="500"
            />
            <view class="remark-counter">
              <text class="counter-text">{{ newRemark.length }}/500</text>
            </view>
          </view>
          <button class="add-remark-btn" @click="addRemark" :disabled="!newRemark.trim()">
            <text class="btn-icon">💬</text>
            <text>添加备注</text>
          </button>
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
      newRemark: ''
    }
  },

  onLoad(options) {
    console.log('📋 专场法会订单详情页面加载，参数:', options)
    console.log('📋 页面路径:', getCurrentPages()[getCurrentPages().length - 1].route)
    
    if (options.id) {
      this.orderId = options.id
      console.log('📋 接收到的订单ID:', this.orderId)
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

    getStatusClass(status) {
      const statusMap = {
        '待支付': 'status-pending',
        '待确认': 'status-waiting',
        '处理中': 'status-processing',
        '已完成': 'status-completed',
        '已取消': 'status-cancelled'
      }
      return statusMap[status] || 'status-default'
    },

    getApplicantCount(order) {
      if (order.applicant_count !== undefined) {
        return order.applicant_count
      }
      if (order.applicants && Array.isArray(order.applicants)) {
        return order.applicants.length
      }
      return 0
    },

    formatDate(date) {
      if (!date) return '未知时间'
      
      const d = new Date(date)
      return d.toLocaleString('zh-CN')
    },

    async addRemark() {
      console.log('💬 开始添加备注...')
      console.log('💬 备注内容:', this.newRemark)
      console.log('💬 订单ID:', this.orderId)
      
      if (!this.newRemark.trim()) {
        console.log('❌ 备注内容为空')
        uni.showToast({
          title: '请输入备注内容',
          icon: 'none'
        })
        return
      }

      try {
        uni.showLoading({ title: '添加备注中...' })
        
        const fahuiManagement = uniCloud.importObject('fahui-management')
        console.log('💬 准备调用备注功能...')
        
        // 临时使用 updateOrderStatus 方法添加备注
        console.log('🔄 使用临时方案添加备注...')
        const result = await fahuiManagement.updateOrderStatus({
          orderId: this.orderId,
          status: this.orderDetail.status, // 保持当前状态
          operator: '管理员',
          remark: this.newRemark.trim() // 将备注作为参数传递
        })
        console.log('💬 备注添加结果:', result)
        
        if (result.success) {
          uni.hideLoading()
          console.log('✅ 备注添加成功')
          uni.showToast({
            title: '备注添加成功',
            icon: 'success'
          })
          
          // 清空备注输入
          this.newRemark = ''
          
          // 重新加载订单详情
          console.log('🔄 重新加载订单详情...')
          await this.loadOrderDetail()
        } else {
          uni.hideLoading()
          console.error('❌ 备注添加失败:', result.message)
          uni.showToast({
            title: result.message || '添加备注失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error('❌ 添加备注异常:', error)
        console.error('❌ 错误类型:', error.constructor.name)
        console.error('❌ 错误信息:', error.message)
        uni.showToast({
          title: '添加备注失败',
          icon: 'none'
        })
      }
    },

    editOrder() {
      uni.navigateTo({
        url: `/pages/admin/fahui/editOrder?id=${this.orderId}`
      })
    },

    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.order-detail-page {
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

.action-btn {
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

/* 订单内容 */
.order-content {
  padding: 24rpx;
}

.info-card {
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

.info-list {
  padding: 24rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  font-weight: bold;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 20rpx;
}

.info-value.amount {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 32rpx;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-waiting {
  background: #d1ecf1;
  color: #0c5460;
}

.status-processing {
  background: #d4edda;
  color: #155724;
}

.status-completed {
  background: #c3e6cb;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-default {
  background: #e2e3e5;
  color: #383d41;
}

/* 报名人信息 */
.applicants-list {
  padding: 24rpx;
}

.applicant-item {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.applicant-item:last-child {
  margin-bottom: 0;
}

.applicant-header {
  margin-bottom: 16rpx;
}

.applicant-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.applicant-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  min-width: 120rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
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

/* 备注管理 */
.remark-section {
  padding: 24rpx;
}

.remark-input-area {
  margin-bottom: 20rpx;
}

.remark-input {
  width: 100%;
  min-height: 120rpx;
  padding: 16rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fafafa;
  resize: none;
}

.remark-counter {
  text-align: right;
  margin-top: 8rpx;
}

.counter-text {
  font-size: 24rpx;
  color: #999;
}

.add-remark-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 100%;
}

.add-remark-btn:disabled {
  background: #ccc;
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