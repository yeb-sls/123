'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { name, phone, address, orderId } = event
    
    // 验证必填字段
    if (!name || !name.trim()) {
      return {
        code: 1,
        msg: '收件人姓名不能为空'
      }
    }
    
    if (!phone || !phone.trim()) {
      return {
        code: 1,
        msg: '联系电话不能为空'
      }
    }
    
    if (!address || !address.trim()) {
      return {
        code: 1,
        msg: '收件地址不能为空'
      }
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return {
        code: 1,
        msg: '请输入正确的手机号码'
      }
    }
    
    // 创建收件信息
    const receiverData = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      orderId: orderId || null,
      create_time: new Date(),
      update_time: new Date()
    }
    
    const result = await db.collection('joint_receivers').add(receiverData)
    
    if (result.id) {
      return {
        code: 0,
        msg: '收件信息添加成功',
        data: {
          _id: result.id,
          ...receiverData
        }
      }
    } else {
      return {
        code: 1,
        msg: '收件信息添加失败'
      }
    }
    
  } catch (error) {
    console.error('添加合坛法会收件信息失败:', error);
    return {
      code: 1,
      msg: '添加收件信息失败',
      error: error.message || error
    }
  }
} 