'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  console.log('addHomeBanner 被调用，参数:', event);
  const { banner } = event;
  
  if (!banner) {
    console.error('banner 参数为空');
    return {
      code: -1,
      message: 'banner 参数不能为空'
    };
  }
  
  banner.createTime = new Date();
  // 自动分配排序
  const maxOrder = await db.collection('home_banners').orderBy('order', 'desc').limit(1).get();
  banner.order = (maxOrder.data[0]?.order || 0) + 1;
  banner.status = banner.status || '启用';
  
  console.log('准备添加轮播图:', banner);
  const res = await db.collection('home_banners').add(banner);
  banner._id = res.id;
  
  console.log('轮播图添加成功，ID:', res.id);
  return {
    code: 0,
    data: banner
  };
}; 