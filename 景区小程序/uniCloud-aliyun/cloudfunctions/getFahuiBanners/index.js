'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  // 查询所有头图，按创建时间倒序排列
  const res = await db.collection('fahui_banners').orderBy('create_time', 'desc').get();
  return {
    code: 0,
    data: res.data
  }
} 