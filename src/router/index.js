import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard',  component: () => import('../views/Dashboard.vue') },
  { path: '/products',   component: () => import('../views/ProductList.vue') },
  { path: '/orders',     component: () => import('../views/OrderList.vue') },
  { path: '/inventory',  component: () => import('../views/InventoryList.vue') },
   { path: '/stock-reservations', component: () => import('../views/StockReservationList.vue') },
  { path: '/users',      component: () => import('../views/UserList.vue') },
  {
  path: '/order-items',
  name: 'OrderItems',
  component: () => import('../views/OrderItemList.vue')
}

]

export default createRouter({
  history: createWebHistory(),
  routes,
})
