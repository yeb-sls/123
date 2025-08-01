<template>
  <view class="cert-page">
    <view class="page-header">
      <view class="page-title">我的功德证书</view>
      <view class="cert-count">共 {{ certificates.length }} 张证书</view>
    </view>

    <view class="cert-list">
              <view v-for="(cert, index) in certificates" :key="index" class="cert-item" @click="viewCert(cert)">
        <view class="cert-preview">
          <image :src="cert.preview" class="cert-image" mode="aspectFit" />
        </view>
        <view class="cert-info">
          <view class="cert-title">{{ cert.title }}</view>
          <view class="cert-desc">{{ cert.description }}</view>
          <view class="cert-date">{{ cert.date }}</view>
        </view>
        <view class="cert-status">
          <text class="status-text" :class="cert.status">{{ cert.statusText }}</text>
        </view>
      </view>
    </view>

    <!-- 证书详情弹窗 -->
    <uni-popup :show="showCertPopup" type="center" @close="closeCertDetail">
      <view class="cert-detail">
        <view class="detail-header">
          <text class="detail-title">功德证书</text>
          <button class="close-btn" @click="closeCertDetail">×</button>
        </view>
        <view class="detail-content">
          <image :src="currentCert.fullImage" class="detail-image" mode="widthFix" />
        </view>
        <view class="detail-info">
          <view class="info-item">
            <text class="info-label">证书类型：</text>
            <text class="info-value">{{ currentCert.title }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">功德内容：</text>
            <text class="info-value">{{ currentCert.description }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">颁发日期：</text>
            <text class="info-value">{{ currentCert.date }}</text>
          </view>
          <view class="info-item" v-if="currentCert.amount">
            <text class="info-label">功德金额：</text>
            <text class="info-value">¥{{ currentCert.amount }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

export default {
  components: {
    uniPopup
  },
  data() {
    return {
      certificates: [
        {
          id: 1,
          title: '功德布施证书',
          description: '善款捐赠功德证书',
          date: '2025-01-15',
          status: 'completed',
          statusText: '已完成',
          preview: '/static/cert-preview1.jpg',
          fullImage: '/static/cert-full1.jpg',
          amount: 500
        },
        {
          id: 2,
          title: '供灯功德证书',
          description: '大愿灯塔A一层供灯一年',
          date: '2025-01-10',
          status: 'active',
          statusText: '供奉中',
          preview: '/static/cert-preview2.jpg',
          fullImage: '/static/cert-full2.jpg',
          amount: 200
        },
        {
          id: 3,
          title: '殿堂供品证书',
          description: '香烛套装供品功德证书',
          date: '2025-01-05',
          status: 'completed',
          statusText: '已完成',
          preview: '/static/cert-preview3.jpg',
          fullImage: '/static/cert-full3.jpg',
          amount: 300
        },
        {
          id: 4,
          title: '法会功德证书',
          description: '平安法会功德证书',
          date: '2024-12-20',
          status: 'completed',
          statusText: '已完成',
          preview: '/static/cert-preview4.jpg',
          fullImage: '/static/cert-full4.jpg',
          amount: 200
        }
      ],
      currentCert: {},
      showCertPopup: false
    }
  },
  onLoad() {
    this.loadCertificates()
  },
  methods: {
    loadCertificates() {
      // 从本地存储或服务器加载功德证书数据
      const savedCerts = uni.getStorageSync('userCertificates')
      if (savedCerts) {
        this.certificates = savedCerts
      }
    },
    viewCert(cert) {
      this.currentCert = cert
      this.showCertPopup = true
    },
    closeCertDetail() {
      this.showCertPopup = false
    }
  }
}
</script>

<style scoped>
.cert-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 40rpx;
}

.page-header {
  padding: 32rpx 16rpx 24rpx 16rpx;
  background: #fff;
  margin-bottom: 24rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 8rpx;
}

.cert-count {
  font-size: 26rpx;
  color: #666;
}

.cert-list {
  padding: 0 16rpx;
}

.cert-item {
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  transition: transform 0.2s;
}

.cert-item:active {
  transform: scale(0.98);
}

.cert-preview {
  width: 120rpx;
  height: 120rpx;
  margin-right: 24rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cert-image {
  width: 100%;
  height: 100%;
}

.cert-info {
  flex: 1;
}

.cert-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.cert-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.cert-date {
  font-size: 24rpx;
  color: #999;
}

.cert-status {
  margin-left: 16rpx;
}

.status-text {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.status-text.completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-text.active {
  background: #e6f7ff;
  color: #1890ff;
}

.cert-detail {
  background: #fff;
  border-radius: 18rpx;
  width: 90vw;
  max-height: 80vh;
  overflow: hidden;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 24rpx 24rpx 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.detail-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #f8f9fa;
  color: #666;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.detail-content {
  padding: 24rpx;
  text-align: center;
}

.detail-image {
  width: 100%;
  max-height: 400rpx;
  border-radius: 12rpx;
}

.detail-info {
  padding: 24rpx;
  border-top: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  width: 140rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}
</style> 