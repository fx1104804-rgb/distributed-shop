let orderItems = [
  { id: 1, orderId: 2001, productId: 3001, quantity: 2, unitPrice: 49.99 },
  { id: 2, orderId: 2001, productId: 3002, quantity: 1, unitPrice: 19.9 },
  { id: 3, orderId: 2002, productId: 3003, quantity: 1, unitPrice: 149.5 }
]

export default [
  // 查询全部
  {
    url: "/api/order-items",
    method: "get",
    response: () => orderItems
  },

  // 查询单个
  {
    url: /\/api\/order-items\/\d+$/,
    method: "get",
    response: ({ url }) => {
      const id = Number(url.split("/").pop())
      return orderItems.find((i) => i.id === id) || null
    }
  },

  // 创建
  {
    url: "/api/order-items",
    method: "post",
    response: ({ body }) => {
      const newItem = {
        id: orderItems.length ? orderItems[orderItems.length - 1].id + 1 : 1,
        ...body
      }
      orderItems.push(newItem)
      return true
    }
  },

  // 更新
  {
    url: /\/api\/order-items\/\d+$/,
    method: "put",
    response: ({ url, body }) => {
      const id = Number(url.split("/").pop())
      orderItems = orderItems.map((i) =>
        i.id === id ? { ...i, ...body } : i
      )
      return true
    }
  },

  // 删除
  {
    url: /\/api\/order-items\/\d+$/,
    method: "delete",
    response: ({ url }) => {
      const id = Number(url.split("/").pop())
      orderItems = orderItems.filter((i) => i.id !== id)
      return true
    }
  }
]
