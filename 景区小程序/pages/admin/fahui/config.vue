<template>
  <view class="admin-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <view class="title">法会配置管理</view>
      <view class="add-btn" @click="showAddModal">
        <text class="add-icon">+</text>
        <text class="add-text">新增</text>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item">
        <text class="filter-label">状态：</text>
        <picker @change="onStatusChange" :value="statusIndex" :range="statusOptions">
          <view class="picker-text">{{ statusOptions[statusIndex] }}</view>
        </picker>
      </view>
      <view class="filter-item">
        <text class="filter-label">类型：</text>
        <picker @change="onTypeChange" :value="typeIndex" :range="typeOptions">
          <view class="picker-text">{{ typeOptions[typeIndex] }}</view>
        </picker>
      </view>
    </view>

    <!-- 配置列表 -->
    <view class="config-list">
      <view v-for="(config, index) in filteredConfigs" :key="config._id" class="config-item">
        <view class="config-header">
          <view class="config-title">{{ config.title }}</view>
          <view class="config-status" :class="config.status === '启用' ? 'status-active' : 'status-inactive'">
            {{ config.status || '未知' }}
          </view>
        </view>
        
        <view class="config-content">
          <view class="config-info">
            <view class="info-row">
              <text class="info-label">类型：</text>
              <text class="info-value">{{ config.type }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">价格：</text>
              <text class="info-value">¥{{ config.price }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">描述：</text>
              <text class="info-value">{{ config.description }}</text>
            </view>
          </view>
          
          <view class="config-image" v-if="config.image">
            <image :src="config.image" mode="aspectFill" class="config-img" />
          </view>
        </view>
        
        <view class="config-actions">
          <button class="action-btn edit-btn" @click="editConfig(config)">编辑</button>
          <button class="action-btn delete-btn" @click="deleteConfig(config._id)">删除</button>
        </view>
      </view>
    </view>

    <!-- 新增/编辑弹窗 -->
    <uni-popup ref="configModal" type="center">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ isEdit ? '编辑配置' : '新增配置' }}</text>
          <text class="modal-close" @click="hideModal">×</text>
        </view>
        
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">标题 *</text>
            <input class="form-input" v-model="formData.title" placeholder="请输入标题" />
          </view>
          
          <view class="form-item">
            <text class="form-label">类型 *</text>
            <picker @change="onFormTypeChange" :value="formTypeIndex" :range="typeOptions">
              <view class="form-picker">{{ typeOptions[formTypeIndex] }}</view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label">价格 *</text>
            <input class="form-input" v-model="formData.price" type="number" placeholder="请输入价格" />
          </view>
          
          <view class="form-item">
            <text class="form-label">描述</text>
            <textarea class="form-textarea" v-model="formData.description" placeholder="请输入描述" />
          </view>
          
          <view class="form-item">
            <text class="form-label">状态</text>
            <picker @change="onFormStatusChange" :value="formStatusIndex" :range="statusOptions">
              <view class="form-picker">{{ statusOptions[formStatusIndex] }}</view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label">图片</text>
            <view class="image-upload" @click="chooseImage">
              <image v-if="formData.image" :src="formData.image" mode="aspectFill" class="upload-img" />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">+</text>
                <text class="upload-text">选择图片</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="hideModal">取消</button>
          <button class="modal-btn confirm-btn" @click="saveConfig">保存</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

// 导入云对象
const fahuiManagement = uniCloud.importObject('fahui-management')

