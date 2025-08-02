'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { id, banner } = event
    
    if (!id || !banner) {
      return {
        success: false,
        message: 'ID和头图数据不能为空'
      }
    }
    
    // 更新头图数据
    const updateData = {
      ...banner,
      update_time: new Date()
    }
    
    const result = await db.collection('joint_banners')
      .doc(id)
      .update(updateData)
    
    if (result.updated > 0) {
      return {
        success: true,
        message: '头图更新成功'
      }
    } else {
      return {
        success: false,
        message: '头图不存在或更新失败'
      }
    }
    
  } catch (error) {
    console.error('更新合坛法会头图失败:', error)
    return {
      success: false,
      message: '更新头图失败: ' + (error.message || error)
    }
  }
} 