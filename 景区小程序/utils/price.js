// 金额计算工具函数
// goodsList: [{ price, qty, discount, serviceFee }]
export function calcGoodsTotal(goodsList = []) {
  let total = 0, discount = 0, serviceFee = 0
  goodsList.forEach(item => {
    const price = Number(item.price)
    const qty = Number(item.qty)
    if (isNaN(price) || isNaN(qty) || price < 0 || qty < 0) return // 跳过无效项
    total += price * qty
    if (item.discount) discount += Number(item.discount) || 0
    if (item.serviceFee) serviceFee += Number(item.serviceFee) || 0
  })
  total = Number(total.toFixed(2))
  discount = Number(discount.toFixed(2))
  serviceFee = Number(serviceFee.toFixed(2))
  const finalTotal = Number((total - discount + serviceFee).toFixed(2))
  return { total, discount, serviceFee, finalTotal }
}

// 金额格式化（保留两位小数，千分位）
export function formatMoney(val) {
  if (typeof val !== 'number') val = Number(val) || 0
  return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
} 