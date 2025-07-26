'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		const { config } = event
		
		if (!config || !config.name || !config.description || !config.date || !config.price) {
			return {
				code: -1,
				message: '参数不完整'
			}
		}
		
		const collection = db.collection('fahui_configs')
		
		// 添加法会配置
		const result = await collection.add({
			...config,
			createTime: new Date(),
			updateTime: new Date()
		})
		
		return {
			code: 0,
			message: '添加成功',
			data: {
				_id: result.id,
				...config,
				createTime: new Date(),
				updateTime: new Date()
			}
		}
	} catch (error) {
		console.error('添加法会配置失败:', error)
		return {
			code: -1,
			message: '添加失败',
			error: error.message
		}
	}
} 