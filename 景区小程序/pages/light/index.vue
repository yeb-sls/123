<template>
  <view class="page-container">
    <!-- 顶部图文介绍 -->
    <view class="header-section">
      <image :src="headImage" class="banner" mode="widthFix" />
      <view class="intro-card">
        <view class="intro-title">
          <text class="icon">🕯️</text>供灯祈福
        </view>
        <view class="intro-text">
          点亮心灯，照亮前程。在佛前供灯，不仅是对佛法的供养，更是对内心的净化与升华。
          愿您的心愿如灯光明亮，照亮人生的每一个角落。
        </view>
      </view>
    </view>

    <!-- 步骤提示 -->
    <view class="step-bar">
      <view class="step active">1. 选择供灯</view>
      <view class="step">2. 信息确认</view>
      <view class="step">3. 支付</view>
    </view>

    <!-- 灯塔选择 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">🏮</text>选择灯塔 <text class="required">*</text>
      </view>
      <view class="form-group">
        <picker :range="towerOptions" @change="onSelectTower" :value="towerIndex">
          <view class="picker">
            <text class="icon">🏛️</text>灯塔：
            <text v-if="towerIndex >= 0">{{ towerOptions[towerIndex] }}</text>
            <text v-else class="placeholder">请选择灯塔</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <view v-if="errors.towerIndex" class="error-tip">{{ errors.towerIndex }}</view>
      </view>
      
      <view class="form-group" v-if="towerIndex >= 0">
        <picker :range="levelOptions" @change="onSelectLevel" :value="levelIndex">
          <view class="picker">
            <text class="icon">📊</text>楼层：
            <text v-if="levelIndex >= 0">{{ levelOptions[levelIndex] }}</text>
            <text v-else class="placeholder">请选择楼层</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <view v-if="errors.levelIndex" class="error-tip">{{ errors.levelIndex }}</view>
      </view>
      
      <view class="form-group" v-if="levelIndex >= 0 && timeOptions.length > 0">
        <picker :range="timeOptions" @change="onSelectTime" :value="timeIndex">
          <view class="picker">
            <text class="icon">⏰</text>时间：
            <text v-if="timeIndex >= 0">{{ timeOptions[timeIndex] }}</text>
            <text v-else class="placeholder">请选择时间</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        <view v-if="errors.timeIndex" class="error-tip">{{ errors.timeIndex }}</view>
      </view>
    </view>

    <!-- 供灯人信息 -->
    <view class="card">
      <view class="card-title">
        <text class="icon">👤</text>供灯人信息 <text class="required">*</text>
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

    <!-- 价格预览 -->
    <view class="card price-card" v-if="selectedPrice > 0">
      <view class="card-title">
        <text class="icon">💰</text>费用预览
      </view>
      <view class="price-item">
        <text>供灯费用：</text>
        <text class="price">¥{{ selectedPrice }}</text>
      </view>
      <view class="price-item" v-if="form.receiver.name">
        <text>邮寄费用：</text>
        <text class="price">¥{{ shippingFee }}</text>
      </view>
      <view class="price-total">
        <text>总计：</text>
        <text class="total-price">¥{{ totalPrice }}</text>
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
</template>

