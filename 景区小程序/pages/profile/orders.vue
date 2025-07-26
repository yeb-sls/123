<template>
  <view class="orders-container">
    <view v-if="orders.length === 0" class="empty">暂无订单</view>
    <view v-for="order in orders" :key="order.id" class="order-item" @click="goDetail(order)">
      <view class="order-title">{{ order.fahuiProject }}（{{ order.type }}）</view>
      <view>报名人：{{ order.applicants.map(a => a.name).join('、') }}</view>
      <view>金额：￥{{ order.totalFee }}</view>
      <view>状态：{{ order.status }}</view>
      <view class="order-time">{{ order.createTime }}</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      orders: []
    }
  },
  onShow() {
    // 示例：从本地获取订单列表，实际可对接云端
    this.orders = uni.getStorageSync('orders') || [];
    // 按时间倒序
    this.orders.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  },
  methods: {
    goDetail(order) {
      uni.setStorageSync('orderDetail', order);
      uni.navigateTo({ url: '/pages/profile/orderDetail' });
    }
  }
}
</script>
<style scoped>
.orders-container { padding: 20rpx; }
.order-item {
  border: 1px solid #eee; border-radius: 8rpx; margin-bottom: 20rpx; padding: 20rpx;
}
.order-title { font-weight: bold; margin-bottom: 10rpx; }
.order-time { color: #888; font-size: 24rpx; margin-top: 10rpx; }
.empty { text-align: center; color: #aaa; margin-top: 100rpx; }
</style> 