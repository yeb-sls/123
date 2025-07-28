<template>
  <view class="form-bg">
    <view class="form-container">
      <!-- 步骤提示 -->
      <view class="step-bar">
        <view class="step active">1. 填写信息</view>
        <view class="step">2. 信息确认</view>
        <view class="step">3. 支付</view>
      </view>

      <!-- 活动选择卡片 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">🎯</text>活动选择 <text class="required">*</text>
        </view>
        <view class="form-group">
          <picker :range="activityTypes" @change="onActivityTypeChange" :value="activityTypeIdx">
            <view class="picker">
              <text class="icon">📋</text>活动类型：
              <text v-if="activityTypeIdx !== null">{{ activityTypes[activityTypeIdx] }}</text>
              <text v-else class="placeholder">请选择</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <view v-if="errors.activityTypeIdx" class="error-tip">{{ errors.activityTypeIdx }}</view>
        </view>
        <view class="form-group" v-if="activityTypeIdx !== null">
          <picker :range="activityList" @change="onActivityChange" :value="activityIdx">
            <view class="picker">
              <text class="icon">🎪</text>具体活动：
              <text v-if="activityIdx !== null">{{ activityList[activityIdx] }}</text>
              <text v-else class="placeholder">请选择</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <view v-if="errors.activityIdx" class="error-tip">{{ errors.activityIdx }}</view>
        </view>
        <view class="activity-info" v-if="activityIdx !== null">
          <view class="info-item">
            <text class="label">活动费用：</text>
            <text class="value">¥{{ currentFee }}</text>
          </view>
          <view class="info-item">
            <text class="label">活动时间：</text>
            <text class="value">{{ currentActivityInfo.time }}</text>
          </view>
          <view class="info-item">
            <text class="label">活动地点：</text>
            <text class="value">{{ currentActivityInfo.location }}</text>
          </view>
        </view>
      </view>

      <!-- 报名人信息卡片 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">👤</text>报名人信息 <text class="required">*</text>
        </view>
        <view class="form-group">
          <input 
            v-model="name" 
            placeholder="请输入姓名" 
            class="input" 
            maxlength="10"
            @blur="validateName"
          />
          <view v-if="errors.name" class="error-tip">{{ errors.name }}</view>
        </view>
        <view class="form-group">
          <input 
            v-model="phone" 
            placeholder="请输入联系电话" 
            class="input" 
            maxlength="11"
            type="number"
            @blur="validatePhone"
          />
          <view v-if="errors.phone" class="error-tip">{{ errors.phone }}</view>
        </view>
        <view class="form-group">
          <input 
            v-model="idCard" 
            placeholder="请输入身份证号" 
            class="input" 
            maxlength="18"
            @blur="validateIdCard"
          />
          <view v-if="errors.idCard" class="error-tip">{{ errors.idCard }}</view>
        </view>
        <view class="form-group">
          <input 
            v-model="address" 
            placeholder="请输入联系地址" 
            class="input" 
            maxlength="50"
            @blur="validateAddress"
          />
          <view v-if="errors.address" class="error-tip">{{ errors.address }}</view>
        </view>
        <view class="form-group">
          <input 
            v-model="email" 
            placeholder="请输入邮箱（选填）" 
            class="input" 
            maxlength="50"
            type="text"
          />
        </view>
      </view>

      <!-- 紧急联系人卡片 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">📞</text>紧急联系人 <text class="required">*</text>
        </view>
        <view class="form-group">
          <input 
            v-model="emergencyName" 
            placeholder="请输入紧急联系人姓名" 
            class="input" 
            maxlength="10"
            @blur="validateEmergencyName"
          />
          <view v-if="errors.emergencyName" class="error-tip">{{ errors.emergencyName }}</view>
        </view>
        <view class="form-group">
          <input 
            v-model="emergencyPhone" 
            placeholder="请输入紧急联系人电话" 
            class="input" 
            maxlength="11"
            type="number"
            @blur="validateEmergencyPhone"
          />
          <view v-if="errors.emergencyPhone" class="error-tip">{{ errors.emergencyPhone }}</view>
        </view>
        <view class="form-group">
          <picker :range="relationOptions" @change="onRelationChange" :value="relationIdx">
            <view class="picker">
              <text class="icon">👥</text>关系：
              <text v-if="relationIdx !== null">{{ relationOptions[relationIdx] }}</text>
              <text v-else class="placeholder">请选择</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <view v-if="errors.emergencyRelation" class="error-tip">{{ errors.emergencyRelation }}</view>
        </view>
      </view>

      <!-- 费用预览 -->
      <view class="card price-card" v-if="activityIdx !== null">
        <view class="card-title">
          <text class="icon">💰</text>费用预览
        </view>
        <view class="price-item">
          <text>活动费用：</text>
          <text class="price">¥{{ currentFee }}</text>
        </view>
        <view class="price-total">
          <text>总计：</text>
          <text class="total-price">¥{{ currentFee }}</text>
        </view>
      </view>

      <!-- 特殊需求卡片 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">💡</text>特殊需求（非必填）
        </view>
        <view class="form-group">
          <textarea 
            v-model="specialNeeds" 
            placeholder="请输入特殊需求或注意事项（最多100字）" 
            class="textarea" 
            maxlength="100" 
            @input="onSpecialNeedsInput"
          />
          <view class="word-count">{{ specialNeeds.length }}/100</view>
        </view>
      </view>

      <!-- 协议同意卡片 -->
      <view class="card">
        <view class="card-title">
          <text class="icon">📋</text>协议确认
        </view>
        <view class="agreement-section">
          <checkbox-group @change="onAgreementChange">
            <label class="agreement-item">
              <checkbox :value="'agree'" :checked="agreed" />
              <text class="agreement-text">我已阅读并同意</text>
              <text class="agreement-link" @click="showAgreement">《活动报名协议》</text>
            </label>
          </checkbox-group>
          <view v-if="errors.agreed" class="error-tip">{{ errors.agreed }}</view>
        </view>
      </view>

      <view class="btn-group">
        <button class="form-btn" type="primary" :loading="loading" @click="nextStep">
          <text v-if="!loading">下一步</text>
          <text v-else>提交中...</text>
        </button>
        <button class="form-btn reset" type="default" @click="resetForm">重置</button>
      </view>
      
      <!-- 返回按钮 -->
      <view class="back-section">
        <button class="back-btn" @click="goBack">返回上页</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 活动选择
      activityTypes: ['法会活动', '慈善活动', '文化活动', '其他活动'],
      activityTypeIdx: null,
      activityList: [],
      activityIdx: null,
      
      // 报名人信息
      name: '',
      phone: '',
      idCard: '',
      address: '',
      email: '',
      
      // 紧急联系人
      emergencyName: '',
      emergencyPhone: '',
      relationOptions: ['父母', '配偶', '子女', '朋友', '同事', '其他'],
      relationIdx: null,
      
      // 特殊需求
      specialNeeds: '',
      
      // 协议
      agreed: false,
      
      // 状态
      errors: {},
      loading: false,
      
      // 活动信息映射
      activityInfoMap: {
        '祈福法会': { fee: 100, time: '2024年3月15日 09:00-17:00', location: '大雄宝殿' },
        '超度法会': { fee: 150, time: '2024年3月20日 08:00-18:00', location: '观音殿' },
        '开光法会': { fee: 200, time: '2024年3月25日 07:00-19:00', location: '天王殿' },
        '放生法会': { fee: 80, time: '2024年3月30日 06:00-12:00', location: '放生池' },
        '扶贫助学': { fee: 50, time: '2024年4月5日 09:00-16:00', location: '慈善中心' },
        '敬老助残': { fee: 30, time: '2024年4月10日 08:00-15:00', location: '敬老院' },
        '环保公益': { fee: 20, time: '2024年4月15日 07:00-14:00', location: '公园' },
        '医疗救助': { fee: 100, time: '2024年4月20日 09:00-17:00', location: '医院' },
        '佛学讲座': { fee: 60, time: '2024年4月25日 19:00-21:00', location: '讲堂' },
        '禅修体验': { fee: 120, time: '2024年4月30日 06:00-18:00', location: '禅堂' },
        '文化展览': { fee: 40, time: '2024年5月5日 09:00-17:00', location: '展览馆' },
        '音乐会': { fee: 80, time: '2024年5月10日 19:00-21:00', location: '音乐厅' }
      }
    }
  },
  computed: {
    currentFee() {
      if (this.activityIdx === null) return 0;
      const activity = this.activityList[this.activityIdx];
      return this.activityInfoMap[activity]?.fee || 50;
    },
    currentActivityInfo() {
      if (this.activityIdx === null) return { fee: 0, time: '', location: '' };
      const activity = this.activityList[this.activityIdx];
      return this.activityInfoMap[activity] || { fee: 50, time: '待定', location: '待定' };
    }
  },
  watch: {
    activityTypeIdx(newVal) {
      if (newVal !== null) {
        this.updateActivityList();
        this.activityIdx = null;
      }
    }
  },
  methods: {
    // 活动选择相关
    updateActivityList() {
      const activityMap = {
        0: ['祈福法会', '超度法会', '开光法会', '放生法会'],
        1: ['扶贫助学', '敬老助残', '环保公益', '医疗救助'],
        2: ['佛学讲座', '禅修体验', '文化展览', '音乐会'],
        3: ['其他活动1', '其他活动2', '其他活动3']
      };
      this.activityList = activityMap[this.activityTypeIdx] || [];
    },
    onActivityTypeChange(e) {
      this.activityTypeIdx = e.detail.value;
      this.validateActivityType();
    },
    onActivityChange(e) {
      this.activityIdx = e.detail.value;
      this.validateActivity();
    },
    onRelationChange(e) {
      this.relationIdx = e.detail.value;
      this.validateEmergencyRelation();
    },
    
    // 表单验证
    validateActivityType() {
      if (this.activityTypeIdx === null) {
        this.errors.activityTypeIdx = '请选择活动类型';
      } else {
        delete this.errors.activityTypeIdx;
      }
    },
    validateActivity() {
      if (this.activityIdx === null) {
        this.errors.activityIdx = '请选择具体活动';
      } else {
        delete this.errors.activityIdx;
      }
    },
    validateName() {
      if (!this.name) {
        this.errors.name = '请输入姓名';
      } else if (this.name.length < 2) {
        this.errors.name = '姓名需2-10字';
      } else {
        delete this.errors.name;
      }
    },
    validatePhone() {
      if (!this.phone) {
        this.errors.phone = '请输入联系电话';
      } else if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        this.errors.phone = '手机号格式不正确';
      } else {
        delete this.errors.phone;
      }
    },
    validateIdCard() {
      if (!this.idCard) {
        this.errors.idCard = '请输入身份证号';
      } else if (!/^\d{17}[\dXx]$/.test(this.idCard)) {
        this.errors.idCard = '身份证号格式不正确';
      } else {
        delete this.errors.idCard;
      }
    },
    validateAddress() {
      if (!this.address) {
        this.errors.address = '请输入联系地址';
      } else {
        delete this.errors.address;
      }
    },
    validateEmergencyName() {
      if (!this.emergencyName) {
        this.errors.emergencyName = '请输入紧急联系人姓名';
      } else if (this.emergencyName.length < 2) {
        this.errors.emergencyName = '姓名需2-10字';
      } else {
        delete this.errors.emergencyName;
      }
    },
    validateEmergencyPhone() {
      if (!this.emergencyPhone) {
        this.errors.emergencyPhone = '请输入紧急联系人电话';
      } else if (!/^1[3-9]\d{9}$/.test(this.emergencyPhone)) {
        this.errors.emergencyPhone = '紧急联系人手机号格式不正确';
      } else {
        delete this.errors.emergencyPhone;
      }
    },
    validateEmergencyRelation() {
      if (this.relationIdx === null) {
        this.errors.emergencyRelation = '请选择与紧急联系人关系';
      } else {
        delete this.errors.emergencyRelation;
      }
    },
    
    // 特殊需求
    onSpecialNeedsInput() {
      if (this.specialNeeds.length > 100) {
        this.specialNeeds = this.specialNeeds.slice(0, 100);
      }
    },
    
    // 协议相关
    onAgreementChange(e) {
      this.agreed = e.detail.value.length > 0;
      this.validateAgreement();
    },
    validateAgreement() {
      if (!this.agreed) {
        this.errors.agreed = '请阅读并同意活动报名协议';
      } else {
        delete this.errors.agreed;
      }
    },
    showAgreement() {
      uni.showModal({
        title: '活动报名协议',
        content: '1. 参与者需遵守活动现场秩序\n2. 活动期间请保持安静\n3. 如有身体不适请及时告知\n4. 活动费用一经支付不予退还\n5. 活动时间地点如有变更将提前通知',
        showCancel: false,
        confirmText: '我知道了'
      });
    },
    
    // 表单验证
    validate() {
      this.validateActivityType();
      this.validateActivity();
      this.validateName();
      this.validatePhone();
      this.validateIdCard();
      this.validateAddress();
      this.validateEmergencyName();
      this.validateEmergencyPhone();
      this.validateEmergencyRelation();
      this.validateAgreement();
      
      return Object.keys(this.errors).length === 0;
    },
    
    // 提交处理
    nextStep() {
      if (!this.validate()) {
        uni.showToast({ title: '请完善表单信息', icon: 'none' });
        return;
      }
      
      this.loading = true;
      
      // 构建表单数据
      const data = {
        activityType: this.activityTypes[this.activityTypeIdx],
        activity: this.activityList[this.activityIdx],
        fee: this.currentFee,
        activityInfo: this.currentActivityInfo,
        name: this.name,
        phone: this.phone,
        idCard: this.idCard,
        address: this.address,
        email: this.email,
        emergencyName: this.emergencyName,
        emergencyPhone: this.emergencyPhone,
        emergencyRelation: this.relationOptions[this.relationIdx],
        specialNeeds: this.specialNeeds,
        agreed: this.agreed,
        timestamp: new Date().getTime()
      }
      
      // 保存到本地存储
      uni.setStorageSync('orderForm', data);
      
      setTimeout(() => {
        this.loading = false;
        // 跳转到确认页
        uni.navigateTo({ 
          url: '/pages/order/confirm',
          success: () => {
            console.log('跳转到活动报名确认页成功');
          },
          fail: (err) => {
            console.error('跳转失败:', err);
            uni.showToast({ title: '页面跳转失败', icon: 'none' });
          }
        });
      }, 800);
    },
    
    // 重置表单
    resetForm() {
      uni.showModal({
        title: '确认重置',
        content: '确定要重置所有表单信息吗？',
        success: (res) => {
          if (res.confirm) {
            this.activityTypeIdx = null;
            this.activityIdx = null;
            this.name = '';
            this.phone = '';
            this.idCard = '';
            this.address = '';
            this.email = '';
            this.emergencyName = '';
            this.emergencyPhone = '';
            this.relationIdx = null;
            this.specialNeeds = '';
            this.agreed = false;
            this.errors = {};
            uni.showToast({ title: '表单已重置', icon: 'success' });
          }
        }
      });
    },
    
    // 返回处理
    goBack() {
      uni.navigateBack({
        success: () => {
          console.log('返回上页成功');
        },
        fail: (err) => {
          console.error('返回上页失败:', err);
          // 如果返回失败，跳转到活动报名主页
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
    }
  },
  
  onLoad() {
    // 自动填充上次填写
    const last = uni.getStorageSync('orderForm');
    if (last) {
      this.activityTypeIdx = this.activityTypes.indexOf(last.activityType);
      this.updateActivityList();
      this.activityIdx = this.activityList.indexOf(last.activity);
      this.name = last.name || '';
      this.phone = last.phone || '';
      this.idCard = last.idCard || '';
      this.address = last.address || '';
      this.email = last.email || '';
      this.emergencyName = last.emergencyName || '';
      this.emergencyPhone = last.emergencyPhone || '';
      this.relationIdx = this.relationOptions.indexOf(last.emergencyRelation);
      this.specialNeeds = last.specialNeeds || '';
      this.agreed = last.agreed || false;
    }
  }
}
</script>

<style scoped>
.form-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.form-container {
  padding-bottom: 40rpx;
  padding-top: 1rpx;
}
.step-bar {
  display: flex;
  justify-content: space-between;
  margin: 32rpx 16rpx 24rpx 16rpx;
  background: #fff;
  border-radius: 18rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.step {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #bbb;
  position: relative;
}
.step.active {
  color: #2d8cf0;
  font-weight: bold;
}
.card {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
  margin: 24rpx 16rpx 0 16rpx;
  padding: 32rpx 24rpx 12rpx 24rpx;
}
.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
}
.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
}
.required {
  color: #ff4d4f;
  font-size: 26rpx;
  margin-left: 8rpx;
}
.form-group {
  margin-bottom: 18rpx;
}
.input {
  display: block;
  width: 100%;
  margin: 6rpx 0;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}
