<template>
  <view class="profile-container">
    <button type="primary" @click="goOrders">我的订单</button>
    <button @click="goMerit">我的功德值</button>
    <button @click="goCert">我的功德证书</button>
    <button @click="goSpecial">我的专场法会</button>
    <button @click="goGroup">我的合坛法会</button>
    <button @click="goLight">我的供灯</button>
    <button @click="goHall">我的殿堂供品</button>
    <button @click="goGongde">我的功德布施</button>
    <button @click="goActivity">我的活动</button>
    <button @click="goApplicant">报名者信息</button>
  </view>
</template>

<script>
export default {
  methods: {
    goOrders() {
      uni.navigateTo({ url: '/pages/profile/orders' });
    },
    goMerit() {
      uni.navigateTo({ url: '/pages/profile/merit' });
    },
    goCert() {
      uni.navigateTo({ url: '/pages/profile/cert' });
    },
    goSpecial() {
      uni.navigateTo({ url: '/pages/profile/special' });
    },
    goGroup() {
      uni.navigateTo({ url: '/pages/profile/group' });
    },
    goLight() {
      uni.navigateTo({ url: '/pages/profile/light' });
    },
    goHall() {
      uni.navigateTo({ url: '/pages/profile/hall' });
    },
    goGongde() {
      uni.navigateTo({ url: '/pages/profile/gongde' });
    },
    goActivity() {
      uni.navigateTo({ url: '/pages/profile/activity' });
    },
    goApplicant() {
      uni.navigateTo({ url: '/pages/profile/applicant' });
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
button {
  width: 100%;
}
</style>