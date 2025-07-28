<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会介绍管理</text>
      <text class="page-desc">管理小程序合坛法会页面的介绍内容</text>
      <button class="add-btn" @click="showAddModal">+ 新增介绍</button>
    </view>
    
    <!-- 介绍列表 -->
    <view class="intros-list">
      <view v-for="(intro, index) in intros" :key="intro._id" class="intro-card">
        <view class="intro-content">
          <text class="intro-text">{{ intro.content }}</text>
          <view class="intro-preview" :style="{ backgroundColor: intro.bgColor }">
            <text class="preview-text" :style="{ color: intro.textColor }">{{ intro.content }}</text>
          </view>
        </view>
        
        <view class="intro-info">
          <view class="info-row">
            <text class="info-label">排序：</text>
            <text class="info-value">{{ intro.order || 0 }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">状态：</text>
            <text class="info-value" :class="intro.enabled ? 'enabled' : 'disabled'">
              {{ intro.enabled ? '启用' : '禁用' }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">文字颜色：</text>
            <view class="color-preview" :style="{ backgroundColor: intro.textColor }"></view>
          </view>
          <view class="info-row">
            <text class="info-label">背景颜色：</text>
            <view class="color-preview" :style="{ backgroundColor: intro.bgColor }"></view>
          </view>
        </view>
        
        <view class="intro-actions">
          <button class="action-btn edit" @click="editIntro(index)">编辑</button>
          <button class="action-btn delete" @click="deleteIntro(intro._id)">删除</button>
        </view>
      </view>
    </view>
    
    <!-- 添加/编辑弹窗 -->
    <uni-popup ref="popup" type="center" :mask-click="false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑介绍' : '新增介绍' }}</text>
          <text class="popup-close" @click="closeModal">×</text>
        </view>
        
        <view class="form-content">
          <view class="form-item">
            <text class="form-label">介绍内容 *</text>
            <textarea v-model="currentIntro.content" class="form-textarea" placeholder="请输入合坛法会介绍内容" maxlength="500" />
            <text class="char-count">{{ currentIntro.content.length }}/500</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">排序</text>
            <input v-model="currentIntro.order" type="number" class="form-input" placeholder="请输入排序号" />
          </view>
          
          <view class="form-item">
            <text class="form-label">文字颜色</text>
            <view class="color-picker">
              <view class="color-option" v-for="color in textColors" :key="color" 
                    :style="{ backgroundColor: color }" 
                    :class="{ active: currentIntro.textColor === color }"
                    @click="selectTextColor(color)">
              </view>
              <input v-model="currentIntro.textColor" class="color-input" placeholder="#333333" />
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">背景颜色</text>
            <view class="color-picker">
              <view class="color-option" v-for="color in bgColors" :key="color" 
                    :style="{ backgroundColor: color }" 
                    :class="{ active: currentIntro.bgColor === color }"
                    @click="selectBgColor(color)">
              </view>
              <input v-model="currentIntro.bgColor" class="color-input" placeholder="#FFFFFF" />
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">背景图片</text>
            <view class="image-upload" @click="chooseImage">
              <image v-if="currentIntro.bgImage" :src="currentIntro.bgImage" class="upload-preview" mode="aspectFill" />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">🖼️</text>
                <text class="upload-text">点击选择背景图片（可选）</text>
              </view>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">状态</text>
            <switch :checked="currentIntro.enabled" @change="onSwitchChange" color="#667eea" />
            <text class="switch-label">{{ currentIntro.enabled ? '启用' : '禁用' }}</text>
          </view>
        </view>
        
        <view class="form-actions">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveIntro">保存</button>
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
      intros: [],
      isEdit: false,
      editIndex: -1,
      textColors: ['#333333', '#666666', '#999999', '#FFFFFF', '#000000', '#667eea', '#ff6b35'],
      bgColors: ['#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#667eea', '#f0f4ff', '#fff7ec'],
      currentIntro: {
        _id: '',
        content: '',
        order: 0,
        textColor: '#333333',
        bgColor: '#FFFFFF',
        bgImage: '',
        enabled: true
      }
    }
  },
  
  onLoad() {
    this.loadIntros()
  },
  
  methods: {
    async loadIntros() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getJointIntros'
        })
        this.intros = res.result && res.result.data ? res.result.data : []
      } catch (error) {
        console.error('加载合坛法会介绍失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    showAddModal() {
      this.isEdit = false
      this.editIndex = -1
      this.currentIntro = {
        _id: '',
        content: '',
        order: 0,
        textColor: '#333333',
        bgColor: '#FFFFFF',
        bgImage: '',
        enabled: true
      }
      this.$refs.popup.open()
    },
    
    editIntro(index) {
      this.isEdit = true
      this.editIndex = index
      this.currentIntro = JSON.parse(JSON.stringify(this.intros[index]))
      this.$refs.popup.open()
    },
    
    closeModal() {
      this.$refs.popup.close()
    },
    
    selectTextColor(color) {
      this.currentIntro.textColor = color
    },
    
    selectBgColor(color) {
      this.currentIntro.bgColor = color
    },
    
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.currentIntro.bgImage = res.tempFilePaths[0]
        }
      })
    },
    
    onSwitchChange(e) {
      this.currentIntro.enabled = e.detail.value
    },
    
    async saveIntro() {
      if (!this.currentIntro.content.trim()) {
        uni.showToast({ title: '请输入介绍内容', icon: 'none' })
        return
      }
      
      try {
        const data = {
          ...this.currentIntro,
          order: Number(this.currentIntro.order) || 0
        }
        
        if (this.isEdit && data._id) {
          const updateData = { ...data }
          delete updateData._id
          await uniCloud.callFunction({
            name: 'updateJointIntro',
            data: { id: data._id, intro: updateData }
          })
        } else {
          await uniCloud.callFunction({
            name: 'addJointIntro',
            data: { intro: data }
          })
        }
        
        this.closeModal()
        await this.loadIntros()
        uni.showToast({ title: this.isEdit ? '更新成功' : '添加成功' })
      } catch (error) {
        console.error('保存合坛法会介绍失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    
    async deleteIntro(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个介绍吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await uniCloud.callFunction({
                name: 'deleteJointIntro',
                data: { id }
              })
              await this.loadIntros()
              uni.showToast({ title: '删除成功' })
            } catch (error) {
              console.error('删除合坛法会介绍失败:', error)
              uni.showToast({ title: '删除失败', icon: 'none' })
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

.intros-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.intro-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.intro-content {
  margin-bottom: 20rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}

.intro-preview {
  padding: 20rpx;
  border-radius: 8rpx;
  border: 1rpx solid #eee;
  min-height: 100rpx;
  display: flex;
  align-items: center;
}

.preview-text {
  font-size: 26rpx;
  line-height: 1.5;
}

.intro-info {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.color-preview {
  width: 40rpx;
  height: 40rpx;
  border-radius: 8rpx;
  border: 2rpx solid #ddd;
}

.intro-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
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

.form-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  resize: none;
}

.char-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 10rpx;
  display: block;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.color-option {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  border: 2rpx solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.color-option.active {
  border-color: #667eea;
  transform: scale(1.1);
}

.color-input {
  flex: 1;
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