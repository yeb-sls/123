/**
 * 全局错误处理器 - 处理 getCachePermissionBytes 等错误
 */

// 全局错误处理
export const setupGlobalErrorHandler = () => {
  try {
    // 捕获全局错误（微信小程序环境）
    if (typeof uni.onError === 'function') {
      uni.onError((error) => {
        console.error('全局错误:', error)
        
        // 如果是缓存相关错误，记录并尝试恢复
        if (error && error.includes('getCachePermissionBytes')) {
          console.warn('检测到缓存权限错误，应用将使用备用存储方案')
        }
      })
    }

    // 捕获未处理的 Promise 错误（微信小程序环境）
    if (typeof uni.onUnhandledRejection === 'function') {
      uni.onUnhandledRejection(({ reason, promise }) => {
        console.error('未处理的 Promise 错误:', reason)
        console.error('Promise:', promise)
        
        // 如果是缓存相关错误，尝试清理缓存
        if (reason && reason.message && reason.message.includes('getCachePermissionBytes')) {
          console.warn('检测到缓存权限错误，尝试清理缓存...')
          try {
            uni.clearStorageSync()
            console.log('缓存清理完成')
          } catch (error) {
            console.error('缓存清理失败:', error)
          }
        }
      })
    }

    console.log('✅ 全局错误处理器已设置')
  } catch (error) {
    console.warn('设置全局错误处理器失败:', error)
  }
}

// 安全的 API 调用包装器
export const safeApiCall = (apiFunction, fallback = null) => {
  return (...args) => {
    try {
      return apiFunction(...args)
    } catch (error) {
      console.warn('API 调用失败:', error)
      return fallback
    }
  }
}

// 导出默认配置
export default {
  setupGlobalErrorHandler,
  safeApiCall
} 