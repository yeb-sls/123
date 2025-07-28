<template>
  <view class="pay-bg">
    <view class="pay-container">
      <!-- 步骤提示 -->
      <view class="step-bar">
        <view class="step">1. 选择供品</view>
        <view class="step">2. 信息确认</view>
        <view class="step active">3. 支付</view>
      </view>

      <!-- 订单信息 -->
      <view class="order-section">
        <view class="section-title">订单信息</view>
        <view class="order-card">
          <view class="order-item">
            <text class="order-label">订单编号</text>
            <text class="order-value">{{ orderInfo.orderId }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">供养人</text>
            <text class="order-value">{{ orderInfo.name }}</text>
          </view>
          <view class="order-item">
            <text class="order-label">联系方式</text>
            <text class="order-value">{{ orderInfo.phone }}</text>
          </view>
        </view>
      </view>

      <!-- 供品清单 -->
      <view class="goods-section">
        <view class="section-title">供品清单</view>
        <view class="goods-list">
          <view class="goods-item" v-for="(item, idx) in orderInfo.goodsList" :key="idx">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-qty">x{{ item.quantity }}</text>
            <text class="goods-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>

      <!-- 费用明细 -->
      <view class="fee-section">
        <view class="section-title">费用明细</view>
        <view class="fee-row">
          <text>供品合计</text>
          <text>¥{{ goodsTotal }}</text>
        </view>
        <view class="fee-row" v-if="orderInfo.postFee">
          <text>邮寄费用</text>
          <text>¥{{ orderInfo.postFee }}</text>
        </view>
        <view class="fee-row total">
          <text>应付总额</text>
          <text class="total-price">¥{{ totalPrice }}</text>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="payment-section">
        <view class="section-title">选择支付方式</view>
        <view class="payment-options">
          <view 
            v-for="(option, index) in paymentOptions" 
            :key="index"
            class="payment-option"
            :class="{ active: selectedPayment === index }"
            @click="selectPayment(index)"
          >
            <view class="option-left">
              <text class="payment-icon">{{ option.icon }}</text>
              <text class="payment-name">{{ option.name }}</text>
            </view>
            <view class="option-right">
              <view class="radio" :class="{ checked: selectedPayment === index }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 支付安全提示 -->
      <view class="pay-safe-tip">
        <text class="safe-icon">🔒</text>
        <text class="safe-text">本页面已加密，您的支付信息将被严格保护</text>
      </view>
      <!-- 协议与帮助 -->
      <view class="pay-help-bar">
        <text class="help-link" @click="showAgreement">《支付协议》</text>
        <text class="help-link" @click="showHelp">支付遇到问题？</text>
      </view>

      <!-- 支付按钮 -->
      <view class="pay-btn-section">
        <button class="pay-btn" :loading="paying" @click="handlePay">立即支付</button>
      </view>
    </view>
    <!-- 支付结果提示 -->
    <uni-popup ref="payResultPopup" type="center">
      <view class="popup-content">
        <text class="popup-title">{{ payResult.success ? '支付成功' : '支付失败' }}</text>
        <text class="popup-msg">{{ payResult.message }}</text>
        <view v-if="!payResult.success" class="popup-actions">
          <button class="popup-btn" @click="handlePay">重新支付</button>
          <button class="popup-btn outline" @click="contactService">联系客服</button>
        </view>
        <view v-else class="popup-actions">
          <button class="popup-btn" @click="closePayResult">查看订单详情</button>
        </view>
      </view>
    </uni-popup>
    <!-- 支付协议弹窗 -->
    <uni-popup ref="agreementPopup" type="center">
      <view class="popup-content">
        <text class="popup-title">支付协议</text>
        <scroll-view style="max-height:400rpx;" scroll-y>
          <text class="popup-msg">1. 您的支付信息将被严格保密，仅用于本次供养订单结算。\n2. 支付成功后不可撤销，如有疑问请联系客服。\n3. 订单如因网络等原因未及时到账，请耐心等待或联系客服处理。\n4. 其他未尽事宜以平台最终解释为准。</text>
        </scroll-view>
        <button class="popup-btn" @click="$refs.agreementPopup.close()">我已知晓</button>
      </view>
    </uni-popup>
    <!-- 支付帮助弹窗 -->
    <uni-popup ref="helpPopup" type="center">
      <view class="popup-content">
        <text class="popup-title">支付帮助</text>
        <scroll-view style="max-height:400rpx;" scroll-y>
          <text class="popup-msg">如遇支付失败、扣款异常、页面卡顿等问题，请尝试：\n1. 检查网络连接\n2. 更换支付方式\n3. 重新进入小程序\n如仍无法解决，请联系客服：400-888-8888</text>
        </scroll-view>
        <button class="popup-btn" @click="$refs.helpPopup.close()">我已知晓</button>
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
      orderInfo: {
        orderId: 'DT20240501001',
        name: '张三',
        phone: '13800138000',
        goodsList: [
          { name: '供花', quantity: 1, price: 50 },
          { name: '供灯', quantity: 2, price: 30 }
        ],
        postFee: 10
      },
      paymentOptions: [
        { name: '微信支付', icon: '🟩' },
        { name: '支付宝', icon: '🟦' }
      ],
      selectedPayment: 0,
      paying: false,
      payResult: {
        success: false,
        message: ''
      }
    }
  },
  computed: {
    goodsTotal() {
      return this.orderInfo.goodsList.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    totalPrice() {
      return this.goodsTotal + (this.orderInfo.postFee || 0)
    }
  },
  methods: {
    selectPayment(index) {
      this.selectedPayment = index
    },
    handlePay() {
      this.paying = true
      // 模拟支付流程
      setTimeout(() => {
        this.paying = false
        // 随机支付成功/失败
        const success = Math.random() > 0.2
        this.payResult.success = success
        this.payResult.message = success ? '感谢您的供养，祝您福慧增长！' : '支付未完成，请重试或更换支付方式。'
        this.$refs.payResultPopup.open()
      }, 1200)
    },
    showAgreement() {
      this.$refs.agreementPopup.open()
    },
    showHelp() {
      this.$refs.helpPopup.open()
    },
    contactService() {
      uni.makePhoneCall({ phoneNumber: '4008888888' })
    },
    closePayResult() {
      this.$refs.payResultPopup.close()
      if (this.payResult.success) {
        uni.redirectTo({ url: '/pages/hall/success' })
      }
    }
  }
}
</script>

