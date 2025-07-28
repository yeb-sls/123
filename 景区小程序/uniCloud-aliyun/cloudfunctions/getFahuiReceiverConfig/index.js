'use strict';

const db = uniCloud.database()
const configCollection = db.collection('fahui_receiver_config')

exports.main = async (event, context) => {
  try {
    // 只取一条配置
    const res = await configCollection.limit(1).get()
    let enabled = false
    if (res.data && res.data.length > 0) {
      enabled = !!res.data[0].enabled
    }
    return {
      enabled
    }
  } catch (error) {
    console.error('获取收件信息配置失败：', error)
    return {
      enabled: false,
      error: error.message
    }
  }
} 