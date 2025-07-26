<template>
  <view class="admin-container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-left">
          <text class="page-title">首页导航管理</text>
          <text class="page-desc">管理小程序首页的导航按钮</text>
        </view>
        <view class="header-right">
          <button class="refresh-btn" @click="loadNavs" :disabled="loading">
            <text class="refresh-icon">🔄</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-number">{{ navs.length }}</text>
        <text class="stat-label">总数</text>
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

    <!-- 操作栏 -->
    <view class="action-bar">
      <view class="search-box">
        <input v-model="searchText" placeholder="搜索导航名称或图标" class="search-input" @input="filterNavs" />
        <text class="search-icon">🔍</text>
      </view>
      <button class="action-btn primary" @click="showAddModal">
        <text class="btn-icon">＋</text>
        <text class="btn-text">添加导航</text>
      </button>
    </view>

    <!-- 导航列表 -->
    <view class="nav-list">
      <view class="list-header">
        <text class="list-title">导航按钮列表</text>
        <text class="list-count">共 {{ filteredNavs.length }} 项</text>
      </view>
      
      <view class="nav-items" v-if="filteredNavs.length > 0">
        <view v-for="(nav, index) in filteredNavs" :key="getNavKey(nav, index)" class="nav-item card">
          <view class="nav-preview">
            <view class="nav-status" :class="nav.enabled ? 'enabled' : 'disabled'">
              <text class="status-icon">{{ nav.enabled ? '✓' : '✗' }}</text>
            </view>
            <view class="nav-icon-wrap" :style="{ backgroundColor: nav.bgColor }">
              <text class="nav-icon" :style="{ color: nav.color }">{{ nav.icon }}</text>
            </view>
            <view class="nav-info">
              <view class="nav-text-row">
                <text class="nav-text" :style="{ color: nav.color }">{{ nav.text }}</text>
                <button class="quick-edit-btn" @click="quickEditText(index)" :disabled="loading">
                  <text class="quick-edit-icon">✏️</text>
                </button>
              </view>
              <text class="nav-url">{{ nav.url || '未设置链接' }}</text>
              <text class="nav-order">排序: {{ nav.order || index + 1 }}</text>
              <text class="nav-time">{{ formatTime(nav.updateTime) }}</text>
            </view>
          </view>
          <view class="nav-actions">
            <button class="action-btn edit" @click="editNav(index)" :disabled="loading">
              <text class="action-icon">✏️</text>
              <text class="action-text">编辑</text>
            </button>
            <button class="action-btn toggle" @click="toggleNav(index)" :disabled="loading">
              <text class="action-icon">{{ nav.enabled ? '✗' : '✓' }}</text>
              <text class="action-text">{{ nav.enabled ? '禁用' : '启用' }}</text>
            </button>
            <button class="action-btn delete" @click="deleteNav(index)" :disabled="loading">
              <text class="action-icon">🗑️</text>
              <text class="action-text">删除</text>
            </button>
            <view class="move-actions">
              <button class="move-btn" @click="moveNav(index, 'up')" :disabled="index === 0 || loading">
                <text class="move-icon">↑</text>
              </button>
              <button class="move-btn" @click="moveNav(index, 'down')" :disabled="index === filteredNavs.length - 1 || loading">
                <text class="move-icon">↓</text>
              </button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <text class="empty-icon">🔗</text>
        <text class="empty-title">暂无导航数据</text>
        <text class="empty-desc">{{ searchText ? '没有找到匹配的导航' : '点击上方按钮添加导航' }}</text>
        <button class="empty-btn" @click="showAddModal" v-if="!searchText">立即添加</button>
      </view>
    </view>

    <!-- 添加/编辑弹窗 -->
    <uni-popup :show="showNavModal" type="center" @close="closeNavModal">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑导航' : '添加导航' }}</text>
          <button class="close-btn" @click="closePopup">×</button>
        </view>
        
        <view class="form-container">
          <view class="form-group">
            <text class="form-label">按钮文字 *</text>
            <textarea 
              :value="currentNav.text"
              placeholder="请输入按钮文字" 
              class="form-input" 
              maxlength="10"
              auto-height
              style="min-height: 60rpx;"
              @input="onTextInput"
              @blur="onTextBlur"
              @change="onTextChange"
              @focus="onTextFocus"
            />
            <text class="form-tip">最多10个字符</text>
            <text class="form-debug">当前值: {{ currentNav.text }}</text>
            <button class="test-btn" @click="testTextChange">测试文字修改</button>
          </view>
          
          <view class="form-group">
            <text class="form-label">按钮图标 *</text>
            <view class="icon-selector">
              <input 
                :value="currentNav.icon"
                placeholder="请输入图标emoji" 
                class="form-input" 
                maxlength="5"
                confirm-type="done"
                @input="onIconInput"
                @blur="onIconBlur"
                @change="onIconChange"
                @focus="onIconFocus"
              />
              <view class="icon-preview" v-if="currentNav.icon">
                <text class="preview-icon">{{ currentNav.icon }}</text>
              </view>
            </view>
            <text class="form-tip">建议使用emoji图标</text>
            <text class="form-debug">当前值: {{ currentNav.icon }}</text>
            <button class="test-btn" @click="testIconChange" style="margin-top: 10rpx; background: #007aff; color: #fff; border: none; padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx;">测试图标修改</button>
          </view>
          
          <view class="form-group">
            <text class="form-label">跳转页面</text>
            <picker :range="pageOptions" @change="onPageChange" :value="pageOptions.indexOf(currentNav.url)">
              <view class="picker">
                <text class="picker-value">{{ currentNav.url || '请选择页面' }}</text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
            <text class="form-tip">选择点击后跳转的页面</text>
          </view>
          
          <view class="form-group">
            <text class="form-label">文字颜色</text>
            <view class="color-picker">
              <view 
                v-for="color in colorOptions" 
                :key="color.value"
                class="color-item"
                :class="{ active: currentNav.color === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="selectColor(color.value)"
              ></view>
            </view>
          </view>
          
          <view class="form-group">
            <text class="form-label">背景颜色</text>
            <view class="color-picker">
              <view 
                v-for="bgColor in bgColorOptions" 
                :key="bgColor.value"
                class="color-item"
                :class="{ active: currentNav.bgColor === bgColor.value }"
                :style="{ backgroundColor: bgColor.value }"
                @click="selectBgColor(bgColor.value)"
              ></view>
            </view>
          </view>
          
          <view class="form-group">
            <text class="form-label">是否启用</text>
            <switch :checked="currentNav.enabled" @change="onEnabledChange" />
            <text class="form-tip">禁用后不会在首页显示</text>
          </view>
          
          <!-- 预览区域 -->
          <view class="form-group">
            <text class="form-label">预览效果</text>
            <view class="nav-preview-container">
              <view class="nav-preview-item" :style="{ backgroundColor: currentNav.bgColor }">
                <text class="nav-preview-icon" :style="{ color: currentNav.color }">{{ currentNav.icon || '📱' }}</text>
                <text class="nav-preview-text" :style="{ color: currentNav.color }">{{ currentNav.text || '导航文字' }}</text>
              </view>
            </view>
            <text class="form-tip">实时预览导航按钮效果</text>
          </view>
        </view>
        
        <view class="popup-buttons">
          <button class="popup-btn" @click="closePopup">取消</button>
          <button class="popup-btn primary" @click="saveNav" :disabled="loading || !isFormValid">
            {{ loading ? '保存中...' : '保存' }}
          </button>
        </view>
      </view>
    </uni-popup>

    <!-- 确认删除弹窗 -->
    <uni-popup :show="showDeleteModal" type="center" @close="closeDeleteModal">
      <view class="confirm-modal">
        <view class="confirm-header">
          <text class="confirm-icon">⚠️</text>
          <text class="confirm-title">确认删除</text>
        </view>
        <view class="confirm-content">
          <text class="confirm-text">确定要删除导航 "{{ deleteNavData.text }}" 吗？</text>
          <text class="confirm-warning">此操作不可恢复！</text>
        </view>
        <view class="confirm-buttons">
          <button class="confirm-btn" @click="cancelDelete">取消</button>
          <button class="confirm-btn danger" @click="confirmDelete" :disabled="loading">
            {{ loading ? '删除中...' : '确认删除' }}
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'

