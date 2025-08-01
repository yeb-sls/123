'use strict';

const db = uniCloud.database()
const notificationsCollection = db.collection('admin_notifications')

exports.main = async (event, context) => {
  try {
    const { notificationId } = event
    
    if (!notificationId) {
      return {
        success: false,
        message: '通知ID不能为空'
      }
    }
    
    // 更新通知状态为已读
    const result = await notificationsCollection
      .doc(notificationId)
      .update({
        is_read: true,
        read_time: new Date()
      })
    
    if (result.updated > 0) {
      return {
        success: true,
        message: '已标记为已读'
      }
    } else {
      return {
        success: false,
        message: '通知不存在或更新失败'
      }
    }
    
  } catch (error) {
    console.error('标记通知为已读失败：', error)
    return {
      success: false,
      message: '操作失败：' + error.message
    }
  }
} 