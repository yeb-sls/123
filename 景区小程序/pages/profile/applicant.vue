<template>
  <view class="applicant-page">
    <view class="page-header">
      <view class="page-title">报名者信息</view>
      <view class="applicant-count">共 {{ applicants.length }} 位报名者</view>
    </view>

    <!-- 报名者列表 -->
    <view class="applicant-list">
      <view v-for="(applicant, index) in applicants" :key="index" class="applicant-item">
        <view class="applicant-info">
          <view class="applicant-header">
            <text class="applicant-name">{{ applicant.name }}</text>
            <text class="applicant-gender">{{ applicant.gender }}</text>
          </view>
          <view class="applicant-details">
            <text class="detail-item">电话：{{ applicant.phone }}</text>
            <text class="detail-item">生日：{{ applicant.lunarBirthday }}</text>
            <text class="detail-item">时辰：{{ applicant.birthTime }}</text>
            <text class="detail-item">地址：{{ applicant.address }}</text>
          </view>
        </view>
        <view class="applicant-actions">
          <button class="action-btn edit" @click="editApplicant(index)">编辑</button>
          <button class="action-btn delete" @click="deleteApplicant(index)">删除</button>
        </view>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="add-section">
      <button class="add-btn" @click="showAddDialog">
        <text class="add-icon">+</text>
        <text class="add-text">添加报名者</text>
      </button>
    </view>

    <!-- 添加/编辑弹窗 -->
    <uni-popup ref="applicantPopup" type="center">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑报名者' : '添加报名者' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        
        <view class="form-content">
          <view class="form-group">
            <text class="form-label">姓名 <text class="required">*</text></text>
            <input v-model="editForm.name" placeholder="请输入姓名" class="form-input" maxlength="10" />
          </view>
          
          <view class="form-group">
            <text class="form-label">性别 <text class="required">*</text></text>
            <picker :range="genderOptions" @change="onGenderChange" :value="genderOptions.indexOf(editForm.gender)">
              <view class="picker">
                <text class="picker-value">{{ editForm.gender || '请选择性别' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">联系电话 <text class="required">*</text></text>
            <input v-model="editForm.phone" placeholder="请输入联系电话" class="form-input" type="number" maxlength="11" />
          </view>
          
          <view class="form-group">
            <text class="form-label">农历生日 <text class="required">*</text></text>
            <picker mode="date" @change="onBirthdayChange" :value="editForm.lunarBirthday">
              <view class="picker">
                <text class="picker-value">{{ editForm.lunarBirthday || '请选择农历生日' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">出生时辰 <text class="required">*</text></text>
            <picker :range="birthTimeOptions" @change="onBirthTimeChange" :value="birthTimeOptions.indexOf(editForm.birthTime)">
              <view class="picker">
                <text class="picker-value">{{ editForm.birthTime || '请选择出生时辰' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">常住地址 <text class="required">*</text></text>
            <input v-model="editForm.address" placeholder="请输入常住地址" class="form-input" />
          </view>
        </view>
        
        <view class="popup-actions">
          <button class="popup-btn cancel" @click="closePopup">取消</button>
          <button class="popup-btn confirm" @click="saveApplicant">保存</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      applicants: [
        {
          name: '张三',
          gender: '男',
          phone: '13800138000',
          lunarBirthday: '1990-01-15',
          birthTime: '子时23-01点',
          address: '北京市朝阳区xxx街道'
        },
        {
          name: '李四',
          gender: '女',
          phone: '13900139000',
          lunarBirthday: '1988-06-20',
          birthTime: '午时11-13点',
          address: '上海市浦东新区xxx路'
        }
      ],
      editForm: {
        name: '',
        gender: '',
        phone: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      },
      isEdit: false,
      editIndex: -1,
      genderOptions: ['男', '女'],
      birthTimeOptions: [
        '吉时',
        '子时23-01点',
        '丑时01-03点',
        '寅时03-05点',
        '卯时05-07点',
        '辰时07-09点',
        '巳时09-11点',
        '午时11-13点',
        '未时13-15点',
        '申时15-17点',
        '酉时17-19点',
        '戌时19-21点',
        '亥时21-23点'
      ]
    }
  },
  onLoad() {
    this.loadApplicants()
  },
  methods: {
    loadApplicants() {
      const savedApplicants = uni.getStorageSync('userApplicants')
      if (savedApplicants) {
        this.applicants = savedApplicants
      }
    },
    saveApplicants() {
      uni.setStorageSync('userApplicants', this.applicants)
    },
    showAddDialog() {
      this.isEdit = false
      this.editIndex = -1
      this.editForm = {
        name: '',
        gender: '',
        phone: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      }
      this.$refs.applicantPopup.open()
    },
    editApplicant(index) {
      this.isEdit = true
      this.editIndex = index
      this.editForm = { ...this.applicants[index] }
      this.$refs.applicantPopup.open()
    },
    deleteApplicant(index) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除报名者"${this.applicants[index].name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            this.applicants.splice(index, 1)
            this.saveApplicants()
            uni.showToast({ title: '删除成功', icon: 'success' })
          }
        }
      })
    },
    closePopup() {
      this.$refs.applicantPopup.close()
    },
    onGenderChange(e) {
      this.editForm.gender = this.genderOptions[e.detail.value]
    },
    onBirthdayChange(e) {
      this.editForm.lunarBirthday = e.detail.value
    },
    onBirthTimeChange(e) {
      this.editForm.birthTime = this.birthTimeOptions[e.detail.value]
    },
    saveApplicant() {
      // 验证表单
      if (!this.editForm.name) {
        uni.showToast({ title: '请输入姓名', icon: 'none' })
        return
      }
      if (!this.editForm.gender) {
        uni.showToast({ title: '请选择性别', icon: 'none' })
        return
      }
      if (!this.editForm.phone) {
        uni.showToast({ title: '请输入联系电话', icon: 'none' })
        return
      }
      if (!this.editForm.lunarBirthday) {
        uni.showToast({ title: '请选择农历生日', icon: 'none' })
        return
      }
      if (!this.editForm.birthTime) {
        uni.showToast({ title: '请选择出生时辰', icon: 'none' })
        return
      }
      if (!this.editForm.address) {
        uni.showToast({ title: '请输入常住地址', icon: 'none' })
        return
      }

      if (this.isEdit) {
        // 编辑模式
        this.applicants[this.editIndex] = { ...this.editForm }
      } else {
        // 添加模式
        this.applicants.push({ ...this.editForm })
      }

      this.saveApplicants()
      this.closePopup()
      uni.showToast({ 
        title: this.isEdit ? '编辑成功' : '添加成功', 
        icon: 'success' 
      })
    }
  }
}
</script>