export default {
  components: {
    uniPopup
  },
  data() {
    return {
      configs: [],
      filteredConfigs: [],
      statusOptions: ['全部', '启用', '禁用'],
      statusIndex: 0,
      typeOptions: ['全部', '专场法会', '合坛法会'],
      typeIndex: 0,
      
      // 表单数据
      isEdit: false,
      formData: {
        title: '',
        type: '',
        price: '',
        description: '',
        status: '启用',
        image: ''
      },
      formTypeIndex: 0,
      formStatusIndex: 0
    }
  },
  
  onLoad() {
    this.loadConfigs()
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    // 加载配置列表
    async loadConfigs() {
      try {
        uni.showLoading({ title: '加载中...' })
        
        const result = await fahuiManagement.getConfigs()
        
        if (result.success) {
          this.configs = result.data || []
          this.filterConfigs()
        } else {
          uni.showToast({ title: result.message || '加载失败', icon: 'none' })
        }
      } catch (error) {
        console.error('加载配置失败：', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 筛选配置
    filterConfigs() {
      let filtered = [...this.configs]
      
      // 按状态筛选
      if (this.statusIndex > 0) {
        const status = this.statusOptions[this.statusIndex]
        filtered = filtered.filter(item => item.status === status)
      }
      
      // 按类型筛选
      if (this.typeIndex > 0) {
        const type = this.typeOptions[this.typeIndex]
        filtered = filtered.filter(item => item.type === type)
      }
      
      this.filteredConfigs = filtered
    },
    
    // 状态筛选变化
    onStatusChange(e) {
      this.statusIndex = e.detail.value
      this.filterConfigs()
    },
    
    // 类型筛选变化
    onTypeChange(e) {
      this.typeIndex = e.detail.value
      this.filterConfigs()
    },
    
    // 获取状态样式
    getStatusClass(status) {
      return status === '启用' ? 'status-active' : 'status-inactive'
    },
    
    // 获取状态文本
    getStatusText(status) {
      return status || '未知'
    },
    
    // 显示新增弹窗
    showAddModal() {
      this.isEdit = false
      this.resetForm()
      this.$refs.configModal.open()
    },
    
    // 编辑配置
    editConfig(config) {
      this.isEdit = true
      this.formData = { ...config }
      this.formTypeIndex = this.typeOptions.indexOf(config.type) || 0
      this.formStatusIndex = this.statusOptions.indexOf(config.status) || 0
      this.$refs.configModal.open()
    },
    
    // 隐藏弹窗
    hideModal() {
      this.$refs.configModal.close()
    },
    
    // 重置表单
    resetForm() {
      this.formData = {
        title: '',
        type: '',
        price: '',
        description: '',
        status: '启用',
        image: ''
      }
      this.formTypeIndex = 0
      this.formStatusIndex = 0
    },
    
    // 表单类型变化
    onFormTypeChange(e) {
      this.formTypeIndex = e.detail.value
      this.formData.type = this.typeOptions[this.formTypeIndex]
    },
    
    // 表单状态变化
    onFormStatusChange(e) {
      this.formStatusIndex = e.detail.value
      this.formData.status = this.statusOptions[this.formStatusIndex]
    },
    
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.uploadImage(res.tempFilePaths[0])
        }
      })
    },
    
    // 上传图片
    async uploadImage(filePath) {
      try {
        uni.showLoading({ title: '上传中...' })
        
        const result = await uniCloud.uploadFile({
          filePath: filePath,
          cloudPath: `fahui-configs/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
        })
        
        this.formData.image = result.fileID
        uni.showToast({
          title: '上传成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('上传失败：', error)
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 保存配置
    async saveConfig() {
      if (!this.formData.title || !this.formData.type || !this.formData.price) {
        uni.showToast({
          title: '请填写必填项',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showLoading({ title: '保存中...' })
        
        const result = await (this.isEdit ? 
          fahuiManagement.updateConfig(this.formData) : 
          fahuiManagement.addConfig(this.formData)
        )
        
        if (result.success) {
          uni.showToast({
            title: this.isEdit ? '更新成功' : '添加成功',
            icon: 'success'
          })
          
          this.hideModal()
          this.loadConfigs()
        } else {
          throw new Error(result.message || '操作失败')
        }
      } catch (error) {
        console.error('保存失败：', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 删除配置
    deleteConfig(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个配置吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '删除中...' })
              
              const result = await fahuiManagement.deleteConfig({ _id: id })
              
              if (result.success) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                this.loadConfigs()
              } else {
                throw new Error(result.message || '删除失败')
              }
            } catch (error) {
              console.error('删除失败：', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            } finally {
              uni.hideLoading()
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-container {
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
  justify-content: space-between;
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
}

.add-btn {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.add-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.filter-bar {
  background: white;
  padding: 20rpx 30rpx;
  display: flex;
  gap: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 10rpx;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
  padding: 10rpx 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #ddd;
}

.config-list {
  padding: 20rpx;
}

.config-item {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.config-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.config-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.status-active {
  background: #e8f5e8;
  color: #52c41a;
}

.status-inactive {
  background: #fff2f0;
  color: #ff4d4f;
}

.config-content {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.config-info {
  flex: 1;
}

.info-row {
  display: flex;
  margin-bottom: 10rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  width: 120rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.config-image {
  width: 120rpx;
  height: 120rpx;
}

.config-img {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.config-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 16rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.edit-btn {
  background: #1890ff;
  color: white;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
}

.modal-content {
  background: white;
  border-radius: 12rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  min-height: 120rpx;
  box-sizing: border-box;
}

.form-picker {
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #f8f9fa;
}

.image-upload {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.modal-footer {
  padding: 30rpx;
  border-top: 1rpx solid #eee;
  display: flex;
  gap: 20rpx;
}

.modal-btn {
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

.confirm-btn {
  background: #2d8cf0;
  color: white;
}
</style> 