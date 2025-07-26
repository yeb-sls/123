'use strict';

const db = uniCloud.database()
const fahuiOrdersCollection = db.collection('fahui_orders')

exports.main = async (event, context) => {
  try {
    const { orderId, remark, operator } = event
    if (!orderId || !remark) {
      return {
        success: false,
        message: '缺少参数'
      }
    }
    // 追加备注到 adminRemarks 数组，记录操作人和时间
    const remarkObj = {
      ...remark,
      author: operator || remark.author || '管理员',
      createTime: new Date()
    }
    const result = await fahuiOrdersCollection.doc(orderId).update({
      adminRemarks: db.command.push(remarkObj)
    })
    if (result.updated === 1) {
      return {
        success: true,
        message: '备注添加成功'
      }
    } else {
      return {
        success: false,
        message: '订单不存在'
      }
    }
  } catch (error) {
    console.error('添加备注失败：', error)
    return {
      success: false,
      message: '添加备注失败：' + error.message
    }
  }
} 