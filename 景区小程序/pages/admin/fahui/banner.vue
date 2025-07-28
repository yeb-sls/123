<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}头图管理</text>
      <text class="page-desc">管理{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}页面头图配置</text>
    </view>

    <!-- 头图列表 -->
    <view class="banner-list">
      <view v-for="(banner, index) in banners" :key="banner._id" class="banner-card">
        <view class="banner-image">
          <image :src="banner.image" mode="aspectFill" class="banner-img" />
        </view>
        
        <view class="banner-info">
          <view class="banner-status" :class="{ active: banner.enabled }">
            {{ banner.enabled ? '启用' : '禁用' }}
          </view>
        </view>
        
        <view class="banner-actions">
          <button class="action-btn edit" @click="editBanner(banner)">编辑</button>
          <button class="action-btn delete" @click="deleteBanner(banner._id)">删除</button>
        </view>
      </view>
    </view>

    <!-- 添加按钮 -->
    <button class="add-btn" @click="showAddModal">
      <text class="add-icon">+</text>
      <text class="add-text">添加头图</text>
    </button>

    <!-- 添加/编辑弹窗 -->
    <uni-popup :show="showPopup" type="center" @close="closePopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑头图' : '添加头图' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        
        <view class="form-group">
          <text class="form-label">头图图片 <text class="required">*</text></text>
          <view class="image-upload" @click="chooseImage">
            <image v-if="currentBanner.image" :src="currentBanner.image" mode="aspectFill" class="upload-img" />
            <view v-else class="upload-placeholder">
              <text class="upload-icon">+</text>
              <text class="upload-text">选择图片</text>
            </view>
          </view>
        </view>
        
        <view class="form-group">
          <text class="form-label">是否启用</text>
          <switch :checked="currentBanner.enabled" @change="onEnabledChange" />
        </view>
        
        <view class="popup-buttons">
          <button class="popup-btn primary" @click="saveBanner">保存</button>
          <button class="popup-btn" @click="closePopup">取消</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

