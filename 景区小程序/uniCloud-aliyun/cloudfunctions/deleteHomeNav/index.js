'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { id } = event;
    
    if (!id) {
      throw new Error('缺少导航ID参数');
    }
    
    // 删除导航
    const result = await db.collection('home_navs').doc(id).remove();
    
    return {
      code: 0,
      message: '删除成功',
      data: result
    };
  } catch (error) {
    return {
      code: -1,
      message: '删除失败: ' + error.message,
      error: error.message
    };
  }
}; 