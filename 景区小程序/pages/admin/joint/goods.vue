<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">合坛法会代办物品管理</text>
      <text class="page-desc">管理合坛法会代办物品及价格设置</text>
      <button class="add-btn" @click="showAddModal">+ 新增物品</button>
    </view>
    
    <!-- 模块开关 -->
    <view class="module-switch">
      <view class="switch-item">
        <text class="switch-label">代办物品模块</text>
        <switch :checked="moduleEnabled" @change="onModuleToggle" color="#667eea" />
        <text class="switch-desc">{{ moduleEnabled ? '已启用' : '已禁用' }}</text>
      </view>
    </view>
    
    <!-- 物品列表 -->
    <view v-if="moduleEnabled" class="goods-list">
      <view v-for="(good, index) in goods" :key="good._id" class="good-card">
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
          <button class="action-btn delete" @click="deleteGood(good._id)">删除</button>
        </view>
      </view>
    </view>
    
    <!-- 模块禁用提示 -->
    <view v-else class="module-disabled">
      <view class="disabled-content">
        <text class="disabled-icon">🚫</text>
        <text class="disabled-title">代办物品模块已禁用</text>
        <text class="disabled-desc">启用后可在前台显示代办物品选择功能</text>
      </view>
    </view>
    
    <!-- 添加/编辑弹窗 -->
    <uni-popup ref="popup" type="center" :mask-click="false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑物品' : '新增物品' }}</text>
          <text class="popup-close" @click="closeModal">×</text>
        </view>
        
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
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

export default {
  components: { uniPopup },
  
  data() {
    return {
      moduleEnabled: false,
      goods: [],
      isEdit: false,
      editIndex: -1,
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
  
  onLoad() {
    this.loadGoodsConfig()
  },
  
  methods: {
    async loadGoodsConfig() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getJointGoodsConfig'
        })
        if (res.result && res.result.data) {
          this.moduleEnabled = res.result.data.enabled || false
          this.goods = res.result.data.goods || []
        }
      } catch (error) {
        console.error('加载合坛法会代办物品配置失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    async onModuleToggle(e) {
      try {
        await uniCloud.callFunction({
          name: 'updateJointGoodsConfig',
          data: { 
            enabled: e.detail.value,
            goods: this.goods
          }
        })
        this.moduleEnabled = e.detail.value
        uni.showToast({ title: e.detail.value ? '模块已启用' : '模块已禁用' })
      } catch (error) {
        console.error('更新模块状态失败:', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    showAddModal() {
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
      this.$refs.popup.open()
    },
    
    editGood(index) {
      this.isEdit = true
      this.editIndex = index
      this.currentGood = JSON.parse(JSON.stringify(this.goods[index]))
      this.$refs.popup.open()
    },
    
    closeModal() {
      this.$refs.popup.close()
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
        
        if (this.isEdit && data._id) {
          // 更新物品
          const updateData = { ...data }
          delete updateData._id
          this.goods[this.editIndex] = { ...this.goods[this.editIndex], ...updateData }
        } else {
          // 新增物品
          delete data._id
          data._id = Date.now().toString() // 临时ID
          this.goods.push(data)
        }
        
        // 保存到云端
        await uniCloud.callFunction({
          name: 'updateJointGoodsConfig',
          data: { 
            enabled: this.moduleEnabled,
            goods: this.goods
          }
        })
        
        this.closeModal()
        uni.showToast({ title: this.isEdit ? '更新成功' : '添加成功' })
      } catch (error) {
        console.error('保存合坛法会代办物品失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    
    async deleteGood(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个物品吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              this.goods = this.goods.filter(good => good._id !== id)
              await uniCloud.callFunction({
                name: 'updateJointGoodsConfig',
                data: { 
                  enabled: this.moduleEnabled,
                  goods: this.goods
                }
              })
              uni.showToast({ title: '删除成功' })
            } catch (error) {
              console.error('删除合坛法会代办物品失败:', error)
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