'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  const configId = 'fahui_goods_config';
  const res = await db.collection('fahui_goods_config').doc(configId).get()
  return {
    code: 0,
    data: res.data[0] || { enabled: false, goods: [] }
  }
} 