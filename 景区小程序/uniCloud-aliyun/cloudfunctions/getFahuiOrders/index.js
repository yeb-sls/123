'use strict';

const db = uniCloud.database()
const fahuiOrdersCollection = db.collection('fahui_orders')

exports.main = async (event, context) => {
  try {
    // 获取法会订单，支持按类型筛选
    let query = fahuiOrdersCollection.orderBy('createTime', 'desc')
    
    // 如果传入了类型参数，则按类型筛选
    if (event.type) {
      query = query.where({ fahuiType: event.type })
    }
    
    const result = await query.get()
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