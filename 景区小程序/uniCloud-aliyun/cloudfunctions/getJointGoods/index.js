'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { projectId } = event;
    if (!projectId) {
      return {
        success: false,
        message: '项目ID不能为空'
      };
    }
    const res = await db.collection('joint_projects').doc(projectId).get();
    if (res.data && res.data.length > 0) {
      const goods = Array.isArray(res.data[0].goods) ? res.data[0].goods : [];
      return {
        success: true,
        data: goods
      };
    } else {
      return {
        success: false,
        message: '未找到该项目'
      };
    }
  } catch (error) {
    console.error('获取合坛法会代办物品失败:', error);
    return {
      success: false,
      message: '获取代办物品失败: ' + (error.message || error)
    };
  }
}; 