'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const collection = db.collection('home_intros')
		
		// 获取所有启用的介绍内容，按排序字段排序
		const result = await collection
			.where({
				enabled: true
			})
			.orderBy('order', 'asc')
			.get()
		
		return {
			code: 0,
			message: '获取成功',
			data: result.data
		}
	} catch (error) {
		console.error('获取首页介绍失败:', error)
		return {
			code: -1,
			message: '获取失败',
			error: error.message
		}
	}
} 