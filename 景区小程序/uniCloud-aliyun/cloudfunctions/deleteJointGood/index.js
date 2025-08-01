'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { projectId, goodIndex } = event;
    if (!projectId || goodIndex === undefined) {
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
    // 删除物品
    project.goods.splice(goodIndex, 1);
    const result = await db.collection('joint_projects').doc(projectId).update({
      goods: project.goods,
      update_time: new Date()
    });
    if (result.updated > 0) {
      return {
        success: true,
        message: '物品删除成功'
      };
    } else {
      return {
        success: false,
        message: '项目未更新'
      };
    }
  } catch (error) {
    console.error('删除合坛法会代办物品失败:', error);
    return {
      success: false,
      message: '删除物品失败: ' + (error.message || error)
    };
  }
}; 