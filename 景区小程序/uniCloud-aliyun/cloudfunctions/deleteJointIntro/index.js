'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { introId } = event
    
    if (!introId) {
      return {
        success: false,
        message: '介绍ID不能为空'
      }
    }
    
    // 删除介绍
    const result = await db.collection('joint_intros')
      .doc(introId)
      .remove()
    
    if (result.deleted > 0) {
      return {
        success: true,
        message: '介绍删除成功'
      }
    } else {
      return {
        success: false,
        message: '介绍不存在或删除失败'
      }
    }
    
  } catch (error) {
    console.error('删除合坛法会介绍失败:', error)
    return {
      success: false,
      message: '删除介绍失败: ' + (error.message || error)
    }
  }
} 