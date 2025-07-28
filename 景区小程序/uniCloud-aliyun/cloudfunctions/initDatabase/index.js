'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	try {
		console.log('开始初始化数据库...')
		const collections = [
			'home_banners',
			'home_navs', 
			'home_intros',
			'fahui_orders',
			'light_orders',
			'hall_orders',
			'gongde_orders',
			'activity_orders',
			'users',
			'system_config'
		]
		
		const results = []
		
		for (const collectionName of collections) {
			try {
				console.log(`检查集合: ${collectionName}`)
				// 检查集合是否存在
				const collection = db.collection(collectionName)
				const countResult = await collection.count()
				
				results.push({
					collection: collectionName,
					status: 'exists',
					count: countResult.total
				})
				console.log(`${collectionName} 集合存在，数据量: ${countResult.total}`)
			} catch (error) {
				console.error(`${collectionName} 集合检查失败:`, error)
				results.push({
					collection: collectionName,
					status: 'error',
					error: error.message
				})
			}
		}
		
		// 初始化一些示例数据
		console.log('开始初始化示例数据...')
		const initResult = await initSampleData()
		console.log('示例数据初始化完成:', initResult)
		
		return {
			code: 0,
			message: '数据库初始化完成',
			data: results,
			initResult: initResult
		}
	} catch (error) {
		console.error('数据库初始化失败:', error)
		return {
			code: -1,
			message: '初始化失败',
			error: error.message
		}
	}
}

// 初始化示例数据
async function initSampleData() {
	const db = uniCloud.database()
	const results = {}
	
	// 检查是否已有数据
	const bannerCount = await db.collection('home_banners').count()
	console.log('当前轮播图数量:', bannerCount.total)
	
	// 如果没有轮播图数据，添加示例数据
	if (bannerCount.total === 0) {
		console.log('添加示例轮播图数据...')
		
		// 添加三张示例轮播图
		const bannerData = [
			{
				imageUrl: 'https://x0.ifengimg.com/res/2021/B24BDD0F48689B1C72D12B447ADC687A0F7903FC_size249_w1080_h720.jpeg',
				title: '景区风光一',
				description: '美丽的景区风光展示',
				linkUrl: '',
				status: '启用',
				order: 1,
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				imageUrl: 'https://p2.itc.cn/q_70/images01/20211028/f0c35680e83a488cbecc2375c11b6e6f.jpeg',
				title: '景区风光二',
				description: '美丽的景区风光展示',
				linkUrl: '',
				status: '启用',
				order: 2,
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.3_6OJZXzr7fOnsIcOBixnQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
				title: '景区风光三',
				description: '美丽的景区风光展示',
				linkUrl: '',
				status: '启用',
				order: 3,
				createTime: new Date(),
				updateTime: new Date()
			}
		]
		
		for (let i = 0; i < bannerData.length; i++) {
			const bannerResult = await db.collection('home_banners').add(bannerData[i])
			console.log(`轮播图${i+1}添加成功，ID:`, bannerResult.id)
		}
		
		results.banner = { added: true, count: bannerData.length }
		console.log('轮播图数据添加完成')
	} else {
		results.banner = { added: false, count: bannerCount.total }
		console.log('轮播图数据已存在，跳过添加')
	}
	
	// 检查导航数据
	const navCount = await db.collection('home_navs').count()
	console.log('当前导航数量:', navCount.total)
	
	// 如果没有导航数据，添加示例数据
	if (navCount.total === 0) {
		console.log('添加示例导航数据...')
		const sampleNavs = [
			{ text: '专场法会', icon: '🕉️', url: '/pages/fahui/special', color: '#FF6B35', bgColor: '#FFF7EC', enabled: true, order: 1 },
			{ text: '合坛法会', icon: '🙏', url: '/pages/fahui/group', color: '#2D8CF0', bgColor: '#E0EAFF', enabled: true, order: 2 },
			{ text: '供灯祈福', icon: '💡', url: '/pages/light/index', color: '#FFD700', bgColor: '#FFFBF0', enabled: true, order: 3 },
			{ text: '殿堂供品', icon: '🏛️', url: '/pages/hall/index', color: '#8B4513', bgColor: '#F5F5DC', enabled: true, order: 4 },
			{ text: '功德布施', icon: '💰', url: '/pages/gongde/index', color: '#32CD32', bgColor: '#F0FFF0', enabled: true, order: 5 },
			{ text: '活动报名', icon: '🎯', url: '/pages/order/index', color: '#FF69B4', bgColor: '#FFF0F5', enabled: true, order: 6 }
		]
		
		const navResults = []
		for (const nav of sampleNavs) {
			const result = await db.collection('home_navs').add({
				...nav,
				createTime: new Date(),
				updateTime: new Date()
			})
			navResults.push({ text: nav.text, id: result.id })
		}
		results.nav = { added: true, count: navResults.length, items: navResults }
		console.log('导航添加成功，共', navResults.length, '个')
	} else {
		results.nav = { added: false, count: navCount.total }
		console.log('导航数据已存在，跳过添加')
	}
	
	// 检查介绍数据
	const introCount = await db.collection('home_intros').count()
	console.log('当前介绍数量:', introCount.total)
	
	// 如果没有介绍数据，添加示例数据
	if (introCount.total === 0) {
		console.log('添加示例介绍数据...')
		const introResult = await db.collection('home_intros').add({
			type: 'intro',
			title: '景区小程序介绍',
			content: '欢迎使用景区小程序，提供法会报名、供灯、殿堂供品、功德布施、活动等一站式服务，助您方便参与各类善举。',
			bgImage: '',
			enabled: true,
			showBorder: true,
			textColor: '#333333',
			bgColor: '#FFFFFF',
			order: 1,
			createTime: new Date(),
			updateTime: new Date()
		})
		results.intro = { added: true, id: introResult.id }
		console.log('介绍添加成功，ID:', introResult.id)
	} else {
		results.intro = { added: false, count: introCount.total }
		console.log('介绍数据已存在，跳过添加')
	}
	
	return results
} 