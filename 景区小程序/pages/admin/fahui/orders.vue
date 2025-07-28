<template>
  <view class="admin-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <view class="title">{{ fahuiType === 'joint' ? '合坛法会' : '专场法会' }}订单管理</view>
      <view class="refresh-btn" @click="loadOrders">
        <text class="refresh-icon">🔄</text>
        <text class="refresh-text">刷新</text>
      </view>
      <button class="export-btn" @click="exportOrders">导出订单</button>
    </view>

    <!-- 收件信息模块状态栏 -->
    <view class="module-status-bar">
      <text>收件信息模块：</text>
      <text :style="{color: receiverEnabled ? '#52c41a' : '#ff4d4f'}">
        {{ receiverEnabled ? '已启用' : '未启用' }}
      </text>
      <switch :checked="receiverEnabled" @change="onReceiverSwitchChange" style="margin-left: 24rpx;" />
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item">
        <text class="filter-label">状态：</text>
        <picker @change="onStatusChange" :value="statusIndex" :range="statusOptions">
          <view class="picker-text">{{ statusOptions[statusIndex] }}</view>
        </picker>
      </view>
      <view class="filter-item">
        <text class="filter-label">类型：</text>
        <picker @change="onTypeChange" :value="typeIndex" :range="typeOptions">
          <view class="picker-text">{{ typeOptions[typeIndex] }}</view>
        </picker>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view v-for="(order, index) in filteredOrders" :key="order._id" class="order-item">
        <view class="order-header">
          <view class="order-id">订单号：{{ order.orderNo || order._id }}</view>
          <view class="order-status" :class="order.status === '待确认' ? 'status-pending' : order.status === '已确认' ? 'status-confirmed' : order.status === '已取消' ? 'status-cancelled' : 'status-default'">
            {{ getStatusText(order.status) }}
          </view>
        </view>
        
        <view class="order-content">
          <view class="order-info">
            <view class="info-row">
              <text class="info-label">法会名称：</text>
              <text class="info-value">{{ order.fahuiName || (order.fahuiProject && order.fahuiProject.name) || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">报名人：</text>
              <text class="info-value">{{ order.participantName || (order.applicants && order.applicants.map(a=>a.name).join('、')) || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">金额：</text>
              <text class="info-value price">¥{{ order.amount || order.totalFee || 0 }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">状态：</text>
              <text class="info-value">{{ getStatusText(order.status) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">支付时间：</text>
              <text class="info-value">{{ order.payTime ? formatDate(order.payTime) : '-' }}</text>
            </view>
            <view class="info-row" v-if="order.spouse && order.spouse.name">
              <text class="info-label">配偶：</text>
              <text class="info-value">{{ order.spouse.name }}</text>
            </view>
            <view class="info-row" v-if="order.chaoduType">
              <text class="info-label">超度类型：</text>
              <text class="info-value">{{ order.chaoduType }}</text>
            </view>
            <view class="info-row" v-if="order.goods && order.goods.length">
              <text class="info-label">代办物品：</text>
              <text class="info-value">{{ order.goods.map(g => g.name + '×' + g.qty).join('，') }}</text>
            </view>
            <view class="info-row" v-if="order.receiver && order.receiver.name">
              <text class="info-label">收件人：</text>
              <text class="info-value">{{ order.receiver.name }}</text>
            </view>
          </view>
        </view>
        
        <view class="order-actions">
          <button class="action-btn detail-btn" @click="toggleDetail(index)">{{ showDetailIndex === index ? '收起' : '详情' }}</button>
          <button class="action-btn status-btn" @click="changeStatus(order)" v-if="order.status === '待确认'">
            {{ order.status === '待确认' ? '确认' : '取消确认' }}
          </button>
          <button class="action-btn confirm-date-btn" v-if="order.status === '待确认'" @click="openFahuiDateDialog(order)">专场日期确认</button>
          <button class="action-btn remark-btn" @click="toggleRemark(index)">{{ showRemarkIndex === index ? '收起备注' : '备注' }}</button>
          <button class="action-btn delete-btn" @click="deleteOrder(order._id)">删除</button>
        </view>
        <!-- 详情内联区 -->
        <view v-if="showDetailIndex === index" class="inline-detail">
          <view class="detail-section">
            <view class="detail-title">订单详情</view>
            <view class="detail-item"><text class="detail-label">法会名称：</text><text class="detail-value">{{ order.fahuiName || (order.fahuiProject && order.fahuiProject.name) || '-' }}</text></view>
            <view class="detail-item"><text class="detail-label">法会项目：</text><text class="detail-value">{{ order.fahuiProject && order.fahuiProject.name ? order.fahuiProject.name : '-' }}</text></view>
            <view class="detail-item"><text class="detail-label">支付时间：</text><text class="detail-value">{{ order.payTime ? formatDate(order.payTime) : '-' }}</text></view>
            <view class="detail-item"><text class="detail-label">金额：</text><text class="detail-value">¥{{ order.amount || order.totalFee || 0 }}</text></view>
            <view class="detail-item"><text class="detail-label">状态：</text><text class="detail-value">{{ getStatusText(order.status) }}</text></view>
            <view class="detail-item"><text class="detail-label">专场法会日期：</text>
              <input v-model="inlineFahuiDate" type="date" class="form-input" style="width:200rpx;display:inline-block;" />
              <button class="modal-btn confirm-btn" style="margin-left:16rpx;" @click="confirmFahuiDate(order)">确认</button>
            </view>
            <!-- 可补充更多字段 -->
          </view>
        </view>
        <!-- 备注内联区 -->
        <view v-if="showRemarkIndex === index" class="inline-remark">
          <view class="detail-title">备注</view>
          <textarea v-model="inlineRemarkContent" class="form-textarea" placeholder="请输入备注内容" maxlength="200" />
          <button class="modal-btn confirm-btn" @click="saveInlineRemark(order)">保存备注</button>
          <view v-if="order.adminRemarks && order.adminRemarks.length">
            <view class="detail-title">历史备注</view>
            <view v-for="(r, i) in order.adminRemarks" :key="i" class="remark-item">
              <view class="remark-content">{{ r.content }}</view>
              <view class="remark-info"><text class="remark-author">{{ r.author }}</text><text class="remark-time">{{ formatDate(r.createTime) }}</text></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单详情弹窗 -->
    <uni-popup ref="detailModal" type="center">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">订单详情</text>
          <text class="modal-close" @click="hideDetailModal">×</text>
        </view>
        
        <view class="modal-body" v-if="selectedOrder">
          <view class="detail-section">
            <view class="detail-title">基本信息</view>
            <view class="detail-item"><text class="detail-label">订单号：</text><text class="detail-value">{{ selectedOrder.orderNo || selectedOrder._id }}</text></view>
            <view class="detail-item"><text class="detail-label">法会名称：</text><text class="detail-value">{{ selectedOrder.fahuiName || (selectedOrder.fahuiProject && selectedOrder.fahuiProject.name) || '-' }}</text></view>
            <view class="detail-item"><text class="detail-label">法会项目：</text><text class="detail-value">{{ selectedOrder.fahuiProject && selectedOrder.fahuiProject.name ? selectedOrder.fahuiProject.name : '-' }}</text></view>
            <view class="detail-item"><text class="detail-label">报名时间：</text><text class="detail-value">{{ formatDate(selectedOrder.createTime) }}</text></view>
            <view class="detail-item"><text class="detail-label">支付时间：</text><text class="detail-value">{{ formatDate(selectedOrder.payTime) }}</text></view>
            <view class="detail-item"><text class="detail-label">支付方式：</text><text class="detail-value">{{ selectedOrder.paymentMethod || '-' }}</text></view>
            <view class="detail-item"><text class="detail-label">金额：</text><text class="detail-value">¥{{ selectedOrder.amount || selectedOrder.totalFee || 0 }}</text></view>
            <view class="detail-item"><text class="detail-label">状态：</text><text class="detail-value">{{ getStatusText(selectedOrder.status) }}</text></view>
            <view class="detail-item" v-if="selectedOrder.remark"><text class="detail-label">备注：</text><text class="detail-value">{{ selectedOrder.remark }}</text></view>
          </view>
          <view class="detail-section" v-if="selectedOrder.applicants && selectedOrder.applicants.length">
            <view class="detail-title">报名人信息</view>
            <view v-for="(applicant, idx) in selectedOrder.applicants" :key="idx" class="applicant-detail">
              <view class="detail-item"><text class="detail-label">姓名：</text><text class="detail-value">{{ applicant.name }}</text></view>
              <view class="detail-item"><text class="detail-label">性别：</text><text class="detail-value">{{ applicant.gender }}</text></view>
              <view class="detail-item"><text class="detail-label">电话：</text><text class="detail-value">{{ applicant.phone }}</text></view>
              <view class="detail-item"><text class="detail-label">农历生日：</text><text class="detail-value">{{ applicant.lunarBirthday }}</text></view>
              <view class="detail-item"><text class="detail-label">出生时辰：</text><text class="detail-value">{{ applicant.birthTime }}</text></view>
              <view class="detail-item"><text class="detail-label">常住地址：</text><text class="detail-value">{{ applicant.address }}</text></view>
              <view style="height:12rpx;"></view>
            </view>
          </view>
          <view class="detail-section" v-if="selectedOrder.spouse && selectedOrder.spouse.name">
            <view class="detail-title">配偶信息</view>
            <view class="detail-item"><text class="detail-label">姓名：</text><text class="detail-value">{{ selectedOrder.spouse.name }}</text></view>
            <view class="detail-item"><text class="detail-label">性别：</text><text class="detail-value">{{ selectedOrder.spouse.gender }}</text></view>
            <view class="detail-item"><text class="detail-label">电话：</text><text class="detail-value">{{ selectedOrder.spouse.phone }}</text></view>
            <view class="detail-item"><text class="detail-label">农历生日：</text><text class="detail-value">{{ selectedOrder.spouse.lunarBirthday }}</text></view>
            <view class="detail-item"><text class="detail-label">出生时辰：</text><text class="detail-value">{{ selectedOrder.spouse.birthTime }}</text></view>
            <view class="detail-item"><text class="detail-label">常住地址：</text><text class="detail-value">{{ selectedOrder.spouse.address }}</text></view>
          </view>
          <view class="detail-section" v-if="selectedOrder.chaoduType">
            <view class="detail-title">超度信息</view>
            <view class="detail-item"><text class="detail-label">超度类型：</text><text class="detail-value">{{ selectedOrder.chaoduType }}</text></view>
          </view>
          <view class="detail-section" v-if="selectedOrder.deceasedList && selectedOrder.deceasedList.length">
            <view class="detail-title">已故亲人信息</view>
            <view v-for="(d, i) in selectedOrder.deceasedList" :key="i" class="applicant-detail">
              <view class="detail-item"><text class="detail-label">姓名：</text><text class="detail-value">{{ d.name }}</text></view>
              <view class="detail-item"><text class="detail-label">关系：</text><text class="detail-value">{{ d.relation }}</text></view>
              <view class="detail-item"><text class="detail-label">出生农历：</text><text class="detail-value">{{ d.lunarBirthday }}</text></view>
              <view class="detail-item"><text class="detail-label">去世农历：</text><text class="detail-value">{{ d.deathDate }}</text></view>
            </view>
          </view>
          <view class="detail-section" v-if="selectedOrder.goods && selectedOrder.goods.length">
            <view class="detail-title">代办物品</view>
            <view v-for="(g, i) in selectedOrder.goods" :key="i" class="applicant-detail">
              <view class="detail-item"><text class="detail-label">物品名称：</text><text class="detail-value">{{ g.name }}</text></view>
              <view class="detail-item"><text class="detail-label">数量：</text><text class="detail-value">{{ g.qty }}</text></view>
              <view class="detail-item"><text class="detail-label">单价：</text><text class="detail-value">¥{{ g.price }}</text></view>
            </view>
          </view>
          <view class="detail-section" v-if="selectedOrder.receiver && selectedOrder.receiver.name">
            <view class="detail-title">收件信息</view>
            <view class="detail-item"><text class="detail-label">收件人：</text><text class="detail-value">{{ selectedOrder.receiver.name }}</text></view>
            <view class="detail-item"><text class="detail-label">联系电话：</text><text class="detail-value">{{ selectedOrder.receiver.phone }}</text></view>
            <view class="detail-item"><text class="detail-label">收件地址：</text><text class="detail-value">{{ selectedOrder.receiver.address }}</text></view>
          </view>
          
          <view class="detail-section" v-if="selectedOrder.adminRemarks && selectedOrder.adminRemarks.length > 0">
            <view class="detail-title">管理备注</view>
            <view v-for="(remark, index) in selectedOrder.adminRemarks" :key="index" class="remark-item">
              <view class="remark-content">{{ remark.content }}</view>
              <view class="remark-info">
                <text class="remark-author">{{ remark.author }}</text>
                <text class="remark-time">{{ formatDate(remark.createTime) }}</text>
              </view>
            </view>
          </view>

          <view class="detail-section" v-if="selectedOrder.logs && selectedOrder.logs.length">
            <view class="detail-title">操作日志</view>
            <view v-for="(log, idx) in selectedOrder.logs" :key="idx" class="remark-item">
              <view class="remark-content">{{ log.action }}</view>
              <view class="remark-info">
                <text class="remark-author">{{ log.operator }}</text>
                <text class="remark-time">{{ formatDate(log.time) }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn confirm-btn" @click="hideDetailModal">关闭</button>
        </view>
      </view>
    </uni-popup>

    <!-- 备注弹窗 -->
    <uni-popup ref="remarkModal" type="center">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">添加备注</text>
          <text class="modal-close" @click="hideRemarkModal">×</text>
        </view>
        
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">备注内容</text>
            <textarea v-model="remarkContent" placeholder="请输入备注内容" class="form-textarea" maxlength="200" />
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn" @click="hideRemarkModal">取消</button>
          <button class="modal-btn confirm-btn" @click="saveRemark">保存</button>
        </view>
      </view>
    </uni-popup>

    <!-- 专场法会日期确认弹窗 -->
    <uni-popup ref="fahuiDatePopup" v-model="showFahuiDatePopup" type="center">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">专场法会日期确认</text>
          <text class="modal-close" @click="showFahuiDatePopup=false">×</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">专场法会日期</text>
            <input v-model="fahuiDateInput" type="date" class="form-input" />
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn confirm-btn" :disabled="!fahuiDateInput" @click="confirmFahuiDate">确认</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
export default {
  components: { uniPopup },
  data() {
    return {
      fahuiType: 'special', // 默认专场法会
      orders: [],
      filteredOrders: [],
      statusOptions: ['全部', '待确认', '已确认', '已取消'],
      statusIndex: 0,
      typeOptions: ['全部', '专场法会', '合坛法会'],
      typeIndex: 0,
      selectedOrder: null,
      remarkContent: '',
      currentOrderForRemark: null,
      receiverEnabled: false,
      fahuiDateInput: '',
      showFahuiDatePopup: false,
      fahuiDateOrder: null,
      showDetailIndex: -1,
      showRemarkIndex: -1,
      inlineFahuiDate: '',
      inlineRemarkContent: '',
    }
  },
  
  onLoad(options) {
    // 获取法会类型参数
    if (options.type) {
      this.fahuiType = options.type;
    }
    this.loadOrders()
    this.getReceiverConfig()
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    // 加载订单列表
    async loadOrders() {
      try {
        uni.showLoading({ title: '加载中...' })
        
        const result = await uniCloud.callFunction({
          name: 'getFahuiOrders',
          data: { type: this.fahuiType }
        })
        
        if (result.result && result.result.data) {
          this.orders = result.result.data
          this.filterOrders()
        }
      } catch (error) {
        console.error('加载订单失败：', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 筛选订单
    filterOrders() {
      let filtered = [...this.orders]
      
      // 按状态筛选
      if (this.statusIndex > 0) {
        const status = this.statusOptions[this.statusIndex]
        filtered = filtered.filter(item => item.status === status)
      }
      
      // 按类型筛选
      if (this.typeIndex > 0) {
        const type = this.typeOptions[this.typeIndex]
        filtered = filtered.filter(item => item.fahuiType === type)
      }
      
      this.filteredOrders = filtered
    },
    
    // 状态筛选变化
    onStatusChange(e) {
      this.statusIndex = e.detail.value
      this.filterOrders()
    },
    
    // 类型筛选变化
    onTypeChange(e) {
      this.typeIndex = e.detail.value
      this.filterOrders()
    },
    
    // 获取状态样式
    getStatusClass(status) {
      switch (status) {
        case '待确认':
          return 'status-pending'
        case '已确认':
          return 'status-confirmed'
        case '已取消':
          return 'status-cancelled'
        default:
          return 'status-default'
      }
    },
    
    // 获取状态文本
    getStatusText(status) {
      return status || '未知'
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },
    
    // 查看详情
    viewDetail(order) {
      this.selectedOrder = order
      this.fahuiDateInput = order.fahuiDate || ''
      console.log('detailModal ref:', this.$refs.detailModal)
      if (this.$refs.detailModal && typeof this.$refs.detailModal.open === 'function') {
        this.$refs.detailModal.open('center')
      } else if (this.$refs.detailModal && typeof this.$refs.detailModal.show === 'function') {
        this.$refs.detailModal.show()
      }
    },
    
    // 隐藏详情弹窗
    hideDetailModal() {
      this.$refs.detailModal.close()
      this.selectedOrder = null
    },
    
    // 更改状态
    async changeStatus(order) {
      const newStatus = order.status === '待确认' ? '已确认' : '待确认'
      try {
        uni.showLoading({ title: '更新中...' })
        const result = await uniCloud.callFunction({
          name: 'updateFahuiOrderStatus',
          data: {
            id: order._id,
            status: newStatus,
            operator: '管理员' // 可替换为当前登录用户
          }
        })
        if (result.result && result.result.success) {
          uni.showToast({
            title: '状态更新成功',
            icon: 'success'
          })
          this.loadOrders()
        } else {
          throw new Error(result.result.message || '更新失败')
        }
      } catch (error) {
        console.error('更新状态失败：', error)
        uni.showToast({
          title: '更新失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 删除订单
    deleteOrder(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '删除中...' })
              
              const result = await uniCloud.callFunction({
                name: 'deleteFahuiOrder',
                data: { id }
              })
              
              if (result.result && result.result.success) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                this.loadOrders()
              } else {
                throw new Error(result.result.message || '删除失败')
              }
            } catch (error) {
              console.error('删除失败：', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            } finally {
              uni.hideLoading()
            }
          }
        }
      })
    },
    
    // 添加备注
    addRemark(order) {
      this.currentOrderForRemark = order
      this.remarkContent = ''
      console.log('remarkModal ref:', this.$refs.remarkModal)
      if (this.$refs.remarkModal && typeof this.$refs.remarkModal.open === 'function') {
        this.$refs.remarkModal.open('center')
      } else if (this.$refs.remarkModal && typeof this.$refs.remarkModal.show === 'function') {
        this.$refs.remarkModal.show()
      }
    },
    
    // 保存备注
    async saveRemark() {
      if (!this.remarkContent.trim()) {
        uni.showToast({
          title: '请输入备注内容',
          icon: 'none'
        })
        return
      }
      try {
        const remark = {
          content: this.remarkContent
        }
        await uniCloud.callFunction({
          name: 'addFahuiOrderRemark',
          data: {
            orderId: this.currentOrderForRemark._id,
            remark: remark,
            operator: '管理员' // 可替换为当前登录用户
          }
        })
        // 更新本地数据
        const orderIndex = this.orders.findIndex(o => o._id === this.currentOrderForRemark._id)
        if (orderIndex !== -1) {
          if (!this.orders[orderIndex].adminRemarks) {
            this.orders[orderIndex].adminRemarks = []
          }
          this.orders[orderIndex].adminRemarks.push({ ...remark, author: '管理员', createTime: new Date() })
        }
        this.hideRemarkModal()
        uni.showToast({
          title: '备注添加成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('添加备注失败：', error)
        uni.showToast({
          title: '添加备注失败',
          icon: 'none'
        })
      }
    },
    
    // 隐藏备注弹窗
    hideRemarkModal() {
      this.$refs.remarkModal.close()
      this.currentOrderForRemark = null
      this.remarkContent = ''
    },

    async getReceiverConfig() {
      try {
        const res = await uniCloud.callFunction({ name: 'getFahuiReceiverConfig', data: { t: Date.now() } })
        console.log('[调试] getFahuiReceiverConfig 返回:', res)
        // 兼容 enabled 字段在 result 或根对象
        this.receiverEnabled = !!((res.result && typeof res.result.enabled !== 'undefined' ? res.result.enabled : res.enabled))
      } catch (e) {
        this.receiverEnabled = false
      }
    },
    async onReceiverSwitchChange(e) {
      const value = e.detail.value
      try {
        await uniCloud.callFunction({ name: 'updateFahuiReceiverConfig', data: { enabled: value } })
        this.receiverEnabled = value
        uni.showToast({ title: value ? '已启用' : '已关闭', icon: 'success' })
      } catch (e) {
        uni.showToast({ title: '设置失败', icon: 'none' })
      }
    },
    exportOrders() {
      // 导出当前筛选结果为CSV
      const headers = [
        '订单号','法会名称','法会项目','报名人','配偶','超度类型','已故亲人','代办物品','收件人','金额','支付方式','支付时间','报名时间','专场法会日期','状态','备注'
      ]
      const rows = this.filteredOrders.map(o => [
        o.orderNo || o._id,
        o.fahuiName || (o.fahuiProject && o.fahuiProject.name) || '',
        o.fahuiProject && o.fahuiProject.name ? o.fahuiProject.name : '',
        (o.applicants && o.applicants.length) ? o.applicants.map(a => `${a.name}/${a.phone}`).join('；') : '',
        o.spouse && o.spouse.name ? o.spouse.name : '',
        o.chaoduType || '',
        (o.deceasedList && o.deceasedList.length) ? o.deceasedList.map(d => `${d.name}/${d.relation}`).join('；') : '',
        (o.goods && o.goods.length) ? o.goods.map(g => `${g.name}×${g.qty}`).join('；') : '',
        o.receiver && o.receiver.name ? o.receiver.name : '',
        o.amount || o.totalFee || 0,
        o.paymentMethod || '',
        o.payTime ? this.formatDate(o.payTime) : '',
        o.createTime ? this.formatDate(o.createTime) : '',
        o.fahuiDate || '',
        this.getStatusText(o.status),
        (o.adminRemarks && o.adminRemarks.length) ? o.adminRemarks[o.adminRemarks.length-1].content : (o.remark || '')
      ])
      // 加 BOM 兼容 Excel
      const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
      // 创建下载
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'fahui_orders.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      uni.showToast({ title: '导出成功', icon: 'success' })
    },
    openFahuiDateDialog(order) {
      this.fahuiDateOrder = order
      this.fahuiDateInput = order.fahuiDate || ''
      this.showFahuiDatePopup = true
    },
    async confirmFahuiDate() {
      if (!this.fahuiDateOrder || !this.fahuiDateInput) return
      try {
        uni.showLoading({ title: '确认中...' })
        const result = await uniCloud.callFunction({
          name: 'updateFahuiOrderStatus',
          data: {
            id: this.fahuiDateOrder._id,
            status: '已确认',
            fahuiDate: this.fahuiDateInput,
            operator: '管理员' // 可替换为当前登录用户
          }
        })
        if (result.result && result.result.success) {
          uni.showToast({ title: '专场法会已确认', icon: 'success' })
          this.showFahuiDatePopup = false
          this.loadOrders()
        } else {
          throw new Error(result.result.message || '确认失败')
        }
      } catch (error) {
        uni.showToast({ title: '确认失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    toggleDetail(idx) {
      if (this.showDetailIndex === idx) {
        this.showDetailIndex = -1
      } else {
        this.showDetailIndex = idx
        this.inlineFahuiDate = this.filteredOrders[idx].fahuiDate || ''
      }
    },
    toggleRemark(idx) {
      if (this.showRemarkIndex === idx) {
        this.showRemarkIndex = -1
      } else {
        this.showRemarkIndex = idx
        this.inlineRemarkContent = ''
      }
    },
    async confirmFahuiDate(order) {
      if (!order || !this.inlineFahuiDate) return
      try {
        uni.showLoading({ title: '确认中...' })
        const result = await uniCloud.callFunction({
          name: 'updateFahuiOrderStatus',
          data: {
            id: order._id,
            status: '已确认',
            fahuiDate: this.inlineFahuiDate,
            operator: '管理员'
          }
        })
        if (result.result && result.result.success) {
          uni.showToast({ title: '专场法会已确认', icon: 'success' })
          this.loadOrders()
        } else {
          throw new Error(result.result.message || '确认失败')
        }
      } catch (error) {
        uni.showToast({ title: '确认失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    async saveInlineRemark(order) {
      if (!this.inlineRemarkContent.trim()) {
        uni.showToast({ title: '请输入备注内容', icon: 'none' })
        return
      }
      try {
        const remark = { content: this.inlineRemarkContent }
        await uniCloud.callFunction({
          name: 'addFahuiOrderRemark',
          data: {
            orderId: order._id,
            remark: remark,
            operator: '管理员'
          }
        })
        this.inlineRemarkContent = ''
        this.loadOrders()
        uni.showToast({ title: '备注添加成功', icon: 'success' })
      } catch (error) {
        uni.showToast({ title: '添加备注失败', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 0;
}

.header {
  background: #2d8cf0;
  color: white;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.back-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.refresh-btn {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.refresh-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.filter-bar {
  background: white;
  padding: 20rpx 30rpx;
  display: flex;
  gap: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 10rpx;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
  padding: 10rpx 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #ddd;
}

.order-list {
  padding: 20rpx;
}

.order-item {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-id {
  font-size: 28rpx;
  color: #666;
}

.order-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-confirmed {
  background: #e8f5e8;
  color: #52c41a;
}

.status-cancelled {
  background: #fff2f0;
  color: #ff4d4f;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

.order-content {
  margin-bottom: 20rpx;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.info-row {
  display: flex;
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

.price {
  color: #ff4d4f;
  font-weight: bold;
}

.order-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 16rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.detail-btn {
  background: #1890ff;
  color: white;
}

.status-btn {
  background: #52c41a;
  color: white;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
}

.confirm-date-btn {
  background: #2d8cf0;
  color: #fff;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 12rpx 20rpx;
  border: none;
}

.modal-content {
  background: white;
  border-radius: 12rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 30rpx;
}

.detail-section {
  margin-bottom: 30rpx;
}

.detail-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #eee;
}

.detail-item {
  display: flex;
  margin-bottom: 15rpx;
}

.detail-label {
  font-size: 28rpx;
  color: #666;
  width: 160rpx;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.modal-footer {
  padding: 30rpx;
  border-top: 1rpx solid #eee;
  display: flex;
  gap: 20rpx;
}

.modal-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.confirm-btn {
  background: #2d8cf0;
  color: white;
}

.remark-btn {
  background: #fa8c16;
  color: white;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  height: 120rpx;
  resize: none;
}

.remark-item {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
}

.remark-content {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.remark-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remark-author {
  font-size: 24rpx;
  color: #666;
}

.remark-time {
  font-size: 24rpx;
  color: #999;
}

.module-status-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: #fffbe6;
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}
.set-btn {
  background: #2d8cf0;
  color: #fff;
  border-radius: 8rpx;
  padding: 8rpx 20rpx;
  font-size: 26rpx;
  border: none;
  margin-left: 12rpx;
}
.export-btn {
  background: #52c41a;
  color: #fff;
  border-radius: 8rpx;
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  border: none;
  margin-left: 16rpx;
}
.applicant-detail {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
}
</style> 