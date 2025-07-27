<template>
  <view class="joint-page">
    <!-- 头图轮播 -->
    <swiper class="banner-swiper" indicator-dots autoplay interval="3000" duration="500">
      <swiper-item v-for="(banner, idx) in banners" :key="idx">
        <view class="banner-img-wrap">
          <image :src="banner.image" class="banner-img" mode="aspectFill" />
        </view>
      </swiper-item>
    </swiper>

    <!-- 图文介绍 -->
    <view class="intro-section">
      <view v-if="intros.length > 0">
        <view v-for="(intro, index) in intros" :key="getIntroKey(intro, index)" class="intro-block" v-if="intro.enabled">
          <view class="intro-content" :style="{ color: intro.textColor }">
            {{ intro.content }}
          </view>
          <image v-if="intro.bgImage" :src="intro.bgImage" class="intro-bg" mode="aspectFill" />
        </view>
      </view>
      <!-- 默认介绍 -->
      <view v-else class="intro-block">
        <view class="intro-content">
          合坛法会为多人共同参与的法会活动，包括平安祈福、姻缘和合、超度法会等。参与者共同祈福，功德共享，是集体修行的殊胜法门。
        </view>
      </view>
    </view>

    <!-- 法会项目列表 -->
    <view class="projects-section">
      <view class="section-title">
        <text class="title-icon">🕯️</text>
        <text class="title-text">合坛法会项目</text>
      </view>
      
      <view class="project-list">
        <view v-for="(project, index) in projects" :key="project._id" class="project-card" @click="goToForm(project)">
          <view class="project-header">
            <text class="project-name">{{ project.name }}</text>
            <text class="project-price">¥{{ project.price }}/人</text>
          </view>
          <view class="project-desc">{{ project.description }}</view>
          <view class="project-info">
            <text class="info-item">分类：{{ project.category }}</text>
            <text class="info-item">截止：{{ project.deadline }}</text>
            <text class="info-item">剩余名额：{{ project.maxApplicants ? (project.maxApplicants - (project.currentApplicants || 0)) : '不限' }}</text>
          </view>
          <view class="project-dates">
            <text class="dates-label">可选日期：</text>
            <text class="dates-text">{{ project.dates ? project.dates.join('、') : '待定' }}</text>
          </view>
          <view class="project-actions">
            <button class="join-btn">立即报名</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 服务说明 -->
    <view class="service-section">
      <view class="service-title">服务说明</view>
      <view class="service-content">
        <view class="service-item">
          <text class="service-dot">•</text>
          <text class="service-text">合坛法会为集体祈福活动，功德共享</text>
        </view>
        <view class="service-item">
          <text class="service-dot">•</text>
          <text class="service-text">支持多人同时报名，费用按人数计算</text>
        </view>
        <view class="service-item">
          <text class="service-dot">•</text>
          <text class="service-text">提供完整的订单跟踪和售后服务</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [],
      intros: [],
      projects: []
    }
  },
  
  onLoad() {
    this.loadBanners()
    this.loadIntros()
    this.loadProjects()
  },
  
  onShow() {
    // 每次页面显示时重新加载数据
    this.loadBanners()
    this.loadIntros()
    this.loadProjects()
  },
  
  methods: {
    getIntroKey(intro, index) {
      return intro._id || `intro_${index}`
    },
    
    async loadBanners() {
      try {
        console.log('开始加载合坛法会头图数据...')
        const result = await uniCloud.callFunction({ 
          name: 'getJointBanners'
        })
        console.log('合坛法会头图数据加载结果:', result)
        
        if (result.result && result.result.data) {
          this.banners = result.result.data
            .filter(banner => banner.enabled)
            .map(banner => banner.image)
          console.log('合坛法会头图数据加载成功，共', this.banners.length, '张')
        } else {
          console.log('合坛法会头图数据为空，使用默认数据')
          this.banners = [
            'https://th.bing.com/th/id/R.0be1795ff763e7b1c7fc5b8461bd71a4?rik=jCIjoK39WQVkDg&riu=http%3a%2f%2fi2.sinaimg.cn%2ffo%2f2013%2f1021%2fU9926P1443DT20131021102109.jpg&ehk=lTJykrYK1NPR0erOu3arFqWejphaUbYmTdOIdcndVQk%3d&risl=&pid=ImgRaw&r=0'
          ]
        }
      } catch (error) {
        console.error('加载合坛法会头图失败:', error)
        this.banners = [
          'https://th.bing.com/th/id/R.0be1795ff763e7b1c7fc5b8461bd71a4?rik=jCIjoK39WQVkDg&riu=http%3a%2f%2fi2.sinaimg.cn%2ffo%2f2013%2f1021%2fU9926P1443DT20131021102109.jpg&ehk=lTJykrYK1NPR0erOu3arFqWejphaUbYmTdOIdcndVQk%3d&risl=&pid=ImgRaw&r=0'
        ]
      }
    },
    
    async loadIntros() {
      try {
        console.log('开始加载合坛法会介绍数据...')
        const result = await uniCloud.callFunction({ 
          name: 'getJointIntros'
        })
        console.log('合坛法会介绍数据加载结果:', result)
        
        if (result.result && result.result.data && result.result.data.length > 0) {
          this.intros = result.result.data
            .filter(intro => intro.enabled)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
          console.log('合坛法会介绍数据加载成功，共', this.intros.length, '个')
        } else {
          console.log('合坛法会介绍数据为空，使用默认数据')
          this.intros = [
            {
              content: '合坛法会为多人共同参与的法会活动，包括平安祈福、姻缘和合、超度法会等。参与者共同祈福，功德共享，是集体修行的殊胜法门。',
              textColor: '#333333',
              bgColor: '#FFFFFF',
              enabled: true
            }
          ]
        }
      } catch (error) {
        console.error('加载合坛法会介绍失败:', error)
        this.intros = [
          {
            content: '合坛法会为多人共同参与的法会活动，包括平安祈福、姻缘和合、超度法会等。参与者共同祈福，功德共享，是集体修行的殊胜法门。',
            textColor: '#333333',
            bgColor: '#FFFFFF',
            enabled: true
          }
        ]
      }
    },
    
    async loadProjects() {
      try {
        console.log('开始加载合坛法会项目数据...')
        const result = await uniCloud.callFunction({ 
          name: 'getJointProjects'
        })
        console.log('合坛法会项目数据加载结果:', result)
        
        if (result.result && result.result.data) {
          this.projects = result.result.data
          console.log('合坛法会项目数据加载成功，共', this.projects.length, '个')
        } else {
          console.log('合坛法会项目数据为空，使用默认数据')
          this.projects = [
            { 
              _id: 'joint_pingan', 
              name: '平安合坛', 
              price: 200, 
              description: '祈求平安吉祥，消灾免难',
              category: '平安祈福',
              deadline: '2025-12-31',
              dates: ['2025-08-01', '2025-08-15', '2025-09-01'],
              maxApplicants: 100
            },
            { 
              _id: 'joint_yinyuan', 
              name: '姻缘合坛', 
              price: 300, 
              description: '祈求姻缘美满，感情和睦',
              category: '姻缘和合',
              deadline: '2025-12-31',
              dates: ['2025-08-10', '2025-09-10'],
              maxApplicants: 50
            },
            { 
              _id: 'joint_chaodu', 
              name: '超度合坛', 
              price: 400, 
              description: '超度亡灵，祈求往生净土',
              category: '超度法会',
              deadline: '2025-12-31',
              dates: ['2025-08-18', '2025-08-30', '2025-09-18'],
              maxApplicants: 80
            }
          ]
        }
      } catch (error) {
        console.error('加载合坛法会项目失败:', error)
        this.projects = [
          { 
            _id: 'joint_pingan', 
            name: '平安合坛', 
            price: 200, 
            description: '祈求平安吉祥，消灾免难',
            category: '平安祈福',
            deadline: '2025-12-31',
            dates: ['2025-08-01', '2025-08-15', '2025-09-01'],
            maxApplicants: 100
          },
          { 
            _id: 'joint_yinyuan', 
            name: '姻缘合坛', 
            price: 300, 
            description: '祈求姻缘美满，感情和睦',
            category: '姻缘和合',
            deadline: '2025-12-31',
            dates: ['2025-08-10', '2025-09-10'],
            maxApplicants: 50
          },
          { 
            _id: 'joint_chaodu', 
            name: '超度合坛', 
            price: 400, 
            description: '超度亡灵，祈求往生净土',
            category: '超度法会',
            deadline: '2025-12-31',
            dates: ['2025-08-18', '2025-08-30', '2025-09-18'],
            maxApplicants: 80
          }
        ]
      }
    },
    
    goToForm(project) {
      // 跳转到合坛法会报名表单页面
      uni.navigateTo({
        url: `/pages/fahui/joint/form?projectId=${project._id}`
      })
    }
  }
}
</script>

