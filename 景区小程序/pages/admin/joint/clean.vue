<template>
  <view class="clean-page">
    <view class="page-header">
      <text class="page-title">清理无效头图记录</text>
      <text class="page-desc">删除数据库中无效的头图记录</text>
    </view>
    
    <view class="action-section">
      <button class="clean-btn" @click="cleanInvalidBanners">清理无效记录</button>
    </view>
    
    <view v-if="result" class="result-section">
      <view class="result-title">清理结果</view>
      <view class="result-item">
        <text class="result-label">删除数量：</text>
        <text class="result-value">{{ result.deletedCount }}</text>
      </view>
      <view class="result-item">
        <text class="result-label">剩余数量：</text>
        <text class="result-value">{{ result.remainingCount }}</text>
      </view>
      <view class="result-item">
        <text class="result-label">状态：</text>
        <text class="result-value" :class="result.code === 0 ? 'success' : 'error'">
          {{ result.code === 0 ? '成功' : '失败' }}
        </text>
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
      result: null
    }
  },
  
  methods: {
    async cleanInvalidBanners() {
      try {
        uni.showLoading({ title: '清理中...' })
        
        const result = await jointManagement.cleanInvalidBanners()
        
        uni.hideLoading()
        
        this.result = result
        
        if (result.success) {
          uni.showToast({ 
            title: `清理完成，删除了${result.deletedCount}条无效记录`, 
            icon: 'success' 
          })
        } else {
          uni.showToast({ 
            title: '清理失败', 
            icon: 'none' 
          })
        }
        
      } catch (error) {
        uni.hideLoading()
        console.error('清理失败:', error)
        uni.showToast({ 
          title: '清理失败', 
          icon: 'none' 
        })
      }
    }
  }
}
</script>

<style scoped>
.clean-page {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.page-desc {
  font-size: 28rpx;
  color: #666;
}

.action-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.clean-btn {
  width: 100%;
  background: #ff4757;
  color: #fff;
  border: none;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.result-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

.result-label {
  font-size: 28rpx;
  color: #666;
}

.result-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.result-value.success {
  color: #28a745;
}

.result-value.error {
  color: #dc3545;
}
</style> 