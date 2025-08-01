<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">代办物品总览</text>
      <text class="page-desc">查看和管理所有项目的代办物品</text>
    </view>
    
    <!-- 模块开关 -->
    <view class="module-switch">
      <view class="switch-item">
        <text class="switch-label">代办物品模块</text>
        <switch :checked="moduleEnabled" @change="onModuleToggle" color="#667eea" />
        <text class="switch-desc">{{ moduleEnabled ? '已启用' : '已禁用' }}</text>
      </view>
      <text class="switch-tip">启用后前台将显示代办物品选择功能</text>
    </view>

    <!-- 统计信息 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stats-item">
          <text class="stats-number">{{ totalProjects }}</text>
          <text class="stats-label">项目总数</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{ totalGoods }}</text>
          <text class="stats-label">物品总数</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{ projectsWithGoods }}</text>
          <text class="stats-label">有物品项目</text>
        </view>
      </view>
      
      <!-- 批量操作 -->
      <view class="batch-actions">
        <button class="batch-btn" @click="showBatchAddPopup">
          <text class="batch-icon">📦</text>
          <text>批量添加物品</text>
        </button>
        <button class="batch-btn" @click="exportGoodsData">
          <text class="batch-icon">📊</text>
          <text>导出物品数据</text>
        </button>
      </view>
    </view>

    <!-- 项目列表 -->
    <view class="projects-section">
      <view class="section-title">项目代办物品</view>
      
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
      
      <view v-else-if="projects.length === 0" class="empty-container">
        <text class="empty-text">暂无项目数据</text>
      </view>
      
      <view v-else class="projects-list">
        <view v-for="(project, index) in projects" :key="project._id" class="project-card">
          <view class="project-header">
            <view class="project-info">
              <text class="project-name">{{ project.name }}</text>
              <text class="project-category">{{ project.category }}</text>
            </view>
            <view class="project-actions">
              <button class="action-btn add" @click="addGoods(project._id, project.name)">添加物品</button>
              <button class="action-btn manage" @click="manageGoods(project._id, project.name)">管理物品</button>
            </view>
          </view>
          
          <view class="project-desc">{{ project.description }}</view>
          
          <!-- 代办物品列表 -->
          <view v-if="project.goods && project.goods.length > 0" class="goods-section">
            <view class="goods-header">
              <text class="goods-title">代办物品 ({{ project.goods.length }}项)</text>
            </view>
            <view class="goods-list">
              <view v-for="(item, itemIndex) in project.goods" :key="itemIndex" class="goods-item">
                <!-- 查看模式 -->
                <view v-if="!isEditing(project._id, itemIndex)" class="goods-info">
                  <view class="goods-main">
                    <text class="goods-name">{{ item.name }}</text>
                    <text class="goods-price">¥{{ item.price }}</text>
                  </view>
                  <view class="goods-details">
                    <text v-if="item.maxQuantity" class="goods-quantity">最大可选: {{ item.maxQuantity }}个</text>
                    <text v-if="item.description" class="goods-desc">{{ item.description }}</text>
                  </view>
                </view>
                
                <!-- 编辑模式 -->
                <view v-else class="goods-edit-form">
                  <view class="edit-form-row">
                    <view class="edit-form-group">
                      <text class="edit-label">物品名称</text>
                      <input v-model="editingGood.name" class="edit-input" placeholder="请输入物品名称" maxlength="30" />
                    </view>
                    <view class="edit-form-group">
                      <text class="edit-label">法金</text>
                      <input v-model.number="editingGood.price" type="number" class="edit-input" placeholder="请输入法金" min="0" step="0.01" />
                    </view>
                  </view>
                  <view class="edit-form-row">
                    <view class="edit-form-group">
                      <text class="edit-label">最大可选数量</text>
                      <input v-model.number="editingGood.maxQuantity" type="number" class="edit-input" placeholder="无限制" min="1" />
                    </view>
                    <view class="edit-form-group">
                      <text class="edit-label">描述</text>
                      <input v-model="editingGood.description" class="edit-input" placeholder="物品描述（可选）" maxlength="200" />
                    </view>
                  </view>
                </view>
                
                <view class="goods-actions">
                  <!-- 查看模式的操作按钮 -->
                  <view v-if="!isEditing(project._id, itemIndex)" class="view-actions">
                    <button class="goods-btn edit" @click="startEdit(project._id, itemIndex, item)">编辑</button>
                    <button class="goods-btn delete" @click="deleteGoods(project._id, project.name, itemIndex)">删除</button>
                  </view>
                  
                  <!-- 编辑模式的操作按钮 -->
                  <view v-else class="edit-actions">
                    <button class="goods-btn save" @click="saveEdit(project._id, itemIndex)">保存</button>
                    <button class="goods-btn cancel" @click="cancelEdit">取消</button>
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <view v-else class="no-goods">
            <text class="no-goods-text">暂无代办物品</text>
            <button class="add-goods-btn" @click="addGoods(project._id, project.name)">添加第一个物品</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 批量添加物品弹窗 -->
    <uni-popup :show="showBatchPopup" type="center" @close="closeBatchPopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">批量添加物品</text>
          <text class="popup-close" @click="closeBatchPopup">×</text>
        </view>
        
        <view class="popup-body">
          <view class="form-group">
            <text class="form-label">物品名称 *</text>
            <input v-model="batchGood.name" class="form-input" placeholder="请输入物品名称" maxlength="30" />
          </view>
          
          <view class="form-group">
            <text class="form-label">法金 (价格) *</text>
            <input v-model.number="batchGood.price" type="number" class="form-input" placeholder="请输入法金金额" min="0" step="0.01" />
          </view>
          
          <view class="form-group">
            <text class="form-label">最大可选数量</text>
            <input v-model.number="batchGood.maxQuantity" type="number" class="form-input" placeholder="请输入最大可选数量" min="1" />
          </view>
          
          <view class="form-group">
            <text class="form-label">物品描述</text>
            <textarea v-model="batchGood.description" class="form-textarea" placeholder="请输入物品描述（可选）" maxlength="200" />
          </view>
          
          <view class="form-group">
            <text class="form-label">选择项目</text>
            <view class="project-checkboxes">
              <view v-for="project in projects" :key="project._id" class="checkbox-item">
                <input type="checkbox" :id="project._id" v-model="batchGood.selectedProjects" :value="project._id" />
                <label :for="project._id">{{ project.name }}</label>
              </view>
            </view>
          </view>
        </view>
        
        <view class="popup-footer">
          <button class="popup-btn cancel" @click="closeBatchPopup">取消</button>
          <button class="popup-btn confirm" @click="saveBatchGoods">批量添加</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

