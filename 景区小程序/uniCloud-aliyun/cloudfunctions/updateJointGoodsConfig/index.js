'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { enabled } = event
    console.log('🔍 更新合坛法会代办物品配置，参数:', event)
    
    if (enabled === undefined) {
      return {
        success: false,
        message: '启用状态不能为空'
      }
    }
    
    // 检查是否已有配置
    const configRes = await db.collection('joint_goods_config').limit(1).get()
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
      
      const result = await db.collection('joint_goods_config')
        .doc(configId)
        .update({
          enabled: enabled,
          update_time: new Date()
        })
      
      console.log('🔍 更新结果:', result)
      
      if (result.updated > 0) {
        return {
          success: true,
          message: '代办物品模块配置更新成功'
        }
      } else {
        return {
          success: false,
          message: '代办物品模块配置更新失败'
        }
      }
    } else {
      // 创建新配置
      console.log('🔍 创建新配置')
      const config = {
        enabled: enabled,
        create_time: new Date(),
        update_time: new Date()
      }
      
      const result = await db.collection('joint_goods_config').add(config)
      console.log('🔍 创建结果:', result)
      
      if (result.id) {
        return {
          success: true,
          message: '代办物品模块配置创建成功'
        }
      } else {
        return {
          success: false,
          message: '代办物品模块配置创建失败'
        }
      }
    }
    
  } catch (error) {
    console.error('🔍 更新合坛法会代办物品模块配置失败:', error)
    return {
      success: false,
      message: '更新代办物品模块配置失败: ' + (error.message || error)
    }
  }
} 