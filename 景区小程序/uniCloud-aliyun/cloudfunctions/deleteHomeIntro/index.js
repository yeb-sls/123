'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const { id } = event
		
		if (!id) {
			return {
				code: -1,
				message: '参数不完整'
			}
		}
		
		const collection = db.collection('home_intros')
		
		// 删除介绍内容
		const result = await collection.doc(id).remove()
		
		if (result.deleted === 1) {
			return {
				code: 0,
				message: '删除成功'
			}
		} else {
			return {
				code: -1,
				message: '删除失败，记录不存在'
			}
		}
	} catch (error) {
		console.error('删除首页介绍失败:', error)
		return {
			code: -1,
			message: '删除失败',
			error: error.message
		}
	}
} 