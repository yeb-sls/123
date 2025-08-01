<template>
  <view class="detail-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <view class="title">订单详情</view>
    </view>

    <view v-if="!order" class="empty">未找到订单信息</view>
    <view v-else class="order-detail">
      <!-- 基本信息 -->
      <view class="section">
        <view class="section-title">基本信息</view>
        <view class="info-card">
          <view class="info-item">
            <text class="info-label">订单号：</text>
            <text class="info-value">{{ order.orderNo || order._id }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">法会类型：</text>
            <text class="info-value">{{ getOrderType(order) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">法会项目：</text>
            <text class="info-value">{{ order.fahuiName || (order.fahuiProject && order.fahuiProject.name) || '-' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">订单状态：</text>
            <text class="info-value status" :class="{
              'status-pending': order.status === 'pending' || order.status === '待确认',
              'status-confirmed': order.status === 'confirmed' || order.status === '已确认',
              'status-cancelled': order.status === 'cancelled' || order.status === '已取消',
              'status-paid': order.status === 'paid' || order.status === '已支付',
              'status-default': !order.status || (order.status !== 'pending' && order.status !== 'confirmed' && order.status !== 'cancelled' && order.status !== 'paid' && order.status !== '待确认' && order.status !== '已确认' && order.status !== '已取消' && order.status !== '已支付')
            }">{{ getStatusText(order.status) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">支付金额：</text>
            <text class="info-value price">¥{{ order.amount || order.totalFee || 0 }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">支付方式：</text>
            <text class="info-value">{{ getPaymentMethod(order.paymentMethod) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">创建时间：</text>
            <text class="info-value">{{ formatDate(order.createTime) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">支付时间：</text>
            <text class="info-value">{{ formatDate(order.payTime) }}</text>
          </view>
        </view>
      </view>

      <!-- 报名人信息 -->
      <view v-if="order.applicants && order.applicants.length" class="section">
        <view class="section-title">报名人信息</view>
        <view class="info-card">
          <view v-for="(applicant, index) in order.applicants" :key="index" class="applicant-item">
            <view class="applicant-header">报名人 {{ index + 1 }}</view>
            <view class="applicant-info">
              <view class="info-row">
                <text class="info-label">姓名：</text>
                <text class="info-value">{{ applicant.name }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">性别：</text>
                <text class="info-value">{{ applicant.gender }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">电话：</text>
                <text class="info-value">{{ applicant.phone }}</text>
              </view>
              <view class="info-row" v-if="applicant.lunarBirthday">
                <text class="info-label">农历生日：</text>
                <text class="info-value">{{ applicant.lunarBirthday }}</text>
              </view>
              <view class="info-row" v-if="applicant.address">
                <text class="info-label">地址：</text>
                <text class="info-value">{{ applicant.address }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 配偶信息 -->
      <view v-if="order.spouse && order.spouse.name" class="section">
        <view class="section-title">配偶信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">姓名：</text>
            <text class="info-value">{{ order.spouse.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">性别：</text>
            <text class="info-value">{{ order.spouse.gender }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">电话：</text>
            <text class="info-value">{{ order.spouse.phone }}</text>
          </view>
        </view>
      </view>

      <!-- 已故亲人信息 -->
      <view v-if="order.deceasedList && order.deceasedList.length" class="section">
        <view class="section-title">已故亲人信息</view>
        <view class="info-card">
          <view v-for="(deceased, index) in order.deceasedList" :key="index" class="deceased-item">
            <view class="deceased-header">已故亲人 {{ index + 1 }}</view>
            <view class="deceased-info">
              <view class="info-row">
                <text class="info-label">姓名：</text>
                <text class="info-value">{{ deceased.name }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">关系：</text>
                <text class="info-value">{{ deceased.relation }}</text>
              </view>
              <view class="info-row" v-if="deceased.lunarBirthday">
                <text class="info-label">农历生日：</text>
                <text class="info-value">{{ deceased.lunarBirthday }}</text>
              </view>
              <view class="info-row" v-if="deceased.deathDate">
                <text class="info-label">去世日期：</text>
                <text class="info-value">{{ deceased.deathDate }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 代办物品 -->
      <view v-if="order.goods && order.goods.length" class="section">
        <view class="section-title">代办物品</view>
        <view class="info-card">
          <view v-for="(item, index) in order.goods" :key="index" class="goods-item">
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-qty">×{{ item.qty }}</text>
            </view>
            <text class="goods-price">¥{{ item.price * item.qty }}</text>
          </view>
        </view>
      </view>

      <!-- 收件信息 -->
      <view v-if="order.receiver && order.receiver.name" class="section">
        <view class="section-title">收件信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">收件人：</text>
            <text class="info-value">{{ order.receiver.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话：</text>
            <text class="info-value">{{ order.receiver.phone }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">收件地址：</text>
            <text class="info-value">{{ order.receiver.address }}</text>
          </view>
        </view>
      </view>

      <!-- 备注信息 -->
      <view v-if="order.remark" class="section">
        <view class="section-title">备注信息</view>
        <view class="info-card">
          <text class="remark-text">{{ order.remark }}</text>
        </view>
      </view>

      <!-- 管理备注 -->
      <view v-if="order.adminRemarks && order.adminRemarks.length" class="section">
        <view class="section-title">管理备注</view>
        <view class="info-card">
          <view v-for="(remark, index) in order.adminRemarks" :key="'admin-remark-' + index" class="remark-item">
            <view class="remark-content">{{ remark.content }}</view>
            <view class="remark-info">
              <text class="remark-author">{{ remark.author || remark.operator }}</text>
              <text class="remark-time">{{ formatDate(remark.time || remark.createTime) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return { 
      order: null 
    }
  },
  onShow() {
    this.order = uni.getStorageSync('orderDetail') || null;
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    getOrderType(order) {
      if (order.fahuiType === 'joint') {
        return '合坛法会'
      } else {
        return '专场法会'
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
    
    getPaymentMethod(method) {
      const methodMap = {
        'wechat': '微信支付',
        'alipay': '支付宝',
        'bank': '银行转账'
      }
      return methodMap[method] || method || '未知'
    },
    
    formatDate(date) {
      if (!date) return '-'
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
  }
}
</script>
<style scoped>
.detail-container {
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
  margin-left: 20rpx;
}

.empty {
  text-align: center;
  color: #aaa;
  margin-top: 100rpx;
  font-size: 28rpx;
}

.order-detail {
  padding: 20rpx;
}

.section {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  padding-left: 16rpx;
  border-left: 4rpx solid #2d8cf0;
}

.info-card {
  background: white;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.info-item, .info-row {
  display: flex;
  margin-bottom: 16rpx;
}

.info-item:last-child, .info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  width: 160rpx;
  flex-shrink: 0;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
}

.status {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
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

.applicant-item, .deceased-item {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
}

.applicant-header, .deceased-header {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.applicant-info, .deceased-info {
  padding-left: 16rpx;
}

.goods-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-info {
  display: flex;
  align-items: center;
}

.goods-name {
  font-size: 28rpx;
  color: #333;
  margin-right: 8rpx;
}

.goods-qty {
  font-size: 24rpx;
  color: #666;
}

.goods-price {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.remark-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.remark-item {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
}

.remark-content {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.remark-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remark-author {
  font-size: 24rpx;
  color: #666;
}

.remark-time {
  font-size: 24rpx;
  color: #999;
}
</style> 