'use strict';

const db = uniCloud.database()
const notificationsCollection = db.collection('admin_notifications')

exports.main = async (event, context) => {
  try {
    // 将所有未读通知标记为已读
    const result = await notificationsCollection
      .where({
        is_read: false
      })
      .update({
        is_read: true,
        read_time: new Date()
      })
    
    return {
      success: true,
      message: `已标记 ${result.updated} 条通知为已读`,
      updatedCount: result.updated
    }
    
  } catch (error) {
    console.error('标记所有通知为已读失败：', error)
    return {
      success: false,
      message: '操作失败：' + error.message
    }
  }
} 