// 导入云对象
const jointManagement = uniCloud.importObject('joint-management')

export default {
  components: { uniPopup },
  
  data() {
    return {
      loading: true,
      projects: [],
      moduleEnabled: false,
      showBatchPopup: false,
      batchGood: {
        name: '',
        price: '',
        maxQuantity: '',
        description: '',
        selectedProjects: []
      },
      // 内联编辑相关数据
      editingProjectId: '',
      editingItemIndex: -1,
      editingGood: {
        name: '',
        price: '',
        maxQuantity: '',
        description: ''
      }
    }
  },
  
  computed: {
    totalProjects() {
      return this.projects.length
    },
    
    totalGoods() {
      return this.projects.reduce((total, project) => {
        return total + (project.goods ? project.goods.length : 0)
      }, 0)
    },
    
    projectsWithGoods() {
      return this.projects.filter(project => project.goods && project.goods.length > 0).length
    }
  },
  
  onLoad() {
    this.loadModuleConfig()
    this.loadProjects()
  },
  
  onShow() {
    this.loadModuleConfig()
    this.loadProjects()
  },
  
  methods: {
    // 检查是否正在编辑指定项目
    isEditing(projectId, itemIndex) {
      return this.editingProjectId === projectId && this.editingItemIndex === itemIndex
    },
    
    // 开始编辑
    startEdit(projectId, itemIndex, item) {
      this.editingProjectId = projectId
      this.editingItemIndex = itemIndex
      this.editingGood = {
        name: item.name,
        price: item.price,
        maxQuantity: item.maxQuantity || '',
        description: item.description || ''
      }
    },
    
    // 取消编辑
    cancelEdit() {
      this.editingProjectId = ''
      this.editingItemIndex = -1
      this.editingGood = {
        name: '',
        price: '',
        maxQuantity: '',
        description: ''
      }
    },
    
    // 保存编辑
    async saveEdit(projectId, itemIndex) {
      if (!this.editingGood.name.trim()) {
        uni.showToast({
          title: '请输入物品名称',
          icon: 'none'
        })
        return
      }
      
      if (typeof this.editingGood.price !== 'number' || isNaN(this.editingGood.price) || this.editingGood.price < 0) {
        uni.showToast({
          title: '请输入有效的价格',
          icon: 'none'
        })
        return
      }
      
      try {
        const result = await jointManagement.updateGood({
          projectId: projectId,
          goodIndex: itemIndex,
          good: this.editingGood
        })
        
        if (result.success) {
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
          this.cancelEdit()
          this.loadProjects() // 重新加载数据
        } else {
          uni.showToast({
            title: result.message,
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('保存物品失败:', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    },
    
    async loadModuleConfig() {
      try {
        console.log('🔍 加载代办物品模块配置')
        const result = await jointManagement.getGoodsConfig()
        console.log('🔍 获取模块配置结果:', result)
        
        if (result.success && result.data) {
          this.moduleEnabled = result.data.enabled || false
          console.log('🔍 设置模块状态为:', this.moduleEnabled)
        } else {
          console.error('🔍 获取模块配置失败:', result.message)
          this.moduleEnabled = false
        }
      } catch (error) {
        console.error('🔍 加载代办物品模块配置异常:', error)
        this.moduleEnabled = false
      }
    },
    
    async onModuleToggle(e) {
      const value = e.detail.value
      console.log('🔍 代办物品模块开关变化，新值:', value)
      
      try {
        const result = await jointManagement.updateGoodsConfig({ 
          enabled: value
        })
        console.log('🔍 更新模块配置结果:', result)
        
        if (result.success) {
          this.moduleEnabled = value
          uni.showToast({ title: value ? '模块已启用' : '模块已禁用', icon: 'success' })
          console.log('🔍 模块状态更新成功:', this.moduleEnabled)
        } else {
          console.error('🔍 更新模块配置失败:', result.message)
          uni.showToast({ title: result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('🔍 更新模块状态异常:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    async loadProjects() {
      try {
        this.loading = true
        console.log('🔍 加载项目数据')
        const result = await jointManagement.getProjects()
        console.log('🔍 获取项目数据结果:', result)
        
        if (result.success && result.data) {
          this.projects = result.data
          console.log('🔍 项目数据:', this.projects)
          
          // 为每个项目单独获取物品数据
          for (let i = 0; i < this.projects.length; i++) {
            const project = this.projects[i]
            try {
              console.log(`🔍 为项目 ${project.name} 获取物品数据`)
              const goodsResult = await jointManagement.getGoods({ projectId: project._id })
              console.log(`🔍 项目 ${project.name} 的物品数据结果:`, goodsResult)
              
              if (goodsResult.success && goodsResult.data) {
                this.projects[i].goods = goodsResult.data
                console.log(`🔍 项目 ${project.name} 的物品列表:`, this.projects[i].goods)
              } else {
                this.projects[i].goods = []
                console.log(`🔍 项目 ${project.name} 没有物品数据`)
              }
            } catch (error) {
              console.error(`🔍 获取项目 ${project.name} 的物品数据失败:`, error)
              this.projects[i].goods = []
            }
          }
          
          console.log('🔍 最终项目数据:', this.projects)
        } else {
          console.error('🔍 获取项目数据失败:', result.message)
          this.projects = []
          uni.showToast({
            title: '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('🔍 加载项目数据异常:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
        this.projects = []
      } finally {
        this.loading = false
      }
    },
    
    addGoods(projectId, projectName) {
      // 跳转到专门的添加页面
      const url = `/pages/admin/joint/goods?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`
      uni.navigateTo({ url })
    },
    
    async deleteGoods(projectId, projectName, itemIndex) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除"${projectName}"项目中的这个物品吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await jointManagement.deleteGood({
                projectId: projectId,
                goodIndex: itemIndex
              })
              
              if (result.success) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                this.loadProjects() // 重新加载数据
              } else {
                uni.showToast({
                  title: result.message,
                  icon: 'none'
                })
              }
            } catch (error) {
              console.error('删除物品失败:', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    
    manageGoods(projectId, projectName) {
      const url = `/pages/admin/joint/goods?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`
      uni.navigateTo({ url })
    },
    
    showBatchAddPopup() {
      this.batchGood = {
        name: '',
        price: '',
        maxQuantity: '',
        description: '',
        selectedProjects: []
      }
      this.showBatchPopup = true
    },
    
    closeBatchPopup() {
      this.showBatchPopup = false
    },
    
    async saveBatchGoods() {
      if (!this.batchGood.name.trim()) {
        uni.showToast({
          title: '请输入物品名称',
          icon: 'none'
        })
        return
      }
      
      if (typeof this.batchGood.price !== 'number' || isNaN(this.batchGood.price) || this.batchGood.price < 0) {
        uni.showToast({
          title: '请输入有效的价格',
          icon: 'none'
        })
        return
      }
      
      if (this.batchGood.selectedProjects.length === 0) {
        uni.showToast({
          title: '请选择至少一个项目',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showLoading({ title: '批量添加中...' })
        
        let successCount = 0
        let failCount = 0
        
        for (const projectId of this.batchGood.selectedProjects) {
          try {
            const result = await jointManagement.addGood({
              projectId: projectId,
              good: {
                name: this.batchGood.name,
                price: this.batchGood.price,
                maxQuantity: this.batchGood.maxQuantity || undefined,
                description: this.batchGood.description || ''
              }
            })
            
            if (result.success) {
              successCount++
            } else {
              failCount++
            }
          } catch (error) {
            failCount++
          }
        }
        
        uni.hideLoading()
        
        if (failCount === 0) {
          uni.showToast({
            title: `成功添加 ${successCount} 个项目`,
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: `成功 ${successCount} 个，失败 ${failCount} 个`,
            icon: 'none'
          })
        }
        
        this.closeBatchPopup()
        this.loadProjects() // 重新加载数据
      } catch (error) {
        uni.hideLoading()
        console.error('批量添加物品失败:', error)
        uni.showToast({
          title: '批量添加失败',
          icon: 'none'
        })
      }
    },
    
    async exportGoodsData() {
      try {
        uni.showLoading({ title: '导出中...' })
        
        // 生成CSV数据
        let csvContent = '项目名称,物品名称,法金,最大可选数量,描述\n'
        
        for (const project of this.projects) {
          if (project.goods && project.goods.length > 0) {
            for (const good of project.goods) {
              csvContent += `"${project.name}","${good.name}",${good.price},${good.maxQuantity || '无限制'},"${good.description || ''}"\n`
            }
          }
        }
        
        // 创建下载链接
        const blob = new Blob(['\ufeff' + csvContent], { 
          type: 'text/csv;charset=utf-8;' 
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `代办物品数据_${new Date().toISOString().slice(0, 10)}.csv`
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        uni.hideLoading()
        uni.showToast({
          title: '导出成功',
          icon: 'success'
        })
      } catch (error) {
        uni.hideLoading()
        console.error('导出物品数据失败:', error)
        uni.showToast({
          title: '导出失败',
          icon: 'none'
        })
      }
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
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
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
  margin-top: 10rpx;
}

.stats-section {
  margin-bottom: 20rpx;
}

.stats-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.stats-item {
  text-align: center;
}

.stats-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #667eea;
  display: block;
  margin-bottom: 8rpx;
}

.stats-label {
  font-size: 24rpx;
  color: #666;
}

.batch-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.batch-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.batch-icon {
  font-size: 28rpx;
}

.projects-section {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.loading-container, .empty-container {
  background: #fff;
  border-radius: 12rpx;
  padding: 60rpx;
  text-align: center;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text, .empty-text {
  font-size: 28rpx;
  color: #666;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.project-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}

.project-category {
  font-size: 24rpx;
  color: #667eea;
  background: #f0f4ff;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.project-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  border: none;
}

.action-btn.add {
  background: #667eea;
  color: #fff;
}

.action-btn.manage {
  background: #f0f4ff;
  color: #667eea;
  border: 1rpx solid #667eea;
}

.project-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.goods-section {
  margin-top: 20rpx;
}

.goods-header {
  margin-bottom: 16rpx;
}

.goods-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.goods-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.goods-item:hover {
  border-color: #667eea;
}

.goods-info {
  flex: 1;
}

.goods-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.goods-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  flex: 1;
}

.goods-price {
  font-size: 24rpx;
  color: #667eea;
  font-weight: bold;
  margin-left: 16rpx;
}

.goods-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.goods-quantity {
  font-size: 22rpx;
  color: #ff9500;
  font-weight: bold;
}

.goods-desc {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
}

/* 编辑表单样式 */
.goods-edit-form {
  flex: 1;
  background: #fff;
  border-radius: 8rpx;
  padding: 16rpx;
  border: 2rpx solid #667eea;
}

.edit-form-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.edit-form-row:last-child {
  margin-bottom: 0;
}

.edit-form-group {
  flex: 1;
}

.edit-label {
  font-size: 22rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 6rpx;
}

.edit-input {
  width: 100%;
  padding: 12rpx;
  border: 1rpx solid #ddd;
  border-radius: 6rpx;
  font-size: 24rpx;
  box-sizing: border-box;
}

.edit-input:focus {
  border-color: #667eea;
  outline: none;
}

.goods-actions {
  display: flex;
  gap: 12rpx;
  margin-left: 16rpx;
}

.view-actions, .edit-actions {
  display: flex;
  gap: 12rpx;
}

.goods-btn {
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
  border: none;
  white-space: nowrap;
}

.goods-btn.edit {
  background: #fff;
  color: #667eea;
  border: 1rpx solid #667eea;
}

.goods-btn.delete {
  background: #fff;
  color: #ff4757;
  border: 1rpx solid #ff4757;
}

.goods-btn.save {
  background: #667eea;
  color: #fff;
}

.goods-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.no-goods {
  text-align: center;
  padding: 40rpx 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  margin-top: 20rpx;
}

.no-goods-text {
  font-size: 28rpx;
  color: #999;
  display: block;
  margin-bottom: 20rpx;
}

.add-goods-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 16rpx 32rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
}

/* 弹窗样式 */
.popup-content {
  background: #fff;
  border-radius: 12rpx;
  width: 600rpx;
  max-width: 90vw;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
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

.popup-body {
  padding: 30rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 12rpx;
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

.form-tip {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.popup-footer {
  display: flex;
  gap: 16rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.popup-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.popup-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.popup-btn.confirm {
  background: #667eea;
  color: #fff;
}

.project-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  max-height: 200rpx;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.checkbox-item input[type="checkbox"] {
  width: 24rpx;
  height: 24rpx;
}

.checkbox-item label {
  font-size: 26rpx;
  color: #333;
}
</style> 