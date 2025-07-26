'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { id } = event;
  if (!id) {
    return { code: 1, msg: '参数不完整' };
  }
  const res = await db.collection('fahui_banners').doc(id).remove();
  return {
    code: 0,
    msg: '删除成功',
    data: res
  }
} 