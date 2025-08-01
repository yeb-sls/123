// 合坛法会数据管理器
import safeStorage from './cache.js'

class JointDataManager {
  constructor() {
    this.storageKey = 'joint_fahui_order'
    this.draftKey = 'joint_fahui_draft'
    this.confirmKey = 'joint_fahui_confirm'
    this.orderIdKey = 'joint_fahui_order_id'
  }
  
  // 保存订单数据
  saveOrderData(orderData) {
    try {
      // 添加时间戳
      const dataWithTimestamp = {
        ...orderData,
        createTime: new Date().getTime(),
        lastUpdateTime: new Date().getTime()
      }
      
      const result = safeStorage.set(this.storageKey, dataWithTimestamp)
      if (result) {
        console.log('✅ 订单数据已保存:', dataWithTimestamp)
        return true
      } else {
        console.error('❌ 保存订单数据失败')
        return false
      }
    } catch (error) {
      console.error('❌ 保存订单数据失败:', error)
      return false
    }
  }
  
  // 获取订单数据
  getOrderData() {
    try {
      const data = safeStorage.get(this.storageKey)
      console.log('📋 获取订单数据:', data)
      return data
    } catch (error) {
      console.error('❌ 获取订单数据失败:', error)
      return null
    }
  }
  
  // 清除订单数据
  clearOrderData() {
    try {
      safeStorage.remove(this.storageKey)
      safeStorage.remove(this.confirmKey)
      safeStorage.remove(this.orderIdKey)
      console.log('🧹 订单数据已清除')
      return true
    } catch (error) {
      console.error('❌ 清除订单数据失败:', error)
      return false
    }
  }
  
  // 保存草稿数据
  saveDraftData(draftData) {
    try {
      const result = safeStorage.set(this.draftKey, draftData)
      if (result) {
        console.log('✅ 草稿数据已保存:', draftData)
        return true
      } else {
        console.error('❌ 保存草稿数据失败')
        return false
      }
    } catch (error) {
      console.error('❌ 保存草稿数据失败:', error)
      return false
    }
  }
  
  // 获取草稿数据
  getDraftData() {
    try {
      const data = safeStorage.get(this.draftKey)
      console.log('📋 获取草稿数据:', data)
      return data
    } catch (error) {
      console.error('❌ 获取草稿数据失败:', error)
      return null
    }
  }
  
  // 清除草稿数据
  clearDraftData() {
    try {
      safeStorage.remove(this.draftKey)
      console.log('🧹 草稿数据已清除')
      return true
    } catch (error) {
      console.error('❌ 清除草稿数据失败:', error)
      return false
    }
  }
  
  // 验证数据完整性
  validateOrderData(orderData) {
    if (!orderData) {
      console.log('❌ 订单数据为空')
      return false
    }
    
    // 检查必要字段
    const requiredFields = ['projectName', 'applicants', 'activityFee', 'totalFee']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        console.log(`❌ 缺少必要字段: ${field}`)
        return false
      }
    }
    
    // 检查报名人信息
    if (!Array.isArray(orderData.applicants) || orderData.applicants.length === 0) {
      console.log('❌ 报名人信息不完整')
      return false
    }
    
    // 检查每个报名人的必要信息
    for (const applicant of orderData.applicants) {
      if (!applicant.name || !applicant.phone || !applicant.gender) {
        console.log('❌ 报名人信息不完整:', applicant)
        return false
      }
    }
    
    console.log('✅ 订单数据验证通过')
    return true
  }
  
  // 清理和标准化数据
  cleanOrderData(orderData) {
    return {
      projectName: orderData.projectName || orderData.project_name || '合坛法会',
      applicantCount: orderData.applicantCount || (orderData.applicants ? orderData.applicants.length : 0),
      applicants: orderData.applicants || [],
      selectedItems: orderData.selectedItems || orderData.goods || [],
      receiver: orderData.receiver || null,
      activityFee: orderData.activityFee || orderData.activity_fee || 0,
      goodsFee: orderData.goodsFee || orderData.goods_fee || 0,
      totalFee: orderData.totalFee || orderData.total_fee || 0,
      spouse: orderData.spouse || null,
      deceasedList: orderData.deceasedList || [],
      chaoduType: orderData.chaoduType || '',
      selectedDate: orderData.selectedDate || '',
      type: orderData.type || 'joint_fahui',
      createTime: orderData.createTime || new Date().getTime(),
      lastUpdateTime: new Date().getTime()
    }
  }
  
  // 获取所有调试信息
  getDebugInfo() {
    return {
      orderData: this.getOrderData(),
      draftData: this.getDraftData(),
      confirmData: safeStorage.get(this.confirmKey),
      orderId: safeStorage.get(this.orderIdKey)
    }
  }
  
  // 生成测试数据
  generateTestData() {
    const testData = {
      type: 'joint_fahui',
      projectId: 'test_project',
      projectName: '测试合坛法会',
      projectPrice: 200,
      selectedDate: '2025-08-15',
      chaoduType: '',
      applicants: [
        {
          name: '测试用户',
          gender: '男',
          phone: '13800138000',
          lunarBirthday: '1990-01-01',
          birthTime: '子时',
          address: '测试地址'
        }
      ],
      spouse: null,
      deceasedList: [],
      selectedItems: [
        {
          name: '香烛',
          price: 50,
          count: 2
        }
      ],
      receiver: {
        name: '收件人',
        phone: '13800138001',
        address: '收件地址'
      },
      activityFee: 200,
      goodsFee: 100,
      totalFee: 300,
      applicantCount: 1,
      createTime: new Date().getTime()
    }
    
    this.saveOrderData(testData)
    return testData
  }
}

// 创建单例实例
const jointDataManager = new JointDataManager()

export default jointDataManager 