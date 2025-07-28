'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  // 统计用户数
  const userRes = await db.collection('uni-id-users').count();
  // 统计订单数
  const orderRes = await db.collection('fahui_orders').count();
  // 统计今日订单数
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrderRes = await db.collection('fahui_orders').where({
    createTime: db.command.gte(today)
  }).count();
  // 统计总收入
  const revenueRes = await db.collection('fahui_orders').get();
  const totalRevenue = revenueRes.data.reduce((sum, o) => sum + (o.amount || 0), 0);
  return {
    code: 0,
    data: {
      totalUsers: userRes.total,
      totalOrders: orderRes.total,
      totalRevenue,
      todayOrders: todayOrderRes.total
    }
  };
}; 