'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { id, intro } = event
  if (!id || !intro) {
    return { code: 1, msg: '缺少 id 或 intro 参数' }
  }
  if ('_id' in intro) {
    delete intro._id;
  }
  await db.collection('fahui_intros').doc(id).update(intro)
  return {
    code: 0,
    msg: '更新成功'
  }
} 