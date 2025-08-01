'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { projectId, goodIndex, good } = event;
    if (!projectId || goodIndex === undefined || !good) {
      return {
        success: false,
        message: '参数不完整'
      };
    }
    // 获取项目
    const projectRes = await db.collection('joint_projects').doc(projectId).get();
    if (!projectRes.data || projectRes.data.length === 0) {
      return {
        success: false,
        message: '项目不存在'
      };
    }
    const project = projectRes.data[0];
    if (!Array.isArray(project.goods) || goodIndex < 0 || goodIndex >= project.goods.length) {
      return {
        success: false,
        message: '物品索引无效'
      };
    }
    // 更新物品
    project.goods[goodIndex] = good;
    const result = await db.collection('joint_projects').doc(projectId).update({
      goods: project.goods,
      update_time: new Date()
    });
    if (result.updated > 0) {
      return {
        success: true,
        message: '物品更新成功'
      };
    } else {
      return {
        success: false,
        message: '项目未更新'
      };
    }
  } catch (error) {
    console.error('更新合坛法会代办物品失败:', error);
    return {
      success: false,
      message: '更新物品失败: ' + (error.message || error)
    };
  }
}; 