export default {
  components: {
    uniPopup
  },
  data() {
    return {
      banners: [],
      showPopup: false,
      isEdit: false,
      editIndex: -1,
      fahuiType: 'special', // 默认专场法会
      currentBanner: {
        image: '',
        enabled: true,
        type: 'special'
      }
    }
  },
  
  onLoad(options) {
    // 获取法会类型参数
    if (options.type) {
      this.fahuiType = options.type;
      this.currentBanner.type = options.type;
    }
    this.loadBanners()
  },
  
  methods: {
    // 加载头图列表
    async loadBanners() {
      uni.showLoading({ title: '加载中...' })
      try {
        const result = await uniCloud.callFunction({
          name: 'getFahuiBanners',
          data: { 
            type: this.fahuiType,
            t: Date.now() // 防止云函数缓存
          }
        })
        let banners = result.result && result.result.data ? result.result.data : []
        // 批量转换 fileID 为临时链接
        if (banners.length > 0) {
          const fileList = banners.map(b => b.image).filter(Boolean)
          if (fileList.length > 0) {
            const tempRes = await uniCloud.getTempFileURL({ fileList })
            const urlMap = {}
            tempRes.fileList.forEach(f => { urlMap[f.fileID] = f.tempFileURL })
            banners.forEach(b => {
              if (b.image && urlMap[b.image]) b.image = urlMap[b.image]
            })
          }
        }
        this.banners = banners
      } catch (error) {
        this.banners = []
        console.error('加载头图失败:', error)
      } finally {
        uni.hideLoading()
      }
    },
    
    // 显示添加弹窗
    showAddModal() {
      this.isEdit = false
      this.editIndex = -1
      this.currentBanner = {
        image: '',
        enabled: true,
        type: this.fahuiType
      }
      this.showPopup = true
    },
    
    // 编辑头图
    editBanner(banner) {
      this.isEdit = true
      this.editIndex = this.banners.findIndex(b => b._id === banner._id)
      this.currentBanner = { ...banner, type: this.fahuiType }
      this.showPopup = true
    },
    
    // 删除头图
    async deleteBanner(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个头图吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await uniCloud.callFunction({
                name: 'deleteFahuiBanner',
                data: { id }
              })
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
              setTimeout(() => { this.loadBanners() }, 300)
            } catch (error) {
              console.error('删除失败:', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    
    // 启用状态切换
    onEnabledChange(e) {
      this.currentBanner.enabled = e.detail.value
    },
    
    // 选择图片
    async chooseImage() {
      try {
        const [err, res] = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        
        if (err) {
          console.error('选择图片失败:', err)
          return
        }
        
        const tempFilePath = res.tempFilePaths[0]
        uni.showLoading({ title: '上传中...' })
        
        const uploadResult = await uniCloud.uploadFile({
          filePath: tempFilePath,
          cloudPath: `fahui/banners/${Date.now()}.jpg`
        })
        
        this.currentBanner.image = uploadResult.fileID
        uni.hideLoading()
        uni.showToast({
          title: '上传成功',
          icon: 'success'
        })
      } catch (error) {
        uni.hideLoading()
        console.error('上传图片失败:', error)
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    },
    
    // 验证头图数据
    validateBanner() {
      if (!this.currentBanner.image) {
        uni.showToast({ title: '请选择头图', icon: 'none' })
        return false
      }
      return true
    },
    
    // 保存头图
    async saveBanner() {
      if (!this.validateBanner()) {
        return
      }
      
      try {
        // 深拷贝并去除 _id 字段
        const bannerData = { ...this.currentBanner }
        if ('_id' in bannerData) {
          delete bannerData._id
        }
        if (this.isEdit) {
          await uniCloud.callFunction({
            name: 'updateFahuiBanner',
            data: {
              id: this.banners[this.editIndex]._id,
              banner: bannerData
            }
          })
        } else {
          await uniCloud.callFunction({
            name: 'addFahuiBanner',
            data: { banner: bannerData }
          })
        }
        
        this.closePopup()
        uni.showToast({
          title: this.isEdit ? '更新成功' : '添加成功',
          icon: 'success'
        })
        await this.loadBanners() // 保存后强制刷新
      } catch (error) {
        console.error('保存失败:', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    },
    
    // 关闭弹窗
    closePopup() {
      this.showPopup = false
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

.banner-list {
  margin-bottom: 24rpx;
}

.banner-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.banner-image {
  margin-bottom: 16rpx;
}

.banner-img {
  width: 100%;
  height: 200rpx;
  border-radius: 8rpx;
}

.banner-info {
  margin-bottom: 16rpx;
}

.banner-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.banner-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.banner-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: #f0f0f0;
  color: #999;
  display: inline-block;
}

.banner-status.active {
  background: #e8f5e8;
  color: #34c759;
}

.banner-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  flex: 1;
  padding: 12rpx;
  border-radius: 6rpx;
  font-size: 26rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
}

.action-btn.edit {
  color: #007aff;
}

.action-btn.delete {
  color: #ff3b30;
}

.add-btn {
  width: 100%;
  height: 80rpx;
  border: 2rpx dashed #2d8cf0;
  border-radius: 8rpx;
  background: #f8f9fa;
  color: #2d8cf0;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 36rpx;
  margin-right: 8rpx;
}

.popup-content {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 40rpx;
  color: #999;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.required {
  color: #ff4d4f;
  font-size: 26rpx;
}

.form-input, .form-textarea {
  width: 100%;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea {
  height: 120rpx;
  resize: none;
}

.image-upload {
  width: 100%;
  height: 200rpx;
  border: 2rpx dashed #e0e0e0;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-img {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 48rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.popup-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.popup-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
}

.popup-btn.primary {
  background: #007aff;
  color: #fff;
  border-color: #007aff;
}
</style> 