'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { id, banner } = event;
  if (!id || !banner) {
    return { code: 1, msg: '参数不完整' };
  }
  // 过滤掉 _id 字段，避免报错
  if ('_id' in banner) {
    delete banner._id;
  }
  const res = await db.collection('fahui_banners').doc(id).update(banner);
  return {
    code: 0,
    msg: '更新成功',
    data: res
  }
} 