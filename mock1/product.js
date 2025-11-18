let products = [
  { id: 1, name: "iPhone 15", price: 5999, description: "旗舰手机", created_at: "2025-01-01" },
  { id: 2, name: "MacBook Pro", price: 12999, description: "专业本", created_at: "2025-01-05" },
  { id: 3, name: "AirPods Pro", price: 1899, description: "降噪耳机", created_at: "2025-02-01" }
]

export default [
  // 获取全部商品
  {
    url: '/api/products',
    method: 'get',
    response: () => products
  },

  // 获取单个商品
  {
    url: '/api/products/:id',
    method: 'get',
    response: ({ query }) => {
      const id = Number(query.id)
      return products.find(p => p.id === id) || null
    }
  },

  // 新增商品
  {
    url: '/api/products',
    method: 'post',
    response: ({ body }) => {
      const newItem = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        created_at: new Date().toISOString().slice(0, 10),
        ...body
      }
      products.push(newItem)
      return true
    }
  },

  // 更新商品
  {
    url: '/api/products/:id',
    method: 'put',
    response: ({ query, body }) => {
      const id = Number(query.id)
      products = products.map(p => p.id === id ? { ...p, ...body } : p)
      return true
    }
  },

  // 删除商品
  {
    url: '/api/products/:id',
    method: 'delete',
    response: ({ query }) => {
      const id = Number(query.id)
      products = products.filter(p => p.id !== id)
      return true
    }
  }
]
