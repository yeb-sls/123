<template>
  <view class="pay-bg">
    <view class="pay-container">
      <!-- 支付标题 -->
      <view class="pay-title">支付订单</view>
      
      <!-- 订单信息 -->
      <view class="order-section">
        <view class="section-title">订单信息</view>
        <view class="order-card">
          <view class="order-item">
            <text class="order-label">订单编号</text>
            <text class="order-value">{{ orderInfo.orderNumber }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">法会项目</text>
            <text class="order-value">{{ orderInfo.fahuiProject ? orderInfo.fahuiProject.name : '' }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">报名人数</text>
            <text class="order-value">{{ orderInfo.applicants ? orderInfo.applicants.length : 0 }} 人</text>
          </view>
          <view class="order-item">
            <text class="order-label">法会费用</text>
            <text class="order-value">¥{{ (Number(orderInfo.fahuiProject && orderInfo.fahuiProject.price) * (Array.isArray(orderInfo.applicants) ? orderInfo.applicants.length : 0)).toFixed(2) }}</text>
          </view>
          <view class="order-item" v-if="goodsTotalPrice > 0">
            <text class="order-label">代办费用</text>
            <text class="order-value">¥{{ Number(goodsTotalPrice).toFixed(2) }}</text>
          </view>
          <view class="order-item total-row">
            <text class="order-label">支付金额</text>
            <text class="order-value total-price">¥{{ totalPrice }}</text>
          </view>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="payment-section">
        <view class="section-title">选择支付方式</view>
        <view class="payment-card">
          <view class="payment-item" @click="selectPayment('wechat')" :class="{ active: selectedPayment === 'wechat' }">
            <view class="payment-icon">
              <text class="icon">💚</text>
            </view>
            <view class="payment-info">
              <text class="payment-name">微信支付</text>
              <text class="payment-desc">推荐使用微信支付</text>
            </view>
            <view class="payment-check">
              <text class="check-icon">{{ selectedPayment === 'wechat' ? '✓' : '○' }}</text>
            </view>
          </view>
          
          <view class="payment-item" @click="selectPayment('alipay')" :class="{ active: selectedPayment === 'alipay' }">
            <view class="payment-icon">
              <text class="icon">💙</text>
            </view>
            <view class="payment-info">
              <text class="payment-name">支付宝</text>
              <text class="payment-desc">使用支付宝支付</text>
            </view>
            <view class="payment-check">
              <text class="check-icon">{{ selectedPayment === 'alipay' ? '✓' : '○' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 代办物品（如果有） -->
      <view v-if="orderInfo.goods && orderInfo.goods.length > 0" class="goods-section">
        <view class="section-title">代办物品</view>
        <view class="goods-card">
          <view v-for="(item, index) in orderInfo.goods" :key="'goods-' + index" class="goods-item">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-qty">{{ item.qty }} 个</text>
            <text class="goods-price">¥{{ item.price * item.qty }}</text>
          </view>
        </view>
      </view>

      <!-- 收件信息（如果有） -->
      <view v-if="orderInfo.receiver && orderInfo.receiver.name" class="receiver-section">
        <view class="section-title">收件信息</view>
        <view class="receiver-card">
          <view class="receiver-item">
            <text class="receiver-label">收件人</text>
            <text class="receiver-value">{{ orderInfo.receiver.name }}</text>
          </view>
          <view class="receiver-item">
            <text class="receiver-label">联系电话</text>
            <text class="receiver-value">{{ orderInfo.receiver.phone }}</text>
          </view>
          <view class="receiver-item">
            <text class="receiver-label">收件地址</text>
            <text class="receiver-value">{{ orderInfo.receiver.address }}</text>
          </view>
        </view>
      </view>

      <!-- 支付按钮 -->
      <view class="btn-group">
        <button class="pay-btn" type="primary" :loading="paying" @click="handlePay">
          <text v-if="!paying">立即支付 ¥{{ totalPrice }}</text>
          <text v-else>支付中...</text>
        </button>
        <button class="back-btn" @click="goBack">返回修改</button>
      </view>

      <!-- 支付说明 -->
      <view class="notice-section">
        <view class="notice-title">支付说明</view>
        <view class="notice-content">
          <text class="notice-item">• 支付成功后，工作人员将在24小时内与您联系</text>
          <text class="notice-item">• 如需取消订单，请在支付前联系客服</text>
          <text class="notice-item">• 支付过程中请勿关闭页面</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入云对象
const notificationSystem = uniCloud.importObject('notification-system')
const fahuiManagement = uniCloud.importObject('fahui-management')

export default {
  data() {
    return {
      orderInfo: {},
      selectedPayment: 'wechat',
      paying: false
    }
  },
  computed: {
    goodsTotalPrice() {
      if (!this.orderInfo.goods || !Array.isArray(this.orderInfo.goods)) return 0
      return this.orderInfo.goods.reduce((sum, item) => {
        const price = Number(item.price) || 0
        const qty = Number(item.qty) || 0
        return sum + price * qty
      }, 0)
    },
    totalPrice() {
      const price = Number(this.orderInfo.fahuiProject && this.orderInfo.fahuiProject.price) || 0
      const count = Array.isArray(this.orderInfo.applicants) ? this.orderInfo.applicants.length : 0
      const goods = Number(this.goodsTotalPrice) || 0
      return (price * count + goods).toFixed(2)
    }
  },
  onLoad() {
    // 获取确认数据
    const confirmData = uni.getStorageSync('fahuiConfirm');
    if (confirmData) {
      this.orderInfo = {
        ...confirmData,
        orderNumber: this.generateOrderNumber()
      };
    } else {
      uni.showToast({ title: '未找到订单信息', icon: 'none' });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    generateOrderNumber() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hour = now.getHours().toString().padStart(2, '0');
      const minute = now.getMinutes().toString().padStart(2, '0');
      const second = now.getSeconds().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `FH${year}${month}${day}${hour}${minute}${second}${random}`;
    },
    selectPayment(method) {
      this.selectedPayment = method;
    },
    handlePay() {
      if (!this.selectedPayment) {
        uni.showToast({ title: '请选择支付方式', icon: 'none' });
        return;
      }
      this.paying = true;
      // 模拟支付过程
      setTimeout(async () => {
        this.paying = false;
        // 构建订单信息
        const orderData = {
          ...this.orderInfo,
          paymentMethod: this.selectedPayment,
          payTime: new Date().getTime(),
          totalFee: this.totalPrice,
          status: '待确认',
          fahuiType: 'special', // 添加法会类型字段
          // 兼容所有关键信息字段
          applicants: this.orderInfo.applicants || [],
          fahuiProject: this.orderInfo.fahuiProject || {},
          fahuiName: (this.orderInfo.fahuiProject && this.orderInfo.fahuiProject.name) || this.orderInfo.fahuiName || '',
          spouse: this.orderInfo.spouse || null,
          chaoduType: this.orderInfo.chaoduType || '',
          deceasedList: this.orderInfo.deceasedList || [],
          goods: this.orderInfo.goods || [],
          receiver: this.orderInfo.receiver || {},
          remark: this.orderInfo.remark || '',
          timestamp: Number(this.orderInfo.timestamp) || Date.now(),
          createTime: Number(this.orderInfo.createTime) || Number(this.orderInfo.timestamp) || Date.now(),
          orderNo: this.orderInfo.orderNo || '',
          phone: (this.orderInfo.applicants && this.orderInfo.applicants[0] && this.orderInfo.applicants[0].phone) || '',
          participantName: (this.orderInfo.applicants && this.orderInfo.applicants[0] && this.orderInfo.applicants[0].name) || '',
          amount: Number(this.totalPrice) || 0
        };
        // 保存订单信息
        uni.setStorageSync('fahuiOrder', orderData);
        // 追加到订单列表
        let orders = uni.getStorageSync('orders') || [];
        orders.push(orderData);
        uni.setStorageSync('orders', orders);
        // 同步订单到后台数据库
        try {
          const result = await fahuiManagement.submitOrder(orderData)
          console.log('submitFahuiOrder result:', result)
          if (!result.success) {
            uni.showToast({ title: result.message || '订单同步失败', icon: 'none' })
          }
        } catch (e) {
          console.error('订单同步到后台失败', e)
          uni.showToast({ title: '订单同步失败', icon: 'none' })
        }
        // 支付成功后推送提醒
        try {
          console.log('准备创建支付成功通知，订单数据:', orderData)
          const notificationSystem = uniCloud.importObject('notification-system')
          
          const notificationData = {
            type: 'fahui_order_paid',
            title: '专场法会订单支付成功',
            content: `订单号：${orderData.orderNo || orderData._id || '未知'}，金额：¥${orderData.amount || orderData.totalFee || 0}`,
            order_id: orderData._id || orderData.orderNo || orderData.order_id,
            priority: 'high'
          }
          
          console.log('通知数据:', notificationData)
          
          const result = await notificationSystem.createNotification(notificationData)
          console.log('通知创建结果:', result)
          
          if (result.success) {
            console.log('支付成功通知创建成功')
          } else {
            console.error('支付成功通知创建失败:', result.message)
          }
        } catch (e) { 
          console.error('支付成功提醒失败', e) 
        }
        // 跳转到成功页面
        uni.navigateTo({ 
          url: '/pages/fahui/success',
          success: () => {
            console.log('跳转到专场法会成功页成功');
          },
          fail: (err) => {
            console.error('跳转失败:', err);
            uni.showToast({ title: '页面跳转失败', icon: 'none' });
          }
        });
      }, 2000);
    },
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回修改成功');
        },
        fail: (err) => {
          console.error('返回失败:', err);
          // 如果返回失败，跳转到专场法会主页
          uni.navigateTo({ 
            url: '/pages/fahui/special',
            fail: () => {
              uni.showToast({ 
                title: '返回失败，请重试', 
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.pay-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.pay-container {
  padding-bottom: 40rpx;
  padding-top: 1rpx;
}
.pay-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin: 32rpx 0 24rpx 0;
  letter-spacing: 2rpx;
}
.order-section, .payment-section, .goods-section, .receiver-section {
  background: #fff;
  margin: 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
}
.order-card, .payment-card, .goods-card, .receiver-card {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
}
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.order-item:last-child {
  margin-bottom: 0;
}
.order-label {
  font-size: 28rpx;
  color: #333;
}
.order-value {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}
.total-row {
  border-top: 1px solid #e0eaff;
  padding-top: 12rpx;
  margin-top: 12rpx;
  font-weight: bold;
}
.total-price {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 32rpx;
}
.payment-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e0eaff;
  background: #fff;
  transition: all 0.3s ease;
}
.payment-item:last-child {
  margin-bottom: 0;
}
.payment-item.active {
  border-color: #2d8cf0;
  background: #f0f8ff;
}
.payment-icon {
  margin-right: 24rpx;
}
.icon {
  font-size: 48rpx;
}
.payment-info {
  flex: 1;
}
.payment-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}
.payment-desc {
  font-size: 24rpx;
  color: #666;
}
.payment-check {
  margin-left: 16rpx;
}
.check-icon {
  font-size: 32rpx;
  color: #2d8cf0;
  font-weight: bold;
}
.goods-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.goods-item:last-child {
  margin-bottom: 0;
}
.goods-name {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
.goods-qty {
  font-size: 26rpx;
  color: #666;
  margin: 0 16rpx;
}
.goods-price {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}
.receiver-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.receiver-item:last-child {
  margin-bottom: 0;
}
.receiver-label {
  font-size: 28rpx;
  color: #333;
}
.receiver-value {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  flex: 1;
  text-align: right;
}
.btn-group {
  margin: 48rpx 16rpx 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.pay-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}
.back-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notice-section {
  margin: 32rpx 16rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.notice-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
}
.notice-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.notice-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}
</style> 