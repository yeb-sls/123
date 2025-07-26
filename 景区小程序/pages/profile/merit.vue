<template>
  <view class="merit-page">
    <!-- 功德值总览 -->
    <view class="merit-overview">
      <view class="merit-card">
        <view class="merit-title">当前功德值</view>
        <view class="merit-value">{{ totalMerit }}</view>
        <view class="merit-desc">功德值只增不减，累积善行功德</view>
      </view>
    </view>

    <!-- 功德值明细 -->
    <view class="merit-details">
      <view class="section-title">功德值明细</view>
      <view class="detail-list">
        <view v-for="(item, index) in meritDetails" :key="index" class="detail-item">
          <view class="detail-header">
            <text class="detail-type">{{ item.type }}</text>
            <text class="detail-merit">+{{ item.merit }}</text>
          </view>
          <view class="detail-info">
            <text class="detail-desc">{{ item.description }}</text>
            <text class="detail-date">{{ item.date }}</text>
          </view>
          <view class="detail-amount">
            <text class="amount-label">消费金额：</text>
            <text class="amount-value">¥{{ item.amount }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功德值规则说明 -->
    <view v-if="meritRules" class="merit-rules">
      <view class="section-title">功德值规则</view>
      <view class="rules-content">
        <view class="rule-item">
          <text class="rule-icon">📋</text>
          <text class="rule-text">功德值只增不减，累积善行功德</text>
        </view>
        <view class="rule-item">
          <text class="rule-icon">🕯️</text>
          <text class="rule-text">法会功德值：每100元累积1个功德值</text>
        </view>
        <view class="rule-item">
          <text class="rule-icon">💡</text>
          <text class="rule-text">供灯、殿堂供品、功德布施、活动：每100元累积2个功德值</text>
        </view>
        <view class="rule-item">
          <text class="rule-icon">📊</text>
          <text class="rule-text">功德值计算采用四舍五入，无小数</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      totalMerit: 156,
      meritDetails: [
        {
          type: '供灯祈福',
          merit: 4,
          description: '大愿灯塔A一层供灯一年',
          date: '2025-01-15',
          amount: 200
        },
        {
          type: '殿堂供品',
          merit: 6,
          description: '香烛套装 x 3',
          date: '2025-01-10',
          amount: 300
        },
        {
          type: '功德布施',
          merit: 2,
          description: '善款捐赠',
          date: '2025-01-05',
          amount: 100
        },
        {
          type: '专场法会',
          merit: 2,
          description: '平安法会',
          date: '2024-12-20',
          amount: 200
        },
        {
          type: '活动报名',
          merit: 4,
          description: '新年祈福活动',
          date: '2024-12-15',
          amount: 200
        }
      ],
      meritRules: true
    }
  },
  onLoad() {
    this.loadMeritData()
  },
  methods: {
    loadMeritData() {
      // 从本地存储或服务器加载功德值数据
      const savedMerit = uni.getStorageSync('userMerit')
      if (savedMerit) {
        this.totalMerit = savedMerit.total || 0
        this.meritDetails = savedMerit.details || []
      }
    }
  }
}
</script>

<style scoped>
.merit-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.merit-overview {
  padding: 32rpx 16rpx 24rpx 16rpx;
}

.merit-card {
  background: linear-gradient(135deg, #2d8cf0 0%, #5cadff 100%);
  border-radius: 18rpx;
  padding: 48rpx 32rpx;
  text-align: center;
  color: #fff;
  box-shadow: 0 8rpx 24rpx #b3c6e0;
}

.merit-title {
  font-size: 28rpx;
  margin-bottom: 16rpx;
  opacity: 0.9;
}

.merit-value {
  font-size: 72rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.merit-desc {
  font-size: 24rpx;
  opacity: 0.8;
}

.merit-details {
  background: #fff;
  margin: 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
}

.detail-list {
  max-height: 600rpx;
  overflow-y: auto;
}

.detail-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 24rpx 0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.detail-type {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.detail-merit {
  font-size: 28rpx;
  color: #2d8cf0;
  font-weight: bold;
}

.detail-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.detail-desc {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.detail-date {
  font-size: 24rpx;
  color: #999;
}

.detail-amount {
  display: flex;
  align-items: center;
}

.amount-label {
  font-size: 24rpx;
  color: #999;
}

.amount-value {
  font-size: 24rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.merit-rules {
  background: #fff;
  margin: 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.rules-content {
  margin-top: 16rpx;
}

.rule-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.rule-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
}

.rule-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}
</style> 