<template>
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
          <button class="action-btn delete" @click="deleteProject(project._id)">删除</button>
        </view>
      </view>
    </view>
    
    <!-- 添加/编辑弹窗 -->
    <uni-popup ref="popup" type="center" :mask-click="false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑项目' : '新增项目' }}</text>
          <text class="popup-close" @click="closeModal">×</text>
        </view>
        
        <view class="form-content">
          <view class="form-item">
            <text class="form-label">项目名称 *</text>
            <input v-model="current.name" class="form-input" placeholder="请输入项目名称" />
          </view>
          
          <view class="form-item">
            <text class="form-label">项目分类</text>
            <picker @change="onCategoryChange" :value="categoryIndex" :range="categoryOptions">
              <view class="form-picker">
                {{ current.category || '请选择分类' }}
              </view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label">项目描述</text>
            <textarea v-model="current.description" class="form-textarea" placeholder="请输入项目描述" maxlength="200" />
          </view>
          
          <view class="form-item">
            <text class="form-label">法金价格 *</text>
            <input v-model="current.price" type="number" class="form-input" placeholder="请输入法金价格" />
          </view>
          
          <view class="form-item">
            <text class="form-label">截止日期</text>
            <picker mode="date" @change="onDeadlineChange" :value="current.deadline">
              <view class="form-picker">
                {{ current.deadline || '请选择截止日期' }}
              </view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label">最大报名人数</text>
            <input v-model="current.maxApplicants" type="number" class="form-input" placeholder="请输入最大报名人数" />
          </view>
          
          <view class="form-item">
            <text class="form-label">可选日期</text>
            <view class="dates-container">
              <view v-for="(date, index) in current.dates" :key="index" class="date-tag">
                <text>{{ date }}</text>
                <text class="date-remove" @click="removeDate(index)">×</text>
              </view>
              <button class="add-date-btn" @click="showDatePicker">+ 添加日期</button>
            </view>
          </view>
        </view>
        
        <view class="form-actions">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveProject">保存</button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 日期选择器 -->
    <uni-popup ref="datePopup" type="center">
      <view class="date-popup">
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
      categoryOptions: ['平安祈福', '姻缘和合', '超度法会', '其他'],
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
        const res = await uniCloud.callFunction({
          name: 'getJointProjects'
        })
        this.projects = res.result && res.result.data ? res.result.data : []
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
      this.$refs.popup.open()
    },
    
    editProject(index) {
      this.isEdit = true
      this.editIndex = index
      this.current = JSON.parse(JSON.stringify(this.projects[index]))
      this.categoryIndex = this.categoryOptions.indexOf(this.current.category)
      this.$refs.popup.open()
    },
    
    closeModal() {
      this.$refs.popup.close()
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
      this.$refs.datePopup.open()
    },
    
    closeDatePicker() {
      this.$refs.datePopup.close()
    },
    
    onDateAdd(e) {
      this.newDate = e.detail.value
    },
    
    addDate() {
      if (this.newDate && !this.current.dates.includes(this.newDate)) {
        this.current.dates.push(this.newDate)
        this.current.dates.sort()
      }
      this.closeDatePicker()
    },
    
    removeDate(index) {
      this.current.dates.splice(index, 1)
    },
    
    async saveProject() {
      if (!this.current.name || !this.current.price) {
        uni.showToast({ title: '请填写必填项', icon: 'none' })
        return
      }
      
      try {
        const data = {
          ...this.current,
          category: this.current.category || '',
          deadline: this.current.deadline || '',
          price: Number(this.current.price) || 0,
          maxApplicants: this.current.maxApplicants ? Number(this.current.maxApplicants) : null
        }
        
        if (this.isEdit && data._id) {
          const updateData = { ...data }
          delete updateData._id
          await uniCloud.callFunction({
            name: 'updateJointProject',
            data: { id: data._id, project: updateData }
          })
        } else {
          await uniCloud.callFunction({
            name: 'addJointProject',
            data: { project: data }
          })
        }
        
        this.closeModal()
        await this.loadProjects()
        uni.showToast({ title: this.isEdit ? '更新成功' : '添加成功' })
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
              await uniCloud.callFunction({
                name: 'deleteJointProject',
                data: { id }
              })
              await this.loadProjects()
              uni.showToast({ title: '删除成功' })
            } catch (error) {
              console.error('删除合坛法会项目失败:', error)
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
}

.dates-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.date-tag {
  background: #f0f4ff;
  color: #667eea;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
}

.date-remove {
  margin-left: 10rpx;
  font-size: 28rpx;
  cursor: pointer;
}

.add-date-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
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
</style> 