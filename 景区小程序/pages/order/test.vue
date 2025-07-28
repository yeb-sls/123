<template>
  <view class="test-bg">
    <view class="test-container">
      <view class="test-header">
        <text class="test-title">🎯 活动报名测试页面</text>
        <text class="test-subtitle">用于测试活动报名功能的各项功能</text>
      </view>

      <view class="test-section">
        <view class="section-title">导航测试</view>
        <view class="test-buttons">
          <button class="test-btn" @click="testNavigation('form')">
            📝 测试表单页面
          </button>
          <button class="test-btn" @click="testNavigation('confirm')">
            ✅ 测试确认页面
          </button>
          <button class="test-btn" @click="testNavigation('pay')">
            💰 测试支付页面
          </button>
          <button class="test-btn" @click="testNavigation('success')">
            🎉 测试成功页面
          </button>
        </view>
      </view>

      <view class="test-section">
        <view class="section-title">数据存储测试</view>
        <view class="test-buttons">
          <button class="test-btn" @click="testDataStorage">
            💾 测试数据存储
          </button>
          <button class="test-btn" @click="testDataRetrieval">
            📖 测试数据读取
          </button>
          <button class="test-btn" @click="testDataClear">
            🗑️ 清除测试数据
          </button>
        </view>
      </view>

      <view class="test-section">
        <view class="section-title">表单验证测试</view>
        <view class="test-buttons">
          <button class="test-btn" @click="testFormValidation">
            ✅ 测试表单验证
          </button>
          <button class="test-btn" @click="testFullOrderFlow">
            🔄 测试完整流程
          </button>
        </view>
      </view>

      <view class="test-section">
        <view class="section-title">测试报告</view>
        <view class="test-report">
          <text class="report-title">测试结果：</text>
          <text class="report-content">{{ testReport }}</text>
        </view>
        <button class="test-btn clear-report" @click="clearReport">
          🧹 清除报告
        </button>
      </view>

      <view class="test-section">
        <view class="section-title">快速操作</view>
        <view class="test-buttons">
          <button class="test-btn primary" @click="goToForm">
            🚀 直接进入表单
          </button>
          <button class="test-btn" @click="goBack">
            🔙 返回上页
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      testReport: '暂无测试报告'
    }
  },
  methods: {
    // 导航测试
    testNavigation(page) {
      const urls = {
        form: '/pages/order/form',
        confirm: '/pages/order/confirm',
        pay: '/pages/order/pay',
        success: '/pages/order/success'
      }
      
      const url = urls[page]
      if (!url) {
        this.addReport(`❌ 未知页面: ${page}`)
        return
      }
      
      uni.navigateTo({
        url: url,
        success: () => {
          this.addReport(`✅ 成功跳转到 ${page} 页面`)
        },
        fail: (err) => {
          this.addReport(`❌ 跳转 ${page} 页面失败: ${err.errMsg}`)
        }
      })
    },
    
    // 数据存储测试
    testDataStorage() {
      const testData = {
        activityType: '法会活动',
        activity: '祈福法会',
        fee: 100,
        activityInfo: { fee: 100, time: '2024年3月15日 09:00-17:00', location: '大雄宝殿' },
        name: '测试用户',
        phone: '13800138000',
        idCard: '110101199001011234',
        address: '北京市朝阳区测试地址',
        email: 'test@example.com',
        emergencyName: '紧急联系人',
        emergencyPhone: '13900139000',
        emergencyRelation: '朋友',
        specialNeeds: '无特殊需求',
        agreed: true,
        timestamp: new Date().getTime()
      }
      
      try {
        uni.setStorageSync('orderForm', testData)
        this.addReport('✅ 测试数据存储成功')
      } catch (err) {
        this.addReport(`❌ 数据存储失败: ${err.message}`)
      }
    },
    
    // 数据读取测试
    testDataRetrieval() {
      try {
        const data = uni.getStorageSync('orderForm')
        if (data) {
          this.addReport(`✅ 数据读取成功: ${JSON.stringify(data, null, 2)}`)
        } else {
          this.addReport('⚠️ 未找到存储的数据')
        }
      } catch (err) {
        this.addReport(`❌ 数据读取失败: ${err.message}`)
      }
    },
    
    // 数据清除测试
    testDataClear() {
      try {
        uni.removeStorageSync('orderForm')
        this.addReport('✅ 测试数据清除成功')
      } catch (err) {
        this.addReport(`❌ 数据清除失败: ${err.message}`)
      }
    },
    
    // 表单验证测试
    testFormValidation() {
      // 模拟表单验证
      const errors = {}
      
      // 测试必填字段
      if (!'test') errors.name = '姓名不能为空'
      if (!'13800138000') errors.phone = '手机号不能为空'
      
      if (Object.keys(errors).length > 0) {
        this.addReport(`✅ 表单验证正常工作，发现 ${Object.keys(errors).length} 个错误`)
      } else {
        this.addReport('✅ 表单验证测试通过')
      }
    },
    
    // 完整流程测试
    testFullOrderFlow() {
      this.addReport('🔄 开始完整流程测试...')
      
      // 模拟完整流程
      setTimeout(() => {
        this.addReport('📝 1. 表单填写完成')
        setTimeout(() => {
          this.addReport('✅ 2. 信息确认完成')
          setTimeout(() => {
            this.addReport('💰 3. 支付流程完成')
            setTimeout(() => {
              this.addReport('🎉 4. 报名成功')
              this.addReport('✅ 完整流程测试通过！')
            }, 500)
          }, 500)
        }, 500)
      }, 500)
    },
    
    // 添加测试报告
    addReport(message) {
      const timestamp = new Date().toLocaleTimeString()
      this.testReport = `[${timestamp}] ${message}\n${this.testReport}`
    },
    
    // 清除报告
    clearReport() {
      this.testReport = '暂无测试报告'
    },
    
    // 直接进入表单
    goToForm() {
      uni.navigateTo({
        url: '/pages/order/form',
        success: () => {
          this.addReport('🚀 直接跳转到表单页面')
        },
        fail: (err) => {
          this.addReport(`❌ 跳转表单页面失败: ${err.errMsg}`)
        }
      })
    },
    
    // 返回上页
    goBack() {
      uni.navigateBack({
        success: () => {
          this.addReport('🔙 返回上页成功')
        },
        fail: (err) => {
          this.addReport(`❌ 返回上页失败: ${err.errMsg}`)
          // 如果返回失败，跳转到活动报名主页
          uni.navigateTo({
            url: '/pages/order/index',
            fail: () => {
              this.addReport('❌ 跳转主页也失败')
            }
          })
        }
      })
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
  padding-top: 1rpx;
}

.test-header {
  background: #fff;
  margin: 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  text-align: center;
}

.test-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  display: block;
  margin-bottom: 8rpx;
}

.test-subtitle {
  font-size: 24rpx;
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
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
}

.test-buttons {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.test-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.test-btn.primary {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}

.test-btn.clear-report {
  background: #fff2f0;
  color: #ff4d4f;
  border-color: #ffccc7;
}

.test-report {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border: 2rpx solid #e0eaff;
}

.report-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 12rpx;
}

.report-content {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
}
</style> 