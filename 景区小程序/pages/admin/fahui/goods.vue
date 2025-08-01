<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}代办物品管理</text>
      <text class="page-desc">管理{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}代办物品及价格设置</text>
    </view>

    <!-- 模块开关 -->
    <view class="module-switch">
      <view class="switch-item">
        <text class="switch-label">启用代办物品模块</text>
        <switch :checked="moduleEnabled" @change="onModuleToggle" />
      </view>
      <text class="switch-desc">关闭后前台将不显示代办物品模块</text>
    </view>

    <!-- 物品编辑表单 -->
    <view v-if="moduleEnabled" class="goods-edit-form">
      <view class="form-group">
        <text class="form-label">物品名称 <text class="required">*</text></text>
        <input v-model="currentGoods.name" placeholder="请输入物品名称" class="form-input" maxlength="50" autocomplete="off" @focus="onInputFocus('name', $event)" />
      </view>
      <view class="form-group">
        <text class="form-label">单价 <text class="required">*</text></text>
        <input v-model="currentGoods.price" placeholder="请输入单价" class="form-input" type="number" autocomplete="off" @focus="onInputFocus('price', $event)" />
      </view>
      <view class="form-group">
        <text class="form-label">物品描述</text>
        <textarea v-model="currentGoods.description" placeholder="请输入物品描述" class="form-textarea" maxlength="200" />
      </view>
      <view class="form-group">
        <text class="form-label">是否启用</text>
        <switch :checked="currentGoods.enabled" @change="onEnabledChange" />
      </view>
      <view class="form-group">
        <text class="form-label">物品图片</text>
        <view class="image-upload" @click="chooseImage">
          <image v-if="currentGoods.image" :src="currentGoods.image" mode="aspectFill" class="upload-img" />
          <view v-else class="upload-placeholder">
            <text class="upload-icon">+</text>
            <text class="upload-text">选择图片</text>
          </view>
        </view>
      </view>
      <view class="form-actions">
        <button class="save-btn" @click="saveGoods">{{ isEdit ? '保存修改' : '添加物品' }}</button>
        <button v-if="isEdit" class="cancel-btn" @click="cancelEdit">取消编辑</button>
      </view>
    </view>

    <!-- 物品列表 -->
    <view class="goods-list" v-if="moduleEnabled">
      <view v-for="(item, index) in goodsList" :key="item._id" class="goods-card">
        <view class="goods-header">
          <view class="goods-name">{{ item.name }}</view>
          <view class="goods-price">¥{{ item.price }}</view>
        </view>
        <view class="goods-content">
          <view class="goods-info">
            <view class="info-row">
              <text class="info-label">描述：</text>
              <text class="info-value">{{ item.description || '暂无描述' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">状态：</text>
              <text class="info-value" :class="{ active: item.enabled }">
                {{ item.enabled ? '启用' : '禁用' }}
              </text>
            </view>
          </view>
          <view class="goods-image" v-if="item.image">
            <image :src="item.image" mode="aspectFill" class="goods-img" />
          </view>
        </view>
        <view class="goods-actions">
          <button class="action-btn edit" @click="editGoods(item)">编辑</button>
          <button class="action-btn delete" @click="deleteGoods(item._id)">删除</button>
          <button class="action-btn" @click="moveGoodsUp(index)" :disabled="index===0">↑</button>
          <button class="action-btn" @click="moveGoodsDown(index)" :disabled="index===goodsList.length-1">↓</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 替换为本地自定义uni-popup组件
import uniPopup from '@/components/uni-popup/uni-popup.vue'

// 导入云对象
const fahuiManagement = uniCloud.importObject('fahui-management')

export default {
  components: {
    uniPopup
  },
  data() {
    return {
      fahuiType: 'special', // 默认专场法会
      moduleEnabled: false,
      goodsList: [],
      isEdit: false,
      editIndex: -1,
      currentGoods: {
        _id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        name: '',
        price: '',
        description: '',
        enabled: true,
        image: '',
        type: 'special'
      }
    }
  },
  
  onLoad(options) {
    // 获取法会类型参数
    if (options.type) {
      this.fahuiType = options.type;
      this.currentGoods.type = options.type;
    }
    this.loadGoodsConfig()
  },
  
  methods: {
    // 加载代办物品配置
    async loadGoodsConfig() {
      try {
        const result = await fahuiManagement.getGoodsConfig()
        
        if (result.success && result.data) {
          const config = result.data
          this.moduleEnabled = config.enabled || false
          this.goodsList = config.goods || []
        } else {
          // 如果没有配置，创建默认配置
          this.moduleEnabled = false
          this.goodsList = []
        }
      } catch (error) {
        console.error('加载配置失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    // 模块开关切换
    async onModuleToggle(e) {
      this.moduleEnabled = e.detail.value
      try {
        await fahuiManagement.updateGoodsConfig({
          enabled: this.moduleEnabled,
          goods: this.goodsList
        })
        
        uni.showToast({
          title: this.moduleEnabled ? '已启用' : '已禁用',
          icon: 'success'
        })
      } catch (error) {
        console.error('更新配置失败:', error)
        this.moduleEnabled = !this.moduleEnabled // 恢复原状态
        uni.showToast({
          title: '更新失败',
          icon: 'none'
        })
      }
    },
    
    // 显示添加弹窗
    showAddModal() {
      console.log('点击了添加代办物品按钮');
      this.isEdit = false
      this.editIndex = -1
      this.currentGoods = {
        _id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        name: '',
        price: '',
        description: '',
        enabled: true,
        image: ''
      }
      this.showPopup = true
    },
    
    // 编辑物品
    editGoods(item) {
      this.isEdit = true
      this.editIndex = this.goodsList.findIndex(g => g._id === item._id)
      this.currentGoods = { ...item }
    },
    
    // 删除物品
    async deleteGoods(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个代办物品吗？',
        success: async (res) => {
          if (res.confirm) {
            const newGoodsList = this.goodsList.filter(g => g._id !== id);
            // 若删除后为空，自动关闭模块
            const enabled = newGoodsList.length > 0 ? this.moduleEnabled : false;
            try {
              await fahuiManagement.updateGoodsConfig({
                enabled,
                goods: newGoodsList
              })
              
              uni.showToast({ title: '删除成功', icon: 'success' });
              this.loadGoodsConfig(); // 删除后刷新
            } catch (error) {
              uni.showToast({ title: '删除失败', icon: 'none' });
            }
          }
        }
      });
    },
    
    // 启用状态切换
    onEnabledChange(e) {
      this.currentGoods.enabled = e.detail.value
    },
    
    // 选择图片
    async chooseImage() {
      try {
        const [err, res] = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        
        if (err) {
          console.error('选择图片失败:', err)
          return
        }
        
        const tempFilePath = res.tempFilePaths[0]
        uni.showLoading({ title: '上传中...' })
        
        const uploadResult = await uniCloud.uploadFile({
          filePath: tempFilePath,
          cloudPath: `fahui/goods/${Date.now()}.jpg`
        })
        
        this.currentGoods.image = uploadResult.fileID
        uni.hideLoading()
        uni.showToast({
          title: '上传成功',
          icon: 'success'
        })
      } catch (error) {
        uni.hideLoading()
        console.error('上传图片失败:', error)
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    },
    
    // 物品排序按钮
    moveGoodsUp(index) {
      if (index > 0) {
        const temp = this.goodsList[index]
        this.goodsList.splice(index, 1)
        this.goodsList.splice(index - 1, 0, temp)
        this.saveGoodsList()
      }
    },
    moveGoodsDown(index) {
      if (index < this.goodsList.length - 1) {
        const temp = this.goodsList[index]
        this.goodsList.splice(index, 1)
        this.goodsList.splice(index + 1, 0, temp)
        this.saveGoodsList()
      }
    },
    // 排序后保存
    async saveGoodsList() {
      try {
        // 若排序后为空，自动关闭模块
        const enabled = this.goodsList.length > 0 ? this.moduleEnabled : false;
        await fahuiManagement.updateGoodsConfig({
          enabled,
          goods: this.goodsList
        })
        
        uni.showToast({ title: '排序已保存', icon: 'success' })
      } catch (error) {
        console.error('保存排序失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    
    // 验证物品数据
    validateGoods() {
      if (!this.currentGoods.name) {
        uni.showToast({ title: '请输入物品名称', icon: 'none' })
        return false
      }
      if (!this.currentGoods.price) {
        uni.showToast({ title: '请输入单价', icon: 'none' })
        return false
      }
      return true
    },
    
    // 保存物品（添加/编辑）
    async saveGoods() {
      // 校验
      if (!this.currentGoods.name.trim()) {
        uni.showToast({ title: '请输入物品名称', icon: 'none' });
        return;
      }
      if (!this.currentGoods.price || isNaN(this.currentGoods.price)) {
        uni.showToast({ title: '请输入有效单价', icon: 'none' });
        return;
      }
      let newGoodsList = [...this.goodsList];
      if (this.isEdit && this.editIndex !== -1) {
        newGoodsList.splice(this.editIndex, 1, { ...this.currentGoods });
      } else {
        newGoodsList.push({ ...this.currentGoods });
      }
      // 若保存后为空，自动关闭模块
      const enabled = newGoodsList.length > 0 ? this.moduleEnabled : false;
      try {
        await fahuiManagement.updateGoodsConfig({
          enabled,
          goods: newGoodsList
        })
        
        this.cancelEdit(); // 使用 cancelEdit 替代关闭弹窗
        uni.showToast({ title: '保存成功', icon: 'success' });
        this.loadGoodsConfig(); // 保存后刷新
      } catch (error) {
        uni.showToast({ title: '保存失败', icon: 'none' });
      }
    },
    
    // 取消编辑
    cancelEdit() {
      this.isEdit = false
      this.editIndex = -1
      this.currentGoods = {
        _id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        name: '',
        price: '',
        description: '',
        enabled: true,
        image: ''
      }
    },
    onInputFocus(field, e) {
      console.log(`[调试] 输入框 focus 事件触发: ${field}`, e)
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
  padding: 24rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.switch-label {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.switch-desc {
  font-size: 24rpx;
  color: #999;
}

.goods-list {
  margin-bottom: 24rpx;
}

.goods-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.goods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.goods-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.goods-price {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff6b35;
}

.goods-content {
  margin-bottom: 16rpx;
}

.goods-info {
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  margin-bottom: 8rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  width: 120rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.info-value.active {
  color: #34c759;
}

.goods-image {
  margin-top: 12rpx;
}

.goods-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

.goods-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  flex: 1;
  padding: 12rpx;
  border-radius: 6rpx;
  font-size: 26rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
}

.action-btn.edit {
  color: #007aff;
}

.action-btn.delete {
  color: #ff3b30;
}

.add-btn {
  width: 100%;
  height: 80rpx;
  border: 2rpx dashed #2d8cf0;
  border-radius: 8rpx;
  background: #f8f9fa;
  color: #2d8cf0;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 36rpx;
  margin-right: 8rpx;
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

.required {
  color: #ff4d4f;
  font-size: 26rpx;
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

.image-upload {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #e0e0e0;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-img {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 48rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
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

.goods-edit-form { background: #fff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx #e0eaff; margin-bottom: 24rpx; padding: 24rpx; pointer-events: auto; z-index: 10; }
.form-group { margin-bottom: 18rpx; }
.form-label { font-size: 28rpx; color: #333; display: block; margin-bottom: 8rpx; }
.required { color: #ff4d4f; font-size: 26rpx; }
.form-input {
  width: 100%;
  min-width: 260rpx;
  height: 70rpx;
  padding: 0 18rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 30rpx;
  background: #fff;
  pointer-events: auto;
  color: #222;
  box-sizing: border-box;
  vertical-align: middle;
  background-clip: padding-box;
}
.form-textarea { width: 100%; min-height: 80rpx; border: 1px solid #ccc; border-radius: 8rpx; padding: 12rpx; font-size: 28rpx; background: #fff; }
.form-actions { display: flex; gap: 24rpx; margin-top: 12rpx; }
.save-btn { background: #4caf50; color: #fff; border-radius: 8rpx; padding: 10rpx 32rpx; }
.cancel-btn { background: #eee; color: #333; border-radius: 8rpx; padding: 10rpx 32rpx; }
</style> 