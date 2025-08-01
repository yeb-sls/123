# admin 首页 commonManagement 导入错误修复说明

## 问题描述

错误信息：`index.vue:316 加载统计数据失败: ReferenceError: commonManagement is not defined`

## 问题原因

在 `pages/admin/index.vue` 文件中，`loadStats` 方法调用了 `commonManagement.getAdminStats()`，但是没有导入 `commonManagement` 云对象。

## 修复内容

### 添加缺失的导入 ✅

**在 script 标签开头添加了 commonManagement 的导入：**
```javascript
<script>
// 导入云对象
const commonManagement = uniCloud.importObject('common-management')
const notificationSystem = uniCloud.importObject('notification-system')
```

## 修复步骤

### 第一步：检查导入语句
1. ✅ 发现缺少 `commonManagement` 的导入
2. ✅ 添加了正确的导入语句

### 第二步：验证修复
1. ✅ 确保导入语句位置正确（在 script 标签开头）
2. ✅ 确保云对象名称正确（`common-management`）

## 下一步操作

### 1. 重新编译项目
在HBuilderX中：
1. 点击菜单 `运行` → `运行到小程序模拟器` → `微信开发者工具`
2. 或者点击工具栏的运行按钮，选择微信小程序

### 2. 测试管理首页
1. 进入管理后台首页
2. 检查统计数据是否正确加载
3. 验证页面功能是否正常

### 3. 检查云函数
确保相关云函数已正确部署：
1. 在HBuilderX中右键点击 `common-management` 云对象
2. 选择"上传并运行"
3. 检查云函数是否正常工作

## 预期结果

修复后，管理首页应该能够：
- ✅ 正确加载统计数据
- ✅ 显示用户数、订单数、收入等数据
- ✅ 不再出现 `commonManagement is not defined` 错误

## 相关文件

- **修复文件**：`pages/admin/index.vue`
- **相关云对象**：`common-management`
- **相关方法**：`getAdminStats()`

## 注意事项

1. **导入顺序**：确保云对象导入在 script 标签开头
2. **云对象名称**：使用正确的云对象名称（`common-management`）
3. **云函数部署**：确保相关云函数已正确部署
4. **错误处理**：添加了适当的错误处理逻辑

## 如果仍有问题

如果仍然报错，请检查：
1. 云对象是否正确部署
2. 网络连接是否正常
3. 控制台中的详细错误信息
4. 云函数日志中的错误信息

这个修复应该能解决 `commonManagement is not defined` 错误，让管理首页正常显示统计数据。 