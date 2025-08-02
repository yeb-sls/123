'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { navs } = event;
    if (!navs || !Array.isArray(navs)) {
      throw new Error('navs 参数必须是一个数组');
    }
    // 批量更新导航排序
    const updatePromises = navs.map((nav, index) => {
      return db.collection('home_navs').doc(nav._id).update({
        order: index + 1,
        updateTime: new Date()
      });
    });
    await Promise.all(updatePromises);
    return {
      code: 0,
      message: '排序更新成功',
      data: { updated: true }
    };
  } catch (error) {
    return {
      code: -1,
      message: '排序更新失败: ' + error.message,
      error: error.message
    };
  }
}; 