'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const collection = db.collection('home_navs')
    
    // 获取所有导航，按排序字段排序
    const result = await collection
      .orderBy('order', 'asc')
      .get()
    
    return {
      code: 0,
      message: '获取成功',
      data: result.data
    }
  } catch (error) {
    console.error('获取导航失败:', error)
    return {
      code: -1,
      message: '获取失败',
      data: []
    }
  }
} 