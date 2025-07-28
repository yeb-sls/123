'use strict';

const db = uniCloud.database()
const collection = db.collection('fahui_projects')

exports.main = async (event, context) => {
  try {
    const { project } = event
    if (!project || !project.name) {
      return { success: false, message: '缺少项目名称' }
    }
    // 确保 price 字段为数字
    const data = {
      ...project,
      price: Number(project.price) || 0
    }
    await collection.add(data)
    return { success: true }
  } catch (error) {
    console.error('新增法会项目失败：', error)
    return { success: false, message: error.message }
  }
} 