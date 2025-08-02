'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { orderId, operator } = event
    
    if (!orderId) {
      return {
        success: false,
        message: '订单ID不能为空'
      }
    }
    
    // 更新订单状态为已确认
    const result = await db.collection('joint_orders')
      .where({
        order_id: orderId
      })
      .update({
        status: '已确认',
        confirm_time: new Date(),
        confirm_operator: operator || '管理员',
        update_time: new Date()
      })
    
    if (result.updated > 0) {
      return {
        success: true,
        message: '订单确认成功'
      }
    } else {
      return {
        success: false,
        message: '订单不存在或确认失败'
      }
    }
    
  } catch (error) {
    console.error('确认合坛法会订单失败:', error)
    return {
      success: false,
      message: '确认订单失败: ' + (error.message || error)
    }
  }
} 