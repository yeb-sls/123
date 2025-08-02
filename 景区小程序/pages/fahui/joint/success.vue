<template>
  <view class="success-page">
    <!-- 成功图标 -->
    <view class="success-icon">
      <view class="icon-circle">
        <text class="icon-text">✓</text>
      </view>
    </view>

    <!-- 成功标题 -->
    <view class="success-title">报名成功</view>
    <view class="success-subtitle">您的合坛法会报名已提交成功</view>

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
        <view class="order-info">
          <text class="order-label">支付时间：</text>
          <text class="order-value">{{ orderInfo.payTime }}</text>
        </view>
      </view>
    </view>

    <!-- 代办物品（如有选择） -->
    <view v-if="orderInfo.selectedItems && orderInfo.selectedItems.length > 0" class="section">
      <view class="section-title">代办物品</view>
      <view class="goods-list">
        <view v-for="(item, index) in orderInfo.selectedItems" :key="'goods-' + index" class="goods-item">
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-price">¥{{ item.price }}/件</text>
          </view>
          <view class="goods-count">
            <text class="count-label">数量：</text>
            <text class="count-value">{{ item.count }}件</text>
          </view>
          <view class="goods-total">
            <text class="total-label">小计：</text>
            <text class="total-value">¥{{ item.price * item.count }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 后续步骤 -->
    <view class="section">
      <view class="section-title">后续步骤</view>
      <view class="steps-card">
        <view class="step-item">
          <view class="step-number">1</view>
          <view class="step-content">
            <text class="step-title">等待确认</text>
            <text class="step-desc">道长将在24小时内与您联系确认法会具体时间</text>
          </view>
        </view>
        <view class="step-item">
          <view class="step-number">2</view>
          <view class="step-content">
            <text class="step-title">参加法会</text>
            <text class="step-desc">按照约定时间参加合坛法会，共同祈福</text>
          </view>
        </view>
        <view class="step-item">
          <view class="step-number">3</view>
          <view class="step-content">
            <text class="step-title">功德回向</text>
            <text class="step-desc">法会结束后，功德将回向给所有参与者</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 注意事项 -->
    <view class="section">
      <view class="section-title">注意事项</view>
      <view class="notice-card">
        <view class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">请保持手机畅通，以便道长及时联系</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">法会当天请提前到达，保持恭敬心</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">如有特殊情况需要取消，请提前联系</text>
        </view>
        <view class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">法会期间请遵守道观规定，保持安静</text>
        </view>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="section">
      <view class="section-title">联系方式</view>
      <view class="contact-card">
        <view class="contact-item">
          <text class="contact-label">客服电话：</text>
          <text class="contact-value" @click="makeCall('400-123-4567')">400-123-4567</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">微信客服：</text>
          <text class="contact-value">fahui_service</text>
        </view>
        <view class="contact-item">
          <text class="contact-label">服务时间：</text>
          <text class="contact-value">09:00-18:00（周一至周日）</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="btn-secondary" @click="viewOrder">查看订单</button>
      <button class="btn-primary" @click="goHome">返回首页</button>
    </view>
  </view>
</template>

<script>
// 导入云对象
const jointManagement = uniCloud.importObject('joint-management')

export default {
  data() {
    return {
      orderInfo: {
        orderId: '',
        projectName: '',
        applicantCount: 0,
        totalFee: 0,
        payTime: '',
        selectedItems: []
      }
    }
  },
  
  onLoad() {
    console.log('🎉 合坛法会成功页面加载开始')
    this.loadOrderInfo()
    console.log('🎉 合坛法会成功页面加载完成')
  },
  
  methods: {
    loadOrderInfo() {
      try {
        console.log('🎉 开始加载成功页面订单信息...')
        // 优先从确认页面获取数据
        const confirmData = uni.getStorageSync('joint_fahui_confirm')
        const orderData = uni.getStorageSync('joint_fahui_order')
        const orderId = uni.getStorageSync('joint_fahui_order_id')
        
        console.log('🎉 本地存储数据:')
        console.log('  - confirmData:', confirmData)
        console.log('  - orderData:', orderData)
        console.log('  - orderId:', orderId)
        
        // 使用确认数据或订单数据
        const data = confirmData || orderData
        console.log('🎉 使用的数据源:', data ? (confirmData ? 'confirmData' : 'orderData') : '无数据')
        
        if (data) {
          this.orderInfo = {
            orderId: orderId || data.orderId || data._id || 'JT' + Date.now(),
            projectName: data.projectName || data.project_name || '平安合坛',
            applicantCount: data.applicantCount || (data.applicants ? data.applicants.length : 0),
            totalFee: data.totalFee || data.total_fee || 0,
            payTime: this.formatTime(new Date()),
            selectedItems: data.selectedItems || data.goods || []
          }
          
          console.log('🎉 订单信息加载成功:')
          console.log('  - orderId:', this.orderInfo.orderId)
          console.log('  - projectName:', this.orderInfo.projectName)
          console.log('  - applicantCount:', this.orderInfo.applicantCount)
          console.log('  - totalFee:', this.orderInfo.totalFee)
          console.log('  - payTime:', this.orderInfo.payTime)
          console.log('  - selectedItems数量:', this.orderInfo.selectedItems ? this.orderInfo.selectedItems.length : 0)
        } else {
          console.log('⚠️ 没有订单数据，使用模拟数据')
          // 如果没有订单数据，使用模拟数据
          this.orderInfo = {
            orderId: 'JT' + Date.now(),
            projectName: '平安合坛',
            applicantCount: 2,
            totalFee: 400,
            payTime: this.formatTime(new Date())
          }
          console.log('🎉 模拟订单信息:', this.orderInfo)
        }
      } catch (error) {
        console.error('❌ 加载订单信息失败:', error)
        // 使用默认数据
        this.orderInfo = {
          orderId: 'JT' + Date.now(),
          projectName: '平安合坛',
          applicantCount: 2,
          totalFee: 400,
          payTime: this.formatTime(new Date())
        }
        console.log('🎉 使用默认订单信息:', this.orderInfo)
      }
    },
    
    formatTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    
    makeCall(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
        success: () => {
          console.log('拨打电话成功')
        },
        fail: (err) => {
          console.error('拨打电话失败:', err)
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none'
          })
        }
      })
    },
    
    viewOrder() {
      // 跳转到订单详情页面
      uni.navigateTo({
        url: '/pages/profile/orderDetail?type=joint&orderId=' + this.orderInfo.orderId,
        fail: () => {
          // 如果跳转失败，跳转到个人中心的订单页面
          uni.switchTab({
            url: '/pages/profile/index'
          })
        }
      })
    },
    
    goHome() {
      // 返回首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 120rpx;
}

