<template>
  <div>
    <!-- <div class="page-title">📊 仪表盘概览</div> -->

    <!-- 顶部关键统计 -->
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card><div>今日订单：{{ kpi.todayOrders }}</div></el-card>
      </el-col>
      <el-col :span="6">
        <el-card><div>今日销售额：¥{{ kpi.todayAmount }}</div></el-card>
      </el-col>
      <el-col :span="6">
        <el-card><div>累计订单：{{ kpi.totalOrders }}</div></el-card>
      </el-col>
      <el-col :span="6">
        <el-card><div>累计销售额：¥{{ kpi.totalAmount }}</div></el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="16" style="margin-top: 20px;">
      
      <!-- 7日订单趋势 -->
      <el-col :span="12">
        <el-card>
          <template #header>📈 7日订单趋势</template>
          <div ref="orderChart" style="height: 300px;"></div>
        </el-card>
      </el-col>

      <!-- 7日销售趋势 -->
      <el-col :span="12">
        <el-card>
          <template #header>💸 7日销售额趋势</template>
          <div ref="amountChart" style="height: 300px;"></div>
        </el-card>
      </el-col>

    </el-row>

    <!-- 商品销量 Top5 -->
    <el-row :gutter="16" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>🏆 商品销量 Top 5</template>
          <div ref="topChart" style="height: 320px;"></div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { fetchOrders, fetchOrderItemsAll } from '../api'


// KPI 数据
const kpi = ref({
  todayOrders: 0,
  todayAmount: 0,
  totalOrders: 0,
  totalAmount: 0
})

const orderChart = ref(null)
const amountChart = ref(null)
const topChart = ref(null)

onMounted(async () => {
  const ordersRes = await fetchOrders()
  const orders = ordersRes.data

  const itemsRes = await fetchOrderItemsAll()
  const items = itemsRes.data




  // 设置 KPI
  calculateKPI(orders)

  // 图表数据
  renderOrderTrend(orders)
  renderAmountTrend(orders)
  renderTopProducts(items)
})

// ---------------------------------------
// KPI：今日订单、累计订单
// ---------------------------------------
function calculateKPI(orders) {
  const today = new Date().toISOString().slice(0, 10)

  kpi.value.totalOrders = orders.length
  kpi.value.totalAmount = orders.reduce((s, o) => s + Number(o.amount || 0), 0)

  const todayOrders = orders.filter(o => (o.created_at || "").startsWith(today))
  kpi.value.todayOrders = todayOrders.length
  kpi.value.todayAmount =
    todayOrders.reduce((s, o) => s + Number(o.amount || 0), 0)
}

// ---------------------------------------
// 图表：7 日订单趋势
// ---------------------------------------
function renderOrderTrend(orders) {
  const days = getLast7Days()

  const data = days.map(d =>
    orders.filter(o => (o.created_at || "").startsWith(d)).length
  )

  const chart = echarts.init(orderChart.value)
  chart.setOption({
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [{ data, type: 'line', smooth: true }]
  })
}

// ---------------------------------------
// 图表：7 日销售额趋势
// ---------------------------------------
function renderAmountTrend(orders) {
  const days = getLast7Days()

  const data = days.map(d =>
    orders
      .filter(o => (o.created_at || "").startsWith(d))
      .reduce((s, o) => s + Number(o.amount || 0), 0)
  )

  const chart = echarts.init(amountChart.value)
  chart.setOption({
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [{ data, type: 'bar' }]
  })
}

// ---------------------------------------
// 图表：商品销量Top5
// ---------------------------------------
function renderTopProducts(items) {
  const productSales = {}

  items.forEach(i => {
    productSales[i.product_id] = (productSales[i.product_id] || 0) + i.quantity
  })

  const sorted = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const labels = sorted.map(s => "商品ID " + s[0])
  const values = sorted.map(s => s[1])

  const chart = echarts.init(topChart.value)
  chart.setOption({
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: values }]
  })
}

// 工具：生成最近 7 天日期
function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}
</style>
