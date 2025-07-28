<template>
  <view class="goods-page">
    <!-- 捐赠物品信息 -->
    <view class="section">
      <view class="section-title">捐赠物品说明</view>
      <textarea 
        v-model="goodsDesc" 
        placeholder="请描述您捐赠的物品（如：大米10袋、食用油5桶等）"
        class="goods-textarea"
      ></textarea>
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
      goodsDesc: '',
      blessing: ''
    }
  },
  methods: {
    submitDonation() {
      if (!this.goodsDesc.trim()) {
        return uni.showToast({ title: '请填写捐赠物品说明', icon: 'none' })
      }
      
      uni.showLoading({ title: '提交中...' })
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        uni.navigateTo({
          url: '/pages/gongde/success?type=goods'
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.goods-page {
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

.submit-btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
}
.goods-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
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