'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    // 获取合坛法会代办物品模块配置
    const configRes = await db.collection('joint_goods_config').limit(1).get()
    
    if (configRes.data.length > 0) {
      return {
        code: 0,
        data: configRes.data[0]
      }
    } else {
      // 返回默认配置
      return {
        code: 0,
        data: {
          enabled: false
        }
      }
    }
  } catch (error) {
    console.error('获取合坛法会代办物品模块配置失败:', error);
    return {
      code: 1,
      msg: '获取合坛法会代办物品模块配置失败',
      error: error.message || error
    }
  }
} 