<style scoped>
.joint-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}

.banner-swiper {
  width: 100%;
  height: 400rpx;
}

.banner-img-wrap {
  width: 100%;
  height: 100%;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.intro-section {
  padding: 24rpx;
}

.intro-block {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.intro-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
  position: relative;
  z-index: 2;
}

.intro-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  z-index: 1;
}

.projects-section {
  padding: 0 24rpx 24rpx 24rpx;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.title-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.project-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.project-card:active {
  transform: scale(0.98);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.project-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.project-price {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: bold;
}

.project-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.project-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.info-item {
  font-size: 24rpx;
  color: #999;
  background: #f5f5f5;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.project-dates {
  margin-bottom: 24rpx;
}

.dates-label {
  font-size: 26rpx;
  color: #666;
}

.dates-text {
  font-size: 26rpx;
  color: #333;
}

.project-actions {
  display: flex;
  justify-content: center;
}

.join-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 20rpx 60rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.service-section {
  background: #fff;
  margin: 24rpx;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.service-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
  text-align: center;
}

.service-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.service-item {
  display: flex;
  align-items: flex-start;
}

.service-dot {
  color: #667eea;
  font-size: 28rpx;
  margin-right: 12rpx;
  margin-top: 4rpx;
}

.service-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  flex: 1;
}
</style> 