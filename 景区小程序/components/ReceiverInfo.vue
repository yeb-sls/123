<template>
  <view class="receiver-info">
    <view class="form-title">
      <text class="icon">📦</text>收件信息
    </view>
    
    <view class="form-group">
      <input v-model="receiver.name" placeholder="收件人姓名" class="input" maxlength="10" />
    </view>
    
    <view class="form-group">
      <input v-model="receiver.phone" placeholder="收件人电话" class="input" maxlength="11" />
    </view>
    
    <view class="form-group">
      <textarea v-model="receiver.address" placeholder="详细收件地址" class="textarea" maxlength="100" />
    </view>
    
    <view class="form-group">
      <input v-model="receiver.remark" placeholder="备注信息（可选）" class="input" maxlength="50" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'ReceiverInfo',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      receiver: this.value || {
        name: '',
        phone: '',
        address: '',
        remark: ''
      }
    }
  },
  watch: {
    receiver: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.receiver-info {
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