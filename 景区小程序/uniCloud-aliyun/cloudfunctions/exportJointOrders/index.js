'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { status, projectName, startDate, endDate } = event
    
    // 构建查询条件
    let whereCondition = {}
    
    if (status && status !== '全部状态') {
      whereCondition.status = status
    }
    
    if (projectName && projectName !== '全部项目') {
      whereCondition.projectName = projectName
    }
    
    if (startDate && endDate) {
      whereCondition.createTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    // 查询订单数据
    const result = await db.collection('joint_orders')
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .get()
    
    const orders = result.data
    
    // 处理导出数据
    const exportData = orders.map(order => {
      // 处理报名者信息
      const applicantsInfo = order.applicants ? order.applicants.map(applicant => 
        `${applicant.name}(${applicant.phone})`
      ).join('; ') : ''
      
      // 处理代办物品信息
      const goodsInfo = order.goods ? order.goods.map(good => 
        `${good.name}x${good.qty || good.quantity}`
      ).join('; ') : ''
      
      // 处理收件信息
      const receiverInfo = order.receiver ? 
        `${order.receiver.name} ${order.receiver.phone} ${order.receiver.address}` : ''
      
      // 处理备注信息
      const remarksInfo = order.adminRemarks ? 
        order.adminRemarks.map(remark => 
          `${remark.content}(${remark.operator}-${new Date(remark.createTime).toLocaleString()})`
        ).join('; ') : ''
      
      // 处理操作日志
      const logsInfo = order.logs ? 
        order.logs.map(log => 
          `${log.action}(${log.operator}-${new Date(log.time).toLocaleString()})`
        ).join('; ') : ''
      
      return {
        _id: order._id,
        orderNo: order.orderNo || order._id,
        status: order.status,
        projectName: order.projectName || order.project_name,
        fahuiDate: order.fahuiDate || order.fahui_date,
        applicantCount: order.applicants ? order.applicants.length : 0,
        applicantsInfo: applicantsInfo,
        totalCost: order.totalCost || order.total_fee || 0,
        goodsInfo: goodsInfo,
        receiverInfo: receiverInfo,
        createTime: order.createTime || order.create_time,
        confirmTime: order.confirmTime || order.confirm_time,
        confirmBy: order.confirmBy || order.confirm_by,
        remarksInfo: remarksInfo,
        logsInfo: logsInfo,
        paymentMethod: order.paymentMethod || '',
        payTime: order.payTime || '',
        remark: order.remark || ''
      }
    })
    
    // 生成CSV格式
    const headers = [
      '订单号', '状态', '项目名称', '法会日期', '报名人数', '报名者信息',
      '总费用', '代办物品', '收件信息', '创建时间', '确认时间', '确认人', 
      '管理员备注', '操作日志', '支付方式', '支付时间'
    ]
    
    const csvRows = [headers]
    
    exportData.forEach(order => {
      csvRows.push([
        order._id,
        order.status,
        order.projectName,
        order.fahuiDate,
        order.applicantCount,
        order.applicantsInfo,
        order.totalCost,
        order.goodsInfo,
        order.receiverInfo,
        formatTime(order.createTime),
        formatTime(order.confirmTime),
        order.confirmBy,
        order.remarksInfo,
        order.logsInfo,
        order.paymentMethod,
        formatTime(order.payTime)
      ])
    })
    
    const csvContent = csvRows
      .map(row => row.map(cell => `"${cell || ''}"`).join(','))
      .join('\n')
    
    return {
      success: true,
      data: exportData,
      csvContent: csvContent,
      total: exportData.length
    }
    
  } catch (error) {
    console.error('导出合坛法会订单失败：', error)
    return { success: false, message: error.message }
  }
}

// 格式化时间
function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
} 