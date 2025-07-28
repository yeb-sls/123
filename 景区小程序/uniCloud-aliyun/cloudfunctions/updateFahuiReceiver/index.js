// 新增/编辑/删除法会收件人信息
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { _id, name, phone, address, remark, action } = event
  if (action === 'delete' && _id) {
    await db.collection('fahui_receiver').doc(_id).remove()
    return { code: 0, msg: '删除成功' }
  }
  if (!name || !phone || !address) {
    return { code: 1, msg: '请填写完整信息' }
  }
  if (_id) {
    await db.collection('fahui_receiver').doc(_id).update({ name, phone, address, remark })
    return { code: 0, msg: '更新成功' }
  } else {
    await db.collection('fahui_receiver').add({ name, phone, address, remark, create_time: Date.now() })
    return { code: 0, msg: '新增成功' }
  }
} 