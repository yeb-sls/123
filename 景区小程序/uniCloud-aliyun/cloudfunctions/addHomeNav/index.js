'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { nav } = event
    const collection = db.collection('home_navs')
    
    // 获取当前最大排序值
    const maxOrderResult = await collection
      .orderBy('order', 'desc')
      .limit(1)
      .get()
    
    const newOrder = maxOrderResult.data.length > 0 ? maxOrderResult.data[0].order + 1 : 1
    
    // 添加导航
    const result = await collection.add({
      ...nav,
      order: newOrder,
      enabled: nav.enabled !== undefined ? nav.enabled : true,
      createTime: new Date(),
      updateTime: new Date()
    })
    
    return {
      code: 0,
      message: '添加成功',
      data: {
        _id: result.id,
        ...nav,
        order: newOrder,
        createTime: new Date(),
        updateTime: new Date()
      }
    }
  } catch (error) {
    console.error('添加导航失败:', error)
    return {
      code: -1,
      message: '添加失败',
      data: null
    }
  }
} 