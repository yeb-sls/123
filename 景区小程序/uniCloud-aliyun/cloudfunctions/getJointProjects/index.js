'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  try {
    // 获取合坛法会项目
    const projectsRes = await db.collection('joint_projects').get()
    const projects = projectsRes.data
    
    // 统计每个项目的已报名人数
    for (let p of projects) {
      const orderCount = await db.collection('joint_orders').where({ project_id: p._id, status: '已支付' }).count()
      p.currentApplicants = orderCount.total
    }
    
    return {
      code: 0,
      data: projects
    }
  } catch (error) {
    console.error('获取合坛法会项目失败:', error);
    return {
      code: 1,
      msg: '获取合坛法会项目失败',
      error: error.message || error
    }
  }
} 