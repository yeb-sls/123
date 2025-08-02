'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  // 获取法会项目，支持按类型筛选
  let query = db.collection('fahui_projects')
  
  // 如果传入了类型参数，则按类型筛选
  if (event.type) {
    query = query.where({ type: event.type })
  }
  
  const projectsRes = await query.get()
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