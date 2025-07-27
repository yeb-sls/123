<template>
  <view class="test-container">
    <view class="page-header">
      <text class="page-title">合坛法会管理测试</text>
      <text class="page-desc">测试合坛法会相关功能</text>
    </view>
    
    <view class="test-section">
      <view class="section-title">数据测试</view>
      <button class="test-btn" @click="testLoadProjects">测试加载合坛法会项目</button>
      <button class="test-btn" @click="testAddProject">测试添加合坛法会项目</button>
      <button class="test-btn" @click="testUpdateProject">测试更新合坛法会项目</button>
      <button class="test-btn" @click="testDeleteProject">测试删除合坛法会项目</button>
    </view>
    
    <view class="result-section" v-if="testResults.length > 0">
      <view class="section-title">测试结果</view>
      <view v-for="(result, index) in testResults" :key="index" class="result-item">
        <text class="result-title">{{ result.title }}</text>
        <text class="result-content">{{ result.content }}</text>
        <text class="result-time">{{ result.time }}</text>
      </view>
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
    addTestResult(title, content) {
      this.testResults.unshift({
        title,
        content: typeof content === 'object' ? JSON.stringify(content, null, 2) : content,
        time: new Date().toLocaleTimeString()
      })
    },
    
    async testLoadProjects() {
      try {
        this.addTestResult('开始测试', '加载合坛法会项目...')
        const result = await uniCloud.callFunction({ 
          name: 'getFahuiProjects',
          data: { type: 'joint' }
        })
        this.addTestResult('加载成功', result.result)
      } catch (error) {
        this.addTestResult('加载失败', error.message)
      }
    },
    
    async testAddProject() {
      try {
        this.addTestResult('开始测试', '添加合坛法会项目...')
        const testProject = {
          name: '测试合坛法会',
          description: '这是一个测试项目',
          category: '超度法会',
          price: 100,
          deadline: '2025-12-31',
          dates: ['2025-10-01', '2025-10-15'],
          maxApplicants: 50,
          goods: [],
          needReceiver: false,
          type: 'joint'
        }
        
        const result = await uniCloud.callFunction({ 
          name: 'addFahuiProject',
          data: { project: testProject }
        })
        this.addTestResult('添加成功', result.result)
      } catch (error) {
        this.addTestResult('添加失败', error.message)
      }
    },
    
    async testUpdateProject() {
      try {
        this.addTestResult('开始测试', '更新合坛法会项目...')
        // 先获取一个项目
        const getResult = await uniCloud.callFunction({ 
          name: 'getFahuiProjects',
          data: { type: 'joint' }
        })
        
        if (getResult.result && getResult.result.data && getResult.result.data.length > 0) {
          const project = getResult.result.data[0]
          const updateData = {
            ...project,
            name: project.name + ' (已更新)',
            type: 'joint'
          }
          delete updateData._id
          
          const result = await uniCloud.callFunction({ 
            name: 'updateFahuiProject',
            data: { id: project._id, project: updateData }
          })
          this.addTestResult('更新成功', result.result)
        } else {
          this.addTestResult('更新失败', '没有找到可更新的项目')
        }
      } catch (error) {
        this.addTestResult('更新失败', error.message)
      }
    },
    
    async testDeleteProject() {
      try {
        this.addTestResult('开始测试', '删除合坛法会项目...')
        // 先获取一个项目
        const getResult = await uniCloud.callFunction({ 
          name: 'getFahuiProjects',
          data: { type: 'joint' }
        })
        
        if (getResult.result && getResult.result.data && getResult.result.data.length > 0) {
          const project = getResult.result.data[0]
          const result = await uniCloud.callFunction({ 
            name: 'deleteFahuiProject',
            data: { id: project._id }
          })
          this.addTestResult('删除成功', result.result)
        } else {
          this.addTestResult('删除失败', '没有找到可删除的项目')
        }
      } catch (error) {
        this.addTestResult('删除失败', error.message)
      }
    }
  }
}
</script>

<style scoped>
.test-container { padding: 20rpx; background: #f5f5f5; min-height: 100vh; }
.page-header { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; }
.page-title { font-size: 36rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
.page-desc { font-size: 28rpx; color: #666; }
.test-section, .result-section { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; }
.section-title { font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 20rpx; }
.test-btn { width: 100%; padding: 20rpx; background: #007aff; color: #fff; border: none; border-radius: 8rpx; font-size: 28rpx; margin-bottom: 15rpx; }
.result-item { border: 1rpx solid #eee; border-radius: 8rpx; padding: 20rpx; margin-bottom: 15rpx; }
.result-title { font-size: 28rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
.result-content { font-size: 24rpx; color: #666; display: block; margin-bottom: 10rpx; white-space: pre-wrap; }
.result-time { font-size: 22rpx; color: #999; }
</style> 