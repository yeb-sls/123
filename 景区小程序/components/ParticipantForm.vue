<template>
  <view class="participant-form">
    <!-- 报名者列表 -->
    <view class="participant-list">
      <view v-for="(participant, index) in participants" :key="index" class="participant-card">
        <view class="participant-header">
          <text class="participant-title">报名人 {{ index + 1 }}</text>
          <view class="participant-actions">
            <button v-if="participants.length > 1" class="action-btn delete" @click="deleteParticipant(index)">删除</button>
          </view>
        </view>
        <view class="participant-info-edit">
          <view class="form-group">
            <text class="form-label">姓名 <text class="required">*</text></text>
            <view style="display:flex;align-items:center;">
              <input v-model="participant.name" placeholder="请输入姓名" class="form-input" maxlength="10" autocomplete="off" />
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">性别 <text class="required">*</text></text>
            <picker :range="genderOptions" @change="onGenderChange(index, $event)" :value="genderOptions.indexOf(participant.gender)">
              <view class="picker">
                <text class="picker-value">{{ participant.gender || '请选择性别' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">联系电话 <text class="required">*</text></text>
            <input v-model="participant.phone" placeholder="请输入联系电话" class="form-input" type="number" maxlength="11" autocomplete="off" />
          </view>
          <view class="form-group">
            <text class="form-label">身份证号</text>
            <input v-model="participant.idCard" placeholder="请输入身份证号" class="form-input" maxlength="18" autocomplete="off" />
          </view>
          <view class="form-group">
            <text class="form-label">农历生日 <text class="required">*</text></text>
            <picker mode="date" @change="onBirthdayChange(index, $event)" :value="participant.lunarBirthday">
              <view class="picker">
                <text class="picker-value">{{ participant.lunarBirthday || '请选择农历生日' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">出生时辰 <text class="required">*</text></text>
            <picker :range="birthTimeOptions" @change="onBirthTimeChange(index, $event)" :value="birthTimeOptions.indexOf(participant.birthTime)">
              <view class="picker">
                <text class="picker-value">{{ participant.birthTime || '请选择出生时辰' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">常住地址 <text class="required">*</text></text>
            <view style="display:flex;align-items:center;">
              <input v-model="participant.address" placeholder="请输入常住地址" class="form-input" autocomplete="off" />
              <button @click="chooseLocation(index)" class="map-btn">定位</button>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 添加按钮 -->
    <button v-if="participants.length < 5" class="add-btn" @click="addParticipant">
      <text class="add-icon">+</text>
      <text class="add-text">添加报名人</text>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    onChooseHistory: { // 原chooseHistory重命名
      type: Function,
      default: null
    }
  },
  data() {
    return {
      participants: [],
      genderOptions: ['男', '女'],
      birthTimeOptions: [
        '不确定',
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
  watch: {
    value: {
      handler(newVal) {
        this.participants = [...newVal]
      },
      immediate: true
    },
    participants: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  methods: {
    getEmptyParticipant() {
      return {
        name: '',
        gender: '',
        idCard: '',
        phone: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      }
    },
    addParticipant() {
      this.participants.push(this.getEmptyParticipant())
    },
    deleteParticipant(index) {
      this.participants.splice(index, 1)
    },
    onGenderChange(index, e) {
      this.participants[index].gender = this.genderOptions[e.detail.value]
    },
    onBirthdayChange(index, e) {
      this.participants[index].lunarBirthday = e.detail.value
    },
    onBirthTimeChange(index, e) {
      this.participants[index].birthTime = this.birthTimeOptions[e.detail.value]
    },
    chooseLocation(index) {
      uni.chooseLocation({
        success: (res) => {
          this.participants[index].address = res.address
        }
      })
    },
    chooseHistory(index) {
      if (this.onChooseHistory) {
        this.onChooseHistory(index)
      }
    }
  }
}
</script>
<style scoped>
.participant-form { width: 100%; }
.participant-list { margin-bottom: 24rpx; }
.participant-card { border: 1px solid #e0eaff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx; background: #f8f9fa; }
.participant-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.participant-title { font-size: 28rpx; font-weight: bold; color: #2d8cf0; }
.participant-actions { display: flex; gap: 12rpx; }
.action-btn { font-size: 24rpx; padding: 8rpx 16rpx; border-radius: 6rpx; border: 1px solid #e0e0e0; background: #fff; }
.action-btn.delete { color: #ff3b30; }
.participant-info-edit { display: flex; flex-wrap: wrap; gap: 12rpx; }
.form-group { margin-bottom: 18rpx; flex: 1 1 100%; }
.form-label { font-size: 28rpx; color: #333; display: block; margin-bottom: 8rpx; }
.required { color: #ff4d4f; font-size: 26rpx; }
.form-input { width: 100%; padding: 16rpx; border: 1px solid #ccc; border-radius: 8rpx; font-size: 28rpx; background: #fff; }
.picker { padding: 16rpx; background: #f7f7f7; border-radius: 8rpx; font-size: 28rpx; color: #333; display: flex; align-items: center; justify-content: space-between; border: 1px solid #e0eaff; }
.picker-value { color: #333; }
.picker-arrow { color: #bbb; font-size: 28rpx; }
.add-btn { width: 100%; height: 80rpx; border: 2rpx dashed #2d8cf0; border-radius: 8rpx; background: #f8f9fa; color: #2d8cf0; font-size: 28rpx; display: flex; align-items: center; justify-content: center; margin-top: 16rpx; }
.add-icon { font-size: 36rpx; margin-right: 8rpx; }
.map-btn { margin-left: 12rpx; font-size: 24rpx; color: #2d8cf0; background: #e0eaff; border: none; border-radius: 6rpx; padding: 8rpx 16rpx; }
.choose-btn {
  margin-left: 12rpx;
  font-size: 24rpx;
  color: #2d8cf0;
  background: #e0eaff;
  border: none;
  border-radius: 6rpx;
  padding: 8rpx 16rpx;
}
</style> 