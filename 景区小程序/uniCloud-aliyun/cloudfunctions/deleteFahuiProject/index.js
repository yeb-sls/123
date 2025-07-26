'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const { id } = event
  if (!id) return { code: 1, msg: '缺少 id 参数' }
  await db.collection('fahui_projects').doc(id).remove()
  return {
    code: 0,
    msg: '删除成功'
  }
} 