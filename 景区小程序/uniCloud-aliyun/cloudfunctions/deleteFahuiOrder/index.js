'use strict';

const db = uniCloud.database()
const fahuiOrdersCollection = db.collection('fahui_orders')

exports.main = async (event, context) => {
  try {
    const { id } = event
    
    if (!id) {
      return {
        success: false,
        message: '缺少订单ID'
      }
    }
    
    // 删除订单
    const result = await fahuiOrdersCollection.doc(id).remove()
    
    if (result.deleted === 1) {
      return {
        success: true,
        message: '删除成功'
      }
    } else {
      return {
        success: false,
        message: '删除失败，订单不存在'
      }
    }
  } catch (error) {
    console.error('删除法会订单失败：', error)
    return {
      success: false,
      message: '删除失败：' + error.message
    }
  }
} 