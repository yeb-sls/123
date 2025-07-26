'use strict';

const db = uniCloud.database()
const collection = db.collection('fahui_projects')

exports.main = async (event, context) => {
  try {
    const { id, project } = event
    if (!id || !project) {
      return { success: false, message: '缺少参数' }
    }
    // 确保 price 字段为数字
    const data = {
      ...project,
      price: Number(project.price) || 0
    }
    await collection.doc(id).update(data)
    return { success: true }
  } catch (error) {
    console.error('更新法会项目失败：', error)
    return { success: false, message: error.message }
  }
} 