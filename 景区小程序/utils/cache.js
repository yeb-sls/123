/**
 * 缓存工具类 - 处理 getCachePermissionBytes 错误
 */

// 安全的存储操作
export const safeStorage = {
  // 获取存储数据
  get(key, defaultValue = null) {
    try {
      const data = uni.getStorageSync(key)
      return data !== '' ? data : defaultValue
    } catch (error) {
      console.warn(`获取存储数据失败 [${key}]:`, error)
      return defaultValue
    }
  },

  // 设置存储数据
  set(key, data) {
    try {
      uni.setStorageSync(key, data)
      return true
    } catch (error) {
      console.warn(`设置存储数据失败 [${key}]:`, error)
      return false
    }
  },

  // 删除存储数据
  remove(key) {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (error) {
      console.warn(`删除存储数据失败 [${key}]:`, error)
      return false
    }
  },

  // 清空所有存储
  clear() {
    try {
      uni.clearStorageSync()
      return true
    } catch (error) {
      console.warn('清空存储失败:', error)
      return false
    }
  },

  // 获取存储信息
  getInfo() {
    try {
      return uni.getStorageInfoSync()
    } catch (error) {
      console.warn('获取存储信息失败:', error)
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0
      }
    }
  }
}

// 导出默认对象
export default safeStorage 