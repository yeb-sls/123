'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  try {
    console.log('getHomeBanners 被调用');
    
    // 获取所有轮播图数据，按排序字段排序
    const res = await db.collection('home_banners')
      .orderBy('order', 'asc')
      .get();
    
    console.log('查询到的轮播图数据:', res.data);
    
    return {
      code: 0,
      data: res.data
    };
  } catch (error) {
    console.error('获取轮播图失败:', error);
    return {
      code: -1,
      message: '获取失败',
      error: error.message,
      data: []
    };
  }
}; 