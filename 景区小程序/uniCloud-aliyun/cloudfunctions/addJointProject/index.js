'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { name, description, category, deadline, dates, maxApplicants, price } = event;
    if (!name || !price || !category || !deadline || !dates || !Array.isArray(dates) || dates.length === 0) {
      return {
        success: false,
        message: '请填写完整项目信息'
      };
    }
    const project = {
      name,
      description: description || '',
      category,
      deadline,
      dates,
      maxApplicants: maxApplicants ? Number(maxApplicants) : null,
      price: Number(price),
      create_time: new Date(),
      update_time: new Date()
    };
    const result = await db.collection('joint_projects').add(project);
    if (result.id) {
      return {
        success: true,
        message: '项目添加成功',
        projectId: result.id
      };
    } else {
      return {
        success: false,
        message: '项目添加失败'
      };
    }
  } catch (error) {
    console.error('添加合坛法会项目失败:', error);
    return {
      success: false,
      message: '添加项目失败: ' + (error.message || error)
    };
  }
}; 