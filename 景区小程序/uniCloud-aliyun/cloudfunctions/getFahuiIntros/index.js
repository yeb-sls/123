'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  try {
    // 查询法会介绍集合（如集合名为 fahui_intros）
    const res = await db.collection('fahui_intros').get()
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