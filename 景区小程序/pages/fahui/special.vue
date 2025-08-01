<template>
  <view class="fahui-page">
    <!-- 下拉刷新容器 -->
    <scroll-view 
      scroll-y="true" 
      refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      class="page-scroll"
    >
      
      <image class="fahui-banner" :src="bannerImage" mode="aspectFill" v-if="bannerImage" />
      <view class="banner-desc" v-if="bannerDesc">{{ bannerDesc }}</view>

      <!-- 介绍部分 -->
      <view class="intro-section" v-if="specialIntro.content || specialIntro.image">
        <view class="intro-header">
          <text class="intro-title">专场法会介绍</text>
        </view>
        
        <view class="intro-content">
          <text class="intro-text" v-if="specialIntro.content">{{ specialIntro.content }}</text>
          <image class="intro-image" :src="specialIntro.image" mode="widthFix" v-if="specialIntro.image" />
        </view>
      </view>

      <!-- 报名人信息 -->
      <view class="section">
        <view class="section-title">
          <text class="icon">👥</text>报名人信息
          <text class="section-tip">（最多5人，每人信息需完整）</text>
        </view>
        
        <ParticipantForm 
          :value="applicants"
          @change="onParticipantsChange"
        />
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
              <text class="info-icon" @click.stop="showProjectIntro(index)">ℹ️</text>
              <text class="project-desc">{{ project.description }}</text>
              <text class="project-price">{{ getPriceText(project) }}</text>
              <text class="project-remaining">剩余名额：{{ getRemainingText(project) }}</text>
            </view>
            <view class="project-status" :class="{ active: selectedProjectIndex === index }">
              <text class="status-icon">{{ selectedProjectIndex === index ? '✓' : '○' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 配偶信息（姻缘和合法会） -->
      <view class="section" v-if="selectedProjectIndex === 0">
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
            <input v-model="spouse.phone" placeholder="请输入联系电话" class="form-input" type="tel" maxlength="11" />
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
    <view class="section" v-if="selectedProjectIndex === 1">
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
      </view>
      
      <button v-if="deceasedList.length < 5" class="add-btn" @click="addDeceased">
        <text class="add-icon">+</text>
        <text class="add-text">添加已故亲人</text>
      </button>
    </view>

    <!-- 代办物品 -->
    <view class="section" v-if="showGoods">
      <view class="section-title">
        <text class="icon">🛍️</text>代办物品
        <text class="section-tip">（可选）</text>
      </view>
      <view class="goods-list">
        <view v-for="(item, index) in goodsList" :key="index" class="goods-item">
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-desc">{{ item.description }}</text>
            <text class="goods-price">{{ getGoodsPriceText(item) }}</text>
          </view>
          <view class="goods-control">
            <button class="qty-btn" @click="decreaseGoodsQty(index)" :disabled="item.qty <= 0">-</button>
            <text class="qty-value">{{ item.qty }}</text>
            <button class="qty-btn" @click="increaseGoodsQty(index)">+</button>
          </view>
        </view>
      </view>
      <view class="total-section">
        <text class="total-label">代办费用：</text>
        <text class="total-price">{{ getGoodsTotalPriceText() }}</text>
      </view>
    </view>

    <!-- 收件信息 -->
    <view class="section" v-if="showReceiver">
      <view class="section-title">
        <text class="icon">📦</text>收件信息
        <text class="section-tip">（可选）</text>
      </view>
      <view class="receiver-form">
        <view class="form-group">
          <text class="form-label">收件人</text>
          <input v-model="receiver.name" placeholder="请输入收件人" class="form-input" maxlength="10" />
        </view>
        
        <view class="form-group">
          <text class="form-label">联系电话</text>
                      <input v-model="receiver.phone" placeholder="请输入联系电话" class="form-input" type="tel" maxlength="11" />
        </view>
        
        <view class="form-group">
          <text class="form-label">收件地址</text>
          <input v-model="receiver.address" placeholder="请输入收件地址" class="form-input" />
        </view>
      </view>
    </view>

    <!-- 下一步按钮 -->
    <view class="footer">
      <button class="next-btn" @click="nextStep">下一步</button>
    </view>

    <view v-if="showHistoryDialog" class="history-dialog-mask" @click="showHistoryDialog=false">
      <view class="history-dialog" @click.stop tabindex="0" @keydown="onHistoryKeydown">
        <view class="dialog-title">选择历史报名人</view>
        <view class="search-bar">
          <input v-model="historySearch" class="search-input" placeholder="搜索姓名或电话" @input="onHistorySearch" />
          <text v-if="historySearch" class="search-clear" @click="clearHistorySearch">×</text>
        </view>
        <view v-if="filteredHistory.length === 0" class="empty-tip">
          <text class="empty-icon">🗂️</text> 暂无匹配报名人
        </view>
        <view v-else class="history-list">
          <view v-for="(item, idx) in filteredHistory" :key="idx" class="history-item" :class="{hover: hoverIdx===idx, selected: batchDeleteSet.has(idx)}"
            @mouseenter="hoverIdx=idx" @mouseleave="hoverIdx=-1" @click="onHistoryItemClick(idx, item)">
            <view class="history-main">
              <view class="history-name">{{ item.name }} <text class="history-phone">{{ item.phone }}</text></view>
              <view class="history-detail">{{ getHistoryDetailText(item) }}</view>
              <view class="history-detail2">身份证号：{{ item.idCard || '—' }}</view>
            </view>
            <button class="history-del" v-if="!batchDeleteMode" @click.stop="deleteHistoryParticipant(idx)">删除</button>
            <input v-if="batchDeleteMode" type="checkbox" class="batch-checkbox" :checked="batchDeleteSet.has(idx)" @change.stop="toggleBatchDelete(idx)" />
          </view>
        </view>
        <view class="dialog-actions">
          <button class="dialog-close" @click="showHistoryDialog=false">关闭</button>
          <button class="dialog-btn" @click="toggleBatchDeleteMode">{{ getBatchDeleteButtonText() }}</button>
          <button class="dialog-btn" @click="exportHistory">导出</button>
          <button class="dialog-btn" @click="importHistory">导入</button>
          <button class="dialog-btn danger" v-if="batchDeleteMode && batchDeleteSet.size" @click="confirmBatchDelete">{{ getConfirmDeleteButtonText() }}</button>
        </view>
        <input v-if="showImportInput" type="file" accept="application/json" style="display:none" ref="importFile" @change="onImportFile" />
      </view>
    </view>
      </scroll-view>
  </view>
</template>

<script>
import ParticipantForm from '@/components/ParticipantForm.vue'

// 导入云对象
const fahuiManagement = uniCloud.importObject('fahui-management')

export default {
  components: {
    ParticipantForm
  },
  data() {
    return {
      bannerImage: '',
      bannerDesc: '',
      specialIntro: { content: '', image: '' },
      applicants: [this.getEmptyApplicant()],

      fahuiProjects: [], // 改为动态获取
      selectedProjectIndex: -1,
      spouse: {
        name: '',
        gender: '',
        phone: '',
        lunarBirthday: '',
        birthTime: '',
        address: ''
      },
      chaoduTypes: ['超度法会', '超度牌位', '超度功德'],
      chaoduType: '',
      relationOptions: [
        '先曾祖父', '先曾祖母', '先祖父', '先祖母', '外祖父', '外祖母',
        '先父', '先母', '岳父', '岳母', '先夫', '先妻', '故爱子', '故爱女', '好友', '恩师', '其他'
      ],
      deceasedList: [this.getEmptyDeceased()],
      showGoods: false,
      goodsList: [],
      showReceiver: false, // 默认不显示
      receiver: {
        name: '',
        phone: '',
        address: ''
      },
      genderOptions: ['男', '女'],
      birthTimeOptions: ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'],
      showHistoryDialog: false,
      historyParticipants: [],
      historySelectIndex: -1,
      historySearch: '',
      hoverIdx: -1,
      batchDeleteMode: false,
      batchDeleteSet: new Set(),
      showImportInput: false,
      refreshing: false, // 新增：控制下拉刷新状态
    }
  },
  computed: {
    goodsTotalPrice() {
      return this.goodsList.reduce((sum, item) => {
        const price = Number(item.price) || 0
        const qty = Number(item.qty) || 0
        return sum + price * qty
      }, 0)
    },
    totalPrice() {
      const basePrice = this.selectedProjectIndex >= 0 ? this.fahuiProjects[this.selectedProjectIndex].price : 0
      const applicantCount = this.applicants.length
      return basePrice * applicantCount + this.goodsTotalPrice
    },
    totalPriceFormatted() {
      return this.totalPrice.toFixed(2) // 保留两位小数
    },
    filteredHistory() {
      if (!this.historySearch) return this.historyParticipants
      const kw = this.historySearch.trim()
      return this.historyParticipants.filter(item =>
        item.name.includes(kw) || (item.phone && item.phone.includes(kw))
      )
    }
  },
  methods: {
    showError(msg) {
      uni.showToast({ title: msg, icon: 'none' })
      return false
    },
    async loadBanner() {
      try {
        const result = await fahuiManagement.getBanners()
        console.log('云函数返回：', result)
        if (result.success && result.data && result.data.length > 0) {
          const bannerData = result.data[0]
          console.log('Banner数据详情：', bannerData)
          
          let image = bannerData.image
          let desc = bannerData.description || bannerData.desc || bannerData.title || ''
          
          // fileID 转临时链接
          if (image && !/^https?:\/\//.test(image)) {
            const tempRes = await uniCloud.getTempFileURL({ fileList: [image] })
            if (tempRes.fileList && tempRes.fileList[0] && tempRes.fileList[0].tempFileURL) {
              image = tempRes.fileList[0].tempFileURL
            }
          }
          this.bannerImage = image
          this.bannerDesc = desc
          console.log('最终显示图片：', image)
          console.log('最终显示描述：', desc)
        } else {
          this.bannerImage = ''
          this.bannerDesc = ''
          console.log('没有找到banner数据')
        }
      } catch (e) {
        this.bannerImage = ''
        this.bannerDesc = ''
        console.error('加载头图失败', e)
      }
    },
    async loadSpecialIntro() {
      try {
        console.log('🔍 === 开始加载专场法会介绍数据 ===')
        console.log('🔍 调用 fahuiManagement.getSpecialIntro()')
        
        const result = await fahuiManagement.getSpecialIntro()
        console.log('🔍 云函数返回结果:', result)
        console.log('🔍 返回数据详情:', result.data)
        console.log('🔍 返回数据内容:', result.data?.content)
        console.log('🔍 返回数据启用状态:', result.data?.enabled)
        
        if (result.success && result.data) {
          console.log('🔍 数据获取成功，更新 specialIntro')
          console.log('🔍 更新前的 specialIntro:', this.specialIntro)
          
          this.specialIntro = result.data
          
          console.log('🔍 更新后的 specialIntro:', this.specialIntro)
          console.log('🔍 更新后的内容:', this.specialIntro.content)
          console.log('🔍 更新后的启用状态:', this.specialIntro.enabled)
          console.log('🔍 更新后的图片:', this.specialIntro.image)
        } else {
          console.log('🔍 数据获取失败或为空，使用默认数据')
          console.log('🔍 失败原因:', result.message)
          this.specialIntro = { content: '', image: '' }
        }
        
        console.log('🔍 === 专场法会介绍数据加载完成 ===')
      } catch (e) {
        console.error('🔍 加载专场法会介绍失败:', e)
        console.error('🔍 错误详情:', e.message)
        this.specialIntro = { content: '', image: '' }
      }
    },
    async loadFahuiProjects() {
      try {
        const result = await fahuiManagement.getProjects({ type: 'special' })
        if (result.success && result.data) {
          this.fahuiProjects = result.data.map(p => ({
            ...p,
            price: Number(p.price) || 0
          }))
        } else {
          this.fahuiProjects = []
        }
        // 恢复上次选中
        const last = uni.getStorageSync('fahuiForm')
        if (last && last.fahuiProject) {
          const idx = this.fahuiProjects.findIndex(p => p._id === last.fahuiProject._id)
          this.selectedProjectIndex = idx >= 0 ? idx : -1
        } else {
          this.selectedProjectIndex = -1
        }
      } catch (e) {
        this.fahuiProjects = []
        uni.showToast({ title: '获取法会项目失败', icon: 'none' })
      }
    },
    async loadGoodsConfig() {
      try {
        const result = await fahuiManagement.getGoodsConfig();
        if (result.success && result.data) {
          this.showGoods = !!result.data.enabled && Array.isArray(result.data.goods) && result.data.goods.length > 0;
          this.goodsList = Array.isArray(result.data.goods)
            ? result.data.goods.filter(g => g.enabled).map(g => ({ ...g, qty: Number(g.qty) || 0 }))
            : [];
        } else {
          this.showGoods = false;
          this.goodsList = [];
        }
      } catch (error) {
        this.showGoods = false;
        this.goodsList = [];
        console.error('加载代办物品配置失败:', error);
      }
    },
    async getReceiverConfig() {
      try {
        const result = await fahuiManagement.getReceiverConfig()
        // 兼容 enabled 字段在 result 或根对象
        const enabled = result.success && result.data ? result.data.enabled : false
        this.showReceiver = !!enabled
      } catch (e) {
        this.showReceiver = false
        console.error('获取收件人配置失败:', e)
      }
    },
    getEmptyApplicant() {
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
    onParticipantsChange(participants) {
      // 只在数据变化时赋值，避免深度响应式卡顿
      if (JSON.stringify(this.applicants) !== JSON.stringify(participants)) {
        this.applicants = participants.slice ? participants.slice() : participants
      }
    },

    selectProject(index) {
      console.log('选中项目index:', index)
      this.selectedProjectIndex = index
    },
    onSpouseGenderChange(e) {
      this.spouse.gender = this.genderOptions[e.detail.value]
    },
    onSpouseBirthdayChange(e) {
      this.spouse.lunarBirthday = e.detail.value
    },
    onSpouseBirthTimeChange(e) {
      this.spouse.birthTime = this.birthTimeOptions[e.detail.value]
    },
    onChaoduTypeChange(e) {
      this.chaoduType = this.chaoduTypes[e.detail.value]
    },
    addDeceased() {
      if (this.deceasedList.length < 5) {
        this.deceasedList.push(this.getEmptyDeceased())
      }
    },
    removeDeceased(index) {
      if (this.deceasedList.length > 1) {
        this.deceasedList.splice(index, 1)
      }
    },
    onRelationChange(index, e) {
      this.deceasedList[index].relation = this.relationOptions[e.detail.value]
    },
    onDeceasedBirthdayChange(index, e) {
      this.deceasedList[index].lunarBirthday = e.detail.value
    },
    onDeceasedDeathChange(index, e) {
      this.deceasedList[index].deathDate = e.detail.value
    },
    increaseGoodsQty(index) {
      this.goodsList[index].qty++
    },
    decreaseGoodsQty(index) {
      if (this.goodsList[index].qty > 0) {
        this.goodsList[index].qty--
      }
    },
    // 历史报名人弹窗
    openHistoryDialog(index) {
      this.historySelectIndex = index
      this.historyParticipants = uni.getStorageSync('historyParticipants') || []
      this.showHistoryDialog = true
    },
    selectHistoryParticipant(item) {
      if (this.historySelectIndex >= 0) {
        this.$set(this.applicants, this.historySelectIndex, { ...item })
      }
      this.showHistoryDialog = false
      this.historySelectIndex = -1
    },
    // 报名成功后保存历史报名人
    saveHistoryParticipants() {
      let history = uni.getStorageSync('historyParticipants') || []
      this.applicants.forEach(p => {
        if (!history.some(h => h.name === p.name && h.phone === p.phone)) {
          history.push({ ...p })
        }
      })
      // 最多保存20条
      if (history.length > 20) history = history.slice(-20)
      uni.setStorageSync('historyParticipants', history)
    },
    // 增强校验：姓名、手机号不能重复
    validate() {
      // 校验报名人数量
      if (!this.applicants || this.applicants.length === 0) {
        return this.showError('请添加至少一位报名人')
      }
      if (this.applicants.length > 5) {
        return this.showError('最多添加5位报名人')
      }
      // 校验报名人信息
      const nameSet = new Set()
      const phoneSet = new Set()
      for (let i = 0; i < this.applicants.length; i++) {
        const p = this.applicants[i]
        if (!p.name) return this.showError(`请输入第${i+1}位报名人姓名`)
        if (!p.gender) return this.showError(`请选择第${i+1}位报名人性别`)
        if (!p.phone) return this.showError(`请输入第${i+1}位报名人电话`)
        if (!/^1[3-9]\d{9}$/.test(p.phone)) return this.showError(`第${i+1}位报名人电话格式不正确`)
        if (!p.lunarBirthday) return this.showError(`请选择第${i+1}位报名人农历生日`)
        if (!p.birthTime) return this.showError(`请选择第${i+1}位报名人出生时辰`)
        if (!p.address) return this.showError(`请输入第${i+1}位报名人常住地址`)
        if (nameSet.has(p.name)) return this.showError(`第${i+1}位报名人姓名重复`)
        if (phoneSet.has(p.phone)) return this.showError(`第${i+1}位报名人电话重复`)
        nameSet.add(p.name)
        phoneSet.add(p.phone)
      }
      // 校验法会项目
      if (this.selectedProjectIndex === -1) {
        return this.showError('请选择法会项目')
      }
      // 校验超度法会
      if (this.selectedProjectIndex === 1) {
        if (!this.chaoduType) return this.showError('请选择超度类型')
        if (!this.deceasedList || this.deceasedList.length === 0) return this.showError('请添加至少一位已故亲人')
        for (let i = 0; i < this.deceasedList.length; i++) {
          const d = this.deceasedList[i]
          if (!d.name) return this.showError(`请输入第${i+1}位已故亲人姓名`)
          if (!d.relation) return this.showError(`请选择第${i+1}位已故亲人关系`)
        }
      }
      // 校验收件信息（如显示时，全部填写或全部为空）
      if (this.showReceiver) {
        const { name, phone, address } = this.receiver
        const filled = name || phone || address
        const allFilled = name && phone && address
        if (filled && !allFilled) return this.showError('请完整填写收件人、电话和地址')
        if (phone && !/^1[3-9]\d{9}$/.test(phone)) return this.showError('收件人电话格式不正确')
      }
      return true
    },
    nextStep() {
      if (!this.validate()) return

      // 构建表单数据
      const formData = {
        applicants: this.applicants,
        fahuiProject: {
          ...this.fahuiProjects[this.selectedProjectIndex],
          price: Number(this.fahuiProjects[this.selectedProjectIndex].price) || 0
        },
        spouse: this.selectedProjectIndex === 0 ? this.spouse : null,
        chaoduType: this.selectedProjectIndex === 1 ? this.chaoduType : null,
        deceasedList: this.selectedProjectIndex === 1 ? this.deceasedList : null,
        goods: this.goodsList.filter(item => item.qty > 0),
        receiver: this.receiver,
        totalPrice: this.totalPrice,
        timestamp: new Date().getTime()
      }

      // 收件信息自动保存到数据库
      if (this.showReceiver && this.receiver.name && this.receiver.phone && this.receiver.address) {
        fahuiManagement.addReceiver({ ...this.receiver }).catch(e => {
          console.error('保存收件信息失败:', e)
        })
      }

      // 保存到本地存储
      uni.setStorageSync('fahuiForm', formData)
      this.saveHistoryParticipants()

      // 跳转到确认页
      uni.navigateTo({
        url: '/pages/fahui/confirm',
        success: () => {
          console.log('跳转到专场法会确认页成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({ title: '页面跳转失败', icon: 'none' })
        }
      })
    },
    showProjectIntro(index) {
      const project = this.fahuiProjects[index]
      if (project) {
        uni.showModal({
          title: project.name + '简介',
          content: project.description || '暂无简介'
        })
      }
    },
    getRemainingText(project) {
      if (project.maxApplicants) {
        const remaining = project.maxApplicants - (project.currentApplicants || 0)
        return remaining.toString()
      }
      return '不限'
    },
    getPriceText(project) {
      return project.price ? '¥' + project.price : '¥0'
    },
    getGoodsPriceText(item) {
      return item.price ? '¥' + item.price : '¥0'
    },
    getGoodsTotalPriceText() {
      return '¥' + this.goodsTotalPrice
    },
    getHistoryDetailText(item) {
      const parts = []
      if (item.gender) parts.push(item.gender)
      if (item.lunarBirthday) parts.push(item.lunarBirthday)
      if (item.birthTime) parts.push(item.birthTime)
      if (item.address) parts.push(item.address)
      return parts.join(' | ')
    },
    getBatchDeleteButtonText() {
      return this.batchDeleteMode ? '取消批量' : '批量删除'
    },
    getConfirmDeleteButtonText() {
      return `确认删除(${this.batchDeleteSet.size})`
    },
    onHistorySearch() {
      this.hoverIdx = -1
    },
    clearHistorySearch() {
      this.historySearch = ''
    },
    deleteHistoryParticipant(idx) {
      const item = this.filteredHistory[idx]
      uni.showModal({
        title: '确认删除',
        content: `确定要删除“${item.name}”的历史信息吗？`,
        success: (res) => {
          if (res.confirm) {
            // 从原始数组删除
            const realIdx = this.historyParticipants.findIndex(h => h.name === item.name && h.phone === item.phone)
            if (realIdx !== -1) {
              this.historyParticipants.splice(realIdx, 1)
              uni.setStorageSync('historyParticipants', this.historyParticipants)
            }
          }
        }
      })
    },
    onHistoryKeydown(e) {
      if (!this.showHistoryDialog) return
      if (e.key === 'ArrowDown') {
        if (this.filteredHistory.length) {
          this.hoverIdx = (this.hoverIdx + 1) % this.filteredHistory.length
        }
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        if (this.filteredHistory.length) {
          this.hoverIdx = (this.hoverIdx - 1 + this.filteredHistory.length) % this.filteredHistory.length
        }
        e.preventDefault()
      } else if (e.key === 'Enter') {
        if (this.hoverIdx >= 0 && this.hoverIdx < this.filteredHistory.length && !this.batchDeleteMode) {
          this.selectHistoryParticipant(this.filteredHistory[this.hoverIdx])
        }
      } else if (e.key === 'Escape') {
        this.showHistoryDialog = false
      }
    },
    onHistoryItemClick(idx, item) {
      if (this.batchDeleteMode) {
        this.toggleBatchDelete(idx)
      } else {
        this.selectHistoryParticipant(item)
      }
    },
    toggleBatchDeleteMode() {
      this.batchDeleteMode = !this.batchDeleteMode
      this.batchDeleteSet = new Set()
    },
    toggleBatchDelete(idx) {
      if (this.batchDeleteSet.has(idx)) {
        this.batchDeleteSet.delete(idx)
      } else {
        this.batchDeleteSet.add(idx)
      }
    },
    confirmBatchDelete() {
      if (!this.batchDeleteSet.size) return
      uni.showModal({
        title: '批量删除',
        content: `确定要删除选中的${this.batchDeleteSet.size}条历史报名人吗？`,
        success: (res) => {
          if (res.confirm) {
            const toDelete = Array.from(this.batchDeleteSet).map(i => this.filteredHistory[i])
            this.historyParticipants = this.historyParticipants.filter(h => !toDelete.some(d => d.name === h.name && d.phone === h.phone))
            uni.setStorageSync('historyParticipants', this.historyParticipants)
            this.batchDeleteSet = new Set()
            this.batchDeleteMode = false
          }
        }
      })
    },
    exportHistory() {
      const data = JSON.stringify(this.historyParticipants, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'historyParticipants.json'
      a.click()
      URL.revokeObjectURL(url)
    },
    importHistory() {
      // 触发文件选择
      this.showImportInput = true
      this.$nextTick(() => {
        this.$refs.importFile && this.$refs.importFile.click()
      })
    },
    onImportFile(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (evt) => {
        try {
          const arr = JSON.parse(evt.target.result)
          if (Array.isArray(arr)) {
            // 合并去重
            arr.forEach(p => {
              if (!this.historyParticipants.some(h => h.name === p.name && h.phone === p.phone)) {
                this.historyParticipants.push(p)
              }
            })
            uni.setStorageSync('historyParticipants', this.historyParticipants)
            uni.showToast({ title: '导入成功', icon: 'success' })
          } else {
            uni.showToast({ title: '格式错误', icon: 'none' })
          }
        } catch {
          uni.showToast({ title: '解析失败', icon: 'none' })
        }
      }
      reader.readAsText(file)
      this.showImportInput = false
    },
    
    // 强制刷新所有数据
    forceRefreshAll() {
      console.log('🔍 === 强制刷新所有数据 ===')
      // 清除所有缓存数据
      this.bannerImage = ''
      this.bannerDesc = ''
      this.specialIntro = { content: '', image: '' }
      this.fahuiProjects = []
      this.goodsList = []
      
      // 重新加载所有数据
      this.loadBanner()
      this.loadSpecialIntro()
      this.loadFahuiProjects()
      this.loadGoodsConfig()
      
      uni.showToast({ title: '所有数据已强制刷新', icon: 'none' });
    },

    // 新增：下拉刷新
    async onRefresh() {
      this.refreshing = true;
      await this.loadBanner();
      await this.loadSpecialIntro();
      await this.loadFahuiProjects();
      await this.loadGoodsConfig();
      this.refreshing = false;
    }
  },
  onLoad() {
    this.getReceiverConfig();
    this.loadBanner()
    this.loadSpecialIntro()
    this.loadFahuiProjects() // 新增
    this.loadGoodsConfig();
    // 自动填充上次填写
    const last = uni.getStorageSync('fahuiForm')
    if (last) {
      this.applicants = last.applicants || [this.getEmptyApplicant()]
      this.selectedProjectIndex = this.fahuiProjects.findIndex(p => p._id === last.fahuiProject?.id)
      this.spouse = last.spouse || this.spouse
      this.chaoduType = last.chaoduType || ''
      this.deceasedList = last.deceasedList || [this.getEmptyDeceased()]
      this.receiver = last.receiver || this.receiver
      
      // 恢复商品选择
      if (last.goods) {
        last.goods.forEach(selected => {
          const index = this.goodsList.findIndex(item => item.id === selected.id)
          if (index !== -1) {
            this.goodsList[index].qty = selected.qty
          }
        })
      }
    }
  },
  onShow() {
    // 移除重复的 getReceiverConfig() 调用，避免重复执行
    try {
      uni.removeStorageSync('fahuiBannerCache')
    } catch (e) {}
    this.loadBanner()
    this.loadFahuiProjects() // 新增，确保每次进入都刷新
    this.loadGoodsConfig();
  }
}
</script>

<style scoped>
.fahui-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
}

.page-scroll {
  height: 100vh;
  padding-bottom: 40rpx;
}

.fahui-banner {
  width: 100%;
  height: 320rpx;
  border-radius: 0 0 24rpx 24rpx;
}

.banner-desc {
  position: absolute;
  top: 320rpx; /* 与 bannerImage 高度一致 */
  left: 0;
  width: 100%;
  padding: 20rpx 16rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 24rpx;
  text-align: center;
  z-index: 10;
}

.intro-section {
  background: #fff;
  margin: 24rpx 16rpx;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.intro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.intro-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2d8cf0;
}

.intro-image {
  width: 100%;
  height: 200rpx; /* 图片高度 */
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.intro-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.intro-text {
  display: block;
  margin-bottom: 16rpx;
}

.section {
  background: #fff;
  margin: 24rpx 16rpx;
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

.required {
  color: #ff4d4f;
  font-size: 26rpx;
}



.form-group {
  margin-bottom: 18rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.form-input {
  width: 100%;
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
  font-size: 36rpx;
  margin-right: 8rpx;
}

.project-list {
  margin-bottom: 24rpx;
}

.project-item {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.project-item:active {
  transform: scale(0.98);
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.project-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.project-price {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.project-remaining {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}

.project-status {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #e0eaff;
}

.project-status.active {
  background: #2d8cf0;
  border-color: #2d8cf0;
}

.status-icon {
  font-size: 32rpx;
  color: #2d8cf0;
}

.project-status.active .status-icon {
  color: #fff;
}

.spouse-form, .receiver-form {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
}

.deceased-list {
  margin-bottom: 24rpx;
}

.deceased-card {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
}

.deceased-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}

.deceased-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #2d8cf0;
}

.goods-list {
  margin-bottom: 24rpx;
}

.goods-item {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-info {
  flex: 1;
}

.goods-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.goods-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.goods-price {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.goods-control {
  display: flex;
  align-items: center;
}

.qty-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1px solid #2d8cf0;
  border-radius: 8rpx;
  background: #fff;
  color: #2d8cf0;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:disabled {
  color: #ccc;
  border-color: #ccc;
}

.qty-value {
  width: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  margin: 0 16rpx;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1px solid #e0eaff;
}

.total-label {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.footer {
  padding: 32rpx 16rpx;
}

.next-btn {
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

.history-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.history-dialog {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx 24rpx 32rpx;
  min-width: 520rpx;
  max-width: 90vw;
  box-shadow: 0 12rpx 48rpx #b3c6e0;
  position: relative;
  animation: fadeIn .2s;
}
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
.dialog-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  text-align: center;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 18rpx;
  background: #f7f7fa;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
}
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 28rpx;
  outline: none;
}
.search-clear {
  font-size: 32rpx;
  color: #bbb;
  margin-left: 8rpx;
  cursor: pointer;
}
.empty-tip {
  color: #aaa;
  text-align: center;
  margin: 32rpx 0;
  font-size: 28rpx;
}
.empty-icon {
  font-size: 48rpx;
  display: block;
  margin-bottom: 8rpx;
}
.history-list {
  max-height: 400rpx;
  overflow-y: auto;
  margin-bottom: 24rpx;
}
.history-item {
  display: flex;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  border-radius: 8rpx;
  transition: background 0.2s;
}
.history-item:last-child { border-bottom: none; }
.history-item.hover, .history-item:active {
  background: #f0f6ff;
}
.history-item.selected {
  background: #ffeaea;
}
.history-main { flex: 1; }
.history-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}
.history-phone {
  font-size: 24rpx;
  color: #888;
  margin-left: 16rpx;
}
.history-detail {
  font-size: 24rpx;
  color: #666;
  margin-top: 4rpx;
}
.history-detail2 {
  font-size: 24rpx;
  color: #666;
  margin-top: 4rpx;
}
.history-del {
  background: #fff0f0;
  color: #ff4d4f;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  padding: 8rpx 18rpx;
  margin-left: 16rpx;
  cursor: pointer;
  transition: background 0.2s;
}
.history-del:active {
  background: #ffeaea;
}
.dialog-close {
  width: 100%;
  margin-top: 24rpx;
  background: #e0eaff;
  color: #2d8cf0;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 16rpx 0;
}
.batch-checkbox {
  width: 32rpx;
  height: 32rpx;
  margin-left: 16rpx;
}
.dialog-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 12rpx;
  flex-wrap: wrap;
}
.dialog-btn {
  background: #f7f7fa;
  color: #2d8cf0;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 12rpx 24rpx;
  border: none;
  cursor: pointer;
}
.dialog-btn.danger {
  background: #fff0f0;
  color: #ff4d4f;
}
</style>
