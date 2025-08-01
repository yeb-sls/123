<template>
  <view>
    <view class="admin-container">
      <view class="page-header">
        <text class="page-title">合坛法会项目管理</text>
        <text class="page-desc">管理合坛法会项目及其详细配置</text>
        <button class="add-btn" @click="showAddModal">+ 新增项目</button>
      </view>
      
      <!-- 项目列表 -->
      <view class="projects-list">
        <view v-for="(project, index) in projects" :key="project._id" class="project-card">
          <view class="project-header">
            <view class="project-info">
              <text class="project-name">{{ project.name }}</text>
              <text class="project-category">{{ project.category }}</text>
            </view>
            <view class="project-price">¥{{ project.price }}/人</view>
          </view>
          
          <view class="project-desc">{{ project.description }}</view>
          
          <view class="project-details">
            <view class="detail-item">
              <text class="detail-label">截止日期：</text>
              <text class="detail-value">{{ project.deadline }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">最大人数：</text>
              <text class="detail-value">{{ project.maxApplicants || '不限' }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">可选日期：</text>
              <text class="detail-value">{{ project.dates ? project.dates.join('、') : '待定' }}</text>
            </view>
          </view>
          
          <view class="project-actions">
            <button class="action-btn edit" @click="editProject(index)">编辑</button>
            <button class="action-btn goods" @click="manageGoods(project._id)">物品</button>
            <button class="action-btn delete" @click="deleteProject(project._id)">删除</button>
          </view>
        </view>
      </view>
      
      <!-- 添加/编辑弹窗 -->
      <view v-if="showForm" class="form-content form-vertical form-inline-below">
        <view class="form-header">
          <text class="form-title">{{ isEdit ? '编辑项目' : '新增项目' }}</text>
          <text class="form-close" @click="closeModal">×</text>
        </view>
        <view class="form-group">
          <text class="form-label">项目名称 *</text>
          <input v-model="current.name" class="form-input" placeholder="请输入项目名称" maxlength="30" />
        </view>
        <view class="form-group">
          <text class="form-label">项目描述</text>
          <textarea v-model="current.description" class="form-textarea" placeholder="请输入项目描述" maxlength="200" />
        </view>
        <view class="form-group">
          <text class="form-label">项目分类 *</text>
          <picker :range="categoryOptions" @change="onCategoryChange" :value="categoryIndex">
            <view class="form-picker">
              <text class="picker-value">{{ current.category || '请选择分类' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="form-group">
          <text class="form-label">法金价格 *</text>
          <input v-model.number="current.price" type="number" class="form-input" placeholder="请输入法金价格" min="0" />
        </view>
        <view class="form-group">
          <text class="form-label">报名截止时间 *</text>
          <picker mode="date" @change="onDeadlineChange" :value="current.deadline">
            <view class="form-picker">
              <text class="picker-value">{{ current.deadline || '请选择截止日期' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="form-group">
          <text class="form-label">可选日期 *</text>
          <view class="date-list-vertical">
            <view v-for="(date, i) in current.dates" :key="i" class="date-item-vertical">
              <input v-model="current.dates[i]" placeholder="YYYY-MM-DD" class="date-input" />
              <button class="remove-btn" @click="removeDate(i)">删除</button>
            </view>
            <button class="add-date-btn" @click="addDate">+ 添加日期</button>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">最大报名人数</text>
          <input v-model.number="current.maxApplicants" type="number" class="form-input" placeholder="不填为不限" />
        </view>
        <view class="form-actions form-actions-center">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveProject">保存</button>
        </view>
      </view>
      
      <!-- 日期选择器 -->
      <view v-if="showForm && showDatePickerInline" class="date-picker-inline">
        <view class="date-popup-header">
          <text class="date-popup-title">选择日期</text>
          <text class="date-popup-close" @click="closeDatePicker">×</text>
        </view>
        <picker mode="date" @change="onDateAdd" :value="newDate">
          <view class="date-picker">
            {{ newDate || '请选择日期' }}
          </view>
        </picker>
        <view class="date-popup-actions">
          <button class="cancel-btn" @click="closeDatePicker">取消</button>
          <button class="confirm-btn" @click="addDate">确认</button>
        </view>
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
      projects: [],
      showForm: false,
      showDatePickerInline: false,
      isEdit: false,
      editIndex: -1,
      categoryOptions: ['姻缘和合', '超度法会'],
      categoryIndex: 0,
      newDate: '',
      current: {
        _id: '',
        name: '',
        description: '',
        category: '',
        deadline: '',
        dates: [],
        maxApplicants: '',
        price: '',
        goods: [],
        needReceiver: false
      }
    }
  },
  
  onLoad() {
    this.loadProjects()
  },
  
  methods: {
    async loadProjects() {
      try {
        const result = await jointManagement.getProjects()
        if (result.success) {
          this.projects = result.data || []
        } else {
          uni.showToast({ title: result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('加载合坛法会项目失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    
    showAddModal() {
      this.isEdit = false
      this.editIndex = -1
      this.current = {
        _id: '',
        name: '',
        description: '',
        category: '',
        deadline: '',
        dates: [],
        maxApplicants: '',
        price: '',
        goods: [],
        needReceiver: false
      }
      this.showForm = true
    },
    
    editProject(index) {
      this.isEdit = true
      this.editIndex = index
      this.current = JSON.parse(JSON.stringify(this.projects[index]))
      this.categoryIndex = this.categoryOptions.indexOf(this.current.category)
      this.showForm = true
    },
    
    closeModal() {
      this.showForm = false
    },
    
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value
      this.current.category = this.categoryOptions[this.categoryIndex]
    },
    
    onDeadlineChange(e) {
      this.current.deadline = e.detail.value
    },
    
    showDatePicker() {
      this.newDate = ''
      this.showDatePickerInline = true
    },
    
    closeDatePicker() {
      this.showDatePickerInline = false
    },
    
    onDateAdd(e) {
      this.newDate = e.detail.value
    },
    
    addDate() {
      this.current.dates.push('')
    },
    
    removeDate(index) {
      this.current.dates.splice(index, 1)
    },
    
    async saveProject() {
      if (!this.current.name.trim()) {
        uni.showToast({ title: '请输入项目名称', icon: 'none' })
        return
      }
      if (typeof this.current.price !== 'number' || isNaN(this.current.price)) {
        uni.showToast({ title: '请输入法金价格', icon: 'none' })
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
      const data = {
        ...this.current,
        category: this.current.category || '',
        deadline: this.current.deadline || '',
        price: Number(this.current.price) || 0,
        maxApplicants: this.current.maxApplicants ? Number(this.current.maxApplicants) : null
      }
      try {
        if (this.isEdit && data._id) {
          const updateData = { ...data }
          delete updateData._id
          const result = await jointManagement.updateProject({ _id: data._id, ...updateData })
          if (result.success) {
            this.closeModal()
            await this.loadProjects()
            uni.showToast({ title: '更新成功', icon: 'success' })
          } else {
            uni.showToast({ title: result.message, icon: 'none' })
          }
        } else {
          const result = await jointManagement.addProject(data)
          if (result.success) {
            this.closeModal()
            await this.loadProjects()
            uni.showToast({ title: '添加成功', icon: 'success' })
          } else {
            uni.showToast({ title: result.message, icon: 'none' })
          }
        }
      } catch (error) {
        console.error('保存合坛法会项目失败:', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    
    async deleteProject(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个项目吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await jointManagement.deleteProject({ _id: id })
              if (result.success) {
                await this.loadProjects()
                uni.showToast({ title: '删除成功', icon: 'success' })
              } else {
                uni.showToast({ title: result.message, icon: 'none' })
              }
            } catch (error) {
              console.error('删除合坛法会项目失败:', error)
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    
    manageGoods(projectId) {
      console.log('【调试-manageGoods】准备跳转，projectId =', projectId);
      // 获取项目名称
      const project = this.projects.find(p => p._id === projectId);
      const projectName = project ? project.name : '';
      const url = `/pages/admin/joint/goods?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`;
      console.log('【调试-manageGoods】跳转 URL =', url);
      uni.navigateTo({
        url: url
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

.project-price {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: bold;
}

.project-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.project-details {
  margin-bottom: 20rpx;
}

.detail-item {
  display: flex;
  margin-bottom: 10rpx;
}

.detail-label {
  font-size: 26rpx;
  color: #999;
  width: 160rpx;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.project-actions {
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

.action-btn.goods {
  background: #ffa502;
  color: #fff;
}

.action-btn.delete {
  background: #ff4757;
  color: #fff;
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

.form-content, .form-vertical, .form-inline-below {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
  padding: 40rpx 30rpx;
  min-width: 400rpx;
  max-width: 600rpx;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.form-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.form-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
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
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  height: 120rpx;
}

.form-picker {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  font-size: 36rpx;
  color: #999;
  margin-left: 10rpx;
}



.date-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.date-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.date-item {
  display: flex;
  align-items: center;
  background: #f0f4ff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
}

.date-item-vertical {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8rpx;
}

.date-input {
  flex: 1;
  font-size: 28rpx;
  padding: 0 10rpx;
  margin-right: 10rpx;
  height: 60rpx;
}

.remove-btn {
  background: #ff4757;
  color: #fff;
  border: none;
  padding: 8rpx 15rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.add-date-btn {
  width: 100%;
  margin-top: 8rpx;
  background: #667eea;
  color: #fff;
  border: none;
  padding: 16rpx 0;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
}

.form-actions-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20rpx;
  margin-top: 20rpx;
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

.date-popup {
  background: #fff;
  border-radius: 12rpx;
  width: 400rpx;
  padding: 30rpx;
}

.date-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.date-popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.date-popup-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.date-picker {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.date-popup-actions {
  display: flex;
  gap: 20rpx;
}

.confirm-btn {
  flex: 1;
  background: #667eea;
  color: #fff;
  border: none;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.date-picker-inline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-inline-below {
  position: relative; /* 确保表单跟随页面纵向排列 */
  margin-top: 20rpx; /* 与项目列表之间留出空间 */
  width: 100%; /* 占满父容器宽度 */
  max-width: 90vw; /* 最大宽度与form-content一致 */
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08); /* 保持阴影效果 */
  border-radius: 12rpx; /* 保持圆角 */
  background: #fff; /* 保持背景 */
}
</style> 