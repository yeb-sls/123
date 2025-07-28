'use strict';

const db = uniCloud.database()
const fahuiConfigsCollection = db.collection('fahui_configs')

exports.main = async (event, context) => {
  try {
    const { id } = event
    
    if (!id) {
      return {
        success: false,
        message: '缺少配置ID'
      }
    }
    
    // 删除数据
    const result = await fahuiConfigsCollection.doc(id).remove()
    
    if (result.deleted === 1) {
      return {
        success: true,
        message: '删除成功'
      }
    } else {
      return {
        success: false,
        message: '删除失败，配置不存在'
      }
    }
  } catch (error) {
    console.error('删除法会配置失败：', error)
    return {
      success: false,
      message: '删除失败：' + error.message
    }
  }
} 