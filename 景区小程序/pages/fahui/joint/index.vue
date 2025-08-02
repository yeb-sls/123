<template>
  <view class="joint-page">
    <!-- 头图轮播 -->
    <swiper class="banner-swiper" indicator-dots autoplay interval="3000" duration="500" v-if="banners.length > 0">
              <swiper-item v-for="(banner, idx) in banners" :key="idx">
        <view class="banner-img-wrap">
          <image :src="banner" class="banner-img" mode="aspectFill" :key="'banner-' + idx + '-' + Date.now()" />
        </view>
      </swiper-item>
    </swiper>
    
    <!-- 默认头图已移除，无头图时不显示任何图片 -->
    


    <!-- 合坛法会介绍模块 -->
    <view v-if="intros.length > 0" class="intro-section">
      <view class="intro-title">合坛法会介绍</view>
      <view v-for="(intro, index) in intros" :key="getIntroKey(intro, index)" class="intro-block" v-if="intro.enabled">
        <view class="intro-content" :style="{ color: intro.textColor }">
          {{ intro.content }}
        </view>
        <image v-if="intro.bgImage" :src="intro.bgImage" class="intro-bg" mode="aspectFill" />
        <!-- 调试输出 -->
        <view v-if="showDebug">
          <button @click="logIntroDebug(intro, index)">调试输出intro[{{index}}]</button>
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
// 导入云对象
const jointManagement = uniCloud.importObject('joint-management')

export default {
  data() {
    return {
      banners: [],
      intros: [],
      projects: [],
      showDebug: false  // 关闭调试模式
    }
  },
  
  onLoad() {
    this.loadBanners()
    this.loadIntros()
    this.loadProjects()
  },
  
  onShow() {
    // 每次页面显示时重新加载数据
    console.log('页面显示，重新加载数据...')
    // 强制清除可能的缓存
    this.banners = []
    this.loadBanners()
    this.loadIntros()
    this.loadProjects()
  },
  
  onPullDownRefresh() {
    // 下拉刷新
    console.log('下拉刷新，重新加载数据...')
    this.loadBanners()
    this.loadIntros()
    this.loadProjects()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  

  
  methods: {

    
    async loadBanners() {
      try {
        const result = await jointManagement.getBanners()
        if (result.success && result.data && result.data.length > 0) {
          // 过滤掉_id为空的数据，并且只显示启用的头图
          const validBanners = result.data.filter(banner => banner._id && banner.enabled)
          if (validBanners.length > 0) {
            // 处理fileID转换为临时URL
            const processedBanners = []
            for (const banner of validBanners) {
              let imageUrl = banner.image
              // 如果是fileID格式，需要转换为临时URL
              if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('https')) {
                try {
                  const tempRes = await uniCloud.getTempFileURL({ fileList: [imageUrl] })
                  imageUrl = tempRes.fileList[0].tempFileURL
                } catch (err) {
                  continue // 跳过这个头图
                }
              }
              // 无论是否转换，都加时间戳强制刷新图片缓存
              if (imageUrl && imageUrl.startsWith('http')) {
                // 使用更精确的时间戳，确保每次都是唯一的
                const timestamp = Date.now() + Math.random()
                imageUrl = imageUrl + '?t=' + timestamp
              }
              processedBanners.push(imageUrl)
            }
            this.banners = processedBanners
          } else {
            this.banners = []
          }
        } else {
          this.banners = []
        }
      } catch (error) {
        this.banners = []
      }
    },
    
    getIntroKey(intro, index) {
      return intro._id || `intro_${index}`
    },
    async loadIntros() {
      try {
        console.log('开始加载合坛法会介绍数据...')
        const result = await jointManagement.getIntros()
        console.log('合坛法会介绍数据加载结果:', result)
        if (result.success && result.data && result.data.length > 0) {
          this.intros = result.data
            .filter(intro => intro.enabled)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
          console.log('合坛法会介绍数据加载成功，共', this.intros.length, '个')
          this.intros.forEach((intro, idx) => {
            console.log(`【自动调试】intro[${idx}]`, intro)
            console.log('渲染文字：', intro.content)
            console.log('文字颜色：', intro.textColor)
            console.log('背景图片：', intro.bgImage)
            console.log('是否启用：', intro.enabled)
            console.log('排序：', intro.order)
          })
        } else {
          this.intros = []
          console.log('合坛法会介绍数据为空，前台不显示介绍内容')
        }
      } catch (error) {
        console.error('加载合坛法会介绍失败:', error)
        this.intros = []
      }
    },
    
    async loadProjects() {
      try {
        console.log('【调试】开始加载合坛法会项目数据...')
        const result = await jointManagement.getProjects()
        console.log('【调试】getJointProjects 云函数返回：', result)
        if (result.success && result.data && result.data.length > 0) {
          this.projects = result.data
          console.log('【调试】最终渲染的项目数组 this.projects =', this.projects)
        } else {
          console.log('【调试】合坛法会项目数据为空，使用默认数据')
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
        console.log('【调试】当前 this.projects =', this.projects)
      } catch (error) {
        console.error('加载合坛法会项目失败:', error)
        this.projects = []
      }
    },
    
    goToForm(project) {
      console.log('🔍 调试信息 - 用户点击报名按钮')
      console.log('🔍 调试信息 - 选中的项目:', project)
      console.log('🔍 调试信息 - 页面路径:', '/pages/fahui/joint/index')
      
      // 跳转到合坛法会报名表单页面
      uni.navigateTo({
        url: `/pages/fahui/joint/form?projectId=${project._id}`,
        success: () => {
          console.log('✅ 跳转到表单页面成功')
        },
        fail: (err) => {
          console.error('❌ 跳转到表单页面失败:', err)
        }
      })
    },

    logIntroDebug(intro, index) {
      console.log(`【合坛法会介绍调试】index=${index}`)
      console.log('intro对象：', intro)
      console.log('渲染文字：', intro.content)
      console.log('文字颜色：', intro.textColor)
      console.log('背景图片：', intro.bgImage)
      console.log('是否启用：', intro.enabled)
      console.log('排序：', intro.order)
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

.intro-section {
  padding: 24rpx;
}

.intro-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2673ff;
  text-align: center;
  margin-bottom: 24rpx;
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
</style> 