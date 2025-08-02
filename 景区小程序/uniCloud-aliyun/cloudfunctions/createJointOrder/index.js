'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { orderData } = event
    
    if (!orderData) {
      return {
        success: false,
        message: '订单数据不能为空'
      }
    }
    
    // 生成订单号
    const orderId = 'JT' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase()
    
    // 准备订单数据
    const order = {
      order_id: orderId,
      type: 'joint_fahui',
      project_id: orderData.projectId,
      project_name: orderData.projectName,
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
      applicant_count: orderData.applicantCount,
      status: '待支付',
      create_time: new Date(),
      update_time: new Date()
    }
    
    // 插入订单到数据库
    const result = await db.collection('joint_orders').add(order)
    
    if (result.id) {
      return {
        success: true,
        orderId: orderId,
        message: '订单创建成功'
      }
    } else {
      return {
        success: false,
        message: '订单创建失败'
      }
    }
    
  } catch (error) {
    console.error('创建合坛法会订单失败:', error)
    return {
      success: false,
      message: '创建订单失败: ' + (error.message || error)
    }
  }
} 