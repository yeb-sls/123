'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { projectId, good } = event;
    if (!projectId || !good || !good.name) {
      return {
        success: false,
        message: '参数不完整'
      };
    }
    // 向项目的 goods 数组添加新物品
    const result = await db.collection('joint_projects').doc(projectId).update({
      goods: db.command.push([good]),
      update_time: new Date()
    });
    if (result.updated > 0) {
      return {
        success: true,
        message: '物品添加成功'
      };
    } else {
      return {
        success: false,
        message: '项目不存在或未更新'
      };
    }
  } catch (error) {
    console.error('添加合坛法会代办物品失败:', error);
    return {
      success: false,
      message: '添加物品失败: ' + (error.message || error)
    };
  }
}; 