export default {
  components: {
    uniPopup
  },
  data() {
    return {
      navs: [],
      filteredNavs: [],
      searchText: '',
      currentNav: {
        text: '',
        icon: '',
        url: '',
        color: '#333333',
        bgColor: '#FFFFFF',
        enabled: true
      },
      deleteNavData: {},
      isEdit: false,
      editIndex: -1,
      loading: false,
      pageOptions: [
        '/pages/fahui/special',
        '/pages/fahui/group',
        '/pages/light/index',
        '/pages/hall/index',
        '/pages/gongde/index',
        '/pages/order/index'
      ],
      colorOptions: [
        { label: '黑色', value: '#333333' },
        { label: '蓝色', value: '#007AFF' },
        { label: '绿色', value: '#34C759' },
        { label: '橙色', value: '#FF9500' },
        { label: '红色', value: '#FF3B30' },
        { label: '紫色', value: '#AF52DE' }
      ],
      bgColorOptions: [
        { label: '白色', value: '#FFFFFF' },
        { label: '浅蓝', value: '#E3F2FD' },
        { label: '浅绿', value: '#E8F5E8' },
        { label: '浅橙', value: '#FFF3E0' },
        { label: '浅红', value: '#FFEBEE' },
        { label: '浅紫', value: '#F3E5F5' }
      ],
      showNavModal: false,
      showDeleteModal: false
    }
  },
  computed: {
    enabledCount() {
      return this.navs.filter(nav => nav.enabled).length
    },
    disabledCount() {
      return this.navs.filter(nav => !nav.enabled).length
    },
    isFormValid() {
      return this.currentNav.text.trim() && this.currentNav.icon.trim()
    }
  },
  onLoad() {
    this.loadNavs()
  },
  methods: {
    // 获取导航key
    getNavKey(nav, index) {
      return nav._id || 'nav-' + index;
    },
    
    // 加载导航数据
    async loadNavs() {
      try {
        this.loading = true
        console.log('开始加载导航数据...')
        const result = await uniCloud.callFunction({
          name: 'getHomeNavs'
        })
        console.log('导航数据加载结果:', result)
        
        if (result.result && result.result.code === 0) {
          this.navs = result.result.data || []
          console.log('导航数据加载成功，共', this.navs.length, '条')
        } else {
          console.error('导航数据加载失败:', result.result?.message)
          this.navs = []
          uni.showToast({
            title: '加载失败: ' + (result.result?.message || '未知错误'),
            icon: 'none'
          })
        }
        this.filterNavs()
      } catch (error) {
        console.error('加载导航失败:', error)
        this.navs = []
        uni.showToast({
          title: '加载失败: ' + (error.message || '未知错误'),
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 筛选导航
    filterNavs() {
      if (!this.searchText) {
        this.filteredNavs = [...this.navs]
      } else {
        this.filteredNavs = this.navs.filter(nav => 
          nav.text.toLowerCase().includes(this.searchText.toLowerCase()) ||
          nav.icon.includes(this.searchText)
        )
      }
    },

    // 显示添加弹窗
    showAddModal() {
      console.log('显示添加弹窗')
      this.isEdit = false
      this.editIndex = -1
      this.currentNav = {
        text: '',
        icon: '',
        url: '',
        color: '#333333',
        bgColor: '#FFFFFF',
        enabled: true
      }
      console.log('添加模式下的currentNav:', this.currentNav)
      this.showNavModal = true
    },

    // 编辑导航
    editNav(index) {
      console.log('编辑导航:', index)
      console.log('原始导航数据:', this.filteredNavs[index])
      this.isEdit = true
      this.editIndex = index
      
      // 深拷贝确保数据正确复制
      const originalNav = this.filteredNavs[index]
      this.currentNav = {
        text: originalNav.text || '',
        icon: originalNav.icon || '',
        url: originalNav.url || '',
        color: originalNav.color || '#333333',
        bgColor: originalNav.bgColor || '#FFFFFF',
        enabled: originalNav.enabled !== undefined ? originalNav.enabled : true
      }
      
      console.log('编辑的导航数据:', this.currentNav)
      console.log('currentNav.text:', this.currentNav.text)
      console.log('currentNav.icon:', this.currentNav.icon)
      this.showNavModal = true
    },

    // 切换导航状态
    async toggleNav(index) {
      const nav = this.filteredNavs[index]
      const newStatus = !nav.enabled
      
      try {
        await uniCloud.callFunction({
          name: 'updateHomeNav',
          data: {
            id: nav._id,
            nav: { ...nav, enabled: newStatus }
          }
        })
        
        // 更新本地数据
        const originalIndex = this.navs.findIndex(n => n._id === nav._id)
        if (originalIndex !== -1) {
          this.navs[originalIndex].enabled = newStatus
        }
        this.filterNavs()
        
        uni.showToast({
          title: newStatus ? '已启用' : '已禁用',
          icon: 'success'
        })
      } catch (error) {
        console.error('切换状态失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    // 删除导航
    deleteNav(index) {
      this.deleteNavData = this.filteredNavs[index]
      this.showDeleteModal = true
    },

    // 确认删除
    async confirmDelete() {
      try {
        this.loading = true
        await uniCloud.callFunction({
          name: 'deleteHomeNav',
          data: { id: this.deleteNavData._id }
        })
        
        // 从本地数据中删除
        const index = this.navs.findIndex(n => n._id === this.deleteNavData._id)
        if (index !== -1) {
          this.navs.splice(index, 1)
        }
        this.filterNavs()
        
        this.showDeleteModal = false
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('删除失败:', error)
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 取消删除
    cancelDelete() {
      this.showDeleteModal = false
    },

    // 关闭导航弹窗
    closeNavModal() {
      this.showNavModal = false
    },

    // 关闭删除弹窗
    closeDeleteModal() {
      this.showDeleteModal = false
    },



    // 移动导航位置
    async moveNav(index, direction) {
      console.log('移动导航:', index, direction)
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= this.filteredNavs.length) return
      
      // 获取要移动的导航项
      const navToMove = this.filteredNavs[index]
      const navToSwap = this.filteredNavs[newIndex]
      
      // 先更新本地数据，实现即时UI更新
      const temp = this.filteredNavs[index]
      this.filteredNavs[index] = this.filteredNavs[newIndex]
      this.filteredNavs[newIndex] = temp
      
      // 同时更新原始navs数组
      const originalIndex = this.navs.findIndex(n => n._id === navToMove._id)
      const originalNewIndex = this.navs.findIndex(n => n._id === navToSwap._id)
      
      if (originalIndex !== -1 && originalNewIndex !== -1) {
        const temp2 = this.navs[originalIndex]
        this.navs[originalIndex] = this.navs[originalNewIndex]
        this.navs[originalNewIndex] = temp2
      }
      
      // 更新排序
      try {
        await uniCloud.callFunction({
          name: 'updateNavOrder',
          data: { navs: this.filteredNavs }
        })
        uni.showToast({
          title: '排序更新成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('更新排序失败:', error)
        uni.showToast({
          title: '更新失败',
          icon: 'none'
        })
        // 恢复原位置
        const temp3 = this.filteredNavs[index]
        this.filteredNavs[index] = this.filteredNavs[newIndex]
        this.filteredNavs[newIndex] = temp3
        
        if (originalIndex !== -1 && originalNewIndex !== -1) {
          const temp4 = this.navs[originalIndex]
          this.navs[originalIndex] = this.navs[originalNewIndex]
          this.navs[originalNewIndex] = temp4
        }
      }
    },

    // 页面选择
    onPageChange(e) {
      this.currentNav.url = this.pageOptions[e.detail.value]
    },

    // 选择文字颜色
    selectColor(color) {
      this.currentNav.color = color
    },

    // 选择背景颜色
    selectBgColor(bgColor) {
      this.currentNav.bgColor = bgColor
    },

    // 启用状态切换
    onEnabledChange(e) {
      this.currentNav.enabled = e.detail.value
    },

    // 保存导航
    async saveNav() {
      console.log('开始保存导航...')
      console.log('表单验证结果:', this.isFormValid)
      console.log('当前导航数据:', this.currentNav)
      
      if (!this.isFormValid) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      try {
        this.loading = true
        console.log('设置loading状态为true')
        
        if (this.isEdit) {
          console.log('执行编辑操作...')
          console.log('编辑的导航ID:', this.filteredNavs[this.editIndex]._id)
          console.log('编辑的导航数据:', this.currentNav)
          
          // 更新导航
          const updateResult = await uniCloud.callFunction({
            name: 'updateHomeNav',
            data: {
              id: this.filteredNavs[this.editIndex]._id,
              nav: this.currentNav
            }
          })
          console.log('更新导航结果:', updateResult)
          
          if (updateResult.result && updateResult.result.code === 0) {
            // 更新本地数据
            const originalIndex = this.navs.findIndex(n => n._id === this.filteredNavs[this.editIndex]._id)
            if (originalIndex !== -1) {
              this.navs[originalIndex] = { ...this.currentNav }
            }
            // 同时更新filteredNavs中的数据
            this.filteredNavs[this.editIndex] = { ...this.currentNav }
          } else {
            throw new Error(updateResult.result?.message || '更新失败')
          }
        } else {
          console.log('执行添加操作...')
          console.log('调用addHomeNav云函数，参数:', { nav: this.currentNav })
          
          // 添加导航
          const result = await uniCloud.callFunction({
            name: 'addHomeNav',
            data: { nav: this.currentNav }
          })
          console.log('添加导航结果:', result)
          
          if (result.result && result.result.data) {
            console.log('添加成功，新导航数据:', result.result.data)
            this.navs.push(result.result.data)
          } else {
            console.error('添加失败，返回结果异常:', result)
            throw new Error('云函数返回结果异常')
          }
        }

        console.log('保存成功，关闭弹窗')
        this.closePopup()
        this.filterNavs()
        uni.showToast({
          title: this.isEdit ? '更新成功' : '添加成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('保存失败:', error)
        console.error('错误详情:', error.message)
        console.error('错误堆栈:', error.stack)
        uni.showToast({
          title: '保存失败: ' + error.message,
          icon: 'none'
        })
      } finally {
        console.log('设置loading状态为false')
        this.loading = false
      }
    },

    // 关闭弹窗
    closePopup() {
      this.showNavModal = false
    },

    // 文字输入事件
    onTextInput(e) {
      console.log('文字输入事件:', e.detail.value)
      this.currentNav.text = e.detail.value
      console.log('更新后currentNav.text:', this.currentNav.text)
    },

    // 文字聚焦事件
    onTextFocus(e) {
      console.log('文字聚焦事件')
      console.log('当前文字值:', this.currentNav.text)
    },

    // 图标输入事件
    onIconInput(e) {
      console.log('图标输入事件:', e.detail.value)
      this.currentNav.icon = e.detail.value
      console.log('更新后currentNav.icon:', this.currentNav.icon)
    },

    // 图标聚焦事件
    onIconFocus(e) {
      console.log('图标聚焦事件')
      console.log('当前图标值:', this.currentNav.icon)
    },

    // 文字失焦事件
    onTextBlur(e) {
      console.log('文字失焦事件:', e.detail.value)
      this.currentNav.text = e.detail.value
      console.log('失焦后currentNav.text:', this.currentNav.text)
    },

    // 文字改变事件
    onTextChange(e) {
      console.log('文字改变事件:', e.detail.value)
      this.currentNav.text = e.detail.value
      console.log('改变后currentNav.text:', this.currentNav.text)
    },

    // 图标失焦事件
    onIconBlur(e) {
      console.log('图标失焦事件:', e.detail.value)
      this.currentNav.icon = e.detail.value
      console.log('失焦后currentNav.icon:', this.currentNav.icon)
    },

    // 图标改变事件
    onIconChange(e) {
      console.log('图标改变事件:', e.detail.value)
      this.currentNav.icon = e.detail.value
      console.log('改变后currentNav.icon:', this.currentNav.icon)
    },

    // 测试文字修改
    testTextChange() {
      console.log('测试文字修改')
      this.currentNav.text = '测试文字' + Date.now()
      console.log('修改后currentNav.text:', this.currentNav.text)
    },

    // 测试图标修改
    testIconChange() {
      console.log('测试图标修改')
      const icons = ['🕉️', '🙏', '💡', '🏛️', '💰', '🎯', '📱', '⭐']
      const randomIcon = icons[Math.floor(Math.random() * icons.length)]
      this.currentNav.icon = randomIcon
      console.log('修改后currentNav.icon:', this.currentNav.icon)
    },

    // 快速编辑文字
    quickEditText(index) {
      const nav = this.filteredNavs[index]
      uni.showModal({
        title: '快速编辑',
        content: '请输入新的导航文字',
        editable: true,
        placeholderText: nav.text,
        success: async (res) => {
          if (res.confirm && res.content.trim()) {
            try {
              const newText = res.content.trim()
              await uniCloud.callFunction({
                name: 'updateHomeNav',
                data: {
                  id: nav._id,
                  nav: { ...nav, text: newText }
                }
              })
              
              // 更新本地数据
              const originalIndex = this.navs.findIndex(n => n._id === nav._id)
              if (originalIndex !== -1) {
                this.navs[originalIndex].text = newText
              }
              this.filteredNavs[index].text = newText
              
              uni.showToast({
                title: '更新成功',
                icon: 'success'
              })
            } catch (error) {
              console.error('快速编辑失败:', error)
              uni.showToast({
                title: '更新失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) { // 1分钟内
        return '刚刚'
      } else if (diff < 3600000) { // 1小时内
        return `${Math.floor(diff / 60000)}分钟前`
      } else if (diff < 86400000) { // 1天内
        return `${Math.floor(diff / 3600000)}小时前`
      } else {
        return `${date.getMonth() + 1}-${date.getDate()}`
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20rpx;
  background: linear-gradient(135deg, #f8fafc 0%, #e3e9f7 100%);
  min-height: 100vh;
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.page-desc {
  font-size: 26rpx;
  color: #666;
}

.refresh-btn {
  background: #007aff;
  color: #fff;
  border: none;
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.refresh-btn:active {
  background: #0056cc;
  transform: scale(0.95);
}

.refresh-btn:disabled {
  background: #ccc;
}

.refresh-icon {
  font-size: 28rpx;
}

.stats-section {
  display: flex;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.stat-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 0;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  flex: 1;
}

.stat-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #007aff;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}
.search-box {
  position: relative;
  flex: 1;
  margin-right: 20rpx;
}
.search-input {
  width: 100%;
  padding: 16rpx 40rpx 16rpx 36rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #f8f9fa;
  outline: none;
}
.search-icon {
  position: absolute;
  left: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #b0b0b0;
}
.action-btn.primary {
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 40rpx;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.08);
  transition: background 0.2s;
}
.action-btn.primary:active {
  background: #0056cc;
}
.nav-list {
  margin-top: 10rpx;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.list-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.list-count {
  font-size: 24rpx;
  color: #999;
}
.nav-item.card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 18rpx;
  padding: 24rpx 20rpx;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}
.nav-item.card:hover {
  box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.12);
}
.nav-preview {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.nav-status {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 8rpx;
}
.nav-status.enabled {
  background: #e6f7ff;
  color: #007aff;
}
.nav-status.disabled {
  background: #fbeaea;
  color: #ff3b30;
}
.nav-icon-wrap {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  background: #f8f9fa;
}
.nav-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.nav-text-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 4rpx;
}

.nav-text {
  font-size: 28rpx;
  font-weight: bold;
  flex: 1;
}

.quick-edit-btn {
  background: none;
  border: none;
  padding: 4rpx;
  border-radius: 4rpx;
  transition: all 0.3s ease;
}

.quick-edit-btn:active {
  background: rgba(0, 122, 255, 0.1);
  transform: scale(0.9);
}

.quick-edit-btn:disabled {
  opacity: 0.5;
}

.quick-edit-icon {
  font-size: 20rpx;
}
.nav-url {
  font-size: 22rpx;
  color: #999;
}
.nav-order {
  font-size: 22rpx;
  color: #b0b0b0;
}
.nav-time {
  font-size: 20rpx;
  color: #b0b0b0;
}
.nav-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 12rpx;
}
.action-btn {
  background: #f8f9fa;
  color: #333;
  border: none;
  border-radius: 8rpx;
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  transition: background 0.2s;
}
.action-btn:active {
  background: #e0e0e0;
}
.action-btn.edit {
  color: #007aff;
}
.action-btn.toggle {
  color: #ff9500;
}
.action-btn.delete {
  color: #ff3b30;
}
.move-actions {
  display: flex;
  gap: 4rpx;
}
.move-btn {
  background: #f0f4fa;
  color: #007aff;
  border: none;
  border-radius: 6rpx;
  padding: 8rpx 12rpx;
  font-size: 22rpx;
  transition: background 0.2s;
}
.move-btn:active {
  background: #e6f7ff;
}
.empty-state {
  text-align: center;
  padding: 60rpx 0;
  color: #b0b0b0;
}
.empty-icon {
  font-size: 60rpx;
  margin-bottom: 16rpx;
}
.empty-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}
.empty-desc {
  font-size: 22rpx;
  margin-bottom: 18rpx;
}
.empty-btn {
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.08);
  transition: background 0.2s;
}
.empty-btn:active {
  background: #0056cc;
}
.popup-content {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.close-btn:active {
  color: #666;
}

.form-container {
  margin-bottom: 30rpx;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.form-input {
  width: 100%;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background: #f8f9fa;
}

.form-tip {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.form-debug {
  font-size: 20rpx;
  color: #ff6b35;
  margin-top: 4rpx;
  display: block;
  background: #fff3e0;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
}

.test-btn {
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 6rpx;
  padding: 8rpx 16rpx;
  font-size: 22rpx;
  margin-top: 8rpx;
}

.icon-selector {
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.icon-preview {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-icon {
  font-size: 32rpx;
}

.picker {
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.picker-value {
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

.color-picker {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.color-item {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-item:active {
  transform: scale(0.9);
}

.color-item.active {
  border-color: #007aff;
}

.popup-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.popup-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
  transition: all 0.3s ease;
}

.popup-btn:active {
  transform: scale(0.98);
}

.popup-btn.primary {
  background: #007aff;
  color: #fff;
  border-color: #007aff;
}

.popup-btn.primary:active {
  background: #0056cc;
}

.popup-btn:disabled {
  background: #ccc;
  color: #999;
  border-color: #ccc;
}

.confirm-modal {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  width: 500rpx;
  text-align: center;
}

.confirm-header {
  margin-bottom: 30rpx;
}

.confirm-icon {
  font-size: 60rpx;
  display: block;
  margin-bottom: 20rpx;
}

.confirm-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.confirm-content {
  margin-bottom: 30rpx;
}

.confirm-text {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.confirm-warning {
  font-size: 24rpx;
  color: #ff3b30;
  display: block;
}

.confirm-buttons {
  display: flex;
  gap: 20rpx;
}

.confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
  transition: all 0.3s ease;
}

.confirm-btn:active {
  transform: scale(0.98);
}

.confirm-btn.danger {
  background: #ff3b30;
  color: #fff;
  border-color: #ff3b30;
}

.confirm-btn.danger:active {
  background: #d70015;
}

.confirm-btn:disabled {
  background: #ccc;
  color: #999;
  border-color: #ccc;
}

.preview-modal {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.preview-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 1rpx solid #e0e0e0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120rpx, 1fr));
  gap: 20rpx;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 15rpx;
  border-radius: 12rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.preview-icon {
  font-size: 40rpx;
}

.preview-text {
  font-size: 24rpx;
  font-weight: bold;
  text-align: center;
}

.preview-footer {
  text-align: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.preview-tip {
  font-size: 22rpx;
  color: #666;
}

.import-modal {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.import-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.import-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.import-content {
  margin-bottom: 30rpx;
}

.import-textarea {
  width: 100%;
  height: 300rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background: #f8f9fa;
  line-height: 1.5;
}

.import-tip {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.import-buttons {
  display: flex;
  gap: 20rpx;
}

.import-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: 1rpx solid #e0e0e0;
  background: #fff;
  transition: all 0.3s ease;
}

.import-btn:active {
  transform: scale(0.98);
}

.import-btn.primary {
  background: #007aff;
  color: #fff;
  border-color: #007aff;
}

.import-btn.primary:active {
  background: #0056cc;
}

.import-btn:disabled {
  background: #ccc;
  color: #999;
  border-color: #ccc;
}

/* 预览区域样式 */
.nav-preview-container {
  display: flex;
  justify-content: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 1rpx solid #e0e0e0;
}

.nav-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 30rpx;
  border-radius: 12rpx;
  min-width: 120rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.nav-preview-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.nav-preview-icon {
  font-size: 48rpx;
  line-height: 1;
}

.nav-preview-text {
  font-size: 24rpx;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
}
</style>