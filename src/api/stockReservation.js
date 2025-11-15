import api from './request'

// 获取全部预留记录
export const fetchStockReservations = () =>
  api.get('/stock-reservations')

// 获取单条预留记录
export const fetchStockReservationById = (id) =>
  api.get(`/stock-reservations/${id}`)

// 新增预留记录
export const createStockReservation = (data) =>
  api.post('/stock-reservations', data)

// 更新预留记录
export const updateStockReservation = (id, data) =>
  api.put(`/stock-reservations/${id}`, data)

// 删除预留记录
export const deleteStockReservation = (id) =>
  api.delete(`/stock-reservations/${id}`)
