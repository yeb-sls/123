<template>
  <view class="test-container">
    <view class="test-header">
      <text class="test-title">后台管理系统测试</text>
      <text class="test-desc">验证后台管理功能是否正常</text>
    </view>

    <view class="test-section">
      <view class="section-title">功能测试</view>
      <view class="test-items">
        <view class="test-item" @click="testBanner">
          <text class="test-icon">🖼️</text>
          <text class="test-name">轮播图管理</text>
        </view>
        <view class="test-item" @click="testNav">
          <text class="test-icon">🔗</text>
          <text class="test-name">导航管理</text>
        </view>
        <view class="test-item" @click="testIntro">
          <text class="test-icon">📝</text>
          <text class="test-name">介绍管理</text>
        </view>
      </view>
    </view>

    <view class="test-section">
      <view class="section-title">云函数测试</view>
      <view class="test-items">
        <view class="test-item" @click="testCloudFunction('getHomeBanners')">
          <text class="test-icon">☁️</text>
          <text class="test-name">获取轮播图</text>
        </view>
        <view class="test-item" @click="testCloudFunction('getHomeNavs')">
          <text class="test-icon">☁️</text>
          <text class="test-name">获取导航</text>
        </view>
        <view class="test-item" @click="testCloudFunction('getHomeIntros')">
          <text class="test-icon">☁️</text>
          <text class="test-name">获取介绍</text>
        </view>
        <view class="test-item" @click="initDatabase">
          <text class="test-icon">🗄️</text>
          <text class="test-name">初始化数据库</text>
        </view>
        <view class="test-item" @click="testBannerFunctions">
          <text class="test-icon">🖼️</text>
          <text class="test-name">测试轮播图云函数</text>
        </view>
      </view>
    </view>

    <view class="test-section">
      <view class="section-title">系统信息</view>
      <view class="info-items">
        <view class="info-item">
          <text class="info-label">uniCloud状态：</text>
          <text class="info-value">{{ cloudStatus }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">云函数数量：</text>
          <text class="info-value">{{ cloudFunctionCount }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">数据库集合：</text>
          <text class="info-value">{{ databaseCollections }}</text>
        </view>
      </view>
    </view>

    <view class="test-section">
      <view class="section-title">测试结果</view>
      <view class="result-list">
        <view v-for="(result, index) in testResults" :key="index" class="result-item" :class="result.status">
          <text class="result-icon">{{ result.status === 'success' ? '✅' : '❌' }}</text>
          <text class="result-text">{{ result.message }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cloudStatus: '检查中...',
      cloudFunctionCount: 0,
      databaseCollections: 0,
      testResults: []
    }
  },
  onLoad() {
    this.checkSystemStatus()
  },
  methods: {
    // 检查系统状态
    async checkSystemStatus() {
      try {
        // 检查uniCloud连接
        const result = await uniCloud.callFunction({
          name: 'getHomeBanners'
        })
        this.cloudStatus = '已连接'
        this.addTestResult('success', 'uniCloud连接正常')
      } catch (error) {
        this.cloudStatus = '连接失败'
        this.addTestResult('error', 'uniCloud连接失败：' + error.message)
      }
    },

    // 测试轮播图管理
    testBanner() {
      uni.navigateTo({
        url: '/pages/admin/home/banner',
        success: () => {
          this.addTestResult('success', '轮播图管理页面跳转成功')
        },
        fail: (err) => {
          this.addTestResult('error', '轮播图管理页面跳转失败：' + err.errMsg)
        }
      })
    },

    // 测试导航管理
    testNav() {
      uni.navigateTo({
        url: '/pages/admin/home/nav',
        success: () => {
          this.addTestResult('success', '导航管理页面跳转成功')
        },
        fail: (err) => {
          this.addTestResult('error', '导航管理页面跳转失败：' + err.errMsg)
        }
      })
    },

    // 测试介绍管理
    testIntro() {
      uni.navigateTo({
        url: '/pages/admin/home/intro',
        success: () => {
          this.addTestResult('success', '介绍管理页面跳转成功')
        },
        fail: (err) => {
          this.addTestResult('error', '介绍管理页面跳转失败：' + err.errMsg)
        }
      })
    },

    // 测试云函数
    async testCloudFunction(functionName) {
      try {
        const result = await uniCloud.callFunction({
          name: functionName
        })
        this.addTestResult('success', `${functionName} 云函数调用成功`)
        console.log(`${functionName} 结果:`, result)
      } catch (error) {
        this.addTestResult('error', `${functionName} 云函数调用失败：${error.message}`)
      }
    },

    // 测试轮播图相关云函数
    async testBannerFunctions() {
      this.addTestResult('info', '开始测试轮播图相关云函数...')
      
      try {
        // 测试获取轮播图
        const getResult = await uniCloud.callFunction({ name: 'getHomeBanners' })
        this.addTestResult('success', 'getHomeBanners云函数正常')
        console.log('轮播图数据:', getResult)
        
        // 测试添加轮播图
        const testBanner = {
          title: '测试轮播图',
          description: '这是一个测试轮播图',
          imageUrl: 'https://p2.itc.cn/q_70/images01/20211028/f0c35680e83a488cbecc2375c11b6e6f.jpeg',
          linkUrl: '',
          status: '启用'
        }
        
        const addResult = await uniCloud.callFunction({
          name: 'addHomeBanner',
          data: { banner: testBanner }
        })
        this.addTestResult('success', 'addHomeBanner云函数正常')
        console.log('添加轮播图结果:', addResult)
        
        // 测试更新轮播图
        if (addResult.result && addResult.result.data) {
          const updateBanner = { ...testBanner, title: '更新后的测试轮播图' }
          const updateResult = await uniCloud.callFunction({
            name: 'updateHomeBanner',
            data: { id: addResult.result.data._id, banner: updateBanner }
          })
          this.addTestResult('success', 'updateHomeBanner云函数正常')
          console.log('更新轮播图结果:', updateResult)
        }
        
      } catch (error) {
        this.addTestResult('error', '轮播图云函数测试失败: ' + error.message)
        console.error('轮播图测试失败:', error)
      }
    },

    // 初始化数据库
    async initDatabase() {
      try {
        const result = await uniCloud.callFunction({
          name: 'initDatabase'
        })
        this.addTestResult('success', '数据库初始化成功')
        console.log('数据库初始化结果:', result)
        
        // 更新系统信息
        if (result.result && result.result.data) {
          this.cloudFunctionCount = result.result.data.length
          this.databaseCollections = result.result.data.filter(item => item.status === 'exists').length
        }
      } catch (error) {
        this.addTestResult('error', '数据库初始化失败：' + error.message)
      }
    },

    // 添加测试结果
    addTestResult(status, message) {
      this.testResults.unshift({
        status,
        message,
        time: new Date().toLocaleTimeString()
      })
      
      // 限制结果数量
      if (this.testResults.length > 10) {
        this.testResults = this.testResults.slice(0, 10)
      }
    }
  }
}
</script>

<style scoped>
.test-container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.test-header {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.test-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.test-desc {
  font-size: 28rpx;
  color: #666;
}

.test-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.test-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200rpx, 1fr));
  gap: 20rpx;
}

.test-item {
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.test-item:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.test-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
  display: block;
}

.test-name {
  font-size: 28rpx;
  color: #333;
  display: block;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.info-label {
  font-size: 28rpx;
  color: #333;
}

.info-value {
  font-size: 28rpx;
  color: #007aff;
  font-weight: bold;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 15rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.result-item.success {
  background: #e8f5e8;
  color: #34c759;
}

.result-item.error {
  background: #ffebee;
  color: #ff3b30;
}

.result-icon {
  font-size: 24rpx;
}

.result-text {
  flex: 1;
}
</style> 