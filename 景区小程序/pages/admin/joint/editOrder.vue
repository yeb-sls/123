<template>
  <view class="edit-order-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <button class="back-btn" @click="goBack">
            <text class="back-icon">←</text>
          </button>
          <text class="page-title">编辑订单</text>
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
            <text class="form-value amount">¥{{ orderDetail.totalCost || orderDetail.total_fee || 0 }}</text>
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

      <!-- 备注信息 -->
      <view class="form-card">
        <view class="card-header">
          <text class="card-title">💬 备注信息</text>
        </view>
        <view class="form-content">
          <view class="form-group">
            <text class="form-label">备注</text>
            <textarea 
              v-model="orderDetail.remark" 
              class="form-textarea"
              placeholder="请输入备注信息..."
              maxlength="500"
            />
            <view class="textarea-counter">
              <text class="counter-text">{{ (orderDetail.remark || '').length }}/500</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作记录 -->
      <view v-if="orderDetail.operations && orderDetail.operations.length > 0" class="form-card">
        <view class="card-header">
          <text class="card-title">📝 操作记录</text>
        </view>
        <view class="form-content">
          <view 
            v-for="(operation, index) in orderDetail.operations" 
            :key="index"
            class="operation-item"
          >
            <view class="operation-header">
              <text class="operation-type">{{ operation.type }}</text>
              <text class="operation-time">{{ formatDate(operation.time) }}</text>
            </view>
            <view class="operation-content">
              <text class="operation-operator">操作人：{{ operation.operator }}</text>
              <text v-if="operation.remark" class="operation-remark">备注：{{ operation.remark }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else class="error-state">
      <view class="error-content">
        <text class="error-icon">❌</text>
        <text class="error-title">订单不存在</text>
        <text class="error-desc">无法找到指定的订单信息</text>
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
      loading: false,
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
    console.log('✏️ 编辑订单页面加载，参数:', options)
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
        console.log('加载订单详情，ID:', this.orderId)
        
        const jointManagement = uniCloud.importObject('joint-management')
        const result = await jointManagement.getOrderDetail({ orderId: this.orderId })
        
        if (result.success && result.data) {
          this.orderDetail = result.data
          // 设置状态索引
          const currentStatus = this.orderDetail.status || '待支付'
          this.statusIndex = this.statusOptions.findIndex(option => option.value === currentStatus)
          if (this.statusIndex === -1) this.statusIndex = 0
          
          console.log('订单详情加载成功:', this.orderDetail)
        } else {
          this.orderDetail = null
          console.error('订单详情加载失败:', result.message)
          uni.showToast({
            title: result.message || '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载订单详情失败:', error)
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
        
        const jointManagement = uniCloud.importObject('joint-management')
        const result = await jointManagement.updateOrder({
          orderId: this.orderId,
          orderData: this.orderDetail,
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
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
  border: none;
  font-size: 26rpx;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.save-btn:disabled {
  opacity: 0.6;
}

/* 加载状态 */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

.loading-content {
  text-align: center;
}

.loading-icon {
  font-size: 60rpx;
  margin-bottom: 20rpx;
  display: block;
}

.loading-text {
  font-size: 28rpx;
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
  background: #f8f9fa;
  padding: 24rpx;
  border-bottom: 1rpx solid #e9ecef;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
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
  margin-bottom: 12rpx;
}

.form-value {
  display: block;
  font-size: 28rpx;
  color: #333;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.amount {
  color: #ff6b35;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 16rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  background: white;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 16rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  background: white;
  box-sizing: border-box;
  resize: none;
}

.textarea-counter {
  text-align: right;
  margin-top: 8rpx;
}

.counter-text {
  font-size: 24rpx;
  color: #666;
}

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background: #f8f9fa;
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
  border: 1rpx solid #e9ecef;
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
  margin-bottom: 20rpx;
}

/* 操作记录 */
.operation-item {
  border: 1rpx solid #e9ecef;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
}

.operation-header {
  background: #f8f9fa;
  padding: 16rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #e9ecef;
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

.operation-content {
  padding: 20rpx;
}

.operation-operator {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.operation-remark {
  font-size: 26rpx;
  color: #333;
  display: block;
}

/* 错误状态 */
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

.error-content {
  text-align: center;
}

.error-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  display: block;
}

.error-title {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.error-desc {
  font-size: 28rpx;
  color: #999;
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