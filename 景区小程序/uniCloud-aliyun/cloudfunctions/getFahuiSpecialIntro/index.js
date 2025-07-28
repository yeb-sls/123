'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const res = await db.collection('fahui_special_intro').where({ enabled: true }).orderBy('update_date', 'desc').limit(1).get()
  return {
    code: 0,
    data: res.data && res.data.length > 0 ? res.data[0] : null
  }
} 