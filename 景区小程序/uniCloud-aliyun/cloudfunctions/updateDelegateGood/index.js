'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { id, good } = event
  if (!id || !good) return { code: 1, msg: '缺少 id 或 good 参数' }
  if ('_id' in good) delete good._id
  await db.collection('delegate_goods').doc(id).update(good)
  return {
    code: 0,
    msg: '更新成功'
  }
} 