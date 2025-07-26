'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  // 只维护一条配置文档
  const configId = 'fahui_goods_config'; // 固定ID
  let { enabled, goods } = event;
  // 健壮性处理
  if (!Array.isArray(goods)) goods = [];
  if (typeof enabled !== 'boolean') enabled = false;
  try {
    await db.collection('fahui_goods_config').doc(configId).set({
      enabled,
      goods
    })
    return { code: 0, msg: '更新成功' }
  } catch (e) {
    return { code: 1, msg: '更新失败', error: e }
  }
} 