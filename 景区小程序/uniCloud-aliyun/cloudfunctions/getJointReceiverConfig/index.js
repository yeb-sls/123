'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    // 获取合坛法会收件信息配置
    const configRes = await db.collection('joint_receiver_config').limit(1).get()
    
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
          enabled: false,
          nameRequired: true,
          phoneRequired: true,
          addressRequired: true
        }
      }
    }
  } catch (error) {
    console.error('获取合坛法会收件信息配置失败:', error);
    return {
      code: 1,
      msg: '获取合坛法会收件信息配置失败',
      error: error.message || error
    }
  }
} 