<script>
export default {
  data() {
    return {
      headImage: 'https://resource.yunzhankeji.com/upload/2021/12/20211207140033729.jpg',
      showReceiver: true,
      loading: false,
      towerIndex: -1,
      levelIndex: -1,
      timeIndex: -1,
      towers: [
        {
          id: 'towerA',
          name: '大愿灯塔A',
          levels: [
            {
              id: 'L1',
              name: '一层',
              available: 5,
              times: [
                { name: '七天', price: 88 },
                { name: '一月', price: 188 },
                { name: '一年', price: 588 }
              ]
            },
            {
              id: 'L2',
              name: '二层',
              available: 3,
              times: [
                { name: '七天', price: 128 },
                { name: '一月', price: 288 },
                { name: '一年', price: 888 }
              ]
            },
            {
              id: 'L3',
              name: '三层',
              available: 0,
              times: []
            }
          ]
        },
        {
          id: 'towerB',
          name: '智慧灯塔B',
          levels: [
            {
              id: 'L1',
              name: '一层',
              available: 8,
              times: [
                { name: '七天', price: 68 },
                { name: '一月', price: 158 },
                { name: '一年', price: 488 }
              ]
            },
            {
              id: 'L2',
              name: '二层',
              available: 6,
              times: [
                { name: '七天', price: 98 },
                { name: '一月', price: 218 },
                { name: '一年', price: 688 }
              ]
            }
          ]
        }
      ],
      form: {
        name: '',
        phone: '',
        idCard: '',
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
    timeOptions() {
      return this.selectedLevel?.times.map(t => t.name) || []
    },
    selectedTime() {
      return this.selectedLevel?.times[this.timeIndex] || null
    },
    selectedPrice() {
      return this.selectedTime?.price || 0
    },
    totalPrice() {
      const basePrice = this.selectedPrice
      const shipping = this.form.receiver.name ? this.shippingFee : 0
      return basePrice + shipping
    }
  },
  methods: {
    onWishInput() {
      if (this.form.wish.length > 100) {
        this.form.wish = this.form.wish.slice(0, 100)
      }
    },
    onSelectTower(e) {
      this.towerIndex = e.detail.value
      this.levelIndex = -1
      this.timeIndex = -1
      this.errors = {}
    },
    onSelectLevel(e) {
      this.levelIndex = e.detail.value
      this.timeIndex = -1
      this.errors = {}
    },
    onSelectTime(e) {
      this.timeIndex = e.detail.value
      this.errors = {}
    },
    validate() {
      const errors = {}
      
      if (this.towerIndex < 0) errors.towerIndex = '请选择灯塔'
      if (this.levelIndex < 0) errors.levelIndex = '请选择楼层'
      if (this.timeIndex < 0) errors.timeIndex = '请选择时间'
      
      if (!this.form.name) errors.name = '请输入姓名'
      else if (this.form.name.length < 2) errors.name = '姓名需2-10字'
      
      if (!this.form.phone) errors.phone = '请输入联系电话'
      else if (!/^1[3-9]\d{9}$/.test(this.form.phone)) errors.phone = '手机号格式不正确'
      
      if (!this.form.idCard) errors.idCard = '请输入身份证号'
      else if (!/^\d{17}[\dXx]$/.test(this.form.idCard)) errors.idCard = '身份证号格式不正确'
      
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
        towerId: this.selectedTower.id,
        levelId: this.selectedLevel.id,
        towerName: this.selectedTower.name,
        levelName: this.selectedLevel.name,
        time: this.selectedTime.name,
        price: this.selectedPrice,
        totalPrice: this.totalPrice,
        name: this.form.name,
        phone: this.form.phone,
        idCard: this.form.idCard,
        wish: this.form.wish,
        receiver: this.form.receiver,
        timestamp: new Date().getTime()
      }
      
      // 保存到本地存储
      uni.setStorageSync('lightOrder', confirmData)
      
      setTimeout(() => {
        this.loading = false
        // 跳转到确认页
        uni.navigateTo({ 
          url: '/pages/light/confirm',
          success: () => {
            console.log('跳转到供灯确认页成功')
          },
          fail: (err) => {
            console.error('跳转失败:', err)
            uni.showToast({ title: '页面跳转失败', icon: 'none' })
          }
        })
      }, 800)
    },
    resetForm() {
      this.towerIndex = -1
      this.levelIndex = -1
      this.timeIndex = -1
      this.form = {
        name: '',
        phone: '',
        idCard: '',
        wish: '',
        receiver: {
          name: '',
          phone: '',
          address: '',
          remark: ''
        }
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
          // 如果返回失败，跳转到首页
          uni.navigateTo({ 
            url: '/pages/index/index',
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
    const last = uni.getStorageSync('lightOrder')
    if (last) {
      // 恢复灯塔选择
      const towerIdx = this.towers.findIndex(t => t.id === last.towerId)
      if (towerIdx >= 0) {
        this.towerIndex = towerIdx
        const levelIdx = this.towers[towerIdx].levels.findIndex(l => l.id === last.levelId)
        if (levelIdx >= 0) {
          this.levelIndex = levelIdx
          const timeIdx = this.towers[towerIdx].levels[levelIdx].times.findIndex(t => t.name === last.time)
          if (timeIdx >= 0) {
            this.timeIndex = timeIdx
          }
        }
      }
      
      // 恢复表单数据
      this.form.name = last.name || ''
      this.form.phone = last.phone || ''
      this.form.idCard = last.idCard || ''
      this.form.wish = last.wish || ''
      this.form.receiver = last.receiver || {
        name: '',
        phone: '',
        address: '',
        remark: ''
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.header-section {
  margin-bottom: 24rpx;
}

.banner {
  width: 100%;
  height: 300rpx;
}

.intro-card {
  background: #fff;
  margin: 0 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  margin-top: -20rpx;
  position: relative;
  z-index: 1;
}

.intro-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.intro-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
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
  margin-top: 16rpx;
  padding-top: 16rpx;
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
