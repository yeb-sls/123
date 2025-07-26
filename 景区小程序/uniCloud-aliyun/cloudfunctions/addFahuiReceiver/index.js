// 新增收件人信息（前台调用）
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { name, phone, address, remark } = event
  if (!name || !phone || !address) {
    return { code: 1, msg: '请填写完整信息' }
  }
  await db.collection('fahui_receiver').add({ name, phone, address, remark, create_time: Date.now() })
  return { code: 0, msg: '保存成功' }
} 