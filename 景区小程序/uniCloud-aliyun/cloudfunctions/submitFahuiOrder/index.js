'use strict';

// 确保正确导出 main 函数
exports.main = async (event, context) => {
  try {
    const db = uniCloud.database()
    const orders = db.collection('fahui_orders')
    const { order } = event
    if (!order) {
      return { success: false, message: '缺少订单数据' }
    }
    // 构建完整订单对象
    const now = new Date()
    const orderNo = order.orderNo || ('FH' + now.getFullYear() + (now.getMonth()+1).toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0') + now.getHours().toString().padStart(2,'0') + now.getMinutes().toString().padStart(2,'0') + now.getSeconds().toString().padStart(2,'0') + Math.floor(Math.random()*1000).toString().padStart(3,'0'))
    const createTime = Number(order.timestamp) || Number(order.payTime) || now.getTime()
    const doc = {
      orderNo,
      fahuiProject: order.fahuiProject || {},
      fahuiName: order.fahuiProject?.name || order.fahuiName || '',
      applicants: order.applicants || [],
      participantName: order.applicants && order.applicants[0] ? order.applicants[0].name : '',
      phone: order.applicants && order.applicants[0] ? order.applicants[0].phone : '',
      spouse: order.spouse || null,
      chaoduType: order.chaoduType || '',
      deceasedList: order.deceasedList || [],
      goods: order.goods || [],
      receiver: order.receiver || {},
      amount: Number(order.totalPrice) || 0,
      totalFee: Number(order.totalFee) || Number(order.totalPrice) || 0,
      status: order.status || 'paid',
      paymentMethod: order.paymentMethod || '',
      payTime: order.payTime || now.getTime(),
      createTime,
      remark: order.remark || '',
      logs: [],
      adminRemarks: []
    }
    await orders.add(doc)
    return { success: true, orderNo }
  } catch (error) {
    console.error('提交法会订单失败：', error)
    return { success: false, message: error.message }
  }
} 