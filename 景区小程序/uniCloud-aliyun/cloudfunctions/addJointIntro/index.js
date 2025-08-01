'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { content, textColor, bgColor, bgImage, order } = event
    
    if (!content) {
      return {
        success: false,
        message: '介绍内容不能为空'
      }
    }
    
    // 准备介绍数据
    const intro = {
      content: content,
      textColor: textColor || '#333333',
      bgColor: bgColor || '#FFFFFF',
      bgImage: bgImage || '',
      order: order || 0,
      enabled: true,
      create_time: new Date(),
      update_time: new Date()
    }
    
    // 插入介绍到数据库
    const result = await db.collection('joint_intros').add(intro)
    
    if (result.id) {
      return {
        success: true,
        message: '介绍添加成功',
        introId: result.id
      }
    } else {
      return {
        success: false,
        message: '介绍添加失败'
      }
    }
    
  } catch (error) {
    console.error('添加合坛法会介绍失败:', error)
    return {
      success: false,
      message: '添加介绍失败: ' + (error.message || error)
    }
  }
} 