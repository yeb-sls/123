'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  try {
    console.log('updateHomeBanner 被调用，参数:', event);
    const { id, banner } = event;
    
    if (!id) {
      throw new Error('轮播图ID不能为空')
    }
    
    if (!banner) {
      throw new Error('轮播图数据不能为空')
    }
    
    // 添加更新时间
    banner.updateTime = new Date()
    
    console.log('准备更新轮播图:', id, banner);
    const result = await db.collection('home_banners').doc(id).update(banner);
    console.log('更新结果:', result);
    
    if (result.updated === 1) {
      return { 
        code: 0, 
        msg: '更新成功',
        data: { updated: true }
      };
    } else {
      return { 
        code: -1, 
        msg: '更新失败，记录不存在',
        data: { updated: false }
      };
    }
  } catch (error) {
    console.error('更新轮播图失败:', error);
    return { 
      code: -1, 
      msg: '更新失败: ' + error.message,
      error: error.message
    };
  }
}; 