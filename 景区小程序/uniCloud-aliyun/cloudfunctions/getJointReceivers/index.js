'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    // 获取合坛法会收件信息列表
    const res = await db.collection('joint_receivers')
      .orderBy('create_time', 'desc')
      .get()
    
    return {
      code: 0,
      data: res.data || []
    }
  } catch (error) {
    console.error('获取合坛法会收件信息列表失败:', error);
    return {
      code: 1,
      msg: '获取合坛法会收件信息列表失败',
      error: error.message || error
    }
  }
} 