<template>
  <view class="test-bg">
    <view class="test-container">
      <!-- 测试标题 -->
      <view class="test-header">
        <view class="test-title">殿堂供品功能测试</view>
        <view class="test-desc">用于验证殿堂供品功能的完整流程</view>
      </view>

      <!-- 测试按钮 -->
      <view class="test-buttons">
        <button class="test-btn" @click="testNavigation">测试页面导航</button>
        <button class="test-btn" @click="testDataStorage">测试数据存储</button>
        <button class="test-btn" @click="testFormValidation">测试表单验证</button>
        <button class="test-btn" @click="testOrderFlow">测试完整流程</button>
        <button class="test-btn" @click="clearTestData">清除测试数据</button>
      </view>

      <!-- 测试结果 -->
      <view class="test-results" v-if="testResults.length > 0">
        <view class="results-title">测试结果</view>
        <view class="result-item" v-for="(result, index) in testResults" :key="index">
          <text class="result-time">{{ result.time }}</text>
          <text class="result-message" :class="result.type">{{ result.message }}</text>
        </view>
      </view>

      <!-- 数据展示 -->
      <view class="data-display" v-if="showData">
        <view class="data-title">当前数据</view>
        <view class="data-content">
          <text class="data-label">殿堂订单：</text>
          <text class="data-value">{{ hallOrders.length }} 个</text>
        </view>
        <view class="data-content">
          <text class="data-label">临时数据：</text>
          <text class="data-value">{{ hasTempData ? '有' : '无' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      testResults: [],
      showData: false,
      hallOrders: [],
      hasTempData: false
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    loadData() {
      // 加载殿堂订单数据
      this.hallOrders = uni.getStorageSync('hallOrders') || []
      
      // 检查临时数据
      const tempData = uni.getStorageSync('hallOrder')
      this.hasTempData = !!tempData
      
      this.showData = true
    },
    addResult(type, message) {
      const time = new Date().toLocaleTimeString()
      this.testResults.unshift({
        time,
        type,
        message
      })
      
      // 限制显示数量
      if (this.testResults.length > 10) {
        this.testResults = this.testResults.slice(0, 10)
      }
    },
    testNavigation() {
      this.addResult('info', '开始测试页面导航...')
      
      // 测试跳转到表单页
      uni.navigateTo({
        url: '/pages/hall/form',
        success: () => {
          this.addResult('success', '跳转到表单页成功')
        },
        fail: (err) => {
          this.addResult('error', '跳转到表单页失败: ' + err.errMsg)
        }
      })
    },
    testDataStorage() {
      this.addResult('info', '开始测试数据存储...')
      
      // 创建测试数据
      const testData = {
        hallId: 0,
        hallName: '大雄宝殿',
        offerings: [
          {
            name: '香',
            description: '清香一炷，祈愿平安',
            price: 20,
            unit: '炷',
            qty: 2
          },
          {
            name: '花',
            description: '鲜花供品，祈愿吉祥',
            price: 30,
            unit: '束',
            qty: 1
          }
        ],
        totalPrice: 70,
        name: '测试用户',
        phone: '13800138000',
        idCard: '110101199001011234',
        address: '北京市朝阳区测试地址',
        wish: '愿世界和平，众生安康',
        receiver: {
          name: '收件人',
          phone: '13900139000',
          address: '北京市海淀区收件地址',
          remark: '测试备注'
        },
        timestamp: new Date().getTime()
      }
      
      // 保存测试数据
      uni.setStorageSync('hallOrder', testData)
      
      // 创建测试订单
      const testOrder = {
        ...testData,
        orderId: 'H' + Date.now(),
        status: 'paid',
        payTime: new Date().toISOString(),
        paymentMethod: '微信支付'
      }
      
      const orders = uni.getStorageSync('hallOrders') || []
      orders.unshift(testOrder)
      uni.setStorageSync('hallOrders', orders)
      
      this.addResult('success', '测试数据存储成功')
      this.loadData()
    },
    testFormValidation() {
      this.addResult('info', '开始测试表单验证...')
      
      // 模拟表单验证
      const testCases = [
        { name: '', phone: '13800138000', expected: '姓名不能为空' },
        { name: '测试', phone: '123', expected: '手机号格式错误' },
        { name: '测试用户', phone: '13800138000', expected: '验证通过' }
      ]
      
      testCases.forEach((testCase, index) => {
        setTimeout(() => {
          if (testCase.name === '') {
            this.addResult('error', `测试用例${index + 1}: ${testCase.expected}`)
          } else if (testCase.phone === '123') {
            this.addResult('error', `测试用例${index + 1}: ${testCase.expected}`)
          } else {
            this.addResult('success', `测试用例${index + 1}: ${testCase.expected}`)
          }
        }, index * 500)
      })
    },
    testOrderFlow() {
      this.addResult('info', '开始测试完整订单流程...')
      
      // 模拟完整流程
      const steps = [
        '1. 选择殿堂',
        '2. 选择供品',
        '3. 填写信息',
        '4. 确认订单',
        '5. 支付完成'
      ]
      
      steps.forEach((step, index) => {
        setTimeout(() => {
          this.addResult('success', step)
          
          if (index === steps.length - 1) {
            this.addResult('success', '完整流程测试完成')
          }
        }, index * 800)
      })
    },
    clearTestData() {
      this.addResult('info', '开始清除测试数据...')
      
      // 清除所有相关数据
      uni.removeStorageSync('hallOrder')
      uni.removeStorageSync('hallOrders')
      
      this.addResult('success', '测试数据清除成功')
      this.loadData()
    }
  }
}
</script>

<style scoped>
.test-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.test-container {
  padding: 32rpx 16rpx 0 16rpx;
}

.test-header {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  text-align: center;
}

.test-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 8rpx;
}

.test-desc {
  font-size: 26rpx;
  color: #666;
}

.test-buttons {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.test-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.test-results {
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.results-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-time {
  font-size: 22rpx;
  color: #999;
  flex-shrink: 0;
  margin-right: 16rpx;
}

.result-message {
  flex: 1;
  font-size: 24rpx;
  word-break: break-all;
}

.result-message.success {
  color: #52c41a;
}

.result-message.error {
  color: #ff4d4f;
}

.result-message.info {
  color: #2d8cf0;
}

.data-display {
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.data-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
}

.data-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
  font-size: 26rpx;
}

.data-label {
  color: #666;
}

.data-value {
  color: #333;
  font-weight: bold;
}
</style> 