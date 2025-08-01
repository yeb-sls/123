'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { enabled, nameRequired, phoneRequired, addressRequired } = event
    console.log('🔍 更新合坛法会收件配置，参数:', event)
    
    if (enabled === undefined) {
      return {
        success: false,
        message: '启用状态不能为空'
      }
    }
    
    // 检查是否已有配置
    const configRes = await db.collection('joint_receiver_config').limit(1).get()
    console.log('🔍 现有配置查询结果:', configRes)
    
    if (configRes.data.length > 0) {
      // 更新现有配置
      const configId = configRes.data[0]._id
      console.log('🔍 配置ID:', configId)
      
      if (!configId) {
        console.error('🔍 配置ID为空，无法更新')
        return {
          success: false,
          message: '配置ID无效'
        }
      }
      
      const updateData = {
        enabled: enabled,
        update_time: new Date()
      }
      
      // 添加可选配置参数
      if (nameRequired !== undefined) updateData.nameRequired = nameRequired
      if (phoneRequired !== undefined) updateData.phoneRequired = phoneRequired
      if (addressRequired !== undefined) updateData.addressRequired = addressRequired
      
      const result = await db.collection('joint_receiver_config')
        .doc(configId)
        .update(updateData)
      
      console.log('🔍 更新结果:', result)
      
      if (result.updated > 0) {
        return {
          success: true,
          message: '收件信息配置更新成功'
        }
      } else {
        return {
          success: false,
          message: '收件信息配置更新失败'
        }
      }
    } else {
      // 创建新配置
      console.log('🔍 创建新配置')
      const config = {
        enabled: enabled,
        nameRequired: nameRequired !== undefined ? nameRequired : true,
        phoneRequired: phoneRequired !== undefined ? phoneRequired : true,
        addressRequired: addressRequired !== undefined ? addressRequired : true,
        create_time: new Date(),
        update_time: new Date()
      }
      
      const result = await db.collection('joint_receiver_config').add(config)
      console.log('🔍 创建结果:', result)
      
      if (result.id) {
        return {
          success: true,
          message: '收件信息配置创建成功'
        }
      } else {
        return {
          success: false,
          message: '收件信息配置创建失败'
        }
      }
    }
    
  } catch (error) {
    console.error('🔍 更新合坛法会收件信息配置失败:', error)
    return {
      success: false,
      message: '更新收件信息配置失败: ' + (error.message || error)
    }
  }
} 