'use strict';

const db = uniCloud.database()
const configCollection = db.collection('fahui_receiver_config')

exports.main = async (event, context) => {
  try {
    const { enabled } = event
    if (typeof enabled === 'undefined') {
      return {
        success: false,
        message: '缺少 enabled 参数'
      }
    }
    // 只保留一条配置，若无则插入，有则更新
    const res = await configCollection.limit(1).get()
    if (res.data && res.data.length > 0) {
      // 更新
      await configCollection.doc(res.data[0]._id).update({ enabled: !!enabled })
    } else {
      // 插入
      await configCollection.add({ enabled: !!enabled })
    }
    return {
      success: true,
      enabled: !!enabled
    }
  } catch (error) {
    console.error('更新收件信息配置失败：', error)
    return {
      success: false,
      message: error.message
    }
  }
} 