'use strict';

exports.main = async (event, context) => {
  try {
    const { order } = event
    // 这里只做日志提醒，后续可扩展为短信/邮件/微信消息
    console.log('[支付成功提醒] 有新专场法会订单支付成功：', order)
    return { success: true }
  } catch (error) {
    console.error('支付成功提醒失败：', error)
    return { success: false, message: error.message }
  }
} 