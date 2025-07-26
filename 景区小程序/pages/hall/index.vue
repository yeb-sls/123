<template>
  <view class="hall-bg">
    <view class="hall-container">
      <!-- 顶部图文介绍 -->
      <view class="header-section">
        <image class="hall-banner" src="https://km.huixuanmu.com/uploads/image/20230310/1678418672234718.png" mode="aspectFill" />
        <view class="intro-card">
          <view class="intro-title">
            <text class="icon">🏛️</text>殿堂供品
          </view>
          <view class="intro-text">
            殿堂供品是佛教供养的重要形式，包括香、花、灯、水、果等五供养。
            通过虔诚的供养，不仅是对佛法的恭敬，更是对内心的净化与升华。
            愿您的供养如甘露般滋润心田，带来无量功德。
          </view>
        </view>
      </view>

      <!-- 供品介绍 -->
      <view class="offerings-section">
        <view class="section-title">供品介绍</view>
        <view class="offerings-grid">
          <view class="offering-item" v-for="(offering, index) in offerings" :key="index">
            <view class="offering-icon">{{ offering.icon }}</view>
            <view class="offering-name">{{ offering.name }}</view>
            <view class="offering-desc">{{ offering.desc }}</view>
          </view>
        </view>
      </view>

      <!-- 殿堂介绍 -->
      <view class="halls-section">
        <view class="section-title">殿堂介绍</view>
        <view class="halls-list">
          <view class="hall-item" v-for="(hall, index) in halls" :key="index">
            <view class="hall-icon">{{ hall.icon }}</view>
            <view class="hall-info">
              <view class="hall-name">{{ hall.name }}</view>
              <view class="hall-desc">{{ hall.desc }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 功德利益 -->
      <view class="benefits-section">
        <view class="section-title">供养功德</view>
        <view class="benefits-list">
          <view class="benefit-item" v-for="(benefit, index) in benefits" :key="index">
            <text class="benefit-icon">{{ benefit.icon }}</text>
            <text class="benefit-text">{{ benefit.text }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section">
        <button class="primary-btn" type="primary" @click="goForm">
          <text class="icon">🙏</text>开始供养
        </button>
        <button class="secondary-btn" @click="goProfile">
          <text class="icon">📋</text>我的供养
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      offerings: [
        {
          icon: '🕯️',
          name: '香',
          desc: '清香一炷，祈愿平安'
        },
        {
          icon: '🌸',
          name: '花',
          desc: '鲜花供品，祈愿吉祥'
        },
        {
          icon: '💡',
          name: '灯',
          desc: '明灯一盏，祈愿光明'
        },
        {
          icon: '💧',
          name: '水',
          desc: '净水一杯，祈愿清净'
        },
        {
          icon: '🍎',
          name: '果',
          desc: '鲜果供品，祈愿圆满'
        },
        {
          icon: '🍚',
          name: '食',
          desc: '素食供品，祈愿健康'
        }
      ],
      halls: [
        {
          icon: '🏛️',
          name: '大雄宝殿',
          desc: '供奉释迦牟尼佛，主殿庄严'
        },
        {
          icon: '🙏',
          name: '观音殿',
          desc: '供奉观世音菩萨，慈悲济世'
        },
        {
          icon: '🌱',
          name: '地藏殿',
          desc: '供奉地藏王菩萨，救度众生'
        },
        {
          icon: '💊',
          name: '药师殿',
          desc: '供奉药师佛，消灾延寿'
        },
        {
          icon: '📚',
          name: '文殊殿',
          desc: '供奉文殊菩萨，智慧增长'
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
      uni.navigateTo({
        url: '/pages/hall/form',
        success: () => {
          console.log('跳转到殿堂供品表单页成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '页面跳转失败', icon: 'none' })
        }
      })
    },
    goProfile() {
      uni.navigateTo({
        url: '/pages/profile/hall',
        success: () => {
          console.log('跳转到我的供养页面成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          // 如果跳转失败，跳转到个人中心
          uni.switchTab({
            url: '/pages/profile/index',
            fail: () => {
              uni.showToast({ 
                title: '页面跳转失败', 
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.hall-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.hall-container {
  padding-top: 1rpx;
}

.header-section {
  margin-bottom: 24rpx;
}

.hall-banner {
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

.offerings-section,
.halls-section,
.benefits-section {
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

.offerings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.offering-item {
  text-align: center;
  padding: 24rpx;
  border: 2rpx solid #e0eaff;
  border-radius: 12rpx;
  background: #f8f9fa;
}

.offering-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.offering-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.offering-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.halls-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.hall-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e0eaff;
  border-radius: 12rpx;
  background: #f8f9fa;
}

.hall-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.hall-info {
  flex: 1;
}

.hall-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.hall-desc {
  font-size: 24rpx;
  color: #666;
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
