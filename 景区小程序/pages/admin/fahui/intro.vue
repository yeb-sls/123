<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}介绍管理</text>
      <text class="page-desc">管理小程序{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}页面的介绍内容</text>
    </view>
    <view class="intro-edit-section">
              <view class="form-group">
          <text class="form-label">介绍内容 <text class="required">*</text></text>
          <textarea 
            v-model="intro.content" 
            :placeholder="`请输入${fahuiType === 'joint' ? '合坛法会' : '专场法会'}介绍内容`" 
            class="form-textarea" 
            maxlength="500"
            @input="onContentInput"
            @change="onContentChange"
          />
          <text class="char-count">{{ intro.content ? intro.content.length : 0 }}/500</text>
        </view>
      <view class="form-group">
        <text class="form-label">是否启用</text>
        <switch :checked="intro.enabled" @change="onEnabledChange" />
      </view>
      <view class="form-group">
        <button class="popup-btn primary" @click="saveIntro">保存</button>
      </view>
    </view>
  </view>
</template>

<script>
// 导入云对象
const fahuiManagement = uniCloud.importObject('fahui-management')

export default {
  data() {
    return {
      fahuiType: 'special', // 默认专场法会
      intro: {
        _id: '',
        content: '',
        image: '',
        enabled: true,
        type: 'special'
      },
      loading: false
    }
  },
  onLoad(options) {
    // 获取法会类型参数
    if (options.type) {
      this.fahuiType = options.type;
      this.intro.type = options.type;
    }
    this.loadIntro()
  },
  methods: {
    async loadIntro() {
      this.loading = true
      try {
        console.log('=== loadIntro 方法开始 ===')
        console.log('开始加载介绍数据，法会类型:', this.fahuiType)
        let result;
        if (this.fahuiType === 'joint') {
          console.log('调用 fahuiManagement.getIntros')
          result = await fahuiManagement.getIntros({ type: 'joint' })
        } else {
          console.log('调用 fahuiManagement.getSpecialIntro')
          result = await fahuiManagement.getSpecialIntro()
        }
        
        console.log('获取介绍数据结果:', result)
        if (result.success && result.data) {
          if (this.fahuiType === 'joint' && result.data.length > 0) {
            this.intro = result.data[0]
            console.log('加载合坛法会介绍数据:', this.intro)
            console.log('合坛法会介绍内容:', this.intro.content)
          } else if (this.fahuiType === 'special') {
            this.intro = result.data
            console.log('=== 加载专场法会介绍数据 ===')
            console.log('加载专场法会介绍数据:', this.intro)
            console.log('专场法会介绍数据的_id:', this.intro._id)
            console.log('专场法会介绍内容:', this.intro.content)
            console.log('专场法会介绍内容长度:', this.intro.content ? this.intro.content.length : 0)
            console.log('专场法会介绍数据的完整内容:', JSON.stringify(this.intro, null, 2))
          } else {
            this.intro = { _id: '', content: '', image: '', enabled: true, type: this.fahuiType }
            console.log('使用默认介绍数据:', this.intro)
          }
        } else {
          this.intro = { _id: '', content: '', image: '', enabled: true, type: this.fahuiType }
          console.log('使用默认介绍数据:', this.intro)
        }
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    onEnabledChange(e) {
      this.intro.enabled = e.detail.value
    },
    onContentInput(e) {
      console.log('=== 介绍内容输入事件 ===')
      console.log('输入的内容:', e.detail.value)
      console.log('内容长度:', e.detail.value.length)
      console.log('当前intro.content:', this.intro.content)
    },
    onContentChange(e) {
      console.log('=== 介绍内容变化事件 ===')
      console.log('变化后的内容:', e.detail.value)
      console.log('内容长度:', e.detail.value.length)
      console.log('当前intro.content:', this.intro.content)
    },
    async saveIntro() {
      console.log('🔍 === 开始保存介绍文字 ===')
      console.log('🔍 输入的内容:', this.intro.content)
      console.log('🔍 内容长度:', this.intro.content.length)
      console.log('🔍 内容是否为空:', !this.intro.content.trim())
      console.log('🔍 完整的数据对象:', JSON.stringify(this.intro, null, 2))
      
      if (!this.intro.content.trim()) {
        console.log('🔍 内容为空，显示错误提示')
        uni.showToast({ title: '请输入介绍内容', icon: 'none' })
        return
      }
      this.loading = true
      try {
        console.log('🔍 === 开始保存介绍 ===')
        console.log('🔍 当前数据:', this.intro)
        
        // 简化逻辑：总是执行新增操作，让云对象自己处理更新
        const introData = { ...this.intro }
        console.log('🔍 原始数据:', introData)
        
        if ('_id' in introData) {
          console.log('🔍 删除_id字段:', introData._id)
          delete introData._id
        }
        // 清理不需要的字段
        if ('update_date' in introData) {
          console.log('🔍 删除update_date字段:', introData.update_date)
          delete introData.update_date
        }
        if ('update_time' in introData) {
          console.log('🔍 删除update_time字段:', introData.update_time)
          delete introData.update_time
        }
        if ('create_time' in introData) {
          console.log('🔍 删除create_time字段:', introData.create_time)
          delete introData.create_time
        }
        
        introData.type = this.fahuiType
        console.log('🔍 清理后的数据:', introData)
        console.log('🔍 准备发送的数据:', JSON.stringify(introData, null, 2))
        
        // 调用云对象
        const result = await fahuiManagement.addSpecialIntro(introData)
        console.log('🔍 云对象返回结果:', result)
        
        if (result.success && result.data) {
          console.log('🔍 === 保存成功 ===')
          console.log('🔍 云对象返回的原始数据:', result.data)
          console.log('🔍 返回数据的内容:', result.data.content)
          console.log('🔍 返回数据的内容长度:', result.data.content ? result.data.content.length : 0)
          console.log('🔍 返回数据的_id:', result.data._id)
          
          // 确保有_id字段
          if (!result.data._id) {
            console.log('🔍 云对象没有返回_id，设置临时ID')
            result.data._id = 'temp_' + Date.now()
          }
          
          this.intro = result.data
          console.log('🔍 更新后的本地数据:', this.intro)
          console.log('🔍 更新后的内容:', this.intro.content)
          console.log('🔍 更新后的_id:', this.intro._id)
          
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
          
          // 提示用户前台页面需要刷新
          setTimeout(() => {
            uni.showModal({
              title: '保存成功',
              content: '介绍内容已更新，前台页面需要下拉刷新才能看到最新内容。',
              showCancel: false,
              confirmText: '知道了'
            })
          }, 1000)
        } else {
          console.error('🔍 保存失败:', result.message)
          throw new Error(result.message || '保存失败')
        }
      } catch (e) {
        console.error('🔍 保存异常:', e)
        console.error('🔍 错误详情:', e.message)
        uni.showToast({ title: '保存失败: ' + e.message, icon: 'none' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-container { padding: 20rpx; background: #f5f5f5; min-height: 100vh; }
.page-header { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; }
.page-title { font-size: 36rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
.page-desc { font-size: 28rpx; color: #666; }
.intro-edit-section { background: #fff; border-radius: 12rpx; padding: 30rpx; }
.form-group { margin-bottom: 30rpx; }
.form-label { font-size: 28rpx; color: #333; display: block; margin-bottom: 10rpx; }
.form-textarea { width: 100%; border: 1rpx solid #e0e0e0; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; box-sizing: border-box; height: 120rpx; resize: none; }
.image-upload { border: 2rpx dashed #e0e0e0; border-radius: 8rpx; padding: 40rpx; text-align: center; background: #f9f9f9; }
.upload-img { width: 200rpx; height: 200rpx; border-radius: 8rpx; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10rpx; }
.upload-icon { font-size: 60rpx; }
.upload-text { font-size: 28rpx; color: #666; }
.popup-btn.primary { background: #007aff; color: #fff; border: none; padding: 20rpx; border-radius: 8rpx; font-size: 28rpx; width: 100%; }
</style> 