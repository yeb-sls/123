<template>
  <view class="gongde-bg">
    <view class="gongde-container">
      <!-- 顶部图文介绍 -->
      <view class="header-section">
        <image class="gongde-banner" src="https://k.sinaimg.cn/n/sinacn10122/592/w870h522/20190806/40f6-iatixpn0632791.jpg/w700d1q75cms.jpg" mode="aspectFill" />
        <view class="intro-card">
          <view class="intro-title">
            <text class="icon">🙏</text>功德布施
          </view>
          <view class="intro-text">
            功德布施是佛教六度之一，通过布施善款、实物或服务，广种福田，积累功德。
            布施不仅能帮助他人，更能净化心灵，增长智慧，获得无量福报。
            愿您的布施如甘露般滋润众生，功德无量。
          </view>
        </view>
      </view>

      <!-- 布施类型介绍 -->
      <view class="types-section">
        <view class="section-title">布施类型</view>
        <view class="types-grid">
          <view class="type-item" v-for="(type, index) in donateTypes" :key="index">
            <view class="type-icon">{{ type.icon }}</view>
            <view class="type-name">{{ type.name }}</view>
            <view class="type-desc">{{ type.desc }}</view>
          </view>
        </view>
      </view>

      <!-- 功德利益 -->
      <view class="benefits-section">
        <view class="section-title">布施功德</view>
        <view class="benefits-list">
          <view class="benefit-item" v-for="(benefit, index) in benefits" :key="index">
            <text class="benefit-icon">{{ benefit.icon }}</text>
            <text class="benefit-text">{{ benefit.text }}</text>
          </view>
        </view>
      </view>

      <!-- 布施故事 -->
      <view class="stories-section">
        <view class="section-title">布施故事</view>
        <view class="story-card">
          <view class="story-title">舍身饲虎</view>
          <view class="story-content">
            释迦牟尼佛前世为萨埵太子时，见一母虎饥饿难耐，欲食其子，心生慈悲，舍身饲虎，救活了母虎和虎子。这个故事告诉我们，布施的最高境界是舍己为人。
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section">
        <button class="primary-btn" type="primary" @click="goForm">
          <text class="icon">🙏</text>开始布施
        </button>
        <button class="secondary-btn" @click="goRecord">
          <text class="icon">📋</text>我的布施
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      donateTypes: [
        {
          icon: '💰',
          name: '善款布施',
          desc: '捐赠善款，用于寺院建设、慈善事业'
        },
        {
          icon: '🎁',
          name: '实物布施',
          desc: '捐赠物品，如衣物、食品、日用品'
        },
        {
          icon: '🤝',
          name: '服务布施',
          desc: '提供志愿服务，如清洁、护持等'
        }
      ],
      benefits: [
        {
          icon: '✨',
          text: '消除业障，增长福慧'
        },
        {
          icon: '🕊️',
          text: '家庭和睦，事业顺遂'
        },
        {
          icon: '🌺',
          text: '身心健康，平安吉祥'
        },
        {
          icon: '🌟',
          text: '功德无量，利益众生'
        }
      ]
    }
  },
  methods: {
    goForm() {
      uni.showLoading({ title: '加载中...' });
      
      uni.navigateTo({ 
        url: '/pages/gongde/form',
        success: () => {
          uni.hideLoading();
          console.log('跳转到功德布施表单页成功');
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
        url: '/pages/profile/gongde',
        success: () => {
          console.log('跳转到功德布施记录页成功');
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
.gongde-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.gongde-container {
  padding-top: 1rpx;
}

.header-section {
  margin-bottom: 24rpx;
}

.gongde-banner {
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
.benefits-section,
.stories-section {
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
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.benefit-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border-radius: 12rpx;
  border: 2rpx solid #ffd591;
}

.benefit-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.benefit-text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.story-card {
  background: linear-gradient(135deg, #f0f8ff 0%, #fff 100%);
  border-radius: 12rpx;
  padding: 24rpx;
  border: 2rpx solid #b3c6e0;
}

.story-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 12rpx;
}

.story-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
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