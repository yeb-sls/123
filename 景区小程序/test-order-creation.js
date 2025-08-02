// 合坛法会订单创建和获取测试脚本

// 模拟订单数据
const testOrderData = {
  type: 'joint_fahui',
  projectId: 'test_project_001',
  projectName: '测试合坛法会',
  projectPrice: 200,
  selectedDate: '2025-08-15',
  chaoduType: '',
  applicants: [
    {
      name: '测试用户',
      gender: '男',
      phone: '13800138000',
      lunarBirthday: '1990-01-01',
      birthTime: '子时',
      address: '测试地址'
    }
  ],
  spouse: null,
  deceasedList: [],
  selectedItems: [
    {
      name: '香烛',
      price: 50,
      count: 2
    }
  ],
  receiver: {
    name: '收件人',
    phone: '13800138001',
    address: '收件地址'
  },
  activityFee: 200,
  goodsFee: 100,
  totalFee: 300,
  applicantCount: 1,
  status: '待支付',
  createTime: new Date()
}

// 测试函数
async function testOrderCreation() {
  console.log('🧪 开始测试合坛法会订单创建和获取...')
  
  try {
    // 1. 测试创建订单
    console.log('📝 测试创建订单...')
    const createResult = await uniCloud.callObject({
      name: 'joint-management',
      method: 'createOrder',
      data: {
        orderData: testOrderData
      }
    })
    
    console.log('📝 创建订单结果:', createResult)
    
    if (createResult.result.success) {
      console.log('✅ 订单创建成功')
      
      // 2. 测试获取订单列表
      console.log('📋 测试获取订单列表...')
      const getOrdersResult = await uniCloud.callObject({
        name: 'joint-management',
        method: 'getOrders'
      })
      
      console.log('📋 获取订单列表结果:', getOrdersResult)
      
      if (getOrdersResult.success) {
        console.log('✅ 订单列表获取成功')
        console.log('📊 订单数量:', getOrdersResult.data.length)
        
        // 显示最新的几个订单
        const recentOrders = getOrdersResult.data.slice(0, 3)
        console.log('📋 最新订单:')
        recentOrders.forEach((order, index) => {
          console.log(`  ${index + 1}. 订单ID: ${order._id}`)
          console.log(`     项目: ${order.projectName || order.project_name}`)
          console.log(`     状态: ${order.status}`)
          console.log(`     金额: ¥${order.totalFee || order.total_fee}`)
          console.log(`     创建时间: ${order.createTime || order.create_time}`)
        })
      } else {
        console.log('❌ 订单列表获取失败:', getOrdersResult.message)
      }
    } else {
      console.log('❌ 订单创建失败:', createResult.result.message)
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

// 测试数据库连接
async function testDatabaseConnection() {
  console.log('🔗 测试数据库连接...')
  
  try {
    const result = await uniCloud.callObject({
      name: 'joint-management',
      method: 'getProjects'
    })
    
    if (result.success) {
      console.log('✅ 数据库连接正常')
      console.log('📊 项目数量:', result.data.length)
    } else {
      console.log('❌ 数据库连接失败:', result.message)
    }
  } catch (error) {
    console.error('❌ 数据库连接测试失败:', error)
  }
}

// 检查数据库集合
async function checkDatabaseCollections() {
  console.log('🗄️ 检查数据库集合...')
  
  try {
    // 检查订单集合
    const ordersResult = await uniCloud.callObject({
      name: 'joint-management',
      method: 'getOrders'
    })
    
    if (ordersResult.success) {
      console.log('✅ joint_orders 集合存在')
      console.log('📊 订单总数:', ordersResult.data.length)
    } else {
      console.log('❌ joint_orders 集合访问失败:', ordersResult.message)
    }
    
    // 检查项目集合
    const projectsResult = await uniCloud.callObject({
      name: 'joint-management',
      method: 'getProjects'
    })
    
    if (projectsResult.success) {
      console.log('✅ joint_projects 集合存在')
      console.log('📊 项目总数:', projectsResult.data.length)
    } else {
      console.log('❌ joint_projects 集合访问失败:', projectsResult.message)
    }
    
  } catch (error) {
    console.error('❌ 数据库集合检查失败:', error)
  }
}

// 主测试函数
async function runAllTests() {
  console.log('🚀 开始运行合坛法会订单系统测试...')
  console.log('=' * 50)
  
  // 1. 测试数据库连接
  await testDatabaseConnection()
  console.log('-' * 30)
  
  // 2. 检查数据库集合
  await checkDatabaseCollections()
  console.log('-' * 30)
  
  // 3. 测试订单创建和获取
  await testOrderCreation()
  console.log('-' * 30)
  
  console.log('🏁 测试完成')
}

// 导出测试函数
module.exports = {
  testOrderCreation,
  testDatabaseConnection,
  checkDatabaseCollections,
  runAllTests
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
  window.testJointOrders = {
    testOrderCreation,
    testDatabaseConnection,
    checkDatabaseCollections,
    runAllTests
  }
} 