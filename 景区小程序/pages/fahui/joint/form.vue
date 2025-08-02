<template>
  <view class="form-bg">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <view v-else class="form-container">
      <view class="form-title">合坛法会报名</view>
      <view class="form-help">
        <text>📝 请仔细填写所有必填信息，确保信息准确完整</text>
        <text>👥 可添加最多5位报名人，每人信息需完整</text>
        <text>💝 不同法会类型有特殊要求，请按提示填写</text>
        <text>💾 数据会自动保存，可随时返回继续填写</text>
      </view>

      <!-- 报名人信息管理 -->
      <view class="section-title">报名人信息 <text class="section-tip">（最多5人，每人信息需完整）</text></view>
      <view class="section-tip-full">点击"编辑"按钮可修改报名人信息</view>
      
      <!-- 调试信息显示 -->
      <view class="debug-info">
        <text class="debug-text">调试信息：报名人数量 {{ applicants.length }}</text>
        <text class="debug-text">当前项目：{{ currentProject ? currentProject.name : '未选择' }}</text>
      </view>
      <view class="applicant-list">
        <view v-for="(applicant, idx) in applicants" :key="idx" class="applicant-card">
          <view class="applicant-header">
            <text class="applicant-name">{{ applicant.name || '未填写' }}</text>
            <view class="applicant-actions">
              <button class="mini-btn" size="mini" @click="openApplicantDialog(idx)">编辑</button>
              <button v-if="applicants.length > 1" class="mini-btn danger" size="mini" @click="removeApplicant(idx)">删除</button>
            </view>
          </view>
          <!-- 调试信息 -->
          <view class="debug-applicant">
            <text class="debug-applicant-text">调试：姓名="{{ applicant.name }}" 性别="{{ applicant.gender }}" 电话="{{ applicant.phone }}"</text>
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
      
      <!-- 调试按钮 -->
      <button class="debug-btn" @click="debugApplicants" size="mini">调试报名人数据</button>
      <button class="fix-btn" @click="quickFix" size="mini">快速修复数据</button>

      <!-- 报名人弹窗 -->
      <uni-popup ref="popup" type="center">
        <view class="popup-content">
          <view class="popup-title">报名者信息</view>
          <view class="popup-tip">带 * 的字段为必填项</view>
          <input v-model="editApplicant.name" placeholder="* 姓名（必填）" class="input" maxlength="20" @blur="validateName" @input="saveDraft" />
          <picker :range="genderOptions" @change="onGenderChange" :value="genderIndex">
            <view class="picker">
              <text class="picker-label">* 性别：</text>
              <text class="picker-value">{{ editApplicant.gender || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
                      <input v-model="editApplicant.phone" placeholder="* 联系电话（必填）" class="input" type="tel" maxlength="11" @blur="validatePhone" @input="saveDraft" />
          <picker mode="date" @change="onLunarBirthdayChange" :value="editApplicant.lunarBirthday">
            <view class="picker">
              <text class="picker-label">* 农历生日：</text>
              <text class="picker-value">{{ editApplicant.lunarBirthday || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <picker :range="birthTimeOptions" @change="onBirthTimeChange" :value="birthTimeIndex">
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
        <picker :range="projectNames" @change="onProjectChange" :value="jointProjectIdx">
          <view class="picker">
            <text class="picker-label">法会项目：</text>
            <text class="picker-value">{{ currentProject ? currentProject.name : '请选择' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
        <picker v-if="hasProjectDates" :range="currentProject.dates" @change="onDateChange" :value="selectedDateIdx">
          <view class="picker">
            <text class="picker-label">法会日期：</text>
            <text class="picker-value">{{ selectedDate || '请选择' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
        <view v-else class="fahui-tip">法会日期：<text class="info-value">预订成功后道长与您联系确认</text></view>
      </view>
      
      <!-- 配偶信息显示，紧跟法会信息卡片下方 -->
      <view v-if="showSpouseInfo" style="margin-top: 10rpx; margin-bottom: 10rpx;">
        <view class="section-title" style="margin-bottom: 8rpx;">配偶信息</view>
        <view class="card" style="margin-bottom: 0;">
          <view class="spouse-info">
            <view class="info-row">
              <text class="info-label">姓名：</text>
              <text class="info-value">{{ spouse.name }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">性别：</text>
              <text class="info-value">{{ spouse.gender }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">农历生日：</text>
              <text class="info-value">{{ spouse.lunarBirthday || '未填写' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">出生时辰：</text>
              <text class="info-value">{{ spouse.birthTime || '未填写' }}</text>
            </view>
          </view>
          <button class="mini-btn" size="mini" @click="openSpouseDialog">修改配偶信息</button>
        </view>
      </view>
      
      <!-- 超度特殊输入，紧跟配偶信息下方 -->
      <view v-if="isChaoduProject" style="margin-top: 10rpx; margin-bottom: 10rpx;">
        <view class="section-title" style="margin-bottom: 8rpx;">超度类型 <text class="section-tip">（必选）</text></view>
        <view class="card" style="margin-bottom: 0;">
          <picker :range="chaoduTypes" @change="onChaoduTypeChange" :value="chaoduTypeIndex">
            <view class="picker">
              <text class="picker-label">超度类型：</text>
              <text class="picker-value">{{ chaoduType || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="section-title" style="margin-bottom: 8rpx;">已故亲人信息 <text class="section-tip">（至少1人，最多5人）</text></view>
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

      <!-- 配偶信息弹窗 -->
      <uni-popup ref="spousePopup" type="center">
        <view class="popup-content">
          <view class="popup-title">配偶信息</view>
          <view class="popup-tip">以下信息为选填项，可根据需要填写</view>
          <input v-model="editSpouse.name" placeholder="姓名（选填）" class="input" maxlength="20" @input="saveDraft" />
                      <picker :range="genderOptions" @change="onSpouseGenderChange" :value="spouseGenderIndex">
            <view class="picker">
              <text class="picker-label">性别：</text>
              <text class="picker-value">{{ editSpouse.gender || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <picker mode="date" @change="onSpouseLunarBirthdayChange" :value="editSpouse.lunarBirthday">
            <view class="picker">
              <text class="picker-label">农历生日：</text>
              <text class="picker-value">{{ editSpouse.lunarBirthday || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
                      <picker :range="birthTimeOptions" @change="onSpouseBirthTimeChange" :value="spouseBirthTimeIndex">
            <view class="picker">
              <text class="picker-label">出生时辰：</text>
              <text class="picker-value">{{ editSpouse.birthTime || '请选择' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <view class="popup-btns">
            <button class="popup-btn primary" @click="saveSpouse">保存</button>
            <button class="popup-btn" @click="closeSpousePopup">取消</button>
          </view>
        </view>
      </uni-popup>

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
                      <picker :range="deceasedRelationOptions" @change="onDeceasedRelationChange" :value="deceasedRelationIndex">
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

      <!-- 收件信息 -->
      <view class="section-title" v-if="showReceiver">
        收件信息 
        <text class="section-tip" v-if="!receiverConfig || (!receiverConfig.nameRequired && !receiverConfig.phoneRequired && !receiverConfig.addressRequired)">（可选）</text>
        <text class="section-tip" v-else>（必填项已标记*）</text>
      </view>
      <view v-if="showReceiver" class="card">
        <view class="input-group">
          <text class="input-label" v-if="receiverConfig && receiverConfig.nameRequired">收件人姓名 *</text>
          <text class="input-label" v-else>收件人姓名</text>
          <input v-model="receiver.name" placeholder="请输入收件人姓名" class="input" @input="saveDraft" />
        </view>
        <view class="input-group">
          <text class="input-label" v-if="receiverConfig && receiverConfig.phoneRequired">联系电话 *</text>
          <text class="input-label" v-else>联系电话</text>
                      <input v-model="receiver.phone" placeholder="请输入联系电话" class="input" type="tel" maxlength="11" @input="saveDraft" />
        </view>
        <view class="input-group">
          <text class="input-label" v-if="receiverConfig && receiverConfig.addressRequired">收件地址 *</text>
          <text class="input-label" v-else>收件地址</text>
          <textarea v-model="receiver.address" placeholder="请输入详细收件地址" class="textarea" @input="saveDraft" />
        </view>
      </view>

      <button class="form-btn" type="primary" @click="nextStep" :disabled="isSubmitting">
        <view v-if="isSubmitting" class="btn-loading">
          <view class="btn-spinner"></view>
          <text>提交中...</text>
        </view>
        <text v-else>下一步</text>
      </button>
      
      <!-- 调试信息（开发时可显示） -->
      <view v-if="true" class="debug-info">
        <text>报名人数：{{ applicants.length }}</text>
        <text>已故亲人数：{{ deceasedList.length }}</text>
        <text>代办物品数：{{ items.length }}</text>
        <text>收件信息：{{ showReceiver ? '显示' : '隐藏' }}</text>
        <text>代办物品模块：{{ showItems ? '显示' : '隐藏' }}</text>
        <button @click="checkModuleConfig" class="debug-btn">检查代办物品配置</button>
        <button @click="checkReceiverConfig" class="debug-btn">检查收件信息配置</button>
        <button @click="debugData" class="debug-btn" style="background: #ff6b6b; color: white;">生成测试数据</button>
      </view>
    </view>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import jointDataManager from '@/utils/jointDataManager.js'

// 导入云对象
const jointManagement = uniCloud.importObject('joint-management')

export default {
  components: {
    uniPopup
  },
  data() {
    return {
      isLoading: true,
      isSubmitting: false,
      projectId: '',
      
      // 报名人信息
      applicants: [],
      editApplicant: {},
      editIndex: -1,
      
      // 法会项目信息
      jointProjects: [],
      jointProjectIdx: -1,
      currentProject: null,
      selectedDateIdx: -1,
      selectedDate: '',
      
      // 姻缘和合法会特殊信息
      spouse: {
        name: '',
        gender: '',
        lunarBirthday: '',
        birthTime: ''
      },
      editSpouse: {},
      
      // 超度法会特殊信息
      chaoduType: '',
      chaoduTypes: ['超度亡灵', '超度婴灵', '超度冤亲债主', '超度历代宗亲'],
      deceasedList: [],
      editDeceased: {},
      editDeceasedIndex: -1,
      
      // 代办物品
      items: [],
      showItems: false,
      
      // 收件信息
      receiver: {
        name: '',
        phone: '',
        address: ''
      },
      showReceiver: false,
      receiverConfig: null,
      
      // 选项数据
      genderOptions: ['男', '女'],
      birthTimeOptions: ['子时(23:00-01:00)', '丑时(01:00-03:00)', '寅时(03:00-05:00)', '卯时(05:00-07:00)', '辰时(07:00-09:00)', '巳时(09:00-11:00)', '午时(11:00-13:00)', '未时(13:00-15:00)', '申时(15:00-17:00)', '酉时(17:00-19:00)', '戌时(19:00-21:00)', '亥时(21:00-23:00)'],
      deceasedRelationOptions: ['先曾祖父', '先曾祖母', '先祖父', '先祖母', '外祖父', '外祖母', '先父', '先母', '岳父', '岳母', '先夫', '先妻', '故爱子', '故爱女', '好友', '恩师', '其他']
    }
  },
  
  computed: {
    hasSelectedItems() {
      return this.items.some(item => item.count > 0)
    },
    projectNames() {
      return this.jointProjects.map(p => p.name)
    },
    genderIndex() {
      return this.genderOptions.indexOf(this.editApplicant.gender)
    },
    birthTimeIndex() {
      return this.birthTimeOptions.indexOf(this.editApplicant.birthTime)
    },
    chaoduTypeIndex() {
      return this.chaoduTypes.indexOf(this.chaoduType)
    },
    spouseGenderIndex() {
      return this.genderOptions.indexOf(this.editSpouse.gender)
    },
    spouseBirthTimeIndex() {
      return this.birthTimeOptions.indexOf(this.editSpouse.birthTime)
    },
    deceasedRelationIndex() {
      return this.deceasedRelationOptions.indexOf(this.editDeceased.relation)
    },
    hasProjectDates() {
      return this.currentProject && this.currentProject.dates && this.currentProject.dates.length > 0
    },
    showSpouseInfo() {
      return this.currentProject && this.currentProject.category === '姻缘和合' && this.spouse.name
    },
    isYinyuanProject() {
      return this.currentProject && this.currentProject.category === '姻缘和合'
    },
    isChaoduProject() {
      return this.currentProject && this.currentProject.category === '超度法会'
    }
  },
  
  onLoad(options) {
    console.log('🔍 页面加载调试: ========== 页面开始加载 ==========')
    console.log('🔍 页面加载调试: options:', options)
    console.log('🔍 页面加载调试: 初始 showReceiver =', this.showReceiver)
    console.log('🔍 页面加载调试: 初始 applicants =', this.applicants)
    
    if (options.projectId) {
      this.projectId = options.projectId
      console.log('🔍 页面加载调试: 设置 projectId =', this.projectId)
    }
    
    console.log('🔍 页面加载调试: 开始调用 loadData()')
    this.loadData()
    console.log('🔍 页面加载调试: loadData() 调用完成')
  },
  
  onShow() {
    console.log('🔍 页面显示调试: ========== 页面显示 ==========')
    console.log('🔍 页面显示调试: 当前 showReceiver =', this.showReceiver)
    console.log('🔍 页面显示调试: 当前 applicants =', this.applicants)
    
    console.log('🔍 页面显示调试: 开始调用 loadDraft()')
    this.loadDraft()
    console.log('🔍 页面显示调试: loadDraft() 调用完成')
    
    console.log('🔍 页面显示调试: 开始调用 checkAndClearOldData()')
    this.checkAndClearOldData()
    console.log('🔍 页面显示调试: checkAndClearOldData() 调用完成')
    
    console.log('🔍 页面显示调试: 页面显示完成，最终 applicants =', this.applicants)
  },
  
  methods: {
    async loadData() {
      console.log('🔍 loadData调试: ========== 开始加载数据 ==========')
      try {
        this.isLoading = true
        console.log('🔍 loadData调试: 设置 isLoading = true')
        
        // 加载合坛法会项目
        console.log('🔍 loadData调试: 开始加载合坛法会项目')
        await this.loadJointProjects()
        console.log('🔍 loadData调试: 合坛法会项目加载完成，项目数量:', this.jointProjects.length)
        
        // 加载收件信息配置
        console.log('🔍 loadData调试: 开始加载收件信息配置...')
        await this.loadReceiverConfig()
        console.log('🔍 loadData调试: 收件信息配置加载完成，showReceiver =', this.showReceiver)
        
        // 如果有projectId，自动选择对应项目
        if (this.projectId) {
          console.log('🔍 loadData调试: 有projectId，开始自动选择项目:', this.projectId)
          const index = this.jointProjects.findIndex(p => p._id === this.projectId)
          if (index !== -1) {
            this.jointProjectIdx = index
            this.currentProject = this.jointProjects[index]
            console.log('🔍 loadData调试: 自动选择项目成功:', this.currentProject.name, '项目ID:', this.currentProject._id)
            // 加载选中项目的代办物品
            await this.loadItemsConfig(this.currentProject._id)
          } else {
            console.log('🔍 loadData调试: 未找到对应的项目')
          }
        }
        
        // 初始化报名人
        console.log('🔍 loadData调试: 检查报名人初始化，当前applicants长度:', this.applicants.length)
        if (this.applicants.length === 0) {
          console.log('🔍 loadData调试: 没有报名人，添加默认报名人')
          this.addApplicant()
          console.log('🔍 loadData调试: 添加默认报名人完成，当前applicants:', this.applicants)
        } else {
          console.log('🔍 loadData调试: 已有报名人，数量:', this.applicants.length)
          console.log('🔍 loadData调试: 现有报名人详情:', this.applicants)
        }
        
        console.log('🔍 loadData调试: ========== 数据加载完成 ==========')
        console.log('🔍 loadData调试: 当前项目数量:', this.jointProjects.length)
        console.log('🔍 loadData调试: 当前选中项目:', this.currentProject?.name || '无')
        console.log('🔍 loadData调试: 代办物品显示状态:', this.showItems)
        console.log('🔍 loadData调试: 收件信息显示状态:', this.showReceiver)
        console.log('🔍 loadData调试: 收件信息配置对象:', this.receiverConfig)
        console.log('🔍 loadData调试: 收件人信息:', this.receiver)
        console.log('🔍 loadData调试: 最终applicants状态:', this.applicants)
        console.log('🔍 loadData调试: applicants长度:', this.applicants.length)
        
        this.isLoading = false
        console.log('🔍 loadData调试: 设置 isLoading = false')
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载数据失败',
          icon: 'none'
        })
        this.isLoading = false
      }
    },
    
    async loadJointProjects() {
      try {
        const result = await jointManagement.getProjects()
        
        if (result.success && result.data && result.data.length > 0) {
          this.jointProjects = result.data
        } else {
          // 使用默认数据
          this.jointProjects = [
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
        throw error
      }
    },
    
    async loadItemsConfig(projectId) {
      if (!projectId) {
        console.log('🔍 代办物品调试: 项目ID为空，禁用代办物品模块')
        this.showItems = false
        this.items = []
        return
      }
      
      try {
        console.log('🔍 代办物品调试: 开始检查模块启用状态，项目ID:', projectId)
        
        // 首先检查模块是否启用
        const moduleResult = await jointManagement.getGoodsConfig()
        
        console.log('🔍 代办物品调试: 模块配置云函数返回结果:', moduleResult)
        
        let moduleEnabled = false
        if (moduleResult.success && moduleResult.data) {
          moduleEnabled = moduleResult.data.enabled || false
          console.log('🔍 代办物品调试: 从数据库获取的启用状态:', moduleEnabled)
        } else {
          console.log('🔍 代办物品调试: 数据库中没有配置数据，默认禁用')
        }
        
        // 如果模块未启用，直接返回
        if (!moduleEnabled) {
          console.log('🔍 代办物品调试: 模块已禁用，隐藏代办物品区域')
          this.showItems = false
          this.items = []
          return
        }
        
        console.log('🔍 代办物品调试: 模块已启用，开始加载项目物品')
        
        // 模块启用后，检查项目是否有物品
        const result = await jointManagement.getGoods({ projectId: projectId })
        
        console.log('🔍 代办物品调试: 项目物品云函数返回结果:', result)
        
        if (result.data && result.data.length > 0) {
          console.log('🔍 代办物品调试: 项目有物品，显示代办物品区域，物品数量:', result.data.length)
          this.showItems = true
          this.items = result.data.map(item => ({
            ...item,
            count: 0
          }))
        } else {
          console.log('🔍 代办物品调试: 项目没有物品，隐藏代办物品区域')
          this.showItems = false
          this.items = []
        }
      } catch (error) {
        console.error('🔍 代办物品调试: 加载代办物品配置失败:', error)
        this.showItems = false
        this.items = []
      }
    },
    
    async loadReceiverConfig() {
      try {
        console.log('🔍 收件信息调试: 开始加载收件信息配置...')
        console.log('🔍 收件信息调试: 调用前 showReceiver =', this.showReceiver)
        
        const result = await jointManagement.getReceiverConfig()
        
        console.log('🔍 收件信息调试: 云函数返回结果:', result)
        console.log('🔍 收件信息调试: result.data =', result.data)
        
        if (result.success && result.data) {
          this.receiverConfig = result.data
          const oldShowReceiver = this.showReceiver
          this.showReceiver = result.data.enabled || false
          console.log('🔍 收件信息调试: 配置加载成功')
          console.log('🔍 收件信息调试: enabled =', result.data.enabled)
          console.log('🔍 收件信息调试: showReceiver 从', oldShowReceiver, '变为', this.showReceiver)
          console.log('🔍 收件信息调试: 完整配置对象:', this.receiverConfig)
        } else {
          const oldShowReceiver = this.showReceiver
          this.receiverConfig = null
          this.showReceiver = false
          console.log('🔍 收件信息调试: 配置为空或无效')
          console.log('🔍 收件信息调试: showReceiver 从', oldShowReceiver, '变为', this.showReceiver)
          console.log('🔍 收件信息调试: receiverConfig 设置为 null')
        }
        
        console.log('🔍 收件信息调试: 方法执行完成，最终 showReceiver =', this.showReceiver)
      } catch (error) {
        console.error('🔍 收件信息调试: 加载收件信息配置失败:', error)
        console.error('🔍 收件信息调试: 错误详情:', error.message || error)
        const oldShowReceiver = this.showReceiver
        this.receiverConfig = null
        this.showReceiver = false
        console.log('🔍 收件信息调试: 异常处理，showReceiver 从', oldShowReceiver, '变为', this.showReceiver)
      }
    },
    
    async getReceiverConfig() {
      try {
        console.log('🔍 收件信息调试: getReceiverConfig 被调用')
        const result = await jointManagement.getReceiverConfig()
        
        console.log('🔍 收件信息调试: getReceiverConfig 云函数返回:', result)
        
        if (result.success && result.data) {
          console.log('🔍 收件信息调试: getReceiverConfig 返回配置:', result.data)
          return result.data
        }
        console.log('🔍 收件信息调试: getReceiverConfig 返回 null')
        return null
      } catch (error) {
        console.error('🔍 收件信息调试: getReceiverConfig 调用失败:', error)
        return null
      }
    },
    
    async checkModuleConfig() {
      try {
        console.log('=== 检查代办物品模块配置 ===')
        
        // 检查模块配置
        const moduleResult = await jointManagement.getGoodsConfig()
        console.log('模块配置结果:', moduleResult)
        
        // 检查数据库配置
        const checkResult = await jointManagement.getGoodsConfig()
        console.log('数据库检查结果:', checkResult)
        
        // 检查当前项目信息
        let projectInfo = '无'
        if (this.currentProject) {
          projectInfo = `${this.currentProject.name} (${this.currentProject._id})`
        }
        
        // 检查项目物品
        let projectItems = '无'
        if (this.currentProject && this.currentProject._id) {
          try {
            const itemsResult = await jointManagement.getGoods({ projectId: this.currentProject._id })
            if (itemsResult.success && itemsResult.data) {
              projectItems = `${itemsResult.data.length}个物品`
            }
          } catch (error) {
            projectItems = '查询失败'
          }
        }
        
        // 显示结果
        let message = '代办物品模块配置检查结果：\n\n'
        message += `当前项目: ${projectInfo}\n`
        message += `项目分类: ${this.currentProject?.category || '无'}\n`
        message += `模块启用状态: ${moduleResult.data?.[0]?.enabled ? '启用' : '禁用'}\n`
        message += `数据库配置存在: ${checkResult.total > 0 ? '是' : '否'}\n`
        message += `项目物品数量: ${projectItems}\n`
        message += `当前显示状态: ${this.showItems ? '显示' : '隐藏'}\n`
        message += `物品列表长度: ${this.items.length}`
        
        uni.showModal({
          title: '代办物品模块配置检查',
          content: message,
          showCancel: false
        })
        
      } catch (error) {
        console.error('检查模块配置失败:', error)
                uni.showToast({
          title: '检查失败',
          icon: 'none'
        })
      }
    },
    
    async checkReceiverConfig() {
      try {
        console.log('=== 检查收件信息模块配置 ===')
        
        // 检查收件信息配置
        const receiverResult = await jointManagement.getReceiverConfig()
        console.log('收件信息配置结果:', receiverResult)
        
        // 检查数据库配置
        const checkResult = await jointManagement.getReceiverConfig()
        console.log('数据库检查结果:', checkResult)
        
        // 检查当前状态
        let message = '收件信息模块配置检查结果：\n\n'
        message += `配置启用状态: ${receiverResult.data?.[0]?.enabled ? '启用' : '禁用'}\n`
        message += `姓名必填: ${receiverResult.data?.[0]?.nameRequired ? '是' : '否'}\n`
        message += `电话必填: ${receiverResult.data?.[0]?.phoneRequired ? '是' : '否'}\n`
        message += `地址必填: ${receiverResult.data?.[0]?.addressRequired ? '是' : '否'}\n`
        message += `数据库配置存在: ${checkResult.total > 0 ? '是' : '否'}\n`
        message += `配置记录数量: ${checkResult.total || 0}\n`
        message += `收件信息数量: 0\n`
        message += `当前显示状态: ${this.showReceiver ? '显示' : '隐藏'}\n`
        message += `配置对象: ${this.receiverConfig ? '存在' : 'null'}\n`
        message += `收件人姓名: ${this.receiver.name || '未填写'}\n`
        message += `联系电话: ${this.receiver.phone || '未填写'}\n`
        message += `收件地址: ${this.receiver.address || '未填写'}`
        
        uni.showModal({
          title: '收件信息模块配置检查',
          content: message,
          showCancel: false
        })
        
      } catch (error) {
        console.error('检查收件信息配置失败:', error)
        uni.showToast({
          title: '检查失败',
          icon: 'none'
        })
      }
    },
    
    // 报名人管理
    addApplicant() {
      console.log('🔍 addApplicant调试: ========== 添加报名人 ==========')
      console.log('🔍 addApplicant调试: 当前applicants长度:', this.applicants.length)
      
      if (this.applicants.length >= 5) {
        console.log('🔍 addApplicant调试: 已达到最大数量限制')
        uni.showToast({
          title: '最多只能添加5位报名人',
          icon: 'none'
        })
        return
      }
      
      const newApplicant = {
        name: '',
        gender: '',
        phone: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      }
      
      console.log('🔍 addApplicant调试: 准备添加新报名人:', newApplicant)
      this.applicants.push(newApplicant)
      console.log('🔍 addApplicant调试: 添加完成，当前applicants:', this.applicants)
      
      this.saveDraft()
      console.log('🔍 addApplicant调试: 保存草稿完成')
    },
    
    removeApplicant(index) {
      this.applicants.splice(index, 1)
      this.saveDraft()
    },
    
    openApplicantDialog(index) {
      console.log('🔍 打开报名人弹窗调试: index =', index)
      console.log('🔍 打开报名人弹窗调试: applicants[', index, '] =', this.applicants[index])
      
      this.editIndex = index
      this.editApplicant = { ...this.applicants[index] }
      
      console.log('🔍 打开报名人弹窗调试: editIndex =', this.editIndex)
      console.log('🔍 打开报名人弹窗调试: editApplicant =', this.editApplicant)
      
      this.$refs.popup.open()
    },
    
    saveApplicant() {
      console.log('🔍 保存报名人调试: 开始保存报名人信息')
      console.log('🔍 保存报名人调试: editIndex =', this.editIndex)
      console.log('🔍 保存报名人调试: editApplicant =', this.editApplicant)
      
      if (!this.editApplicant.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return
      }
      
      if (!this.editApplicant.gender) {
        uni.showToast({
          title: '请选择性别',
          icon: 'none'
        })
        return
      }
      
      if (!this.editApplicant.phone) {
        uni.showToast({
          title: '请输入联系电话',
          icon: 'none'
        })
        return
      }
      
      if (!this.editApplicant.lunarBirthday) {
        uni.showToast({
          title: '请选择农历生日',
          icon: 'none'
        })
        return
      }
      
      if (!this.editApplicant.birthTime) {
        uni.showToast({
          title: '请选择出生时辰',
          icon: 'none'
        })
        return
      }
      
      if (!this.editApplicant.address) {
        uni.showToast({
          title: '请输入常住地址',
          icon: 'none'
        })
        return
      }
      
      // 保存前检查
      console.log('🔍 保存报名人调试: 保存前的applicants =', this.applicants)
      
      // 确保数据正确保存 - 使用Vue.set确保响应式更新
      const savedApplicant = { ...this.editApplicant }
      
      // 使用Vue.set确保响应式更新
      if (this.$set) {
        this.$set(this.applicants, this.editIndex, savedApplicant)
      } else {
        // 如果$set不可用，使用数组方法
        this.applicants.splice(this.editIndex, 1, savedApplicant)
      }
      
      // 保存后检查
      console.log('🔍 保存报名人调试: 保存后的applicants =', this.applicants)
      console.log('🔍 保存报名人调试: 保存后的applicants[', this.editIndex, '] =', this.applicants[this.editIndex])
      console.log('🔍 保存报名人调试: 保存的数据 =', savedApplicant)
      
      // 强制触发响应式更新
      this.$forceUpdate()
      
      this.closePopup()
      this.saveDraft()
      
      // 再次验证保存结果
      setTimeout(() => {
        console.log('🔍 保存报名人调试: 延迟验证 - applicants =', this.applicants)
        console.log('🔍 保存报名人调试: 延迟验证 - applicants[', this.editIndex, '] =', this.applicants[this.editIndex])
        
        // 显示成功提示
        uni.showToast({
          title: '报名人信息保存成功',
          icon: 'success',
          duration: 2000
        })
      }, 100)
      
      console.log('🔍 保存报名人调试: 保存完成，当前applicants =', this.applicants)
    },
    
    closePopup() {
      this.$refs.popup.close()
      this.editIndex = -1
      this.editApplicant = {}
    },
    
    // 选择器事件
    onGenderChange(e) {
      this.editApplicant.gender = this.genderOptions[e.detail.value]
    },
    
    onLunarBirthdayChange(e) {
      this.editApplicant.lunarBirthday = e.detail.value
    },
    
    onBirthTimeChange(e) {
      this.editApplicant.birthTime = this.birthTimeOptions[e.detail.value]
    },
    
    async onProjectChange(e) {
      this.jointProjectIdx = e.detail.value
      this.currentProject = this.jointProjects[e.detail.value]
      console.log('🔍 代办物品调试: 用户选择项目:', this.currentProject.name, '项目ID:', this.currentProject._id, '项目分类:', this.currentProject.category)
      console.log('🔍 姻缘和合法会调试: 选择项目后，currentProject:', this.currentProject)
      console.log('🔍 姻缘和合法会调试: 项目分类检查:', this.currentProject.category === '姻缘和合')
      
      this.selectedDateIdx = -1
      this.selectedDate = ''
      this.chaoduType = ''
      this.deceasedList = []
      
      // 加载选中项目的代办物品
      if (this.currentProject && this.currentProject._id) {
        console.log('🔍 代办物品调试: 开始加载新项目的代办物品配置')
        await this.loadItemsConfig(this.currentProject._id)
      } else {
        console.log('🔍 代办物品调试: 项目ID无效，禁用代办物品模块')
        this.showItems = false
        this.items = []
      }
      
      this.saveDraft()
    },
    
    onDateChange(e) {
      this.selectedDateIdx = e.detail.value
      this.selectedDate = this.currentProject.dates[e.detail.value]
      this.saveDraft()
    },
    
    onChaoduTypeChange(e) {
      this.chaoduType = this.chaoduTypes[e.detail.value]
      this.saveDraft()
    },
    
    // 超度法会特殊功能
    addDeceased() {
      if (this.deceasedList.length >= 5) {
        uni.showToast({
          title: '最多只能添加5位已故亲人',
          icon: 'none'
        })
        return
      }
      
      this.deceasedList.push({
        name: '',
        lunarBirthday: '',
        deathDate: '',
        relation: ''
      })
      this.saveDraft()
    },
    
    removeDeceased(index) {
      this.deceasedList.splice(index, 1)
      this.saveDraft()
    },
    
    openDeceasedDialog(index) {
      this.editDeceasedIndex = index
      this.editDeceased = { ...this.deceasedList[index] }
      this.$refs.deceasedPopup.open()
    },
    
    saveDeceased() {
      if (!this.editDeceased.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return
      }
      
      if (!this.editDeceased.relation) {
        uni.showToast({
          title: '请选择关系',
          icon: 'none'
        })
        return
      }
      
      this.deceasedList[this.editDeceasedIndex] = { ...this.editDeceased }
      this.closeDeceasedPopup()
      this.saveDraft()
    },
    
    closeDeceasedPopup() {
      this.$refs.deceasedPopup.close()
      this.editDeceasedIndex = -1
      this.editDeceased = {}
    },
    
    onDeceasedLunarBirthdayChange(e) {
      this.editDeceased.lunarBirthday = e.detail.value
    },
    
    onDeceasedDeathDateChange(e) {
      this.editDeceased.deathDate = e.detail.value
    },
    
    onDeceasedRelationChange(e) {
      this.editDeceased.relation = this.deceasedRelationOptions[e.detail.value]
    },
    
    // 配偶信息相关方法
    openSpouseDialog() {
      this.editSpouse = { ...this.spouse }
      this.$refs.spousePopup.open()
    },
    
    saveSpouse() {
      this.spouse = { ...this.editSpouse }
      this.closeSpousePopup()
      this.saveDraft()
    },
    
    closeSpousePopup() {
      this.$refs.spousePopup.close()
      this.editSpouse = {}
    },
    
    onSpouseGenderChange(e) {
      this.editSpouse.gender = this.genderOptions[e.detail.value]
    },
    
    onSpouseLunarBirthdayChange(e) {
      this.editSpouse.lunarBirthday = e.detail.value
    },
    
    onSpouseBirthTimeChange(e) {
      this.editSpouse.birthTime = this.birthTimeOptions[e.detail.value]
    },
    
    // 验证方法
    validateName() {
      if (this.editApplicant.name && this.editApplicant.name.length < 2) {
        uni.showToast({
          title: '姓名至少2个字符',
          icon: 'none'
        })
      }
    },
    
    validatePhone() {
      if (this.editApplicant.phone && !/^1[3-9]\d{9}$/.test(this.editApplicant.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
      }
    },
    
    // 检查并清除旧数据
    checkAndClearOldData() {
      try {
        // 检查是否有旧的订单数据
        const oldOrderData = uni.getStorageSync('joint_fahui_order')
        if (oldOrderData) {
          // 检查数据是否来自当前会话（避免清除刚填写的数据）
          const currentTime = new Date().getTime()
          const dataTime = oldOrderData.createTime || 0
          
          // 如果数据是5分钟内的，不提示清除
          if (currentTime - dataTime < 5 * 60 * 1000) {
            console.log('🔍 检测到最近的订单数据，不提示清除')
            return
          }
          
          console.log('🔍 发现旧的订单数据，询问是否清除')
          uni.showModal({
            title: '提示',
            content: '检测到之前的报名数据，是否清除重新填写？',
            success: (res) => {
              if (res.confirm) {
                // 清除旧数据
                uni.removeStorageSync('joint_fahui_order')
                uni.removeStorageSync('joint_fahui_confirm')
                uni.removeStorageSync('joint_fahui_order_id')
                console.log('✅ 旧数据已清除')
                uni.showToast({
                  title: '数据已清除，请重新填写',
                  icon: 'success'
                })
              }
            }
          })
        }
      } catch (error) {
        console.error('检查旧数据失败:', error)
      }
    },
    
    // 数据持久化
    saveDraft() {
      console.log('🔍 保存草稿调试: 开始保存草稿')
      console.log('🔍 保存草稿调试: applicants =', this.applicants)
      
      const draft = {
        applicants: this.applicants,
        jointProjectIdx: this.jointProjectIdx,
        selectedDateIdx: this.selectedDateIdx,
        selectedDate: this.selectedDate,
        spouse: this.spouse,
        chaoduType: this.chaoduType,
        deceasedList: this.deceasedList,
        items: this.items,
        receiver: this.receiver
      }
      
      console.log('🔍 保存草稿调试: 准备保存的草稿数据 =', draft)
      
      try {
        uni.setStorageSync('joint_fahui_draft', draft)
        console.log('🔍 保存草稿调试: 草稿保存成功')
        
        // 验证保存结果
        const savedDraft = uni.getStorageSync('joint_fahui_draft')
        console.log('🔍 保存草稿调试: 验证保存结果 =', savedDraft)
        console.log('🔍 保存草稿调试: 验证保存的applicants =', savedDraft?.applicants)
      } catch (error) {
        console.error('🔍 保存草稿调试: 保存草稿失败:', error)
      }
    },
    
    loadDraft() {
      try {
        console.log('🔍 加载草稿调试: 开始加载草稿...')
        const oldShowReceiver = this.showReceiver
        
        const draft = uni.getStorageSync('joint_fahui_draft')
        console.log('🔍 加载草稿调试: 从存储中获取的草稿数据 =', draft)
        
        if (draft) {
          console.log('🔍 加载草稿调试: 草稿中的applicants =', draft.applicants)
          
          this.applicants = draft.applicants || []
          this.jointProjectIdx = draft.jointProjectIdx || -1
          this.selectedDateIdx = draft.selectedDateIdx || -1
          this.selectedDate = draft.selectedDate || ''
          this.spouse = draft.spouse || { name: '', gender: '', lunarBirthday: '', birthTime: '' }
          this.chaoduType = draft.chaoduType || ''
          this.deceasedList = draft.deceasedList || []
          this.items = draft.items || []
          this.receiver = draft.receiver || { name: '', phone: '', address: '' }
          
          if (this.jointProjectIdx !== -1 && this.jointProjects.length > 0) {
            this.currentProject = this.jointProjects[this.jointProjectIdx]
          }
          
          console.log('🔍 加载草稿调试: 草稿加载完成')
          console.log('🔍 加载草稿调试: 加载后的applicants =', this.applicants)
          console.log('🔍 加载草稿调试: 草稿中的收件人信息:', this.receiver)
          console.log('🔍 加载草稿调试: showReceiver 在草稿加载前后:', oldShowReceiver, '->', this.showReceiver)
        } else {
          console.log('🔍 加载草稿调试: 没有找到草稿数据')
        }
      } catch (error) {
        console.error('🔍 加载草稿调试: 加载草稿失败:', error)
      }
    },
    
    // 表单验证
    async validateForm() {
      console.log('🔍 表单验证调试: 开始验证表单')
      console.log('🔍 表单验证调试: applicants =', this.applicants)
      console.log('🔍 表单验证调试: applicants.length =', this.applicants.length)
      
      if (this.applicants.length === 0) {
        console.log('🔍 表单验证调试: 没有报名人')
        uni.showToast({
          title: '请至少添加一位报名人',
          icon: 'none'
        })
        return false
      }
      
      for (let i = 0; i < this.applicants.length; i++) {
        const applicant = this.applicants[i]
        console.log(`🔍 表单验证调试: 验证第${i + 1}位报名人:`, applicant)
        console.log(`🔍 表单验证调试: 第${i + 1}位报名人字段检查:`)
        console.log(`  - name: "${applicant.name}" (${!!applicant.name})`)
        console.log(`  - gender: "${applicant.gender}" (${!!applicant.gender})`)
        console.log(`  - phone: "${applicant.phone}" (${!!applicant.phone})`)
        console.log(`  - lunarBirthday: "${applicant.lunarBirthday}" (${!!applicant.lunarBirthday})`)
        console.log(`  - birthTime: "${applicant.birthTime}" (${!!applicant.birthTime})`)
        console.log(`  - address: "${applicant.address}" (${!!applicant.address})`)
        
        if (!applicant.name || !applicant.gender || !applicant.phone || 
            !applicant.lunarBirthday || !applicant.birthTime || !applicant.address) {
          console.log(`🔍 表单验证调试: 第${i + 1}位报名人信息不完整`)
          
          // 提供更详细的错误信息
          let missingFields = []
          if (!applicant.name) missingFields.push('姓名')
          if (!applicant.gender) missingFields.push('性别')
          if (!applicant.phone) missingFields.push('电话')
          if (!applicant.lunarBirthday) missingFields.push('农历生日')
          if (!applicant.birthTime) missingFields.push('出生时辰')
          if (!applicant.address) missingFields.push('地址')
          
          uni.showModal({
            title: '信息不完整',
            content: `第${i + 1}位报名人缺少以下信息：\n${missingFields.join('、')}`,
            showCancel: false,
            confirmText: '知道了'
          })
          return false
        }
      }
      
      if (!this.currentProject) {
        uni.showToast({
          title: '请选择法会项目',
          icon: 'none'
        })
        return false
      }
      
      if (this.currentProject.category === '超度法会') {
        if (!this.chaoduType) {
          uni.showToast({
            title: '请选择超度类型',
            icon: 'none'
          })
          return false
        }
        
        if (this.deceasedList.length === 0) {
          uni.showToast({
            title: '请至少添加一位已故亲人',
            icon: 'none'
          })
          return false
        }
        
        for (let i = 0; i < this.deceasedList.length; i++) {
          const deceased = this.deceasedList[i]
          if (!deceased.name || !deceased.relation) {
            uni.showToast({
              title: `第${i + 1}位已故亲人信息不完整`,
              icon: 'none'
            })
            return false
          }
        }
      }
      
      // 收件信息验证
      console.log('🔍 收件信息调试: 开始验证收件信息，showReceiver =', this.showReceiver)
      if (this.showReceiver) {
        console.log('🔍 收件信息调试: 收件信息模块已启用，开始验证')
        const receiverConfig = await this.getReceiverConfig()
        console.log('🔍 收件信息调试: 获取到的配置:', receiverConfig)
        
        if (receiverConfig) {
          console.log('🔍 收件信息调试: 验证收件人姓名，必填:', receiverConfig.nameRequired, '值:', this.receiver.name)
          if (receiverConfig.nameRequired && !this.receiver.name.trim()) {
            console.log('🔍 收件信息调试: 收件人姓名为空，验证失败')
            uni.showToast({
              title: '请填写收件人姓名',
              icon: 'none'
            })
            return false
          }
          
          console.log('🔍 收件信息调试: 验证收件人电话，必填:', receiverConfig.phoneRequired, '值:', this.receiver.phone)
          if (receiverConfig.phoneRequired && !this.receiver.phone.trim()) {
            console.log('🔍 收件信息调试: 收件人电话为空，验证失败')
            uni.showToast({
              title: '请填写收件人电话',
              icon: 'none'
            })
            return false
          }
          
          console.log('🔍 收件信息调试: 验证收件地址，必填:', receiverConfig.addressRequired, '值:', this.receiver.address)
          if (receiverConfig.addressRequired && !this.receiver.address.trim()) {
            console.log('🔍 收件信息调试: 收件地址为空，验证失败')
            uni.showToast({
              title: '请填写收件地址',
              icon: 'none'
            })
            return false
          }
          
          console.log('🔍 收件信息调试: 收件信息验证通过')
        } else {
          console.log('🔍 收件信息调试: 未获取到收件信息配置，跳过验证')
        }
      } else {
        console.log('🔍 收件信息调试: 收件信息模块未启用，跳过验证')
      }
      
      return true
    },
    
    // 下一步
    async nextStep() {
      console.log('🔍 nextStep调试: ========== 开始提交表单 ==========')
      console.log('🔍 nextStep调试: 当前项目:', this.currentProject)
      console.log('🔍 nextStep调试: 报名人信息:', this.applicants)
      console.log('🔍 nextStep调试: 报名人数量:', this.applicants.length)
      console.log('🔍 nextStep调试: 页面路径:', '/pages/fahui/joint/form')
      
      if (!(await this.validateForm())) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 计算费用
        let activityFee = 0
        let goodsFee = 0
        const selectedItems = []
        
        // 根据项目分类计算费用
        if (this.currentProject.category === '超度法会') {
          // 超度法会按已故亲人人数收费
          activityFee = this.currentProject.price * this.deceasedList.length
        } else {
          // 其他法会按报名人人数收费
          activityFee = this.currentProject.price * this.applicants.length
        }
        
        if (this.showItems) {
          this.items.forEach(item => {
            if (item.count > 0) {
              goodsFee += item.price * item.count
              selectedItems.push({
                name: item.name,
                price: item.price,
                count: item.count
              })
            }
          })
        }
        
        // 准备订单数据
        const orderData = {
          type: 'joint_fahui',
          projectId: this.currentProject._id,
          projectName: this.currentProject.name,
          projectPrice: this.currentProject.price,
          selectedDate: this.selectedDate,
          chaoduType: this.chaoduType,
          applicants: this.applicants,
          spouse: this.currentProject.category === '姻缘和合' ? this.spouse : null,
          deceasedList: this.deceasedList,
          selectedItems: selectedItems,
          receiver: this.showReceiver ? this.receiver : null,
          activityFee: activityFee,
          goodsFee: goodsFee,
          totalFee: activityFee + goodsFee,
          applicantCount: this.currentProject.category === '超度法会' ? this.deceasedList.length : this.applicants.length,
          createTime: new Date().getTime() // 添加创建时间戳
        }
        
        console.log('🔍 调试信息 - 表单页面构建的订单数据:', orderData)
        
        // 跳转到确认页面，并传递数据
        console.log('📋 准备传递的订单数据:', orderData)
        
        // 保存订单数据到本地存储
        jointDataManager.saveOrderData(orderData)
        
        // 清除草稿
        jointDataManager.clearDraftData()
        
        // 跳转到确认页面
        uni.navigateTo({
          url: '/pages/fahui/joint/confirm',
          success: () => {
            console.log('✅ 跳转到确认页面成功，数据已保存到本地存储')
          },
          fail: (err) => {
            console.error('❌ 跳转到确认页面失败:', err)
            uni.showToast({
              title: '页面跳转失败',
              icon: 'none'
            })
          }
        })
        
      } catch (error) {
        console.error('提交失败:', error)
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
      }
    },
    
    // 调试数据方法
    debugData() {
      console.log('🔍 调试 - 当前表单数据:')
      console.log('  - 报名人:', this.applicants)
      console.log('  - 当前项目:', this.currentProject)
      console.log('  - 代办物品:', this.items)
      console.log('  - 收件信息:', this.receiver)
      
      const debugInfo = jointDataManager.getDebugInfo()
      console.log('  - 数据管理器调试信息:', debugInfo)
      
      // 生成测试数据并保存
      const testData = jointDataManager.generateTestData()
      console.log('✅ 测试数据已生成:', testData)
    },
    
    // 调试报名人数据
    debugApplicants() {
      console.log('🔍 调试报名人数据:')
      console.log('  - applicants数组:', this.applicants)
      console.log('  - applicants长度:', this.applicants.length)
      
      this.applicants.forEach((applicant, index) => {
        console.log(`  - 报名人${index + 1}:`, applicant)
        console.log(`    - name: "${applicant.name}" (${!!applicant.name})`)
        console.log(`    - gender: "${applicant.gender}" (${!!applicant.gender})`)
        console.log(`    - phone: "${applicant.phone}" (${!!applicant.phone})`)
        console.log(`    - lunarBirthday: "${applicant.lunarBirthday}" (${!!applicant.lunarBirthday})`)
        console.log(`    - birthTime: "${applicant.birthTime}" (${!!applicant.birthTime})`)
        console.log(`    - address: "${applicant.address}" (${!!applicant.address})`)
      })
      
      // 检查本地存储
      try {
        const draft = uni.getStorageSync('joint_fahui_draft')
        console.log('  - 本地存储的草稿数据:', draft)
        console.log('  - 本地存储的applicants:', draft?.applicants)
      } catch (error) {
        console.error('  - 读取本地存储失败:', error)
      }
      
      // 显示调试信息给用户
      let message = `报名人数据调试信息：\n\n`
      message += `当前报名人数量: ${this.applicants.length}\n\n`
      
      this.applicants.forEach((applicant, index) => {
        message += `报名人${index + 1}:\n`
        message += `  姓名: ${applicant.name || '未填写'}\n`
        message += `  性别: ${applicant.gender || '未选择'}\n`
        message += `  电话: ${applicant.phone || '未填写'}\n`
        message += `  农历生日: ${applicant.lunarBirthday || '未选择'}\n`
        message += `  出生时辰: ${applicant.birthTime || '未选择'}\n`
        message += `  地址: ${applicant.address || '未填写'}\n\n`
      })
      
      uni.showModal({
        title: '报名人数据调试',
        content: message,
        showCancel: true,
        cancelText: '知道了',
        confirmText: '强制刷新数据',
        success: (res) => {
          if (res.confirm) {
            this.forceRefreshData()
          }
        }
      })
    },
    
    // 强制刷新数据
    forceRefreshData() {
      console.log('🔍 强制刷新数据: 开始刷新')
      
      // 重新加载草稿数据
      this.loadDraft()
      
      // 强制更新视图
      this.$forceUpdate()
      
      // 显示刷新结果
      setTimeout(() => {
        console.log('🔍 强制刷新数据: 刷新后的applicants =', this.applicants)
        
        uni.showToast({
          title: '数据已刷新',
          icon: 'success',
          duration: 2000
        })
      }, 500)
    },
    
    // 快速修复数据
    quickFix() {
      console.log('🔍 快速修复: 开始修复数据')
      
      // 检查并修复applicants数组
      if (!this.applicants || this.applicants.length === 0) {
        console.log('🔍 快速修复: applicants为空，重新初始化')
        this.applicants = [{
          name: '',
          gender: '',
          phone: '',
          lunarBirthday: '',
          birthTime: '',
          address: ''
        }]
      } else {
        console.log('🔍 快速修复: 检查现有报名人数据')
        // 确保每个报名人都有完整的字段
        this.applicants = this.applicants.map(applicant => ({
          name: applicant.name || '',
          gender: applicant.gender || '',
          phone: applicant.phone || '',
          lunarBirthday: applicant.lunarBirthday || '',
          birthTime: applicant.birthTime || '',
          address: applicant.address || ''
        }))
      }
      
      // 强制更新
      this.$forceUpdate()
      
      // 保存到本地存储
      this.saveDraft()
      
      console.log('🔍 快速修复: 修复完成，当前applicants =', this.applicants)
      
      uni.showModal({
        title: '快速修复完成',
        content: '数据已修复，请重新填写报名人信息并保存。',
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }
}
</script>

<style scoped>
.form-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 120rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.form-container {
  padding: 24rpx;
}

.form-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 24rpx;
}

.form-help {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.form-help text {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin: 32rpx 0 16rpx 0;
}

.section-tip {
  font-size: 24rpx;
  color: #999;
  font-weight: normal;
}

.section-tip-full {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.debug-info {
  background: #fff3cd;
  border: 1rpx solid #ffeaa7;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
}

.debug-text {
  display: block;
  font-size: 24rpx;
  color: #856404;
  margin-bottom: 8rpx;
}

.applicant-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.applicant-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.debug-applicant {
  background: #e3f2fd;
  border: 1rpx solid #bbdefb;
  border-radius: 4rpx;
  padding: 8rpx;
  margin-bottom: 12rpx;
}

.debug-applicant-text {
  font-size: 20rpx;
  color: #1976d2;
  word-break: break-all;
}

.applicant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.applicant-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.applicant-actions {
  display: flex;
  gap: 12rpx;
}

.mini-btn {
  font-size: 20rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  background: #667eea;
  color: #fff;
  border: none;
}

.mini-btn.danger {
  background: #ff6b35;
}

.applicant-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.info-value {
  color: #333;
  font-weight: bold;
}

.add-btn {
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 16rpx 32rpx;
  font-size: 24rpx;
  margin: 0 auto;
  display: block;
}

.debug-btn {
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 16rpx 32rpx;
  font-size: 24rpx;
  margin: 10rpx auto 0;
  display: block;
}

.fix-btn {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 16rpx 32rpx;
  font-size: 24rpx;
  margin: 10rpx auto 0;
  display: block;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  margin-bottom: 16rpx;
}

.picker {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.picker-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 16rpx;
  min-width: 160rpx;
}

.picker-value {
  flex: 1;
  font-size: 28rpx;
  color: #666;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
  margin-left: 16rpx;
}

.fahui-tip {
  font-size: 26rpx;
  color: #666;
  margin-top: 16rpx;
}

.special-tip {
  background: #fff3cd;
  border: 1rpx solid #ffeaa7;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
  text-align: center;
}

.special-tip text {
  font-size: 24rpx;
  color: #856404;
  margin-right: 16rpx;
}

.deceased-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.deceased-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.deceased-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.deceased-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.deceased-actions {
  display: flex;
  gap: 12rpx;
}

.deceased-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.add-icon {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.add-text {
  font-size: 24rpx;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.item-row:last-child {
  border-bottom: none;
}

.item-row text {
  font-size: 26rpx;
  color: #333;
}

.item-input {
  width: 120rpx;
  text-align: center;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 8rpx;
}

.input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}

.form-btn {
  position: fixed;
  bottom: 40rpx;
  left: 24rpx;
  right: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid rgba(255,255,255,0.3);
  border-top: 4rpx solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12rpx;
}

.popup-content {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 16rpx;
}

.popup-tip {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-bottom: 24rpx;
}

.popup-btns {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.popup-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: 1rpx solid #ddd;
  background: #fff;
  color: #666;
}

.popup-btn.primary {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}

.debug-info {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-top: 24rpx;
}

.debug-info text {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.debug-btn {
  margin-top: 10rpx;
  background: #667eea;
  color: #fff;
  border: none;
  padding: 10rpx 20rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.spouse-info {
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  width: 160rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.input-group {
  margin-bottom: 20rpx;
}

.input-label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}

.textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #fff;
  box-sizing: border-box;
  resize: none;
}
</style> 