<style scoped>
.applicant-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.page-header {
  padding: 32rpx 16rpx 24rpx 16rpx;
  background: #fff;
  margin-bottom: 24rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 8rpx;
}

.applicant-count {
  font-size: 26rpx;
  color: #666;
}

.applicant-list {
  padding: 0 16rpx;
}

.applicant-item {
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.applicant-info {
  flex: 1;
}

.applicant-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.applicant-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.applicant-gender {
  font-size: 24rpx;
  color: #2d8cf0;
  background: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.applicant-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.detail-item {
  font-size: 24rpx;
  color: #666;
}

.applicant-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  border: none;
}

.action-btn.edit {
  background: #e6f7ff;
  color: #2d8cf0;
}

.action-btn.delete {
  background: #fff2f0;
  color: #ff4d4f;
}

.add-section {
  padding: 32rpx 16rpx;
}

.add-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}

.add-icon {
  font-size: 36rpx;
  margin-right: 8rpx;
}

.popup-content {
  background: #fff;
  border-radius: 18rpx;
  width: 90vw;
  max-height: 80vh;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 24rpx 24rpx 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #f8f9fa;
  color: #666;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.form-content {
  padding: 24rpx;
  max-height: 600rpx;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.required {
  color: #ff4d4f;
}

.form-input {
  width: 100%;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}

.picker {
  padding: 16rpx;
  background: #f7f7f7;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0eaff;
}

.picker-value {
  color: #333;
}

.picker-arrow {
  color: #bbb;
  font-size: 28rpx;
}

.popup-actions {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 1px solid #f0f0f0;
}

.popup-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: none;
}

.popup-btn.cancel {
  background: #f8f9fa;
  color: #666;
}

.popup-btn.confirm {
  background: linear-gradient(135deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
}
</style> 