.textarea {
  display: block;
  width: 100%;
  min-height: 80rpx;
  margin: 6rpx 0;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}
.word-count {
  text-align: right;
  font-size: 22rpx;
  color: #bbb;
  margin-top: 2rpx;
}
.picker {
  margin: 6rpx 0;
  padding: 16rpx;
  background: #f7f7f7;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  border: 1px solid #e0eaff;
  position: relative;
  cursor: pointer;
}
.arrow {
  position: absolute;
  right: 24rpx;
  color: #bbb;
  font-size: 28rpx;
  pointer-events: none;
}
.placeholder {
  color: #bbb;
}
.error-tip {
  color: #ff4d4f;
  font-size: 24rpx;
  margin-top: 2rpx;
  margin-left: 8rpx;
}
.activity-info {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-top: 12rpx;
}
.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
  font-size: 26rpx;
}
.info-item .label {
  color: #666;
}
.info-item .value {
  color: #2d8cf0;
  font-weight: bold;
}
.agreement-section {
  margin-top: 12rpx;
}
.agreement-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #333;
}
.agreement-text {
  margin-left: 8rpx;
}
.agreement-link {
  color: #2d8cf0;
  text-decoration: underline;
}

.price-card {
  background: linear-gradient(135deg, #fff7ec 0%, #fff 100%);
  border: 2rpx solid #ffd591;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  font-size: 28rpx;
  color: #666;
}

.price {
  color: #ff6b35;
  font-weight: bold;
}

.price-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1px solid #ffd591;
  font-size: 30rpx;
  font-weight: bold;
}

.total-price {
  color: #ff4d4f;
  font-size: 32rpx;
}
.btn-group {
  display: flex;
  gap: 24rpx;
  margin: 48rpx 16rpx 0 16rpx;
}
.form-btn {
  flex: 1;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  letter-spacing: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-btn.reset {
  background: #f8f9fa;
  color: #2d8cf0;
  box-shadow: none;
  border: 2rpx solid #e0eaff;
}
.back-section {
  margin: 24rpx 16rpx 0 16rpx;
}
.back-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  color: #666;
  border: 2rpx solid #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 