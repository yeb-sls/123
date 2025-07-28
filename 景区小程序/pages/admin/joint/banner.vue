<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会头图管理</text>
      <text class="page-desc">管理合坛法会页面头图配置</text>
      <button class="add-btn" @click="showAddModal">+ 新增头图</button>
    </view>
    
    <!-- 头图列表 -->
    <view class="banners-list">
      <view v-for="(banner, index) in banners" :key="banner._id" class="banner-card">
        <view class="banner-preview">
          <image :src="banner.image" class="banner-img" mode="aspectFill" />
          <view class="banner-overlay">
            <view class="banner-actions">
              <button class="action-btn edit" @click="editBanner(index)">编辑</button>
              <button class="action-btn delete" @click="deleteBanner(banner._id)">删除</button>
            </view>
          </view>
        </view>
        
        <view class="banner-info">
          <view class="info-row">
            <text class="info-label">排序：</text>
            <text class="info-value">{{ banner.order || 0 }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">状态：</text>
            <text class="info-value" :class="banner.enabled ? 'enabled' : 'disabled'">
              {{ banner.enabled ? '启用' : '禁用' }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">创建时间：</text>
            <text class="info-value">{{ formatTime(banner.create_time) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 添加/编辑弹窗 -->
    <uni-popup ref="popup" type="center" :mask-click="false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑头图' : '新增头图' }}</text>
          <text class="popup-close" @click="closeModal">×</text>
        </view>
        
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
            <text class="form-label">排序</text>
            <input v-model="currentBanner.order" type="number" class="form-input" placeholder="请输入排序号" />
          </view>
          
          <view class="form-item">
            <text class="form-label">状态</text>
            <switch :checked="currentBanner.enabled" @change="onSwitchChange" color="#667eea" />
            <text class="switch-label">{{ currentBanner.enabled ? '启用' : '禁用' }}</text>
          </view>
        </view>
        
        <view class="form-actions">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveBanner">保存</button>
        </view>
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
      banners: [],
      isEdit: false,
      editIndex: -1,
      currentBanner: {
        _id: '',
        image: '',
        order: 0,
        enabled: true,
        create_time: ''
      }
    }
  },
  
  onLoad() {
    this.loadBanners()
  },
  
  methods: {
    async loadBanners() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getJointBanners'
        })
        this.banners = res.result && res.result.data ? res.result.data : []
      } catch (error) {
        console.error('加载合坛法会头图失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    showAddModal() {
      this.isEdit = false
      this.editIndex = -1
      this.currentBanner = {
        _id: '',
        image: '',
        order: 0,
        enabled: true,
        create_time: ''
      }
      this.$refs.popup.open()
    },
    
    editBanner(index) {
      this.isEdit = true
      this.editIndex = index
      this.currentBanner = JSON.parse(JSON.stringify(this.banners[index]))
      this.$refs.popup.open()
    },
    
    closeModal() {
      this.$refs.popup.close()
    },
    
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.currentBanner.image = res.tempFilePaths[0]
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
        const data = {
          ...this.currentBanner,
          order: Number(this.currentBanner.order) || 0,
          create_time: this.currentBanner.create_time || new Date().toISOString()
        }
        
        if (this.isEdit && data._id) {
          const updateData = { ...data }
          delete updateData._id
          await uniCloud.callFunction({
            name: 'updateJointBanner',
            data: { id: data._id, banner: updateData }
          })
        } else {
          await uniCloud.callFunction({
            name: 'addJointBanner',
            data: { banner: data }
          })
        }
        
        this.closeModal()
        await this.loadBanners()
        uni.showToast({ title: this.isEdit ? '更新成功' : '添加成功' })
      } catch (error) {
        console.error('保存合坛法会头图失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    
    async deleteBanner(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个头图吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await uniCloud.callFunction({
                name: 'deleteJointBanner',
                data: { id }
              })
              await this.loadBanners()
              uni.showToast({ title: '删除成功' })
            } catch (error) {
              console.error('删除合坛法会头图失败:', error)
              uni.showToast({ title: '删除失败', icon: 'none' })
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