<style scoped>
.pay-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f8f8 0%, #fff 100%);
}
.pay-container {
  padding: 32rpx 16rpx 40rpx 16rpx;
}
.step-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32rpx;
}
.step {
  font-size: 28rpx;
  color: #bbb;
}
.step.active {
  color: #ff9900;
  font-weight: bold;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #333;
}
.order-card, .goods-list, .fee-section {
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff33;
}
.order-item, .goods-item, .fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.order-label, .goods-name {
  color: #666;
}
.order-value, .goods-qty, .goods-price {
  color: #222;
}
.goods-qty {
  margin: 0 12rpx;
}
.fee-row.total {
  font-weight: bold;
  color: #ff9900;
}
.total-price {
  font-size: 32rpx;
}
.payment-section {
  margin-bottom: 32rpx;
}
.payment-options {
  display: flex;
  gap: 24rpx;
}
.payment-option {
  flex: 1;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: 2rpx solid transparent;
  transition: border 0.2s;
}
.payment-option.active {
  border: 2rpx solid #ff9900;
  background: #fffbe6;
}
.option-left {
  display: flex;
  align-items: center;
}
.payment-icon {
  font-size: 36rpx;
  margin-right: 12rpx;
}
.radio {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 2rpx solid #bbb;
  background: #fff;
  display: inline-block;
  position: relative;
}
.radio.checked {
  border-color: #ff9900;
}
.radio.checked::after {
  content: '';
  position: absolute;
  left: 6rpx;
  top: 6rpx;
  width: 12rpx;
  height: 12rpx;
  background: #ff9900;
  border-radius: 50%;
}
.pay-btn-section {
  margin-top: 32rpx;
  text-align: center;
}
.pay-btn {
  width: 80%;
  height: 88rpx;
  background: linear-gradient(90deg, #ffb347 0%, #ff9900 100%);
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 44rpx;
  font-weight: bold;
}
.popup-content {
  background: #fff;
  border-radius: 18rpx;
  padding: 48rpx 32rpx;
  text-align: center;
}
.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  color: #ff9900;
}
.popup-msg {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 32rpx;
}
.popup-btn {
  width: 60%;
  height: 72rpx;
  background: #ff9900;
  color: #fff;
  font-size: 28rpx;
  border: none;
  border-radius: 36rpx;
  font-weight: bold;
}
.popup-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 24rpx;
}
.popup-btn.outline {
  background: #fff;
  color: #ff9900;
  border: 2rpx solid #ff9900;
}
.pay-safe-tip {
  display: flex;
  align-items: center;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12rpx;
  padding: 12rpx 20rpx;
  margin-bottom: 16rpx;
  font-size: 24rpx;
}
.safe-icon {
  font-size: 28rpx;
  margin-right: 8rpx;
}
.pay-help-bar {
  display: flex;
  justify-content: flex-end;
  gap: 24rpx;
  margin-bottom: 16rpx;
}
.help-link {
  color: #1890ff;
  text-decoration: underline;
  font-size: 24rpx;
  cursor: pointer;
}
</style> 