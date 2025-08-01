'use strict';

const db = uniCloud.database()

module.exports = {
  // 获取未读通知数量
  async getUnreadCount() {
    try {
      const result = await db.collection('admin_notifications')
        .where({ is_read: false })
        .count()
      return { success: true, count: result.total }
    } catch (error) {
      console.error('获取未读通知数量失败：', error)
      return { success: false, count: 0, message: '获取失败：' + error.message }
    }
  },

  // 获取管理员通知列表
  async getNotifications() {
    try {
      const result = await db.collection('admin_notifications')
        .orderBy('create_time', 'desc')
        .get()
      return { success: true, data: result.data, total: result.data.length }
    } catch (error) {
      console.error('获取管理员通知失败：', error)
      return { success: false, data: [], message: '获取失败：' + error.message }
    }
  },

  // 标记单个通知为已读
  async markAsRead(params) {
    try {
      const { notificationId } = params
      
      if (!notificationId) {
        return { success: false, message: '通知ID不能为空' }
      }
      
      const result = await db.collection('admin_notifications')
        .doc(notificationId)
        .update({
          is_read: true,
          read_time: new Date()
        })
      
      if (result.updated > 0) {
        return { success: true, message: '已标记为已读' }
      } else {
        return { success: false, message: '通知不存在或更新失败' }
      }
    } catch (error) {
      console.error('标记通知为已读失败：', error)
      return { success: false, message: '操作失败：' + error.message }
    }
  },

  // 标记所有未读通知为已读
  async markAllAsRead() {
    try {
      const result = await db.collection('admin_notifications')
        .where({ is_read: false })
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
      return { success: false, message: '操作失败：' + error.message }
    }
  },

  // 创建通知
  async createNotification(params) {
    try {
      const { type, title, content, order_id, priority = 'normal' } = params
      
      if (!type || !title || !content) {
        return { success: false, message: '通知类型、标题和内容不能为空' }
      }
      
      const notification = {
        type,
        title,
        content,
        order_id,
        is_read: false,
        create_time: new Date(),
        priority
      }
      
      const result = await db.collection('admin_notifications').add(notification)
      
      return { 
        success: true, 
        message: '通知创建成功',
        data: result,
        notification_id: result.id
      }
    } catch (error) {
      console.error('创建通知失败：', error)
      return { success: false, message: '创建失败：' + error.message }
    }
  },

  // 删除通知
  async deleteNotification(params) {
    try {
      const { notificationId } = params
      
      if (!notificationId) {
        return { success: false, message: '通知ID不能为空' }
      }
      
      const result = await db.collection('admin_notifications')
        .doc(notificationId)
        .remove()
      
      if (result.deleted > 0) {
        return { success: true, message: '通知已删除' }
      } else {
        return { success: false, message: '通知不存在或删除失败' }
      }
    } catch (error) {
      console.error('删除通知失败：', error)
      return { success: false, message: '删除失败：' + error.message }
    }
  },

  // 清空所有通知
  async clearAllNotifications() {
    try {
      const result = await db.collection('admin_notifications').remove()
      
      return { 
        success: true, 
        message: `已清空 ${result.deleted} 条通知`,
        deletedCount: result.deleted
      }
    } catch (error) {
      console.error('清空通知失败：', error)
      return { success: false, message: '清空失败：' + error.message }
    }
  }
} 