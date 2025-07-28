'use strict';

const db = uniCloud.database()
const fahuiConfigsCollection = db.collection('fahui_configs')

exports.main = async (event, context) => {
  try {
    const { _id, ...updateData } = event
    
    if (!_id) {
      return {
        success: false,
        message: '缺少配置ID'
      }
    }
    
    // 更新数据
    const result = await fahuiConfigsCollection.doc(_id).update({
      ...updateData,
      updateTime: new Date()
    })
    
    if (result.updated === 1) {
      return {
        success: true,
        message: '更新成功'
      }
    } else {
      return {
        success: false,
        message: '更新失败，配置不存在'
      }
    }
  } catch (error) {
    console.error('更新法会配置失败：', error)
    return {
      success: false,
      message: '更新失败：' + error.message
    }
  }
} 