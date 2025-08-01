'use strict';

const db = uniCloud.database()
const notificationsCollection = db.collection('admin_notifications')

exports.main = async (event, context) => {
  try {
    // 统计未读通知数量
    const result = await notificationsCollection
      .where({
        is_read: false
      })
      .count()
    
    return {
      success: true,
      count: result.total,
      message: '获取成功'
    }
  } catch (error) {
    console.error('获取未读通知数量失败：', error)
    return {
      success: false,
      count: 0,
      message: '获取失败：' + error.message
    }
  }
} 