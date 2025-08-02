'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { image, order } = event
    
    if (!image) {
      return {
        success: false,
        message: '图片不能为空'
      }
    }
    
    // 准备头图数据
    const banner = {
      image: image,
      order: order || 0,
      enabled: true,
      create_time: new Date(),
      update_time: new Date()
    }
    
    // 插入头图到数据库
    const result = await db.collection('joint_banners').add(banner)
    
    if (result.id) {
      return {
        success: true,
        message: '头图添加成功',
        bannerId: result.id
      }
    } else {
      return {
        success: false,
        message: '头图添加失败'
      }
    }
    
  } catch (error) {
    console.error('添加合坛法会头图失败:', error)
    return {
      success: false,
      message: '添加头图失败: ' + (error.message || error)
    }
  }
} 