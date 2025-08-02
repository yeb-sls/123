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
    // 检查是否有关联订单
    const orderCount = await db.collection('joint_orders').where({ project_id: projectId }).count();
    if (orderCount.total > 0) {
      return {
        success: false,
        message: '该项目已有订单，无法删除'
      };
    }
    // 删除项目
    const result = await db.collection('joint_projects').doc(projectId).remove();
    if (result.deleted > 0) {
      return {
        success: true,
        message: '项目删除成功'
      };
    } else {
      return {
        success: false,
        message: '项目不存在或删除失败'
      };
    }
  } catch (error) {
    console.error('删除合坛法会项目失败:', error);
    return {
      success: false,
      message: '删除项目失败: ' + (error.message || error)
    };
  }
}; 