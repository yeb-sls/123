'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  try {
    // 查询合坛法会头图，按创建时间倒序排列
    const res = await db.collection('joint_banners').orderBy('create_time', 'desc').get();
    return {
      code: 0,
      data: res.data
    }
  } catch (error) {
    console.error('获取合坛法会头图失败:', error);
    return {
      code: 1,
      msg: '获取合坛法会头图失败',
      error: error.message || error
    }
  }
} 