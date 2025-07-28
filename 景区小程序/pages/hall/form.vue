<template>
  <view class="form-bg">
    <view class="form-container">
      <!-- 步骤提示 -->
      <view class="step-bar">
        <view class="step active">1. 选择供品</view>
        <view class="step">2. 信息确认</view>
        <view class="step">3. 支付</view>
      </view>

      <!-- 殿堂选择 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">🏛️</text>选择殿堂 <text class="required">*</text>
        </view>
        <view class="form-group">
          <picker :range="halls" @change="onSelectHall" :value="hallIndex">
            <view class="picker">
              <text class="icon">🏛️</text>殿堂：
              <text v-if="hallIndex >= 0">{{ halls[hallIndex] }}</text>
              <text v-else class="placeholder">请选择殿堂</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <view v-if="errors.hallIndex" class="error-tip">{{ errors.hallIndex }}</view>
        </view>
      </view>

      <!-- 供品选择 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">🕯️</text>选择供品 <text class="required">*</text>
        </view>
        <view class="offerings-list">
          <view v-for="(offering, index) in offerings" :key="index" class="offering-item">
            <view class="offering-info">
              <view class="offering-header">
                <text class="offering-icon">{{ offering.icon }}</text>
                <view class="offering-details">
                  <view class="offering-name">{{ offering.name }}</view>
                  <view class="offering-desc">{{ offering.description }}</view>
                </view>
              </view>
              <view class="offering-price">¥{{ offering.price }}/{{ offering.unit }}</view>
            </view>
            <view class="offering-control">
              <button class="qty-btn" @click="decreaseQty(index)" :disabled="offering.qty <= 0">-</button>
              <text class="qty-value">{{ offering.qty }}</text>
              <button class="qty-btn" @click="increaseQty(index)">+</button>
            </view>
          </view>
        </view>
        <view v-if="errors.offerings" class="error-tip">{{ errors.offerings }}</view>
        
        <!-- 价格预览 -->
        <view class="price-preview" v-if="totalPrice > 0">
          <view class="price-item">
            <text>供品费用：</text>
            <text class="price">¥{{ totalPrice }}</text>
          </view>
          <view class="price-total">
            <text>总计：</text>
            <text class="total-price">¥{{ totalPrice }}</text>
          </view>
        </view>
      </view>

      <!-- 供奉者信息 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">👤</text>供奉者信息 <text class="required">*</text>
        </view>
        <view class="form-group">
          <input v-model="form.name" placeholder="请输入姓名" class="input" maxlength="10" />
          <view v-if="errors.name" class="error-tip">{{ errors.name }}</view>
        </view>
        <view class="form-group">
          <input v-model="form.phone" placeholder="请输入联系电话" class="input" maxlength="11" />
          <view v-if="errors.phone" class="error-tip">{{ errors.phone }}</view>
        </view>
        <view class="form-group">
          <input v-model="form.idCard" placeholder="请输入身份证号" class="input" maxlength="18" />
          <view v-if="errors.idCard" class="error-tip">{{ errors.idCard }}</view>
        </view>
        <view class="form-group">
          <textarea v-model="form.address" placeholder="请输入联系地址" class="textarea" maxlength="50" />
          <view v-if="errors.address" class="error-tip">{{ errors.address }}</view>
        </view>
      </view>

      <!-- 祈福语 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">🙏</text>祈福语（可选）
        </view>
        <view class="form-group">
          <textarea 
            v-model="form.wish" 
            placeholder="请输入您的祈福愿望（最多100字）" 
            class="textarea" 
            maxlength="100" 
            @input="onWishInput" 
          />
          <view class="word-count">{{ form.wish.length }}/100</view>
        </view>
      </view>

      <!-- 收件信息 -->
      <view class="card" v-if="showReceiver">
        <view class="card-title">
          <text class="icon">📦</text>收件信息
        </view>
        <view class="form-group">
          <input v-model="form.receiver.name" placeholder="收件人姓名" class="input" maxlength="10" />
        </view>
        <view class="form-group">
          <input v-model="form.receiver.phone" placeholder="收件人电话" class="input" maxlength="11" />
        </view>
        <view class="form-group">
          <textarea v-model="form.receiver.address" placeholder="详细收件地址" class="textarea" maxlength="100" />
        </view>
        <view class="form-group">
          <input v-model="form.receiver.remark" placeholder="备注信息（可选）" class="input" maxlength="50" />
        </view>
      </view>

      <view class="btn-group">
        <button class="form-btn" type="primary" :loading="loading" @click="nextStep">
          <text v-if="!loading">下一步</text>
          <text v-else>提交中...</text>
        </button>
        <button class="form-btn reset" type="default" @click="resetForm">重置</button>
      </view>
      
      <!-- 返回按钮 -->
      <view class="back-section">
        <button class="back-btn" @click="goBack">返回上页</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      hallIndex: -1,
      showReceiver: true,
      loading: false,
      halls: ['大雄宝殿', '观音殿', '地藏殿', '药师殿', '文殊殿'],
      offerings: [
        {
          icon: '🕯️',
          name: '香',
          description: '清香一炷，祈愿平安',
          price: 20,
          unit: '炷',
          qty: 0
        },
        {
          icon: '🌸',
          name: '花',
          description: '鲜花供品，祈愿吉祥',
          price: 30,
          unit: '束',
          qty: 0
        },
        {
          icon: '💡',
          name: '灯',
          description: '明灯一盏，祈愿光明',
          price: 50,
          unit: '盏',
          qty: 0
        },
        {
          icon: '💧',
          name: '水',
          description: '净水一杯，祈愿清净',
          price: 10,
          unit: '杯',
          qty: 0
        },
        {
          icon: '🍎',
          name: '果',
          description: '鲜果供品，祈愿圆满',
          price: 40,
          unit: '份',
          qty: 0
        },
        {
          icon: '🍚',
          name: '食',
          description: '素食供品，祈愿健康',
          price: 25,
          unit: '份',
          qty: 0
        }
      ],
      form: {
        name: '',
        phone: '',
        idCard: '',
        address: '',
        wish: '',
        receiver: {
          name: '',
          phone: '',
          address: '',
          remark: ''
        }
      },
      errors: {},
      shippingFee: 15
    }
  },
  computed: {
    totalPrice() {
      return this.offerings.reduce((sum, item) => sum + item.price * item.qty, 0)
    },
    selectedOfferings() {
      return this.offerings.filter(item => item.qty > 0)
    }
  },
  methods: {
    onSelectHall(e) {
      this.hallIndex = e.detail.value
      this.errors = {}
    },
    increaseQty(index) {
      this.offerings[index].qty++
      this.errors = {}
    },
    decreaseQty(index) {
      if (this.offerings[index].qty > 0) {
        this.offerings[index].qty--
      }
      this.errors = {}
    },
    onWishInput() {
      if (this.form.wish.length > 100) {
        this.form.wish = this.form.wish.slice(0, 100)
      }
    },
    validate() {
      const errors = {}
      
      if (this.hallIndex < 0) errors.hallIndex = '请选择殿堂'
      
      // 检查是否选择了供品
      const hasOfferings = this.offerings.some(item => item.qty > 0)
      if (!hasOfferings) {
        errors.offerings = '请至少选择一种供品'
      }
      
      if (!this.form.name) errors.name = '请输入姓名'
      else if (this.form.name.length < 2) errors.name = '姓名需2-10字'
      
      if (!this.form.phone) errors.phone = '请输入联系电话'
      else if (!/^1[3-9]\d{9}$/.test(this.form.phone)) errors.phone = '手机号格式不正确'
      
      if (!this.form.idCard) errors.idCard = '请输入身份证号'
      else if (!/^\d{17}[\dXx]$/.test(this.form.idCard)) errors.idCard = '身份证号格式不正确'
      
      if (!this.form.address) errors.address = '请输入联系地址'
      
      this.errors = errors
      return Object.keys(errors).length === 0
    },
    nextStep() {
      if (!this.validate()) {
        uni.showToast({ title: '请完善表单信息', icon: 'none' })
        return
      }
      
      this.loading = true
      
      // 构建确认数据
      const confirmData = {
        hallId: this.hallIndex,
        hallName: this.halls[this.hallIndex],
        offerings: this.selectedOfferings,
        totalPrice: this.totalPrice,
        name: this.form.name,
        phone: this.form.phone,
        idCard: this.form.idCard,
        address: this.form.address,
        wish: this.form.wish,
        receiver: this.form.receiver,
        timestamp: new Date().getTime()
      }
      
      // 保存到本地存储
      uni.setStorageSync('hallOrder', confirmData)
      
      setTimeout(() => {
        this.loading = false
        // 跳转到确认页
        uni.navigateTo({ 
          url: '/pages/hall/confirm',
          success: () => {
            console.log('跳转到殿堂供品确认页成功')
          },
          fail: (err) => {
            console.error('跳转失败:', err)
            uni.showToast({ title: '页面跳转失败', icon: 'none' })
          }
        })
      }, 800)
    },
    resetForm() {
      this.hallIndex = -1
      this.form = {
        name: '',
        phone: '',
        idCard: '',
        address: '',
        wish: '',
        receiver: {
          name: '',
          phone: '',
          address: '',
          remark: ''
        }
      }
      this.offerings.forEach(item => item.qty = 0)
      this.errors = {}
    },
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回上页成功')
        },
        fail: (err) => {
          console.error('返回上页失败:', err)
          // 如果返回失败，跳转到殿堂供品主页
          uni.navigateTo({ 
            url: '/pages/hall/index',
            fail: () => {
              uni.showToast({ 
                title: '返回失败，请重试', 
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    }
  },
  onLoad() {
    // 自动填充上次填写
    const last = uni.getStorageSync('hallOrder')
    if (last) {
      this.hallIndex = last.hallId || -1
      this.form.name = last.name || ''
      this.form.phone = last.phone || ''
      this.form.idCard = last.idCard || ''
      this.form.address = last.address || ''
      this.form.wish = last.wish || ''
      this.form.receiver = last.receiver || {
        name: '',
        phone: '',
        address: '',
        remark: ''
      }
      
      // 恢复供品选择
      if (last.offerings) {
        last.offerings.forEach(selected => {
          const index = this.offerings.findIndex(item => item.name === selected.name)
          if (index !== -1) {
            this.offerings[index].qty = selected.qty
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.form-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.form-container {
  padding-top: 1rpx;
}

.step-bar {
  display: flex;
  justify-content: space-between;
  margin: 32rpx 16rpx 24rpx 16rpx;
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.step {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #bbb;
  position: relative;
}

.step.active {
  color: #2d8cf0;
  font-weight: bold;
}

.card {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  margin: 24rpx 16rpx 0 16rpx;
  padding: 32rpx 24rpx 12rpx 24rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
}

.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
}

.required {
  color: #ff4d4f;
  font-size: 26rpx;
  margin-left: 8rpx;
}

.form-group {
  margin-bottom: 18rpx;
}

.input {
  display: block;
  width: 100%;
  margin: 6rpx 0;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}

.textarea {
  display: block;
  width: 100%;
  min-height: 80rpx;
  margin: 6rpx 0;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}

.word-count {
  text-align: right;
  font-size: 22rpx;
  color: #bbb;
  margin-top: 2rpx;
}

.picker {
  margin: 6rpx 0;
  padding: 16rpx;
  background: #f7f7f7;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  border: 1px solid #e0eaff;
  position: relative;
  cursor: pointer;
}

.arrow {
  position: absolute;
  right: 24rpx;
  color: #bbb;
  font-size: 28rpx;
  pointer-events: none;
}

.placeholder {
  color: #bbb;
}

.error-tip {
  color: #ff4d4f;
  font-size: 24rpx;
  margin-top: 2rpx;
  margin-left: 8rpx;
}

.offerings-list {
  margin-bottom: 24rpx;
}

.offering-item {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.offering-info {
  flex: 1;
}

.offering-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.offering-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.offering-details {
  flex: 1;
}

.offering-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.offering-desc {
  font-size: 24rpx;
  color: #666;
}

.offering-price {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.offering-control {
  display: flex;
  align-items: center;
}

.qty-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1px solid #2d8cf0;
  border-radius: 8rpx;
  background: #fff;
  color: #2d8cf0;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:disabled {
  color: #ccc;
  border-color: #ccc;
}

.qty-value {
  width: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  margin: 0 16rpx;
}

.price-preview {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border-radius: 12rpx;
  padding: 20rpx;
  border: 2rpx solid #ffd591;
  margin-top: 16rpx;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  font-size: 28rpx;
  color: #666;
}

.price {
  color: #ff6b35;
  font-weight: bold;
}

.price-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12rpx;
  border-top: 1px solid #ffd591;
  font-size: 30rpx;
  font-weight: bold;
}

.total-price {
  color: #ff4d4f;
  font-size: 32rpx;
}

.btn-group {
  display: flex;
  gap: 24rpx;
  margin: 48rpx 16rpx 0 16rpx;
}

.form-btn {
  flex: 1;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  letter-spacing: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-btn.reset {
  background: #f8f9fa;
  color: #2d8cf0;
  box-shadow: none;
  border: 2rpx solid #e0eaff;
}

.back-section {
  margin: 24rpx 16rpx 0 16rpx;
}

.back-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>