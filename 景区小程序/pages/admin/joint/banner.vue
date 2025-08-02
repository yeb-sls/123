<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会头图管理</text>
      <text class="page-desc">管理合坛法会页面头图（仅支持一张图片）</text>
    </view>
    
    <!-- 单张头图管理 -->
    <view v-if="currentBanner.image && !isEdit" class="banner-card">
      <view class="banner-preview">
        <image :src="currentBanner.image" class="banner-img" mode="aspectFill" />
        <view class="banner-overlay">
          <view class="banner-actions">
            <button class="action-btn edit" @click="isEdit = true">编辑</button>
            <button v-if="currentBanner._id && !isEdit" class="action-btn delete" @click="deleteBanner">删除</button>
          </view>
        </view>
      </view>
      <view class="banner-info">
        <view class="info-row">
          <text class="info-label">状态：</text>
          <text class="info-value" :class="currentBanner.enabled ? 'enabled' : 'disabled'">
            {{ currentBanner.enabled ? '启用' : '禁用' }}
          </text>
        </view>
        <view class="info-row">
          <text class="info-label">更新时间：</text>
          <text class="info-value">{{ formatTime(currentBanner.update_time || currentBanner.create_time) }}</text>
        </view>
      </view>
    </view>
    <!-- 添加/编辑表单直接在当前页面显示 -->
    <view v-if="isEdit" class="banner-edit-form">
      <view class="form-content">
        <view class="form-item">
          <text class="form-label">头图图片 *</text>
          <view class="image-upload" @click="chooseImage">
            <image v-if="currentBanner.image" :src="currentBanner.image" class="upload-preview" mode="aspectFill" />
            <view v-else class="upload-placeholder">
              <text class="upload-icon">📷</text>
              <text class="upload-text">点击选择图片</text>
            </view>
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">状态</text>
          <switch :checked="currentBanner.enabled" @change="onSwitchChange" color="#667eea" />
          <text class="switch-label">{{ currentBanner.enabled ? '启用' : '禁用' }}</text>
        </view>
      </view>
      <view class="form-actions">
        <button class="cancel-btn" type="button" @click="cancelEdit">取消</button>
        <button class="save-btn" type="button" @click="saveBanner">保存</button>
      </view>
    </view>
    <view v-else-if="!currentBanner._id && !isEdit" class="no-banner">
      <text class="no-banner-text">暂无头图，请添加</text>
      <button class="add-btn" type="button" @click="showAddForm">+ 添加头图</button>
    </view>
  </view>
</template>

<script>
// 导入云对象
const jointManagement = uniCloud.importObject('joint-management')

