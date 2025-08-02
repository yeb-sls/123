'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  console.log('updateFahuiSpecialIntro参数', event)
  const { id, intro } = event
  if (!id || !intro) {
    return { code: 1, msg: '缺少 id 或 intro 参数' }
  }
  if ('_id' in intro) {
    delete intro._id;
  }
  intro.update_date = Date.now()
  await db.collection('fahui_special_intro').doc(id).update(intro)
  return {
    code: 0,
    msg: '更新成功'
  }
} 