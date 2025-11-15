import api from "./request"

// 获取全部库存
export const fetchInventoryList = () => api.get('/inventory')

// 获取单个库存
export const fetchInventoryById = (productId) =>
  api.get(`/inventory/${productId}`)

// 新增库存
export const createInventory = (data) =>
  api.post('/inventory', data)

// 更新库存
export const updateInventory = (productId, data) =>
  api.put(`/inventory/${productId}`, data)

// 删除库存
export const deleteInventory = (productId) =>
  api.delete(`/inventory/${productId}`)
