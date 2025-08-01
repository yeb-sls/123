/**
 * 简化错误处理器 - 专门处理缓存相关错误
 */

// 简化的错误处理
export const setupSimpleErrorHandler = () => {
  console.log('🔧 设置简化错误处理器...')
  
  // 只处理缓存相关的错误
  const handleCacheError = (error) => {
    if (error && typeof error === 'string' && error.includes('getCachePermissionBytes')) {
      console.warn('⚠️ 检测到缓存权限错误，使用备用存储方案')
      return true
    }
    return false
  }

  // 重写存储方法以添加错误处理
  try {
    // 保存原始方法
    const originalGetStorageSync = uni.getStorageSync
    const originalSetStorageSync = uni.setStorageSync
    const originalRemoveStorageSync = uni.removeStorageSync
    const originalClearStorageSync = uni.clearStorageSync

    // 重写 getStorageSync
    uni.getStorageSync = function(key) {
      try {
        return originalGetStorageSync.call(this, key)
      } catch (error) {
        if (handleCacheError(error.message || error)) {
          return null
        }
        console.warn('存储读取错误:', error)
        return null
      }
    }

    // 重写 setStorageSync
    uni.setStorageSync = function(key, data) {
      try {
        return originalSetStorageSync.call(this, key, data)
      } catch (error) {
        if (handleCacheError(error.message || error)) {
          return false
        }
        console.warn('存储写入错误:', error)
        return false
      }
    }

    // 重写 removeStorageSync
    uni.removeStorageSync = function(key) {
      try {
        return originalRemoveStorageSync.call(this, key)
      } catch (error) {
        if (handleCacheError(error.message || error)) {
          return false
        }
        console.warn('存储删除错误:', error)
        return false
      }
    }

    // 重写 clearStorageSync
    uni.clearStorageSync = function() {
      try {
        return originalClearStorageSync.call(this)
      } catch (error) {
        if (handleCacheError(error.message || error)) {
          return false
        }
        console.warn('存储清空错误:', error)
        return false
      }
    }

    console.log('✅ 简化错误处理器设置完成')
  } catch (error) {
    console.warn('❌ 简化错误处理器设置失败:', error)
  }
}

export default setupSimpleErrorHandler 