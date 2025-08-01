<template>
  <view class="pay-page">
    <!-- 调试区域 -->
    <view class="debug-section">
      <text class="debug-title">🔧 支付页面调试工具</text>
      <view class="debug-buttons">
        <button @click="showDebugInfo" class="debug-btn">📊 显示调试信息</button>
        <button @click="testPayment" class="debug-btn">🧪 测试支付流程</button>
        <button @click="showOrderData" class="debug-btn">📋 显示订单数据</button>
      </view>
      <view v-if="debugInfo" class="debug-info">
        <text class="debug-text">{{ debugInfo }}</text>
      </view>
    </view>

    <view class="pay-header">
      <view class="header-title">支付法金</view>
      <view class="header-subtitle">请选择支付方式完成报名</view>
    </view>

    <!-- 订单信息 -->
    <view class="section">
      <view class="section-title">订单信息</view>
      <view class="order-card">
        <view class="order-info">
          <text class="order-label">订单号：</text>
          <text class="order-value">{{ orderInfo.orderId }}</text>
        </view>
        <view class="order-info">
          <text class="order-label">法会项目：</text>
          <text class="order-value">{{ orderInfo.projectName }}</text>
        </view>
        <view class="order-info">
          <text class="order-label">报名人数：</text>
          <text class="order-value">{{ orderInfo.applicantCount }}人</text>
        </view>
        <view class="order-info">
          <text class="order-label">支付金额：</text>
          <text class="order-value total-amount">¥{{ orderInfo.totalFee }}</text>
        </view>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="section">
      <view class="section-title">费用明细</view>
      <view class="fee-card">
        <view class="fee-row">
          <text class="fee-label">活动费用：</text>
          <text class="fee-value">¥{{ orderInfo.activityFee }}</text>
        </view>
        <view v-if="orderInfo.goodsFee > 0" class="fee-row">
          <text class="fee-label">代办费用：</text>
          <text class="fee-value">¥{{ orderInfo.goodsFee }}</text>
        </view>
        <view class="fee-divider"></view>
        <view class="fee-row total">
          <text class="fee-label">总计：</text>
          <text class="fee-value total-value">¥{{ orderInfo.totalFee }}</text>
        </view>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="section">
      <view class="section-title">支付方式</view>
      <view class="payment-methods">
        <view 
          v-for="(method, index) in paymentMethods" 
          :key="index"
          class="payment-method"
          :class="{ active: selectedMethod === method.id }"
          @click="selectPaymentMethod(method.id)"
        >
          <view class="method-info">
            <image :src="method.icon" class="method-icon" mode="aspectFit" />
            <view class="method-details">
              <text class="method-name">{{ method.name }}</text>
              <text class="method-desc">{{ method.description }}</text>
            </view>
          </view>
          <view class="method-radio">
            <view class="radio-circle" :class="{ checked: selectedMethod === method.id }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="pay-button-section">
      <button class="pay-button" @click="handlePayment" :disabled="isPaying">
        <view v-if="isPaying" class="btn-loading">
          <view class="btn-spinner"></view>
          <text>支付中...</text>
        </view>
        <text v-else>立即支付 ¥{{ orderInfo.totalFee }}</text>
      </button>
    </view>

    <!-- 支付说明 -->
    <view class="section">
      <view class="section-title">支付说明</view>
      <view class="notice-card">
        <view class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">支付成功后，系统将自动生成订单</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">法会具体时间将由道长与您联系确认</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">如有疑问，请联系客服咨询</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入云对象
const jointManagement = uniCloud.importObject('joint-management')

