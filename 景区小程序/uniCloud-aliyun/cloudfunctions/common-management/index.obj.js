'use strict';

const db = uniCloud.database()

module.exports = {
  // ==================== 首页管理 ====================
  
  // 获取首页横幅列表
  async getHomeBanners() {
    try {
      const result = await db.collection('home_banners')
        .orderBy('order', 'asc')
        .get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取首页横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加首页横幅
  async addHomeBanner(params) {
    try {
      const result = await db.collection('home_banners').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加首页横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新首页横幅
  async updateHomeBanner(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('home_banners')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新首页横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除首页横幅
  async deleteHomeBanner(params) {
    try {
      const result = await db.collection('home_banners')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除首页横幅失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 导航管理 ====================
  
  // 获取首页导航列表
  async getHomeNavs() {
    try {
      const result = await db.collection('home_navs')
        .orderBy('order', 'asc')
        .get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取首页导航失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加首页导航
  async addHomeNav(params) {
    try {
      const { nav } = params
      
      // 获取当前最大排序值
      const maxOrderResult = await db.collection('home_navs')
        .orderBy('order', 'desc')
        .limit(1)
        .get()
      
      const newOrder = maxOrderResult.data.length > 0 ? maxOrderResult.data[0].order + 1 : 1
      
      // 添加导航
      const result = await db.collection('home_navs').add({
        ...nav,
        order: newOrder,
        enabled: nav.enabled !== undefined ? nav.enabled : true,
        create_time: new Date(),
        update_time: new Date()
      })
      
      // 返回完整的导航数据
      const newNav = {
        _id: result.id,
        ...nav,
        order: newOrder,
        enabled: nav.enabled !== undefined ? nav.enabled : true,
        create_time: new Date(),
        update_time: new Date()
      }
      
      return { success: true, data: newNav }
    } catch (error) {
      console.error('添加首页导航失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新首页导航
  async updateHomeNav(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('home_navs')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新首页导航失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除首页导航
  async deleteHomeNav(params) {
    try {
      const result = await db.collection('home_navs')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除首页导航失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 介绍管理 ====================
  
  // 获取首页介绍列表
  async getHomeIntros() {
    try {
      const result = await db.collection('home_intros')
        .orderBy('order', 'asc')
        .get()
      
      console.log('获取到的首页介绍数据:', result.data)
      console.log('数据验证:')
      result.data.forEach((intro, index) => {
        console.log(`介绍${index}: _id=${intro._id}, 类型=${typeof intro._id}, 内容=${intro.content ? intro.content.substring(0, 20) + '...' : '无内容'}`)
      })
      
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取首页介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加首页介绍
  async addHomeIntro(params) {
    try {
      const result = await db.collection('home_intros').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加首页介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新首页介绍
  async updateHomeIntro(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('home_intros')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新首页介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除首页介绍
  async deleteHomeIntro(params) {
    try {
      const result = await db.collection('home_intros')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除首页介绍失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 供灯管理 ====================
  
  // 获取供灯项目列表
  async getLightItems() {
    try {
      const result = await db.collection('light_items').get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取供灯项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加供灯项目
  async addLightItem(params) {
    try {
      const result = await db.collection('light_items').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加供灯项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新供灯项目
  async updateLightItem(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('light_items')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新供灯项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除供灯项目
  async deleteLightItem(params) {
    try {
      const result = await db.collection('light_items')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除供灯项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 殿堂管理 ====================
  
  // 获取殿堂项目列表
  async getHallItems() {
    try {
      const result = await db.collection('hall_items').get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取殿堂项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加殿堂项目
  async addHallItem(params) {
    try {
      const result = await db.collection('hall_items').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加殿堂项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新殿堂项目
  async updateHallItem(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('hall_items')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新殿堂项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除殿堂项目
  async deleteHallItem(params) {
    try {
      const result = await db.collection('hall_items')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除殿堂项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 代办物品管理 ====================
  
  // 获取代办物品列表
  async getDelegateGoods() {
    try {
      const result = await db.collection('delegate_goods').get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取代办物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加代办物品
  async addDelegateGood(params) {
    try {
      const result = await db.collection('delegate_goods').add({
        ...params,
        create_time: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加代办物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新代办物品
  async updateDelegateGood(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('delegate_goods')
        .doc(_id)
        .update({
          ...updateData,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新代办物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除代办物品
  async deleteDelegateGood(params) {
    try {
      const result = await db.collection('delegate_goods')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除代办物品失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 功德管理 ====================
  
  // 获取功德配置
  async getGongdeConfig() {
    try {
      const result = await db.collection('gongde_config').get()
      return { success: true, data: result.data[0] || null }
    } catch (error) {
      console.error('获取功德配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新功德配置
  async updateGongdeConfig(params) {
    try {
      const result = await db.collection('gongde_config')
        .doc(params._id)
        .update({
          ...params,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新功德配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 殿堂管理 ====================
  
  // 获取殿堂配置
  async getHallConfig() {
    try {
      const result = await db.collection('hall_config').get()
      return { success: true, data: result.data[0] || null }
    } catch (error) {
      console.error('获取殿堂配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新殿堂配置
  async updateHallConfig(params) {
    try {
      const result = await db.collection('hall_config')
        .doc(params._id)
        .update({
          ...params,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新殿堂配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 供灯管理 ====================
  
  // 获取供灯配置
  async getLightConfig() {
    try {
      const result = await db.collection('light_config').get()
      return { success: true, data: result.data[0] || null }
    } catch (error) {
      console.error('获取供灯配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新供灯配置
  async updateLightConfig(params) {
    try {
      const result = await db.collection('light_config')
        .doc(params._id)
        .update({
          ...params,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新供灯配置失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 通用功能 ====================
  
  // 更新排序
  async updateOrder(params) {
    try {
      const { collection, _id, order } = params
      const result = await db.collection(collection)
        .doc(_id)
        .update({
          order,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新排序失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新介绍排序
  async updateIntroOrder(params) {
    try {
      // 支持多种参数名
      const { _id, docId, order, newOrder, intros } = params
      const id = _id || docId
      const orderValue = order || newOrder
      
      // 支持批量更新
      if (intros && Array.isArray(intros)) {
        console.log('批量更新介绍排序，接收到的数据:', intros)
        
        // 验证所有介绍项都有有效的_id
        const validIntros = intros.filter(intro => {
          const isValid = intro && intro._id && (typeof intro._id === 'string' || typeof intro._id === 'number')
          if (!isValid) {
            console.log('无效的介绍项:', intro)
            console.log('介绍项详情:', {
              hasIntro: !!intro,
              hasId: !!(intro && intro._id),
              idType: intro && intro._id ? typeof intro._id : 'undefined',
              idValue: intro && intro._id ? intro._id : 'undefined'
            })
          }
          return isValid
        })
        
        console.log('有效的介绍项数量:', validIntros.length, '总数量:', intros.length)
        
        if (validIntros.length !== intros.length) {
          const invalidIntros = intros.filter((intro, index) => {
            const isValid = intro && intro._id && (typeof intro._id === 'string' || typeof intro._id === 'number')
            return !isValid
          })
          const invalidIndexes = invalidIntros.map((_, index) => {
            const originalIndex = intros.findIndex(intro => intro === _)
            return originalIndex
          })
          return { 
            success: false, 
            message: `部分介绍项缺少有效的ID，有效: ${validIntros.length}/${intros.length}，无效项索引: ${invalidIndexes.join(', ')}` 
          }
        }
        
        const updatePromises = validIntros.map((intro, index) => {
          console.log(`更新介绍${index}:`, intro._id, 'order:', index + 1)
          try {
            return db.collection('home_intros')
              .doc(intro._id)
              .update({
                order: index + 1,
                update_time: new Date()
              })
          } catch (error) {
            console.error(`更新介绍${index}失败:`, error)
            throw error
          }
        })
        await Promise.all(updatePromises)
        return { success: true, message: '批量更新介绍排序成功' }
      }
      
      // 单个更新
      if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
        return { success: false, message: '介绍ID无效' }
      }
      
      if (orderValue === undefined || orderValue === null) {
        return { success: false, message: '排序值无效' }
      }
      
      const result = await db.collection('home_intros')
        .doc(id)
        .update({
          order: orderValue,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新介绍排序失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新导航排序
  async updateNavOrder(params) {
    try {
      const { _id, order, navs } = params
      
      // 支持批量更新
      if (navs && Array.isArray(navs)) {
        console.log('批量更新导航排序，接收到的数据:', navs)
        
        // 验证所有导航项都有有效的_id
        const validNavs = navs.filter(nav => {
          const isValid = nav && nav._id && (typeof nav._id === 'string' || typeof nav._id === 'number')
          if (!isValid) {
            console.log('无效的导航项:', nav)
          }
          return isValid
        })
        
        console.log('有效的导航项数量:', validNavs.length, '总数量:', navs.length)
        
        if (validNavs.length !== navs.length) {
          return { success: false, message: `部分导航项缺少有效的ID，有效: ${validNavs.length}/${navs.length}` }
        }
        
        const updatePromises = validNavs.map((nav, index) => {
          console.log(`更新导航${index}:`, nav._id, 'order:', index + 1)
          try {
            return db.collection('home_navs')
              .doc(nav._id)
              .update({
                order: index + 1,
                update_time: new Date()
              })
          } catch (error) {
            console.error(`更新导航${index}失败:`, error)
            throw error
          }
        })
        await Promise.all(updatePromises)
        return { success: true, message: '批量更新排序成功' }
      }
      
      // 单个更新
      if (!_id || typeof _id !== 'string') {
        return { success: false, message: '导航ID无效' }
      }
      
      const result = await db.collection('home_navs')
        .doc(_id)
        .update({
          order,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新导航排序失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新横幅排序
  async updateBannerOrder(params) {
    try {
      const { _id, order, banners } = params
      
      // 支持批量更新
      if (banners && Array.isArray(banners)) {
        console.log('批量更新横幅排序，接收到的数据:', banners)
        
        // 验证所有横幅项都有有效的_id
        const validBanners = banners.filter(banner => {
          const isValid = banner && banner._id && (typeof banner._id === 'string' || typeof banner._id === 'number')
          if (!isValid) {
            console.log('无效的横幅项:', banner)
          }
          return isValid
        })
        
        console.log('有效的横幅项数量:', validBanners.length, '总数量:', banners.length)
        
        if (validBanners.length !== banners.length) {
          return { success: false, message: `部分横幅项缺少有效的ID，有效: ${validBanners.length}/${banners.length}` }
        }
        
        const updatePromises = validBanners.map((banner, index) => {
          console.log(`更新横幅${index}:`, banner._id, 'order:', index + 1)
          try {
            return db.collection('home_banners')
              .doc(banner._id)
              .update({
                order: index + 1,
                update_time: new Date()
              })
          } catch (error) {
            console.error(`更新横幅${index}失败:`, error)
            throw error
          }
        })
        await Promise.all(updatePromises)
        return { success: true, message: '批量更新横幅排序成功' }
      }
      
      // 单个更新
      if (!_id || (typeof _id !== 'string' && typeof _id !== 'number')) {
        return { success: false, message: '横幅ID无效' }
      }
      
      const result = await db.collection('home_banners')
        .doc(_id)
        .update({
          order,
          update_time: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新横幅排序失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 系统管理 ====================
  
  // 获取管理员统计数据
  async getAdminStats() {
    try {
      const result = await db.collection('admin_stats').limit(1).get()
      return { 
        success: true, 
        data: result.data && result.data.length > 0 ? result.data[0] : {} 
      }
    } catch (error) {
      console.error('获取管理员统计数据失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 获取供灯订单列表
  async getLightOrders() {
    try {
      const result = await db.collection('light_orders')
        .orderBy('createTime', 'desc')
        .get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取供灯订单失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新供灯订单状态
  async updateLightOrderStatus(params) {
    try {
      const { orderId, status, note } = params
      const updateData = {
        updateTime: new Date()
      }
      
      if (status !== undefined) {
        updateData.status = status
      }
      
      if (note !== undefined) {
        updateData.note = note
      }
      
      const result = await db.collection('light_orders')
        .doc(orderId)
        .update(updateData)
      return { success: true, data: result }
    } catch (error) {
      console.error('更新供灯订单状态失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 活动管理 ====================
  
  // 获取活动项目列表
  async getActivityItems() {
    try {
      const result = await db.collection('activity_items')
        .orderBy('createTime', 'desc')
        .get()
      return { success: true, data: result.data }
    } catch (error) {
      console.error('获取活动项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 添加活动项目
  async addActivityItem(params) {
    try {
      const result = await db.collection('activity_items').add({
        ...params.item,
        createTime: new Date(),
        updateTime: new Date()
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('添加活动项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 更新活动项目
  async updateActivityItem(params) {
    try {
      const { _id, ...updateData } = params
      const result = await db.collection('activity_items')
        .doc(_id)
        .update({
          ...updateData,
          updateTime: new Date()
        })
      return { success: true, data: result }
    } catch (error) {
      console.error('更新活动项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // 删除活动项目
  async deleteActivityItem(params) {
    try {
      const result = await db.collection('activity_items')
        .doc(params._id)
        .remove()
      return { success: true, data: result }
    } catch (error) {
      console.error('删除活动项目失败：', error)
      return { success: false, message: error.message }
    }
  },

  // ==================== 数据库初始化 ====================
  
  // 初始化数据库集合
  async initDatabase() {
    try {
      console.log('🔧 开始初始化数据库...')
      
      // 需要创建的基础集合列表
      const collections = [
        'admin_stats', 'home_banners', 'home_intros', 'home_navs',
        'fahui_projects', 'fahui_orders', 'joint_projects', 'joint_orders',
        'light_items', 'light_orders', 'hall_items', 'hall_orders',
        'gongde_items', 'gongde_orders', 'activity_items'
      ]
      
      const results = []
      let successCount = 0
      
      for (const collectionName of collections) {
        try {
          await db.createCollection(collectionName)
          console.log(`✅ 集合 ${collectionName} 创建成功`)
          results.push({ collection: collectionName, status: 'success' })
          successCount++
        } catch (error) {
          console.log(`⚠️ 集合 ${collectionName} 已存在或创建失败:`, error.message)
          results.push({ collection: collectionName, status: 'exists', error: error.message })
        }
      }
      
      console.log(`📊 数据库初始化完成，成功创建 ${successCount} 个集合`)
      
      return { 
        success: true, 
        message: `数据库初始化完成，成功创建 ${successCount} 个集合`,
        collectionsCount: collections.length,
        successCount: successCount,
        results: results,
        cloudFunctionCount: 0 // 云函数数量，这里暂时设为0
      }
      
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error)
      return { 
        success: false, 
        message: '数据库初始化失败: ' + error.message 
      }
    }
  }
} 