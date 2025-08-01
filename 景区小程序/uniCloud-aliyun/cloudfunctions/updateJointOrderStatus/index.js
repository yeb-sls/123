'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { orderId, status, action, operator } = event
    
    if (!orderId || !status) {
      return {
        success: false,
        message: '订单ID和状态不能为空'
      }
    }
    
    // 准备更新数据
    const updateData = {
      status: status,
      update_time: new Date()
    }
    
    // 如果是确认操作，记录确认人和确认时间
    if (status === '已确认') {
      updateData.confirmBy = operator || '管理员'
      updateData.confirmTime = new Date()
    }
    
    // 更新订单状态
    const result = await db.collection('joint_orders')
      .where({
        order_id: orderId
      })
      .update(updateData)
    
    if (result.updated > 0) {
      // 记录操作日志
      if (action) {
        const logData = {
          order_id: orderId,
          action: action,
          operator: operator || '管理员',
          time: new Date()
        }
        
        await db.collection('joint_order_logs').add(logData)
        
        // 同时更新订单的操作日志数组
        await db.collection('joint_orders')
          .where({
            order_id: orderId
          })
          .update({
            $push: {
              logs: logData
            }
          })
      }
      
      // 如果状态是已支付，发送通知给管理员
      if (status === '已支付') {
        await notifyAdmin(orderId)
      }
      
      return {
        success: true,
        message: '订单状态更新成功'
      }
    } else {
      return {
        success: false,
        message: '订单不存在或更新失败'
      }
    }
    
  } catch (error) {
    console.error('更新合坛法会订单状态失败:', error)
    return {
      success: false,
      message: '更新订单状态失败: ' + (error.message || error)
    }
  }
}

// 通知管理员
async function notifyAdmin(orderId) {
  try {
    // 获取订单详情
    const orderRes = await db.collection('joint_orders')
      .where({
        order_id: orderId
      })
      .get()
    
    if (orderRes.data.length > 0) {
      const order = orderRes.data[0]
      
      // 创建通知记录
      const notification = {
        type: 'joint_order_paid',
        title: '合坛法会订单支付成功',
        content: `订单号: ${orderId}\n法会项目: ${order.project_name}\n报名人数: ${order.applicant_count}人\n支付金额: ¥${order.total_fee}`,
        order_id: orderId,
        is_read: false,
        create_time: new Date()
      }
      
      await db.collection('admin_notifications').add(notification)
    }
  } catch (error) {
    console.error('发送管理员通知失败:', error)
  }
} 