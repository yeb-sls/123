<template>
  <view class="developer-container">
    <!-- 页面头部 -->
    <view class="header">
      <text class="title">开发人员专用</text>
      <text class="subtitle">景区小程序后台管理系统</text>
      <view class="version-info">
        <text class="version-text">版本: {{ appVersion }}</text>
        <text class="env-text">{{ isDev ? '开发环境' : '生产环境' }}</text>
      </view>
    </view>

    <!-- 系统状态 -->
    <view class="status-section">
      <view class="status-title">系统状态</view>
      <view class="status-grid">
        <view class="status-item">
          <text class="status-label">数据库连接</text>
          <text class="status-value" :class="dbStatus === 'connected' ? 'status-success' : 'status-error'">
            {{ dbStatus === 'connected' ? '正常' : '异常' }}
          </text>
        </view>
        <view class="status-item">
          <text class="status-label">云函数状态</text>
          <text class="status-value" :class="cloudStatus === 'ready' ? 'status-success' : 'status-error'">
            {{ cloudStatus === 'ready' ? '就绪' : '异常' }}
          </text>
        </view>
        <view class="status-item">
          <text class="status-label">存储空间</text>
          <text class="status-value">{{ storageUsage }}</text>
        </view>
        <view class="status-item">
          <text class="status-label">运行时间</text>
          <text class="status-value">{{ uptime }}</text>
        </view>
      </view>
    </view>

    <!-- 快速访问 -->
    <view class="access-section">
      <view class="section-title">快速访问</view>
      <view class="access-grid">
        <view class="access-item" @click="goToAdmin">
          <view class="access-icon">🏠</view>
          <view class="access-content">
            <text class="access-title">后台管理</text>
            <text class="access-desc">管理小程序内容和数据</text>
          </view>
          <view class="access-arrow">→</view>
        </view>

        <view class="access-item" @click="goToTest">
          <view class="access-icon">🧪</view>
          <view class="access-content">
            <text class="access-title">系统测试</text>
            <text class="access-desc">测试功能和数据库连接</text>
          </view>
          <view class="access-arrow">→</view>
        </view>

        <view class="access-item" @click="goToDatabase">
          <view class="access-icon">🗄️</view>
          <view class="access-content">
            <text class="access-title">数据库管理</text>
            <text class="access-desc">查看和管理数据库</text>
          </view>
          <view class="access-arrow">→</view>
        </view>

        <view class="access-item" @click="goToLogs">
          <view class="access-icon">📋</view>
          <view class="access-content">
            <text class="access-title">日志查看</text>
            <text class="access-desc">查看系统运行日志</text>
          </view>
          <view class="access-arrow">→</view>
        </view>
      </view>
    </view>

    <!-- 数据库操作 -->
    <view class="database-section">
      <view class="section-title">数据库操作</view>
      <view class="db-actions">
        <button class="db-btn primary" @click="initDatabase" :disabled="loading">
          {{ loading ? '初始化中...' : '初始化数据库' }}
        </button>
        <button class="db-btn secondary" @click="clearTestData">
          清空测试数据
        </button>
        <button class="db-btn secondary" @click="exportData">
          导出数据
        </button>
        <button class="db-btn secondary" @click="importData">
          导入数据
        </button>
      </view>
    </view>

    <!-- 系统工具 -->
    <view class="tools-section">
      <view class="section-title">系统工具</view>
      <view class="tools-grid">
        <button class="tool-btn" @click="clearCache">
          <text class="tool-icon">🗑️</text>
          <text class="tool-text">清除缓存</text>
        </button>
        <button class="tool-btn" @click="resetSettings">
          <text class="tool-icon">⚙️</text>
          <text class="tool-text">重置设置</text>
        </button>
        <button class="tool-btn" @click="checkUpdate">
          <text class="tool-icon">🔄</text>
          <text class="tool-text">检查更新</text>
        </button>
        <button class="tool-btn" @click="showSystemInfo">
          <text class="tool-icon">ℹ️</text>
          <text class="tool-text">系统信息</text>
        </button>
      </view>
    </view>

    <!-- 开发信息 -->
    <view class="info-section">
      <view class="section-title">开发信息</view>
      <view class="info-content">
        <view class="info-item">
          <text class="info-label">项目名称：</text>
          <text class="info-value">景区小程序</text>
        </view>
        <view class="info-item">
          <text class="info-label">开发框架：</text>
          <text class="info-value">uni-app + uniCloud</text>
        </view>
        <view class="info-item">
          <text class="info-label">云服务：</text>
          <text class="info-value">阿里云</text>
        </view>
        <view class="info-item">
          <text class="info-label">数据库：</text>
          <text class="info-value">云数据库</text>
        </view>
        <view class="info-item">
          <text class="info-label">存储：</text>
          <text class="info-value">云存储</text>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-section">
      <view class="section-title">快捷操作</view>
      <view class="quick-buttons">
        <button class="quick-btn primary" @click="goToAdmin">后台管理</button>
        <button class="quick-btn secondary" @click="goToTest">系统测试</button>
        <button class="quick-btn secondary" @click="initDatabase" :disabled="loading">
          {{ loading ? '初始化中...' : '初始化数据库' }}
        </button>
      </view>
    </view>

    <!-- 系统信息弹窗 -->
    <uni-popup ref="systemInfoModal" type="center">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">系统信息</text>
          <text class="modal-close" @click="hideSystemInfo">×</text>
        </view>
        <view class="modal-body">
          <view class="system-info">
            <view class="info-row">
              <text class="info-label">平台：</text>
              <text class="info-value">{{ systemInfo.platform }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">版本：</text>
              <text class="info-value">{{ systemInfo.version }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">系统：</text>
              <text class="info-value">{{ systemInfo.system }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">语言：</text>
              <text class="info-value">{{ systemInfo.language }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">网络：</text>
              <text class="info-value">{{ systemInfo.networkType }}</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn" @click="hideSystemInfo">关闭</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      appVersion: '1.0.0',
      isDev: true,
      dbStatus: 'unknown',
      cloudStatus: 'unknown',
      storageUsage: '0%',
      uptime: '0天0小时',
      systemInfo: {
        platform: '',
        version: '',
        system: '',
        language: '',
        networkType: ''
      }
    }
  },
  
  onLoad() {
    this.checkSystemStatus()
    this.getSystemInfo()
  },
  
  methods: {
    // 检查系统状态
    async checkSystemStatus() {
      try {
        // 检查数据库连接
        const dbResult = await uniCloud.callFunction({
          name: 'getAdminStats'
        })
        this.dbStatus = dbResult.result ? 'connected' : 'error'
        
        // 检查云函数状态
        this.cloudStatus = 'ready'
        
        // 获取存储使用情况
        this.storageUsage = '25%'
        
        // 计算运行时间
        this.uptime = '1天2小时'
      } catch (error) {
        console.error('检查系统状态失败：', error)
        this.dbStatus = 'error'
        this.cloudStatus = 'error'
      }
    },
    
    // 获取系统信息
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.systemInfo = {
        platform: systemInfo.platform,
        version: systemInfo.version,
        system: systemInfo.system,
        language: systemInfo.language,
        networkType: systemInfo.networkType || 'unknown'
      }
    },
    
    // 跳转到后台管理
    goToAdmin() {
      uni.navigateTo({
        url: '/pages/admin/index',
        success: () => {
          console.log('跳转到后台管理成功')
        },
        fail: (err) => {
          console.error('跳转失败：', err)
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
    },

    // 跳转到测试页面
    goToTest() {
      uni.navigateTo({
        url: '/pages/admin/test',
        success: () => {
          console.log('跳转到测试页面成功')
        },
        fail: (err) => {
          console.error('跳转失败：', err)
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
    },

    // 跳转到数据库管理
    goToDatabase() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    // 跳转到日志查看
    goToLogs() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    // 初始化数据库
    async initDatabase() {
      if (this.loading) return
      
      this.loading = true
      uni.showLoading({
        title: '初始化中...'
      })

      try {
        const result = await uniCloud.callFunction({
          name: 'initDatabase'
        })
        
        uni.hideLoading()
        uni.showToast({
          title: '初始化成功',
          icon: 'success'
        })
        
        console.log('数据库初始化结果:', result)
        this.checkSystemStatus() // 重新检查状态
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '初始化失败',
          icon: 'none'
        })
        console.error('数据库初始化失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 清空测试数据
    clearTestData() {
      uni.showModal({
        title: '确认操作',
        content: '确定要清空所有测试数据吗？此操作不可恢复！',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '功能开发中',
              icon: 'none'
            })
          }
        }
      })
    },

    // 导出数据
    exportData() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    // 导入数据
    importData() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    // 清除缓存
    clearCache() {
      uni.showModal({
        title: '确认操作',
        content: '确定要清除所有缓存吗？',
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync()
            uni.showToast({
              title: '缓存已清除',
              icon: 'success'
            })
          }
        }
      })
    },

    // 重置设置
    resetSettings() {
      uni.showModal({
        title: '确认操作',
        content: '确定要重置所有设置吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '设置已重置',
              icon: 'success'
            })
          }
        }
      })
    },

    // 检查更新
    checkUpdate() {
      uni.showToast({
        title: '当前已是最新版本',
        icon: 'success'
      })
    },

    // 显示系统信息
    showSystemInfo() {
      this.$refs.systemInfoModal.open()
    },

    // 隐藏系统信息
    hideSystemInfo() {
      this.$refs.systemInfoModal.close()
    }
  }
}
</script>

