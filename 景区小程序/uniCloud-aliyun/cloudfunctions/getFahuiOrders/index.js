'use strict';

const db = uniCloud.database()
const fahuiOrdersCollection = db.collection('fahui_orders')

exports.main = async (event, context) => {
  try {
    // 获取所有法会订单，按创建时间倒序排列
    const result = await fahuiOrdersCollection
      .orderBy('createTime', 'desc')
      .get()
    // 确保返回 logs、confirmBy、confirmTime、adminRemarks 字段
    const data = result.data.map(order => ({
      ...order,
      logs: order.logs || [],
      confirmBy: order.confirmBy || '',
      confirmTime: order.confirmTime || '',
      adminRemarks: order.adminRemarks || []
    }))
    return {
      success: true,
      data: data,
      message: '获取成功'
    }
  } catch (error) {
    console.error('获取法会订单失败：', error)
    return {
      success: false,
      data: [],
      message: '获取失败：' + error.message
    }
  }
} 