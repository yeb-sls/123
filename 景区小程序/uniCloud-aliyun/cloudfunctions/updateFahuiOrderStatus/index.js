'use strict';

const db = uniCloud.database()
const fahuiOrdersCollection = db.collection('fahui_orders')

exports.main = async (event, context) => {
  try {
    const { id, status, operator, fahuiDate } = event
    
    if (!id) {
      return {
        success: false,
        message: '缺少订单ID'
      }
    }
    
    if (!status) {
      return {
        success: false,
        message: '缺少状态参数'
      }
    }
    
    // 构建更新内容
    const updateData = {
      status: status,
      updateTime: new Date()
    }
    if (typeof fahuiDate !== 'undefined') {
      updateData.fahuiDate = fahuiDate
    }
    if (status === '已确认') {
      updateData.confirmTime = new Date()
      updateData.confirmBy = operator || '管理员'
      // 记录操作日志
      updateData.logs = db.command.push({
        action: '确认',
        operator: operator || '管理员',
        time: new Date(),
        fahuiDate: fahuiDate || ''
      })
    } else if (status === '待确认') {
      updateData.confirmTime = null
      updateData.confirmBy = ''
      updateData.logs = db.command.push({
        action: '取消确认',
        operator: operator || '管理员',
        time: new Date()
      })
    }
    
    const result = await fahuiOrdersCollection.doc(id).update(updateData)
    
    if (result.updated === 1) {
      return {
        success: true,
        message: '状态更新成功'
      }
    } else {
      return {
        success: false,
        message: '更新失败，订单不存在'
      }
    }
  } catch (error) {
    console.error('更新法会订单状态失败：', error)
    return {
      success: false,
      message: '更新失败：' + error.message
    }
  }
} 