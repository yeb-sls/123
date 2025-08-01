'use strict';

const db = uniCloud.database()

module.exports = {
  // ==================== 项目管理 ====================
  
  // 获取项目列表
  async getProjects() {
    try {
      console.log('🔍 获取合坛法会项目列表')
      const result = await db.collection('joint_projects').get()
      console.log('🔍 原始项目数据:', result.data)
      
      // 确保每个项目都有goods字段
      const projects = result.data.map(project => {
        const projectWithGoods = {
          ...project,
          goods: project.goods || []
        }
        console.log(`🔍 项目 ${project.name} 的物品数据:`, projectWithGoods.goods)
        return projectWithGoods
      })
      
      console.log('🔍 处理后的项目数据:', projects)
      return { success: true, data: projects }
    } catch (error) {
      console.error('获取合坛法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加项目
  async addProject(params) {
    try {
      const result = await db.collection('joint_projects').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加合坛法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新项目
  async updateProject(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('joint_projects')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新合坛法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除项目
  async deleteProject(params) {
    try {
      const result = await db.collection('joint_projects')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除合坛法会项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 订单管理 ====================
  
  // 获取订单详情
  async getOrderDetail(params) {
    try {
      console.log('🔍 获取订单详情，参数:', params)
      
      const { orderId } = params
      if (!orderId) {
        return { success: false, message: '订单ID不能为空' }
      }
      
      const result = await db.collection('joint_orders')
        .doc(orderId)
        .get()
      
      if (result.data && result.data.length > 0) {
        const orderDetail = result.data[0]
        console.log('📋 订单详情获取成功:', orderDetail)
        return { success: true, data: orderDetail }
      } else {
        console.log('⚠️ 未找到订单:', orderId)
        return { success: false, message: '订单不存在' }
      }
    } catch (error) {
      console.error('获取订单详情失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 执行订单操作
  async performOrderAction(params) {
    try {
      console.log('🔍 执行订单操作，参数:', params)
      
      const { orderId, action, actionName, operator, remark } = params
      
      if (!orderId || !action || !operator) {
        return { success: false, message: '参数不完整' }
      }
      
      // 获取当前订单
      const orderResult = await db.collection('joint_orders')
        .doc(orderId)
        .get()
      
      if (!orderResult.data || orderResult.data.length === 0) {
        return { success: false, message: '订单不存在' }
      }
      
      const order = orderResult.data[0]
      const now = new Date()
      
      // 根据操作类型更新状态
      let newStatus = order.status
      switch (action) {
        case 'confirm':
          newStatus = '处理中'
          break
        case 'process':
          newStatus = '处理中'
          break
        case 'complete':
          newStatus = '已完成'
          break
        default:
          return { success: false, message: '无效的操作类型' }
      }
      
      // 准备操作记录
      const operation = {
        type: actionName,
        operator: operator,
        time: now,
        remark: remark || undefined
      }
      
      // 更新订单
      const updateData = {
        status: newStatus,
        update_time: now
      }
      
      // 添加操作记录到订单
      if (!order.operations) {
        order.operations = []
      }
      order.operations.push(operation)
      updateData.operations = order.operations
      
      const result = await db.collection('joint_orders')
        .doc(orderId)
        .update(updateData)
      
      console.log('✅ 订单操作执行成功:', result)
      return { 
        success: true, 
        message: '操作执行成功',
        data: { newStatus, operation }
      }
    } catch (error) {
      console.error('执行订单操作失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取订单列表
  async getOrders() {
    try {
      console.log('🔍 开始查询合坛法会订单...')
      
      // 先测试数据库连接
      console.log('🔍 测试数据库连接...')
      const testResult = await db.collection('joint_orders').limit(1).get()
      console.log('🔍 数据库连接测试结果:', testResult)
      
      // 检查集合是否存在数据
      const countResult = await db.collection('joint_orders').count()
      console.log('🔍 集合中的文档数量:', countResult)
      
      // 先尝试按create_time排序，如果失败则按_id排序
      let result
      try {
        result = await db.collection('joint_orders')
          .orderBy('create_time', 'desc')
          .get()
      } catch (sortError) {
        console.log('⚠️ 按create_time排序失败，尝试按_id排序:', sortError)
        try {
          result = await db.collection('joint_orders')
            .orderBy('_id', 'desc')
            .get()
        } catch (idSortError) {
          console.log('⚠️ 按_id排序也失败，尝试不排序:', idSortError)
          result = await db.collection('joint_orders')
            .get()
        }
      }
      
      console.log('📊 数据库查询结果:', result)
      console.log('📋 原始订单数据:', result.data)
      console.log('📊 订单数量:', result.data.length)
      
      // 处理数据，确保字段名兼容
      const processedData = result.data.map(order => {
        const processedOrder = {
          ...order,
          // 确保关键字段存在
          orderNo: order.orderNo || order.order_id || order._id,
          projectName: order.projectName || order.project_name,
          totalCost: order.totalCost || order.total_fee || 0,
          createTime: order.createTime || order.create_time,
          // 确保状态字段正确
          status: order.status || '待支付'
        }
        console.log('🔄 处理后的订单:', processedOrder)
        return processedOrder
      })
      
      console.log('✅ 订单处理完成，返回数据:', processedData)
      return { success: true, data: processedData }
    } catch (error) {
      console.error('❌ 获取合坛法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 创建订单（前台使用）
  async createOrder(params) {
    try {
      console.log('🚀 开始创建合坛法会订单...')
      console.log('📝 接收到的参数:', params)
      
      const { orderData } = params
      
      if (!orderData) {
        console.error('❌ 订单数据为空')
        return {
          success: false,
          message: '订单数据不能为空'
        }
      }
      
      console.log('📋 订单数据:', orderData)
      
      // 生成订单号
      const orderId = 'JT' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase()
      console.log('🆔 生成的订单号:', orderId)
      
      // 准备订单数据
      const order = {
        order_id: orderId,
        orderNo: orderId, // 兼容后台页面显示
        type: 'joint_fahui',
        project_id: orderData.projectId,
        project_name: orderData.projectName,
        projectName: orderData.projectName, // 兼容后台页面显示
        project_price: orderData.projectPrice,
        selected_date: orderData.selectedDate,
        chaodu_type: orderData.chaoduType,
        applicants: orderData.applicants,
        deceased_list: orderData.deceasedList || [],
        selected_items: orderData.selectedItems || [],
        receiver: orderData.receiver,
        activity_fee: orderData.activityFee,
        goods_fee: orderData.goodsFee,
        total_fee: orderData.totalFee,
        totalCost: orderData.totalFee, // 兼容后台页面显示
        applicant_count: orderData.applicantCount,
        status: '待支付',
        create_time: new Date(),
        createTime: new Date(), // 兼容后台页面显示
        update_time: new Date()
      }
      
      console.log('💾 准备保存的订单数据:', order)
      
      // 插入订单到数据库
      const result = await db.collection('joint_orders').add(order)
      
      console.log('📊 数据库插入结果:', result)
      
      if (result.id) {
        console.log('✅ 订单创建成功，ID:', result.id)
        return {
          success: true,
          orderId: orderId,
          message: '订单创建成功'
        }
      } else {
        console.error('❌ 订单创建失败，没有返回ID')
        return {
          success: false,
          message: '订单创建失败'
        }
      }
      
    } catch (error) {
      console.error('❌ 创建合坛法会订单失败:', error)
      return {
        success: false,
        message: '创建订单失败: ' + (error.message || error)
      }
    }
  },

  // 更新订单状态
  async updateOrderStatus(params) {
    try {
      const { _id, orderId, status, fahuiDate, action, operator } = params
      
      const orderIdToUse = _id || orderId
      
      // 获取当前订单
      const orderResult = await db.collection('joint_orders')
        .doc(orderIdToUse)
        .get()
      
      if (!orderResult.data || orderResult.data.length === 0) {
        return { success: false, message: '订单不存在' }
      }
      
      const order = orderResult.data[0]
      const now = new Date()
      
      const updateData = {
        status,
        update_time: now
      }
      
      // 如果传入了合坛法会日期，则保存
      if (fahuiDate) {
        updateData.fahuiDate = fahuiDate
      }
      
      if (status === '已确认') {
        updateData.confirmBy = operator || '管理员'
        updateData.confirmTime = now
      }
      
      // 准备操作记录
      const operation = {
        type: status === '已确认' ? '确认此合坛法会' : `状态更新为${status}`,
        operator: operator || '管理员',
        time: now
      }
      
      // 添加操作记录到订单
      if (!order.operations) {
        order.operations = []
      }
      order.operations.push(operation)
      updateData.operations = order.operations
      
      const result = await db.collection('joint_orders')
        .doc(orderIdToUse)
        .update(updateData)
      
      // 如果状态更新为已支付或待确认，发送管理员通知
      if (status === '已支付' || status === '待确认') {
        try {
          // 获取订单详情用于通知
          const orderResult = await db.collection('joint_orders').doc(orderIdToUse).get()
          const order = orderResult.data[0]
          
          let message = ''
          if (status === '已支付') {
            message = `合坛法会订单支付成功！\n订单号: ${orderIdToUse}\n项目: ${order.projectName || order.project_name || '合坛法会'}\n金额: ¥${order.totalCost || order.total_fee || 0}\n请及时确认此合坛法会`
          } else if (status === '待确认') {
            message = `合坛法会订单待确认！\n订单号: ${orderIdToUse}\n项目: ${order.projectName || order.project_name || '合坛法会'}\n报名人数: ${order.applicants ? order.applicants.length : 0}人\n请及时确认此合坛法会`
          }
          
          await this.sendAdminNotification({
            type: 'joint_order_paid',
            orderId: orderIdToUse,
            message: message
          })
        } catch (notifyError) {
          console.error('发送管理员通知失败：', notifyError)
        }
      }
      
      return { success: true, data: result }
    } catch (error) {
      console.error('更新订单状态失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 确认合坛法会日期
  async confirmFahuiDate(params) {
    try {
      const { orderId, fahuiDate, operator } = params
      
      if (!operator) {
        return { success: false, message: '操作人不能为空' }
      }
      
      const updateData = {
        fahuiDate,
        confirmBy: operator,
        confirmTime: new Date(),
        status: '已确认',
        update_time: new Date()
      }
      
      // 记录操作日志
      const log = {
        action: `确认合坛法会日期: ${fahuiDate}`,
        operator: operator,
        time: new Date()
      }
      
      const result = await db.collection('joint_orders')
        .doc(orderId)
        .update({
          ...updateData,
          logs: db.command.push(log)
        })
      
      // 发送确认通知
      try {
        // 获取订单详情用于通知
        const orderResult = await db.collection('joint_orders').doc(orderId).get()
        const order = orderResult.data[0]
        
        const message = `合坛法会已确认！\n订单号: ${orderId}\n项目: ${order.projectName || order.project_name || '合坛法会'}\n确认日期: ${fahuiDate}\n操作人: ${operator}\n确认时间: ${new Date().toLocaleString()}`
        
        await this.sendAdminNotification({
          type: 'fahui_confirmed',
          orderId,
          message: message
        })
      } catch (notifyError) {
        console.error('发送确认通知失败：', notifyError)
      }
      
      return { success: true, data: result }
    } catch (error) {
      console.error('确认合坛法会日期失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加订单备注
  async addOrderRemark(params) {
    try {
      const { orderId, remark, operator } = params
      
      if (!operator) {
        return { success: false, message: '操作人不能为空' }
      }
      
      if (!remark || !remark.trim()) {
        return { success: false, message: '备注内容不能为空' }
      }
      
      // 获取当前订单
      const orderResult = await db.collection('joint_orders')
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
      
      const result = await db.collection('joint_orders')
        .doc(orderId)
        .update({
          operations: order.operations,
          update_time: now
        })
      
      // 发送备注通知
      try {
        // 获取订单详情用于通知
        const orderResult = await db.collection('joint_orders').doc(orderId).get()
        const order = orderResult.data[0]
        
        const message = `订单备注已添加！\n订单号: ${orderId}\n项目: ${order.projectName || order.project_name || '合坛法会'}\n备注内容: ${remark.trim()}\n操作人: ${operator}\n操作时间: ${new Date().toLocaleString()}`
        
        await this.sendAdminNotification({
          type: 'order_remark_added',
          orderId,
          message: message
        })
      } catch (notifyError) {
        console.error('发送备注通知失败：', notifyError)
      }
      
      return { success: true, data: result }
    } catch (error) {
      console.error('添加订单备注失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除订单
  async deleteOrder(params) {
    try {
      const result = await db.collection('joint_orders')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除合坛法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 发送管理员通知
  async sendAdminNotification(params) {
    try {
      const { type, orderId, message } = params
      
      // 创建通知记录
      const notification = {
        type,
        orderId,
        message,
        isRead: false,
        createTime: new Date()
      }
      
      await db.collection('admin_notifications').add(notification)
      
      // 这里可以集成其他通知方式，如微信推送、邮件等
      console.log('管理员通知已创建:', notification)
      
      return { success: true }
    } catch (error) {
      console.error('发送管理员通知失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 支付成功后通知管理员（前台使用）
  async notifyAdminOnPayment(params) {
    try {
      const { order } = params
      
      if (!order) {
        return { success: false, message: '订单信息不能为空' }
      }
      
      const orderId = order._id || order.order_id
      const projectName = order.projectName || order.project_name || '合坛法会'
      const applicantCount = order.applicants ? order.applicants.length : 0
      const totalCost = order.totalCost || order.total_fee || 0
      
      // 创建管理员通知记录
      const notification = {
        type: 'joint_order_paid',
        title: '合坛法会订单支付成功',
        content: `合坛法会订单支付成功！\n订单号: ${orderId}\n法会项目: ${projectName}\n报名人数: ${applicantCount}人\n支付金额: ¥${totalCost}\n请及时确认此合坛法会`,
        order_id: orderId,
        is_read: false,
        create_time: new Date(),
        priority: 'high'
      }
      
      // 保存通知到数据库
      await db.collection('admin_notifications').add(notification)
      
      // 同时更新订单状态为待确认（如果还没有更新）
      await db.collection('joint_orders')
        .where({
          _id: orderId
        })
        .update({
          status: '待确认',
          update_time: new Date(),
          payTime: new Date()
        })
      
      console.log('[支付成功提醒] 合坛法会订单支付成功，已发送通知：', orderId)
      
      return { 
        success: true, 
        message: '通知发送成功',
        notification_id: notification._id
      }
    } catch (error) {
      console.error('支付成功提醒失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取管理员通知
  async getAdminNotifications() {
    try {
      const result = await db.collection('admin_notifications')
        .orderBy('createTime', 'desc')
        .limit(50)
        .get()
      
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取管理员通知失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 标记通知为已读
  async markNotificationAsRead(params) {
    try {
      const { notificationId } = params
      
      const result = await db.collection('admin_notifications')
        .doc(notificationId)
        .update({
          isRead: true,
          readTime: new Date()
        })
      
      return { success: true, data: result }
    } catch (error) {
      console.error('标记通知为已读失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取未读通知数量
  async getUnreadNotificationCount() {
    try {
      const result = await db.collection('admin_notifications')
        .where({
          isRead: false
        })
        .count()
      
      return { success: true, data: result.total }
    } catch (error) {
      console.error('获取未读通知数量失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 导出订单
  async exportOrders() {
    try {
      const result = await db.collection('joint_orders')
        .orderBy('createTime', 'desc')
        .get()
      
      const data = result.data.map(order => {
        // 处理报名者信息
        const applicantsInfo = order.applicants ? order.applicants.map(applicant => 
          `${applicant.name}(${applicant.phone})`
        ).join('; ') : ''
        
        // 处理代办物品信息
        const goodsInfo = order.goods ? order.goods.map(good => 
          `${good.name}x${good.qty || good.quantity}`
        ).join('; ') : ''
        
        // 处理收件信息
        const receiverInfo = order.receiver ? 
          `${order.receiver.name} ${order.receiver.phone} ${order.receiver.address}` : ''
        
        // 处理备注信息
        const remarksInfo = order.adminRemarks ? 
          order.adminRemarks.map(remark => 
            `${remark.content}(${remark.operator}-${new Date(remark.createTime).toLocaleString()})`
          ).join('; ') : ''
        
        // 处理操作日志
        const logsInfo = order.logs ? 
          order.logs.map(log => 
            `${log.action}(${log.operator}-${new Date(log.time).toLocaleString()})`
          ).join('; ') : ''
        
        return {
          _id: order._id,
          orderNo: order.orderNo || order._id,
          status: order.status,
          projectName: order.projectName || order.project_name,
          fahuiDate: order.fahuiDate || order.fahui_date,
          applicantCount: order.applicants ? order.applicants.length : 0,
          applicantsInfo: applicantsInfo,
          totalCost: order.totalCost || order.total_fee || 0,
          goodsInfo: goodsInfo,
          receiverInfo: receiverInfo,
          createTime: order.createTime || order.create_time,
          confirmTime: order.confirmTime || order.confirm_time,
          confirmBy: order.confirmBy || order.confirm_by,
          remarksInfo: remarksInfo,
          logsInfo: logsInfo,
          paymentMethod: order.paymentMethod || '',
          payTime: order.payTime || '',
          remark: order.remark || ''
        }
      })
      
      return { success: true, data }
    } catch (error) {
      console.error('导出合坛法会订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 物品管理 ====================
  
  // 获取物品
  async getGoods(params = {}) {
    try {
      console.log('🔍 获取合坛法会物品，参数:', params)
      
      if (params.projectId) {
        // 基于项目获取物品
        const projectRes = await db.collection('joint_projects').doc(params.projectId).get()
        if (projectRes.data && projectRes.data.length > 0) {
          const project = projectRes.data[0]
          const goods = project.goods || []
          console.log('🔍 项目物品:', goods)
          return { success: true, data: goods }
        } else {
          return { success: false, message: '项目不存在' }
        }
      } else {
        // 获取全局物品列表
        const result = await db.collection('joint_goods').get()
        return { success: true, data: result.data }
      }
    } catch (error) {
      console.error('🔍 获取合坛法会物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加物品
  async addGood(params) {
    try {
      console.log('🔍 添加合坛法会物品，参数:', params)
      
      if (params.projectId) {
        // 向项目添加物品
        const good = params.good
        if (!good || !good.name) {
          return { success: false, message: '物品信息不完整' }
        }
        
        const result = await db.collection('joint_projects').doc(params.projectId).update({
          goods: db.command.push([good]),
          update_time: new Date()
        })
        
        if (result.updated > 0) {
          return { success: true, message: '物品添加成功' }
        } else {
          return { success: false, message: '项目不存在或更新失败' }
        }
      } else {
        // 添加全局物品
        const result = await db.collection('joint_goods').add({
          ...params,
          create_time: new Date()
        })
        return { success: true, data: result }
      }
    } catch (error) {
      console.error('🔍 添加合坛法会物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新物品
  async updateGood(params) {
    try {
      console.log('🔍 更新合坛法会物品，参数:', params)
      
      if (params.projectId) {
        // 更新项目中的物品
        const { projectId, goodIndex, good } = params
        
        // 先获取项目
        const projectRes = await db.collection('joint_projects').doc(projectId).get()
        if (!projectRes.data || projectRes.data.length === 0) {
          return { success: false, message: '项目不存在' }
        }
        
        const project = projectRes.data[0]
        const goods = project.goods || []
        
        if (goodIndex >= 0 && goodIndex < goods.length) {
          goods[goodIndex] = { ...goods[goodIndex], ...good }
          
          const result = await db.collection('joint_projects').doc(projectId).update({
            goods: goods,
            update_time: new Date()
          })
          
          if (result.updated > 0) {
            return { success: true, message: '物品更新成功' }
          } else {
            return { success: false, message: '更新失败' }
          }
        } else {
          return { success: false, message: '物品索引无效' }
        }
      } else {
        // 更新全局物品
        const { _id, ...updateData } = params
        const result = await db.collection('joint_goods')
          .doc(_id)
          .update({
            ...updateData,
            update_time: new Date()
          })
        return { success: true, data: result }
      }
    } catch (error) {
      console.error('🔍 更新合坛法会物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除物品
  async deleteGood(params) {
    try {
      console.log('🔍 删除合坛法会物品，参数:', params)
      
      if (params.projectId) {
        // 删除项目中的物品
        const { projectId, goodIndex } = params
        
        // 先获取项目
        const projectRes = await db.collection('joint_projects').doc(projectId).get()
        if (!projectRes.data || projectRes.data.length === 0) {
          return { success: false, message: '项目不存在' }
        }
        
        const project = projectRes.data[0]
        const goods = project.goods || []
        
        if (goodIndex >= 0 && goodIndex < goods.length) {
          goods.splice(goodIndex, 1)
          
          const result = await db.collection('joint_projects').doc(projectId).update({
            goods: goods,
            update_time: new Date()
          })
          
          if (result.updated > 0) {
            return { success: true, message: '物品删除成功' }
          } else {
            return { success: false, message: '删除失败' }
          }
        } else {
          return { success: false, message: '物品索引无效' }
        }
      } else {
        // 删除全局物品
        const result = await db.collection('joint_goods')
          .doc(params._id)
          .remove()
        return { success: true, data: result }
      }
    } catch (error) {
      console.error('🔍 删除合坛法会物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取物品配置
  async getGoodsConfig() {
    try {
      console.log('🔍 获取合坛法会物品配置')
      const result = await db.collection('joint_goods_config').get()
      console.log('🔍 物品配置查询结果:', result)
      console.log('🔍 配置数据:', result.data[0] || null)
      return { success: true, data: result.data[0] || null }
    } catch (error) {
      console.error('🔍 获取合坛法会物品配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新物品配置
  async updateGoodsConfig(params) {
    try {
      console.log('🔍 更新合坛法会物品配置，参数:', params)
      
      // 先获取现有配置
      const configRes = await db.collection('joint_goods_config').get()
      console.log('🔍 现有配置查询结果:', configRes)
      
      if (configRes.data && configRes.data.length > 0) {
        // 如果存在配置，则更新
        const configId = configRes.data[0]._id
        console.log('🔍 配置ID:', configId)
        
        if (!configId) {
          console.error('🔍 配置ID为空，无法更新')
          return { success: false, message: '配置ID无效' }
        }
        
        const result = await db.collection('joint_goods_config')
          .doc(configId)
          .update({
            ...params,
            update_time: new Date()
          })
        console.log('🔍 更新结果:', result)
        return { success: true, data: result }
      } else {
        // 如果不存在配置，则创建新配置
        console.log('🔍 创建新配置')
        const result = await db.collection('joint_goods_config').add({
          ...params,
          create_time: new Date(),
          update_time: new Date()
        })
        console.log('🔍 创建结果:', result)
        return { success: true, data: result }
      }
    } catch (error) {
      console.error('🔍 更新合坛法会物品配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 收件管理 ====================
  
  // 获取收件人列表
  async getReceivers() {
    try {
      const result = await db.collection('joint_receivers').get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取合坛法会收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加收件人
  async addReceiver(params) {
    try {
      const result = await db.collection('joint_receivers').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加合坛法会收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新收件人
  async updateReceiver(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('joint_receivers')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新合坛法会收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除收件人
  async deleteReceiver(params) {
    try {
      const result = await db.collection('joint_receivers')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除合坛法会收件人失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取收件配置
  async getReceiverConfig() {
    try {
      const result = await db.collection('joint_receiver_config').get()
      return { success: true, data: result.data[0] || null }
    } catch (error) {
      console.error('获取合坛法会收件配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新收件配置
  async updateReceiverConfig(params) {
    try {
      console.log('🔍 更新合坛法会收件配置，参数:', params)
      
      // 先获取现有配置
      const configRes = await db.collection('joint_receiver_config').get()
      console.log('🔍 现有配置查询结果:', configRes)
      
      if (configRes.data && configRes.data.length > 0) {
        // 如果存在配置，则更新
        const configId = configRes.data[0]._id
        console.log('🔍 配置ID:', configId)
        
        if (!configId) {
          console.error('🔍 配置ID为空，无法更新')
          return { success: false, message: '配置ID无效' }
        }
        
        const result = await db.collection('joint_receiver_config')
          .doc(configId)
          .update({
            ...params,
            update_time: new Date()
          })
        console.log('🔍 更新结果:', result)
        return { success: true, data: result }
      } else {
        // 如果不存在配置，则创建新配置
        console.log('🔍 创建新配置')
        const result = await db.collection('joint_receiver_config').add({
          ...params,
          create_time: new Date(),
          update_time: new Date()
        })
        console.log('🔍 创建结果:', result)
        return { success: true, data: result }
      }
    } catch (error) {
      console.error('🔍 更新合坛法会收件配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 配置管理 ====================
  
  // 获取横幅列表
  async getBanners() {
    try {
      const result = await db.collection('joint_banners')
        .orderBy('order', 'asc')
        .orderBy('create_time', 'desc')
        .get()
      
      // 过滤掉没有_id的记录
      const validData = result.data.filter(item => item._id && item._id.trim() !== '')
      
      return { success: true, data: validData }
    } catch (error) {
      console.error('获取合坛法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 清理无效的头图记录
  async cleanInvalidBanners() {
    try {
      // 查询所有没有_id的记录
      const invalidRecords = await db.collection('joint_banners')
        .where({
          _id: db.command.eq('').or(db.command.eq(null)).or(db.command.eq(undefined))
        })
        .get()
      
      let deletedCount = 0
      if (invalidRecords.data.length > 0) {
        // 删除无效记录
        const deletePromises = invalidRecords.data.map(record => {
          return db.collection('joint_banners').doc(record._id).remove()
        })
        
        await Promise.all(deletePromises)
        deletedCount = invalidRecords.data.length
      }
      
      // 查询剩余的有效记录
      const validRecords = await db.collection('joint_banners')
        .where({
          _id: db.command.neq('').and(db.command.neq(null)).and(db.command.neq(undefined))
        })
        .get()
      
      return {
        success: true,
        message: '清理完成',
        deletedCount: deletedCount,
        remainingCount: validRecords.data.length,
        data: validRecords.data
      }
    } catch (error) {
      console.error('清理无效头图记录失败:', error)
      return { success: false, message: error.message }
    }
  },

  // 添加横幅
  async addBanner(params) {
    try {
      const result = await db.collection('joint_banners').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加合坛法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新横幅
  async updateBanner(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('joint_banners')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新合坛法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除横幅
  async deleteBanner(params) {
    try {
      const result = await db.collection('joint_banners')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除合坛法会横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取介绍列表
  async getIntros() {
    try {
      const result = await db.collection('joint_intros')
        .orderBy('order', 'asc')
        .get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取合坛法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加介绍
  async addIntro(params) {
    try {
      const result = await db.collection('joint_intros').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加合坛法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新介绍
  async updateIntro(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('joint_intros')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新合坛法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除介绍
  async deleteIntro(params) {
    try {
      const result = await db.collection('joint_intros')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除合坛法会介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新订单信息
  async updateOrder(params) {
    try {
      const { orderId, orderData, operator } = params
      
      if (!orderId) {
        return { success: false, message: '订单ID不能为空' }
      }
      
      if (!orderData) {
        return { success: false, message: '订单数据不能为空' }
      }
      
      console.log('更新订单，ID:', orderId)
      console.log('更新数据:', orderData)
      
      // 获取当前订单
      const orderResult = await db.collection('joint_orders')
        .doc(orderId)
        .get()
      
      if (!orderResult.data || orderResult.data.length === 0) {
        return { success: false, message: '订单不存在' }
      }
      
      const currentOrder = orderResult.data[0]
      const now = new Date()
      
      // 准备更新数据
      const updateData = {
        ...orderData,
        update_time: now
      }
      
      // 记录操作
      const operation = {
        type: '编辑订单信息',
        operator: operator || '管理员',
        time: now,
        remark: '修改了订单信息'
      }
      
      // 添加操作记录
      if (!currentOrder.operations) {
        currentOrder.operations = []
      }
      currentOrder.operations.push(operation)
      updateData.operations = currentOrder.operations
      
      const result = await db.collection('joint_orders')
        .doc(orderId)
        .update(updateData)
      
      console.log('订单更新成功:', result)
      
      return { success: true, data: result }
    } catch (error) {
      console.error('更新订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 测试方法 - 创建测试订单
  async createTestOrder() {
    try {
      console.log('🧪 开始创建测试订单...')
      
      const testOrder = {
        order_id: 'TEST' + Date.now(),
        orderNo: 'TEST' + Date.now(),
        type: 'joint_fahui',
        project_id: 'test_project',
        project_name: '测试合坛法会',
        projectName: '测试合坛法会',
        project_price: 100,
        selected_date: '2025-01-15',
        chaodu_type: '',
        applicants: [
          {
            name: '测试用户',
            gender: '男',
            phone: '13800138000',
            lunarBirthday: '1990-01-01',
            birthTime: '子时(23:00-01:00)',
            address: '测试地址'
          }
        ],
        deceased_list: [],
        selected_items: [],
        receiver: null,
        activity_fee: 100,
        goods_fee: 0,
        total_fee: 100,
        totalCost: 100,
        applicant_count: 1,
        status: '待支付',
        create_time: new Date(),
        createTime: new Date(),
        update_time: new Date()
      }
      
      console.log('🧪 测试订单数据:', testOrder)
      
      const result = await db.collection('joint_orders').add(testOrder)
      
      console.log('🧪 测试订单创建结果:', result)
      
      if (result.id) {
        console.log('✅ 测试订单创建成功，ID:', result.id)
        
        // 验证订单是否真的保存到了数据库
        const verifyResult = await db.collection('joint_orders').where({
          order_id: testOrder.order_id
        }).get()
        
        console.log('🔍 验证查询结果:', verifyResult)
        console.log('🔍 验证查询到的订单数量:', verifyResult.data.length)
        
        return { 
          success: true, 
          message: '测试订单创建成功，验证查询到' + verifyResult.data.length + '条记录',
          orderId: testOrder.order_id,
          result: result,
          verifyResult: verifyResult
        }
      } else {
        console.error('❌ 测试订单创建失败，没有返回ID')
        return { 
          success: false, 
          message: '测试订单创建失败，没有返回ID'
        }
      }
    } catch (error) {
      console.error('🧪 创建测试订单失败:', error)
      return { 
        success: false, 
        message: '创建测试订单失败: ' + error.message 
      }
    }
  }
} 