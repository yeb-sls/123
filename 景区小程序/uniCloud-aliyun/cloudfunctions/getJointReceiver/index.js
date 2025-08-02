'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { _id } = event
    
    // 如果没有提供ID，则获取配置信息（保持向后兼容）
    if (!_id) {
      const configRes = await db.collection('joint_receiver_config').limit(1).get()
      
      if (configRes.data.length > 0) {
        return {
          code: 0,
          enabled: configRes.data[0].enabled || false
        }
      } else {
        return {
          code: 0,
          enabled: false
        }
      }
    }
    
    // 获取单个收件信息
    const result = await db.collection('joint_receivers').doc(_id).get()
    
    if (result.data.length > 0) {
      return {
        code: 0,
        data: result.data[0]
      }
    } else {
      return {
        code: 1,
        msg: '收件信息不存在'
      }
    }
    
  } catch (error) {
    console.error('获取合坛法会收件信息失败:', error);
    return {
      code: 1,
      msg: '获取收件信息失败',
      error: error.message || error
    }
  }
} 