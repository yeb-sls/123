<template>
  <view class="home-bg">
    <view class="home-container">
      <!-- 头图轮播 -->
      <swiper class="banner-swiper" indicator-dots autoplay interval="3000" duration="500">
        <swiper-item v-for="(img, idx) in banners" :key="idx">
          <view class="banner-img-wrap">
            <image :src="img" class="banner-img" mode="aspectFill" />
          </view>
        </swiper-item>
      </swiper>

      <!-- 图文介绍 -->
      <view v-if="intros.length > 0">
        <view v-for="(intro, index) in intros" :key="getIntroKey(intro, index)" class="intro-block" v-if="intro.enabled">
          <view class="intro-content" :style="{ color: intro.textColor }">
            {{ intro.content }}
          </view>
          <image v-if="intro.bgImage" :src="intro.bgImage" class="intro-bg" mode="aspectFill" />
        </view>
      </view>
      <!-- 默认介绍（当没有数据时显示） -->
      <view v-else class="intro-block">
        <view class="intro-content">
          欢迎使用景区小程序，提供法会报名、供灯、殿堂供品、功德布施、活动等一站式服务，助您方便参与各类善举。
        </view>
      </view>

      <!-- 按钮导航栏 -->
      <view class="nav-grid">
        <view v-for="(nav, idx) in navs" :key="idx" class="nav-item" @click="goPage(nav.url)">
          <view class="nav-icon-wrap" :style="{ backgroundColor: nav.bgColor }">
            <text class="nav-icon" :style="{ color: nav.color }">{{ nav.icon }}</text>
          </view>
          <view class="nav-text" :style="{ color: nav.color }">{{ nav.text }}</view>
        </view>
      </view>



      <!-- 服务说明 -->
      <view class="service-section">
        <view class="service-title">服务说明</view>
        <view class="service-content">
          <view class="service-item">
            <text class="service-dot">•</text>
            <text class="service-text">所有服务均通过官方认证，安全可靠</text>
          </view>
          <view class="service-item">
            <text class="service-dot">•</text>
            <text class="service-text">支持多种支付方式，操作简单便捷</text>
          </view>
          <view class="service-item">
            <text class="service-dot">•</text>
            <text class="service-text">提供完整的订单跟踪和售后服务</text>
          </view>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="footer-section">
        <text class="footer-text">景区小程序 v1.0</text>
        <text class="footer-copyright">© 2024 版权所有</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [],
      navs: [],
      intros: []
    }
  },
  onLoad() {
    console.log('首页加载');
    this.loadBanners();
    this.loadNavs();
    this.loadIntros();
  },
  onShow() {
    // 每次页面显示时重新加载数据
    console.log('首页显示，重新加载数据');
    this.loadBanners();
    this.loadNavs();
    this.loadIntros();
  },
  methods: {
    async loadBanners() {
      try {
        console.log('开始加载首页轮播图数据...');
        const result = await uniCloud.callFunction({ name: 'getHomeBanners' });
        console.log('轮播图数据加载结果:', result);
        
        if (result.result && result.result.data) {
          // 只显示启用的轮播图
          this.banners = result.result.data
            .filter(banner => banner.status === '启用')
            .map(banner => banner.imageUrl);
          console.log('轮播图数据加载成功，共', this.banners.length, '张');
        } else {
          console.log('轮播图数据为空，使用默认数据');
          // 如果数据库为空，使用默认数据
          this.banners = [
            'https://x0.ifengimg.com/res/2021/B24BDD0F48689B1C72D12B447ADC687A0F7903FC_size249_w1080_h720.jpeg',
            'https://p2.itc.cn/q_70/images01/20211028/f0c35680e83a488cbecc2375c11b6e6f.jpeg',
            'https://tse4.mm.bing.net/th/id/OIP.3_6OJZXzr7fOnsIcOBixnQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'
          ];
        }
      } catch (error) {
        console.error('加载轮播图失败:', error);
        // 出错时使用默认数据
        this.banners = [
          'https://x0.ifengimg.com/res/2021/B24BDD0F48689B1C72D12B447ADC687A0F7903FC_size249_w1080_h720.jpeg',
          'https://p2.itc.cn/q_70/images01/20211028/f0c35680e83a488cbecc2375c11b6e6f.jpeg',
          'https://tse4.mm.bing.net/th/id/OIP.3_6OJZXzr7fOnsIcOBixnQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'
        ];
      }
    },
    
    // 加载导航数据
    async loadNavs() {
      try {
        console.log('开始加载首页导航数据...');
        const result = await uniCloud.callFunction({ name: 'getHomeNavs' });
        console.log('导航数据加载结果:', result);
        
        if (result.result && result.result.data) {
          // 只显示启用的导航，按排序字段排序
          this.navs = result.result.data
            .filter(nav => nav.enabled)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          console.log('导航数据加载成功，共', this.navs.length, '个');
        } else {
          console.log('导航数据为空，使用默认数据');
          // 如果数据库为空，使用默认数据
          this.navs = [
            { text: '专场法会', icon: '🕉️', url: '/pages/fahui/special', color: '#FF6B35', bgColor: '#FFF7EC' },
            { text: '合坛法会', icon: '🙏', url: '/pages/fahui/group', color: '#2D8CF0', bgColor: '#E0EAFF' },
            { text: '供灯祈福', icon: '💡', url: '/pages/light/index', color: '#FFD700', bgColor: '#FFFBF0' },
            { text: '殿堂供品', icon: '🏛️', url: '/pages/hall/index', color: '#8B4513', bgColor: '#F5F5DC' },
            { text: '功德布施', icon: '💰', url: '/pages/gongde/index', color: '#32CD32', bgColor: '#F0FFF0' },
            { text: '活动报名', icon: '🎯', url: '/pages/order/index', color: '#FF69B4', bgColor: '#FFF0F5' }
          ];
        }
      } catch (error) {
        console.error('加载导航失败:', error);
        // 出错时使用默认数据
        this.navs = [
          { text: '专场法会', icon: '🕉️', url: '/pages/fahui/special', color: '#FF6B35', bgColor: '#FFF7EC' },
          { text: '合坛法会', icon: '🙏', url: '/pages/fahui/group', color: '#2D8CF0', bgColor: '#E0EAFF' },
          { text: '供灯祈福', icon: '💡', url: '/pages/light/index', color: '#FFD700', bgColor: '#FFFBF0' },
          { text: '殿堂供品', icon: '🏛️', url: '/pages/hall/index', color: '#8B4513', bgColor: '#F5F5DC' },
          { text: '功德布施', icon: '💰', url: '/pages/gongde/index', color: '#32CD32', bgColor: '#F0FFF0' },
          { text: '活动报名', icon: '🎯', url: '/pages/order/index', color: '#FF69B4', bgColor: '#FFF0F5' }
        ];
      }
    },
    
    // 加载介绍数据
    async loadIntros() {
      try {
        console.log('开始加载首页介绍数据...');
        const result = await uniCloud.callFunction({ name: 'getHomeIntros' });
        console.log('介绍数据加载结果:', result);
        
        if (result.result && result.result.data && result.result.data.length > 0) {
          // 只显示启用的介绍，按排序字段排序
          this.intros = result.result.data
            .filter(intro => intro.enabled)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          console.log('介绍数据加载成功，共', this.intros.length, '个');
          console.log('介绍数据详情:', this.intros);
        } else {
          console.log('介绍数据为空或不存在，使用默认数据');
          // 如果数据库为空，使用默认数据
          this.intros = [
            {
              content: '欢迎使用景区小程序，提供法会报名、供灯、殿堂供品、功德布施、活动等一站式服务，助您方便参与各类善举。',
              textColor: '#333333',
              bgColor: '#FFFFFF',
              enabled: true
            }
          ];
        }
      } catch (error) {
        console.error('加载介绍失败:', error);
        console.error('错误详情:', error.message);
        // 出错时使用默认数据
        this.intros = [
          {
            content: '欢迎使用景区小程序，提供法会报名、供灯、殿堂供品、功德布施、活动等一站式服务，助您方便参与各类善举。',
            textColor: '#333333',
            bgColor: '#FFFFFF',
            enabled: true
          }
        ];
      }
    },
    
    getIntroKey(intro, index) {
      return intro._id || 'intro-' + index;
    },
    
    goPage(url) {
      if (url) {
        console.log('跳转到页面：', url);
        uni.navigateTo({ 
          url,
          success: () => {
            console.log('页面跳转成功');
          },
          fail: (err) => {
            console.error('页面跳转失败：', err);
            uni.showToast({ 
              title: '页面跳转失败，请重试', 
              icon: 'none' 
            });
          }
        });
      } else {
        console.error('跳转URL为空');
        uni.showToast({ 
          title: '页面配置错误', 
          icon: 'none' 
        });
      }
    },


  }
}
</script>

