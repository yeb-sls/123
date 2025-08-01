'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { id } = event;
    if (!id) {
      return {
        success: false,
        message: '项目ID不能为空'
      };
    }
    const res = await db.collection('joint_projects').doc(id).get();
    if (res.data && res.data.length > 0) {
      return {
        success: true,
        data: res.data[0]
      };
    } else {
      return {
        success: false,
        message: '未找到该项目'
      };
    }
  } catch (error) {
    console.error('获取合坛法会项目详情失败:', error);
    return {
      success: false,
      message: '获取项目失败: ' + (error.message || error)
    };
  }
}; 