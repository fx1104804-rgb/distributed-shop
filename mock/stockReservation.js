export default [
  // 全部预留记录
  {
    url: '/api/stock-reservations',
    method: 'get',
    response: () => {
      return [
        { id: 1, orderId: 1001, productId: 8, quantity: 2, status: "RESERVED", createdTime: "2025-11-15T10:20:00" },
        { id: 2, orderId: 1002, productId: 10, quantity: 1, status: "CANCELLED", createdTime: "2025-11-15T11:00:00" }
      ]
    }
  },

  // 单条查询
  {
    url: /\/api\/stock-reservations\/\d+/,
    method: 'get',
    response: ({ url }) => {
      const id = Number(url.split('/').pop())
      return {
        id,
        orderId: 2000 + id,
        productId: 5,
        quantity: 3,
        status: "RESERVED",
        createdTime: "2025-11-15T10:20:00"
      }
    }
  },

  // 新增
  {
    url: '/api/stock-reservations',
    method: 'post',
    response: () => true
  },

  // 更新
  {
    url: /\/api\/stock-reservations\/\d+/,
    method: 'put',
    response: () => true
  },

  // 删除
  {
    url: /\/api\/stock-reservations\/\d+/,
    method: 'delete',
    response: () => true
  }
]
