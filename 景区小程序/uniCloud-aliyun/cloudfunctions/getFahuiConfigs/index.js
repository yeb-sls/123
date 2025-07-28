'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const { type } = event
		const collection = db.collection('fahui_configs')
		
		let query = {}
		if (type && type !== 'all') {
			query.type = type
		}
		
		// 获取法会配置，按创建时间排序
		const result = await collection
			.where(query)
			.orderBy('createTime', 'desc')
			.get()
		
		return {
			code: 0,
			message: '获取成功',
			data: result.data
		}
	} catch (error) {
		console.error('获取法会配置失败:', error)
		return {
			code: -1,
			message: '获取失败',
			error: error.message
		}
	}
} 