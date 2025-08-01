<template>
  <view class="admin-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <text class="page-title">功德布施配置管理</text>
          <text class="page-desc">管理功德布施项目和配置</text>
        </view>
        <view class="header-actions">
          <button class="add-btn" @click="showAddModal">
            <text class="btn-icon">➕</text>
            <text>添加布施项目</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-number">{{ gongdeItems.length }}</text>
        <text class="stat-label">总布施项目</text>
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

    <!-- 布施项目列表 -->
    <view class="gongde-list">
      <view class="list-header">
        <text class="list-title">💰 功德布施项目列表</text>
        <text class="list-subtitle">共 {{ gongdeItems.length }} 个项目</text>
      </view>
      
      <!-- 空状态 -->
      <view v-if="gongdeItems.length === 0" class="empty-state">
        <text class="empty-icon">💰</text>
        <text class="empty-title">暂无布施项目</text>
        <text class="empty-desc">点击上方"添加布施项目"按钮开始创建</text>
        <button class="empty-btn" @click="showAddModal">添加第一个项目</button>
      </view>

      <!-- 布施项目列表 -->
      <view v-else class="gongde-items">
        <view 
          v-for="(item, index) in gongdeItems" 
          :key="item._id" 
          class="gongde-item"
          :class="{ 'gongde-disabled': item.status !== '启用' }"
        >
          <!-- 布施项目信息 -->
          <view class="gongde-info">
            <view class="info-header">
              <text class="gongde-title">{{ item.name || '未设置名称' }}</text>
              <text class="gongde-type">{{ item.type === 'money' ? '善款捐赠' : '实物捐赠' }}</text>
            </view>
            <text class="gongde-desc">{{ item.description || '未设置描述' }}</text>
            <text class="gongde-category">类型：{{ item.type === 'money' ? '善款捐赠' : '实物捐赠' }}</text>
            
            <!-- 操作按钮 -->
            <view class="gongde-actions">
              <view class="action-group">
                <button class="edit-btn" @click="editGongdeItem(index)">
                  <text class="action-icon">✏️</text>
                  <text>编辑</text>
                </button>
                <button class="delete-btn" @click="deleteGongdeItem(index)">
                  <text class="action-icon">🗑️</text>
                  <text>删除</text>
                </button>
              </view>
              
              <view class="toggle-group">
                <text class="toggle-label">状态</text>
                <switch 
                  :checked="item.status === '启用'" 
                  @change="toggleGongdeItemStatus(item, $event)"
                  color="#007aff"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加/编辑弹窗 -->
    <uni-popup :show="showGongdePopup" type="center" @close="closePopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑布施项目' : '添加布施项目' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        
        <view class="form-container">
          <view class="form-group">
            <text class="form-label">项目名称 *</text>
            <input 
              v-model="currentGongdeItem.name" 
              placeholder="请输入布施项目名称" 
              class="form-input" 
              maxlength="50"
            />
            <text class="form-tip">{{ currentGongdeItem.name.length }}/50</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">项目类型 *</text>
            <picker 
              :value="typeIndex" 
              :range="typeOptions" 
              @change="onTypeChange"
              class="form-picker"
            >
              <view class="picker-display">
                <text>{{ typeOptions[typeIndex] }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">项目描述</text>
            <textarea 
              v-model="currentGongdeItem.description" 
              placeholder="请输入项目描述" 
              class="form-textarea"
              maxlength="200"
            />
            <text class="form-tip">{{ currentGongdeItem.description.length }}/200</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">功德值倍数</text>
            <input 
              v-model="currentGongdeItem.meritMultiplier" 
              placeholder="请输入功德值倍数" 
              class="form-input" 
              type="number"
            />
            <text class="form-tip">每100元对应的功德值倍数（默认2）</text>
          </view>
        </view>
        
        <view class="popup-buttons">
          <button class="popup-btn cancel-btn" @click="closePopup">取消</button>
          <button class="popup-btn primary-btn" @click="saveGongdeItem" :disabled="loading">
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

// 导入云对象
const commonManagement = uniCloud.importObject('common-management')

export default {
  components: { uniPopup },
  data() {
    return {
      gongdeItems: [],
      currentGongdeItem: {
        name: '',
        type: 'money',
        description: '',
        meritMultiplier: 2,
        status: '启用'
      },
      typeOptions: ['善款捐赠', '实物捐赠'],
      typeIndex: 0,
      isEdit: false,
      editIndex: -1,
      loading: false,
      showGongdePopup: false
    }
  },
  computed: {
    enabledCount() {
      return this.gongdeItems.filter(item => item.status === '启用').length
    },
    disabledCount() {
      return this.gongdeItems.filter(item => item.status !== '启用').length
    }
  },
  onLoad() {
    this.loadGongdeItems()
  },
  methods: {
    async loadGongdeItems() {
      try {
        this.loading = true
        console.log('开始加载功德布施数据...')
        
        const result = await commonManagement.getGongdeConfig()
        console.log('功德布施数据加载结果:', result)
        
        if (result.success && result.data) {
          this.gongdeItems = result.data
          console.log('功德布施数据加载成功，共', this.gongdeItems.length, '条')
        } else {
          this.gongdeItems = []
          console.log('功德布施数据为空')
        }
      } catch (error) {
        console.error('加载功德布施失败:', error)
        uni.showToast({ 
          title: '加载失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
        this.gongdeItems = []
      } finally {
        this.loading = false
      }
    },
    showAddModal() {
      console.log('打开添加布施项目弹窗')
      this.isEdit = false
      this.editIndex = -1
      this.currentGongdeItem = { 
        name: '', 
        type: 'money', 
        description: '', 
        meritMultiplier: 2,
        status: '启用'
      }
      this.typeIndex = 0
      this.showGongdePopup = true
    },
    editGongdeItem(index) {
      this.isEdit = true
      this.editIndex = index
      this.currentGongdeItem = { ...this.gongdeItems[index] }
      this.typeIndex = this.currentGongdeItem.type === 'money' ? 0 : 1
      this.showGongdePopup = true
    },
    onTypeChange(e) {
      this.typeIndex = e.detail.value
      this.currentGongdeItem.type = this.typeIndex === 0 ? 'money' : 'goods'
    },
    async deleteGongdeItem(index) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除"${this.gongdeItems[index].name || '未命名'}"布施项目吗？此操作不可恢复。`,
        confirmText: '删除',
        confirmColor: '#ff3b30',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '删除中...' })
              const result = await commonManagement.deleteGongdeItem({ _id: this.gongdeItems[index]._id })
              if (!result.success) {
                throw new Error(result.message || '删除失败')
              }
              this.gongdeItems.splice(index, 1)
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
              console.error('删除布施项目失败:', error)
            }
          }
        }
      })
    },
    async saveGongdeItem() {
      if (!this.currentGongdeItem.name) {
        uni.showToast({ title: '请输入项目名称', icon: 'none' })
        return
      }
      
      try {
        this.loading = true
        console.log('保存功德布施数据:', this.currentGongdeItem)
        
        if (this.isEdit) {
          console.log('更新布施项目，ID:', this.gongdeItems[this.editIndex]._id)
          const updateResult = await commonManagement.updateGongdeConfig({
            _id: this.gongdeItems[this.editIndex]._id,
            ...this.currentGongdeItem
          })
          console.log('更新结果:', updateResult)
          if (!updateResult.success) {
            throw new Error(updateResult.message || '更新失败')
          }
          this.gongdeItems[this.editIndex] = { ...this.currentGongdeItem }
        } else {
          console.log('添加新布施项目')
          const result = await commonManagement.addGongdeItem({ item: this.currentGongdeItem })
          console.log('添加结果:', result)
          if (result.success && result.data) {
            this.gongdeItems.push(result.data)
          } else {
            throw new Error(result.message || '添加失败：返回数据格式错误')
          }
        }
        this.closePopup()
        uni.showToast({ title: this.isEdit ? '更新成功' : '添加成功', icon: 'success' })
      } catch (error) {
        console.error('保存布施项目失败:', error)
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
      this.showGongdePopup = false
      this.currentGongdeItem = { 
        name: '', 
        type: 'money', 
        description: '', 
        meritMultiplier: 2,
        status: '启用'
      }
      this.typeIndex = 0
    },
    async toggleGongdeItemStatus(item, e) {
      const newStatus = e.detail.value ? '启用' : '禁用'
      const oldStatus = item.status
      
      try {
        console.log('切换布施项目状态:', item._id, oldStatus, '->', newStatus)
        
        if (!item._id) {
          throw new Error('布施项目ID不存在')
        }
        
        item.status = newStatus
        
        const result = await commonManagement.updateGongdeConfig({ 
          _id: item._id, 
          status: newStatus 
        })
        if (!result.success) {
          throw new Error(result.message || '状态更新失败')
        }
        
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

.gongde-list {
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

.gongde-items {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.gongde-item {
  background: #f8f9fa;
  border-radius: 20rpx;
  padding: 30rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.gongde-disabled {
  opacity: 0.6;
  background: #f1f3f4;
}

.gongde-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gongde-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.gongde-type {
  font-size: 24rpx;
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.gongde-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.gongde-category {
  font-size: 24rpx;
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  align-self: flex-start;
}

.gongde-actions {
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