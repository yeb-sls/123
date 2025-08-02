<template>
  <view class="light-selector">
    <!-- 灯塔选择 -->
    <view class="form-section">
      <view class="form-title">选择灯塔</view>
      <picker :range="towerOptions" @change="onSelectTower" :value="towerIndex">
        <view class="input-box">{{ selectedTowerName || '请选择灯塔' }}</view>
      </picker>
    </view>

    <!-- 楼层选择 -->
    <view class="form-section" v-if="towerIndex >= 0">
      <view class="form-title">选择供奉层</view>
      <picker :range="levelOptions" @change="onSelectLevel" :value="levelIndex">
        <view class="input-box">
          {{ selectedLevelName || '请选择供奉层' }}
          <text v-if="isLevelFull" style="color: red; font-size: 24rpx">（已满）</text>
        </view>
      </picker>
    </view>

    <!-- 时间选择 -->
    <view class="form-section" v-if="levelIndex >= 0 && timeOptions.length > 0">
      <view class="form-title">选择供奉时间</view>
      <picker :range="timeOptions" @change="onSelectTime" :value="timeIndex">
        <view class="input-box">{{ selectedTime || '请选择供奉时间' }}</view>
      </picker>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LightSelector',
  props: {
    towers: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Object,
      default: () => ({ towerId: '', levelId: '', time: '' })
    }
  },
  data() {
    return {
      towerIndex: -1,
      levelIndex: -1,
      timeIndex: 0
    }
  },
  computed: {
    towerOptions() {
      return this.towers.map(t => t.name)
    },
    selectedTower() {
      return this.towers[this.towerIndex] || null
    },
    levelOptions() {
      if (!this.selectedTower) return []
      return this.selectedTower.levels.map(l =>
        l.available > 0 ? l.name : `${l.name}（已满）`
      )
    },
    selectedLevel() {
      return this.selectedTower?.levels[this.levelIndex] || null
    },
    isLevelFull() {
      return this.selectedLevel?.available === 0
    },
    selectedTowerName() {
      return this.selectedTower?.name || ''
    },
    selectedLevelName() {
      return this.selectedLevel?.name || ''
    },
    timeOptions() {
      return this.selectedLevel?.times || []
    },
    selectedTime() {
      return this.modelValue.time
    }
  },
  methods: {
    emitChange() {
      this.$emit('update:modelValue', {
        towerId: this.selectedTower?.id || '',
        levelId: this.selectedLevel?.id || '',
        time: this.selectedTime || ''
      })
    },
    onSelectTower(e) {
      this.towerIndex = e.detail.value
      this.levelIndex = -1
      this.timeIndex = 0
      this.modelValue.time = ''
      this.emitChange()
    },
    onSelectLevel(e) {
      this.levelIndex = e.detail.value
      this.timeIndex = 0
      this.modelValue.time = ''
      this.emitChange()
    },
    onSelectTime(e) {
      this.timeIndex = e.detail.value
      this.modelValue.time = this.timeOptions[e.detail.value]
      this.emitChange()
    }
  }
}
</script>

<style scoped>
.light-selector {
  margin-top: 30rpx;
}
.form-section {
  margin: 30rpx 30rpx 0;
}
.form-title {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  font-weight: 600;
}
.input-box {
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
}
</style>
