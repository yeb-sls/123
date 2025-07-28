'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const { id, intro } = event
		
		if (!id || !intro) {
			return {
				code: -1,
				message: '参数不完整'
			}
		}
		
		const collection = db.collection('home_intros')
		
		// 更新介绍内容
		const result = await collection.doc(id).update({
			...intro,
			updateTime: new Date()
		})
		
		if (result.updated === 1) {
			return {
				code: 0,
				message: '更新成功'
			}
		} else {
			return {
				code: -1,
				message: '更新失败，记录不存在'
			}
		}
	} catch (error) {
		console.error('更新首页介绍失败:', error)
		return {
			code: -1,
			message: '更新失败',
			error: error.message
		}
	}
} 