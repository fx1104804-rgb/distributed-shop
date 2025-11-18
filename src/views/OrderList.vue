<template>
  <el-card>

    <!-- 搜索栏 -->
    <div style="margin-bottom:15px; display:flex; gap:10px;">
      <el-input v-model="searchForm.id" placeholder="订单ID" style="width:150px" />
      <el-input v-model="searchForm.userId" placeholder="用户ID" style="width:150px" />
      <el-select v-model="searchForm.status" placeholder="状态" clearable style="width:150px">
        <el-option label="待支付" value="Pending" />
        <el-option label="已支付" value="Paid" />
        <el-option label="已取消" value="Cancelled" />
        <el-option label="已完成" value="Completed" />
      </el-select>

      <el-button type="primary" @click="onSearch">搜索</el-button>
      <el-button @click="onReset">重置</el-button>

      <el-button type="success" @click="onCreate">新增订单</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="filteredOrders" border>
      <el-table-column prop="id" label="订单ID" width="100" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="totalAmount" label="总金额" width="120" />

      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="statusTag(scope.row.status)">
            {{ transStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="paymentDeadline" label="支付截止" width="180" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column prop="updatedAt" label="更新时间" width="180" />

      <el-table-column label="操作" width="350">
        <template #default="scope">
          <el-button size="small" @click="onView(scope.row.id)">查看</el-button>
          <el-button size="small" type="warning" @click="onEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="onDelete(scope.row.id)">
            删除
          </el-button>

          <el-button
            size="small"
            type="success"
            v-if="scope.row.status === 'Pending'"
            @click="pay(scope.row.id)"
          >支付</el-button>

          <el-button
            size="small"
            type="info"
            v-if="scope.row.status === 'Pending'"
            @click="cancel(scope.row.id)"
          >取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑订单弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="dialogTitle">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户ID">
          <el-input v-model="editForm.userId" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="editForm.totalAmount" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="待支付" value="Pending" />
            <el-option label="已支付" value="Paid" />
            <el-option label="已取消" value="Cancelled" />
            <el-option label="已完成" value="Completed" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-dialog>

  </el-card>
</template>

<script setup>
import { useRouter } from "vue-router"
const router = useRouter()
import { ref, computed, onMounted } from "vue"
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  payOrder,
  cancelOrder
} from "../api"
import { ElMessage } from "element-plus"

const orders = ref([])

const searchForm = ref({
  id: "",
  userId: "",
  status: ""
})

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    return (
      (!searchForm.value.id || o.id == searchForm.value.id) &&
      (!searchForm.value.userId || o.userId == searchForm.value.userId) &&
      (!searchForm.value.status || o.status == searchForm.value.status)
    )
  })
})

onMounted(async () => {
  const res = await fetchOrders()
  orders.value = res.data.slice(0, 100)

})

const onSearch = () => {}
const onReset = () => (searchForm.value = { id: "", userId: "", status: "" })

// 状态颜色
const statusTag = (s) =>
  ({ Pending: "warning", Paid: "success", Cancelled: "info", Completed: "" }[s])

const transStatus = (s) =>
  ({ Pending: "待支付", Paid: "已支付", Cancelled: "已取消", Completed: "已完成" }[s])


// 查看订单 → 跳到订单项页面
const onView = (id) => {
  router.push({
    path: '/order-items',
    query: { orderId: id }
  })
}


// ===== 编辑弹窗 =====
const editDialogVisible = ref(false)
const editForm = ref({})
const isEdit = ref(false)

const onCreate = () => {
  isEdit.value = false
  editForm.value = {
    userId: "",
    totalAmount: "",
    status: "Pending"
  }
  editDialogVisible.value = true
}

const onEdit = (row) => {
  isEdit.value = true
  editForm.value = { ...row }
  editDialogVisible.value = true
}

const onSave = async () => {
  if (isEdit.value) {
    await updateOrder(editForm.value.id, editForm.value)
    ElMessage.success("更新成功")
  } else {
    await createOrder(editForm.value)
    ElMessage.success("创建成功")
  }

  const res = await fetchOrders()
  orders.value = res.data.slice(0, 100)

  editDialogVisible.value = false
}

// 删除

const onDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      "确认删除该订单吗？删除后无法恢复！",
      "提示",
      {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning"
      }
    )

    await deleteOrder(id)
    ElMessage.success("删除成功")

    const res = await fetchOrders()
    orders.value = res.data.slice(0, 100)

  } catch (err) {
    // 点击取消会触发
    ElMessage.info("已取消删除")
  }
}


// 支付
const pay = async (id) => {
  await payOrder(id)
  ElMessage.success("支付成功")
  const res = await fetchOrders()
  orders.value = res.data.slice(0, 100)
}

// 取消
const cancel = async (id) => {
  await cancelOrder(id)
  ElMessage.success("订单已取消")
  const res = await fetchOrders()
  orders.value = res.data.slice(0, 100)
}
</script>
