'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  try {
    const { id, intro } = event;
    if (!id || !intro) {
      return {
        success: false,
        message: '缺少参数'
      };
    }
    const res = await db.collection('joint_intros').doc(id).update(intro);
    if (res.updated > 0) {
      return {
        success: true,
        message: '介绍更新成功'
      };
    } else {
      return {
        success: false,
        message: '介绍更新失败或未找到记录'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '介绍更新异常: ' + (error.message || error)
    };
  }
}; 