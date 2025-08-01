# exportJointOrders 云函数上传指南

## 问题描述

错误信息显示：`云函数[exportJointOrders]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间`

## 解决方案

需要将 `exportJointOrders` 云函数上传到云端。

## 上传步骤

### 方法一：使用 HBuilderX 上传

1. **打开 HBuilderX**
2. **找到云函数目录**
   - 在项目根目录下找到 `uniCloud-aliyun/cloudfunctions/exportJointOrders/` 文件夹
3. **右键点击云函数文件夹**
   - 选择 `exportJointOrders` 文件夹
   - 右键选择 "上传部署"
4. **确认上传**
   - 在弹出的对话框中确认上传
   - 等待上传完成

### 方法二：使用命令行上传

如果你使用命令行工具：

```bash
# 进入云函数目录
cd uniCloud-aliyun/cloudfunctions/exportJointOrders

# 上传云函数
uniCloud deploy
```

### 方法三：批量上传所有云函数

如果你想一次性上传所有云函数：

1. **在 HBuilderX 中**
   - 右键点击 `uniCloud-aliyun/cloudfunctions/` 文件夹
   - 选择 "上传所有云函数"

2. **或者使用命令行**
   ```bash
   # 进入云函数根目录
   cd uniCloud-aliyun/cloudfunctions
   
   # 上传所有云函数
   uniCloud deploy --all
   ```

## 需要上传的云函数列表

根据之前的实现，以下云函数需要确保已上传：

1. ✅ `exportJointOrders` - 导出合坛法会订单
2. ✅ `getJointOrders` - 获取合坛法会订单列表
3. ✅ `updateJointOrderStatus` - 更新订单状态
4. ✅ `addJointOrderRemark` - 添加订单备注
5. ✅ `notifyAdminOnPayment` - 支付成功通知
6. ✅ `getAdminNotifications` - 获取管理员通知
7. ✅ `markNotificationAsRead` - 标记通知为已读
8. ✅ `markAllNotificationsAsRead` - 标记所有通知为已读
9. ✅ `getUnreadNotificationCount` - 获取未读通知数量

## 验证上传成功

上传完成后，可以通过以下方式验证：

1. **在 HBuilderX 中**
   - 打开云函数列表
   - 确认 `exportJointOrders` 显示为已上传状态

2. **在 uniCloud 控制台**
   - 登录 uniCloud 控制台
   - 进入云函数管理
   - 确认 `exportJointOrders` 函数存在

3. **测试功能**
   - 重新访问合坛法会订单管理页面
   - 点击"导出订单"按钮
   - 确认不再出现云函数不存在的错误

## 常见问题

### 1. 上传失败
- 检查网络连接
- 确认 uniCloud 服务空间配置正确
- 检查云函数代码是否有语法错误

### 2. 权限问题
- 确认当前账号有上传云函数的权限
- 检查服务空间配置

### 3. 版本冲突
- 如果云端已有同名函数，会提示是否覆盖
- 选择覆盖即可

## 注意事项

1. **上传前检查**：确保云函数代码没有语法错误
2. **环境确认**：确认上传到正确的服务空间
3. **依赖检查**：如果云函数有依赖包，需要一并上传
4. **测试验证**：上传后及时测试功能是否正常

## 完成后的效果

上传成功后，合坛法会订单管理页面的导出功能将正常工作：

- 点击"导出订单"按钮
- 系统调用云函数获取订单数据
- 生成CSV格式数据
- 复制到剪贴板供用户使用 