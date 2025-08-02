<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会代办物品管理</text>
      <text class="page-desc">管理合坛法会代办物品及价格设置</text>
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
    
    <!-- 模块启用时的管理界面 -->
    <view v-if="moduleEnabled">
      <view class="page-actions">
        <button class="add-btn" @click="showAddModal">+ 新增物品</button>
      </view>
    
      <!-- 项目信息 -->
      <view class="project-info">
        <text class="project-title">当前项目：{{ projectName || '未知项目' }}</text>
        <text class="project-desc">管理该项目的代办物品</text>
      </view>
      
      <!-- 添加/编辑表单直接在页面显示 -->
      <view v-if="isEdit" class="good-edit-form">
        <view class="form-content">
          <view class="form-item">
            <text class="form-label">物品名称 *</text>
            <input v-model="currentGood.name" class="form-input" placeholder="请输入物品名称" />
          </view>
          <view class="form-item">
            <text class="form-label">物品描述</text>
            <textarea v-model="currentGood.description" class="form-textarea" placeholder="请输入物品描述" maxlength="200" />
          </view>
          <view class="form-item">
            <text class="form-label">法金价格 *</text>
            <input v-model="currentGood.price" type="number" class="form-input" placeholder="请输入法金价格" />
          </view>
          <view class="form-item">
            <text class="form-label">库存数量</text>
            <input v-model="currentGood.stock" type="number" class="form-input" placeholder="请输入库存数量（留空表示不限）" />
          </view>
          <view class="form-item">
            <text class="form-label">状态</text>
            <switch :checked="currentGood.enabled" @change="onGoodSwitchChange" color="#667eea" />
            <text class="switch-label">{{ currentGood.enabled ? '启用' : '禁用' }}</text>
          </view>
        </view>
        <view class="form-actions">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveGood">保存</button>
        </view>
      </view>
      <!-- 物品列表 -->
      <view v-if="!isEdit" class="goods-list">
        <view v-for="(good, index) in goods" :key="good._id || index" class="good-card">
          <view class="good-info">
            <view class="good-header">
              <text class="good-name">{{ good.name }}</text>
              <text class="good-price">¥{{ good.price }}</text>
            </view>
            <view class="good-desc">{{ good.description || '暂无描述' }}</view>
            <view class="good-details">
              <text class="detail-item">库存：{{ good.stock || '不限' }}</text>
              <text class="detail-item">状态：{{ good.enabled ? '启用' : '禁用' }}</text>
            </view>
          </view>
          <view class="good-actions">
            <button class="action-btn edit" @click="editGood(index)">编辑</button>
            <button class="action-btn delete" @click="deleteGood(index)">删除</button>
          </view>
        </view>
      </view>
      
      <!-- 无物品提示 -->
      <view v-if="!isEdit && goods.length === 0" class="no-goods">
        <view class="no-goods-content">
          <text class="no-goods-icon">📦</text>
          <text class="no-goods-title">暂无代办物品</text>
          <text class="no-goods-desc">点击上方"新增物品"按钮添加代办物品</text>
        </view>
      </view>
    </view>
    
    <!-- 模块禁用提示 -->
    <view v-else class="module-disabled">
      <view class="disabled-content">
        <text class="disabled-icon">📦</text>
        <text class="disabled-title">代办物品模块已禁用</text>
        <text class="disabled-desc">启用后可在前台显示代办物品选择功能</text>
      </view>
    </view>
    
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
      goods: [],
      isEdit: false,
      editIndex: -1,
      projectId: '',
      projectName: '',
      moduleEnabled: false,
      currentGood: {
        _id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        enabled: true
      }
    }
  },
  
  onLoad(options) {
    console.log('【调试-onLoad】接收到的 options =', options);
    this.projectId = options.projectId || '';
    this.projectName = options.projectName || '';
    console.log('【调试-onLoad】设置后的 projectId =', this.projectId);
    console.log('【调试-onLoad】设置后的 projectName =', this.projectName);
    if (!this.projectId) {
      uni.showToast({ title: '缺少项目ID，无法管理物品', icon: 'none' });
      // 可选：跳转回项目列表页
      return;
    }
    this.loadModuleConfig();
    this.loadGoodsConfig();
  },
  
  methods: {
    async loadModuleConfig() {
      try {
        const result = await jointManagement.getGoodsConfig()
        
        if (result.success && result.data) {
          this.moduleEnabled = result.data.enabled || false
        } else {
          this.moduleEnabled = false
        }
      } catch (error) {
        console.error('加载代办物品模块配置失败:', error)
        this.moduleEnabled = false
      }
    },
    
    async onModuleToggle(e) {
      try {
        const result = await jointManagement.updateGoodsConfig({ 
          enabled: e.detail.value
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
    
    async loadGoodsConfig() {
      try {
        const projectId = this.projectId;
        console.log('🔍 加载物品配置，项目ID:', projectId);
        
        if (!projectId) {
          console.error('🔍 缺少项目ID，无法加载物品配置');
          uni.showToast({ title: '缺少项目ID', icon: 'none' });
          return;
        }
        
        const result = await jointManagement.getGoods({ projectId })
        console.log('🔍 获取物品配置结果:', result);
        
        if (result.success && result.data) {
          this.goods = result.data
          console.log('🔍 加载到的物品列表:', this.goods)
        } else {
          console.error('🔍 获取物品配置失败:', result.message);
          this.goods = []
          if (result.message) {
            uni.showToast({ title: result.message, icon: 'none' })
          }
        }
      } catch (error) {
        console.error('🔍 加载合坛法会代办物品配置失败:', error)
        this.goods = []
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    // 模块开关功能已移除，现在基于项目管理物品
    
    showAddModal() {
      this.isEdit = true
      this.editIndex = -1
      this.currentGood = {
        _id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        enabled: true
      }
    },
    
    editGood(index) {
      this.isEdit = true
      this.editIndex = index
      this.currentGood = JSON.parse(JSON.stringify(this.goods[index]))
    },
    
    closeModal() {
      this.isEdit = false
      this.editIndex = -1
      this.currentGood = {
        _id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        enabled: true
      }
    },
    
    onGoodSwitchChange(e) {
      this.currentGood.enabled = e.detail.value
    },
    
    async saveGood() {
      if (!this.currentGood.name || !this.currentGood.price) {
        uni.showToast({ title: '请填写必填项', icon: 'none' })
        return
      }
      
      try {
        const data = {
          ...this.currentGood,
          price: Number(this.currentGood.price) || 0,
          stock: this.currentGood.stock ? Number(this.currentGood.stock) : null
        }
        const projectId = this.projectId;
        console.log('🔍 保存物品，项目ID:', projectId, '物品数据:', data)
        
        if (!projectId) {
          uni.showToast({ title: '缺少项目ID，无法保存', icon: 'none' });
          return;
        }
        
        let result
        if (this.editIndex !== -1) {
          // 更新物品
          console.log('🔍 更新物品，索引:', this.editIndex)
          result = await jointManagement.updateGood({
            projectId,
            goodIndex: this.editIndex,
            good: data
          })
        } else {
          // 添加物品
          console.log('🔍 添加物品')
          result = await jointManagement.addGood({
            projectId,
            good: data
          })
        }
        
        console.log('🔍 保存结果:', result)
        
        if (result.success) {
          await this.loadGoodsConfig();
          console.log('🔍 保存后物品列表:', this.goods)
          this.closeModal();
          uni.showToast({ title: this.editIndex !== -1 ? '更新成功' : '添加成功', icon: 'success' })
        } else {
          throw new Error(result.message || '保存失败')
        }
      } catch (error) {
        console.error('🔍 保存合坛法会代办物品失败:', error)
        uni.showToast({ title: '保存失败: ' + (error.message || error), icon: 'none' })
      }
    },
    
    async deleteGood(index) {
      const projectId = this.projectId;
      console.log('🔍 删除物品，项目ID:', projectId, '物品索引:', index)
      
      if (!projectId) {
        uni.showToast({ title: '缺少项目ID，无法删除', icon: 'none' });
        return;
      }
      
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个物品吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              console.log('🔍 执行删除操作')
              const result = await jointManagement.deleteGood({
                projectId,
                goodIndex: index
              })
              
              console.log('🔍 删除结果:', result)
              
              if (result.success) {
                await this.loadGoodsConfig();
                console.log('🔍 删除后物品列表:', this.goods)
                uni.showToast({ title: '删除成功', icon: 'success' })
              } else {
                uni.showToast({ title: result.message || '删除失败', icon: 'none' })
              }
            } catch (error) {
              console.error('🔍 删除合坛法会代办物品失败:', error)
              uni.showToast({ title: '删除失败: ' + (error.message || error), icon: 'none' })
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

.page-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20rpx;
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.good-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.good-info {
  margin-bottom: 20rpx;
}

.good-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.good-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.good-price {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: bold;
}

.good-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15rpx;
}

.good-details {
  display: flex;
  gap: 30rpx;
}

.detail-item {
  font-size: 24rpx;
  color: #999;
}

.good-actions {
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

.module-disabled {
  background: #fff;
  border-radius: 12rpx;
  padding: 60rpx 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
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
  text-align: center;
}

.project-info {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.project-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.project-desc {
  font-size: 26rpx;
  color: #666;
}

.no-goods {
  background: #fff;
  border-radius: 12rpx;
  padding: 60rpx 30rpx;
  margin-top: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.no-goods-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.no-goods-icon {
  font-size: 80rpx;
}

.no-goods-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.no-goods-desc {
  font-size: 26rpx;
  color: #666;
  text-align: center;
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
  height: 120rpx;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  resize: none;
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