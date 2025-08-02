'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { id } = event
    
    if (!id) {
      return {
        code: 1,
        msg: '收件信息ID不能为空'
      }
    }
    
    // 删除收件信息
    const result = await db.collection('joint_receivers').doc(id).remove()
    
    if (result.deleted > 0) {
      return {
        code: 0,
        msg: '收件信息删除成功'
      }
    } else {
      return {
        code: 1,
        msg: '收件信息删除失败'
      }
    }
  } catch (error) {
    console.error('删除合坛法会收件信息失败:', error);
    return {
      code: 1,
      msg: '删除合坛法会收件信息失败',
      error: error.message || error
    }
  }
} 