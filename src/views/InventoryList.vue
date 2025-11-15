<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <div style="margin-bottom: 15px; display: flex; gap: 10px;">
        <el-input v-model="searchId" placeholder="按商品ID搜索" clearable style="width: 200px" />
        <el-button type="primary" @click="loadData">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="success" @click="openAdd">新增库存</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="filteredData" border style="width: 100%;">
        <el-table-column prop="productId" label="商品ID" width="120" />
        <el-table-column prop="availableStock" label="库存数量" width="140" />
        <el-table-column label="更新时间">
          <template #default="{ row }">
            {{ formatTime(row.updatedAt) }}
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

    <!-- 新增 / 编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="商品ID">
          <el-input v-model="form.productId" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input v-model="form.availableStock" />
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
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, computed } from 'vue'
import {
  fetchInventoryList,
  createInventory,
  updateInventory,
  deleteInventory
} from '../api/inventory'

const inventory = ref([])

const searchId = ref("")
const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref("")
const form = ref({
  productId: "",
  availableStock: ""
})

// 加载全部库存
const loadData = async () => {
  const res = await fetchInventoryList()
  inventory.value = res.data

  // 搜索过滤
  if (searchId.value) {
    inventory.value = inventory.value.filter(i => String(i.productId).includes(searchId.value))
  }
}

// 重置搜索
const resetSearch = () => {
  searchId.value = ""
  loadData()
}

const filteredData = computed(() => inventory.value)

// 新增
const openAdd = () => {
  dialogTitle.value = "新增库存"
  isEdit.value = false
  form.value = { productId: "", availableStock: "" }
  dialogVisible.value = true
}

// 编辑
const openEdit = (row) => {
  dialogTitle.value = "编辑库存"
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 保存
const submitForm = async () => {
  if (isEdit.value) {
    await updateInventory(form.value.productId, {
      availableStock: Number(form.value.availableStock)
    })
  } else {
    await createInventory({
      productId: Number(form.value.productId),
      availableStock: Number(form.value.availableStock)
    })
  }

  dialogVisible.value = false
  loadData()
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定删除商品 ${row.productId} 的库存记录吗？`,
    '警告',
    { type: 'warning' }
  ).then(async () => {
    await deleteInventory(row.productId)
    loadData()
  })
}

// 时间格式化
const formatTime = (t) => t ? t.replace("T", " ") : "—"

// 初始化
loadData()
</script>
