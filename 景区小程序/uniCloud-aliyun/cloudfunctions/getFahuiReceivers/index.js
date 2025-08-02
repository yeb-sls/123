// 获取法会收件人信息列表
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const page = event.page || 1
  const pageSize = event.pageSize || 100
  const res = await db.collection('fahui_receiver')
    .orderBy('create_time', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  return {
    code: 0,
    data: res.data,
    total: res.affectedDocs
  }
} 