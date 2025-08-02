<template>
  <view class="mate-info">
    <view class="form-title">
      <text class="icon">💕</text>配偶信息
    </view>
    
    <view class="form-group">
      <input v-model="mate.name" placeholder="配偶姓名" class="input" maxlength="10" />
    </view>
    
    <view class="form-group">
      <input v-model="mate.birthDate" placeholder="配偶出生日期" class="input" />
    </view>
    
    <view class="form-group">
      <input v-model="mate.idCard" placeholder="配偶身份证号" class="input" maxlength="18" />
    </view>
    
    <view class="form-group">
      <textarea v-model="mate.wish" placeholder="姻缘愿望（可选）" class="textarea" maxlength="100" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'MateInfo',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      mate: this.value || {
        name: '',
        birthDate: '',
        idCard: '',
        wish: ''
      }
    }
  },
  watch: {
    mate: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.mate-info {
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

.textarea {
  width: 100%;
  min-height: 80rpx;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}
</style> 