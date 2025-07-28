<template>
  <view class="detail-container" v-if="order">
    <view class="section-title">订单详情</view>
    <view>订单号：{{ order.id }}</view>
    <view>法会项目：{{ order.fahuiProject }}</view>
    <view>类型：{{ order.type }}</view>
    <view>报名人：{{ order.applicants.map(a => a.name).join('、') }}</view>
    <view>金额：￥{{ order.totalFee }}</view>
    <view>状态：{{ order.status }}</view>
    <view>下单时间：{{ order.createTime }}</view>
    <view v-if="order.remark">备注：{{ order.remark }}</view>
    <view v-if="order.logs && order.logs.length" class="logs">
      <view class="section-title">操作记录</view>
      <view v-for="(log, idx) in order.logs" :key="idx">
        {{ log.time }} - {{ log.operator }}：{{ log.action }}
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return { order: null }
  },
  onShow() {
    this.order = uni.getStorageSync('orderDetail') || null;
  }
}
</script>
<style scoped>
.detail-container { padding: 20rpx; }
.section-title { font-weight: bold; margin: 20rpx 0 10rpx 0; }
.logs { margin-top: 20rpx; background: #f7f7f7; border-radius: 8rpx; padding: 10rpx; }
</style> 