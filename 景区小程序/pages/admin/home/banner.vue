<template>
  <view class="admin-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <text class="page-title">首页轮播图管理</text>
          <text class="page-desc">管理小程序首页的轮播图片，支持拖拽排序</text>
        </view>
        <view class="header-actions">
          <button class="init-btn" @click="initDatabase">
            <text class="btn-icon">🔄</text>
            <text>初始化</text>
          </button>
          <button class="add-btn" @click="showAddModal">
            <text class="btn-icon">➕</text>
            <text>添加图片</text>
          </button>
          <button class="debug-btn" @click="testAddBanner" style="background: #ff9800; margin-left: 10rpx;">
            <text class="btn-icon">🔧</text>
            <text>测试添加</text>
          </button>
          <button class="debug-btn" @click="showDebugInfo" style="background: #2196f3; margin-left: 10rpx;">
            <text class="btn-icon">🐛</text>
            <text>调试信息</text>
          </button>
          <button class="debug-btn" @click="forceRefreshData" style="background: #4caf50; margin-left: 10rpx;">
            <text class="btn-icon">🔄</text>
            <text>强制刷新</text>
          </button>

        </view>
      </view>
    </view>

    <!-- 调试信息区域 -->
    <view v-if="showDebug" class="debug-section">
      <view class="debug-header">
        <text class="debug-title">🐛 调试信息</text>
        <button class="debug-close-btn" @click="hideDebugInfo">×</button>
      </view>
      <view class="debug-content">
        <view class="debug-item">
          <text class="debug-label">页面状态:</text>
          <text class="debug-value">{{ debugInfo.pageStatus }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">轮播图数据:</text>
          <text class="debug-value">{{ debugInfo.bannersInfo }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">云对象状态:</text>
          <text class="debug-value">{{ debugInfo.cloudObjectStatus }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">加载状态:</text>
          <text class="debug-value">{{ debugInfo.loadingStatus }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">弹窗状态:</text>
          <text class="debug-value">{{ debugInfo.popupStatus }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">编辑状态:</text>
          <text class="debug-value">{{ debugInfo.editStatus }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">最后操作:</text>
          <text class="debug-value">{{ debugInfo.lastOperation }}</text>
        </view>
        <view class="debug-item">
          <text class="debug-label">错误信息:</text>
          <text class="debug-value">{{ debugInfo.errorInfo }}</text>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-number">{{ banners ? banners.length : 0 }}</text>
        <text class="stat-label">总数量</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ enabledCount }}</text>
        <text class="stat-label">已启用</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ disabledCount }}</text>
        <text class="stat-label">已禁用</text>
      </view>
    </view>

          <!-- 轮播图列表 -->
      <view class="banner-list">
        <view class="list-header">
          <text class="list-title">🖼️ 轮播图列表</text>
          <text class="list-subtitle">共 {{ banners ? banners.length : 0 }} 张图片</text>
        </view>
      
      <!-- 空状态 -->
      <view v-if="!banners || banners.length === 0" class="empty-state">
        <text class="empty-icon">📷</text>
        <text class="empty-title">暂无轮播图</text>
        <text class="empty-desc">点击上方"添加图片"按钮开始创建</text>
        <button class="empty-btn" @click="showAddModal">添加第一张图片</button>
      </view>

      <!-- 轮播图列表 -->
      <view v-else class="banner-items">
        <view 
          v-for="(banner, index) in (banners || [])" 
          :key="banner._id" 
          class="banner-item"
          :class="{ 'banner-disabled': banner.status !== '启用' }"
        >
          <!-- 轮播图预览 -->
          <view class="banner-preview">
            <image :src="banner.imageUrl" class="banner-img" mode="aspectFill" />
            <view class="banner-overlay">
              <view class="overlay-actions">
                <button class="action-btn edit-btn" @click="editBanner(index)">
                  <text class="action-icon">✏️</text>
                  <text>编辑</text>
                </button>
                <button class="action-btn delete-btn" @click="deleteBanner(index)">
                  <text class="action-icon">🗑️</text>
                  <text>删除</text>
                </button>
              </view>
            </view>
            <!-- 状态标签 -->
            <view class="status-badge" :class="banner.status === '启用' ? 'status-enabled' : 'status-disabled'">
              {{ banner.status }}
            </view>
          </view>

          <!-- 轮播图信息 -->
          <view class="banner-info">
            <view class="info-header">
              <text class="banner-title">{{ banner.title || '未设置标题' }}</text>
              <text class="banner-order">#{{ banner.order }}</text>
            </view>
            <text class="banner-desc">{{ banner.description || '未设置描述' }}</text>
            
            <!-- 操作按钮 -->
            <view class="banner-actions">
              <view class="action-group">
                <button 
                  class="sort-btn" 
                  @click="moveBanner(index, -1)"
                  :disabled="index === 0"
                  :class="{ 'btn-disabled': index === 0 }"
                  style="background: #007aff; color: #fff; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx;"
                >
                  <text class="sort-icon">⬆️</text>
                  <text>上移</text>
                </button>
                <button 
                  class="sort-btn" 
                  @click="moveBanner(index, 1)"
                  :disabled="index === (banners && Array.isArray(banners) ? banners.length - 1 : -1)"
                  :class="{ 'btn-disabled': index === (banners && Array.isArray(banners) ? banners.length - 1 : -1) }"
                  style="background: #007aff; color: #fff; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx;"
                >
                  <text class="sort-icon">⬇️</text>
                  <text>下移</text>
                </button>
              </view>
              
              <view class="toggle-group">
                <text class="toggle-label">状态</text>
                <switch 
                  :checked="banner.status === '启用'" 
                  @change="toggleBannerStatus(banner, $event)"
                  color="#007aff"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加/编辑弹窗 -->
    <uni-popup :show="showBannerPopup" type="center" @close="closePopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑轮播图' : '添加轮播图' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        
        <view class="form-container">
          <view class="form-group">
            <text class="form-label">图片标题 *</text>
            <input 
              v-model="currentBanner.title" 
              placeholder="请输入图片标题" 
              class="form-input" 
              maxlength="50"
            />
            <text class="form-tip">{{ (currentBanner.title || '').length }}/50</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">图片描述</text>
            <textarea 
              v-model="currentBanner.description" 
              placeholder="请输入图片描述" 
              class="form-textarea"
              maxlength="200"
            />
            <text class="form-tip">{{ (currentBanner.description || '').length }}/200</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">上传图片 *</text>
            <view class="upload-area" @click="chooseImage">
              <image 
                v-if="currentBanner.imageUrl" 
                :src="currentBanner.imageUrl" 
                class="upload-preview" 
                mode="aspectFill" 
              />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">📷</text>
                <text class="upload-text">点击上传图片</text>
                <text class="upload-tip">建议尺寸：750x400px，格式：JPG/PNG</text>
              </view>
            </view>
            <!-- 测试按钮 -->
            <button class="test-btn" @click="chooseImage">测试选择图片</button>
            <button class="test-btn" @click="testChooseImage" style="margin-left: 10rpx;">简单测试</button>
          </view>
          
          <view class="form-group">
            <text class="form-label">跳转链接（可选）</text>
            <input 
              v-model="currentBanner.linkUrl" 
              placeholder="请输入跳转链接，如：/pages/detail" 
              class="form-input" 
            />
          </view>
        </view>
        
        <view class="popup-buttons">
          <button class="popup-btn cancel-btn" @click="closePopup">取消</button>
          <button class="popup-btn primary-btn" @click="saveBanner" :disabled="loading">
            <text v-if="loading">保存中...</text>
            <text v-else>{{ isEdit ? '更新' : '保存' }}</text>
          </button>
        </view>
      </view>
    </uni-popup>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <view class="loading-content">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

// 导入云对象
const commonManagement = uniCloud.importObject('common-management')

export default {
  components: { uniPopup },
  data() {
    return {
      banners: [],
      currentBanner: {
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: ''
      },
      isEdit: false,
      editIndex: -1,
      loading: false,
      showBannerPopup: false,
      moving: false, // 新增，防止重复点击
      showDebug: false, // 调试信息显示状态
      debugInfo: {
        pageStatus: '页面已加载',
        bannersInfo: '数据未加载',
        cloudObjectStatus: '云对象未初始化',
        loadingStatus: '未加载',
        popupStatus: '弹窗关闭',
        editStatus: '非编辑模式',
        lastOperation: '无操作',
        errorInfo: '无错误'
      }
    }
  },
  computed: {
    enabledCount() {
      return this.banners && Array.isArray(this.banners) ? this.banners.filter(banner => banner.status === '启用').length : 0
    },
    disabledCount() {
      return this.banners && Array.isArray(this.banners) ? this.banners.filter(banner => banner.status !== '启用').length : 0
    }
  },
  onLoad() {
    this.loadBanners()
  },
  onReady() {
    // 页面渲染完成后，测试排序功能
    setTimeout(() => {
      console.log('页面渲染完成，测试排序功能');
      if (this.banners && Array.isArray(this.banners) && this.banners.length >= 2) {
        console.log('自动测试：移动第一个轮播图到第二个位置');
        this.moveBanner(0, 1);
      }
    }, 2000);
  },
  methods: {
    async loadBanners() {
      try {
        this.loading = true
        this.setLastOperation('开始加载轮播图数据')
        this.updateDebugInfo()
        console.log('开始加载轮播图数据...')
        
        // 添加更详细的调试信息
        console.log('调用云对象 getHomeBanners...')
        const result = await commonManagement.getHomeBanners()
        console.log('轮播图数据加载结果:', result)
        console.log('result:', result)
        console.log('result.data:', result?.data)
        
        if (result.success && result.data) {
          this.banners = result.data || []
          console.log('轮播图数据加载成功，共', (this.banners || []).length, '条')
          console.log('轮播图数据详情:', this.banners)
          this.setLastOperation(`数据加载成功，共${(this.banners || []).length}条`)
        } else {
          this.banners = []
          console.log('轮播图数据为空')
          console.log('可能的原因：result.success 为 false 或 result.data 为空')
          this.setLastOperation('数据加载失败，返回空数据')
          this.setErrorInfo(`加载失败: result.success=${result.success}, result.data=${result.data}`)
        }
      } catch (error) {
        console.error('加载轮播图失败:', error)
        console.error('错误详情:', error)
        this.setLastOperation('数据加载异常')
        this.setErrorInfo(`加载异常: ${error.message}`)
        uni.showToast({ 
          title: '加载失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
        this.banners = []
      } finally {
        this.loading = false
        this.updateDebugInfo()
      }
    },
    showAddModal() {
      console.log('打开添加轮播图弹窗')
      this.isEdit = false
      this.editIndex = -1
      this.currentBanner = { 
        title: '', 
        description: '', 
        imageUrl: '', 
        linkUrl: '' 
      }
      this.showBannerPopup = true
      console.log('弹窗状态:', this.showBannerPopup)
    },
    editBanner(index) {
      console.log('editBanner 方法被调用，index:', index)
      if (!this.banners || !Array.isArray(this.banners) || !this.banners[index]) {
        console.error('轮播图数据不存在')
        uni.showToast({ title: '轮播图数据不存在', icon: 'none' })
        return
      }
      console.log('当前轮播图数据:', this.banners[index])
      this.isEdit = true
      this.editIndex = index
      this.currentBanner = { 
        title: this.banners[index].title || '',
        description: this.banners[index].description || '',
        imageUrl: this.banners[index].imageUrl || '',
        linkUrl: this.banners[index].linkUrl || '',
        status: this.banners[index].status || '启用'
      }
      this.showBannerPopup = true
      console.log('编辑弹窗状态:', this.showBannerPopup)
      console.log('当前编辑数据:', this.currentBanner)
    },
    async deleteBanner(index) {
      if (!this.banners || !Array.isArray(this.banners) || !this.banners[index]) {
        console.error('轮播图数据不存在')
        uni.showToast({ title: '轮播图数据不存在', icon: 'none' })
        return
      }
      uni.showModal({
        title: '确认删除',
        content: `确定要删除"${this.banners[index].title || '未命名'}"轮播图吗？此操作不可恢复。`,
        confirmText: '删除',
        confirmColor: '#ff3b30',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '删除中...' })
              const result = await commonManagement.deleteHomeBanner({ _id: this.banners[index]._id })
              if (!result.success) {
                throw new Error(result.message || '删除失败')
              }
              await this.loadBanners() // 删除后重新拉取数据
              uni.hideLoading()
              uni.showToast({ 
                title: '删除成功', 
                icon: 'success',
                duration: 2000
              })
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ 
                title: '删除失败: ' + (error.message || '未知错误'), 
                icon: 'none',
                duration: 3000
              })
              console.error('删除轮播图失败:', error)
            }
          }
        }
      })
    },
    onUploadTouch() {
      console.log('上传区域被触摸')
    },
    testChooseImage() {
      console.log('测试选择图片方法被调用')
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('测试选择图片成功:', res)
          // 处理返回的数组格式
          const result = Array.isArray(res) ? res[1] : res
          if (result && result.tempFiles && result.tempFiles.length > 0) {
            uni.showToast({ title: '选择图片成功', icon: 'success' })
          } else {
            uni.showToast({ title: '未选择图片', icon: 'none' })
          }
        },
        fail: (err) => {
          console.error('测试选择图片失败:', err)
          uni.showToast({ title: '选择图片失败: ' + err.errMsg, icon: 'none' })
        }
      })
    },
    async chooseImage() {
      console.log('chooseImage 方法被调用')
      try {
        console.log('开始选择图片...')
        
        // 选择图片
        const res = await new Promise((resolve, reject) => {
          uni.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: resolve,
            fail: reject
          })
        })
        
        console.log('选择图片结果:', res)
        
        if (res && res.tempFiles && res.tempFiles.length > 0) {
          const filePath = res.tempFiles[0].path || res.tempFiles[0].tempFilePath
          console.log('选择的图片路径:', filePath)
          
          uni.showLoading({ title: '上传中...' })
          
          // 生成云存储路径
          const cloudPath = `banners/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
          console.log('云存储路径:', cloudPath)
          
          // 上传到云存储
          console.log('开始上传文件到云存储...')
          const uploadResult = await uniCloud.uploadFile({
            filePath: filePath,
            cloudPath: cloudPath
          })
          
          console.log('上传结果:', uploadResult)
          uni.hideLoading()
          
          if (uploadResult && uploadResult.fileID) {
            this.currentBanner.imageUrl = uploadResult.fileID
            console.log('图片URL已设置:', uploadResult.fileID)
            uni.showToast({ 
              title: '上传成功', 
              icon: 'success',
              duration: 2000
            })
          } else {
            throw new Error('上传失败：未获取到文件ID')
          }
        } else {
          console.log('用户取消选择图片')
        }
      } catch (error) {
        uni.hideLoading()
        console.error('图片上传失败:', error)
        uni.showToast({ 
          title: '选择或上传图片失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
      }
    },
    async saveBanner() {
      console.log('saveBanner 方法被调用')
      console.log('当前轮播图数据:', this.currentBanner)
      console.log('是否为编辑模式:', this.isEdit)
      
      if (!this.currentBanner.imageUrl) {
        uni.showToast({ title: '请上传图片', icon: 'none' })
        return
      }
      if (!this.currentBanner.title) {
        uni.showToast({ title: '请输入图片标题', icon: 'none' })
        return
      }
      try {
        this.loading = true
        console.log('保存轮播图数据:', this.currentBanner)
        
        if (this.isEdit) {
          if (!this.banners || !Array.isArray(this.banners) || !this.banners[this.editIndex]) {
            console.error('编辑的轮播图数据不存在')
            uni.showToast({ title: '编辑的轮播图数据不存在', icon: 'none' })
            return
          }
          console.log('更新轮播图，ID:', this.banners[this.editIndex]._id)
          console.log('准备更新的数据:', this.currentBanner)
          
          // 确保数据完整性
          const updateData = {
            _id: this.banners[this.editIndex]._id,
            title: this.currentBanner.title || '',
            description: this.currentBanner.description || '',
            imageUrl: this.currentBanner.imageUrl || '',
            linkUrl: this.currentBanner.linkUrl || '',
            status: this.currentBanner.status || '启用'
          }
          
          console.log('格式化后的更新数据:', updateData)
          
          const updateResult = await commonManagement.updateHomeBanner(updateData)
          console.log('更新结果:', updateResult)
          if (!updateResult.success) {
            throw new Error(updateResult.message || '更新失败')
          }
          await this.loadBanners() // 更新后重新拉取数据
        } else {
          console.log('添加新轮播图')
          console.log('准备添加的数据:', this.currentBanner)
          
          // 确保数据完整性
          const bannerData = {
            title: this.currentBanner.title || '',
            description: this.currentBanner.description || '',
            imageUrl: this.currentBanner.imageUrl || '',
            linkUrl: this.currentBanner.linkUrl || '',
            status: '启用'
          }
          
          console.log('格式化后的数据:', bannerData)
          
          const result = await commonManagement.addHomeBanner({ banner: bannerData })
          console.log('添加结果:', result)
          if (!result.success) {
            throw new Error(result.message || '添加失败')
          }
          await this.loadBanners() // 添加后重新拉取数据
        }
        this.closePopup()
        uni.showToast({ title: this.isEdit ? '更新成功' : '添加成功', icon: 'success' })
      } catch (error) {
        console.error('保存轮播图失败:', error)
        uni.showToast({ 
          title: '保存失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.loading = false
      }
    },
    closePopup() {
      console.log('关闭弹窗')
      this.showBannerPopup = false
      // 重置表单数据
      this.currentBanner = { 
        title: '', 
        description: '', 
        imageUrl: '', 
        linkUrl: '' 
      }
    },
    async moveBanner(index, direction) {
      if (this.moving) return;
      const newIndex = index + direction;
      if (!this.banners || !Array.isArray(this.banners) || newIndex < 0 || newIndex >= this.banners.length) return;
      this.moving = true;

      console.log('开始移动轮播图:', index, direction, '->', newIndex);
      console.log('移动前的轮播图数据:', this.banners);

      // 1. 本地先交换顺序，UI立即变化
      const newBanners = [...(this.banners || [])];
      if (newBanners.length > 0 && index >= 0 && newIndex >= 0 && index < newBanners.length && newIndex < newBanners.length) {
        [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
        // 2. 重新赋order
        newBanners.forEach((item, idx) => item.order = idx + 1);
        if (newBanners && Array.isArray(newBanners)) {
          this.banners = newBanners; // 立刻更新UI
        } else {
          console.error('newBanners 不是有效的数组');
          return;
        }
      } else {
        console.error('轮播图数据无效，无法进行排序操作');
        return;
      }

      console.log('移动后的轮播图数据:', newBanners);
      
      // 创建纯JavaScript对象，避免Vue响应式系统的影响
      const bannersToUpdate = newBanners.map((banner, index) => {
        console.log(`轮播图${index}的_id:`, banner._id, '类型:', typeof banner._id);
        return {
          _id: banner._id,
          title: banner.title,
          description: banner.description,
          imageUrl: banner.imageUrl,
          linkUrl: banner.linkUrl,
          status: banner.status,
          order: index + 1,
          create_time: banner.create_time,
          update_time: banner.update_time
        }
      });
      
      console.log('准备发送到云对象的数据:', bannersToUpdate);

      try {
        // 逐个更新排序（避免批量更新的问题）
        for (let i = 0; i < bannersToUpdate.length; i++) {
          const banner = bannersToUpdate[i];
          console.log(`正在更新第${i}个轮播图:`, banner._id, 'order:', banner.order);
          const result = await commonManagement.updateBannerOrder({
            _id: banner._id,
            order: banner.order
          });
          if (!result.success) {
            throw new Error(`更新第${i}个轮播图失败: ${result.message}`);
          }
        }
        
        uni.showToast({ title: '排序成功', icon: 'success' });
      } catch (e) {
        console.error('轮播图排序失败:', e);
        uni.showToast({ title: '排序失败', icon: 'none' });
        // 失败时可重新拉取数据
        this.loadBanners();
      } finally {
        this.moving = false;
      }
    },
    async toggleBannerStatus(banner, e) {
      const newStatus = e.detail.value ? '启用' : '禁用'
      const oldStatus = banner.status
      
      try {
        console.log('切换轮播图状态:', banner._id, oldStatus, '->', newStatus)
        
        // 检查是否有有效的ID
        if (!banner._id) {
          throw new Error('轮播图ID不存在')
        }
        
        // 立即更新UI状态
        banner.status = newStatus
        
        // 调用云对象更新状态
        const result = await commonManagement.updateHomeBanner({ 
          _id: banner._id, 
          status: newStatus 
        })
        if (!result.success) {
          throw new Error(result.message || '状态更新失败')
        }
        
        console.log('状态更新结果:', result)
        
        uni.showToast({ 
          title: `${newStatus}成功`, 
          icon: 'success',
          duration: 1500
        })
      } catch (error) {
        // 恢复原状态
        banner.status = oldStatus
        console.error('状态更新失败:', error)
        uni.showToast({ 
          title: '状态更新失败: ' + (error.message || '未知错误'), 
          icon: 'none',
          duration: 3000
        })
      }
    },
    testMoveBanner() {
      console.log('=== 测试排序功能 ===');
      console.log('当前轮播图数据:', this.banners);
              if (this.banners && this.banners.length >= 2) {
        console.log('测试移动第一个轮播图到第二个位置');
        this.moveBanner(0, 1);
      } else {
        console.log('轮播图数量不足，无法测试');
        uni.showToast({ title: '轮播图数量不足，无法测试', icon: 'none' });
      }
    },
    async testLoadBanners() {
      console.log('=== 开始测试加载轮播图数据 ===')
      try {
        console.log('1. 检查 uniCloud 对象:', typeof uniCloud)
        console.log('2. 检查 commonManagement 对象:', typeof commonManagement)
        
        const result = await commonManagement.getHomeBanners()
        console.log('3. 云对象查询结果:', result)
        console.log('4. result.data:', result.data)
        
        if (result.success && result.data && result.data.length > 0) {
          console.log('5. 数据加载成功，数量:', result.data.length)
          console.log('6. 数据详情:', result.data)
          uni.showToast({ title: '测试成功，数据已加载', icon: 'success' })
        } else {
          console.log('5. 数据为空')
          uni.showToast({ title: '测试完成，数据为空', icon: 'none' })
        }
      } catch (error) {
        console.error('测试失败:', error)
        uni.showToast({ title: '测试失败: ' + error.message, icon: 'none' })
      }
    },
    async initDatabase() {
      uni.showModal({
        title: '确认初始化',
        content: '确定要初始化数据库吗？这将添加示例轮播图数据。',
        confirmText: '初始化',
        confirmColor: '#ff9800',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '初始化中...' })
              
              // 创建示例轮播图数据
              const sampleBanners = [
                {
                  title: '欢迎来到景区',
                  description: '美丽的自然风光等待您的探索',
                  imageUrl: 'https://p2.itc.cn/q_70/images01/20211028/f0c35680e83a488cbecc2375c11b6e6f.jpeg',
                  linkUrl: '',
                  status: '启用',
                  order: 1
                },
                {
                  title: '特色活动',
                  description: '丰富多彩的文化活动',
                  imageUrl: 'https://p4.itc.cn/q_70/images03/20220418/3472db645e63443e954a55ade8025832.jpeg',
                  linkUrl: '',
                  status: '启用',
                  order: 2
                }
              ]
              
              for (const banner of sampleBanners) {
                await commonManagement.addHomeBanner({ banner: banner })
              }
              
              uni.hideLoading()
              console.log('初始化完成')
              
              uni.showToast({ 
                title: '数据库初始化成功', 
                icon: 'success',
                duration: 2000
              })
              this.loadBanners() // 重新加载数据
              
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ 
                title: '数据库初始化失败: ' + (error.message || '未知错误'), 
                icon: 'none',
                duration: 3000
              })
              console.error('数据库初始化失败:', error)
            }
          }
        }
      })
    },
    
    // 调试相关方法
    showDebugInfo() {
      this.showDebug = true
      this.updateDebugInfo()
      console.log('🐛 显示调试信息')
    },
    
    hideDebugInfo() {
      this.showDebug = false
      console.log('🐛 隐藏调试信息')
    },
    
    updateDebugInfo() {
      const now = new Date().toLocaleTimeString()
      
      this.debugInfo = {
        pageStatus: `页面已加载 (${now})`,
        bannersInfo: this.getBannersInfo(),
        cloudObjectStatus: this.getCloudObjectStatus(),
        loadingStatus: this.loading ? '加载中...' : '未加载',
        popupStatus: this.showBannerPopup ? '弹窗打开' : '弹窗关闭',
        editStatus: this.isEdit ? `编辑模式 (索引: ${this.editIndex})` : '非编辑模式',
        lastOperation: this.debugInfo.lastOperation || '无操作',
        errorInfo: this.debugInfo.errorInfo || '无错误'
      }
    },
    
    getBannersInfo() {
      if (!this.banners) {
        return 'banners 为 null/undefined'
      }
      if (!Array.isArray(this.banners)) {
        return `banners 不是数组，类型: ${typeof this.banners}`
      }
      return `数组长度: ${this.banners.length}, 启用: ${this.enabledCount}, 禁用: ${this.disabledCount}`
    },
    
    getCloudObjectStatus() {
      try {
        if (typeof commonManagement === 'undefined') {
          return '云对象未定义'
        }
        if (typeof commonManagement.getHomeBanners !== 'function') {
          return '云对象方法不存在'
        }
        return '云对象正常'
      } catch (error) {
        return `云对象错误: ${error.message}`
      }
    },
    
    setLastOperation(operation) {
      const now = new Date().toLocaleTimeString()
      this.debugInfo.lastOperation = `${operation} (${now})`
      this.updateDebugInfo()
    },
    
    setErrorInfo(error) {
      const now = new Date().toLocaleTimeString()
      this.debugInfo.errorInfo = `${error} (${now})`
      this.updateDebugInfo()
    },
    
    async forceRefreshData() {
      console.log('🔄 强制刷新数据')
      this.setLastOperation('强制刷新数据')
      
      try {
        this.loading = true
        this.updateDebugInfo()
        
        // 清空当前数据
        this.banners = []
        this.updateDebugInfo()
        
        // 重新加载数据
        await this.loadBanners()
        
        this.setLastOperation('强制刷新完成')
        uni.showToast({ title: '数据刷新完成', icon: 'success' })
      } catch (error) {
        console.error('强制刷新失败:', error)
        this.setErrorInfo(`强制刷新失败: ${error.message}`)
        uni.showToast({ title: '刷新失败', icon: 'none' })
      } finally {
        this.loading = false
        this.updateDebugInfo()
      }
    },
    
    // 测试添加轮播图
    async testAddBanner() {
      try {
        console.log('=== 开始测试添加轮播图 ===')
        
        const testBanner = {
          title: '测试轮播图',
          description: '这是一个测试轮播图',
          imageUrl: 'https://p2.itc.cn/q_70/images01/20211028/f0c35680e83a488cbecc2375c11b6e6f.jpeg',
          linkUrl: '',
          status: '启用'
        }
        
        console.log('测试数据:', testBanner)
        
        const result = await commonManagement.addHomeBanner({ banner: testBanner })
        console.log('测试结果:', result)
        
        if (result.success) {
          uni.showToast({ title: '测试添加成功', icon: 'success' })
          this.loadBanners() // 重新加载数据
        } else {
          uni.showToast({ title: '测试添加失败: ' + result.message, icon: 'none' })
        }
      } catch (error) {
        console.error('测试添加失败:', error)
        uni.showToast({ title: '测试添加失败: ' + error.message, icon: 'none' })
      }
    }
  }
}
</script>
<style scoped>
.admin-container { padding: 20rpx; background: #f5f5f5; min-height: 100vh; }
.page-header { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; display: flex; align-items: center; }
.header-content { display: flex; justify-content: space-between; align-items: center; }
.header-left { flex: 1; margin-right: 20rpx; }
.page-title { font-size: 36rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
.page-desc { font-size: 28rpx; color: #666; }
.header-actions { display: flex; gap: 10rpx; }
.init-btn, .add-btn { background: #007aff; color: #fff; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 28rpx; display: flex; align-items: center; justify-content: center; gap: 5rpx; }
.btn-icon { font-size: 28rpx; }
.stats-card { background: #fff; border-radius: 12rpx; padding: 30rpx; display: flex; justify-content: space-around; margin-top: 20rpx; }
.stat-item { text-align: center; }
.stat-number { font-size: 40rpx; font-weight: bold; color: #007aff; display: block; margin-bottom: 10rpx; }
.stat-label { font-size: 28rpx; color: #666; }
.banner-list { background: #fff; border-radius: 12rpx; padding: 30rpx; }
.list-header { margin-bottom: 30rpx; }
.list-title { font-size: 32rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
.list-subtitle { font-size: 24rpx; color: #999; }
.empty-state { text-align: center; padding: 80rpx 0; }
.empty-icon { font-size: 80rpx; color: #ccc; display: block; margin-bottom: 20rpx; }
.empty-title { font-size: 36rpx; font-weight: bold; color: #333; margin-bottom: 10rpx; }
.empty-desc { font-size: 28rpx; color: #666; margin-bottom: 30rpx; }
.empty-btn { background: #007aff; color: #fff; border: none; padding: 15rpx 30rpx; border-radius: 8rpx; font-size: 28rpx; }
.banner-items { display: flex; flex-direction: column; gap: 20rpx; }
.banner-item { border: 1rpx solid #e0e0e0; border-radius: 12rpx; overflow: hidden; display: flex; flex-direction: column; }
.banner-item.banner-disabled { opacity: 0.6; }
.banner-preview { position: relative; height: 200rpx; }
.banner-img { width: 100%; height: 100%; }
.banner-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; gap: 20rpx; opacity: 0; transition: opacity 0.3s; }
.banner-item:hover .banner-overlay { opacity: 1; }
.overlay-actions { display: flex; gap: 10rpx; }
.action-btn { background: rgba(255, 255, 255, 0.9); border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx; display: flex; align-items: center; gap: 5rpx; }
.action-btn.edit-btn { color: #007aff; }
.action-btn.delete-btn { color: #ff3b30; }
.action-icon { font-size: 24rpx; }
.status-badge { position: absolute; top: 10rpx; right: 10rpx; background: #fff; border-radius: 20rpx; padding: 5rpx 15rpx; font-size: 22rpx; font-weight: bold; color: #fff; }
.status-badge.status-enabled { background: #4CAF50; }
.status-badge.status-disabled { background: #FF9800; }
.banner-info { padding: 20rpx; }
.info-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rpx; }
.banner-title { font-size: 30rpx; font-weight: bold; color: #333; }
.banner-order { font-size: 24rpx; color: #999; }
.banner-desc { font-size: 26rpx; color: #666; display: block; margin-bottom: 10rpx; }
.banner-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 15rpx; }
.action-group { display: flex; gap: 10rpx; }
.sort-btn { background: #e0e0e0; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx; display: flex; align-items: center; gap: 5rpx; }
.sort-btn.btn-disabled { opacity: 0.6; cursor: not-allowed; }
.sort-icon { font-size: 24rpx; }
.toggle-group { display: flex; align-items: center; gap: 10rpx; }
.toggle-label { font-size: 28rpx; color: #333; }
.popup-content { background: #fff; border-radius: 12rpx; padding: 30rpx; width: 600rpx; max-height: 80vh; overflow-y: auto; }
.popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30rpx; }
.popup-title { font-size: 32rpx; font-weight: bold; color: #333; }
.close-btn { background: none; border: none; font-size: 40rpx; color: #999; }
.form-container { margin-bottom: 30rpx; }
.form-group { margin-bottom: 30rpx; }
.form-label { font-size: 28rpx; color: #333; display: block; margin-bottom: 10rpx; }
.form-input, .form-textarea { width: 100%; border: 1rpx solid #e0e0e0; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; box-sizing: border-box; }
.form-input { height: 80rpx; }
.form-textarea { height: 120rpx; resize: none; }
.form-tip { font-size: 24rpx; color: #999; margin-top: 5rpx; }
.upload-area { border: 2rpx dashed #e0e0e0; border-radius: 8rpx; padding: 40rpx; text-align: center; background: #f9f9f9; }
.upload-preview { width: 200rpx; height: 200rpx; border-radius: 8rpx; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10rpx; }
.upload-icon { font-size: 60rpx; }
.upload-text { font-size: 28rpx; color: #666; }
.upload-tip { font-size: 24rpx; color: #999; margin-top: 5rpx; }
.test-btn { background: #ff9800; color: #fff; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx; margin-top: 10rpx; }
.popup-buttons { display: flex; gap: 20rpx; margin-top: 30rpx; }
.popup-btn { flex: 1; padding: 20rpx; border-radius: 8rpx; font-size: 28rpx; border: 1rpx solid #e0e0e0; background: #fff; }
.popup-btn.cancel-btn { background: #e0e0e0; color: #333; border-color: #e0e0e0; }
.popup-btn.primary-btn { background: #007aff; color: #fff; border-color: #007aff; }
.loading-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.loading-content { display: flex; flex-direction: column; align-items: center; gap: 10rpx; }
.loading-icon { font-size: 60rpx; color: #007aff; }
.loading-text { font-size: 28rpx; color: #333; }

/* 调试区域样式 */
.debug-section {
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  margin: 20rpx 0;
  overflow: hidden;
}

.debug-header {
  background: #343a40;
  color: white;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-title {
  font-size: 28rpx;
  font-weight: bold;
}

.debug-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 32rpx;
  cursor: pointer;
}

.debug-content {
  padding: 20rpx;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
  padding: 12rpx;
  background: white;
  border-radius: 8rpx;
  border-left: 4rpx solid #007aff;
}

.debug-item:last-child {
  margin-bottom: 0;
}

.debug-label {
  font-size: 26rpx;
  color: #495057;
  font-weight: bold;
  min-width: 120rpx;
}

.debug-value {
  font-size: 24rpx;
  color: #6c757d;
  flex: 1;
  margin-left: 20rpx;
  word-break: break-all;
}

.debug-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}
</style>
