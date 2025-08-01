'use strict';

const db = uniCloud.database()

module.exports = {
  // ==================== 项目管理 ====================
  
  // 获取项目列表
  async getProjects() {
    try {
      const result = await db.collection('fahui_projects').get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取专场法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加项目
  async addProject(params) {
    try {
      const result = await db.collection('fahui_projects').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加专场法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新项目
  async updateProject(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('fahui_projects')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新专场法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除项目
  async deleteProject(params) {
    try {
      const result = await db.collection('fahui_projects')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除专场法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 订单管理 ====================
  
  // 获取订单列表
  async getOrders(params = {}) {
    try {
      let query = db.collection('fahui_orders')
      
      // 根据类型筛选
      if (params.type) {
        query = query.where({
          fahuiType: params.type
        })
      }
      
      const result = await query
        .orderBy('createTime', 'desc')
        .get()
      
      console.log('获取订单结果：', result.data)
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取专场法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取订单详情
  async getOrderDetail(params) {
    try {
      console.log('🔍 获取专场法会订单详情，参数:', params)
      
      const { orderId } = params
      if (!orderId) {
        return { success: false, message: '订单ID不能为空' }
      }
      
      const result = await db.collection('fahui_orders')
        .doc(orderId)
        .get()
      
      if (result.data && result.data.length > 0) {
        const orderDetail = result.data[0]
        console.log('📋 专场法会订单详情获取成功:', orderDetail)
        return { success: true, data: orderDetail }
      } else {
        console.log('⚠️ 未找到专场法会订单:', orderId)
        return { success: false, message: '订单不存在' }
      }
    } catch (error) {
      console.error('获取专场法会订单详情失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 提交订单
  async submitOrder(params) {
    try {
      const orderData = {
        ...params,
        createTime: new Date()
      }
      
      // 如果没有传入状态，则默认为待支付
      if (!orderData.status) {
        orderData.status = '待支付'
      }
      
      const result = await db.collection('fahui_orders').add(orderData)
      return { success: true, data: result }
    } catch (error) {
      console.error('提交专场法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新订单状态
  async updateOrderStatus(params) {
    try {
      console.log('🔍 云对象 updateOrderStatus 被调用，参数:', params)
      const { _id, orderId, status, fahuiDate, action, operator } = params
      const updateData = {
        status,
        update_time: new Date()
      }
      
      console.log('🔍 更新数据:', updateData)
      
      // 如果传入了专场法会日期，则保存
      if (fahuiDate) {
        updateData.fahuiDate = fahuiDate
      }
      
      if (status === '已确认') {
        updateData.confirmBy = operator || '管理员'
        updateData.confirmTime = new Date()
      }
      
      // 记录操作日志
      const log = {
        action: status === '已确认' ? '确认专场法会' : `状态更新为${status}`,
        operator: operator || '管理员',
        time: new Date()
      }
      
      const orderIdToUse = _id || orderId
      console.log('🔍 使用的订单ID:', orderIdToUse)
      
      const result = await db.collection('fahui_orders')
        .doc(orderIdToUse)
        .update({
          ...updateData,
          logs: db.command.push(log)
        })
      
      console.log('🔍 数据库更新结果:', result)
      return { success: true, data: result }
    } catch (error) {
      console.error('🔍 更新订单状态失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新订单信息
  async updateOrder(params) {
    try {
      console.log('✏️ 更新专场法会订单，参数:', params)
      
      const { orderId, orderData, operator } = params
      
      if (!orderId) {
        return { success: false, message: '订单ID不能为空' }
      }
      
      if (!orderData) {
        return { success: false, message: '订单数据不能为空' }
      }
      
      // 获取当前订单
      const orderResult = await db.collection('fahui_orders')
        .doc(orderId)
        .get()
      
      if (!orderResult.data || orderResult.data.length === 0) {
        return { success: false, message: '订单不存在' }
      }
      
      const currentOrder = orderResult.data[0]
      const now = new Date()
      
      // 准备更新数据
      const updateData = { ...orderData, update_time: now }
      
      // 准备操作记录
      const operation = {
        type: '编辑订单信息',
        operator: operator || '管理员',
        time: now,
        remark: '修改了订单信息'
      }
      
      // 添加操作记录到订单
      if (!currentOrder.operations) {
        currentOrder.operations = []
      }
      currentOrder.operations.push(operation)
      updateData.operations = currentOrder.operations
      
      const result = await db.collection('fahui_orders')
        .doc(orderId)
        .update(updateData)
      
      console.log('✅ 专场法会订单更新成功:', result)
      return { 
        success: true, 
        message: '订单更新成功',
        data: result
      }
    } catch (error) {
      console.error('❌ 更新专场法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加订单备注
  async addOrderRemark(params) {
    try {
      console.log('💬 添加专场法会订单备注，参数:', params)
      
      const { orderId, remark, operator } = params
      
      if (!operator) {
        return { success: false, message: '操作人不能为空' }
      }
      
      if (!remark || !remark.trim()) {
        return { success: false, message: '备注内容不能为空' }
      }
      
      // 获取当前订单
      const orderResult = await db.collection('fahui_orders')
        .doc(orderId)
        .get()
      
      if (!orderResult.data || orderResult.data.length === 0) {
        return { success: false, message: '订单不存在' }
      }
      
      const order = orderResult.data[0]
      const now = new Date()
      
      // 准备操作记录
      const operation = {
        type: '添加备注',
        operator: operator,
        time: now,
        remark: remark.trim()
      }
      
      // 添加操作记录到订单
      if (!order.operations) {
        order.operations = []
      }
      order.operations.push(operation)
      
      const result = await db.collection('fahui_orders')
        .doc(orderId)
        .update({
          operations: order.operations,
          update_time: now
        })
      
      console.log('✅ 专场法会订单备注添加成功:', result)
      return { success: true, data: result }
    } catch (error) {
      console.error('❌ 添加专场法会订单备注失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除订单
  async deleteOrder(params) {
    try {
      const result = await db.collection('fahui_orders')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除专场法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 配置管理 ====================
  
  // 获取配置列表
  async getConfigs() {
    try {
      const result = await db.collection('fahui_configs').get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取专场法会配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加配置
  async addConfig(params) {
    try {
      const result = await db.collection('fahui_configs').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加专场法会配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新配置
  async updateConfig(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('fahui_configs')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新专场法会配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除配置
  async deleteConfig(params) {
    try {
      const result = await db.collection('fahui_configs')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除专场法会配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 横幅管理 ====================
  
  // 获取横幅列表
  async getBanners() {
    try {
      const result = await db.collection('fahui_banners')
        .orderBy('order', 'asc')
        .get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取专场法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加横幅
  async addBanner(params) {
    try {
      const result = await db.collection('fahui_banners').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加专场法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新横幅
  async updateBanner(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('fahui_banners')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新专场法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除横幅
  async deleteBanner(params) {
    try {
      const result = await db.collection('fahui_banners')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除专场法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 介绍管理 ====================
  
  // 获取介绍列表
  async getIntros() {
    try {
      const result = await db.collection('fahui_intros')
        .orderBy('order', 'asc')
        .get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取专场法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加介绍
  async addIntro(params) {
    try {
      // 支持两种参数格式：直接传递介绍数据或包装在intro字段中
      const introData = params.intro || params
      
      // 清理不需要的字段
      const { _id, update_date, update_time, create_time, ...cleanData } = introData
      
      const result = await db.collection('fahui_intros').add({
        ...cleanData,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加专场法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新介绍
  async updateIntro(params) {
    try {
      // 支持两种参数格式：直接传递介绍数据或包装在intro字段中
      const updateData = params.intro || params
      const { _id, update_date, update_time, create_time, ...dataToUpdate } = updateData
      
      const result = await db.collection('fahui_intros')
        .doc(_id)
        .update({
          ...dataToUpdate,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新专场法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除介绍
  async deleteIntro(params) {
    try {
      const result = await db.collection('fahui_intros')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除专场法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 收件管理 ====================
  
  // 获取收件人列表
  async getReceivers(params = {}) {
    try {
      console.log('🔍 获取收件人列表，参数:', params)
      const { type } = params
      
      // 根据类型选择不同的数据表
      const collectionName = type === 'joint' ? 'joint_receivers' : 'fahui_receivers'
      console.log('🔍 使用数据表:', collectionName)
      
      const result = await db.collection(collectionName).get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('🔍 获取收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加收件人
  async addReceiver(params) {
    try {
      console.log('🔍 添加收件人，参数:', params)
      const { type, ...receiverData } = params
      
      // 根据类型选择不同的数据表
      const collectionName = type === 'joint' ? 'joint_receivers' : 'fahui_receivers'
      console.log('🔍 使用数据表:', collectionName)
      
      const result = await db.collection(collectionName).add({
        ...receiverData,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('🔍 添加收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新收件人
  async updateReceiver(params) {
    try {
      console.log('🔍 更新收件人，参数:', params)
      const { _id, type, ...updateData } = params
      
      // 根据类型选择不同的数据表
      const collectionName = type === 'joint' ? 'joint_receivers' : 'fahui_receivers'
      console.log('🔍 使用数据表:', collectionName)
      
      const result = await db.collection(collectionName)
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('🔍 更新收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除收件人
  async deleteReceiver(params) {
    try {
      console.log('🔍 删除收件人，参数:', params)
      const { _id, type } = params
      
      // 根据类型选择不同的数据表
      const collectionName = type === 'joint' ? 'joint_receivers' : 'fahui_receivers'
      console.log('🔍 使用数据表:', collectionName)
      
      const result = await db.collection(collectionName)
        .doc(_id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('🔍 删除收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取收件配置
  async getReceiverConfig(params = {}) {
    try {
      console.log('🔍 获取收件配置，参数:', params)
      const { type } = params
      
      // 根据类型选择不同的数据表
      const collectionName = type === 'joint' ? 'joint_receiver_config' : 'fahui_receiver_config'
      console.log('🔍 使用数据表:', collectionName)
      
      const result = await db.collection(collectionName).get()
      console.log('🔍 数据库查询结果:', result)
      console.log('🔍 配置数据:', result.data[0] || null)
      return { success: true, data: result.data[0] || null }
    } catch (error) {
      console.error('🔍 获取收件配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新收件配置
  async updateReceiverConfig(params) {
    try {
      console.log('🔍 更新收件配置，参数:', params)
      const { type, ...updateData } = params
      
      // 根据类型选择不同的数据表
      const collectionName = type === 'joint' ? 'joint_receiver_config' : 'fahui_receiver_config'
      console.log('🔍 使用数据表:', collectionName)
      
      // 先获取现有配置
      const configRes = await db.collection(collectionName).get()
      console.log('🔍 现有配置查询结果:', configRes)
      
      if (configRes.data && configRes.data.length > 0) {
        // 如果存在配置，则更新
        const configId = configRes.data[0]._id
        console.log('🔍 配置ID:', configId)
        
        if (!configId) {
          console.error('🔍 配置ID为空，无法更新')
          return { success: false, message: '配置ID无效' }
        }
        
        const result = await db.collection(collectionName)
          .doc(configId)
          .update({
            ...updateData,
            update_time: new Date()
          })
        console.log('🔍 更新结果:', result)
        return { success: true, data: result }
      } else {
        // 如果不存在配置，则创建新配置
        console.log('🔍 创建新配置')
        const result = await db.collection(collectionName).add({
          ...updateData,
          create_time: new Date(),
          update_time: new Date()
        })
        console.log('🔍 创建结果:', result)
        return { success: true, data: result }
      }
    } catch (error) {
      console.error('🔍 更新收件配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 代办物品配置管理 ====================
  
  // 获取代办物品配置
  async getGoodsConfig() {
    try {
      const result = await db.collection('fahui_goods_config')
        .where({ type: 'fahui' })
        .limit(1)
        .get()
      
      if (result.data.length > 0) {
        return { success: true, data: result.data[0] }
      } else {
        return { success: true, data: { enabled: false, goods: [] } }
      }
    } catch (error) {
      console.error('获取代办物品配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新代办物品配置
  async updateGoodsConfig(params) {
    try {
      const result = await db.collection('fahui_goods_config')
        .where({ type: 'fahui' })
        .limit(1)
        .get()
      
      if (result.data.length > 0) {
        // 更新现有配置
        await db.collection('fahui_goods_config')
          .doc(result.data[0]._id)
          .update({
            ...params,
            update_time: new Date()
          })
      } else {
        // 创建新配置
        await db.collection('fahui_goods_config').add({
          ...params,
          type: 'fahui',
          create_time: new Date()
        })
      }
      
      return { success: true }
    } catch (error) {
      console.error('更新代办物品配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 特殊介绍管理 ====================
  
  // 获取特殊介绍
  async getSpecialIntro() {
    try {
      console.log('🔍 === CLOUD: getSpecialIntro 方法被调用 ===')
      console.log('🔍 开始查询 fahui_special_intro 集合')
      
      // 按创建时间倒序排列，获取最新的一条记录
      const result = await db.collection('fahui_special_intro')
        .orderBy('create_time', 'desc')
        .limit(1)
        .get()
      
      console.log('🔍 数据库查询结果:', result)
      console.log('🔍 记录数量:', result.data.length)
      console.log('🔍 所有记录:', result.data)
      
      // 检查所有记录的内容
      result.data.forEach((record, index) => {
        console.log(`🔍 记录 ${index}:`, {
          _id: record._id,
          content: record.content,
          contentLength: record.content ? record.content.length : 0,
          enabled: record.enabled,
          type: record.type,
          create_time: record.create_time,
          update_time: record.update_time
        })
      })
      
      let data = result.data[0] || null
      console.log('🔍 第一条记录（最新）:', data)
      
      if (data) {
        // 确保有_id字段
        if (!data._id && data.id) {
          data._id = data.id
          console.log('🔍 使用 id 作为 _id:', data._id)
        }
        
        // 检查数据完整性
        console.log('🔍 数据完整性检查:')
        console.log('🔍 - _id:', data._id)
        console.log('🔍 - content:', data.content)
        console.log('🔍 - content length:', data.content ? data.content.length : 0)
        console.log('🔍 - enabled:', data.enabled)
        console.log('🔍 - type:', data.type)
        console.log('🔍 - create_time:', data.create_time)
        console.log('🔍 - update_time:', data.update_time)
        
        console.log('🔍 最终返回数据:', data)
        console.log('🔍 数据内容:', data.content)
        console.log('🔍 数据启用状态:', data.enabled)
        console.log('🔍 数据ID:', data._id)
      } else {
        console.log('🔍 没有找到数据，返回 null')
      }
      
      console.log('🔍 === CLOUD: getSpecialIntro 方法执行完成 ===')
      return { success: true, data: data }
    } catch (error) {
      console.error('🔍 获取专场法会特殊介绍失败：', error)
      console.error('🔍 错误堆栈:', error.stack)
      return { success: false, message: error.message }
    }
  },

  // 添加特殊介绍
  async addSpecialIntro(params) {
    try {
      console.log('🔍 === CLOUD: addSpecialIntro 方法被调用 ===')
      console.log('🔍 接收到的参数:', params)
      
      // 获取数据
      const introData = params.intro || params
      const { _id, update_date, update_time, create_time, ...cleanData } = introData
      
      console.log('🔍 清理后的数据:', cleanData)
      console.log('🔍 内容长度:', cleanData.content ? cleanData.content.length : 0)
      console.log('🔍 内容详情:', cleanData.content)
      
      // 先删除所有现有数据
      console.log('🔍 删除所有现有数据...')
      const existingData = await db.collection('fahui_special_intro').get()
      console.log('🔍 现有数据数量:', existingData.data.length)
      
      if (existingData.data.length > 0) {
        for (const item of existingData.data) {
          const docId = item._id || item.id
          if (docId) {
            console.log('🔍 删除记录:', docId)
            await db.collection('fahui_special_intro').doc(docId).remove()
          }
        }
      }
      
      // 添加新数据
      console.log('🔍 添加新数据...')
      console.log('🔍 准备添加的数据:', {
        ...cleanData,
        create_time: new Date()
      })
      
      const result = await db.collection('fahui_special_intro').add({
        ...cleanData,
        create_time: new Date()
      })
      
      console.log('🔍 添加结果:', result)
      
      // 返回完整数据
      const returnData = {
        _id: result.id,
        ...cleanData,
        create_time: new Date()
      }
      
      console.log('🔍 返回数据:', returnData)
      console.log('🔍 返回数据内容:', returnData.content)
      console.log('🔍 返回数据内容长度:', returnData.content ? returnData.content.length : 0)
      console.log('🔍 === CLOUD: addSpecialIntro 方法执行完成 ===')
      
      return { success: true, data: returnData }
    } catch (error) {
      console.error('🔍 添加专场法会特殊介绍失败：', error)
      console.error('🔍 错误堆栈:', error.stack)
      return { success: false, message: error.message }
    }
  },

  // 更新特殊介绍
  async updateSpecialIntro(params) {
    try {
      console.log('updateSpecialIntro 接收到的参数:', params)
      // 支持两种参数格式：直接传递介绍数据或包装在intro字段中
      const updateData = params.intro || params
      const { _id, update_date, update_time, create_time, ...dataToUpdate } = updateData
      
      console.log('更新特殊介绍，ID:', _id)
      console.log('更新数据:', dataToUpdate)
      
      const result = await db.collection('fahui_special_intro')
        .doc(_id)
        .update({
          ...dataToUpdate,
          update_time: new Date()
        })
      
      console.log('更新特殊介绍结果:', result)
      return { success: true, data: result }
    } catch (error) {
      console.error('更新专场法会特殊介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除特殊介绍
  async deleteSpecialIntro(params) {
    try {
      const result = await db.collection('fahui_special_intro')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除专场法会特殊介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 清理旧的专场法会介绍记录
  async cleanOldSpecialIntroRecords() {
    try {
      console.log('🔍 === CLOUD: cleanOldSpecialIntroRecords 方法被调用 ===')
      
      // 获取所有记录，按创建时间排序
      const result = await db.collection('fahui_special_intro')
        .orderBy('create_time', 'desc')
        .get()
      
      console.log('🔍 总记录数:', result.data.length)
      
      if (result.data.length <= 1) {
        console.log('🔍 记录数小于等于1，无需清理')
        return { success: true, message: '无需清理，记录数正常' }
      }
      
      // 保留最新的一条记录，删除其他所有记录
      const recordsToDelete = result.data.slice(1)
      console.log('🔍 需要删除的记录数:', recordsToDelete.length)
      
      let deletedCount = 0
      for (const record of recordsToDelete) {
        const docId = record._id || record.id
        if (docId) {
          console.log('🔍 删除记录:', docId, '内容:', record.content)
          await db.collection('fahui_special_intro').doc(docId).remove()
          deletedCount++
        }
      }
      
      console.log('🔍 成功删除记录数:', deletedCount)
      console.log('🔍 === CLOUD: cleanOldSpecialIntroRecords 方法执行完成 ===')
      
      return { 
        success: true, 
        message: `清理完成，删除了 ${deletedCount} 条旧记录，保留最新记录` 
      }
    } catch (error) {
      console.error('🔍 清理旧记录失败：', error)
      console.error('🔍 错误堆栈:', error.stack)
      return { success: false, message: error.message }
    }
  },

  // ==================== 订单导出 ====================
  
  // 导出订单数据
  async exportOrders(params = {}) {
    try {
      console.log('开始导出专场法会订单，参数:', params)
      
      let query = db.collection('fahui_orders')
      
      // 根据状态筛选
      if (params.status) {
        query = query.where({
          status: params.status
        })
      }
      
      // 根据时间筛选
      if (params.dateFilter) {
        const now = new Date()
        let startDate
        
        switch (params.dateFilter) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            break
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          default:
            startDate = null
        }
        
        if (startDate) {
          query = query.where({
            createTime: db.command.gte(startDate)
          })
        }
      }
      
      const result = await query
        .orderBy('createTime', 'desc')
        .get()
      
      console.log('导出订单查询结果:', result.data.length, '条记录')
      
      // 格式化导出数据
      const exportData = result.data.map(order => ({
        订单号: order.orderNo || order.orderNumber || order._id,
        法会项目: order.fahuiProject?.name || order.fahuiName || '未指定',
        报名人数: order.applicants?.length || 0,
        总金额: order.totalFee || order.amount || 0,
        支付方式: order.paymentMethod || '未指定',
        订单状态: order.status || '未知',
        联系人: order.participantName || (order.applicants?.[0]?.name || '未指定'),
        联系电话: order.phone || (order.applicants?.[0]?.phone || '未指定'),
        创建时间: order.createTime ? new Date(order.createTime).toLocaleString('zh-CN') : '未知',
        支付时间: order.payTime ? new Date(order.payTime).toLocaleString('zh-CN') : '未支付',
        备注: order.remark || ''
      }))
      
      return {
        success: true,
        data: exportData,
        message: `成功导出 ${exportData.length} 条订单数据`,
        totalCount: exportData.length
      }
    } catch (error) {
      console.error('导出专场法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 统计管理 ====================
  
  // 获取统计数据
  async getStats() {
    try {
      // 获取法会项目数量
      const projectsCount = await db.collection('fahui_projects').count()
      
      // 获取法会订单数量
      const ordersCount = await db.collection('fahui_orders').count()
      
      // 获取今日订单数量
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayOrdersCount = await db.collection('fahui_orders').where({
        createTime: db.command.gte(today)
      }).count()
      
      return {
        success: true,
        data: {
          totalProjects: projectsCount.total || 0,
          totalOrders: ordersCount.total || 0,
          todayOrders: todayOrdersCount.total || 0
        }
      }
    } catch (error) {
      console.error('获取专场法会统计数据失败：', error)
      return { success: false, message: error.message }
    }
  }
} 