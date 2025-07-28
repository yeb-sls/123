'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { intro } = event
  if (!intro) {
    return { code: 1, msg: '缺少 intro 参数' }
  }
  if ('_id' in intro) {
    delete intro._id;
  }
  intro.enabled = true
  intro.update_date = Date.now()
  const res = await db.collection('fahui_special_intro').add(intro)
  return {
    code: 0,
    data: { _id: res.id, ...intro }
  }
} 