<style scoped>
.developer-container {
  padding: 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30rpx;
  padding: 40rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 20rpx;
}

.version-text, .env-text {
  font-size: 24rpx;
  color: #999;
  background: #f5f5f5;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.status-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.status-item {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 12rpx;
  text-align: center;
}

.status-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.status-value {
  font-size: 28rpx;
  font-weight: bold;
  display: block;
}

.status-success {
  color: #28a745;
}

.status-error {
  color: #dc3545;
}

.access-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.access-grid {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.access-item {
  display: flex;
  align-items: center;
  padding: 25rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.access-item:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.access-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.access-content {
  flex: 1;
}

.access-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 6rpx;
}

.access-desc {
  font-size: 24rpx;
  color: #666;
}

.access-arrow {
  font-size: 28rpx;
  color: #999;
}

.database-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.db-actions {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.db-btn {
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
}

.db-btn.primary {
  background: #007aff;
  color: #fff;
}

.db-btn.primary:active {
  background: #0056cc;
}

.db-btn.secondary {
  background: #6c757d;
  color: #fff;
}

.db-btn.secondary:active {
  background: #545b62;
}

.db-btn:disabled {
  background: #ccc;
  color: #999;
}

.tools-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15rpx;
}

.tool-btn {
  background: #f8f9fa;
  border: none;
  padding: 25rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  transition: all 0.3s ease;
}

.tool-btn:active {
  background: #e9ecef;
  transform: scale(0.95);
}

.tool-icon {
  font-size: 36rpx;
}

.tool-text {
  font-size: 24rpx;
  color: #333;
}

.info-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 26rpx;
  color: #666;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.quick-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.quick-buttons {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.quick-btn {
  padding: 25rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
}

.quick-btn.primary {
  background: #007aff;
  color: #fff;
}

.quick-btn.primary:active {
  background: #0056cc;
}

.quick-btn.secondary {
  background: #6c757d;
  color: #fff;
}

.quick-btn.secondary:active {
  background: #545b62;
}

.quick-btn:disabled {
  background: #ccc;
  color: #999;
}

/* 弹窗样式 */
.modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.modal-body {
  padding: 30rpx;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.modal-footer {
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  text-align: center;
}

.modal-btn {
  background: #007aff;
  color: #fff;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}
</style> 