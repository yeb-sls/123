'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { intro } = event
  if (!intro) {
    return { code: 1, msg: '缺少 intro 参数' }
  }
  const res = await db.collection('fahui_intros').add(intro)
  return {
    code: 0,
    data: { _id: res.id, ...intro }
  }
} 