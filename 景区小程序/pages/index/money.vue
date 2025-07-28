<template>
  <view class="money-page">
    <!-- 金额输入区 -->
    <view class="amount-section">
      <view class="section-title">捐赠金额（元）</view>
      <input v-model="amount" type="number" placeholder="请输入捐赠金额" class="donation-input" />
      
      <view class="quick-amount">
        <button 
          v-for="(item, index) in quickAmounts" 
          :key="index"
          class="amount-tag"
          @click="amount = item"
        >{{ item }}元</button>
      </view>
    </view>
    
    <!-- 祈福语 -->
    <view class="section">
      <view class="section-title">祈福语（选填）</view>
      <textarea v-model="blessing" placeholder="请输入您的祈福语" class="blessing-textarea"></textarea>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-btn">
      <button class="donation-btn" type="primary" @click="submitDonation">确认捐赠</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      amount: '',
      blessing: '',
      quickAmounts: ['100', '200', '500', '1000', '2000']
    }
  },
  methods: {
    submitDonation() {
      if (!this.amount || isNaN(this.amount) {
        return uni.showToast({ title: '请输入有效金额', icon: 'none' })
      }
      
      uni.showLoading({ title: '提交中...' })
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        uni.navigateTo({
          url: `/pages/gongde/success?type=money&amount=${this.amount}`
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.money-page {
  padding: 30rpx;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.quick-amount {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 30rpx;
}

.submit-btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
}
.donation-input {
  width: 100%;
  padding: 20rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}
.amount-tag {
  padding: 16rpx 24rpx;
  border: 2rpx solid #2d8cf0;
  border-radius: 8rpx;
  background: #fff;
  color: #2d8cf0;
  font-size: 26rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
}
.amount-tag.active {
  background: #2d8cf0;
  color: #fff;
}
.blessing-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}
.donation-btn {
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
</style>