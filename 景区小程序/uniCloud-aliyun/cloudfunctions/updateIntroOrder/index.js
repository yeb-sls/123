'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const { intros } = event
		
		if (!intros || !Array.isArray(intros)) {
			return {
				code: -1,
				message: '参数不完整'
			}
		}
		
		const collection = db.collection('home_intros')
		
		// 批量更新排序
		const updatePromises = intros.map((intro, index) => {
			return collection.doc(intro._id).update({
				order: index + 1,
				updateTime: new Date()
			})
		})
		
		await Promise.all(updatePromises)
		
		return {
			code: 0,
			message: '排序更新成功'
		}
	} catch (error) {
		console.error('更新介绍排序失败:', error)
		return {
			code: -1,
			message: '更新失败',
			error: error.message
		}
	}
} 