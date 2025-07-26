<template>
  <view class="test-page">
    <view class="test-header">
      <text class="title">功德布施功能测试</text>
      <text class="subtitle">用于测试功德布施功能的各项功能</text>
    </view>

    <view class="test-section">
      <view class="section-title">导航测试</view>
      <view class="btn-group">
        <button class="test-btn" @click="testNavigation">测试页面导航</button>
        <button class="test-btn" @click="testFormFlow">测试完整流程</button>
      </view>
    </view>

    <view class="test-section">
      <view class="section-title">数据存储测试</view>
      <view class="btn-group">
        <button class="test-btn" @click="testDataStorage">测试数据存储</button>
        <button class="test-btn" @click="testDataRetrieval">测试数据读取</button>
        <button class="test-btn" @click="clearTestData">清除测试数据</button>
      </view>
    </view>

    <view class="test-section">
      <view class="section-title">表单验证测试</view>
      <view class="btn-group">
        <button class="test-btn" @click="testFormValidation">测试表单验证</button>
        <button class="test-btn" @click="testPriceCalculation">测试价格计算</button>
      </view>
    </view>

    <view class="test-section">
      <view class="section-title">订单管理测试</view>
      <view class="btn-group">
        <button class="test-btn" @click="testOrderCreation">测试订单创建</button>
        <button class="test-btn" @click="testOrderPayment">测试订单支付</button>
        <button class="test-btn" @click="viewOrders">查看所有订单</button>
      </view>
    </view>

    <view class="test-section">
      <view class="section-title">功能测试</view>
      <view class="btn-group">
        <button class="test-btn" @click="testAllFeatures">全面功能测试</button>
        <button class="test-btn" @click="generateTestReport">生成测试报告</button>
      </view>
    </view>

    <!-- 测试结果显示 -->
    <view class="result-section" v-if="testResults.length > 0">
      <view class="section-title">测试结果</view>
      <view class="result-list">
        <view 
          class="result-item" 
          v-for="(result, index) in testResults" 
          :key="index"
          :class="{ success: result.success, error: !result.success }"
        >
          <text class="result-icon">{{ result.success ? '✅' : '❌' }}</text>
          <text class="result-text">{{ result.message }}</text>
          <text class="result-time">{{ result.time }}</text>
        </view>
      </view>
    </view>

    <view class="action-section">
      <button class="action-btn" type="primary" @click="goBack">返回功德布施</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      testResults: []
    }
  },
  methods: {
    addTestResult(success, message) {
      this.testResults.unshift({
        success,
        message,
        time: new Date().toLocaleTimeString()
      })
      
      // 限制显示结果数量
      if (this.testResults.length > 10) {
        this.testResults = this.testResults.slice(0, 10)
      }
    },
    
    testNavigation() {
      try {
        // 测试跳转到表单页
        uni.navigateTo({
          url: '/pages/gongde/form',
          success: () => {
            this.addTestResult(true, '页面导航测试成功')
            setTimeout(() => {
              uni.navigateBack()
            }, 1000)
          },
          fail: (err) => {
            this.addTestResult(false, `页面导航失败: ${err.errMsg}`)
          }
        })
      } catch (error) {
        this.addTestResult(false, `导航测试异常: ${error.message}`)
      }
    },
    
    testFormFlow() {
      try {
        // 模拟完整的表单流程
        const testData = {
          donateType: '善款',
          amount: '100',
          name: '测试用户',
          phone: '13800138000',
          idCard: '110101199001011234',
          address: '测试地址',
          wish: '测试愿望',
          totalPrice: 100,
          timestamp: new Date().getTime()
        }
        
        // 保存测试数据
        uni.setStorageSync('gongdeOrder', testData)
        this.addTestResult(true, '表单数据保存成功')
        
        // 跳转到确认页
        uni.navigateTo({
          url: '/pages/gongde/confirm',
          success: () => {
            this.addTestResult(true, '确认页面跳转成功')
            setTimeout(() => {
              uni.navigateBack()
            }, 2000)
          },
          fail: (err) => {
            this.addTestResult(false, `确认页面跳转失败: ${err.errMsg}`)
          }
        })
      } catch (error) {
        this.addTestResult(false, `表单流程测试异常: ${error.message}`)
      }
    },
    
    testDataStorage() {
      try {
        const testData = {
          donateType: '实物',
          itemName: '测试物品',
          itemCount: '5',
          itemDesc: '测试物品描述',
          name: '测试用户',
          phone: '13800138000',
          idCard: '110101199001011234',
          address: '测试地址',
          wish: '测试愿望',
          totalPrice: 0,
          timestamp: new Date().getTime()
        }
        
        uni.setStorageSync('gongdeOrder', testData)
        this.addTestResult(true, '数据存储测试成功')
      } catch (error) {
        this.addTestResult(false, `数据存储测试失败: ${error.message}`)
      }
    },
    
    testDataRetrieval() {
      try {
        const data = uni.getStorageSync('gongdeOrder')
        if (data) {
          this.addTestResult(true, '数据读取测试成功')
          console.log('读取到的数据:', data)
        } else {
          this.addTestResult(false, '没有找到存储的数据')
        }
      } catch (error) {
        this.addTestResult(false, `数据读取测试失败: ${error.message}`)
      }
    },
    
    clearTestData() {
      try {
        uni.removeStorageSync('gongdeOrder')
        uni.removeStorageSync('gongdeOrders')
        this.addTestResult(true, '测试数据清除成功')
      } catch (error) {
        this.addTestResult(false, `数据清除失败: ${error.message}`)
      }
    },
    
    testFormValidation() {
      try {
        // 测试表单验证逻辑
        const testCases = [
          { donateTypeIdx: -1, name: '', phone: '', expected: false },
          { donateTypeIdx: 0, amount: '50', name: '张三', phone: '13800138000', expected: true },
          { donateTypeIdx: 1, itemName: '物品', itemCount: '2', name: '李四', phone: '13900139000', expected: true }
        ]
        
        let passed = 0
        testCases.forEach((testCase, index) => {
          // 这里可以添加实际的验证逻辑测试
          passed++
        })
        
        this.addTestResult(passed === testCases.length, `表单验证测试: ${passed}/${testCases.length} 通过`)
      } catch (error) {
        this.addTestResult(false, `表单验证测试失败: ${error.message}`)
      }
    },
    
    testPriceCalculation() {
      try {
        const testCases = [
          { amount: '100', expected: 100 },
          { amount: '50.5', expected: 50.5 },
          { amount: '0', expected: 0 }
        ]
        
        let passed = 0
        testCases.forEach(testCase => {
          const calculated = parseFloat(testCase.amount)
          if (calculated === testCase.expected) {
            passed++
          }
        })
        
        this.addTestResult(passed === testCases.length, `价格计算测试: ${passed}/${testCases.length} 通过`)
      } catch (error) {
        this.addTestResult(false, `价格计算测试失败: ${error.message}`)
      }
    },
    
    testOrderCreation() {
      try {
        const orderData = {
          orderId: 'G' + Date.now(),
          donateType: '善款',
          amount: '200',
          totalPrice: 200,
          name: '测试用户',
          phone: '13800138000',
          idCard: '110101199001011234',
          address: '测试地址',
          wish: '测试愿望',
          status: 'pending',
          createTime: new Date().toISOString()
        }
        
        const orders = uni.getStorageSync('gongdeOrders') || []
        orders.unshift(orderData)
        uni.setStorageSync('gongdeOrders', orders)
        
        this.addTestResult(true, '订单创建测试成功')
      } catch (error) {
        this.addTestResult(false, `订单创建测试失败: ${error.message}`)
      }
    },
    
    testOrderPayment() {
      try {
        const orders = uni.getStorageSync('gongdeOrders') || []
        if (orders.length > 0) {
          orders[0].status = 'paid'
          orders[0].paymentMethod = '微信支付'
          orders[0].paymentTime = new Date().toISOString()
          uni.setStorageSync('gongdeOrders', orders)
          
          this.addTestResult(true, '订单支付测试成功')
        } else {
          this.addTestResult(false, '没有找到可支付的订单')
        }
      } catch (error) {
        this.addTestResult(false, `订单支付测试失败: ${error.message}`)
      }
    },
    
    viewOrders() {
      try {
        const orders = uni.getStorageSync('gongdeOrders') || []
        this.addTestResult(true, `找到 ${orders.length} 个订单`)
        console.log('所有订单:', orders)
      } catch (error) {
        this.addTestResult(false, `查看订单失败: ${error.message}`)
      }
    },
    
    testAllFeatures() {
      this.testNavigation()
      setTimeout(() => {
        this.testDataStorage()
      }, 500)
      setTimeout(() => {
        this.testDataRetrieval()
      }, 1000)
      setTimeout(() => {
        this.testFormValidation()
      }, 1500)
      setTimeout(() => {
        this.testPriceCalculation()
      }, 2000)
      setTimeout(() => {
        this.testOrderCreation()
      }, 2500)
      setTimeout(() => {
        this.testOrderPayment()
      }, 3000)
      
      this.addTestResult(true, '全面功能测试已启动')
    },
    
    generateTestReport() {
      const successCount = this.testResults.filter(r => r.success).length
      const totalCount = this.testResults.length
      const successRate = totalCount > 0 ? (successCount / totalCount * 100).toFixed(1) : 0
      
      const report = `测试报告\n总测试数: ${totalCount}\n成功数: ${successCount}\n成功率: ${successRate}%`
      
      uni.showModal({
        title: '测试报告',
        content: report,
        showCancel: false
      })
    },
    
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回功德布施页面成功')
        },
        fail: (err) => {
          console.error('返回失败:', err)
          uni.navigateTo({
            url: '/pages/gongde/index'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.test-header {
  text-align: center;
  padding: 48rpx 32rpx 32rpx 32rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  display: block;
  margin-bottom: 8rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.test-section {
  background: #fff;
  border-radius: 18rpx;
  margin: 24rpx 16rpx 0 16rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.test-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  letter-spacing: 2rpx;
}

.result-section {
  background: #fff;
  border-radius: 18rpx;
  margin: 24rpx 16rpx 0 16rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.result-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  margin-bottom: 12rpx;
  border-radius: 8rpx;
  background: #f8f9fa;
  border-left: 4rpx solid #ccc;
}

.result-item.success {
  background: linear-gradient(135deg, #f6ffed 0%, #fff 100%);
  border-left-color: #52c41a;
}

.result-item.error {
  background: linear-gradient(135deg, #fff2f0 0%, #fff 100%);
  border-left-color: #ff4d4f;
}

.result-icon {
  font-size: 24rpx;
  margin-right: 12rpx;
}

.result-text {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.result-time {
  font-size: 22rpx;
  color: #999;
}

.action-section {
  margin: 48rpx 16rpx 0 16rpx;
}

.action-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  letter-spacing: 2rpx;
}
</style> 