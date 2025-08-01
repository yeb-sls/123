'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { orderId, content, operator } = event
    
    if (!orderId || !content) {
      return {
        success: false,
        message: '订单ID和备注内容不能为空'
      }
    }
    
    // 准备备注数据
    const remarkData = {
      order_id: orderId,
      content: content,
      operator: operator || '管理员',
      time: new Date()
    }
    
    // 插入备注到数据库
    const result = await db.collection('joint_order_remarks').add(remarkData)
    
    if (result.id) {
      // 同时更新订单的备注数组
      await db.collection('joint_orders')
        .where({
          order_id: orderId
        })
        .update({
          $push: {
            adminRemarks: remarkData
          },
          update_time: new Date()
        })
      
      return {
        success: true,
        message: '备注添加成功',
        remarkId: result.id
      }
    } else {
      return {
        success: false,
        message: '备注添加失败'
      }
    }
    
  } catch (error) {
    console.error('添加合坛法会订单备注失败:', error)
    return {
      success: false,
      message: '添加备注失败: ' + (error.message || error)
    }
  }
} 