import api from './request'

// 查询全部订单
export const fetchOrders = () => api.get('/orders')

// 查询单个订单
export const fetchOrderById = (id) => api.get(`/orders/${id}`)

// 创建订单
export const createOrder = (data) => api.post('/orders', data)

// 更新订单
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data)

// 删除订单
export const deleteOrder = (id) => api.delete(`/orders/${id}`)

// 支付订单
export const payOrder = (id) => api.post(`/orders/${id}/pay`)

// 取消订单
export const cancelOrder = (id) => api.post(`/orders/${id}/cancel`)
