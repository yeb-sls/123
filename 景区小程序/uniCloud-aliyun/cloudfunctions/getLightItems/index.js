'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const collection = db.collection('light_items')
		
		// 获取供灯项目，按推荐状态和创建时间排序
		const result = await collection
			.orderBy('recommended', 'desc')
			.orderBy('createTime', 'desc')
			.get()
		
		return {
			code: 0,
			message: '获取成功',
			data: result.data
		}
	} catch (error) {
		console.error('获取供灯项目失败:', error)
		return {
			code: -1,
			message: '获取失败',
			error: error.message
		}
	}
} 