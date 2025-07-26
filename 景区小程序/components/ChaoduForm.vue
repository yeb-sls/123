<template>
  <view class="chaodu-form">
    <view class="form-title">
      <text class="icon">🕯️</text>超度信息
    </view>
    
    <view class="form-group">
      <picker :range="chaoduTypes" @change="onTypeChange" :value="chaoduTypes.indexOf(selectedType)">
        <view class="picker">
          <text class="picker-label">超度类型：</text>
          <text class="picker-value">{{ selectedType || '请选择' }}</text>
          <text class="picker-arrow">▼</text>
        </view>
      </picker>
    </view>
    
    <view class="deceased-list">
      <view v-for="(deceased, index) in deceasedList" :key="index" class="deceased-item">
        <view class="item-header">
          <text class="item-title">已故亲人 {{ index + 1 }}</text>
          <button v-if="deceasedList.length > 1" class="remove-btn" @click="removeDeceased(index)">删除</button>
        </view>
        <view class="form-group">
          <input v-model="deceased.name" placeholder="姓名" class="input" maxlength="10" />
        </view>
        <view class="form-group">
          <input v-model="deceased.birthDate" placeholder="出生日期" class="input" />
        </view>
        <view class="form-group">
          <input v-model="deceased.deathDate" placeholder="去世日期" class="input" />
        </view>
        <view class="form-group">
          <picker :range="relationOptions" @change="onRelationChange(index, $event)" :value="relationOptions.indexOf(deceased.relation)">
            <view class="picker">
              <text class="picker-label">关系：</text>
              <text class="picker-value">{{ deceased.relation || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>
    </view>
    
    <button v-if="deceasedList.length < 5" class="add-btn" @click="addDeceased">
      <text class="icon">➕</text>添加已故亲人
    </button>
  </view>
</template>

<script>
export default {
  name: 'ChaoduForm',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'single'
    }
  },
  data() {
    return {
      chaoduTypes: ['超度法会', '超度牌位', '超度功德'],
      selectedType: '',
      relationOptions: ['父亲', '母亲', '祖父', '祖母', '外祖父', '外祖母', '兄弟', '姐妹', '子女', '其他'],
      deceasedList: this.value.length > 0 ? [...this.value] : [this.getEmptyDeceased()]
    }
  },
  watch: {
    deceasedList: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  methods: {
    getEmptyDeceased() {
      return {
        name: '',
        birthDate: '',
        deathDate: '',
        relation: ''
      }
    },
    onTypeChange(e) {
      this.selectedType = this.chaoduTypes[e.detail.value]
    },
    onRelationChange(index, e) {
      this.deceasedList[index].relation = this.relationOptions[e.detail.value]
    },
    addDeceased() {
      if (this.deceasedList.length < 5) {
        this.deceasedList.push(this.getEmptyDeceased())
      }
    },
    removeDeceased(index) {
      if (this.deceasedList.length > 1) {
        this.deceasedList.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.chaodu-form {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin: 24rpx 16rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.form-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
}

.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
}

.form-group {
  margin-bottom: 18rpx;
}

.input {
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
  border: 1px solid #e0eaff;
  position: relative;
}

.picker-label {
  margin-right: 16rpx;
}

.picker-value {
  flex: 1;
  color: #333;
}

.picker-arrow {
  position: absolute;
  right: 24rpx;
  color: #bbb;
  font-size: 28rpx;
}

.deceased-list {
  margin-bottom: 24rpx;
}

.deceased-item {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}

.item-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
}

.remove-btn {
  font-size: 24rpx;
  color: #ff4d4f;
  background: none;
  border: none;
  padding: 8rpx 16rpx;
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
  margin-top: 16rpx;
}
</style>
