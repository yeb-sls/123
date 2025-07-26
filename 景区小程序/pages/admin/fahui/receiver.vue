<template>
  <view class="receiver-admin-page">
    <view class="header">
      <text class="title">收件人信息管理</text>
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
export default {
  components: { uniPopup },
  data() {
    return {
      receivers: [],
      loading: true,
      enabled: false,
    }
  },
  onLoad() {
    this.getConfig()
    this.getList()
  },
  methods: {
    async getConfig() {
      try {
        const res = await uniCloud.callFunction({ name: 'getFahuiReceiverConfig' })
        this.enabled = !!(res.result && res.result.enabled)
      } catch (e) {
        this.enabled = false
      }
    },
    async onSwitchChange(e) {
      const value = e.detail.value
      try {
        await uniCloud.callFunction({ name: 'updateFahuiReceiverConfig', data: { enabled: value } })
        this.enabled = value
        uni.showToast({ title: value ? '已启用' : '已关闭', icon: 'success' })
      } catch (e) {
        uni.showToast({ title: '设置失败', icon: 'none' })
      }
    },
    async getList() {
      this.loading = true
      try {
        const res = await uniCloud.callFunction({
          name: 'getFahuiReceivers',
        })
        this.receivers = res.result.data || []
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
      this.loading = false
    },
    async del(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该收件人信息吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await uniCloud.callFunction({
                name: 'updateFahuiReceiver',
                data: { _id: id, action: 'delete' },
              })
              uni.showToast({ title: '删除成功', icon: 'success' })
              this.getList()
            } catch (e) {
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