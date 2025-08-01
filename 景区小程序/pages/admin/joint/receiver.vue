<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会收件信息管理</text>
      <text class="page-desc">管理合坛法会收件信息模块配置</text>
    </view>
    
    <!-- 模块开关 -->
    <view class="module-switch">
      <view class="switch-item">
        <text class="switch-label">收件信息模块</text>
        <switch :checked="moduleEnabled" @change="onModuleToggle" color="#667eea" />
        <text class="switch-desc">{{ moduleEnabled ? '已启用' : '已禁用' }}</text>
      </view>
      <text class="switch-tip">启用后前台将显示收件信息填写功能</text>
    </view>
    
    <!-- 模块启用时的配置 -->
    <view v-if="moduleEnabled" class="config-section">
      <view class="config-card">
        <view class="config-header">
          <text class="config-title">收件信息配置</text>
        </view>
        
        <view class="config-content">
          <view class="config-item">
            <text class="config-label">收件人姓名</text>
            <switch :checked="config.nameRequired" @change="onNameRequiredChange" color="#667eea" />
            <text class="config-desc">{{ config.nameRequired ? '必填' : '选填' }}</text>
          </view>
          
          <view class="config-item">
            <text class="config-label">收件人电话</text>
            <switch :checked="config.phoneRequired" @change="onPhoneRequiredChange" color="#667eea" />
            <text class="config-desc">{{ config.phoneRequired ? '必填' : '选填' }}</text>
          </view>
          
          <view class="config-item">
            <text class="config-label">收件地址</text>
            <switch :checked="config.addressRequired" @change="onAddressRequiredChange" color="#667eea" />
            <text class="config-desc">{{ config.addressRequired ? '必填' : '选填' }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 模块禁用提示 -->
    <view v-else class="module-disabled">
      <view class="disabled-content">
        <text class="disabled-icon">📦</text>
        <text class="disabled-title">收件信息模块已禁用</text>
        <text class="disabled-desc">启用后可在前台显示收件信息填写功能</text>
      </view>
    </view>
    
    <!-- 收件人列表 -->
    <view v-if="moduleEnabled" class="receiver-section">
      <view class="section-header">
        <text class="section-title">收件人信息列表</text>
        <text class="section-desc">查看用户提交的收件信息</text>
      </view>
      
      <view class="receiver-list">
        <view v-for="receiver in receivers" :key="receiver._id" class="receiver-card">
          <view class="receiver-info">
            <view class="receiver-header">
              <text class="receiver-name">{{ receiver.name }}</text>
              <text class="receiver-time">{{ formatTime(receiver.createTime) }}</text>
            </view>
            
            <view class="receiver-details">
              <view class="detail-item">
                <text class="detail-label">电话：</text>
                <text class="detail-value">{{ receiver.phone }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">地址：</text>
                <text class="detail-value">{{ receiver.address }}</text>
              </view>
            </view>
            
            <view class="receiver-actions">
              <button class="action-btn copy" @click="copyReceiverInfo(receiver)">复制信息</button>
              <button class="action-btn delete" @click="deleteReceiver(receiver._id)">删除</button>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="receivers.length === 0" class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-title">暂无收件信息</text>
        <text class="empty-desc">用户提交收件信息后将显示在这里</text>
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
      moduleEnabled: false,
      config: {
        nameRequired: true,
        phoneRequired: true,
        addressRequired: true
      },
      receivers: []
    }
  },
  
  onLoad() {
    this.getConfig()
    this.getList()
  },
  
  methods: {
    async getConfig() {
      try {
        const result = await jointManagement.getReceiverConfig()
        if (result.success && result.data) {
          this.moduleEnabled = result.data.enabled || false
          this.config = {
            nameRequired: result.data.nameRequired !== false,
            phoneRequired: result.data.phoneRequired !== false,
            addressRequired: result.data.addressRequired !== false
          }
        }
      } catch (error) {
        console.error('获取合坛法会收件信息配置失败:', error)
        uni.showToast({ title: '加载配置失败', icon: 'none' })
      }
    },
    
    async onModuleToggle(e) {
      try {
        const result = await jointManagement.updateReceiverConfig({ 
          enabled: e.detail.value,
          nameRequired: this.config.nameRequired,
          phoneRequired: this.config.phoneRequired,
          addressRequired: this.config.addressRequired
        })
        if (result.success) {
          this.moduleEnabled = e.detail.value
          uni.showToast({ title: e.detail.value ? '模块已启用' : '模块已禁用', icon: 'success' })
        } else {
          uni.showToast({ title: result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('更新模块状态失败:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    async onNameRequiredChange(e) {
      this.config.nameRequired = e.detail.value
      await this.saveConfig()
    },
    
    async onPhoneRequiredChange(e) {
      this.config.phoneRequired = e.detail.value
      await this.saveConfig()
    },
    
    async onAddressRequiredChange(e) {
      this.config.addressRequired = e.detail.value
      await this.saveConfig()
    },
    
    async saveConfig() {
      try {
        const result = await jointManagement.updateReceiverConfig({ 
          enabled: this.moduleEnabled,
          nameRequired: this.config.nameRequired,
          phoneRequired: this.config.phoneRequired,
          addressRequired: this.config.addressRequired
        })
        if (result.success) {
          uni.showToast({ title: '配置已保存', icon: 'success' })
        } else {
          uni.showToast({ title: result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('保存配置失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    
    async getList() {
      try {
        const result = await jointManagement.getReceivers()
        if (result.success) {
          this.receivers = result.data || []
        } else {
          uni.showToast({ title: result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('获取合坛法会收件信息列表失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    copyReceiverInfo(receiver) {
      const info = `收件人：${receiver.name}\n电话：${receiver.phone}\n地址：${receiver.address}`
      uni.setClipboardData({
        data: info,
        success: () => {
          uni.showToast({ title: '信息已复制' })
        }
      })
    },
    
    async deleteReceiver(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个收件信息吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await jointManagement.deleteReceiver({ _id: id })
              await this.getList()
              uni.showToast({ title: '删除成功' })
            } catch (error) {
              console.error('删除收件信息失败:', error)
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
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

.module-switch {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 15rpx;
}

.switch-label {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.switch-desc {
  font-size: 26rpx;
  color: #666;
}

.switch-tip {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.config-section {
  margin-bottom: 20rpx;
}

.config-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.config-header {
  margin-bottom: 20rpx;
}

.config-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.config-label {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.config-desc {
  font-size: 26rpx;
  color: #666;
  min-width: 80rpx;
  text-align: right;
}

.module-disabled {
  background: #fff;
  border-radius: 12rpx;
  padding: 60rpx 30rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.disabled-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.disabled-icon {
  font-size: 80rpx;
}

.disabled-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.disabled-desc {
  font-size: 26rpx;
  color: #666;
}

.receiver-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.section-desc {
  font-size: 26rpx;
  color: #666;
}

.receiver-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.receiver-card {
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
}

.receiver-info {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.receiver-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.receiver-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.receiver-time {
  font-size: 24rpx;
  color: #999;
}

.receiver-details {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-label {
  font-size: 26rpx;
  color: #999;
  min-width: 100rpx;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.receiver-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 15rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  border: none;
}

.action-btn.copy {
  background: #667eea;
  color: #fff;
}

.action-btn.delete {
  background: #ff4757;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 60rpx 30rpx;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #666;
}
</style> 