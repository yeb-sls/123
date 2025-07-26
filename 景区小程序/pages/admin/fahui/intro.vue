<template>
  <view class="admin-container">
    <view class="page-header">
      <text class="page-title">专场法会介绍管理</text>
      <text class="page-desc">只管理小程序专场法会页面的介绍内容</text>
    </view>
    <view class="intro-edit-section">
      <view class="form-group">
        <text class="form-label">介绍内容 <text class="required">*</text></text>
        <textarea v-model="intro.content" placeholder="请输入专场法会介绍内容" class="form-textarea" maxlength="500" />
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
export default {
  data() {
    return {
      intro: {
        _id: '',
        content: '',
        enabled: true
      },
      loading: false
    }
  },
  onLoad() {
    this.loadIntro()
  },
  methods: {
    async loadIntro() {
      this.loading = true
      try {
        const result = await uniCloud.callFunction({ name: 'getFahuiSpecialIntro' })
        if (result.result && result.result.data) {
          this.intro = result.result.data
        } else {
          this.intro = { _id: '', content: '', image: '', enabled: true }
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
    async saveIntro() {
      if (!this.intro.content.trim()) {
        uni.showToast({ title: '请输入介绍内容', icon: 'none' })
        return
      }
      this.loading = true
      try {
        if (this.intro._id) {
          // 编辑
          const introData = { ...this.intro }
          if ('_id' in introData) delete introData._id
          console.log('调用 updateFahuiSpecialIntro', this.intro)
          await uniCloud.callFunction({ name: 'updateFahuiSpecialIntro', data: { id: this.intro._id, intro: introData } })
          console.log('updateFahuiSpecialIntro 调用完成')
        } else {
          // 新增
          const introData = { ...this.intro }
          if ('_id' in introData) delete introData._id
          console.log('调用 addFahuiSpecialIntro', introData)
          await uniCloud.callFunction({ name: 'addFahuiSpecialIntro', data: { intro: introData } })
          console.log('addFahuiSpecialIntro 调用完成')
        }
        await this.loadIntro()
        uni.showToast({ title: '保存成功', icon: 'success' })
      } catch (e) {
        console.error('保存失败', e)
        uni.showToast({ title: '保存失败', icon: 'none' })
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