let users = [
  { id: 1, username: 'Alice', created_at: Date.now() },
  { id: 2, username: 'Bob', created_at: Date.now() },
]

// 生成自增ID
function nextId() {
  return users.length ? Math.max(...users.map(u => u.id)) + 1 : 1
}

export default [
  // 获取全部
  {
    url: '/api/users',
    method: 'get',
    response: () => users,
  },

  // 获取单个
  {
    url: '/api/users/:id',
    method: 'get',
    response: ({ query }) => {
      const id = Number(query.id)
      return users.find(u => u.id === id) || null
    },
  },

  // 创建
  {
    url: '/api/users',
    method: 'post',
    response: ({ body }) => {
      const newUser = {
        id: nextId(),
        username: body.username,
        created_at: Date.now(),
      }
      users.push(newUser)
      return true
    },
  },

  // 更新
  {
    url: '/api/users/:id',
    method: 'put',
    response: ({ query, body }) => {
      const id = Number(query.id)
      const index = users.findIndex(u => u.id === id)
      if (index > -1) {
        users[index].username = body.username
      }
      return true
    },
  },

  // 删除
  {
    url: '/api/users/:id',
    method: 'delete',
    response: ({ query }) => {
      const id = Number(query.id)
      users = users.filter(u => u.id !== id)
      return true
    },
  },
]
