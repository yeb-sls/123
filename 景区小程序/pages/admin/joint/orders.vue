<template>
  <view class="orders-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-title">
          <text class="title-icon">🏛️</text>
          <text class="title-text">法会订单管理</text>
        </view>
        <view class="header-stats">
          <view class="stat-item">
            <text class="stat-number">{{ orders.length }}</text>
            <text class="stat-label">总订单</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ pendingOrders.length }}</text>
            <text class="stat-label">待处理</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ completedOrders.length }}</text>
            <text class="stat-label">已完成</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 筛选工具栏 -->
    <view class="filter-toolbar">
      <view class="filter-group">
        <picker @change="onTypeFilterChange" :value="typeFilterIndex" :range="typeOptions" range-key="label">
          <view class="filter-item">
            <text class="filter-icon">🏛️</text>
            <text class="filter-text">{{ typeOptions[typeFilterIndex].label }}</text>
            <text class="filter-arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="filter-group">
        <picker @change="onStatusFilterChange" :value="statusFilterIndex" :range="statusOptions" range-key="label">
          <view class="filter-item">
            <text class="filter-icon">📊</text>
            <text class="filter-text">{{ statusOptions[statusFilterIndex].label }}</text>
            <text class="filter-arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="filter-group">
        <picker @change="onDateFilterChange" :value="dateFilterIndex" :range="dateOptions" range-key="label">
          <view class="filter-item">
            <text class="filter-icon">📅</text>
            <text class="filter-text">{{ dateOptions[dateFilterIndex].label }}</text>
            <text class="filter-arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索订单号或姓名" 
          v-model="searchKeyword"
          @input="onSearchInput"
        />
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="orders-container">
      <view v-if="filteredOrders.length === 0" class="empty-state">
        <view class="empty-icon">📋</view>
        <text class="empty-title">暂无订单</text>
        <text class="empty-desc">当前筛选条件下没有找到订单</text>
      </view>
      
      <view v-else class="orders-list">
        <view 
          v-for="(order, index) in filteredOrders" 
          :key="order._id || order.order_id || order.orderNo || index"
          class="order-card"
          @click="viewOrderDetail(order)"
        >
          <!-- 订单头部 -->
          <view class="order-header">
            <view class="order-info">
              <view class="order-top">
                <text class="order-number">{{ order.orderNo || order.order_id || order.orderNumber }}</text>
                <view class="order-type-badge" :class="getTypeClass(order.fahuiType || order.type)">
                  <text class="type-text">{{ getTypeText(order.fahuiType || order.type) }}</text>
                </view>
              </view>
              <view class="order-status" :class="getStatusClass(order.status)">
                <text class="status-text">{{ getStatusText(order.status) }}</text>
              </view>
            </view>
            <view class="order-amount">
              <text class="amount-label">总金额</text>
              <text class="amount-value">¥{{ order.totalCost || order.total_fee || order.amount || 0 }}</text>
            </view>
          </view>

          <!-- 订单内容 -->
          <view class="order-content">
            <view class="order-row">
              <text class="row-label">法会项目：</text>
              <text class="row-value">{{ getProjectName(order) }}</text>
            </view>
            <view class="order-row">
              <text class="row-label">报名人数：</text>
              <text class="row-value">{{ getApplicantCount(order) }}人</text>
            </view>
            <view class="order-row">
              <text class="row-label">创建时间：</text>
              <text class="row-value">{{ formatDate(order.createTime || order.create_time) }}</text>
            </view>
            <view v-if="getMainContact(order)" class="order-row">
              <text class="row-label">主要联系人：</text>
              <text class="row-value">{{ getMainContact(order) }}</text>
            </view>
          </view>

          <!-- 订单操作 -->
          <view class="order-actions">
            <button class="action-btn detail-btn" @click.stop="viewOrderDetail(order)">
              <text class="btn-icon">👁️</text>
              <text class="btn-text">查看详情</text>
            </button>
            <button 
              v-if="order.status === '待确认'" 
              class="action-btn confirm-btn" 
              @click.stop="confirmPayment(order)"
            >
              <text class="btn-icon">✅</text>
              <text class="btn-text">确认此合坛法会</text>
            </button>
            <button 
              v-if="order.status === '待确认'" 
              class="action-btn process-btn" 
              @click.stop="processOrder(order)"
            >
              <text class="btn-icon">⚡</text>
              <text class="btn-text">开始处理</text>
            </button>
            <button class="action-btn edit-btn" @click.stop="editOrder(order)">
              <text class="btn-icon">✏️</text>
              <text class="btn-text">编辑</text>
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view v-if="hasMore" class="load-more">
      <button class="load-more-btn" @click="loadMoreOrders" :disabled="isLoading">
        <text v-if="isLoading" class="loading-text">加载中...</text>
        <text v-else class="load-text">加载更多订单</text>
      </button>
    </view>

    <!-- 浮动操作按钮 -->
    <view class="fab-container">
      <button class="fab-btn refresh-btn" @click="refreshOrders">
        <text class="fab-icon">🔄</text>
      </button>
      <button class="fab-btn export-btn" @click="exportOrders">
        <text class="fab-icon">📊</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      isLoading: false,
      hasMore: false,
      searchKeyword: '',
      typeFilterIndex: 0,
      statusFilterIndex: 0,
      dateFilterIndex: 0,
      typeOptions: [
        { label: '全部法会', value: '' },
        { label: '合坛法会', value: 'joint' },
        { label: '专场法会', value: 'special' }
      ],
      statusOptions: [
        { label: '全部状态', value: '' },
        { label: '待支付', value: '待支付' },
        { label: '待确认', value: '待确认' },
        { label: '处理中', value: '处理中' },
        { label: '已完成', value: '已完成' },
        { label: '已取消', value: '已取消' }
      ],
      dateOptions: [
        { label: '全部时间', value: '' },
        { label: '今天', value: 'today' },
        { label: '最近7天', value: '7days' },
        { label: '最近30天', value: '30days' },
        { label: '本月', value: 'month' }
      ]
    }
  },

  computed: {
    filteredOrders() {
      let filtered = this.orders

      // 类型筛选
      if (this.typeOptions[this.typeFilterIndex].value) {
        filtered = filtered.filter(order => {
          const orderType = order.fahuiType || order.type || 'joint'
          return orderType === this.typeOptions[this.typeFilterIndex].value
        })
      }

      // 状态筛选
      if (this.statusOptions[this.statusFilterIndex].value) {
        filtered = filtered.filter(order => 
          order.status === this.statusOptions[this.statusFilterIndex].value
        )
      }

      // 日期筛选
      if (this.dateOptions[this.dateFilterIndex].value) {
        const now = new Date()
        const filterValue = this.dateOptions[this.dateFilterIndex].value
        
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createTime || order.create_time)
          
          switch (filterValue) {
            case 'today':
              return orderDate.toDateString() === now.toDateString()
            case '7days':
              const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              return orderDate >= sevenDaysAgo
            case '30days':
              const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
              return orderDate >= thirtyDaysAgo
            case 'month':
              return orderDate.getMonth() === now.getMonth() && 
                     orderDate.getFullYear() === now.getFullYear()
            default:
              return true
          }
        })
      }

      // 关键词搜索
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(order => 
          (order.orderNo || order.order_id || order.orderNumber || '').toLowerCase().includes(keyword) ||
          (this.getProjectName(order) || '').toLowerCase().includes(keyword) ||
          (this.getMainContact(order) || '').toLowerCase().includes(keyword)
        )
      }

      return filtered
    },

    pendingOrders() {
      return this.orders.filter(order => 
        ['待支付', '待确认', '处理中'].includes(order.status)
      )
    },

    completedOrders() {
      return this.orders.filter(order => order.status === '已完成')
    }
  },

  onLoad() {
    this.loadOrders()
  },

  onShow() {
    this.refreshOrders()
  },

  methods: {
    async loadOrders() {
      if (this.isLoading) return
      
      this.isLoading = true
      try {
        // 加载合坛法会订单
        const jointManagement = uniCloud.importObject('joint-management')
        const jointResult = await jointManagement.getOrders()
        
        // 加载专场法会订单
        const fahuiManagement = uniCloud.importObject('fahui-management')
        const fahuiResult = await fahuiManagement.getOrders()
        
        let allOrders = []
        
        // 处理合坛法会订单
        if (jointResult.success && jointResult.data) {
          const jointOrders = jointResult.data.map(order => ({
            ...order,
            type: 'joint',
            fahuiType: 'joint'
          }))
          allOrders = allOrders.concat(jointOrders)
        }
        
        // 处理专场法会订单
        if (fahuiResult.success && fahuiResult.data) {
          const fahuiOrders = fahuiResult.data.map(order => ({
            ...order,
            type: 'special',
            fahuiType: 'special'
          }))
          allOrders = allOrders.concat(fahuiOrders)
        }
        
        // 按创建时间排序
        this.orders = allOrders.sort((a, b) => {
          const timeA = new Date(a.createTime || a.create_time || 0)
          const timeB = new Date(b.createTime || b.create_time || 0)
          return timeB - timeA
        })
        
        this.hasMore = false // 暂时不实现分页
      } catch (error) {
        console.error('加载订单失败:', error)
        uni.showToast({
          title: '加载订单失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },

    async refreshOrders() {
      await this.loadOrders()
      uni.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    },

    async loadMoreOrders() {
      // 暂时不实现分页加载
      this.hasMore = false
    },

    onTypeFilterChange(e) {
      this.typeFilterIndex = e.detail.value
    },

    onStatusFilterChange(e) {
      this.statusFilterIndex = e.detail.value
    },

    onDateFilterChange(e) {
      this.dateFilterIndex = e.detail.value
    },

    onSearchInput() {
      // 实时搜索，不需要额外处理
    },

    getTypeClass(type) {
      const typeMap = {
        'joint': 'type-joint',
        'special': 'type-special'
      }
      return typeMap[type] || 'type-default'
    },

    getTypeText(type) {
      const typeMap = {
        'joint': '合坛',
        'special': '专场'
      }
      return typeMap[type] || '未知'
    },

    getStatusClass(status) {
      const statusMap = {
        '待支付': 'status-pending',
        '待确认': 'status-waiting',
        '处理中': 'status-processing',
        '已完成': 'status-completed',
        '已取消': 'status-cancelled'
      }
      return statusMap[status] || 'status-default'
    },

    getStatusText(status) {
      return status || '未知状态'
    },

    getProjectName(order) {
      // 合坛法会项目名称
      if (order.projectName || order.project_name) {
        return order.projectName || order.project_name
      }
      // 专场法会项目名称
      if (order.fahuiProject && order.fahuiProject.name) {
        return order.fahuiProject.name
      }
      if (order.fahuiName) {
        return order.fahuiName
      }
      return '未指定'
    },

    getApplicantCount(order) {
      // 合坛法会报名人数
      if (order.applicant_count !== undefined) {
        return order.applicant_count
      }
      if (order.applicants && Array.isArray(order.applicants)) {
        return order.applicants.length
      }
      return 0
    },

    getMainContact(order) {
      // 合坛法会联系人
      if (order.applicants && order.applicants.length > 0) {
        const applicant = order.applicants[0]
        return `${applicant.name} (${applicant.phone})`
      }
      // 专场法会联系人
      if (order.participantName && order.phone) {
        return `${order.participantName} (${order.phone})`
      }
      return null
    },

    formatDate(date) {
      if (!date) return '未知时间'
      
      const d = new Date(date)
      const now = new Date()
      const diff = now - d
      const oneDay = 24 * 60 * 60 * 1000
      
      if (diff < oneDay) {
        return d.toLocaleTimeString('zh-CN', { hour12: false })
      } else if (diff < 7 * oneDay) {
        return `${Math.floor(diff / oneDay)}天前`
      } else {
        return d.toLocaleDateString('zh-CN')
      }
    },

    viewOrderDetail(order) {
      console.log('🔍 查看订单详情，订单数据:', order)
      console.log('🔍 订单ID字段:', {
        _id: order._id,
        order_id: order.order_id,
        orderNo: order.orderNo,
        orderNumber: order.orderNumber
      })
      
      const orderType = order.fahuiType || order.type || 'joint'
      const orderId = order._id || order.order_id || order.orderNo || order.orderNumber
      
      console.log('🔍 订单类型:', orderType)
      console.log('🔍 使用的订单ID:', orderId)
      
      if (orderType === 'joint') {
        const url = `/pages/admin/joint/orderDetail?id=${orderId}`
        console.log('🔍 跳转URL:', url)
        uni.navigateTo({
          url: url,
          success: () => {
            console.log('✅ 跳转到订单详情页面成功')
          },
          fail: (err) => {
            console.error('❌ 跳转到订单详情页面失败:', err)
            uni.showToast({
              title: '跳转失败',
              icon: 'none'
            })
          }
        })
              } else {
          const url = `/pages/admin/fahui/orderDetail?id=${orderId}`
          console.log('🔍 跳转URL:', url)
          
          // 先尝试直接跳转
          uni.navigateTo({
            url: url,
            success: () => {
              console.log('✅ 跳转到专场法会订单详情页面成功')
            },
            fail: (err) => {
              console.error('❌ 跳转到专场法会订单详情页面失败:', err)
              
              // 如果直接跳转失败，尝试先跳转到存在的页面再跳转
              console.log('🔄 尝试备用跳转方案...')
              uni.navigateTo({
                url: '/pages/admin/fahui/orders',
                success: () => {
                  setTimeout(() => {
                    uni.navigateTo({
                      url: url,
                      success: () => {
                        console.log('✅ 备用方案跳转成功')
                      },
                      fail: (err2) => {
                        console.error('❌ 备用方案也失败:', err2)
                        uni.showToast({
                          title: '页面跳转失败，请刷新页面重试',
                          icon: 'none'
                        })
                      }
                    })
                  }, 100)
                },
                fail: (err3) => {
                  console.error('❌ 备用页面跳转也失败:', err3)
                  uni.showToast({
                    title: '跳转失败',
                    icon: 'none'
                  })
                }
              })
            }
          })
        }
    },

    async confirmPayment(order) {
      try {
        const orderType = order.fahuiType || order.type || 'joint'
        const management = uniCloud.importObject(orderType === 'joint' ? 'joint-management' : 'fahui-management')
        
        const result = await management.updateOrderStatus({
          orderId: order._id || order.order_id || order.orderNo || order.orderNumber,
          status: '已确认',
          operator: '管理员确认'
        })
        
        if (result.success) {
          uni.showToast({
            title: '支付确认成功',
            icon: 'success'
          })
          this.refreshOrders()
        } else {
          uni.showToast({
            title: result.message || '确认失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('确认支付失败:', error)
        uni.showToast({
          title: '确认失败',
          icon: 'none'
        })
      }
    },

    async processOrder(order) {
      try {
        const orderType = order.fahuiType || order.type || 'joint'
        const management = uniCloud.importObject(orderType === 'joint' ? 'joint-management' : 'fahui-management')
        
        const result = await management.updateOrderStatus({
          orderId: order._id || order.order_id || order.orderNo || order.orderNumber,
          status: '处理中',
          operator: '管理员处理'
        })
        
        if (result.success) {
          uni.showToast({
            title: '开始处理订单',
            icon: 'success'
          })
          this.refreshOrders()
        } else {
          uni.showToast({
            title: result.message || '操作失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('处理订单失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    editOrder(order) {
      console.log('✏️ 编辑订单，订单数据:', order)
      console.log('✏️ 订单ID字段:', {
        _id: order._id,
        order_id: order.order_id,
        orderNo: order.orderNo,
        orderNumber: order.orderNumber
      })
      
      const orderType = order.fahuiType || order.type || 'joint'
      const orderId = order._id || order.order_id || order.orderNo || order.orderNumber
      
      console.log('✏️ 订单类型:', orderType)
      console.log('✏️ 使用的订单ID:', orderId)
      
      if (orderType === 'joint') {
        const url = `/pages/admin/joint/editOrder?id=${orderId}`
        console.log('✏️ 跳转URL:', url)
        uni.navigateTo({
          url: url,
          success: () => {
            console.log('✅ 跳转到编辑订单页面成功')
          },
          fail: (err) => {
            console.error('❌ 跳转到编辑订单页面失败:', err)
            uni.showToast({
              title: '跳转失败',
              icon: 'none'
            })
          }
        })
      } else {
        const url = `/pages/admin/fahui/editOrder?id=${orderId}`
        console.log('✏️ 跳转URL:', url)
        
        // 先尝试直接跳转
        uni.navigateTo({
          url: url,
          success: () => {
            console.log('✅ 跳转到专场法会编辑订单页面成功')
          },
          fail: (err) => {
            console.error('❌ 跳转到专场法会编辑订单页面失败:', err)
            
            // 如果直接跳转失败，尝试先跳转到存在的页面再跳转
            console.log('🔄 尝试备用跳转方案...')
            uni.navigateTo({
              url: '/pages/admin/fahui/orders',
              success: () => {
                setTimeout(() => {
                  uni.navigateTo({
                    url: url,
                    success: () => {
                      console.log('✅ 备用方案跳转成功')
                    },
                    fail: (err2) => {
                      console.error('❌ 备用方案也失败:', err2)
                      uni.showToast({
                        title: '页面跳转失败，请刷新页面重试',
                        icon: 'none'
                      })
                    }
                  })
                }, 100)
              },
              fail: (err3) => {
                console.error('❌ 备用页面跳转也失败:', err3)
                uni.showToast({
                  title: '跳转失败',
                  icon: 'none'
                })
              }
            })
          }
        })
      }
    },

    async exportOrders() {
      try {
        uni.showLoading({ title: '准备导出数据...' })
        
        const orderType = this.typeOptions[this.typeFilterIndex].value
        const management = uniCloud.importObject(orderType === 'joint' ? 'joint-management' : 'fahui-management')
        
        const result = await management.exportOrders({
          status: this.statusOptions[this.statusFilterIndex].value,
          dateFilter: this.dateOptions[this.dateFilterIndex].value
        })
        
        if (result.success && result.data) {
          uni.hideLoading()
          
          // 生成Excel文件
          await this.generateAndDownloadExcel(result.data, orderType)
          
          uni.showToast({
            title: `成功导出 ${result.totalCount || result.data.length} 条订单`,
            icon: 'success',
            duration: 3000
          })
        } else {
          uni.hideLoading()
          uni.showToast({
            title: result.message || '导出失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error('导出订单失败:', error)
        uni.showToast({
          title: '导出失败',
          icon: 'none'
        })
      }
    },

    async generateAndDownloadExcel(data, orderType) {
      try {
        // 生成CSV内容（Excel可以打开CSV文件）
        const csvContent = this.generateCSV(data)
        
        // 生成文件名
        const now = new Date()
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
        const fileName = `${orderType === 'joint' ? '合坛法会' : '专场法会'}订单_${dateStr}_${timeStr}.csv`
        
        // 创建Blob对象
        const blob = new Blob(['\ufeff' + csvContent], { 
          type: 'text/csv;charset=utf-8;' 
        })
        
        // 创建下载链接
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        
        // 添加到页面并触发下载
        document.body.appendChild(link)
        link.click()
        
        // 清理
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        console.log('Excel文件下载成功:', fileName)
      } catch (error) {
        console.error('生成Excel文件失败:', error)
        throw error
      }
    },

    generateCSV(data) {
      if (!data || data.length === 0) {
        return '暂无数据'
      }
      
      // 获取表头
      const headers = Object.keys(data[0])
      
      // 生成CSV内容
      const csvRows = []
      
      // 添加表头
      csvRows.push(headers.join(','))
      
      // 添加数据行
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header]
          // 如果值包含逗号、引号或换行符，需要用引号包围
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        })
        csvRows.push(values.join(','))
      }
      
      return csvRows.join('\n')
    }
  }
}
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 24rpx 32rpx 24rpx;
  color: white;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200rpx;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
}

.title-icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
}

.header-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.9;
}

/* 筛选工具栏 */
.filter-toolbar {
  background: white;
  padding: 24rpx;
  margin: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 180rpx;
}

.filter-item {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
}

.filter-icon {
  font-size: 24rpx;
  margin-right: 12rpx;
}

.filter-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.filter-arrow {
  font-size: 20rpx;
  color: #666;
}

.search-box {
  flex: 2;
  min-width: 280rpx;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24rpx;
  color: #666;
}

.search-input {
  width: 100%;
  padding: 16rpx 20rpx 16rpx 60rpx;
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
}

/* 订单列表 */
.orders-container {
  padding: 0 24rpx 24rpx 24rpx;
}

.empty-state {
  text-align: center;
  padding: 120rpx 40rpx;
  background: white;
  border-radius: 16rpx;
  margin-top: 24rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}

.empty-title {
  display: block;
  font-size: 32rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.order-card {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.order-info {
  flex: 1;
}

.order-top {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.order-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.order-type-badge {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: bold;
}

.type-joint {
  background: #e3f2fd;
  color: #1976d2;
}

.type-special {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-default {
  background: #e2e3e5;
  color: #383d41;
}

.order-status {
  display: inline-block;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-waiting {
  background: #d1ecf1;
  color: #0c5460;
}

.status-processing {
  background: #d4edda;
  color: #155724;
}

.status-completed {
  background: #c3e6cb;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-default {
  background: #e2e3e5;
  color: #383d41;
}

.order-amount {
  text-align: right;
}

.amount-label {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.amount-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff6b35;
}

.order-content {
  margin-bottom: 24rpx;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f8f9fa;
}

.order-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 28rpx;
  color: #666;
  min-width: 160rpx;
}

.row-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  text-align: right;
}

.order-actions {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  border: none;
  transition: all 0.3s ease;
}

.detail-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.detail-btn:hover {
  background: #bbdefb;
}

.confirm-btn {
  background: #e8f5e8;
  color: #2e7d32;
}

.confirm-btn:hover {
  background: #c8e6c9;
}

.process-btn {
  background: #fff3e0;
  color: #f57c00;
}

.process-btn:hover {
  background: #ffe0b2;
}

.edit-btn {
  background: #f3e5f5;
  color: #7b1fa2;
}

.edit-btn:hover {
  background: #e1bee7;
}

.btn-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.btn-text {
  font-weight: 500;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 32rpx 24rpx;
}

.load-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);
}

.load-more-btn:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.loading-text, .load-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 浮动操作按钮 */
.fab-container {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  z-index: 1000;
}

.fab-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.refresh-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.export-btn {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
}

.fab-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.3);
}

.fab-icon {
  font-size: 32rpx;
}

/* 响应式设计 */
@media (max-width: 768rpx) {
  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16rpx;
  }
  
  .order-amount {
    text-align: left;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .action-btn {
    min-width: auto;
  }
}
</style> 