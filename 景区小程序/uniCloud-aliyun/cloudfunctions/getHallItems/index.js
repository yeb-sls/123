'use strict';
exports.main = async (event, context) => {
  // 返回模拟数据，实际可从数据库查询
  return {
    code: 0,
    data: [
      { id: 1, name: '供花', price: 50, desc: '鲜花供养，清净庄严' },
      { id: 2, name: '供灯', price: 30, desc: '明灯供养，智慧增长' },
      { id: 3, name: '供果', price: 20, desc: '鲜果供养，福报圆满' },
      { id: 4, name: '供水', price: 10, desc: '净水供养，身心清凉' }
    ]
  }
}; 