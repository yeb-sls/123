<template>
  <view class="form-bg">
    <view class="form-container">
      <!-- 步骤提示 -->
      <view class="step-bar">
        <view class="step active">1. 选择布施</view>
        <view class="step">2. 信息确认</view>
        <view class="step">3. 支付</view>
      </view>

      <!-- 布施类型选择 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">🎁</text>选择布施类型 <text class="required">*</text>
        </view>
        <view class="form-group">
          <picker :range="donateTypes" @change="onSelectType" :value="donateTypeIdx">
            <view class="picker">
              <text class="icon">🛕</text>类型：
              <text v-if="donateTypeIdx >= 0">{{ donateTypes[donateTypeIdx] }}</text>
              <text v-else class="placeholder">请选择布施类型</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <view v-if="errors.donateTypeIdx" class="error-tip">{{ errors.donateTypeIdx }}</view>
        </view>
      </view>

      <!-- 布施内容提示 -->
      <view class="card" v-if="donateTypeIdx < 0">
        <view class="card-title">
          <text class="icon">💡</text>提示
        </view>
        <view class="tip-content">
          <text class="tip-text">请先选择布施类型，然后填写相应的布施内容</text>
        </view>
      </view>

      <!-- 布施内容 -->
      <view class="card" v-if="donateTypeIdx >= 0">
        <view class="card-title">
          <text class="icon">📝</text>布施内容 <text class="required">*</text>
        </view>
        
        <!-- 善款布施 -->
        <view v-if="donateTypeIdx === 0">
          <view class="form-group">
            <input 
              v-model.number="amount" 
              type="number" 
              min="1" 
              placeholder="请输入布施金额（元）" 
              class="input" 
            />
            <view v-if="errors.amount" class="error-tip">{{ errors.amount }}</view>
          </view>
          <view class="amount-tips">
            <text class="tip-text">💡 布施金额建议：</text>
            <view class="tip-items">
              <text class="tip-item">• 10-50元：随喜布施</text>
              <text class="tip-item">• 50-200元：一般布施</text>
              <text class="tip-item">• 200元以上：大布施</text>
            </view>
          </view>
        </view>

        <!-- 实物布施 -->
        <view v-if="donateTypeIdx === 1">
          <view class="form-group">
            <input v-model="itemName" placeholder="请输入物品名称" class="input" maxlength="20" />
            <view v-if="errors.itemName" class="error-tip">{{ errors.itemName }}</view>
          </view>
          <view class="form-group">
            <input v-model.number="itemCount" type="number" min="1" placeholder="请输入物品数量" class="input" />
            <view v-if="errors.itemCount" class="error-tip">{{ errors.itemCount }}</view>
          </view>
          <view class="form-group">
            <textarea v-model="itemDesc" placeholder="请描述物品详情（新旧程度、规格等）" class="textarea" maxlength="100" />
            <view class="word-count">{{ itemDesc.length }}/100</view>
          </view>
        </view>

        <!-- 服务布施 -->
        <view v-if="donateTypeIdx === 2">
          <view class="form-group">
            <textarea v-model="serviceDesc" placeholder="请描述您能提供的服务内容" class="textarea" maxlength="200" />
            <view class="word-count">{{ serviceDesc.length }}/200</view>
          </view>
          <view class="form-group">
            <input v-model="serviceTime" placeholder="可提供服务的时间" class="input" maxlength="50" />
            <view v-if="errors.serviceTime" class="error-tip">{{ errors.serviceTime }}</view>
          </view>
        </view>
      </view>

      <!-- 布施人信息 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">👤</text>布施人信息 <text class="required">*</text>
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
          <textarea v-model="form.address" placeholder="请输入联系地址" class="textarea" maxlength="100" />
          <view v-if="errors.address" class="error-tip">{{ errors.address }}</view>
        </view>
      </view>

      <!-- 许愿语 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">🙏</text>许愿语（可选）
        </view>
        <view class="form-group">
          <textarea 
            v-model="form.wish" 
            placeholder="请输入您的愿望（最多100字）" 
            class="textarea" 
            maxlength="100" 
            @input="onWishInput" 
          />
          <view class="word-count">{{ form.wish.length }}/100</view>
        </view>
      </view>

      <!-- 价格预览 -->
      <view class="card price-card" v-if="showPrice">
        <view class="card-title">
          <text class="icon">💰</text>费用预览
        </view>
        <view class="price-item">
          <text>布施费用：</text>
          <text class="price">¥{{ calculatePrice() }}</text>
        </view>
        <view class="price-total">
          <text>总计：</text>
          <text class="total-price">¥{{ calculatePrice() }}</text>
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
      donateTypes: ['善款', '实物', '服务'],
      donateTypeIdx: -1,
      amount: '',
      itemName: '',
      itemCount: '',
      itemDesc: '',
      serviceDesc: '',
      serviceTime: '',
      form: {
        name: '',
        phone: '',
        idCard: '',
        address: '',
        wish: ''
      },
      errors: {},
      loading: false
    }
  },
  computed: {
    showPrice() {
      return this.donateTypeIdx === 0 && this.amount > 0
    }
  },
  methods: {
    onSelectType(e) {
      this.donateTypeIdx = e.detail.value
      this.errors = {}
    },
    onWishInput() {
      if (this.form.wish.length > 100) {
        this.form.wish = this.form.wish.slice(0, 100)
      }
    },
    calculatePrice() {
      if (this.donateTypeIdx === 0 && this.amount) {
        return parseFloat(this.amount)
      }
      return 0
    },
    validate() {
      const errors = {}
      
      if (this.donateTypeIdx < 0) errors.donateTypeIdx = '请选择布施类型'
      
      if (this.donateTypeIdx === 0) {
        if (!this.amount || this.amount < 1) errors.amount = '请输入正确的布施金额'
      }
      
      if (this.donateTypeIdx === 1) {
        if (!this.itemName) errors.itemName = '请输入物品名称'
        if (!this.itemCount || this.itemCount < 1) errors.itemCount = '请输入正确的物品数量'
      }
      
      if (this.donateTypeIdx === 2) {
        if (!this.serviceDesc) errors.serviceDesc = '请描述服务内容'
        if (!this.serviceTime) errors.serviceTime = '请输入可提供服务的时间'
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
        donateType: this.donateTypes[this.donateTypeIdx],
        amount: this.amount,
        itemName: this.itemName,
        itemCount: this.itemCount,
        itemDesc: this.itemDesc,
        serviceDesc: this.serviceDesc,
        serviceTime: this.serviceTime,
        name: this.form.name,
        phone: this.form.phone,
        idCard: this.form.idCard,
        address: this.form.address,
        wish: this.form.wish,
        totalPrice: this.calculatePrice(),
        timestamp: new Date().getTime()
      }
      
      // 保存到本地存储
      uni.setStorageSync('gongdeOrder', confirmData)
      
      setTimeout(() => {
        this.loading = false
        // 跳转到确认页
        uni.navigateTo({ 
          url: '/pages/gongde/confirm',
          success: () => {
            console.log('跳转到功德布施确认页成功')
          },
          fail: (err) => {
            console.error('跳转失败:', err)
            uni.showToast({ title: '页面跳转失败', icon: 'none' })
          }
        })
      }, 800)
    },
    resetForm() {
      this.donateTypeIdx = -1
      this.amount = ''
      this.itemName = ''
      this.itemCount = ''
      this.itemDesc = ''
      this.serviceDesc = ''
      this.serviceTime = ''
      this.form = {
        name: '',
        phone: '',
        idCard: '',
        address: '',
        wish: ''
      }
      this.errors = {}
    },
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回上页成功')
        },
        fail: (err) => {
          console.error('返回上页失败:', err)
          // 如果返回失败，跳转到功德布施主页
          uni.navigateTo({ 
            url: '/pages/gongde/index',
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
    const last = uni.getStorageSync('gongdeOrder')
    if (last) {
      this.donateTypeIdx = this.donateTypes.indexOf(last.donateType)
      this.amount = last.amount || ''
      this.itemName = last.itemName || ''
      this.itemCount = last.itemCount || ''
      this.itemDesc = last.itemDesc || ''
      this.serviceDesc = last.serviceDesc || ''
      this.serviceTime = last.serviceTime || ''
      this.form.name = last.name || ''
      this.form.phone = last.phone || ''
      this.form.idCard = last.idCard || ''
      this.form.address = last.address || ''
      this.form.wish = last.wish || ''
    }
  }
}
</script>

<style scoped>
.form-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.form-container {
  padding-bottom: 40rpx;
  padding-top: 1rpx;
}
.step-bar {
  display: flex;
  justify-content: space-between;
  margin: 32rpx 0 24rpx 0;
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
.tip-content {
  padding: 16rpx 0;
}
.tip-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
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

.amount-tips {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border-radius: 8rpx;
  padding: 16rpx;
  border: 2rpx solid #ffd591;
  margin-top: 16rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.tip-items {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.tip-item {
  font-size: 24rpx;
  color: #999;
}

.price-card {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border: 2rpx solid #ffd591;
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