'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { id } = event;
  await db.collection('home_banners').doc(id).remove();
  return { code: 0, msg: '删除成功' };
}; 