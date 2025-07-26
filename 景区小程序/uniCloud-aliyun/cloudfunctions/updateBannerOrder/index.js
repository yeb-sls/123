'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    console.log('updateBannerOrder 被调用，参数:', event);
    const { banners } = event;
    
    if (!banners || !Array.isArray(banners)) {
      throw new Error('banners 参数必须是一个数组')
    }
    
    console.log('准备更新轮播图排序，数据:', banners);
    
    // 批量更新轮播图排序
    const updatePromises = banners.map((banner, index) => {
      return db.collection('home_banners').doc(banner._id).update({
        order: index + 1,
        updateTime: new Date()
      });
    });
    
    await Promise.all(updatePromises);
    
    console.log('轮播图排序更新成功');
    
    return {
      code: 0,
      message: '排序更新成功',
      data: { updated: true }
    };
  } catch (error) {
    console.error('更新轮播图排序失败:', error);
    return {
      code: -1,
      message: '排序更新失败: ' + error.message,
      error: error.message
    };
  }
}; 