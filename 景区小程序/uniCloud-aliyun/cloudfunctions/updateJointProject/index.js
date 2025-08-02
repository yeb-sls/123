'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { id, project } = event;
    if (!id || !project) {
      return {
        success: false,
        message: '参数不完整'
      };
    }
    project.update_time = new Date();
    const result = await db.collection('joint_projects').doc(id).update(project);
    if (result.updated > 0) {
      return {
        success: true,
        message: '项目更新成功'
      };
    } else {
      return {
        success: false,
        message: '项目不存在或未更新'
      };
    }
  } catch (error) {
    console.error('更新合坛法会项目失败:', error);
    return {
      success: false,
      message: '更新项目失败: ' + (error.message || error)
    };
  }
}; 