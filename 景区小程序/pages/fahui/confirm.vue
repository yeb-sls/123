<template>
  <view class="confirm-bg">
    <view class="confirm-container">
      <view class="confirm-title">报名确认</view>
      
      <!-- 报名人信息 -->
      <view class="section-title">报名人信息</view>
      <view class="info-card" v-for="(applicant, idx) in formData.applicants" :key="idx">
        <view class="info-header">
          <text class="info-label">报名人 {{ idx + 1 }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">姓名：</text>
          <text class="info-value">{{ applicant.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">性别：</text>
          <text class="info-value">{{ applicant.gender }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">电话：</text>
          <text class="info-value">{{ applicant.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">农历生日：</text>
          <text class="info-value">{{ applicant.lunarBirthday }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">出生时辰：</text>
          <text class="info-value">{{ applicant.birthTime }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">常住地址：</text>
          <text class="info-value">{{ applicant.address }}</text>
        </view>
      </view>

      <!-- 法会信息 -->
      <view class="section-title">法会信息</view>
      <view class="info-card">
        <view class="info-row">
          <text class="info-key">法会项目：</text>
          <text class="info-value">{{ formData.fahuiProject ? formData.fahuiProject.name : '' }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">项目描述：</text>
          <text class="info-value">{{ formData.fahuiProject ? formData.fahuiProject.description : '' }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">单价：</text>
          <text class="info-value">¥{{ formData.fahuiProject ? formData.fahuiProject.price : 0 }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">报名人数：</text>
          <text class="info-value">{{ formData.applicants ? formData.applicants.length : 0 }} 人</text>
        </view>
        <view class="info-row">
          <text class="info-key">法会费用：</text>
          <text class="info-value">¥{{ (formData.fahuiProject ? formData.fahuiProject.price : 0) * (formData.applicants ? formData.applicants.length : 0) }}</text>
        </view>
      </view>

      <!-- 配偶信息（如果有） -->
      <view v-if="formData.spouse && formData.spouse.name" class="section-title">配偶信息</view>
      <view v-if="formData.spouse && formData.spouse.name" class="info-card">
        <view class="info-row">
          <text class="info-key">姓名：</text>
          <text class="info-value">{{ formData.spouse.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">性别：</text>
          <text class="info-value">{{ formData.spouse.gender }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">电话：</text>
          <text class="info-value">{{ formData.spouse.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">农历生日：</text>
          <text class="info-value">{{ formData.spouse.lunarBirthday }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">出生时辰：</text>
          <text class="info-value">{{ formData.spouse.birthTime }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">常住地址：</text>
          <text class="info-value">{{ formData.spouse.address }}</text>
        </view>
      </view>

      <!-- 超度信息（如果有） -->
      <view v-if="formData.chaoduType" class="section-title">超度信息</view>
      <view v-if="formData.chaoduType" class="info-card">
        <view class="info-row">
          <text class="info-key">超度类型：</text>
          <text class="info-value">{{ formData.chaoduType }}</text>
        </view>
      </view>

      <!-- 已故亲人信息（如果有） -->
      <view v-if="formData.deceasedList && formData.deceasedList.length > 0" class="section-title">已故亲人信息</view>
      <view v-if="formData.deceasedList && formData.deceasedList.length > 0" class="info-card" v-for="(deceased, idx) in formData.deceasedList" :key="idx">
        <view class="info-header">
          <text class="info-label">已故亲人 {{ idx + 1 }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">姓名：</text>
          <text class="info-value">{{ deceased.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">关系：</text>
          <text class="info-value">{{ deceased.relation }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">出生农历：</text>
          <text class="info-value">{{ deceased.lunarBirthday }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">去世农历：</text>
          <text class="info-value">{{ deceased.deathDate }}</text>
        </view>
      </view>

      <!-- 代办物品（如果有） -->
      <view v-if="formData.goods && formData.goods.length > 0" class="section-title">代办物品</view>
      <view v-if="formData.goods && formData.goods.length > 0" class="info-card">
        <view class="info-row" v-for="(item, idx) in formData.goods" :key="idx">
          <text class="info-key">{{ item.name }}：</text>
          <text class="info-value">{{ item.qty }} 个（￥{{ item.price * item.qty }}）</text>
        </view>
        <view class="info-row total-row">
          <text class="info-key">代办费用：</text>
          <text class="info-value">￥{{ goodsTotalPrice }}</text>
        </view>
      </view>

      <!-- 收件信息（如果有） -->
      <view v-if="formData.receiver && formData.receiver.name" class="section-title">收件信息</view>
      <view v-if="formData.receiver && formData.receiver.name" class="info-card">
        <view class="info-row">
          <text class="info-key">收件人：</text>
          <text class="info-value">{{ formData.receiver.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">联系电话：</text>
          <text class="info-value">{{ formData.receiver.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-key">收件地址：</text>
          <text class="info-value">{{ formData.receiver.address }}</text>
        </view>
      </view>

      <!-- 费用总计 -->
      <view class="section-title">费用总计</view>
      <view class="info-card total-card">
        <view class="info-row">
          <text class="info-key">法会费用：</text>
          <text class="info-value">¥{{ (formData.fahuiProject ? formData.fahuiProject.price : 0) * (formData.applicants ? formData.applicants.length : 0) }}</text>
        </view>
        <view class="info-row" v-if="goodsTotalPrice > 0">
          <text class="info-key">代办费用：</text>
          <text class="info-value">¥{{ goodsTotalPrice }}</text>
        </view>
        <view class="info-row total-row">
          <text class="info-key">总计：</text>
          <text class="info-value total-price">¥{{ totalPrice }}</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="btn-group">
        <button class="confirm-btn" type="primary" @click="goPay">确认报名</button>
        <button class="back-btn" @click="goBack">返回修改</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    goodsPriceDetail() {
      // This function is no longer available from utils/price.js
      // It will return an empty object or throw an error if called directly.
      // For now, we'll return a placeholder or remove it if not used.
      // Since the original code had this, we'll keep it, but it will be broken.
      return { finalTotal: 0 }; // Placeholder
    },
    goodsTotalPrice() {
      if (!this.formData.goods || !Array.isArray(this.formData.goods)) return 0
      return this.formData.goods.reduce((sum, item) => {
        const price = Number(item.price) || 0
        const qty = Number(item.qty) || 0
        return sum + price * qty
      }, 0)
    },
    goodsTotalPriceFormatted() {
      // This function is no longer available from utils/price.js
      // It will return '¥0' or throw an error if called directly.
      return '¥0'; // Placeholder
    },
    totalPrice() {
      const price = Number(this.formData.fahuiProject && this.formData.fahuiProject.price) || 0
      const count = Array.isArray(this.formData.applicants) ? this.formData.applicants.length : 0
      const goods = Number(this.goodsTotalPrice) || 0
      // 总计 = 法会项目金额 + 代办费用
      return ((price * count) + goods).toFixed(2)
    },
    totalPriceFormatted() {
      // This function is no longer available from utils/price.js
      // It will return '¥0' or throw an error if called directly.
      return '¥0'; // Placeholder
    }
  },
  onLoad() {
    // 获取表单数据
    const data = uni.getStorageSync('fahuiForm');
    if (data) {
      this.formData = data;
    } else {
      uni.showToast({ title: '未找到报名数据', icon: 'none' });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    goPay() {
      // 保存确认数据
      uni.setStorageSync('fahuiConfirm', {
        ...this.formData,
        confirmTime: new Date().getTime()
      });
      
      uni.navigateTo({ 
        url: '/pages/fahui/pay',
        success: () => {
          console.log('跳转到专场法会支付页成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({ title: '页面跳转失败', icon: 'none' });
        }
      });
    },
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回修改成功');
        },
        fail: (err) => {
          console.error('返回失败:', err);
          // 如果返回失败，跳转到专场法会主页
          uni.navigateTo({ 
            url: '/pages/fahui/special',
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
    }
  }
}
</script>

<style scoped>
.confirm-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.confirm-container {
  padding-bottom: 40rpx;
  padding-top: 1rpx;
}
.confirm-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin: 32rpx 0 24rpx 0;
  letter-spacing: 2rpx;
}
.section-title {
  font-weight: bold;
  margin: 28rpx 0 10rpx 0;
  font-size: 30rpx;
  color: #2d8cf0;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.info-card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(224, 234, 255, 0.3);
  padding: 24rpx 20rpx 16rpx 20rpx;
  margin: 0 16rpx 12rpx 16rpx;
  border: 2rpx solid #f0f8ff;
  transition: all 0.3s ease;
}
.info-header {
  margin-bottom: 12rpx;
}
.info-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
}
.info-row {
  display: flex;
  gap: 18rpx;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
  line-height: 1.4;
}
.info-key {
  color: #666;
  min-width: 120rpx;
}
.info-value {
  color: #333;
  font-weight: 500;
  flex: 1;
}
.total-row {
  border-top: 1px solid #e0eaff;
  padding-top: 12rpx;
  margin-top: 12rpx;
  font-weight: bold;
}
.total-card {
  background: linear-gradient(135deg, #f0f8ff 0%, #e0eaff 100%);
  border: 2rpx solid #2d8cf0;
}
.total-price {
  color: #ff4d4f;
  font-size: 32rpx;
  font-weight: bold;
}
.btn-group {
  margin: 48rpx 16rpx 0 16rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.confirm-btn {
  width: 100%;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  letter-spacing: 2rpx;
}
.back-btn {
  width: 100%;
  font-size: 28rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
  font-weight: bold;
}
</style> 