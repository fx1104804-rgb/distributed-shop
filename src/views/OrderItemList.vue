<template>
  <el-card>

    <!-- 搜索栏 -->
    <div style="margin-bottom: 15px; display: flex; gap: 10px;">
      <el-input v-model="searchForm.orderId" placeholder="订单ID" style="width:160px" />
      <el-button type="primary" @click="onSearch">搜索</el-button>
      <el-button @click="onReset">重置</el-button>
      <el-button type="success" @click="onCreate">新增订单项</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="filteredItems" border>
      <el-table-column prop="id" label="订单项ID" width="120" />
      <el-table-column prop="orderId" label="订单ID" width="120" />
      <el-table-column prop="productId" label="商品ID" width="120" />
      <el-table-column prop="quantity" label="数量" width="120" />
      <el-table-column prop="unitPrice" label="单价" width="120" />

      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" type="warning" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="订单ID">
          <el-input v-model="editForm.orderId" />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input v-model="editForm.productId" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="editForm.quantity" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="editForm.unitPrice" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-dialog>

  </el-card>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

import { ref, onMounted, computed } from "vue"
import {
  fetchOrderItemsAll,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem
} from "../api"
import { ElMessage, ElMessageBox } from "element-plus"

const items = ref([])

const searchForm = ref({
  orderId: ""
})

// 过滤显示
const filteredItems = computed(() =>
  items.value.filter(i =>
    !searchForm.value.orderId || i.orderId == searchForm.value.orderId
  )
)


onMounted(async () => {
  const res = await fetchOrderItemsAll()
  // items.value = res.data
  items.value = res.data.slice(0, 100)


  // 如果从订单列表跳转而来，自动筛选订单项
  if (route.query.orderId) {
    searchForm.value.orderId = route.query.orderId
  }
})

const onSearch = () => {}
const onReset = () => (searchForm.value.orderId = "")

// ===== 弹窗相关 =====
const dialogVisible = ref(false)
const dialogTitle = ref("")
const editForm = ref({})
const isEdit = ref(false)

// 新增
const onCreate = () => {
  isEdit.value = false
  dialogTitle.value = "新增订单项"
  editForm.value = {
    orderId: "",
    productId: "",
    quantity: "",
    unitPrice: ""
  }
  dialogVisible.value = true
}

// 编辑
const onEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = "编辑订单项"
  editForm.value = { ...row }
  dialogVisible.value = true
}

// 保存
const onSave = async () => {
  if (isEdit.value) {
    await updateOrderItem(editForm.value.id, editForm.value)
    ElMessage.success("更新成功")
  } else {
    await createOrderItem(editForm.value)
    ElMessage.success("创建成功")
  }
  const res = await fetchOrderItemsAll()
  // items.value = res.data
  items.value = res.data.slice(0, 100)

  dialogVisible.value = false
}

// 删除
const onDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确认删除该订单项吗？", "提示", {
      confirmButtonText: "确认删除",
      cancelButtonText: "取消",
      type: "warning"
    })
    await deleteOrderItem(id)
    ElMessage.success("删除成功")

    const res = await fetchOrderItemsAll()
    items.value = res.data
  } catch (err) {
    ElMessage.info("已取消删除")
  }
}
</script>
