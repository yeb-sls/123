'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const { _id, name, phone, address, orderId } = event
    
    // 验证必填字段
    if (!_id) {
      return {
        code: 1,
        msg: '收件信息ID不能为空'
      }
    }
    
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
    
    // 检查收件信息是否存在
    const existResult = await db.collection('joint_receivers').doc(_id).get()
    if (existResult.data.length === 0) {
      return {
        code: 1,
        msg: '收件信息不存在'
      }
    }
    
    // 更新收件信息
    const updateData = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      orderId: orderId || null,
      update_time: new Date()
    }
    
    const result = await db.collection('joint_receivers').doc(_id).update(updateData)
    
    if (result.updated > 0) {
      return {
        code: 0,
        msg: '收件信息更新成功',
        data: {
          _id: _id,
          ...updateData
        }
      }
    } else {
      return {
        code: 1,
        msg: '收件信息更新失败'
      }
    }
    
  } catch (error) {
    console.error('更新合坛法会收件信息失败:', error);
    return {
      code: 1,
      msg: '更新收件信息失败',
      error: error.message || error
    }
  }
} 