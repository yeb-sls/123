<template>
  <view class="detail-bg">
    <view class="detail-container">
      <!-- 活动头图 -->
      <image class="activity-banner" src="https://cdn.jsdelivr.net/gh/qianguyihao/StaticRepo@master/images/202003/banner3.jpg" mode="aspectFill" />
      
      <view class="activity-info">
        <view class="activity-title">{{ activityInfo.title }}</view>
        <view class="activity-meta">
          <view class="meta-item">
            <text class="icon">📅</text>
            <text class="text">{{ activityInfo.date }}</text>
          </view>
          <view class="meta-item">
            <text class="icon">📍</text>
            <text class="text">{{ activityInfo.location }}</text>
          </view>
          <view class="meta-item">
            <text class="icon">💰</text>
            <text class="text">¥{{ activityInfo.fee }}</text>
          </view>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">活动详情</view>
        <view class="detail-content">{{ activityInfo.description }}</view>
      </view>

      <view class="info-section">
        <view class="section-title">活动安排</view>
        <view class="schedule-list">
          <view class="schedule-item" v-for="(item, index) in activityInfo.schedule" :key="index">
            <view class="time">{{ item.time }}</view>
            <view class="content">{{ item.content }}</view>
          </view>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">注意事项</view>
        <view class="notice-list">
          <view class="notice-item" v-for="(item, index) in activityInfo.notices" :key="index">
            {{ item }}
          </view>
        </view>
      </view>

      <view class="btn-group">
        <button class="btn btn-secondary" @click="goBack">返回</button>
        <button class="btn btn-primary" @click="goForm">立即报名</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activityInfo: {
        title: '祈福法会',
        date: '2024年3月15日 09:00-17:00',
        location: '大雄宝殿',
        fee: 100,
        description: '祈福法会是佛教重要的宗教活动，旨在为信众祈福消灾、增福延寿。法会期间将进行诵经、礼佛、供灯等仪式，参与者可获得无量功德。',
        schedule: [
          { time: '09:00-10:00', content: '法会开始，诵经礼佛' },
          { time: '10:00-11:30', content: '祈福仪式，供灯祈福' },
          { time: '11:30-12:30', content: '午斋时间' },
          { time: '12:30-15:00', content: '继续诵经，消灾祈福' },
          { time: '15:00-16:00', content: '回向功德，法会圆满' }
        ],
        notices: [
          '请提前30分钟到达现场',
          '着装要庄重得体，避免过于暴露',
          '保持安静，不要大声喧哗',
          '遵守现场秩序，听从法师指导',
          '如有身体不适请及时告知工作人员'
        ]
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回成功');
        },
        fail: (err) => {
          console.error('返回失败:', err);
          uni.navigateTo({ 
            url: '/pages/order/index',
            fail: () => {
              uni.showToast({ 
                title: '返回失败，请重试', 
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      });
    },
    goForm() {
      uni.navigateTo({ 
        url: '/pages/order/form',
        success: () => {
          console.log('跳转到活动报名表单页成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({ 
            title: '跳转失败，请重试', 
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.detail-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.detail-container {
  padding-bottom: 40rpx;
}
.activity-banner {
  width: 100%;
  height: 400rpx;
  display: block;
}
.activity-info {
  background: #fff;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.activity-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  text-align: center;
  letter-spacing: 2rpx;
}
.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.meta-item {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666;
}
.icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}
.text {
  flex: 1;
}
.info-section {
  background: #fff;
  margin: 0 16rpx 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  letter-spacing: 2rpx;
}
.detail-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  text-align: justify;
}
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.schedule-item {
  display: flex;
  align-items: flex-start;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}
.time {
  font-size: 26rpx;
  color: #2d8cf0;
  font-weight: bold;
  min-width: 160rpx;
  flex-shrink: 0;
}
.content {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.notice-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  padding-left: 20rpx;
  position: relative;
}
.notice-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2d8cf0;
}
.btn-group {
  display: flex;
  gap: 24rpx;
  margin: 32rpx 16rpx 0 16rpx;
}
.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
}
.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
}
.btn-primary {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}
</style>