export default {
  
  data() {
    return {
      isEdit: false,
      currentBanner: {
        _id: '',
        image: '',
        enabled: true,
        create_time: '',
        update_time: ''
      }
    }
  },
  
  onLoad() {
    console.log('[后台] 页面 onLoad')
    this.loadBanners()
  },
  
  onShow() {
    console.log('[后台] 页面 onShow')
    // 每次页面显示时重新加载数据，确保数据最新
    this.loadBanners()
  },
  

  
  methods: {
    async loadBanners() {
      try {
        console.log('[后台] 开始加载头图...')
        const result = await jointManagement.getBanners()
        console.log('[后台] 获取头图结果:', result)
        // 过滤掉_id为空的数据
        const validBanners = result.success && result.data ? result.data.filter(b => b._id) : []
        if (validBanners.length > 0) {
          let banner = validBanners[0]
          // 保存原始的fileID用于编辑
          const originalImage = banner.image
          if (banner.image && !/^https?:\/\//.test(banner.image)) {
            // fileID转临时URL用于显示
            const tempRes = await uniCloud.getTempFileURL({ fileList: [banner.image] })
            banner.image = tempRes.fileList[0].tempFileURL
            // 加时间戳强制刷新图片缓存
            banner.image = banner.image + '?t=' + Date.now()
            console.log('[后台] fileID转临时URL:', banner.image)
          }
          // 保存原始fileID，用于编辑时保存
          banner.originalImage = originalImage
          this.currentBanner = banner
          console.log('[后台] loadBanners 赋值后 currentBanner:', JSON.stringify(this.currentBanner))
        } else {
          this.currentBanner = {
            image: '',
            enabled: true,
            create_time: '',
            update_time: ''
          }
          console.log('[后台] 没有找到头图，currentBanner:', JSON.stringify(this.currentBanner))
        }
      } catch (error) {
        console.error('[后台] 加载合坛法会头图失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    showAddForm() {
      console.log('[后台] 点击添加头图')
      this.isEdit = true
      this.currentBanner = {
        image: '',
        enabled: true,
        create_time: '',
        update_time: ''
      }
    },
    
    cancelEdit() {
      console.log('[后台] 取消编辑')
      this.isEdit = false
      this.loadBanners()
    },
    
    chooseImage() {
      console.log('[后台] 点击选择图片')
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          try {
            uni.showLoading({ title: '上传中...' })
            const uploadRes = await uniCloud.uploadFile({
              filePath: res.tempFilePaths[0],
              cloudPath: 'joint_banners/' + Date.now() + '.jpg'
            })
            uni.hideLoading()
            this.currentBanner.image = uploadRes.fileID
            // 同时更新originalImage，确保保存时使用新的fileID
            this.currentBanner.originalImage = uploadRes.fileID
            console.log('[后台] 图片上传成功，fileID:', uploadRes.fileID)
            uni.showToast({ title: '图片上传成功' })
            // 上传成功后自动保存
            await this.saveBanner()
          } catch (err) {
            uni.hideLoading()
            console.log('[后台] 图片上传失败:', err)
            uni.showToast({ title: '图片上传失败', icon: 'none' })
          }
        }
      })
    },
    
    onSwitchChange(e) {
      this.currentBanner.enabled = e.detail.value
    },
    
    async saveBanner() {
      if (!this.currentBanner.image) {
        uni.showToast({ title: '请选择头图', icon: 'none' })
        return
      }
      
      try {
        console.log('[后台] 保存头图，currentBanner:', JSON.stringify(this.currentBanner))
        
        // 确定要保存的图片URL：优先使用originalImage（fileID），因为image可能是临时URL
        let imageToSave = this.currentBanner.originalImage || this.currentBanner.image
        
        // 如果originalImage是临时URL，则使用image（fileID）
        if (imageToSave && imageToSave.startsWith('http') && imageToSave.includes('cdn.bspapp.com')) {
          // 如果originalImage是临时URL，尝试使用image
          if (this.currentBanner.image && !this.currentBanner.image.startsWith('http')) {
            imageToSave = this.currentBanner.image
          }
        }
        
        console.log('[后台] 保存前检查:')
        console.log('[后台] - currentBanner.image:', this.currentBanner.image)
        console.log('[后台] - currentBanner.originalImage:', this.currentBanner.originalImage)
        console.log('[后台] - 最终保存的imageToSave:', imageToSave)
        
        const data = {
          image: imageToSave,
          enabled: this.currentBanner.enabled
        }
        
        console.log('[后台] 实际保存的图片数据:', data)
        
        if (this.currentBanner._id) {
          // 更新现有头图
          console.log('[后台] 更新头图')
          const result = await jointManagement.updateBanner({ 
            _id: this.currentBanner._id, 
            ...data 
          })
          if (!result.success) {
            throw new Error(result.message || '更新失败')
          }
        } else {
          // 添加新头图
          console.log('[后台] 新增头图')
          const result = await jointManagement.addBanner({ 
            image: data.image,
            enabled: data.enabled
          })
          if (!result.success) {
            throw new Error(result.message || '添加失败')
          }
        }
        
        this.isEdit = false
        setTimeout(() => {
          this.loadBanners()
        }, 500)
        uni.showToast({ title: '保存成功' })
      } catch (error) {
        console.error('[后台] 保存合坛法会头图失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    
    async deleteBanner() {
      console.log('[后台] deleteBanner 调用，currentBanner:', JSON.stringify(this.currentBanner))
      // 防御性检查
      if (!this.currentBanner || !this.currentBanner._id) {
        uni.showToast({ title: '头图数据无效', icon: 'none' })
        return
      }
      console.log('[后台] 开始删除头图，ID:', this.currentBanner._id)
      console.log('[后台] 当前头图数据:', this.currentBanner)
      
      // 验证ID参数
      if (!this.currentBanner._id) {
        console.error('删除失败：头图ID为空')
        uni.showToast({ title: '头图数据无效', icon: 'none' })
        return
      }
      
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个头图吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              console.log('[后台] 用户确认删除，调用云函数...')
              console.log('传递的参数:', { bannerId: this.currentBanner._id })
              
              const result = await jointManagement.deleteBanner({ _id: this.currentBanner._id })
              console.log('[后台] 删除云函数返回结果:', result)
              
              if (result.success) {
                await this.loadBanners()
                uni.showToast({ title: '删除成功', icon: 'success' })
              } else {
                const errorMsg = result.message || '删除失败'
                console.error('[后台] 删除失败详情:', result)
                throw new Error(errorMsg)
              }
            } catch (error) {
              console.error('[后台] 删除合坛法会头图失败:', error)
              uni.showToast({ 
                title: error.message || '删除失败', 
                icon: 'none' 
              })
            }
          }
        }
      })
    },
    
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.add-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.banner-container {
  margin-bottom: 20rpx;
}

.no-banner {
  background: #fff;
  padding: 60rpx 30rpx;
  border-radius: 12rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.no-banner-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 30rpx;
  display: block;
}

.banners-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300rpx, 1fr));
  gap: 20rpx;
}

.banner-card {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.banner-preview {
  position: relative;
  height: 200rpx;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.banner-card:hover .banner-overlay {
  opacity: 1;
}

.banner-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  padding: 15rpx 30rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  border: none;
}

.action-btn.edit {
  background: #667eea;
  color: #fff;
}

.action-btn.delete {
  background: #ff4757;
  color: #fff;
}

.banner-info {
  padding: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.info-label {
  font-size: 26rpx;
  color: #999;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.info-value.enabled {
  color: #28a745;
}

.info-value.disabled {
  color: #dc3545;
}

.popup-content {
  background: #fff;
  border-radius: 12rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.popup-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.form-content {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.image-upload {
  width: 100%;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-preview {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.upload-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 28rpx;
}

.switch-label {
  font-size: 28rpx;
  color: #333;
  margin-left: 20rpx;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
}

.cancel-btn, .save-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.save-btn {
  background: #667eea;
  color: #fff;
}
</style> 