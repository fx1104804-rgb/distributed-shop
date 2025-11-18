export default [
  {
    url: '/api/inventory',
    method: 'get',
    response: () => {
      return [
        { productId: 1001, availableStock: 50, updatedAt: "2025-11-15T12:00:00" },
        { productId: 1002, availableStock: 20, updatedAt: "2025-11-15T11:20:00" },
      ]
    },
  },
  {
    url: /\/api\/inventory\/\d+/,
    method: 'get',
    response: ({ url }) => {
      const id = Number(url.split('/').pop())
      return { productId: id, availableStock: 50, updatedAt: "2025-11-15T12:00:00" }
    },
  },
  {
    url: '/api/inventory',
    method: 'post',
    response: () => true,
  },
  {
    url: /\/api\/inventory\/\d+/,
    method: 'put',
    response: () => true,
  },
  {
    url: /\/api\/inventory\/\d+/,
    method: 'delete',
    response: () => true,
  }
]
