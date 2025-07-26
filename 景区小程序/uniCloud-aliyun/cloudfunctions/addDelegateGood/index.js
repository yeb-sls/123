'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { good } = event
  if (!good) return { code: 1, msg: '缺少 good 参数' }
  if ('_id' in good) delete good._id
  const res = await db.collection('delegate_goods').add(good)
  return {
    code: 0,
    data: { _id: res.id, ...good }
  }
} 