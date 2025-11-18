<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <div style="margin-bottom: 15px; display: flex; gap: 10px;">
        <el-input v-model="searchId" placeholder="按预留ID搜索" clearable style="width: 200px" />
        <el-button type="primary" @click="loadData">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="success" @click="openAdd">新增预留记录</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="filteredData" border style="width: 100%;">
        <el-table-column prop="id" label="预留ID" width="100" />
        <el-table-column prop="orderId" label="订单ID" width="100" />
        <el-table-column prop="productId" label="商品ID" width="100" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="status" label="状态" width="120" />

        <el-table-column label="创建时间">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.updatedAt) }}
          </template>
        </el-table-column>


        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="450px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="订单ID">
          <el-input v-model="form.orderId" />
        </el-form-item>

        <el-form-item label="商品ID">
          <el-input v-model="form.productId" />
        </el-form-item>

        <el-form-item label="数量">
          <el-input v-model="form.quantity" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="RESERVED" value="RESERVED" />
            <el-option label="CANCELLED" value="CANCELLED" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  fetchStockReservations,
  createStockReservation,
  updateStockReservation,
  deleteStockReservation
} from '../api/stockReservation'

const list = ref([])
const searchId = ref("")
const dialogVisible = ref(false)
const dialogTitle = ref("")
const isEdit = ref(false)

const form = ref({
  orderId: "",
  productId: "",
  quantity: "",
  status: "RESERVED"
})

// 加载数据
const loadData = async () => {
  const res = await fetchStockReservations()
  list.value = res.data.slice(0, 100)

  if (searchId.value) {
    list.value = list.value.filter(item => String(item.id).includes(searchId.value))
  }
}

const resetSearch = () => {
  searchId.value = ""
  loadData()
}

const filteredData = computed(() => list.value)

// 新增
const openAdd = () => {
  dialogTitle.value = "新增库存预留记录"
  isEdit.value = false
  form.value = {
    orderId: "",
    productId: "",
    quantity: "",
    status: "RESERVED"
  }
  dialogVisible.value = true
}

// 编辑
const openEdit = (row) => {
  dialogTitle.value = "编辑库存预留记录"
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 提交
const submitForm = async () => {
  if (isEdit.value) {
    await updateStockReservation(form.value.id, form.value)
  } else {
    await createStockReservation(form.value)
  }

  dialogVisible.value = false
  loadData()
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定删除预留记录 ID ${row.id} 吗？`,
    '警告',
    { type: 'warning' }
  ).then(async () => {
    await deleteStockReservation(row.id)
    loadData()
    ElMessage.success('删除成功')
  })
}

// 时间格式化
const formatTime = (t) => t ? t.replace("T", " ") : "—"

loadData()
</script>
