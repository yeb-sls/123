<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">供灯配置管理</text>
      <text class="page-desc">管理供灯祈福项目和价格配置</text>
    </view>

    <!-- 供灯项目列表 -->
    <view class="config-section">
      <view class="section-title">
        <text class="icon">🏮</text>供灯项目配置
        <button class="add-btn" @click="showAddModal">+ 添加项目</button>
      </view>
      
      <view class="config-list">
        <view v-for="(item, index) in lightItems" :key="index" class="config-item">
          <view class="item-image">
            <image v-if="item.image" :src="item.image" class="item-img" mode="aspectFill" />
            <view v-else class="item-placeholder">🕯️</view>
          </view>
          
          <view class="item-info">
            <view class="item-header">
              <text class="item-name">{{ item.name }}</text>
              <view class="item-status" :class="{ active: item.enabled }">
                {{ item.enabled ? '启用' : '禁用' }}
              </view>
            </view>
            
            <view class="item-details">
              <text class="item-desc">{{ item.description }}</text>
              <view class="item-meta">
                <text class="item-price">价格：¥{{ item.price }}</text>
                <text class="item-duration">时长：{{ item.duration }}天</text>
              </view>
            </view>
          </view>
          
          <view class="item-actions">
            <button class="action-btn edit" @click="editItem(index)">编辑</button>
            <button class="action-btn delete" @click="deleteItem(index)">删除</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加/编辑弹窗 -->
    <uni-popup ref="itemPopup" type="center">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑供灯项目' : '添加供灯项目' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        
        <view class="form-group">
          <text class="form-label">项目名称</text>
          <input v-model="currentItem.name" placeholder="请输入项目名称" class="form-input" maxlength="50" />
        </view>
        
        <view class="form-group">
          <text class="form-label">项目描述</text>
          <textarea v-model="currentItem.description" placeholder="请输入项目描述" class="form-textarea" maxlength="200" />
          <view class="word-count">{{ currentItem.description.length }}/200</view>
        </view>
        
        <view class="form-group">
          <text class="form-label">项目价格</text>
          <input v-model="currentItem.price" placeholder="请输入价格" class="form-input" type="number" />
        </view>
        
        <view class="form-group">
          <text class="form-label">供灯时长（天）</text>
          <input v-model="currentItem.duration" placeholder="请输入时长" class="form-input" type="number" />
        </view>
        
        <view class="form-group">
          <text class="form-label">项目图片</text>
          <view class="upload-area" @click="chooseImage">
            <image v-if="currentItem.image" :src="currentItem.image" class="upload-preview" mode="aspectFill" />
            <view v-else class="upload-placeholder">
              <text class="upload-icon">📷</text>
              <text class="upload-text">点击上传项目图片</text>
            </view>
          </view>
        </view>
        
        <view class="form-group">
          <text class="form-label">显示设置</text>
          <view class="setting-group">
            <view class="setting-item">
              <text class="setting-label">是否启用</text>
              <switch :checked="currentItem.enabled" @change="onEnabledChange" />
            </view>
            <view class="setting-item">
              <text class="setting-label">推荐项目</text>
              <switch :checked="currentItem.recommended" @change="onRecommendedChange" />
            </view>
          </view>
        </view>
        
        <view class="popup-buttons">
          <button class="popup-btn primary" @click="saveItem">保存</button>
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
      lightItems: [],
      currentItem: {
        name: '',
        description: '',
        price: '',
        duration: '',
        image: '',
        enabled: true,
        recommended: false
      },
      isEdit: false,
      editIndex: -1,
      loading: false
    }
  },
  onLoad() {
    this.loadItems()
  },
  methods: {
    // 加载供灯项目数据
    async loadItems() {
      try {
        this.loading = true
        const result = await this.$cloud.callFunction({
          name: 'getLightItems'
        })
        this.lightItems = result.result.data || []
      } catch (error) {
        console.error('加载供灯项目失败:', error)
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
      this.isEdit = false
      this.editIndex = -1
      this.currentItem = {
        name: '',
        description: '',
        price: '',
        duration: '',
        image: '',
        enabled: true,
        recommended: false
      }
      this.$refs.itemPopup.open()
    },

    // 编辑项目
    editItem(index) {
      this.isEdit = true
      this.editIndex = index
      this.currentItem = { ...this.lightItems[index] }
      this.$refs.itemPopup.open()
    },

    // 删除项目
    async deleteItem(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个供灯项目吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$cloud.callFunction({
                name: 'deleteLightItem',
                data: { id: this.lightItems[index]._id }
              })
              this.lightItems.splice(index, 1)
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

    // 选择图片
    async chooseImage() {
      try {
        const res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          const uploadResult = await this.$cloud.uploadFile({
            filePath: res.tempFilePaths[0],
            cloudPath: `light/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
          })
          
          this.currentItem.image = uploadResult.fileID
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
      this.currentItem.enabled = e.detail.value
    },

    // 推荐状态切换
    onRecommendedChange(e) {
      this.currentItem.recommended = e.detail.value
    },

    // 保存项目
    async saveItem() {
      if (!this.currentItem.name || !this.currentItem.description || !this.currentItem.price || !this.currentItem.duration) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      try {
        this.loading = true
        
        if (this.isEdit) {
          // 更新项目
          await this.$cloud.callFunction({
            name: 'updateLightItem',
            data: {
              id: this.lightItems[this.editIndex]._id,
              item: this.currentItem
            }
          })
          this.lightItems[this.editIndex] = { ...this.currentItem }
        } else {
          // 添加项目
          const result = await this.$cloud.callFunction({
            name: 'addLightItem',
            data: { item: this.currentItem }
          })
          this.lightItems.push(result.result.data)
        }

        this.closePopup()
        uni.showToast({
          title: this.isEdit ? '更新成功' : '添加成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('保存失败:', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 关闭弹窗
    closePopup() {
      this.$refs.itemPopup.close()
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

.config-section {
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

.config-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.config-item {
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.item-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.item-img {
  width: 100%;
  height: 100%;
}

.item-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}

.item-info {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.item-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.item-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: #f0f0f0;
  color: #999;
}

.item-status.active {
  background: #e8f5e8;
  color: #34c759;
}

.item-details {
  margin-bottom: 10rpx;
}

.item-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.item-meta {
  display: flex;
  gap: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.item-actions {
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

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-label {
  font-size: 28rpx;
  color: #333;
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