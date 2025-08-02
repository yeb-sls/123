'use strict';

const db = uniCloud.database()
const configCollection = db.collection('fahui_receiver_config')

exports.main = async (event, context) => {
  try {
    const { enabled } = event
    console.log('🔍 更新专场法会收件配置，参数:', event)
    
    if (typeof enabled === 'undefined') {
      return {
        success: false,
        message: '缺少 enabled 参数'
      }
    }
    
    // 只保留一条配置，若无则插入，有则更新
    const res = await configCollection.limit(1).get()
    console.log('🔍 现有配置查询结果:', res)
    
    if (res.data && res.data.length > 0) {
      // 更新
      const configId = res.data[0]._id
      console.log('🔍 配置ID:', configId)
      
      if (!configId) {
        console.error('🔍 配置ID为空，无法更新')
        return {
          success: false,
          message: '配置ID无效'
        }
      }
      
      await configCollection.doc(configId).update({ enabled: !!enabled })
      console.log('🔍 更新成功')
    } else {
      // 插入
      console.log('🔍 创建新配置')
      await configCollection.add({ enabled: !!enabled })
      console.log('🔍 创建成功')
    }
    
    return {
      success: true,
      enabled: !!enabled
    }
  } catch (error) {
    console.error('🔍 更新收件信息配置失败：', error)
    return {
      success: false,
      message: error.message
    }
  }
} 