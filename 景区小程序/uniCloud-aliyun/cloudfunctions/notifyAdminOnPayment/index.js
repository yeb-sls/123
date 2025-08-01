'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { order } = event
    
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
} 