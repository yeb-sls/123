'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  // 获取所有法会项目
  const projectsRes = await db.collection('fahui_projects').get()
  const projects = projectsRes.data
  // 统计每个项目的已报名人数
  for (let p of projects) {
    const orderCount = await db.collection('fahui_orders').where({ project_id: p._id, status: '已支付' }).count()
    p.currentApplicants = orderCount.total
  }
  return {
    code: 0,
    data: projects
  }
} 