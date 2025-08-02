'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		console.log('云函数接收到的event:', JSON.stringify(event, null, 2))
		console.log('event类型:', typeof event)
		console.log('event.keys:', Object.keys(event))
		
		// 直接使用event作为intro数据
		const intro = event
		console.log('使用的intro数据:', JSON.stringify(intro, null, 2))
		console.log('intro类型:', typeof intro)
		console.log('intro是否为null:', intro === null)
		console.log('intro是否为undefined:', intro === undefined)
		console.log('intro.content:', intro?.content)
		console.log('intro.content类型:', typeof intro?.content)
		console.log('intro.content长度:', intro?.content ? intro.content.length : 0)
		
		if (!intro || !intro.content) {
			console.log('参数验证失败: intro存在=', !!intro, 'content存在=', !!intro?.content)
			console.log('intro的详细信息:', intro)
			return {
				code: -1,
				message: '参数不完整'
			}
		}
		
		const collection = db.collection('home_intros')
		
		// 获取当前最大排序值
		const maxOrderResult = await collection
			.orderBy('order', 'desc')
			.limit(1)
			.get()
		
		const maxOrder = maxOrderResult.data.length > 0 ? maxOrderResult.data[0].order : 0
		
		// 添加介绍内容
		const addData = {
			...intro,
			order: maxOrder + 1,
			createTime: new Date(),
			updateTime: new Date()
		}
		console.log('准备添加到数据库的数据:', JSON.stringify(addData, null, 2))
		
		const result = await collection.add(addData)
		
		return {
			code: 0,
			message: '添加成功',
			data: {
				_id: result.id,
				...intro,
				order: maxOrder + 1,
				createTime: new Date(),
				updateTime: new Date()
			}
		}
	} catch (error) {
		console.error('添加首页介绍失败:', error)
		return {
			code: -1,
			message: '添加失败',
			error: error.message
		}
	}
} 