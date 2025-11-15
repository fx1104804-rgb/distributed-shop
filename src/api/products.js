import api from './request'

// 获取全部商品
export const fetchProducts = () => api.get('/products')

// 获取单个
export const fetchProductById = (id) => api.get(`/products/${id}`)

// 新增
export const createProduct = (data) => api.post('/products', data)

// 更新
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)

// 删除
export const deleteProduct = (id) => api.delete(`/products/${id}`)
