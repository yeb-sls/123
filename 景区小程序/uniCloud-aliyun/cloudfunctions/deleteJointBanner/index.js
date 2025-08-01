'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    console.log('deleteJointBanner 函数开始执行')
    console.log('接收到的参数:', event)
    
    const { bannerId } = event
    
    console.log('接收到的完整参数:', event)
    console.log('提取的bannerId:', bannerId)
    console.log('bannerId类型:', typeof bannerId)
    console.log('bannerId是否为空:', !bannerId)
    
    if (!bannerId) {
      console.log('错误: 头图ID为空')
      return {
        success: false,
        message: '头图ID不能为空'
      }
    }
    
    if (typeof bannerId !== 'string' || bannerId.trim() === '') {
      console.log('错误: 头图ID格式无效')
      return {
        success: false,
        message: '头图ID格式无效'
      }
    }
    
    console.log('准备删除头图，ID:', bannerId)
    
    // 先检查头图是否存在
    const checkResult = await db.collection('joint_banners')
      .doc(bannerId)
      .get()
    
    console.log('检查头图存在结果:', checkResult)
    
    if (checkResult.data && checkResult.data.length === 0) {
      console.log('头图不存在')
      return {
        success: false,
        message: '头图不存在'
      }
    }
    
    // 删除头图
    console.log('开始删除头图...')
    const result = await db.collection('joint_banners')
      .doc(bannerId)
      .remove()
    
    console.log('删除操作结果:', result)
    
    if (result.deleted > 0) {
      console.log('删除成功')
      return {
        success: true,
        message: '头图删除成功'
      }
    } else {
      console.log('删除失败，deleted:', result.deleted)
      return {
        success: false,
        message: '头图删除失败'
      }
    }
    
  } catch (error) {
    console.error('删除合坛法会头图失败:', error)
    console.error('错误详情:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return {
      success: false,
      message: '删除头图失败: ' + (error.message || error)
    }
  }
} 