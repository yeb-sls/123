<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">专场法会项目管理</text>
      <text class="page-desc">管理专场法会项目及其详细配置</text>
      <button class="add-btn" @click="showAddModal">+ 新增项目</button>
    </view>
    <view class="project-list">
      <view v-for="(item, idx) in projects" :key="item._id" class="project-card">
        <view class="project-info">
          <text class="project-name">{{ item.name }}</text>
          <text class="project-desc">{{ item.description }}</text>
          <text class="project-dates">日期：{{ item.dates ? item.dates.join('，') : '' }}</text>
          <text class="project-max">人数上限：{{ item.maxApplicants || '不限' }}</text>
          <text class="project-goods" v-if="item.goods && item.goods.length">代办物品：{{ item.goods.map(g=>g.name+"(¥"+g.price+")").join('，') }}</text>
          <text class="project-receiver">收件信息：{{ item.needReceiver ? '需要' : '不需要' }}</text>
          <text class="project-category">分类：{{ item.category || '未分类' }}</text>
          <text class="project-deadline">截止：{{ item.deadline || '未设置' }}</text>
        </view>
        <view class="project-actions">
          <button class="edit-btn" @click="editProject(idx)">编辑</button>
          <button class="delete-btn" @click="deleteProject(item._id)">删除</button>
        </view>
      </view>
    </view>
    <uni-popup :show="showPopup" type="center" @close="closePopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑项目' : '新增项目' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        <view class="form-group">
          <text class="form-label">项目名称 *</text>
          <input v-model="current.name" placeholder="请输入项目名称" class="form-input" maxlength="30" />
        </view>
        <view class="form-group">
          <text class="form-label">项目描述</text>
          <textarea v-model="current.description" placeholder="请输入项目描述" class="form-textarea" maxlength="200" />
        </view>
        <view class="form-group">
          <text class="form-label">项目分类 *</text>
          <picker :range="categoryOptions" @change="onCategoryChange" :value="categoryOptions.indexOf(current.category)">
            <view class="picker">
              <text class="picker-value">{{ current.category || '请选择分类' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="form-group">
          <text class="form-label">项目金额（法金） *</text>
          <input v-model.number="current.price" type="number" placeholder="请输入金额" class="form-input" min="0" />
        </view>
        <view class="form-group">
          <text class="form-label">报名截止时间 *</text>
          <picker mode="date" @change="onDeadlineChange" :value="current.deadline">
            <view class="picker">
              <text class="picker-value">{{ current.deadline || '请选择截止日期' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="form-group">
          <text class="form-label">可选日期 *</text>
          <view class="date-list">
            <view v-for="(date, i) in current.dates" :key="i" class="date-item">
              <input v-model="current.dates[i]" placeholder="YYYY-MM-DD" class="date-input" />
              <button class="remove-btn" @click="removeDate(i)">删除</button>
            </view>
            <button class="add-date-btn" @click="addDate">+ 添加日期</button>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">报名人数上限</text>
          <input v-model.number="current.maxApplicants" type="number" placeholder="不填为不限" class="form-input" />
        </view>
        <view class="form-group">
          <text class="form-label">代办物品</text>
          <view class="goods-list">
            <view v-for="(g, i) in current.goods" :key="i" class="goods-item">
              <input v-model="g.name" placeholder="物品名称" class="goods-input" />
              <input v-model.number="g.price" type="number" placeholder="单价" class="goods-input" />
              <button class="remove-btn" @click="removeGoods(i)">删除</button>
            </view>
            <button class="add-goods-btn" @click="addGoods">+ 添加物品</button>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">是否需要收件信息</text>
          <switch :checked="current.needReceiver" @change="e=>current.needReceiver=e.detail.value" />
        </view>
        <view class="form-group">
          <button class="popup-btn primary" @click="saveProject">保存</button>
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
      projects: [],
      showPopup: false,
      isEdit: false,
      editIndex: -1,
      categoryOptions: ['超度法会', '姻缘和合法会'],
      current: {
        _id: '',
        name: '',
        description: '',
        category: '',
        deadline: '',
        dates: [],
        maxApplicants: '',
        goods: [],
        needReceiver: false,
        type: 'special' // 标识为专场法会
      }
    }
  },
  onLoad() {
    this.loadProjects()
  },
  methods: {
    async loadProjects() {
      const res = await uniCloud.callFunction({ 
        name: 'getFahuiProjects',
        data: { type: 'special' }
      })
      this.projects = res.result && res.result.data ? res.result.data : []
    },
    showAddModal() {
      this.isEdit = false
      this.editIndex = -1
      this.current = { _id: '', name: '', description: '', category: '', deadline: '', dates: [], maxApplicants: '', goods: [], needReceiver: false, type: 'special' }
      this.showPopup = true
    },
    editProject(idx) {
      this.isEdit = true
      this.editIndex = idx
      this.current = JSON.parse(JSON.stringify(this.projects[idx]))
      if (!this.current.dates) this.current.dates = []
      if (!this.current.goods) this.current.goods = []
      if (!this.current.category) this.current.category = ''
      if (!this.current.deadline) this.current.deadline = ''
      this.current.type = 'special'
      this.showPopup = true
    },
    closePopup() {
      this.showPopup = false
    },
    addDate() {
      this.current.dates.push('')
    },
    removeDate(i) {
      this.current.dates.splice(i, 1)
    },
    addGoods() {
      this.current.goods.push({ name: '', price: '' })
    },
    removeGoods(i) {
      this.current.goods.splice(i, 1)
    },
    onCategoryChange(e) {
      this.current.category = this.categoryOptions[e.detail.value]
    },
    onDeadlineChange(e) {
      this.current.deadline = e.detail.value
    },
    async saveProject() {
      if (!this.current.name.trim()) {
        uni.showToast({ title: '请输入项目名称', icon: 'none' })
        return
      }
      if (typeof this.current.price !== 'number' || isNaN(this.current.price)) {
        uni.showToast({ title: '请输入项目金额', icon: 'none' })
        return
      }
      if (!this.current.category) {
        uni.showToast({ title: '请选择项目分类', icon: 'none' })
        return
      }
      if (!this.current.deadline) {
        uni.showToast({ title: '请选择报名截止时间', icon: 'none' })
        return
      }
      if (!this.current.dates.length || this.current.dates.some(d=>!d.trim())) {
        uni.showToast({ title: '请填写完整日期', icon: 'none' })
        return
      }
      // 确保 category、deadline、price 字段始终存在
      const data = { 
        ...this.current, 
        category: this.current.category || '', 
        deadline: this.current.deadline || '', 
        price: Number(this.current.price) || 0,
        type: 'special'
      }
      console.log('[调试] 保存项目数据:', data)
      if ('_id' in data && !data._id) delete data._id
      if (this.isEdit && data._id) {
        const updateData = { ...data }
        delete updateData._id
        await uniCloud.callFunction({ name: 'updateFahuiProject', data: { id: data._id, project: updateData } })
      } else {
        await uniCloud.callFunction({ name: 'addFahuiProject', data: { project: data } })
      }
      this.showPopup = false
      await this.loadProjects()
      uni.showToast({ title: '保存成功', icon: 'success' })
    },
    async deleteProject(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该项目吗？',
        success: async (res) => {
          if (res.confirm) {
            await uniCloud.callFunction({ name: 'deleteFahuiProject', data: { id } })
            await this.loadProjects()
            uni.showToast({ title: '删除成功', icon: 'success' })
          }
        }
      })
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
.project-list { margin-top: 20rpx; }
.project-card { background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; }
.project-info { flex: 1; }
.project-name { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 8rpx; display: block; }
.project-desc { font-size: 26rpx; color: #666; margin-bottom: 8rpx; display: block; }
.project-dates, .project-max, .project-goods, .project-receiver { font-size: 24rpx; color: #888; margin-bottom: 4rpx; display: block; }
.project-category, .project-deadline { font-size: 24rpx; color: #888; margin-bottom: 4rpx; display: block; }
.project-actions { display: flex; flex-direction: column; gap: 10rpx; }
.edit-btn, .delete-btn { background: #e0e0e0; color: #333; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx; }
.edit-btn { color: #007aff; }
.delete-btn { color: #ff3b30; }
.uni-popup .popup-content { background: #fff; border-radius: 12rpx; padding: 30rpx; width: 600rpx; max-height: 80vh; overflow-y: auto; }
.popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30rpx; }
.popup-title { font-size: 32rpx; font-weight: bold; color: #333; }
.close-btn { background: none; border: none; font-size: 40rpx; color: #999; }
.form-group { margin-bottom: 30rpx; }
.form-label { font-size: 28rpx; color: #333; display: block; margin-bottom: 10rpx; }
.form-input, .form-textarea { width: 100%; border: 1rpx solid #e0e0e0; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; box-sizing: border-box; }
.form-input { height: 80rpx; }
.form-textarea { height: 120rpx; resize: none; }
.date-list, .goods-list { display: flex; flex-direction: column; gap: 10rpx; }
.date-item, .goods-item { display: flex; align-items: center; gap: 10rpx; }
.date-input, .goods-input { flex: 1; border: 1rpx solid #e0e0e0; border-radius: 8rpx; padding: 10rpx; font-size: 26rpx; }
.add-date-btn, .add-goods-btn, .remove-btn { background: #e0e0e0; color: #333; border: none; padding: 8rpx 16rpx; border-radius: 8rpx; font-size: 24rpx; }
.add-date-btn, .add-goods-btn { margin-top: 8rpx; }
.remove-btn { color: #ff3b30; }
.popup-btn.primary { background: #007aff; color: #fff; border: none; padding: 20rpx; border-radius: 8rpx; font-size: 28rpx; width: 100%; }
.picker { display: flex; align-items: center; border: 1rpx solid #e0e0e0; border-radius: 8rpx; padding: 10rpx 20rpx; font-size: 28rpx; color: #333; }
.picker-value { flex: 1; }
.picker-arrow { margin-left: 10rpx; }
</style> 