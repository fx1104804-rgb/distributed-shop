import api from "./request"

// 查询所有订单项
export const fetchOrderItemsAll = () => api.get("/order-items")

// 查询单个
export const fetchOrderItemById = (id) => api.get(`/order-items/${id}`)

// 创建
export const createOrderItem = (data) => api.post("/order-items", data)

// 更新
export const updateOrderItem = (id, data) =>
  api.put(`/order-items/${id}`, data)

// 删除
export const deleteOrderItem = (id) =>
  api.delete(`/order-items/${id}`)
