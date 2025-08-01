<template>
  <view class="confirm-page">
    <!-- 调试区域 - 放在最顶部 -->
    <view style="background: #ff4757; padding: 30rpx; margin: 20rpx; border-radius: 15rpx; text-align: center; border: 3rpx solid #fff;">
      <text style="color: white; font-size: 36rpx; font-weight: bold; display: block; margin-bottom: 20rpx;">🔧 调试工具</text>
      <view style="display: flex; justify-content: center; gap: 20rpx; flex-wrap: wrap;">
        <button @click="showDebugInfo" style="background: #2ed573; color: white; padding: 25rpx 40rpx; border-radius: 10rpx; font-size: 30rpx; border: none; min-width: 200rpx;">
          📊 显示调试信息
        </button>
        <button @click="refreshData" style="background: #ffa502; color: white; padding: 25rpx 40rpx; border-radius: 10rpx; font-size: 30rpx; border: none; min-width: 200rpx;">
          🔄 强制刷新数据
        </button>
        <button @click="testOrderCreation" style="background: #00d2d3; color: white; padding: 25rpx 40rpx; border-radius: 10rpx; font-size: 30rpx; border: none; min-width: 200rpx;">
          🧪 测试订单创建
        </button>
      </view>
    </view>
    
    <!-- 简单调试按钮 - 备用 -->
    <view style="background: #ff0000; padding: 20rpx; margin: 20rpx; text-align: center;">
      <button @click="showDebugInfo" style="background: #00ff00; color: #000; padding: 20rpx; font-size: 32rpx; border: none;">
        调试按钮
      </button>
    </view>
    
    <view class="confirm-header">
      <view class="header-title">报名确认</view>
      <view class="header-subtitle">请仔细核对以下信息</view>
    </view>

    <!-- 法会项目信息 -->
    <view class="section">
      <view class="section-title">法会项目信息</view>
      <view class="info-card">
        <view class="info-row">
          <text class="info-label">法会项目：</text>
          <text class="info-value">{{ orderData.projectName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">法会日期：</text>
          <text class="info-value">{{ orderData.selectedDate || '待确认' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">报名人数：</text>
          <text class="info-value">{{ orderData.applicantCount }}人</text>
        </view>
        <view v-if="orderData.chaoduType" class="info-row">
          <text class="info-label">超度类型：</text>
          <text class="info-value">{{ orderData.chaoduType }}</text>
        </view>
      </view>
    </view>

    <!-- 报名人信息 -->
    <view class="section">
      <view class="section-title">报名人信息</view>
      <view class="applicant-list">
        <view v-for="(applicant, index) in orderData.applicants" :key="'applicant-' + index" class="applicant-card">
          <view class="applicant-header">
            <text class="applicant-name">{{ applicant.name }}</text>
            <text class="applicant-number">第{{ index + 1 }}位</text>
          </view>
          <view class="applicant-info">
            <text class="info-item">性别：{{ applicant.gender }}</text>
            <text class="info-item">电话：{{ applicant.phone }}</text>
            <text class="info-item">农历生日：{{ applicant.lunarBirthday }}</text>
            <text class="info-item">出生时辰：{{ applicant.birthTime }}</text>
            <text class="info-item">常住地址：{{ applicant.address }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 配偶信息（姻缘和合法会） -->
    <view v-if="orderData.spouse && orderData.spouse.name" class="section">
      <view class="section-title">配偶信息</view>
      <view class="spouse-card">
        <view class="spouse-info">
          <view class="info-row">
            <text class="info-label">姓名：</text>
            <text class="info-value">{{ orderData.spouse.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">性别：</text>
            <text class="info-value">{{ orderData.spouse.gender }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">农历生日：</text>
            <text class="info-value">{{ orderData.spouse.lunarBirthday || '未填写' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">出生时辰：</text>
            <text class="info-value">{{ orderData.spouse.birthTime || '未填写' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 已故亲人信息（超度法会） -->
    <view v-if="orderData.deceasedList && orderData.deceasedList.length > 0" class="section">
      <view class="section-title">已故亲人信息</view>
      <view class="deceased-list">
        <view v-for="(deceased, index) in orderData.deceasedList" :key="'deceased-' + index" class="deceased-card">
          <view class="deceased-header">
            <text class="deceased-name">{{ deceased.name }}</text>
            <text class="deceased-number">第{{ index + 1 }}位</text>
          </view>
          <view class="deceased-info">
            <text class="info-item">关系：{{ deceased.relation }}</text>
            <text v-if="deceased.lunarBirthday" class="info-item">出生农历：{{ deceased.lunarBirthday }}</text>
            <text v-if="deceased.deathDate" class="info-item">去世农历：{{ deceased.deathDate }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 代办物品 -->
    <view v-if="orderData.selectedItems && orderData.selectedItems.length > 0" class="section">
      <view class="section-title">代办物品</view>
      <view class="goods-list">
        <view v-for="(item, index) in orderData.selectedItems" :key="'goods-' + index" class="goods-item">
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-price">¥{{ item.price }}/件</text>
          </view>
          <view class="goods-count">
            <text class="count-label">数量：</text>
            <text class="count-value">{{ item.count }}件</text>
          </view>
          <view class="goods-total">
            <text class="total-label">小计：</text>
            <text class="total-value">¥{{ item.price * item.count }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 收件信息 -->
    <view v-if="orderData.receiver && orderData.receiver.name" class="section">
      <view class="section-title">收件信息</view>
      <view class="receiver-card">
        <view class="info-row">
          <text class="info-label">收件人：</text>
          <text class="info-value">{{ orderData.receiver.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">联系电话：</text>
          <text class="info-value">{{ orderData.receiver.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">收件地址：</text>
          <text class="info-value">{{ orderData.receiver.address }}</text>
        </view>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="section">
      <view class="section-title">费用明细</view>
      <view class="fee-card">
        <view class="fee-row">
          <text class="fee-label">活动费用：</text>
          <text class="fee-value">¥{{ orderData.activityFee }}</text>
        </view>
        <view v-if="orderData.goodsFee > 0" class="fee-row">
          <text class="fee-label">代办费用：</text>
          <text class="fee-value">¥{{ orderData.goodsFee }}</text>
        </view>
        <view class="fee-divider"></view>
        <view class="fee-row total">
          <text class="fee-label">总计：</text>
          <text class="fee-value total-value">¥{{ orderData.totalFee }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="btn-secondary" @click="goBack">返回修改</button>
      <button class="btn-primary" @click="confirmOrder" :disabled="isSubmitting">
        <view v-if="isSubmitting" class="btn-loading">
          <view class="btn-spinner"></view>
          <text>提交中...</text>
        </view>
        <text v-else>确认报名</text>
      </button>
    </view>
    
    <!-- 调试按钮 -->
    <view class="debug-section" style="padding: 20rpx; background: #f0f0f0; margin: 20rpx; border-radius: 10rpx;">
      <text style="display: block; font-size: 24rpx; color: #666; margin-bottom: 10rpx;">调试工具：</text>
      <button class="debug-btn" @click="refreshData" style="background: #ff6b6b; color: white; margin: 10rpx; padding: 15rpx 30rpx; border-radius: 8rpx; font-size: 28rpx;">
        强制刷新数据
      </button>
      <button class="debug-btn" @click="showDebugInfo" style="background: #4ecdc4; color: white; margin: 10rpx; padding: 15rpx 30rpx; border-radius: 8rpx; font-size: 28rpx;">
        显示调试信息
      </button>
    </view>
  </view>
</template>

<script>
import jointDataManager from '@/utils/jointDataManager.js'

// 导入云对象
const jointManagement = uniCloud.importObject('joint-management')

export default {
  data() {
    return {
      orderData: {},
      isSubmitting: false
    }
  },
  
  onLoad() {
    console.log('🔄 合坛法会确认页面加载开始')
    console.log('🔄 页面参数:', getCurrentPages()[getCurrentPages().length - 1].options)
    this.loadOrderData()
    console.log('🔄 合坛法会确认页面加载完成')
  },
  
  onShow() {
    // 每次显示页面时重新加载数据，确保数据是最新的
    console.log('🔄 合坛法会确认页面显示，重新加载数据')
    
    // 强制清除可能的缓存
    this.orderData = {}
    
    // 立即加载数据
    this.loadOrderData()
    
    // 添加延迟刷新，确保数据更新
    setTimeout(() => {
      this.loadOrderData()
    }, 100)
    
    // 再次延迟刷新，确保数据完全更新
    setTimeout(() => {
      this.loadOrderData()
    }, 500)
  },
  
  methods: {
    loadOrderData() {
      try {
        console.log('📋 开始加载合坛法会订单数据...')
        
        // 使用数据管理器获取最新数据
        let orderData = jointDataManager.getOrderData()
        console.log('📋 从数据管理器获取的订单数据:', orderData)
        
        // 如果没有订单数据，尝试从草稿获取
        if (!orderData) {
          const draft = jointDataManager.getDraftData()
          if (draft) {
            console.log('📋 从草稿获取数据:', draft)
            // 将草稿数据转换为订单格式
            orderData = this.convertDraftToOrder(draft)
          }
        }
        
        if (orderData) {
          // 验证数据完整性
          if (!jointDataManager.validateOrderData(orderData)) {
            console.log('❌ 订单数据验证失败，尝试从草稿恢复')
            const draft = jointDataManager.getDraftData()
            if (draft) {
              orderData = this.convertDraftToOrder(draft)
            } else {
              throw new Error('订单数据不完整且无草稿数据')
            }
          }
          
          // 清理和标准化数据
          this.orderData = jointDataManager.cleanOrderData(orderData)
          
          console.log('📋 订单数据加载成功，当前orderData:', this.orderData)
          console.log('📋 订单详情:')
          console.log('  - 项目名称:', this.orderData.projectName)
          console.log('  - 报名人数:', this.orderData.applicantCount)
          console.log('  - 活动费用:', this.orderData.activityFee)
          console.log('  - 代办费用:', this.orderData.goodsFee)
          console.log('  - 总费用:', this.orderData.totalFee)
          console.log('  - 报名人数量:', this.orderData.applicants ? this.orderData.applicants.length : 0)
          console.log('  - 代办物品数量:', this.orderData.selectedItems ? this.orderData.selectedItems.length : 0)
          console.log('  - 收件信息:', this.orderData.receiver)
          console.log('  - 创建时间:', this.orderData.createTime ? new Date(this.orderData.createTime).toLocaleString() : '无')
          
          // 详细输出报名人信息
          if (this.orderData.applicants && this.orderData.applicants.length > 0) {
            console.log('📋 报名人详细信息:')
            this.orderData.applicants.forEach((applicant, index) => {
              console.log(`  - 第${index + 1}位: ${applicant.name}, ${applicant.gender}, ${applicant.phone}`)
            })
          }
          
          // 详细输出代办物品信息
          if (this.orderData.selectedItems && this.orderData.selectedItems.length > 0) {
            console.log('📋 代办物品详细信息:')
            this.orderData.selectedItems.forEach((item, index) => {
              console.log(`  - 第${index + 1}件: ${item.name}, ¥${item.price}, ${item.count}件`)
            })
          }
          
          // 重新保存到本地存储，确保数据是最新的
          jointDataManager.saveOrderData(this.orderData)
          
          // 强制更新视图
          this.$forceUpdate()
        } else {
          console.log('❌ 订单数据不存在')
          uni.showToast({
            title: '订单数据不存在，请重新填写',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: 2 // 返回到表单页面
            })
          }, 1500)
        }
      } catch (error) {
        console.error('❌ 加载订单数据失败:', error)
        uni.showToast({
          title: '加载订单数据失败',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    },
    
    // 将草稿数据转换为订单格式
    convertDraftToOrder(draft) {
      // 这里需要根据实际的草稿数据结构来转换
      // 由于草稿数据可能不完整，需要重新计算费用等
      return {
        projectName: '合坛法会', // 默认值
        applicantCount: draft.applicants ? draft.applicants.length : 0,
        applicants: draft.applicants || [],
        selectedItems: draft.items || [],
        receiver: draft.receiver || null,
        activityFee: 0, // 需要重新计算
        goodsFee: 0, // 需要重新计算
        totalFee: 0, // 需要重新计算
        spouse: draft.spouse || null,
        deceasedList: draft.deceasedList || [],
        chaoduType: draft.chaoduType || ''
      }
    },
    
    goBack() {
      console.log('⬅️ 用户点击返回修改按钮')
      uni.navigateBack()
    },
    
    // 强制刷新数据
    refreshData() {
      console.log('🔄 强制刷新数据...')
      this.loadOrderData()
      uni.showToast({
        title: '数据已刷新',
        icon: 'success'
      })
    },
    
    // 显示调试信息
    showDebugInfo() {
      const debugInfo = jointDataManager.getDebugInfo()
      
      console.log('🔍 调试信息:', debugInfo)
      
      uni.showModal({
        title: '调试信息',
        content: `订单数据: ${debugInfo.orderData ? '存在' : '不存在'}\n草稿数据: ${debugInfo.draftData ? '存在' : '不存在'}\n当前数据: ${this.orderData ? '已加载' : '未加载'}`,
        showCancel: false
      })
    },

    // 测试订单创建
    async testOrderCreation() {
      console.log('🧪 开始测试订单创建...')
      this.isSubmitting = true
      try {
        const orderData = {
          projectName: '合坛法会',
          applicantCount: 1,
          applicants: [{
            name: '测试用户',
            gender: '男',
            phone: '13800138000',
            lunarBirthday: '2000-01-01',
            birthTime: '08:00',
            address: '测试地址'
          }],
          selectedItems: [{
            name: '代办物品A',
            price: 100,
            count: 1
          }],
          receiver: {
            name: '收件人',
            phone: '13900139000',
            address: '测试收件地址'
          },
          activityFee: 1000,
          goodsFee: 500,
          totalFee: 1500,
          spouse: null,
          deceasedList: [],
          chaoduType: '',
          fahuiType: 'joint',
          status: '待支付',
          createTime: new Date().getTime()
        }

        console.log('🔍 调试信息 - 测试订单数据:', orderData)

        // 验证关键数据
        if (!orderData.projectName) {
          throw new Error('项目名称不能为空')
        }
        if (!orderData.applicants || orderData.applicants.length === 0) {
          throw new Error('报名人信息不能为空')
        }
        if (!orderData.totalFee || orderData.totalFee <= 0) {
          throw new Error('总费用必须大于0')
        }

        console.log('🚀 开始调用云对象创建订单...')
        console.log('🔍 调试信息 - 云对象调用参数:', { orderData: orderData })
        
        // 创建订单 - 使用云对象
        let result
        try {
          console.log('📞 调用 jointManagement.createOrder...')
          result = await jointManagement.createOrder({
            orderData: orderData
          })
          console.log('✅ 云对象调用成功')
          console.log('📊 云对象返回结果类型:', typeof result)
          console.log('📊 云对象返回结果:', result)
        } catch (error) {
          console.error('❌ 云对象调用失败:', error)
          console.error('❌ 错误详情:', error.message)
          console.error('❌ 错误堆栈:', error.stack)
          throw error
        }
        
        // 处理云对象返回结果
        const orderResult = result
        console.log('🚀 云对象返回结果:', result)
        
        if (orderResult.success && orderResult.orderId) {
          console.log('✅ 订单创建成功')
          // 保存订单ID
          const orderId = orderResult.orderId
          console.log('📋 订单ID:', orderId)
          uni.setStorageSync('joint_fahui_order_id', orderId)
          
          // 保存确认数据到本地存储，供支付页面使用
          const confirmData = {
            ...orderData,
            orderId: orderId,
            confirmTime: new Date().getTime()
          }
          console.log('💾 保存确认数据到本地存储:', confirmData)
          uni.setStorageSync('joint_fahui_confirm', confirmData)
          
          console.log('🔄 准备跳转到支付页面...')
          // 跳转到支付页面
          uni.navigateTo({
            url: '/pages/fahui/joint/pay',
            success: () => {
              console.log('✅ 跳转到合坛法会支付页成功')
            },
            fail: (err) => {
              console.error('❌ 跳转到支付页面失败:', err)
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              })
            }
          })
        } else {
          console.error('❌ 订单创建失败:', orderResult.message)
          throw new Error(orderResult.message || '创建订单失败')
        }
        
      } catch (error) {
        console.error('❌ 测试订单创建失败:', error)
        uni.showToast({
          title: error.message || '测试订单创建失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
        console.log('🏁 测试订单创建流程结束')
      }
    },
    
    async confirmOrder() {
      console.log('✅ 用户点击确认报名按钮')
      console.log('🔍 调试信息 - 当前页面数据:')
      console.log('  - orderData:', this.orderData)
      console.log('  - 页面路径:', '/pages/fahui/joint/confirm')
      console.log('  - 云对象导入状态:', typeof jointManagement)
      
      this.isSubmitting = true
      
      try {
        console.log('📝 开始准备订单数据...')
        console.log('🔍 调试信息 - 原始orderData:', this.orderData)
        
        // 准备订单数据
        const orderData = {
          ...this.orderData,
          fahuiType: 'joint', // 添加法会类型字段
          status: '待支付',
          // 保持原有的创建时间，不要覆盖
          createTime: this.orderData.createTime || new Date().getTime(),
          // 确保字段名称统一
          projectName: this.orderData.projectName || this.orderData.project_name,
          totalFee: this.orderData.totalFee || this.orderData.total_fee,
          activityFee: this.orderData.activityFee || this.orderData.activity_fee,
          goodsFee: this.orderData.goodsFee || this.orderData.goods_fee,
          // 确保代办物品字段统一
          selectedItems: this.orderData.selectedItems || this.orderData.goods || []
        }
        
        console.log('🔍 调试信息 - 处理后的orderData:', orderData)
        
        console.log('📝 准备发送的订单数据:', orderData)
        console.log('📝 订单数据详情:')
        console.log('  - 法会类型:', orderData.fahuiType)
        console.log('  - 项目名称:', orderData.projectName)
        console.log('  - 总费用:', orderData.totalFee)
        console.log('  - 活动费用:', orderData.activityFee)
        console.log('  - 代办费用:', orderData.goodsFee)
        console.log('  - 代办物品数量:', orderData.goods ? orderData.goods.length : 0)
        console.log('  - 报名人数量:', orderData.applicants ? orderData.applicants.length : 0)
        console.log('  - 报名人详情:', orderData.applicants)
        
        // 验证关键数据
        if (!orderData.projectName) {
          throw new Error('项目名称不能为空')
        }
        if (!orderData.applicants || orderData.applicants.length === 0) {
          throw new Error('报名人信息不能为空')
        }
        if (!orderData.totalFee || orderData.totalFee <= 0) {
          throw new Error('总费用必须大于0')
        }
        
        console.log('🚀 开始调用云对象创建订单...')
        console.log('🔍 调试信息 - 云对象调用参数:', { orderData: orderData })
        
        // 创建订单 - 使用云对象
        let result
        try {
          console.log('📞 调用 jointManagement.createOrder...')
          result = await jointManagement.createOrder({
            orderData: orderData
          })
          console.log('✅ 云对象调用成功')
          console.log('📊 云对象返回结果类型:', typeof result)
          console.log('📊 云对象返回结果:', result)
        } catch (error) {
          console.error('❌ 云对象调用失败:', error)
          console.error('❌ 错误详情:', error.message)
          console.error('❌ 错误堆栈:', error.stack)
          throw error
        }
        
        // 处理云对象返回结果
        const orderResult = result
        console.log('🚀 云对象返回结果:', result)
        
        if (orderResult.success && orderResult.orderId) {
          console.log('✅ 订单创建成功')
          // 保存订单ID
          const orderId = orderResult.orderId
          console.log('📋 订单ID:', orderId)
          uni.setStorageSync('joint_fahui_order_id', orderId)
          
          // 保存确认数据到本地存储，供支付页面使用
          const confirmData = {
            ...orderData,
            orderId: orderId,
            confirmTime: new Date().getTime()
          }
          console.log('💾 保存确认数据到本地存储:', confirmData)
          uni.setStorageSync('joint_fahui_confirm', confirmData)
          
          console.log('🔄 准备跳转到支付页面...')
          // 跳转到支付页面
          uni.navigateTo({
            url: '/pages/fahui/joint/pay',
            success: () => {
              console.log('✅ 跳转到合坛法会支付页成功')
            },
            fail: (err) => {
              console.error('❌ 跳转到支付页面失败:', err)
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              })
            }
          })
        } else {
          console.error('❌ 订单创建失败:', orderResult.message)
          throw new Error(orderResult.message || '创建订单失败')
        }
        
      } catch (error) {
        console.error('❌ 确认订单失败:', error)
        uni.showToast({
          title: error.message || '确认订单失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
        console.log('🏁 确认订单流程结束')
      }
    }
  }
}
</script>

<style scoped>
.confirm-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0eaff 0%, #f8f8f8 100%);
  padding-bottom: 120rpx;
}

.confirm-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48rpx 24rpx 32rpx 24rpx;
  text-align: center;
  color: #fff;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.header-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
}

.section {
  margin: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 8rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4rpx;
  margin-right: 16rpx;
}

.info-card, .receiver-card, .fee-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.info-row, .fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child, .fee-row:last-child {
  border-bottom: none;
}

.info-label, .fee-label {
  font-size: 28rpx;
  color: #666;
  min-width: 160rpx;
}

.info-value, .fee-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  text-align: right;
  flex: 1;
}

.fee-divider {
  height: 1rpx;
  background: #e0e0e0;
  margin: 16rpx 0;
}

.fee-row.total {
  border-bottom: none;
  padding-top: 16rpx;
}

.total-value {
  color: #ff6b35;
  font-size: 32rpx;
}

.applicant-list, .deceased-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.applicant-card, .deceased-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.applicant-header, .deceased-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.applicant-name, .deceased-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.applicant-number, .deceased-number {
  font-size: 24rpx;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.applicant-info, .deceased-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.goods-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.goods-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.goods-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.goods-price {
  font-size: 26rpx;
  color: #ff6b35;
}

.goods-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.count-label {
  font-size: 26rpx;
  color: #666;
}

.count-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.goods-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 26rpx;
  color: #666;
}

.total-value {
  font-size: 26rpx;
  color: #ff6b35;
  font-weight: bold;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.1);
  display: flex;
  gap: 16rpx;
}

.btn-secondary, .btn-primary {
  flex: 1;
  padding: 24rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 