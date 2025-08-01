'use strict';

const db = uniCloud.database()
const notificationsCollection = db.collection('admin_notifications')

exports.main = async (event, context) => {
  try {
    // 获取管理员通知，按创建时间倒序排列
    const result = await notificationsCollection
      .orderBy('create_time', 'desc')
      .get()
    
    return {
      success: true,
      data: result.data,
      message: '获取成功',
      total: result.data.length
    }
  } catch (error) {
    console.error('获取管理员通知失败：', error)
    return {
      success: false,
      data: [],
      message: '获取失败：' + error.message
    }
  }
} 