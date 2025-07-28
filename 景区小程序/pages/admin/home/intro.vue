<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">首页介绍管理</text>
      <text class="page-desc">管理小程序首页的图文介绍内容</text>
    </view>

    <!-- 介绍内容列表 -->
    <view class="intro-list">
      <view class="section-title">
        <text class="icon">📝</text>介绍内容列表
        <button class="add-btn" @click="showAddModal">+ 添加内容</button>
      </view>
      
      <view class="intro-items">
        <view v-for="(intro, index) in intros" :key="index" class="intro-item" v-if="intro">
          <view class="intro-preview">
            <view class="intro-header">
              <view class="intro-status" :class="{ active: intro && intro.enabled }">
                {{ intro && intro.enabled ? '启用' : '禁用' }}
              </view>
            </view>
            <view class="intro-content">
              <text class="intro-text">{{ intro && intro.content ? intro.content : '未设置内容' }}</text>
            </view>
            <view class="intro-meta">
              <text class="intro-order">排序：{{ index + 1 }}</text>
            </view>
          </view>
          <view class="intro-actions">
            <button class="action-btn edit" @click="editIntro(index)">编辑</button>
            <button class="action-btn delete" @click="deleteIntro(index)">删除</button>
            <button class="action-btn move" @click="moveIntro(index, 'up')" :disabled="index === 0">↑</button>
            <button class="action-btn move" @click="moveIntro(index, 'down')" :disabled="index === intros.length - 1">↓</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加/编辑弹窗 -->
    <uni-popup :show="showIntroPopup" type="center" @close="closePopupIntro">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑介绍' : '添加介绍' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        

        

        
        <view class="form-group">
          <text class="form-label">内容</text>
          <textarea 
            v-model="currentIntro.content"
            placeholder="请输入介绍内容" 
            class="form-textarea" 
            maxlength="500"
          />
          <view class="word-count">{{ currentIntro.content.length }}/500</view>
        </view>
        
        <view class="form-group">
          <text class="form-label">背景图片（可选）</text>
          <view class="upload-area" @click="chooseImage">
            <image v-if="currentIntro.bgImage" :src="currentIntro.bgImage" class="upload-preview" mode="aspectFill" />
            <view v-else class="upload-placeholder">
              <text class="upload-icon">📷</text>
              <text class="upload-text">点击上传背景图片</text>
            </view>
          </view>
        </view>
        
        <view class="form-group">
          <text class="form-label">显示设置</text>
          <view class="setting-group">
            <view class="setting-item">
              <text class="setting-label">是否启用</text>
              <switch :checked="currentIntro.enabled" @change="onEnabledChange" />
            </view>
            <view class="setting-item">
              <text class="setting-label">显示边框</text>
              <switch :checked="currentIntro.showBorder" @change="onBorderChange" />
            </view>
          </view>
        </view>
        
        <view class="form-group">
          <text class="form-label">样式设置</text>
          <view class="style-group">
            <view class="style-item">
              <text class="style-label">文字颜色</text>
              <view class="color-picker">
                <view 
                  v-for="color in colorOptions" 
                  :key="color.value"
                  class="color-item"
                  :class="{ active: currentIntro.textColor === color.value }"
                  :style="{ backgroundColor: color.value }"
                  @click="selectTextColor(color.value)"
                ></view>
              </view>
            </view>
            <view class="style-item">
              <text class="style-label">背景颜色</text>
              <view class="color-picker">
                <view 
                  v-for="bgColor in bgColorOptions" 
                  :key="bgColor.value"
                  class="color-item"
                  :class="{ active: currentIntro.bgColor === bgColor.value }"
                  :style="{ backgroundColor: bgColor.value }"
                  @click="selectBgColor(bgColor.value)"
                ></view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="popup-buttons">
          <button class="popup-btn primary" @click="saveIntro">保存</button>
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
      intros: [],
      currentIntro: {
        content: '',
        bgImage: '',
        enabled: true,
        showBorder: true,
        textColor: '#333333',
        bgColor: '#FFFFFF'
      },
      isEdit: false,
      editIndex: -1,
      loading: false,

      colorOptions: [
        { label: '黑色', value: '#333333' },
        { label: '深灰', value: '#666666' },
        { label: '蓝色', value: '#007AFF' },
        { label: '绿色', value: '#34C759' },
        { label: '橙色', value: '#FF9500' },
        { label: '红色', value: '#FF3B30' }
      ],
      bgColorOptions: [
        { label: '白色', value: '#FFFFFF' },
        { label: '浅灰', value: '#F8F9FA' },
        { label: '浅蓝', value: '#E3F2FD' },
        { label: '浅绿', value: '#E8F5E8' },
        { label: '浅橙', value: '#FFF3E0' },
        { label: '浅红', value: '#FFEBEE' }
      ],
      showIntroPopup: false
    }
  },
  onLoad() {
    this.loadIntros()
  },
  methods: {
    // 加载介绍数据
    async loadIntros() {
      try {
        this.loading = true
        const result = await uniCloud.callFunction({
          name: 'getHomeIntros'
        })
        // 确保数据是数组且过滤掉无效项
        const data = result.result.data || []
        this.intros = Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : []
        console.log('加载的介绍数据:', this.intros)
      } catch (error) {
        console.error('加载介绍失败:', error)
        this.intros = []
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },



    // 显示添加弹窗
    showAddModal() {
      console.log('显示添加弹窗')
      this.isEdit = false
      this.editIndex = -1
      this.currentIntro = {
        content: '',
        bgImage: '',
        enabled: true,
        showBorder: true,
        textColor: '#333333',
        bgColor: '#FFFFFF'
      }
      console.log('添加模式下的currentIntro:', this.currentIntro)
      console.log('currentIntro.content:', this.currentIntro.content)
      // 显示弹窗
      this.showIntroPopup = true
      console.log('弹窗显示后的currentIntro:', this.currentIntro)
    },

    // 编辑介绍
    editIntro(index) {
      console.log('编辑介绍:', index)
      const originalIntro = this.intros[index]
      if (!originalIntro) {
        console.error('介绍数据不存在:', index)
        uni.showToast({
          title: '数据错误',
          icon: 'none'
        })
        return
      }
      
      console.log('原始介绍数据:', originalIntro)
      this.isEdit = true
      this.editIndex = index
      
      // 深拷贝确保数据正确复制
      this.currentIntro = {
        content: originalIntro.content || '',
        bgImage: originalIntro.bgImage || '',
        enabled: originalIntro.enabled !== undefined ? originalIntro.enabled : true,
        showBorder: originalIntro.showBorder !== undefined ? originalIntro.showBorder : true,
        textColor: originalIntro.textColor || '#333333',
        bgColor: originalIntro.bgColor || '#FFFFFF'
      }
      
      console.log('编辑的介绍数据:', this.currentIntro)
      console.log('currentIntro.content:', this.currentIntro.content)
      // 显示弹窗
      this.showIntroPopup = true
      console.log('弹窗显示后的currentIntro:', this.currentIntro)
    },

    // 删除介绍
    async deleteIntro(index) {
      const intro = this.intros[index]
      if (!intro) {
        console.error('介绍数据不存在:', index)
        uni.showToast({
          title: '数据错误',
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个介绍内容吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await uniCloud.callFunction({
                name: 'deleteHomeIntro',
                data: { id: intro._id }
              })
              this.intros.splice(index, 1)
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
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

    // 移动介绍位置
    async moveIntro(index, direction) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= this.intros.length) return
      
      // 交换位置
      const temp = this.intros[index]
      this.intros[index] = this.intros[newIndex]
      this.intros[newIndex] = temp
      
      // 更新排序
      try {
        await uniCloud.callFunction({
          name: 'updateIntroOrder',
          data: { intros: this.intros }
        })
        uni.showToast({
          title: '排序更新成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('更新排序失败:', error)
        uni.showToast({
          title: '更新失败',
          icon: 'none'
        })
      }
    },



    // 选择图片
    async chooseImage() {
      try {
        const res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          // 上传图片到云存储
          const uploadResult = await uniCloud.uploadFile({
            filePath: res.tempFilePaths[0],
            cloudPath: `intros/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
          })
          
          this.currentIntro.bgImage = uploadResult.fileID
        }
      } catch (error) {
        console.error('选择图片失败:', error)
        uni.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    },

    // 启用状态切换
    onEnabledChange(e) {
      this.currentIntro.enabled = e.detail.value
    },

    // 边框显示切换
    onBorderChange(e) {
      this.currentIntro.showBorder = e.detail.value
    },

    // 选择文字颜色
    selectTextColor(color) {
      this.currentIntro.textColor = color
    },

    // 选择背景颜色
    selectBgColor(bgColor) {
      this.currentIntro.bgColor = bgColor
    },

    // 保存介绍
    async saveIntro() {
      console.log('开始保存介绍')
      console.log('当前介绍数据:', this.currentIntro)
      console.log('content值:', this.currentIntro.content)
      console.log('content是否为空:', !this.currentIntro.content)
      console.log('content是否为空字符串:', this.currentIntro.content === '')
      console.log('content是否为空或undefined:', !this.currentIntro.content || this.currentIntro.content === '')
      
      if (!this.currentIntro.content || this.currentIntro.content.trim() === '') {
        uni.showToast({
          title: '请填写内容',
          icon: 'none'
        })
        return
      }

      try {
        this.loading = true
        
        if (this.isEdit) {
          console.log('执行编辑操作')
          // 更新介绍
          const updateResult = await uniCloud.callFunction({
            name: 'updateHomeIntro',
            data: {
              id: this.intros[this.editIndex]._id,
              intro: this.currentIntro
            }
          })
          console.log('更新结果:', updateResult)
          this.intros[this.editIndex] = { ...this.currentIntro }
        } else {
          console.log('执行添加操作')
          console.log('传递给云函数的数据:', { intro: this.currentIntro })
          console.log('currentIntro.content:', this.currentIntro.content)
          console.log('currentIntro.content类型:', typeof this.currentIntro.content)
          console.log('currentIntro.content长度:', this.currentIntro.content ? this.currentIntro.content.length : 0)
          
          // 添加介绍
          const introData = {
            content: this.currentIntro.content,
            bgImage: this.currentIntro.bgImage || '',
            enabled: this.currentIntro.enabled,
            showBorder: this.currentIntro.showBorder,
            textColor: this.currentIntro.textColor,
            bgColor: this.currentIntro.bgColor
          }
          console.log('准备发送的数据:', introData)
          
          // 尝试直接传递数据
          const result = await uniCloud.callFunction({
            name: 'addHomeIntro',
            data: introData
          })
          console.log('添加结果:', result)
          
          if (result.result && result.result.code === 0) {
            this.intros.push(result.result.data)
            console.log('添加成功，当前列表:', this.intros)
          } else {
            throw new Error(result.result?.message || '添加失败')
          }
        }

        this.closePopup()
        uni.showToast({
          title: this.isEdit ? '更新成功' : '添加成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('保存失败:', error)
        uni.showToast({
          title: '保存失败: ' + (error.message || error),
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },



    // 关闭弹窗
    closePopup() {
      this.showIntroPopup = false
    },
    closePopupIntro() {
      this.showIntroPopup = false
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

.intro-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.add-btn {
  background: #007aff;
  color: #fff;
  border: none;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.intro-items {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.intro-item {
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.intro-preview {
  flex: 1;
}

.intro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.intro-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.intro-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: #f0f0f0;
  color: #999;
}

.intro-status.active {
  background: #e8f5e8;
  color: #34c759;
}

.intro-content {
  margin-bottom: 10rpx;
}

.intro-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.intro-meta {
  display: flex;
  gap: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.intro-actions {
  display: flex;
  gap: 10rpx;
}

.action-btn {
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
}

.action-btn.edit {
  color: #007aff;
}

.action-btn.delete {
  color: #ff3b30;
}

.action-btn.move {
  color: #666;
}

.action-btn:disabled {
  opacity: 0.5;
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

.word-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.picker {
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-value {
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

.upload-area {
  border: 2rpx dashed #e0e0e0;
  border-radius: 8rpx;
  padding: 40rpx;
  text-align: center;
  background: #f9f9f9;
}

.upload-preview {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.upload-icon {
  font-size: 60rpx;
}

.upload-text {
  font-size: 28rpx;
  color: #666;
}

.setting-group, .style-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.setting-item, .style-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-label, .style-label {
  font-size: 28rpx;
  color: #333;
}

.color-picker {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.color-item {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
  cursor: pointer;
}

.color-item.active {
  border-color: #007aff;
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