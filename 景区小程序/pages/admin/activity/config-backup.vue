<template>
  <view class="admin-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <text class="page-title">活动配置管理</text>
          <text class="page-desc">管理活动项目和报名配置</text>
        </view>
        <view class="header-actions">
          <button class="add-btn" @click="showAddModal">
            <text class="btn-icon">➕</text>
            <text>添加活动</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-number">{{ activityItems.length }}</text>
        <text class="stat-label">总活动数</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ enabledCount }}</text>
        <text class="stat-label">已启用</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ disabledCount }}</text>
        <text class="stat-label">已禁用</text>
      </view>
    </view>

    <!-- 活动列表 -->
    <view class="activity-list">
      <view class="list-header">
        <text class="list-title">🎯 活动项目列表</text>
        <text class="list-subtitle">共 {{ activityItems.length }} 个活动</text>
      </view>
      
      <!-- 空状态 -->
      <view v-if="activityItems.length === 0" class="empty-state">
        <text class="empty-icon">🎯</text>
        <text class="empty-title">暂无活动</text>
        <text class="empty-desc">点击上方"添加活动"按钮开始创建</text>
        <button class="empty-btn" @click="showAddModal">添加第一个活动</button>
      </view>

      <!-- 活动列表 -->
      <view v-else class="activity-items">
        <view 
          v-for="(item, index) in activityItems" 
          :key="item._id" 
          class="activity-item"
          :class="{ 'activity-disabled': item.status !== '启用' }"
        >
          <!-- 活动信息 -->
          <view class="activity-info">
            <view class="info-header">
              <text class="activity-title">{{ item.name || '未设置名称' }}</text>
              <text class="activity-price">¥{{ item.price }}</text>
            </view>
            <text class="activity-desc">{{ item.description || '未设置描述' }}</text>
            <view class="activity-meta">
              <text class="activity-time">时间：{{ item.startTime }} - {{ item.endTime }}</text>
              <text class="activity-limit">人数限制：{{ item.maxParticipants || '无限制' }}</text>
            </view>
            <text class="activity-category">类型：{{ item.needShipping ? '需要邮寄' : '无需邮寄' }}</text>
            
            <!-- 操作按钮 -->
            <view class="activity-actions">
              <view class="action-group">
                <button class="edit-btn" @click="editActivityItem(index)">
                  <text class="action-icon">✏️</text>
                  <text>编辑</text>
                </button>
                <button class="delete-btn" @click="deleteActivityItem(index)">
                  <text class="action-icon">🗑️</text>
                  <text>删除</text>
                </button>
              </view>
              
              <view class="toggle-group">
                <text class="toggle-label">状态</text>
                <switch 
                  :checked="item.status === '启用'" 
                  @change="toggleActivityItemStatus(item, $event)"
                  color="#007aff"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加/编辑弹窗 -->
    <uni-popup :show="showActivityPopup" type="center" @close="closePopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑活动' : '添加活动' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        
        <view class="form-container">
          <view class="form-group">
            <text class="form-label">活动名称 *</text>
            <input 
              v-model="currentActivityItem.name" 
              placeholder="请输入活动名称" 
              class="form-input" 
              maxlength="50"
            />
            <text class="form-tip">{{ currentActivityItem.name.length }}/50</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">活动描述</text>
            <textarea 
              v-model="currentActivityItem.description" 
              placeholder="请输入活动描述" 
              class="form-textarea"
              maxlength="200"
            />
            <text class="form-tip">{{ currentActivityItem.description.length }}/200</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">开始时间 *</text>
            <picker 
              mode="date" 
              :value="currentActivityItem.startTime" 
              @change="onStartTimeChange"
              class="form-picker"
            >
              <view class="picker-display">
                <text>{{ currentActivityItem.startTime || '请选择开始时间' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">结束时间 *</text>
            <picker 
              mode="date" 
              :value="currentActivityItem.endTime" 
              @change="onEndTimeChange"
              class="form-picker"
            >
              <view class="picker-display">
                <text>{{ currentActivityItem.endTime || '请选择结束时间' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">活动费用 *</text>
            <input 
              v-model="currentActivityItem.price" 
              placeholder="请输入活动费用" 
              class="form-input" 
              type="number"
            />
            <text class="form-tip">单位：元</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">人数限制</text>
            <input 
              v-model="currentActivityItem.maxParticipants" 
              placeholder="请输入人数限制（可选）" 
              class="form-input" 
              type="number"
            />
            <text class="form-tip">留空表示无限制</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">是否需要邮寄</text>
            <switch 
              :checked="currentActivityItem.needShipping" 
              @change="onShippingChange"
              color="#007aff"
            />
            <text class="form-tip">{{ currentActivityItem.needShipping ? '需要收集收件信息' : '无需收集收件信息' }}</text>
          </view>
        </view>
        
        <view class="popup-buttons">
          <button class="popup-btn cancel-btn" @click="closePopup">取消</button>
          <button class="popup-btn primary-btn" @click="saveActivityItem" :disabled="loading">
            <text v-if="loading">保存中...</text>
            <text v-else>{{ isEdit ? '更新' : '保存' }}</text>
          </button>
        </view>
      </view>
    </uni-popup>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <view class="loading-content">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

export default {
  components: { uniPopup },
  data() {
    return {
      activityItems: [],
      currentActivityItem: {
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        price: '',
        maxParticipants: '',
        needShipping: false,
        status: '启用'
      },
      isEdit: false,
      editIndex: -1,
      loading: false,
      showActivityPopup: false
    }
  },
  computed: {
    enabledCount() {
      return this.activityItems.filter(item => item.status === '启用').length
    },
    disabledCount() {
      return this.activityItems.filter(item => item.status !== '启用').length
    }
  },
  onLoad() {
    this.loadActivityItems()
  },
  methods: {
    async loadActivityItems() {
      try {
        this.loading = true
        console.log('开始加载活动数据...')
        
        const result = await uniCloud.callFunction({ name: 'getActivityItems' })
        console.log('活动数据加载结果:', result)
        
        if (result.result && result.result.data) {
          this.activityItems = result.result.data
          console.log('活动数据加载成功，共', this.activityItems.length, '条')
        } else {
          this.activityItems = []
          console.log('活动数据为空')
        }
      } catch (error) {
        console.error('加载活动失败:', error)
        uni.showToast({ 
          title: '加载失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
        this.activityItems = []
      } finally {
        this.loading = false
      }
    },
    showAddModal() {
      console.log('打开添加活动弹窗')
      this.isEdit = false
      this.editIndex = -1
      this.currentActivityItem = { 
        name: '', 
        description: '', 
        startTime: '', 
        endTime: '', 
        price: '', 
        maxParticipants: '',
        needShipping: false,
        status: '启用'
      }
      this.showActivityPopup = true
    },
    editActivityItem(index) {
      this.isEdit = true
      this.editIndex = index
      this.currentActivityItem = { ...this.activityItems[index] }
      this.showActivityPopup = true
    },
    onStartTimeChange(e) {
      this.currentActivityItem.startTime = e.detail.value
    },
    onEndTimeChange(e) {
      this.currentActivityItem.endTime = e.detail.value
    },
    onShippingChange(e) {
      this.currentActivityItem.needShipping = e.detail.value
    },
    async deleteActivityItem(index) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除"${this.activityItems[index].name || '未命名'}"活动吗？此操作不可恢复。`,
        confirmText: '删除',
        confirmColor: '#ff3b30',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '删除中...' })
              await uniCloud.callFunction({
                name: 'deleteActivityItem',
                data: { id: this.activityItems[index]._id }
              })
              this.activityItems.splice(index, 1)
              uni.hideLoading()
              uni.showToast({ 
                title: '删除成功', 
                icon: 'success',
                duration: 2000
              })
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ 
                title: '删除失败: ' + (error.message || '未知错误'), 
                icon: 'none',
                duration: 3000
              })
              console.error('删除活动失败:', error)
            }
          }
        }
      })
    },
    async saveActivityItem() {
      if (!this.currentActivityItem.name) {
        uni.showToast({ title: '请输入活动名称', icon: 'none' })
        return
      }
      if (!this.currentActivityItem.startTime) {
        uni.showToast({ title: '请选择开始时间', icon: 'none' })
        return
      }
      if (!this.currentActivityItem.endTime) {
        uni.showToast({ title: '请选择结束时间', icon: 'none' })
        return
      }
      if (!this.currentActivityItem.price) {
        uni.showToast({ title: '请输入活动费用', icon: 'none' })
        return
      }
      
      try {
        this.loading = true
        console.log('保存活动数据:', this.currentActivityItem)
        
        if (this.isEdit) {
          console.log('更新活动，ID:', this.activityItems[this.editIndex]._id)
          const updateResult = await uniCloud.callFunction({
            name: 'updateActivityItem',
            data: { id: this.activityItems[this.editIndex]._id, item: this.currentActivityItem }
          })
          console.log('更新结果:', updateResult)
          this.activityItems[this.editIndex] = { ...this.currentActivityItem }
        } else {
          console.log('添加新活动')
          const result = await uniCloud.callFunction({
            name: 'addActivityItem',
            data: { item: this.currentActivityItem }
          })
          console.log('添加结果:', result)
          if (result.result && result.result.data) {
            this.activityItems.push(result.result.data)
          } else {
            throw new Error('添加失败：返回数据格式错误')
          }
        }
        this.closePopup()
        uni.showToast({ title: this.isEdit ? '更新成功' : '添加成功', icon: 'success' })
      } catch (error) {
        console.error('保存活动失败:', error)
        uni.showToast({ 
          title: '保存失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.loading = false
      }
    },
    closePopup() {
      console.log('关闭弹窗')
      this.showActivityPopup = false
      this.currentActivityItem = { 
        name: '', 
        description: '', 
        startTime: '', 
        endTime: '', 
        price: '', 
        maxParticipants: '',
        needShipping: false,
        status: '启用'
      }
    },
    async toggleActivityItemStatus(item, e) {
      const newStatus = e.detail.value ? '启用' : '禁用'
      const oldStatus = item.status
      
      try {
        console.log('切换活动状态:', item._id, oldStatus, '->', newStatus)
        
        if (!item._id) {
          throw new Error('活动ID不存在')
        }
        
        item.status = newStatus
        
        const result = await uniCloud.callFunction({ 
          name: 'updateActivityItem', 
          data: { 
            id: item._id, 
            item: { status: newStatus } 
          } 
        })
        
        console.log('状态更新结果:', result)
        
        uni.showToast({ 
          title: `${newStatus}成功`, 
          icon: 'success',
          duration: 1500
        })
      } catch (error) {
        item.status = oldStatus
        console.error('状态更新失败:', error)
        uni.showToast({ 
          title: '状态更新失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.page-desc {
  font-size: 28rpx;
  opacity: 0.9;
  display: block;
}

.header-actions {
  display: flex;
  gap: 20rpx;
}

.add-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  color: white;
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 28rpx;
}

.btn-icon {
  font-size: 32rpx;
}

.stats-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #007aff;
  display: block;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.activity-list {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.list-header {
  margin-bottom: 30rpx;
}

.list-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.list-subtitle {
  font-size: 24rpx;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 30rpx;
}

.empty-btn {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.activity-item {
  background: #f8f9fa;
  border-radius: 20rpx;
  padding: 30rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.activity-disabled {
  opacity: 0.6;
  background: #f1f3f4;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.activity-price {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: bold;
}

.activity-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.activity-time, .activity-limit {
  font-size: 24rpx;
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  align-self: flex-start;
}

.activity-category {
  font-size: 24rpx;
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  align-self: flex-start;
}

.activity-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.action-group {
  display: flex;
  gap: 20rpx;
}

.edit-btn, .delete-btn {
  border: none;
  border-radius: 10rpx;
  padding: 15rpx 25rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.edit-btn {
  background: #007aff;
  color: white;
}

.delete-btn {
  background: #ff3b30;
  color: white;
}

.action-icon {
  font-size: 24rpx;
}

.toggle-group {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.toggle-label {
  font-size: 24rpx;
  color: #666;
}

.popup-content {
  background: white;
  border-radius: 20rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx;
  border-bottom: 2rpx solid #f0f0f0;
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
  padding: 0;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  padding: 40rpx;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 15rpx;
}

.form-input, .form-textarea {
  width: 100%;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  background: #fafafa;
  box-sizing: border-box;
}

.form-textarea {
  height: 120rpx;
  resize: none;
}

.form-picker {
  width: 100%;
}

.picker-display {
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 20rpx;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.picker-arrow {
  color: #999;
  font-size: 24rpx;
}

.form-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
}

.popup-buttons {
  display: flex;
  gap: 20rpx;
  padding: 40rpx;
  border-top: 2rpx solid #f0f0f0;
}

.popup-btn {
  flex: 1;
  border-radius: 10rpx;
  padding: 25rpx;
  font-size: 28rpx;
  border: none;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.primary-btn {
  background: #007aff;
  color: white;
}

.primary-btn:disabled {
  background: #ccc;
  color: #999;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  border-radius: 20rpx;
  padding: 60rpx;
  text-align: center;
}

.loading-icon {
  font-size: 60rpx;
  display: block;
  margin-bottom: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}
</style> 