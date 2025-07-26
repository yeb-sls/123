'use strict';
exports.main = async (event, context) => {
  // 返回模拟统计数据
  return {
    code: 0,
    data: {
      totalOrders: 123,
      pendingOrders: 5,
      totalRevenue: 45678,
      activeProjects: 3
    }
  }
} 