<style scoped>
.home-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}
.home-container {
  padding: 0;
  margin: 0;
}
.banner-swiper {
  width: 100%;
  height: 420rpx;
  margin: 0;
  border-radius: 0;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.banner-img-wrap {
  width: 100%;
  height: 420rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-img {
  width: 100%;
  height: 420rpx;
  border-radius: 0;
  box-shadow: none;
}
.nav-grid {
  display: flex;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0;
  margin: 0;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.1);
  padding: 24rpx 12rpx 32rpx 12rpx;
  border: none;
  backdrop-filter: blur(10rpx);
}
.nav-item {
  width: 33.333%;
  padding: 16rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16rpx;
}
.nav-item:active {
  transform: translateY(-6rpx) scale(1.03);
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}
.nav-item:active::before {
  opacity: 1;
}
.nav-icon-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.nav-icon-wrap::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.nav-item:active .nav-icon-wrap {
  transform: scale(1.08);
  box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.15);
}
.nav-item:active .nav-icon-wrap::before {
  opacity: 1;
}
.nav-icon {
  font-size: 40rpx;
  font-weight: bold;
  z-index: 1;
  position: relative;
  display: block;
  text-align: center;
}
.nav-text {
  font-size: 24rpx;
  font-weight: 600;
  margin-top: 6rpx;
  text-align: center;
  line-height: 1.2;
  letter-spacing: 0.5rpx;
}
.intro-block {
  background: #ffffff;
  margin: 0 8rpx;
  border-radius: 12rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: none;
  position: relative;
  overflow: hidden;
}

.intro-content {
  font-size: 26rpx;
  color: #555;
  line-height: 1.6;
  letter-spacing: 0.5rpx;
}
.intro-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.1;
}



.service-section {
  background: rgba(255, 255, 255, 0.8);
  margin: 0;
  padding: 32rpx 20rpx;
  backdrop-filter: blur(8rpx);
}
.service-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin-bottom: 24rpx;
  letter-spacing: 1rpx;
}
.service-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.service-item {
  display: flex;
  align-items: flex-start;
  padding: 0 16rpx;
}
.service-dot {
  color: #2d8cf0;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 12rpx;
  margin-top: 2rpx;
}
.service-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

.footer-section {
  background: rgba(255, 255, 255, 0.7);
  padding: 24rpx 20rpx;
  text-align: center;
  backdrop-filter: blur(8rpx);
}
.footer-text {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  font-weight: 500;
}
.footer-copyright {
  display: block;
  font-size: 22rpx;
  color: #999;
}


</style>
