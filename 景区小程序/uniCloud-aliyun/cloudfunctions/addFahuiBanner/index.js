'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { banner } = event;
  if (!banner) {
    return { code: 1, msg: '参数不完整' };
  }
  // 自动补充 create_time
  banner.create_time = Date.now();
  const res = await db.collection('fahui_banners').add(banner);
  return {
    code: 0,
    msg: '添加成功',
    data: {
      ...banner,
      _id: res.id || (res.ids && res.ids[0])
    }
  }
} 