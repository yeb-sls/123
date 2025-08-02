'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  try {
    // 查询法会介绍集合，支持按类型筛选
    let query = db.collection('fahui_intros');
    
    // 如果传入了类型参数，则按类型筛选
    if (event.type) {
      query = query.where({ type: event.type });
    }
    
    const res = await query.get()
    return {
      code: 0,
      data: res.data
    }
  } catch (error) {
    return {
      code: 1,
      msg: '查询法会介绍失败',
      error: error.message || error
    }
  }
} 