<template>
  <view class="receiver-admin-page">
    <view class="header">
      <text class="title">{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}收件人信息管理</text>
    </view>
    <view class="switch-row">
      <text class="switch-label">启用收件信息模块</text>
      <switch :checked="enabled" @change="onSwitchChange" />
    </view>
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else>
      <view v-if="receivers.length === 0" class="empty">暂无收件人信息</view>
      <view v-else class="receiver-list">
        <view class="receiver-item" v-for="item in receivers" :key="item._id">
          <view class="info">
            <view class="info-row"><text class="label">收件人：</text><text class="value">{{ item.name }}</text></view>
            <view class="info-row"><text class="label">电话：</text><text class="value">{{ item.phone }}</text></view>
            <view class="info-row"><text class="label">地址：</text><text class="value">{{ item.address }}</text></view>
            <view class="info-row" v-if="item.remark"><text class="label">备注：</text><text class="value">{{ item.remark }}</text></view>
          </view>
          <button class="delete-btn" @click="del(item._id)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

// 导入云对象
const fahuiManagement = uniCloud.importObject('fahui-management')

export default {
  components: { uniPopup },
  data() {
    return {
      fahuiType: 'special', // 默认专场法会
      receivers: [],
      loading: true,
      enabled: false,
    }
  },
  onLoad(options) {
    console.log('🔍 页面加载，接收到的参数:', options)
    
    // 获取法会类型参数
    if (options.type) {
      this.fahuiType = options.type;
    } else {
      // 如果没有传递type参数，默认为专场法会
      this.fahuiType = 'special';
    }
    
    console.log('🔍 设置法会类型为:', this.fahuiType)
    
    this.getConfig()
    this.getList()
  },
  methods: {
    async getConfig() {
      try {
        console.log('🔍 获取收件信息配置，法会类型:', this.fahuiType)
        const result = await fahuiManagement.getReceiverConfig({ type: this.fahuiType })
        console.log('🔍 获取配置结果:', result)
        
        if (result.success) {
          this.enabled = !!result.data?.enabled
          console.log('🔍 设置收件信息状态为:', this.enabled)
        } else {
          console.error('🔍 获取配置失败:', result.message)
          this.enabled = false
        }
      } catch (e) {
        console.error('🔍 获取收件信息配置异常:', e)
        this.enabled = false
      }
    },
    async onSwitchChange(e) {
      const value = e.detail.value
      console.log('🔍 收件信息开关变化，新值:', value, '法会类型:', this.fahuiType)
      
      try {
        const result = await fahuiManagement.updateReceiverConfig({ 
          type: this.fahuiType,
          enabled: value 
        })
        console.log('🔍 更新配置结果:', result)
        
        if (result.success) {
          this.enabled = value
          uni.showToast({ title: value ? '已启用' : '已关闭', icon: 'success' })
          console.log('🔍 收件信息状态更新成功:', this.enabled)
        } else {
          console.error('🔍 更新配置失败:', result.message)
          uni.showToast({ title: result.message || '设置失败', icon: 'none' })
        }
      } catch (e) {
        console.error('🔍 收件信息开关设置异常:', e)
        uni.showToast({ title: '设置失败', icon: 'none' })
      }
    },
    async getList() {
      this.loading = true
      try {
        console.log('🔍 获取收件人列表，法会类型:', this.fahuiType)
        const result = await fahuiManagement.getReceivers({ type: this.fahuiType })
        console.log('🔍 获取收件人列表结果:', result)
        
        if (result.success) {
          this.receivers = result.data || []
          console.log('🔍 收件人列表:', this.receivers)
        } else {
          console.error('🔍 获取收件人列表失败:', result.message)
          this.receivers = []
          uni.showToast({ title: result.message || '加载失败', icon: 'none' })
        }
      } catch (e) {
        console.error('🔍 获取收件人列表异常:', e)
        this.receivers = []
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
      this.loading = false
    },
    async del(id) {
      console.log('🔍 删除收件人，ID:', id, '法会类型:', this.fahuiType)
      
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该收件人信息吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await fahuiManagement.deleteReceiver({ 
                _id: id,
                type: this.fahuiType
              })
              console.log('🔍 删除收件人结果:', result)
              
              if (result.success) {
                uni.showToast({ title: '删除成功', icon: 'success' })
                this.getList()
              } else {
                console.error('🔍 删除收件人失败:', result.message)
                uni.showToast({ title: result.message || '删除失败', icon: 'none' })
              }
            } catch (e) {
              console.error('🔍 删除收件人异常:', e)
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        },
      })
    },
  },
}
</script>

<style scoped>
.receiver-admin-page { padding: 24rpx; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.title { font-size: 36rpx; font-weight: bold; }
.loading { text-align: center; margin: 48rpx 0; color: #888; }
.empty { text-align: center; color: #aaa; margin: 48rpx 0; }
.receiver-list { margin-top: 12rpx; }
.receiver-item { background: #fff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx #e0eaff; margin-bottom: 18rpx; padding: 24rpx; }
.info { }
.info-row { display: flex; align-items: flex-start; margin-bottom: 8rpx; }
.label { font-weight: bold; color: #333; min-width: 100rpx; }
.value { color: #444; word-break: break-all; }
.switch-row { display: flex; align-items: center; margin-bottom: 18rpx; }
.switch-label { font-size: 28rpx; margin-right: 18rpx; color: #333; }
.delete-btn { background: #ffebee; color: #e53935; border-radius: 8rpx; padding: 8rpx 20rpx; font-size: 26rpx; margin-top: 12rpx; border: none; cursor: pointer; }
</style> 