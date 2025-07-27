'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  try {
    // 查询合坛法会介绍集合
    const res = await db.collection('joint_intros').get()
    return {
      code: 0,
      data: res.data
    }
  } catch (error) {
    return {
      code: 1,
      msg: '查询合坛法会介绍失败',
      error: error.message || error
    }
  }
} 