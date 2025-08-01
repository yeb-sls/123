<template>
  <view class="test-container">
    <view class="page-header">
      <text class="page-title">合坛法会头图更新测试</text>
      <text class="page-desc">测试头图更新是否正常同步到前台</text>
    </view>
    
    <!-- 当前头图状态 -->
    <view class="status-section">
      <view class="status-title">当前头图状态</view>
      <view class="status-content">
        <view class="status-item">
          <text class="status-label">头图数量：</text>
          <text class="status-value">{{ bannerCount }}</text>
        </view>
        <view class="status-item">
          <text class="status-label">启用状态：</text>
          <text class="status-value" :class="isEnabled ? 'enabled' : 'disabled'">
            {{ isEnabled ? '启用' : '禁用' }}
          </text>
        </view>
        <view class="status-item">
          <text class="status-label">最后更新：</text>
          <text class="status-value">{{ lastUpdateTime }}</text>
        </view>
      </view>
    </view>
    
    <!-- 头图预览 -->
    <view class="preview-section" v-if="currentBanner">
      <view class="preview-title">头图预览</view>
      <view class="banner-preview">
        <image :src="currentBanner.image" class="preview-img" mode="aspectFill" />
      </view>
    </view>
    
    <!-- 测试操作 -->
    <view class="test-section">
      <view class="test-title">测试操作</view>
      <view class="test-buttons">
        <button class="test-btn" @click="refreshData">刷新数据</button>
        <button class="test-btn" @click="goToBannerManage">去头图管理</button>
        <button class="test-btn" @click="goToFrontend">查看前台</button>
        <button class="test-btn" @click="testUpdate">测试更新</button>
      </view>
    </view>
    
    <!-- 调试信息 -->
    <view class="debug-section" v-if="showDebug">
      <view class="debug-title">调试信息</view>
      <view class="debug-content">
        <text class="debug-text">当前头图数据：{{ JSON.stringify(currentBanner, null, 2) }}</text>
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
      currentBanner: null,
      bannerCount: 0,
      isEnabled: false,
      lastUpdateTime: '',
      showDebug: true
    }
  },
  
  onLoad() {
    this.loadBannerData()
  },
  
  methods: {
    async loadBannerData() {
      try {
        console.log('[测试] 开始加载头图数据...')
        const result = await jointManagement.getBanners()
        console.log('[测试] 获取头图结果:', result)
        
        if (result.success && result.data && result.data.length > 0) {
          const validBanners = result.data.filter(b => b._id)
          this.bannerCount = validBanners.length
          
          if (validBanners.length > 0) {
            let banner = validBanners[0]
            // 转换fileID为临时URL用于显示
            if (banner.image && !/^https?:\/\//.test(banner.image)) {
              const tempRes = await uniCloud.getTempFileURL({ fileList: [banner.image] })
              banner.image = tempRes.fileList[0].tempFileURL
            }
            
            this.currentBanner = banner
            this.isEnabled = banner.enabled || false
            this.lastUpdateTime = banner.update_time ? 
              new Date(banner.update_time).toLocaleString() : 
              new Date(banner.create_time).toLocaleString()
            
            console.log('[测试] 头图数据加载成功:', this.currentBanner)
          }
        } else {
          this.bannerCount = 0
          this.currentBanner = null
          this.isEnabled = false
          this.lastUpdateTime = ''
          console.log('[测试] 没有找到头图数据')
        }
      } catch (error) {
        console.error('[测试] 加载头图数据失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    refreshData() {
      console.log('[测试] 刷新数据...')
      this.loadBannerData()
      uni.showToast({ title: '数据已刷新' })
    },
    
    goToBannerManage() {
      uni.navigateTo({
        url: '/pages/admin/joint/banner'
      })
    },
    
    goToFrontend() {
      uni.navigateTo({
        url: '/pages/fahui/joint/index'
      })
    },
    
    async testUpdate() {
      try {
        console.log('[测试] 开始测试更新...')
        if (!this.currentBanner || !this.currentBanner._id) {
          uni.showToast({ title: '没有可更新的头图', icon: 'none' })
          return
        }
        
        // 模拟更新操作
        const testData = {
          _id: this.currentBanner._id,
          enabled: !this.isEnabled
        }
        
        const result = await jointManagement.updateBanner(testData)
        if (result.success) {
          uni.showToast({ title: '测试更新成功' })
          setTimeout(() => {
            this.loadBannerData()
          }, 1000)
        } else {
          throw new Error(result.message || '更新失败')
        }
      } catch (error) {
        console.error('[测试] 测试更新失败:', error)
        uni.showToast({ title: '测试更新失败', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.test-container {
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

.status-section, .preview-section, .test-section, .debug-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.status-title, .preview-title, .test-title, .debug-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 28rpx;
  color: #666;
}

.status-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.status-value.enabled {
  color: #28a745;
}

.status-value.disabled {
  color: #dc3545;
}

.banner-preview {
  width: 100%;
  height: 300rpx;
  border-radius: 8rpx;
  overflow: hidden;
  border: 2rpx solid #eee;
}

.preview-img {
  width: 100%;
  height: 100%;
}

.test-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.test-btn {
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
  background: #667eea;
  color: #fff;
}

.debug-content {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 8rpx;
}

.debug-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  word-break: break-all;
}
</style> 