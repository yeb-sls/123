'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { id, nav } = event;
    
    if (!id) {
      throw new Error('缺少导航ID参数');
    }
    
    if (!nav) {
      throw new Error('缺少导航数据参数');
    }
    
    // 更新导航
    const result = await db.collection('home_navs').doc(id).update({
      text: nav.text,
      icon: nav.icon,
      url: nav.url,
      color: nav.color,
      bgColor: nav.bgColor,
      enabled: nav.enabled,
      updateTime: new Date()
    });
    
    return {
      code: 0,
      message: '更新成功',
      data: result
    };
  } catch (error) {
    return {
      code: -1,
      message: '更新失败: ' + error.message,
      error: error.message
    };
  }
}; 