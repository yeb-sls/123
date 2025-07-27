<template>
  <view class="group-bg">
    <view class="group-container">
      <!-- 头图 -->
      <image class="group-banner" src="https://th.bing.com/th/id/R.0be1795ff763e7b1c7fc5b8461bd71a4?rik=jCIjoK39WQVkDg&riu=http%3a%2f%2fi2.sinaimg.cn%2ffo%2f2013%2f1021%2fU9926P1443DT20131021102109.jpg&ehk=lTJykrYK1NPR0erOu3arFqWejphaUbYmTdOIdcndVQk%3d&risl=&pid=ImgRaw&r=0" mode="aspectFill" />

      <!-- 图文介绍 -->
      <view class="intro-section">
        <view class="intro-title">合坛法会介绍</view>
        <view class="intro-content">
          合坛法会为多人共同参与的法会活动，包括平安祈福、姻缘和合、超度法会等。参与者共同祈福，功德共享，是集体修行的殊胜法门。
        </view>
      </view>

      <!-- 法会项目选择 -->
      <view class="section">
        <view class="section-title">
          <text class="icon">🕯️</text>法会项目
          <text class="section-tip">（必选）</text>
        </view>
        <view class="project-list">
          <view v-for="(project, index) in fahuiProjects" :key="index" class="project-item" @click="selectProject(index)">
            <view class="project-info">
              <text class="project-name">{{ project.name }}</text>
              <text class="project-desc">{{ project.description }}</text>
              <text class="project-price">¥{{ project.price }}/人</text>
            </view>
            <view class="project-status" :class="{ active: selectedProjectIndex === index }">
              <text class="status-icon">{{ selectedProjectIndex === index ? '✓' : '○' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 法会日期选择 -->
      <view class="section" v-if="selectedProjectIndex >= 0">
        <view class="section-title">
          <text class="icon">📅</text>法会日期
          <text class="section-tip">（必选）</text>
        </view>
        <view class="date-list">
          <view v-for="(date, index) in availableDates" :key="index" class="date-item" @click="selectDate(index)">
            <view class="date-info">
              <text class="date-text">{{ formatDate(date) }}</text>
              <text class="date-desc">{{ getDateDesc(date) }}</text>
            </view>
            <view class="date-status" :class="{ active: selectedDateIndex === index }">
              <text class="status-icon">{{ selectedDateIndex === index ? '✓' : '○' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 报名人信息 -->
      <view class="section">
        <view class="section-title">
          <text class="icon">👥</text>报名人信息
          <text class="section-tip">（最多5人，每人信息需完整）</text>
        </view>
        
        <view class="applicant-list">
          <view v-for="(applicant, index) in applicants" :key="index" class="applicant-card">
            <view class="applicant-header">
              <text class="applicant-title">报名人 {{ index + 1 }}</text>
              <button v-if="applicants.length > 1" class="remove-btn" @click="removeApplicant(index)">删除</button>
            </view>
            
            <view class="form-group">
              <text class="form-label">姓名 <text class="required">*</text></text>
              <input v-model="applicant.name" placeholder="请输入姓名" class="form-input" maxlength="10" />
            </view>
            
            <view class="form-group">
              <text class="form-label">性别 <text class="required">*</text></text>
              <picker :range="genderOptions" @change="onGenderChange(index, $event)" :value="genderOptions.indexOf(applicant.gender)">
                <view class="picker">
                  <text class="picker-value">{{ applicant.gender || '请选择性别' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
            
            <view class="form-group">
              <text class="form-label">联系电话 <text class="required">*</text></text>
              <input v-model="applicant.phone" placeholder="请输入联系电话" class="form-input" type="number" maxlength="11" />
            </view>
            
            <view class="form-group">
              <text class="form-label">身份证号 <text class="required">*</text></text>
              <input v-model="applicant.idCard" placeholder="请输入身份证号" class="form-input" maxlength="18" />
            </view>
            
            <view class="form-group">
              <text class="form-label">农历生日</text>
              <picker mode="date" @change="onBirthdayChange(index, $event)" :value="applicant.lunarBirthday">
                <view class="picker">
                  <text class="picker-value">{{ applicant.lunarBirthday || '请选择农历生日' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
            
            <view class="form-group">
              <text class="form-label">出生时辰</text>
              <picker :range="birthTimeOptions" @change="onBirthTimeChange(index, $event)" :value="birthTimeOptions.indexOf(applicant.birthTime)">
                <view class="picker">
                  <text class="picker-value">{{ applicant.birthTime || '请选择出生时辰' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
            
            <view class="form-group">
              <text class="form-label">常住地址</text>
              <input v-model="applicant.address" placeholder="请输入常住地址" class="form-input" />
            </view>
          </view>
        </view>
        
        <button v-if="applicants.length < 5" class="add-btn" @click="addApplicant">
          <text class="add-icon">+</text>
          <text class="add-text">添加报名人</text>
        </button>
      </view>

      <!-- 配偶信息（姻缘和合法会） -->
      <view class="section" v-if="selectedProjectIndex === 1">
        <view class="section-title">
          <text class="icon">💕</text>配偶信息
          <text class="section-tip">（选填）</text>
        </view>
        <view class="spouse-form">
          <view class="form-group">
            <text class="form-label">配偶姓名</text>
            <input v-model="spouse.name" placeholder="请输入配偶姓名" class="form-input" maxlength="10" />
          </view>
          
          <view class="form-group">
            <text class="form-label">性别</text>
            <picker :range="genderOptions" @change="onSpouseGenderChange" :value="genderOptions.indexOf(spouse.gender)">
              <view class="picker">
                <text class="picker-value">{{ spouse.gender || '请选择性别' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">联系电话</text>
            <input v-model="spouse.phone" placeholder="请输入联系电话" class="form-input" type="number" maxlength="11" />
          </view>
          
          <view class="form-group">
            <text class="form-label">农历生日</text>
            <picker mode="date" @change="onSpouseBirthdayChange" :value="spouse.lunarBirthday">
              <view class="picker">
                <text class="picker-value">{{ spouse.lunarBirthday || '请选择农历生日' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">出生时辰</text>
            <picker :range="birthTimeOptions" @change="onSpouseBirthTimeChange" :value="birthTimeOptions.indexOf(spouse.birthTime)">
              <view class="picker">
                <text class="picker-value">{{ spouse.birthTime || '请选择出生时辰' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">常住地址</text>
            <input v-model="spouse.address" placeholder="请输入常住地址" class="form-input" />
          </view>
        </view>
      </view>

      <!-- 超度信息（超度法会） -->
      <view class="section" v-if="selectedProjectIndex === 2">
        <view class="section-title">
          <text class="icon">🕯️</text>超度信息
          <text class="section-tip">（必填）</text>
        </view>
        
        <view class="form-group">
          <text class="form-label">超度类型 <text class="required">*</text></text>
          <picker :range="chaoduTypes" @change="onChaoduTypeChange" :value="chaoduTypes.indexOf(chaoduType)">
            <view class="picker">
              <text class="picker-value">{{ chaoduType || '请选择超度类型' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        
        <view class="deceased-list">
          <view v-for="(deceased, index) in deceasedList" :key="index" class="deceased-card">
            <view class="deceased-header">
              <text class="deceased-title">已故亲人 {{ index + 1 }}</text>
              <button v-if="deceasedList.length > 1" class="remove-btn" @click="removeDeceased(index)">删除</button>
            </view>
            
            <view class="form-group">
              <text class="form-label">姓名 <text class="required">*</text></text>
              <input v-model="deceased.name" placeholder="请输入姓名" class="form-input" maxlength="10" />
            </view>
            
            <view class="form-group">
              <text class="form-label">关系 <text class="required">*</text></text>
              <picker :range="relationOptions" @change="onRelationChange(index, $event)" :value="relationOptions.indexOf(deceased.relation)">
                <view class="picker">
                  <text class="picker-value">{{ deceased.relation || '请选择关系' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
            
            <view class="form-group">
              <text class="form-label">出生农历</text>
              <picker mode="date" @change="onDeceasedBirthdayChange(index, $event)" :value="deceased.lunarBirthday">
                <view class="picker">
                  <text class="picker-value">{{ deceased.lunarBirthday || '请选择出生农历' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
            
            <view class="form-group">
              <text class="form-label">去世农历</text>
              <picker mode="date" @change="onDeceasedDeathChange(index, $event)" :value="deceased.deathDate">
                <view class="picker">
                  <text class="picker-value">{{ deceased.deathDate || '请选择去世农历' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
          </view>
          
          <button v-if="deceasedList.length < 3" class="add-btn" @click="addDeceased">
            <text class="add-icon">+</text>
            <text class="add-text">添加已故亲人</text>
          </button>
        </view>
      </view>

      <!-- 代办物品 -->
      <view class="section">
        <view class="section-title">
          <text class="icon">🛍️</text>代办物品
          <text class="section-tip">（可选）</text>
        </view>
        <view class="goods-list">
          <view v-for="(item, index) in goods" :key="index" class="goods-item">
            <view class="goods-header">
              <text class="goods-title">物品 {{ index + 1 }}</text>
              <button v-if="goods.length > 1" class="remove-btn" @click="removeGoods(index)">删除</button>
            </view>
            
            <view class="form-group">
              <text class="form-label">物品名称 <text class="required">*</text></text>
              <input v-model="item.name" placeholder="请输入物品名称" class="form-input" maxlength="20" />
            </view>
            
            <view class="form-group">
              <text class="form-label">数量 <text class="required">*</text></text>
              <input v-model.number="item.qty" placeholder="请输入数量" class="form-input" type="number" min="1" />
            </view>
            
            <view class="form-group">
              <text class="form-label">单价 <text class="required">*</text></text>
              <input v-model.number="item.price" placeholder="请输入单价" class="form-input" type="number" min="1" />
            </view>
            
            <view class="form-group">
              <text class="form-label">备注</text>
              <input v-model="item.remark" placeholder="请输入备注信息" class="form-input" maxlength="50" />
            </view>
          </view>
          
          <button v-if="goods.length < 5" class="add-btn" @click="addGoods">
            <text class="add-icon">+</text>
            <text class="add-text">添加物品</text>
          </button>
        </view>
      </view>

      <!-- 收件信息 -->
      <view class="section">
        <view class="section-title">
          <text class="icon">📦</text>收件信息
          <text class="section-tip">（可选）</text>
        </view>
        <view class="receiver-form">
          <view class="form-group">
            <text class="form-label">收件人</text>
            <input v-model="receiver.name" placeholder="请输入收件人姓名" class="form-input" maxlength="10" />
          </view>
          
          <view class="form-group">
            <text class="form-label">联系电话</text>
            <input v-model="receiver.phone" placeholder="请输入联系电话" class="form-input" type="number" maxlength="11" />
          </view>
          
          <view class="form-group">
            <text class="form-label">收件地址</text>
            <textarea v-model="receiver.address" placeholder="请输入详细收件地址" class="form-textarea" maxlength="100" />
          </view>
          
          <view class="form-group">
            <text class="form-label">备注信息</text>
            <input v-model="receiver.remark" placeholder="请输入备注信息" class="form-input" maxlength="50" />
          </view>
        </view>
      </view>

      <!-- 费用预览 -->
      <view class="section">
        <view class="section-title">
          <text class="icon">💰</text>费用预览
        </view>
        <view class="cost-card">
          <view class="cost-item">
            <text class="cost-label">法会费用</text>
            <text class="cost-value">¥{{ fahuiCost }}</text>
          </view>
          <view class="cost-item" v-if="goodsCost > 0">
            <text class="cost-label">代办费用</text>
            <text class="cost-value">¥{{ goodsCost }}</text>
          </view>
          <view class="cost-item total">
            <text class="cost-label">总计</text>
            <text class="cost-value total-price">¥{{ totalCost }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="btn-group">
        <button class="submit-btn" type="primary" :loading="submitting" @click="submitForm">
          <text v-if="!submitting">提交报名</text>
          <text v-else>提交中...</text>
        </button>
        <button class="reset-btn" @click="resetForm">重置表单</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      fahuiProjects: [],
      selectedProjectIndex: -1,
      selectedDateIndex: -1,
      availableDates: [],
      genderOptions: ['男', '女'],
      birthTimeOptions: ['子时(23:00-01:00)', '丑时(01:00-03:00)', '寅时(03:00-05:00)', '卯时(05:00-07:00)', '辰时(07:00-09:00)', '巳时(09:00-11:00)', '午时(11:00-13:00)', '未时(13:00-15:00)', '申时(15:00-17:00)', '酉时(17:00-19:00)', '戌时(19:00-21:00)', '亥时(21:00-23:00)'],
      chaoduTypes: ['超度法会', '往生法会', '冥阳两利法会'],
      relationOptions: ['父亲', '母亲', '祖父', '祖母', '外祖父', '外祖母', '兄弟', '姐妹', '子女', '配偶', '其他'],
      chaoduType: '',
      applicants: [this.getEmptyApplicant()],
      spouse: this.getEmptySpouse(),
      deceasedList: [this.getEmptyDeceased()],
      goods: [this.getEmptyGoods()],
      receiver: this.getEmptyReceiver(),
      submitting: false
    }
  },
  computed: {
    fahuiCost() {
      if (this.selectedProjectIndex < 0) return 0;
      const project = this.fahuiProjects[this.selectedProjectIndex];
      return project.price * this.applicants.length;
    },
    goodsCost() {
      return this.goods.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
    },
    totalCost() {
      return this.fahuiCost + this.goodsCost;
    }
  },
  onLoad() {
    this.loadProjects()
  },
  onShow() {
    // 每次页面显示时重新加载数据
    this.loadProjects()
  },
  methods: {
    async loadProjects() {
      try {
        console.log('开始加载合坛法会项目数据...')
        const result = await uniCloud.callFunction({ 
          name: 'getFahuiProjects',
          data: { type: 'joint' }
        })
        console.log('合坛法会项目数据加载结果:', result)
        
        if (result.result && result.result.data) {
          this.fahuiProjects = result.result.data
          console.log('合坛法会项目数据加载成功，共', this.fahuiProjects.length, '个')
        } else {
          console.log('合坛法会项目数据为空，使用默认数据')
          // 如果数据库为空，使用默认数据
          this.fahuiProjects = [
            { 
              _id: 'he_pingan', 
              name: '平安合坛', 
              price: 200, 
              description: '祈求平安吉祥，消灾免难',
              dates: ['2025-08-01', '2025-08-15', '2025-09-01'] 
            },
            { 
              _id: 'he_yinyuan', 
              name: '姻缘合坛', 
              price: 300, 
              description: '祈求姻缘美满，感情和睦',
              dates: ['2025-08-10', '2025-09-10'] 
            },
            { 
              _id: 'he_chaodu', 
              name: '超度合坛', 
              price: 400, 
              description: '超度亡灵，祈求往生净土',
              dates: ['2025-08-18', '2025-08-30', '2025-09-18'] 
            }
          ]
        }
      } catch (error) {
        console.error('加载合坛法会项目失败:', error)
        // 出错时使用默认数据
        this.fahuiProjects = [
          { 
            _id: 'he_pingan', 
            name: '平安合坛', 
            price: 200, 
            description: '祈求平安吉祥，消灾免难',
            dates: ['2025-08-01', '2025-08-15', '2025-09-01'] 
          },
          { 
            _id: 'he_yinyuan', 
            name: '姻缘合坛', 
            price: 300, 
            description: '祈求姻缘美满，感情和睦',
            dates: ['2025-08-10', '2025-09-10'] 
          },
          { 
            _id: 'he_chaodu', 
            name: '超度合坛', 
            price: 400, 
            description: '超度亡灵，祈求往生净土',
            dates: ['2025-08-18', '2025-08-30', '2025-09-18'] 
          }
        ]
      }
    },
    getEmptyApplicant() {
      return {
        name: '',
        gender: '',
        phone: '',
        idCard: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      }
    },
    getEmptySpouse() {
      return {
        name: '',
        gender: '',
        phone: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      }
    },
    getEmptyDeceased() {
      return {
        name: '',
        relation: '',
        lunarBirthday: '',
        deathDate: ''
      }
    },
    getEmptyGoods() {
      return {
        name: '',
        qty: 1,
        price: 0,
        remark: ''
      }
    },
    getEmptyReceiver() {
      return {
        name: '',
        phone: '',
        address: '',
        remark: ''
      }
    },
    selectProject(index) {
      this.selectedProjectIndex = index;
      this.selectedDateIndex = -1;
      this.availableDates = this.fahuiProjects[index].dates;
    },
    selectDate(index) {
      this.selectedDateIndex = index;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}年${month}月${day}日`;
    },
    getDateDesc(dateStr) {
      const date = new Date(dateStr);
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return '已过期';
      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '明天';
      if (diffDays <= 7) return `${diffDays}天后`;
      return `${diffDays}天后`;
    },
    onGenderChange(index, e) {
      this.applicants[index].gender = this.genderOptions[e.detail.value];
    },
    onBirthdayChange(index, e) {
      this.applicants[index].lunarBirthday = e.detail.value;
    },
    onBirthTimeChange(index, e) {
      this.applicants[index].birthTime = this.birthTimeOptions[e.detail.value];
    },
    onSpouseGenderChange(e) {
      this.spouse.gender = this.genderOptions[e.detail.value];
    },
    onSpouseBirthdayChange(e) {
      this.spouse.lunarBirthday = e.detail.value;
    },
    onSpouseBirthTimeChange(e) {
      this.spouse.birthTime = this.birthTimeOptions[e.detail.value];
    },
    onChaoduTypeChange(e) {
      this.chaoduType = this.chaoduTypes[e.detail.value];
    },
    onRelationChange(index, e) {
      this.deceasedList[index].relation = this.relationOptions[e.detail.value];
    },
    onDeceasedBirthdayChange(index, e) {
      this.deceasedList[index].lunarBirthday = e.detail.value;
    },
    onDeceasedDeathChange(index, e) {
      this.deceasedList[index].deathDate = e.detail.value;
    },
    addApplicant() {
      if (this.applicants.length < 5) {
        this.applicants.push(this.getEmptyApplicant());
      }
    },
    removeApplicant(index) {
      if (this.applicants.length > 1) {
        this.applicants.splice(index, 1);
      }
    },
    addDeceased() {
      if (this.deceasedList.length < 3) {
        this.deceasedList.push(this.getEmptyDeceased());
      }
    },
    removeDeceased(index) {
      if (this.deceasedList.length > 1) {
        this.deceasedList.splice(index, 1);
      }
    },
    addGoods() {
      if (this.goods.length < 5) {
        this.goods.push(this.getEmptyGoods());
      }
    },
    removeGoods(index) {
      if (this.goods.length > 1) {
        this.goods.splice(index, 1);
      }
    },
    validateForm() {
      // 验证法会项目
      if (this.selectedProjectIndex < 0) {
        uni.showToast({ title: '请选择法会项目', icon: 'none' });
        return false;
      }
      
      // 验证法会日期
      if (this.selectedDateIndex < 0) {
        uni.showToast({ title: '请选择法会日期', icon: 'none' });
        return false;
      }
      
      // 验证报名人信息
      for (let i = 0; i < this.applicants.length; i++) {
        const applicant = this.applicants[i];
        if (!applicant.name || !applicant.gender || !applicant.phone || !applicant.idCard) {
          uni.showToast({ title: `请完善报名人${i + 1}的信息`, icon: 'none' });
          return false;
        }
        if (!/^1[3-9]\d{9}$/.test(applicant.phone)) {
          uni.showToast({ title: `报名人${i + 1}的手机号格式不正确`, icon: 'none' });
          return false;
        }
        if (!/^\d{17}[\dXx]$/.test(applicant.idCard)) {
          uni.showToast({ title: `报名人${i + 1}的身份证号格式不正确`, icon: 'none' });
          return false;
        }
      }
      
      // 验证超度信息
      if (this.selectedProjectIndex === 2) {
        if (!this.chaoduType) {
          uni.showToast({ title: '请选择超度类型', icon: 'none' });
          return false;
        }
        for (let i = 0; i < this.deceasedList.length; i++) {
          const deceased = this.deceasedList[i];
          if (!deceased.name || !deceased.relation) {
            uni.showToast({ title: `请完善已故亲人${i + 1}的信息`, icon: 'none' });
            return false;
          }
        }
      }
      
      // 验证代办物品
      for (let i = 0; i < this.goods.length; i++) {
        const item = this.goods[i];
        if (item.name && (!item.qty || !item.price)) {
          uni.showToast({ title: `请完善物品${i + 1}的数量和单价`, icon: 'none' });
          return false;
        }
      }
      
      return true;
    },
    submitForm() {
      if (!this.validateForm()) {
        return;
      }
      
      this.submitting = true;
      
      // 构建表单数据
      const formData = {
        projectId: this.fahuiProjects[this.selectedProjectIndex]._id,
        projectName: this.fahuiProjects[this.selectedProjectIndex].name,
        fahuiDate: this.availableDates[this.selectedDateIndex],
        applicants: this.applicants,
        spouse: this.selectedProjectIndex === 1 ? this.spouse : null,
        chaoduType: this.selectedProjectIndex === 2 ? this.chaoduType : null,
        deceasedList: this.selectedProjectIndex === 2 ? this.deceasedList : [],
        goods: this.goods.filter(item => item.name),
        receiver: this.receiver.name ? this.receiver : null,
        totalCost: this.totalCost,
        timestamp: new Date().getTime()
      };
      
      // 保存到本地存储
      uni.setStorageSync('groupFahuiForm', formData);
      
      setTimeout(() => {
        this.submitting = false;
        // 跳转到确认页
        uni.navigateTo({ 
          url: '/pages/fahui/confirm',
          success: () => {
            console.log('跳转到合坛法会确认页成功');
          },
          fail: (err) => {
            console.error('跳转失败:', err);
            uni.showToast({ title: '页面跳转失败', icon: 'none' });
          }
        });
      }, 1000);
    },
    resetForm() {
      uni.showModal({
        title: '确认重置',
        content: '确定要重置所有表单数据吗？',
        success: (res) => {
          if (res.confirm) {
            this.selectedProjectIndex = -1;
            this.selectedDateIndex = -1;
            this.availableDates = [];
            this.chaoduType = '';
            this.applicants = [this.getEmptyApplicant()];
            this.spouse = this.getEmptySpouse();
            this.deceasedList = [this.getEmptyDeceased()];
            this.goods = [this.getEmptyGoods()];
            this.receiver = this.getEmptyReceiver();
            uni.showToast({ title: '表单已重置', icon: 'success' });
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.group-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}
.group-container {
  padding-bottom: 40rpx;
  padding-top: 1rpx;
}
.group-banner {
  width: 100%;
  height: 300rpx;
  margin-bottom: 24rpx;
}
.intro-section {
  background: #fff;
  margin: 0 16rpx 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}
.intro-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 16rpx;
  text-align: center;
}
.intro-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  text-align: center;
}
.section {
  background: #fff;
  margin: 0 16rpx 24rpx 16rpx;
  border-radius: 18rpx;
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
.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
}
.section-tip {
  font-size: 24rpx;
  color: #666;
  margin-left: 8rpx;
}
.project-list, .date-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.project-item, .date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border: 2rpx solid #e0eaff;
  border-radius: 12rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}
.project-item.active, .date-item.active {
  border-color: #2d8cf0;
  background: #f0f8ff;
}
.project-info, .date-info {
  flex: 1;
}
.project-name, .date-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4rpx;
}
.project-desc, .date-desc {
  font-size: 24rpx;
  color: #666;
}
.project-price {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}
.project-status, .date-status {
  margin-left: 16rpx;
}
.status-icon {
  font-size: 32rpx;
  color: #2d8cf0;
  font-weight: bold;
}
.applicant-list {
  margin-bottom: 24rpx;
}
.applicant-card {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  background: #f8f9fa;
}
.applicant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}
.applicant-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
}
.remove-btn {
  font-size: 24rpx;
  color: #ff4d4f;
  background: none;
  border: none;
  padding: 8rpx 16rpx;
}
.form-group {
  margin-bottom: 18rpx;
}
.form-label {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}
.required {
  color: #ff4d4f;
  font-size: 24rpx;
}
.form-input {
  width: 100%;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}
.form-textarea {
  width: 100%;
  min-height: 80rpx;
  padding: 16rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
}
.picker {
  padding: 16rpx;
  background: #f7f7f7;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0eaff;
}
.picker-value {
  color: #333;
}
.picker-arrow {
  color: #bbb;
  font-size: 28rpx;
}
.spouse-form, .deceased-list, .goods-list, .receiver-form {
  margin-top: 16rpx;
}
.deceased-card, .goods-item {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  background: #f8f9fa;
}
.deceased-header, .goods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}
.deceased-title, .goods-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
}
.add-btn {
  width: 100%;
  height: 80rpx;
  border: 2rpx dashed #2d8cf0;
  border-radius: 8rpx;
  background: #f8f9fa;
  color: #2d8cf0;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16rpx;
}
.add-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}
.add-text {
  font-weight: bold;
}
.cost-card {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
}
.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.cost-item:last-child {
  margin-bottom: 0;
}
.cost-label {
  font-size: 28rpx;
  color: #333;
}
.cost-value {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}
.cost-item.total {
  border-top: 1px solid #e0eaff;
  padding-top: 16rpx;
  margin-top: 16rpx;
  font-weight: bold;
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
.submit-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
}
.reset-btn {
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
