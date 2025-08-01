'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const { docId, newOrder } = event
		
		if (!docId || typeof docId !== 'string') {
			return {
				success: false,
				message: 'docId必须为字符串'
			}
		}
		
		if (typeof newOrder !== 'number' || newOrder < 1) {
			return {
				success: false,
				message: 'newOrder必须为正整数'
			}
		}
		
		const collection = db.collection('home_intros')
		
		// 更新单个文档的排序
		const result = await collection.doc(docId).update({
			order: newOrder,
			updateTime: new Date()
		})
		
		if (result.updated === 1) {
			return {
				success: true,
				message: '排序更新成功'
			}
		} else {
			return {
				success: false,
				message: '文档不存在或更新失败'
			}
		}
	} catch (error) {
		console.error('更新介绍排序失败:', error)
		return {
			success: false,
			message: '更新失败: ' + error.message
		}
	}
} 