export default {
  data() {
    return {
      orderInfo: {},
      selectedMethod: 'wechat',
      isPaying: false,
      paymentMethods: [
        {
          id: 'wechat',
          name: '微信支付',
          description: '推荐使用微信支付',
          icon: '/static/images/wechat-pay.png'
        },
        {
          id: 'alipay',
          name: '支付宝',
          description: '安全便捷的支付方式',
          icon: '/static/images/alipay.png'
        }
      ],
      debugInfo: '' // 新增调试信息
    }
  },
  
  computed: {
    applicantCountText() {
      return this.orderInfo.applicantCount ? this.orderInfo.applicantCount + '人' : '0人'
    },
    totalFeeText() {
      return this.orderInfo.totalFee ? '¥' + this.orderInfo.totalFee : '¥0'
    },
    activityFeeText() {
      return this.orderInfo.activityFee ? '¥' + this.orderInfo.activityFee : '¥0'
    },
    goodsFeeText() {
      return this.orderInfo.goodsFee ? '¥' + this.orderInfo.goodsFee : '¥0'
    },
    payButtonText() {
      return this.orderInfo.totalFee ? '立即支付 ¥' + this.orderInfo.totalFee : '立即支付 ¥0'
    }
  },
  
  onLoad() {
    console.log('💳 合坛法会支付页面加载开始')
    this.loadOrderInfo()
    console.log('💳 合坛法会支付页面加载完成')
  },
  
  methods: {
    loadOrderInfo() {
      try {
        console.log('💳 开始加载支付页面订单信息...')
        // 优先从确认页面获取数据
        const confirmData = uni.getStorageSync('joint_fahui_confirm')
        const orderId = uni.getStorageSync('joint_fahui_order_id')
        const orderData = uni.getStorageSync('joint_fahui_order')
        
        console.log('💳 本地存储数据:')
        console.log('  - confirmData:', confirmData)
        console.log('  - orderId:', orderId)
        console.log('  - orderData:', orderData)
        
        // 使用确认数据或订单数据
        const data = confirmData || orderData
        console.log('💳 使用的数据源:', data ? 'confirmData' : 'orderData')
        
        if (data) {
          this.orderInfo = {
            orderId: orderId || data.orderId || data._id,
            projectName: data.projectName || data.project_name,
            applicantCount: data.applicantCount || (data.applicants ? data.applicants.length : 0),
            activityFee: data.activityFee || data.activity_fee || 0,
            goodsFee: data.goodsFee || data.goods_fee || 0,
            totalFee: data.totalFee || data.total_fee || 0
          }
          
          console.log('💳 订单信息加载成功:')
          console.log('  - orderId:', this.orderInfo.orderId)
          console.log('  - projectName:', this.orderInfo.projectName)
          console.log('  - applicantCount:', this.orderInfo.applicantCount)
          console.log('  - activityFee:', this.orderInfo.activityFee)
          console.log('  - goodsFee:', this.orderInfo.goodsFee)
          console.log('  - totalFee:', this.orderInfo.totalFee)
        } else {
          console.log('❌ 订单信息不存在')
          uni.showToast({
            title: '订单信息不存在',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: 2
            })
          }, 1500)
        }
      } catch (error) {
        console.error('❌ 加载订单信息失败:', error)
        uni.showToast({
          title: '加载订单信息失败',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack({
            delta: 2
          })
        }, 1500)
      }
    },
    
    selectPaymentMethod(methodId) {
      this.selectedMethod = methodId
    },
    
    async handlePayment() {
      if (this.isPaying) return
      
      console.log('💳 用户点击支付按钮')
      console.log('💳 支付时间:', new Date().toLocaleString())
      console.log('💳 当前订单信息:', this.orderInfo)
      console.log('💳 选择的支付方式:', this.selectedMethod)
      
      this.isPaying = true
      
      try {
        console.log('💳 开始处理支付...')
        console.log('💳 支付金额:', this.orderInfo.totalFee)
        
        // 调用支付接口
        const result = await this.processPayment()
        
        console.log('💳 支付处理结果:', result)
        
        if (result.success) {
          console.log('✅ 支付成功，准备跳转到成功页面')
          console.log('✅ 支付成功时间:', new Date().toLocaleString())
          
          // 支付成功，跳转到成功页面
          uni.redirectTo({
            url: '/pages/fahui/joint/success',
            success: () => {
              console.log('✅ 跳转到合坛法会成功页面成功')
            },
            fail: (err) => {
              console.error('❌ 跳转到成功页面失败:', err)
            }
          })
        } else {
          console.error('❌ 支付失败:', result.message)
          throw new Error(result.message || '支付失败')
        }
        
      } catch (error) {
        console.error('❌ 支付失败:', error)
        console.error('❌ 错误类型:', error.constructor.name)
        console.error('❌ 错误信息:', error.message)
        console.error('❌ 错误堆栈:', error.stack)
        uni.showToast({
          title: error.message || '支付失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isPaying = false
        console.log('🏁 支付流程结束')
      }
    },
    
    async processPayment() {
      console.log('💳 开始模拟支付过程...')
      console.log('💳 支付方式:', this.selectedMethod)
      console.log('💳 支付金额:', this.orderInfo.totalFee)
      
      // 模拟支付过程
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('💳 支付处理中...')
          // 模拟支付成功
          const success = Math.random() > 0.1 // 90%成功率
          
          if (success) {
            console.log('✅ 模拟支付成功')
            // 更新订单状态
            this.updateOrderStatus()
            resolve({ success: true, message: '支付成功' })
          } else {
            console.log('❌ 模拟支付失败')
            reject(new Error('支付失败，请重试'))
          }
        }, 2000)
      })
    },
    
    async updateOrderStatus() {
      try {
        console.log('🔄 开始更新订单状态...')
        console.log('🔄 更新时间:', new Date().toLocaleString())
        
        const orderId = uni.getStorageSync('joint_fahui_order_id')
        console.log('🔄 订单ID:', orderId)
        
        if (!orderId) {
          console.error('❌ 订单ID不存在')
          return
        }
        
        console.log('🔄 准备调用 jointManagement.updateOrderStatus...')
        console.log('🔄 更新参数:', {
          orderId: orderId,
          status: '待确认',
          operator: '用户支付'
        })
        
        // 更新订单状态
        const result = await jointManagement.updateOrderStatus({
          orderId: orderId,
          status: '待确认',
          operator: '用户支付'
        })
        
        console.log('🔄 订单状态更新结果:', result)
        console.log('🔄 更新结果类型:', typeof result)
        
        if (result.success) {
          console.log('✅ 订单状态更新成功')
        } else {
          console.error('❌ 订单状态更新失败:', result.message)
        }
        
        // 发送支付成功通知给管理员
        try {
          console.log('📢 开始发送支付成功通知...')
          const orderData = uni.getStorageSync('joint_fahui_order') || uni.getStorageSync('joint_fahui_confirm')
          console.log('📢 订单数据:', orderData)
          
          if (orderData) {
            const notifyData = {
              order: {
                _id: orderId,
                projectName: orderData.projectName || orderData.project_name,
                applicants: orderData.applicants || [],
                totalCost: orderData.totalFee || orderData.total_fee,
                status: '待确认'
              }
            }
            console.log('📢 通知数据:', notifyData)
            
            await jointManagement.notifyAdminOnPayment(notifyData)
            console.log('📢 支付成功通知已发送给管理员')
          } else {
            console.log('⚠️ 没有找到订单数据，跳过通知')
          }
        } catch (notifyError) {
          console.error('❌ 发送支付成功通知失败:', notifyError)
          console.error('❌ 通知错误类型:', notifyError.constructor.name)
          console.error('❌ 通知错误信息:', notifyError.message)
        }
        
        // 清除本地存储的订单数据
        console.log('🧹 开始清除本地存储数据...')
        uni.removeStorageSync('joint_fahui_order')
        uni.removeStorageSync('joint_fahui_order_id')
        uni.removeStorageSync('joint_fahui_confirm')
        console.log('🧹 本地存储数据清除完成')
        
      } catch (error) {
        console.error('❌ 更新订单状态失败:', error)
        console.error('❌ 错误类型:', error.constructor.name)
        console.error('❌ 错误信息:', error.message)
        console.error('❌ 错误堆栈:', error.stack)
      }
    },

    // 新增调试方法
    showDebugInfo() {
      this.debugInfo = `
        订单信息:
        - 订单号: ${this.orderInfo.orderId}
        - 项目名称: ${this.orderInfo.projectName}
        - 报名人数: ${this.orderInfo.applicantCount}
        - 总费用: ¥${this.orderInfo.totalFee}
        - 活动费用: ¥${this.orderInfo.activityFee}
        - 代办费用: ¥${this.orderInfo.goodsFee}

        支付方式:
        - 已选: ${this.paymentMethods.find(m => m.id === this.selectedMethod)?.name || '无'}

        支付状态:
        - 是否支付中: ${this.isPaying}
      `
      uni.showModal({
        title: '调试信息',
        content: this.debugInfo,
        showCancel: false
      })
    },

    testPayment() {
      this.handlePayment()
    },

    showOrderData() {
      uni.showModal({
        title: '订单数据',
        content: JSON.stringify(this.orderInfo, null, 2),
        showCancel: false
      })
    }
  }
}
</script>

