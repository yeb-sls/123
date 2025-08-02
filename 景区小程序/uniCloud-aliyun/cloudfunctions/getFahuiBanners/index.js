'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  // 查询头图，支持按类型筛选
  let query = db.collection('fahui_banners').orderBy('create_time', 'desc');
  
  // 如果传入了类型参数，则按类型筛选
  if (event.type) {
    query = query.where({ type: event.type });
  }
  
  const res = await query.get();
  return {
    code: 0,
    data: res.data
  }
} 