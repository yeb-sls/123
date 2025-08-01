<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">代办物品管理</text>
      <text class="page-desc">管理所有可用的代办物品</text>
      <button class="add-btn" @click="showAddModal">+ 新增物品</button>
    </view>
    <view class="goods-list">
      <view v-for="(item, idx) in goods" :key="item._id" class="goods-card">
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-price">单价：¥{{ item.price }}</text>
          <text class="goods-desc">{{ item.description }}</text>
          <text class="goods-status" :class="{ enabled: item.enabled }">{{ item.enabled ? '启用' : '禁用' }}</text>
        </view>
        <view class="goods-actions">
          <button class="edit-btn" @click="editGood(idx)">编辑</button>
          <button class="delete-btn" @click="deleteGood(item._id)">删除</button>
          <button class="status-btn" @click="toggleStatus(idx)">{{ item.enabled ? '禁用' : '启用' }}</button>
        </view>
      </view>
    </view>
    <uni-popup :show="showPopup" type="center" @close="closePopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑物品' : '新增物品' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        <view class="form-group">
          <text class="form-label">物品名称 *</text>
          <input v-model="current.name" placeholder="请输入物品名称" class="form-input" maxlength="30" />
        </view>
        <view class="form-group">
          <text class="form-label">单价 *</text>
          <input v-model.number="current.price" type="number" placeholder="请输入单价" class="form-input" />
        </view>
        <view class="form-group">
          <text class="form-label">描述</text>
          <textarea v-model="current.description" placeholder="请输入描述" class="form-textarea" maxlength="100" />
        </view>
        <view class="form-group">
          <text class="form-label">是否启用</text>
          <switch :checked="current.enabled" @change="e=>current.enabled=e.detail.value" />
        </view>
        <view class="form-group">
          <button class="popup-btn primary" @click="saveGood">保存</button>
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
      goods: [],
      showPopup: false,
      isEdit: false,
      editIndex: -1,
      current: {
        _id: '',
        name: '',
        price: '',
        description: '',
        enabled: true
      }
    }
  },
  onLoad() {
    this.loadGoods()
  },
  methods: {
    async loadGoods() {
      try {
        const result = await commonManagement.getDelegateGoods()
        if (result.success) {
          this.goods = result.data || []
        } else {
          throw new Error(result.message || '获取失败')
        }
      } catch (error) {
        console.error('加载代办物品失败:', error)
        this.goods = []
      }
    },
    showAddModal() {
      this.isEdit = false
      this.editIndex = -1
      this.current = { _id: '', name: '', price: '', description: '', enabled: true }
      this.showPopup = true
    },
    editGood(idx) {
      this.isEdit = true
      this.editIndex = idx
      this.current = JSON.parse(JSON.stringify(this.goods[idx]))
      this.showPopup = true
    },
    closePopup() {
      this.showPopup = false
    },
    async saveGood() {
      if (!this.current.name.trim()) {
        uni.showToast({ title: '请输入物品名称', icon: 'none' })
        return
      }
      if (!this.current.price) {
        uni.showToast({ title: '请输入单价', icon: 'none' })
        return
      }
      
      try {
        const data = { ...this.current }
        
        if (this.isEdit && data._id) {
          // 更新物品
          await commonManagement.updateDelegateGood({
            _id: data._id,
            ...data
          })
        } else {
          // 添加物品
          delete data._id
          await commonManagement.addDelegateGood(data)
        }
        
        this.showPopup = false
        await this.loadGoods()
        uni.showToast({ title: '保存成功', icon: 'success' })
      } catch (error) {
        console.error('保存失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    async deleteGood(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该物品吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await commonManagement.deleteDelegateGood({ _id: id })
              await this.loadGoods()
              uni.showToast({ title: '删除成功', icon: 'success' })
            } catch (error) {
              console.error('删除失败:', error)
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    async toggleStatus(idx) {
      try {
        const good = this.goods[idx]
        await commonManagement.updateDelegateGood({
          _id: good._id,
          enabled: !good.enabled
        })
        await this.loadGoods()
      } catch (error) {
        console.error('状态切换失败:', error)
        uni.showToast({ title: '状态切换失败', icon: 'none' })
      }
    }
  }
}
</script>
<style scoped>
.admin-container { padding: 20rpx; background: #f5f5f5; min-height: 100vh; }
.page-header { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; display: flex; align-items: center; gap: 20rpx; }
.page-title { font-size: 36rpx; font-weight: bold; color: #333; }
.page-desc { font-size: 28rpx; color: #666; margin-left: 20rpx; }
.add-btn { background: #007aff; color: #fff; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 28rpx; margin-left: auto; }
.goods-list { margin-top: 20rpx; }
.goods-card { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; }
.goods-info { flex: 1; }
.goods-name { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 8rpx; display: block; }
.goods-price { font-size: 26rpx; color: #666; margin-bottom: 8rpx; display: block; }
.goods-desc { font-size: 24rpx; color: #888; margin-bottom: 4rpx; display: block; }
.goods-status { font-size: 24rpx; color: #fff; background: #bbb; border-radius: 8rpx; padding: 4rpx 12rpx; display: inline-block; margin-bottom: 4rpx; }
.goods-status.enabled { background: #4caf50; }
.goods-actions { display: flex; flex-direction: column; gap: 10rpx; }
.edit-btn, .delete-btn, .status-btn { background: #e0e0e0; color: #333; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx; }
.edit-btn { color: #007aff; }
.delete-btn { color: #ff3b30; }
.status-btn { color: #888; }
.uni-popup .popup-content { background: #fff; border-radius: 12rpx; padding: 30rpx; width: 600rpx; max-height: 80vh; overflow-y: auto; }
.popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30rpx; }
.popup-title { font-size: 32rpx; font-weight: bold; color: #333; }
.close-btn { background: none; border: none; font-size: 40rpx; color: #999; }
.form-group { margin-bottom: 30rpx; }
.form-label { font-size: 28rpx; color: #333; display: block; margin-bottom: 10rpx; }
.form-input, .form-textarea { width: 100%; border: 1rpx solid #e0e0e0; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; box-sizing: border-box; }
.form-input { height: 80rpx; }
.form-textarea { height: 120rpx; resize: none; }
.popup-btn.primary { background: #007aff; color: #fff; border: none; padding: 20rpx; border-radius: 8rpx; font-size: 28rpx; width: 100%; }
</style> 