.success-icon {
  display: flex;
  justify-content: center;
  padding: 80rpx 0 40rpx 0;
}

.icon-circle {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(82, 196, 26, 0.3);
}

.icon-text {
  color: #fff;
  font-size: 60rpx;
  font-weight: bold;
}

.success-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 16rpx;
}

.success-subtitle {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 48rpx;
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

.order-card, .steps-card, .notice-card, .contact-card {
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

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 32rpx;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.step-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  display: block;
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

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-label {
  font-size: 28rpx;
  color: #666;
  min-width: 160rpx;
}

.contact-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  text-align: right;
  flex: 1;
}

.contact-value:active {
  color: #667eea;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.1);
  display: flex;
  gap: 16rpx;
}

.btn-secondary, .btn-primary {
  flex: 1;
  padding: 24rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.goods-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.goods-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.goods-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.goods-price {
  font-size: 26rpx;
  color: #667eea;
  font-weight: bold;
}

.goods-count {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.count-label {
  font-size: 26rpx;
  color: #666;
  margin-right: 8rpx;
}

.count-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.goods-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8rpx;
  border-top: 1rpx solid #f0f0f0;
}

.total-label {
  font-size: 26rpx;
  color: #666;
}

.total-value {
  font-size: 28rpx;
  color: #667eea;
  font-weight: bold;
}
</style> 