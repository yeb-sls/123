<template>
  <view class="form-bg">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <view v-else class="form-container">
      <view class="form-title">专场法会报名</view>
      <view class="form-help">
        <text>📝 请仔细填写所有必填信息，确保信息准确完整</text>
        <text>👥 可添加最多5位报名人，每人信息需完整</text>
        <text>💝 不同法会类型有特殊要求，请按提示填写</text>
        <text>💾 数据会自动保存，可随时返回继续填写</text>
      </view>

      <!-- 报名人信息管理 -->
      <view class="section-title">报名人信息 <text class="section-tip">（最多5人，每人信息需完整）</text></view>
      <view class="section-tip-full">点击"编辑"按钮可修改报名人信息</view>
      <view class="applicant-list">
        <view v-for="(applicant, idx) in applicants" :key="idx" class="applicant-card">
          <view class="applicant-header">
            <text class="applicant-name">{{ applicant.name || '未填写' }}</text>
            <view class="applicant-actions">
              <button class="mini-btn" size="mini" @click="openApplicantDialog(idx)">编辑</button>
              <button v-if="applicants.length > 1" class="mini-btn danger" size="mini" @click="removeApplicant(idx)">删除</button>
            </view>
          </view>
          <view class="applicant-info-row">
            <text>性别：</text><text class="info-value">{{ applicant.gender || '未选' }}</text>
            <text>电话：</text><text class="info-value">{{ applicant.phone || '未填' }}</text>
          </view>
          <view class="applicant-info-row">
            <text>农历生日：</text><text class="info-value">{{ applicant.lunarBirthday || '未选' }}</text>
            <text>出生时辰：</text><text class="info-value">{{ applicant.birthTime || '未选' }}</text>
          </view>
          <view class="applicant-info-row">
            <text>常住地址：</text><text class="info-value">{{ applicant.address || '未填' }}</text>
          </view>
        </view>
      </view>
      <button class="add-btn" @click="addApplicant" :disabled="applicants.length>=5" size="mini">+ 添加报名人</button>

      <!-- 报名人弹窗 -->
      <uni-popup ref="popup" type="center">
        <view class="popup-content">
          <view class="popup-title">报名者信息</view>
          <view class="popup-tip">带 * 的字段为必填项</view>
          <input v-model="editApplicant.name" placeholder="* 姓名（必填）" class="input" maxlength="20" @blur="validateName" @input="saveDraft" />
          <picker :range="genderOptions" @change="onGenderChange" :value="genderOptions.indexOf(editApplicant.gender)">
            <view class="picker">
              <text class="picker-label">* 性别：</text>
              <text class="picker-value">{{ editApplicant.gender || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <input v-model="editApplicant.phone" placeholder="* 联系电话（必填）" class="input" type="number" maxlength="11" @blur="validatePhone" @input="saveDraft" />
          <picker mode="date" @change="onLunarBirthdayChange" :value="editApplicant.lunarBirthday">
            <view class="picker">
              <text class="picker-label">* 农历生日：</text>
              <text class="picker-value">{{ editApplicant.lunarBirthday || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <picker :range="birthTimeOptions" @change="onBirthTimeChange" :value="birthTimeOptions.indexOf(editApplicant.birthTime)">
            <view class="picker">
              <text class="picker-label">* 出生时辰：</text>
              <text class="picker-value">{{ editApplicant.birthTime || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <input v-model="editApplicant.address" placeholder="* 常住地址（必填）" class="input" @input="saveDraft" />
          <view class="popup-btns">
            <button class="popup-btn primary" @click="saveApplicant">保存</button>
            <button class="popup-btn" @click="closePopup">取消</button>
          </view>
        </view>
      </uni-popup>

      <!-- 法会信息 -->
      <view class="section-title">法会项目信息</view>
      <view class="card">
        <picker :range="fahuiProjects.map(p=>p.name)" @change="onProjectChange" :value="fahuiProjectIdx">
          <view class="picker">
            <text class="picker-label">法会项目：</text>
            <text class="picker-value">{{ currentProject ? currentProject.name : '请选择' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
        <view class="fahui-tip">法会日期：<text class="info-value">预订成功后道长与您联系确认</text></view>
      </view>

      <!-- 姻缘特殊提示，仅在分类为姻缘时显示 -->
      <view v-if="currentProject && currentProject.category==='姻缘'" class="special-tip">
        <text>如需填写配偶信息，请点击下方按钮</text>
        <button class="mini-btn" size="mini" @click="openSpouseDialog">填写配偶信息（选填）</button>
      </view>

      <!-- 超度特殊输入，仅在分类为超度时显示 -->
      <view v-if="currentProject && currentProject.category==='超度'">
        <view class="section-title">超度类型 <text class="section-tip">（必选）</text></view>
        <view class="card">
          <picker :range="chaoduTypes" @change="onChaoduTypeChange" :value="chaoduTypes.indexOf(chaoduType)">
            <view class="picker">
              <text class="picker-label">超度类型：</text>
              <text class="picker-value">{{ chaoduType || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="section-title">已故亲人信息 <text class="section-tip">（至少1人，最多5人）</text></view>
        <view class="section-tip-full">点击"编辑"按钮可修改已故亲人信息</view>
        <view class="deceased-list">
          <view v-for="(deceased, idx) in deceasedList" :key="idx" class="deceased-card">
            <view class="deceased-header">
              <text class="deceased-name">{{ deceased.name || '未填写' }}</text>
              <view class="deceased-actions">
                <button class="mini-btn" size="mini" @click="openDeceasedDialog(idx)">编辑</button>
                <button v-if="deceasedList.length>1" class="mini-btn danger" size="mini" @click="removeDeceased(idx)">删除</button>
              </view>
            </view>
            <view class="deceased-info-row">
              <text>出生农历：</text><text class="info-value">{{ deceased.lunarBirthday || '未选' }}</text>
              <text>去世农历：</text><text class="info-value">{{ deceased.deathDate || '未选' }}</text>
            </view>
            <view class="deceased-info-row">
              <text>关系：</text><text class="info-value">{{ deceased.relation || '未选' }}</text>
            </view>
          </view>
        </view>
        <button v-if="deceasedList.length < 5" class="add-btn" @click="addDeceased">
          <text class="add-icon">+</text>
          <text class="add-text">添加已故亲人</text>
        </button>
      </view>

      <!-- 已故亲人信息弹窗 -->
      <uni-popup ref="deceasedPopup" type="center">
        <view class="popup-content">
          <view class="popup-title">已故亲人信息</view>
          <view class="popup-tip">带 * 的字段为必填项，建议填写出生和去世日期</view>
          <input v-model="editDeceased.name" placeholder="* 姓名（必填）" class="input" maxlength="20" @input="saveDraft" />
          <picker mode="date" @change="onDeceasedLunarBirthdayChange" :value="editDeceased.lunarBirthday">
            <view class="picker">
              <text class="picker-label">出生农历：</text>
              <text class="picker-value">{{ editDeceased.lunarBirthday || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <picker mode="date" @change="onDeceasedDeathDateChange" :value="editDeceased.deathDate">
            <view class="picker">
              <text class="picker-label">去世农历：</text>
              <text class="picker-value">{{ editDeceased.deathDate || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <picker :range="deceasedRelationOptions" @change="onDeceasedRelationChange" :value="deceasedRelationOptions.indexOf(editDeceased.relation)">
            <view class="picker">
              <text class="picker-label">* 关系：</text>
              <text class="picker-value">{{ editDeceased.relation || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <view class="popup-btns">
            <button class="popup-btn primary" @click="saveDeceased">保存</button>
            <button class="popup-btn" @click="closeDeceasedPopup">取消</button>
          </view>
        </view>
      </uni-popup>

      <!-- 代办物品（可选） -->
      <view class="section-title" v-if="showItems">代办物品 <text class="section-tip">（可选）</text></view>
      <view v-if="showItems" class="card">
        <view v-for="(item, idx) in items" :key="idx" class="item-row">
          <text>{{ item.name }}（￥{{ item.price }}）</text>
          <input type="number" v-model.number="item.count" min="0" class="input item-input" @input="saveDraft" />
        </view>
      </view>

      <!-- 收件信息（可选） -->
      <view class="section-title" v-if="showReceiver">收件信息 <text class="section-tip">（可选）</text></view>
      <view v-if="showReceiver" class="card">
        <input v-model="receiver.name" placeholder="请输入收件人" class="input" @input="saveDraft" />
        <input v-model="receiver.phone" placeholder="请输入收件人电话" class="input" @input="saveDraft" />
        <input v-model="receiver.address" placeholder="请输入收件人地址" class="input" @input="saveDraft" />
      </view>

      <button class="form-btn" type="primary" @click="nextStep" :disabled="isSubmitting">
        <view v-if="isSubmitting" class="btn-loading">
          <view class="btn-spinner"></view>
          <text>提交中...</text>
        </view>
        <text v-else>下一步</text>
      </button>
      
      <!-- 调试信息（开发时可显示） -->
      <view v-if="false" class="debug-info">
        <text>报名人数：{{ applicants.length }}</text>
        <text>已故亲人数：{{ deceasedList.length }}</text>
        <text>法会项目：{{ currentProject ? currentProject.name : '未选择' }}</text>
      </view>
      
      <!-- 错误提示 -->
      <view v-if="errorMessage" class="error-message">
        <text>{{ errorMessage }}</text>
        <button class="error-btn" @click="clearError">知道了</button>
      </view>
    </view>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
  components: { uniPopup },
  data() {
    return {
      applicants: [this.defaultApplicant()],
      editApplicant: {},
      editIdx: null,
      genderOptions: ['男', '女'],
      birthTimeOptions: [
        '吉时', '子时23-01点', '丑时01-03点', '寅时03-05点', '卯时05-07点',
        '辰时07-09点', '巳时09-11点', '午时11-13点', '未时13-15点',
        '申时15-17点', '酉时17-19点', '戌时19-21点', '亥时21-23点'
      ],
      // fahuiProjects为对象数组，包含name和category
      fahuiProjects: [
        { name: '超度法会', category: '超度' },
        { name: '姻缘和合法会', category: '姻缘' },
        { name: '平安法会', category: '平安' },
        { name: '祈福法会', category: '祈福' }
      ],
      fahuiProjectIdx: null,
      spouse: this.defaultApplicant(),
      chaoduTypes: ['先祖超度', '冤亲债主超度', '婴灵超度', '其他'],
      chaoduType: '',
      deceasedList: [this.defaultDeceased()],
      editDeceased: {},
      editDeceasedIdx: null,
      isSubmitting: false,
      isLoading: true,
      errorMessage: '',
      deceasedRelationOptions: [
        '先曾祖父', '先曾祖母', '先祖父', '先祖母', '外祖父', '外祖母', '先父', '先母',
        '岳父', '岳母', '先夫', '先妻', '故爱子', '故爱女', '好友', '恩师', '其他'
      ],
      showItems: true,
      items: [],
      showReceiver: true,
      receiver: { name: '', phone: '', address: '' }
    }
  },
  computed: {
    currentProject() {
      if (this.fahuiProjectIdx === null || !this.fahuiProjects.length) return null;
      return this.fahuiProjects[this.fahuiProjectIdx];
    }
  },
  onLoad(options) {
    // 判断入口类型
    this.isGroup = options.type === 'group';
    // 初始化编辑对象
    this.editApplicant = this.defaultApplicant();
    this.editDeceased = this.defaultDeceased();
    
    // 动态加载代办物品配置
    this.loadGoodsConfig();
    
    // 尝试加载草稿数据
    try {
      const draft = uni.getStorageSync('fahuiFormDraft');
      if (draft) {
        this.applicants = draft.applicants || [this.defaultApplicant()];
        this.fahuiProjectIdx = draft.fahuiProjectIdx || null;
        this.spouse = draft.spouse || this.defaultApplicant();
        this.chaoduType = draft.chaoduType || '';
        this.deceasedList = draft.deceasedList || [this.defaultDeceased()];
        // this.items = draft.items || this.items; // 禁止覆盖items
        this.receiver = draft.receiver || { name: '', phone: '', address: '' };
      }
    } catch (error) {
      console.error('加载草稿失败：', error);
    }
    
    // 设置加载完成
    this.isLoading = false;
  },
  onUnload() {
    // 保存草稿数据
    try {
      const draft = {
        applicants: this.applicants,
        fahuiProjectIdx: this.fahuiProjectIdx,
        spouse: this.spouse,
        chaoduType: this.chaoduType,
        deceasedList: this.deceasedList,
        items: this.items,
        receiver: this.receiver
      };
      uni.setStorageSync('fahuiFormDraft', draft);
    } catch (error) {
      console.error('保存草稿失败：', error);
    }
  },
  onShow() {
    this.loadGoodsConfig();
    this.saveDraft();
  },
  methods: {
    defaultApplicant() {
      return { name: '', gender: '', phone: '', lunarBirthday: '', birthTime: '', address: '' };
    },
    defaultDeceased() {
      return { name: '', lunarBirthday: '', deathDate: '', relation: '' };
    },
    addApplicant() {
      if (this.applicants.length < 5) {
        this.applicants.push(this.defaultApplicant());
        // 重置编辑对象
        this.editApplicant = this.defaultApplicant();
        // 自动保存草稿
        this.saveDraft();
      }
    },
    removeApplicant(idx) {
      this.applicants.splice(idx, 1);
      // 重置编辑对象
      this.editApplicant = this.defaultApplicant();
      // 自动保存草稿
      this.saveDraft();
    },
    openApplicantDialog(idx) {
      this.editIdx = idx;
      this.editApplicant = { ...this.applicants[idx] };
      this.$refs.popup.open();
    },
    saveApplicant() {
      // 校验
      const a = this.editApplicant;
      if (!a.name || !a.gender || !a.phone || !a.lunarBirthday || !a.birthTime || !a.address) {
        uni.showToast({ title: '请完整填写报名者信息', icon: 'none' });
        return;
      }
      // 姓名长度验证
      if (a.name.length < 2) {
        uni.showToast({ title: '姓名至少2个字符', icon: 'none' });
        return;
      }
      // 手机号格式验证
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(a.phone)) {
        uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
        return;
      }
      this.$set(this.applicants, this.editIdx, { ...a });
      this.closePopup();
      // 自动保存草稿
      this.saveDraft();
      // 显示成功提示
      uni.showToast({ title: '报名人信息保存成功', icon: 'success' });
    },
    closePopup() {
      this.$refs.popup.close();
      // 重置编辑对象
      this.editApplicant = this.defaultApplicant();
    },
    // 配偶信息
    openSpouseDialog() {
      this.$refs.spousePopup.open();
    },
    saveSpouse() {
      // 配偶信息选填，但如果有填写则进行基本校验
      if (this.spouse.name && (!this.spouse.gender || !this.spouse.phone || !this.spouse.lunarBirthday || !this.spouse.birthTime || !this.spouse.address)) {
        uni.showToast({ title: '请完整填写配偶信息', icon: 'none' });
        return;
      }
      // 手机号格式验证
      if (this.spouse.phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(this.spouse.phone)) {
          uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
          return;
        }
      }
      this.closeSpousePopup();
      this.saveDraft();
      // 显示成功提示
      uni.showToast({ title: '配偶信息保存成功', icon: 'success' });
    },
    closeSpousePopup() {
      this.$refs.spousePopup.close();
      // 重置配偶信息
      this.spouse = this.defaultApplicant();
    },
    // 超度法会
    addDeceased() {
      if (this.deceasedList.length < 5) {
        this.deceasedList.push(this.defaultDeceased());
        // 重置编辑对象
        this.editDeceased = this.defaultDeceased();
      }
    },
    removeDeceased(idx) {
      this.deceasedList.splice(idx, 1);
      // 重置编辑对象
      this.editDeceased = this.defaultDeceased();
    },
    onProjectChange(e) {
      this.fahuiProjectIdx = e.detail.value;
      // 清空特殊信息
      this.spouse = this.defaultApplicant();
      this.chaoduType = '';
      this.deceasedList = [this.defaultDeceased()];
      // 重置编辑状态
      this.editApplicant = {};
      this.editDeceased = {};
      // 自动保存草稿
      this.saveDraft();
    },
    onChaoduTypeChange(e) {
      this.chaoduType = this.chaoduTypes[e.detail.value];
      // 自动保存草稿
      this.saveDraft();
    },
    nextStep() {
      if (this.isSubmitting) return;
      
      try {
        this.isSubmitting = true;
        
        // 校验报名人
        for (const a of this.applicants) {
          if (!a.name || !a.gender || !a.phone || !a.lunarBirthday || !a.birthTime || !a.address) {
            uni.showToast({ title: '请完整填写报名人信息', icon: 'none' });
            this.isSubmitting = false;
            return;
          }
          // 姓名长度验证
          if (a.name.length < 2) {
            uni.showToast({ title: '姓名至少2个字符', icon: 'none' });
            this.isSubmitting = false;
            return;
          }
          // 手机号格式验证
          const phoneRegex = /^1[3-9]\d{9}$/;
          if (!phoneRegex.test(a.phone)) {
            uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
            this.isSubmitting = false;
            return;
          }
        }
        if (this.fahuiProjectIdx === null) {
          uni.showToast({ title: '请选择法会项目', icon: 'none' });
          this.isSubmitting = false;
          return;
        }
        // 姻缘校验
        if (this.currentProject && this.currentProject.category === '姻缘') {
          // 配偶信息选填，但如果有填写则进行基本校验
          if (this.spouse.name && (!this.spouse.gender || !this.spouse.phone || !this.spouse.lunarBirthday || !this.spouse.birthTime || !this.spouse.address)) {
            uni.showToast({ title: '请完整填写配偶信息', icon: 'none' });
            this.isSubmitting = false;
            return;
          }
          // 配偶手机号格式验证
          if (this.spouse.phone) {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(this.spouse.phone)) {
              uni.showToast({ title: '请输入正确的配偶手机号码', icon: 'none' });
              this.isSubmitting = false;
              return;
            }
          }
        }
        // 超度校验
        if (this.currentProject && this.currentProject.category === '超度') {
          if (!this.chaoduType) {
            uni.showToast({ title: '请选择超度类型', icon: 'none' });
            this.isSubmitting = false;
            return;
          }
          if (this.deceasedList.length < 1) {
            uni.showToast({ title: '请至少填写一位已故亲人信息', icon: 'none' });
            this.isSubmitting = false;
            return;
          }
          for (const d of this.deceasedList) {
            if (!d.name || !d.relation) {
              uni.showToast({ title: '请完整填写亡者姓名和关系', icon: 'none' });
              this.isSubmitting = false;
              return;
            }
            // 姓名长度验证
            if (d.name.length < 2) {
              uni.showToast({ title: '亡者姓名至少2个字符', icon: 'none' });
              this.isSubmitting = false;
              return;
            }
                  // 建议填写出生和去世日期，但不强制
      if (!d.lunarBirthday || !d.deathDate) {
        uni.showToast({ title: '建议填写亡者的出生和去世日期', icon: 'none', duration: 2000 });
        this.isSubmitting = false;
        return;
      }
          }
        }
        // 组装数据
        const data = {
          applicants: this.applicants,
          fahuiProject: this.currentProject ? this.currentProject.name : '',
          spouse: this.spouse,
          chaoduType: this.chaoduType,
          deceasedList: this.deceasedList,
          items: this.items.filter(i => i.count > 0),
          receiver: this.showReceiver ? this.receiver : null
        };
        uni.setStorageSync('fahuiForm', data);
        uni.navigateTo({ 
          url: '/pages/fahui/confirm',
          success: () => {
            console.log('数据保存成功，跳转到确认页面');
            uni.showToast({ title: '数据保存成功', icon: 'success' });
            // 清除草稿数据
            try {
              uni.removeStorageSync('fahuiFormDraft');
            } catch (error) {
              console.error('清除草稿失败：', error);
            }
            this.isSubmitting = false;
          },
          fail: (err) => {
            console.error('跳转失败：', err);
            this.errorMessage = '页面跳转失败，请重试';
            this.isSubmitting = false;
          }
        });
              } catch (error) {
          console.error('表单提交错误：', error);
          this.errorMessage = '提交失败，请检查网络连接后重试';
          this.isSubmitting = false;
        }
    },
    onGenderChange(e) {
      this.editApplicant.gender = this.genderOptions[e.detail.value];
      this.saveDraft();
    },
    onLunarBirthdayChange(e) {
      this.editApplicant.lunarBirthday = e.detail.value;
      this.saveDraft();
    },
    onBirthTimeChange(e) {
      this.editApplicant.birthTime = this.birthTimeOptions[e.detail.value];
      this.saveDraft();
    },
    onSpouseGenderChange(e) {
      this.spouse.gender = this.genderOptions[e.detail.value];
      this.saveDraft();
    },
    onSpouseLunarBirthdayChange(e) {
      this.spouse.lunarBirthday = e.detail.value;
      this.saveDraft();
    },
    onSpouseBirthTimeChange(e) {
      this.spouse.birthTime = this.birthTimeOptions[e.detail.value];
      this.saveDraft();
    },
    // 已故亲人信息编辑
    openDeceasedDialog(idx) {
      this.editDeceasedIdx = idx;
      this.editDeceased = { ...this.deceasedList[idx] };
      this.$refs.deceasedPopup.open();
    },
    saveDeceased() {
      // 校验
      const d = this.editDeceased;
      if (!d.name || !d.relation) {
        uni.showToast({ title: '请完整填写亡者姓名和关系', icon: 'none' });
        return;
      }
      // 姓名长度验证
      if (d.name.length < 2) {
        uni.showToast({ title: '姓名至少2个字符', icon: 'none' });
        return;
      }
      // 建议填写出生和去世日期
      if (!d.lunarBirthday || !d.deathDate) {
        uni.showToast({ title: '建议填写亡者的出生和去世日期', icon: 'none', duration: 2000 });
        return;
      }
      this.$set(this.deceasedList, this.editDeceasedIdx, { ...d });
      this.closeDeceasedPopup();
      // 自动保存草稿
      this.saveDraft();
      // 显示成功提示
      uni.showToast({ title: '已故亲人信息保存成功', icon: 'success' });
    },
    closeDeceasedPopup() {
      this.$refs.deceasedPopup.close();
      // 重置编辑对象
      this.editDeceased = this.defaultDeceased();
    },
    onDeceasedLunarBirthdayChange(e) {
      this.editDeceased.lunarBirthday = e.detail.value;
      this.saveDraft();
    },
    onDeceasedDeathDateChange(e) {
      this.editDeceased.deathDate = e.detail.value;
      this.saveDraft();
    },
    onDeceasedRelationChange(e) {
      this.editDeceased.relation = this.deceasedRelationOptions[e.detail.value];
      this.saveDraft();
    },
    clearError() {
      this.errorMessage = '';
    },
    validateName() {
      if (this.editApplicant.name && this.editApplicant.name.length < 2) {
        uni.showToast({ title: '姓名至少2个字符', icon: 'none' });
      }
    },
    validatePhone() {
      if (this.editApplicant.phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(this.editApplicant.phone)) {
          uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
        }
      }
    },
    saveDraft() {
      try {
        const draft = {
          applicants: this.applicants,
          fahuiProjectIdx: this.fahuiProjectIdx,
          spouse: this.spouse,
          chaoduType: this.chaoduType,
          deceasedList: this.deceasedList,
          items: this.items,
          receiver: this.receiver
        };
        uni.setStorageSync('fahuiFormDraft', draft);
      } catch (error) {
        console.error('保存草稿失败：', error);
      }
    },
    async loadGoodsConfig() {
      try {
        const result = await uniCloud.callFunction({ name: 'getFahuiGoodsConfig' });
        console.log('云函数返回:', result.result.data.goods);
        if (result.result && result.result.data) {
          this.showItems = !!result.result.data.enabled;
          this.items = Array.isArray(result.result.data.goods)
            ? result.result.data.goods.filter(g => g.enabled).map(g => ({ ...g, count: 0 }))
            : [];
        } else {
          this.showItems = false;
          this.items = [];
        }
      } catch (error) {
        this.showItems = false;
        this.items = [];
        console.error('加载代办物品配置失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.form-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 50%, #f0f8ff 100%);
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 24rpx;
}
.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #e0eaff;
  border-top: 4rpx solid #2d8cf0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 4rpx 16rpx rgba(45, 140, 240, 0.2);
}
.loading-text {
  font-size: 28rpx;
  color: #2d8cf0;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.form-container {
  padding-bottom: 40rpx;
  padding-top: 1rpx;
}
.form-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2d8cf0;
  text-align: center;
  margin: 32rpx 0 24rpx 0;
  letter-spacing: 2rpx;
  text-shadow: 0 2rpx 4rpx rgba(45, 140, 240, 0.1);
}
.form-help {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-radius: 12rpx;
  padding: 24rpx 28rpx;
  margin: 0 16rpx 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  border: 2rpx solid #e0eaff;
  box-shadow: 0 4rpx 8rpx rgba(45, 140, 240, 0.1);
}
.form-help text {
  font-size: 24rpx;
  color: #2d8cf0;
  line-height: 1.4;
  position: relative;
  padding-left: 20rpx;
}
.form-help text::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #5cadff;
  font-weight: bold;
}
.section-title {
  font-weight: bold;
  margin: 28rpx 0 10rpx 0;
  font-size: 30rpx;
  color: #2d8cf0;
  display: flex;
  align-items: center;
  gap: 12rpx;
  position: relative;
}
.section-title::before {
  content: '';
  width: 6rpx;
  height: 30rpx;
  background: linear-gradient(180deg, #2d8cf0 0%, #5cadff 100%);
  border-radius: 3rpx;
  margin-right: 8rpx;
}
.section-tip {
  font-size: 22rpx;
  color: #888;
  font-weight: normal;
}
.section-tip-full {
  font-size: 24rpx;
  color: #2d8cf0;
  margin: 8rpx 0 16rpx 0;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-radius: 8rpx;
  border-left: 4rpx solid #2d8cf0;
  box-shadow: 0 2rpx 4rpx rgba(45, 140, 240, 0.1);
  position: relative;
}
.section-tip-full::before {
  content: '💡';
  position: absolute;
  left: 12rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20rpx;
}
.applicant-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 12rpx;
}
.applicant-card, .deceased-card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(224, 234, 255, 0.3);
  padding: 24rpx 20rpx 16rpx 20rpx;
  border: 2rpx solid #f0f8ff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10rpx);
}
.card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(224, 234, 255, 0.3);
  padding: 24rpx 20rpx 16rpx 20rpx;
  margin-bottom: 12rpx;
  border: 2rpx solid #f0f8ff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10rpx);
}
.card:hover {
  box-shadow: 0 6rpx 20rpx rgba(224, 234, 255, 0.4);
  transform: translateY(-1rpx);
}
.applicant-card:hover, .deceased-card:hover {
  box-shadow: 0 6rpx 20rpx rgba(224, 234, 255, 0.4);
  transform: translateY(-2rpx);
}
.applicant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}
.applicant-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
}
.applicant-actions {
  display: flex;
  gap: 12rpx;
}
.applicant-info-row {
  display: flex;
  gap: 18rpx;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 2rpx;
  line-height: 1.4;
}
.info-value {
  color: #333;
  margin-right: 8rpx;
  font-weight: 500;
}
.add-btn {
  width: 100%;
  margin: 12rpx 0 0 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e6f3ff 100%);
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(45, 140, 240, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}
.add-btn:active {
  background: #e0eaff;
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(45, 140, 240, 0.2);
}
.add-btn[disabled] {
  background: #f5f5f5;
  color: #ccc;
  border-color: #eee;
  box-shadow: none;
}
.add-icon {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
}
.add-text {
  font-size: 28rpx;
  color: #2d8cf0;
}
.mini-btn {
  font-size: 24rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
  padding: 0 16rpx;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}
.mini-btn:active {
  transform: scale(0.95);
  background: #e0eaff;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}
.mini-btn.danger {
  background: linear-gradient(135deg, #ffeded 0%, #ffe6e6 100%);
  color: #ff4d4f;
  border: 2rpx solid #ffb3b3;
}
.mini-btn.danger:active {
  background: #ffd6d6;
  transform: scale(0.95);
  box-shadow: 0 1rpx 2rpx rgba(255, 77, 79, 0.2);
}
.fahui-tip {
  color: #888;
  font-size: 24rpx;
  margin: 8rpx 0 0 0;
}
.special-tip {
  background: linear-gradient(135deg, #fffbe6 0%, #fff7cc 100%);
  color: #d48806;
  border-radius: 12rpx;
  padding: 20rpx;
  margin: 16rpx 0;
  font-size: 26rpx;
  border: 2rpx solid #ffeaa7;
  box-shadow: 0 4rpx 8rpx rgba(212, 136, 6, 0.1);
}
.popup-content {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  width: 600rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  border: 2rpx solid #e0eaff;
}
.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 18rpx;
  text-align: center;
  position: relative;
}
.popup-title::after {
  content: '';
  position: absolute;
  bottom: -8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  border-radius: 2rpx;
}
.popup-tip {
  font-size: 22rpx;
  color: #ff4d4f;
  margin-bottom: 16rpx;
  padding: 12rpx 16rpx;
  background: linear-gradient(135deg, #fff2f0 0%, #ffe6e6 100%);
  border-radius: 8rpx;
  border-left: 4rpx solid #ff4d4f;
  box-shadow: 0 2rpx 4rpx rgba(255, 77, 79, 0.1);
}
.popup-btns {
  display: flex;
  gap: 24rpx;
  margin-top: 24rpx;
}
.popup-btn {
  flex: 1;
  font-size: 28rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: #f8f9fa;
  color: #2d8cf0;
  border: 2rpx solid #e0eaff;
  font-weight: bold;
  letter-spacing: 2rpx;
  transition: all 0.3s ease;
}
.popup-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}
.popup-btn.primary {
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4rpx 16rpx rgba(45, 140, 240, 0.3);
}
.popup-btn.primary:active {
  box-shadow: 0 2rpx 8rpx rgba(45, 140, 240, 0.3);
  background: linear-gradient(90deg, #1a7be0 0%, #4a9eff 100%);
}
.deceased-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-bottom: 12rpx;
}
.deceased-card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(224, 234, 255, 0.3);
  padding: 20rpx 16rpx 12rpx 16rpx;
  border: 2rpx solid #f0f8ff;
  transition: all 0.3s ease;
}
.deceased-card:hover {
  box-shadow: 0 6rpx 20rpx rgba(224, 234, 255, 0.4);
  transform: translateY(-2rpx);
}
.deceased-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}
.deceased-actions {
  display: flex;
  gap: 12rpx;
}
.deceased-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #ff4d4f;
}
.deceased-info-row {
  display: flex;
  gap: 18rpx;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 2rpx;
  line-height: 1.4;
}
.item-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 8rpx;
  padding: 8rpx 0;
}
.item-input {
  width: 120rpx;
  text-align: center;
}
.picker {
  margin: 6rpx 0;
  padding: 16rpx;
  background: linear-gradient(135deg, #f7f7f7 0%, #f0f8ff 100%);
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2rpx solid #e0eaff;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}
.picker:active {
  background: #e0eaff;
  border-color: #2d8cf0;
  transform: scale(0.98);
  box-shadow: 0 4rpx 8rpx rgba(45, 140, 240, 0.2);
}
.picker-label {
  color: #666;
  font-size: 28rpx;
  flex-shrink: 0;
}
.picker-value {
  color: #333;
  font-size: 28rpx;
  flex: 1;
  text-align: right;
  margin-right: 12rpx;
}
.picker-arrow {
  color: #2d8cf0;
  font-size: 24rpx;
  font-weight: bold;
}
.input {
  display: block;
  width: 100%;
  margin: 10rpx 0;
  padding: 16rpx;
  border: 2rpx solid #e0eaff;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  transition: all 0.3s ease;
  box-sizing: border-box;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}
.input:focus {
  border-color: #2d8cf0;
  box-shadow: 0 0 0 4rpx rgba(45, 140, 240, 0.1);
  transform: translateY(-1rpx);
  background: #fff;
}
.input::placeholder {
  color: #999;
}
.form-btn {
  width: 100%;
  margin: 48rpx 0 0 0;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(90deg, #2d8cf0 0%, #5cadff 100%);
  color: #fff;
  box-shadow: 0 4rpx 16rpx #b3c6e0;
  font-weight: bold;
  letter-spacing: 2rpx;
  display: block;
  transition: all 0.3s ease;
}
.form-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx #b3c6e0;
  background: linear-gradient(90deg, #1a7be0 0%, #4a9eff 100%);
}
.form-btn[disabled] {
  background: #ccc;
  box-shadow: none;
  color: #999;
  transform: none;
}
.error-message {
  background: linear-gradient(135deg, #fff2f0 0%, #ffe6e6 100%);
  border: 2rpx solid #ffccc7;
  border-radius: 12rpx;
  padding: 20rpx;
  margin: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4rpx 8rpx rgba(255, 77, 79, 0.1);
  position: relative;
}
.error-message::before {
  content: '⚠️';
  position: absolute;
  left: 12rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20rpx;
}
.error-message text {
  color: #ff4d4f;
  font-size: 26rpx;
  flex: 1;
  margin-left: 32rpx;
}
.error-btn {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  margin-left: 16rpx;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 4rpx rgba(255, 77, 79, 0.2);
}
.error-btn:active {
  background: linear-gradient(135deg, #d9363e 0%, #ff6b6b 100%);
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(255, 77, 79, 0.3);
}
.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}
.btn-spinner {
  width: 30rpx;
  height: 30rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top: 4rpx solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>