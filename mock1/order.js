let orders = [
  {
    id: 2001,
    userId: 1001,
    totalAmount: 99.99,
    status: "Pending",
    paymentDeadline: "2025-11-15T12:00:00",
    createdAt: "2025-11-15T10:00:00",
    updatedAt: "2025-11-15T10:00:00"
  },
  {
    id: 2002,
    userId: 1002,
    totalAmount: 149.5,
    status: "Paid",
    paymentDeadline: "2025-11-14T20:00:00",
    createdAt: "2025-11-14T18:00:00",
    updatedAt: "2025-11-14T18:00:00"
  }
]

export default [
  // 查询全部
  {
    url: "/api/orders",
    method: "get",
    response: () => orders
  },

  // 查询单个
  {
    url: /\/api\/orders\/\d+$/,
    method: "get",
    response: ({ url }) => {
      const id = Number(url.split("/").pop())
      return orders.find((o) => o.id === id) || {}
    }
  },

  // 创建
  {
    url: "/api/orders",
    method: "post",
    response: ({ body }) => {
      const newOrder = {
        id: orders.length ? orders[orders.length - 1].id + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentDeadline: "",
        ...body
      }
      orders.push(newOrder)
      return true
    }
  },

  // 更新
  {
    url: /\/api\/orders\/\d+$/,
    method: "put",
    response: ({ url, body }) => {
      const id = Number(url.split("/").pop())
      orders = orders.map((o) =>
        o.id === id ? { ...o, ...body, updatedAt: new Date().toISOString() } : o
      )
      return true
    }
  },

  // 删除
  {
    url: /\/api\/orders\/\d+$/,
    method: "delete",
    response: ({ url }) => {
      const id = Number(url.split("/").pop())
      orders = orders.filter((o) => o.id !== id)
      return true
    }
  },

  // 支付
  {
    url: /\/api\/orders\/\d+\/pay$/,
    method: "post",
    response: ({ url }) => {
      const id = Number(url.split("/").slice(-2, -1)[0])
      orders = orders.map((o) =>
        o.id === id ? { ...o, status: "Paid", updatedAt: new Date().toISOString() } : o
      )
      return "支付成功"
    }
  },

  // 取消
  {
    url: /\/api\/orders\/\d+\/cancel$/,
    method: "post",
    response: ({ url }) => {
      const id = Number(url.split("/").slice(-2, -1)[0])
      orders = orders.map((o) =>
        o.id === id
          ? { ...o, status: "Cancelled", updatedAt: new Date().toISOString() }
          : o
      )
      return "订单已取消"
    }
  }
]