<style scoped>
.pay-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 120rpx;
}

.debug-section {
  background: #f0f0f0;
  padding: 20rpx;
  margin: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.debug-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  padding-left: 16rpx;
  border-left: 8rpx solid #667eea;
}

.debug-buttons {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 0 16rpx;
}

.debug-btn {
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 28rpx;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.debug-btn::after {
  border: none;
}

.debug-info {
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap; /* 保留换行 */
  word-break: break-all; /* 允许长文本换行 */
}

.debug-text {
  font-family: 'Courier New', Courier, monospace; /* 使用等宽字体 */
}

.pay-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48rpx 24rpx 32rpx 24rpx;
  text-align: center;
  color: #fff;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.header-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
}

.section {
  margin: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 8rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4rpx;
  margin-right: 16rpx;
}

.order-card, .fee-card, .notice-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-info:last-child {
  border-bottom: none;
}

.order-label {
  font-size: 28rpx;
  color: #666;
  min-width: 160rpx;
}

.order-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  text-align: right;
  flex: 1;
}

.total-amount {
  color: #ff6b35;
  font-size: 32rpx;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.fee-row:last-child {
  border-bottom: none;
}

.fee-label {
  font-size: 28rpx;
  color: #666;
  min-width: 160rpx;
}

.fee-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  text-align: right;
  flex: 1;
}

.fee-divider {
  height: 1rpx;
  background: #e0e0e0;
  margin: 16rpx 0;
}

.fee-row.total {
  border-bottom: none;
  padding-top: 16rpx;
}

.total-value {
  color: #ff6b35;
  font-size: 32rpx;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.payment-method {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.payment-method.active {
  border: 2rpx solid #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.method-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.method-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.method-details {
  display: flex;
  flex-direction: column;
}

.method-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.method-desc {
  font-size: 24rpx;
  color: #999;
}

.method-radio {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-circle {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ddd;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-circle.checked {
  border-color: #667eea;
  background: #667eea;
}

.radio-circle.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16rpx;
  height: 16rpx;
  background: #fff;
  border-radius: 50%;
}

.pay-button-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.1);
}

.pay-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid rgba(255,255,255,0.3);
  border-top: 4rpx solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.notice-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.notice-item:last-child {
  margin-bottom: 0;
}

.notice-dot {
  color: #667eea;
  font-size: 28rpx;
  margin-right: 12rpx;
  margin-top: 4rpx;
}

.notice-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  flex: 1;
}
</style> 