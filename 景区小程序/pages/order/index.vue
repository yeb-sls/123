<template>
  <view class="order-bg">
    <view class="order-container">
      <!-- 顶部图文介绍 -->
      <view class="header-section">
        <image class="order-banner" src="https://p4.itc.cn/q_70/images03/20220418/3472db645e63443e954a55ade8025832.jpeg" mode="aspectFill" />
        <view class="intro-card">
          <view class="intro-title">
            <text class="icon">🎯</text>活动报名
          </view>
          <view class="intro-text">
            欢迎参与各类法会活动、慈善活动和文化活动，丰富身心，结交善友，积累功德。
            我们提供多种类型的活动，满足不同需求，让您体验佛教文化的魅力。
          </view>
        </view>
      </view>

      <!-- 活动类型介绍 -->
      <view class="types-section">
        <view class="section-title">活动类型</view>
        <view class="types-grid">
          <view class="type-item" v-for="(type, index) in activityTypes" :key="index">
            <view class="type-icon">{{ type.icon }}</view>
            <view class="type-name">{{ type.name }}</view>
            <view class="type-desc">{{ type.desc }}</view>
            <view class="type-examples">
              <text class="example-text">包含：</text>
              <text class="example-items">{{ type.examples }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 活动特色 -->
      <view class="features-section">
        <view class="section-title">活动特色</view>
        <view class="features-list">
          <view class="feature-item" v-for="(feature, index) in features" :key="index">
            <text class="feature-icon">{{ feature.icon }}</text>
            <text class="feature-text">{{ feature.text }}</text>
          </view>
        </view>
      </view>

      <!-- 报名须知 -->
      <view class="notice-section">
        <view class="section-title">报名须知</view>
        <view class="notice-card">
          <view class="notice-title">重要提醒</view>
          <view class="notice-content">
            <text class="notice-item">• 请提前15分钟到达活动现场</text>
            <text class="notice-item">• 请穿着得体，保持安静</text>
            <text class="notice-item">• 如有身体不适请及时告知</text>
            <text class="notice-item">• 活动费用一经支付不予退还</text>
            <text class="notice-item">• 活动时间地点如有变更将提前通知</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section">
        <button class="primary-btn" type="primary" @click="goForm">
          <text class="icon">📝</text>立即报名
        </button>
        <button class="secondary-btn" @click="goRecord">
          <text class="icon">📋</text>我的活动
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activityTypes: [
        {
          icon: '🕉️',
          name: '法会活动',
          desc: '参与各种佛教法会，祈福消灾，积累功德',
          examples: '祈福法会、超度法会、开光法会、放生法会'
        },
        {
          icon: '🤝',
          name: '慈善活动',
          desc: '参与慈善公益活动，帮助他人，广种福田',
          examples: '扶贫助学、敬老助残、环保公益、医疗救助'
        },
        {
          icon: '🎨',
          name: '文化活动',
          desc: '体验佛教文化，提升心灵修养',
          examples: '佛学讲座、禅修体验、文化展览、音乐会'
        },
        {
          icon: '🌟',
          name: '其他活动',
          desc: '其他特色活动，丰富您的体验',
          examples: '特色活动、定制活动、特别活动'
        }
      ],
      features: [
        {
          icon: '✨',
          text: '专业指导，安全可靠'
        },
        {
          icon: '🎯',
          text: '内容丰富，形式多样'
        },
        {
          icon: '🤝',
          text: '结交善友，共同成长'
        },
        {
          icon: '🌺',
          text: '净化心灵，提升境界'
        }
      ]
    }
  },
  methods: {
    goForm() {
      uni.showLoading({ title: '加载中...' });
      
      uni.navigateTo({ 
        url: '/pages/order/form',
        success: () => {
          uni.hideLoading();
          console.log('跳转到活动报名表单页成功');
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('跳转失败:', err);
          uni.showToast({ 
            title: '页面跳转失败，请重试', 
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    goRecord() {
      uni.navigateTo({ 
        url: '/pages/profile/activity',
        success: () => {
          console.log('跳转到活动记录页成功');
        },
        fail: (err) => {
          console.error('跳转记录页失败:', err);
          // 如果跳转失败，跳转到个人中心
          uni.switchTab({
            url: '/pages/profile/index',
            fail: () => {
              uni.showToast({ 
                title: '页面跳转失败', 
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.order-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.order-container {
  padding-top: 1rpx;
}

.header-section {
  margin-bottom: 24rpx;
}

.order-banner {
  width: 100%;
  height: 300rpx;
}

.intro-card {
  background: #fff;
  margin: 0 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  margin-top: -20rpx;
  position: relative;
  z-index: 1;
}

.intro-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.types-section,
.features-section,
.notice-section {
  background: #fff;
  border-radius: 18rpx;
  margin: 24rpx 16rpx 0 16rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24rpx;
}

.type-item {
  text-align: center;
  padding: 24rpx;
  border: 2rpx solid #e0eaff;
  border-radius: 12rpx;
  background: #f8f9fa;
}

.type-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.type-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.type-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.type-examples {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border-radius: 8rpx;
  padding: 12rpx;
  border: 2rpx solid #ffd591;
}

.example-text {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-bottom: 4rpx;
}

.example-items {
  font-size: 20rpx;
  color: #999;
  line-height: 1.3;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border-radius: 12rpx;
  border: 2rpx solid #ffd591;
}

.feature-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.feature-text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.notice-card {
  background: linear-gradient(135deg, #fff2f0 0%, #fff 100%);
  border-radius: 12rpx;
  padding: 24rpx;
  border: 2rpx solid #ffccc7;
}

.notice-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-bottom: 12rpx;
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.notice-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.action-section {
  margin: 48rpx 16rpx 0 16rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.primary-btn,
.secondary-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}

.secondary-btn {
  background: #f8f9fa;
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
}
</style> 