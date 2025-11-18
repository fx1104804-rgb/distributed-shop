<template>
  <el-card>

    <!-- 搜索区域 -->
    <div style="margin-bottom: 15px; display:flex; gap:10px;">
      <el-input
        v-model="searchText"
        placeholder="搜索：用户ID 或 用户名"
        clearable
        style="width: 260px"
      />
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>

      <el-button type="success" @click="openCreate">新增用户</el-button>
    </div>


    <!-- 用户表格 -->
    <el-table :data="list" border>
      <el-table-column prop="id" label="用户ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="注册时间" width="180">
        <template #default="scope">
          {{ formatTime(scope.row.created_at) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" text @click="openEdit(scope.row)">编辑</el-button>
          <el-button type="danger" text @click="confirmDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>

  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../api'

// 列表数据
const list = ref([])
let fullList = [] // 原始数据，用于搜索恢复

// 搜索文本（用户名）
const searchText = ref('')

async function load() {
  const res = await fetchUsers()
  fullList = res.data.slice(0, 100)
  list.value = res.data
}

// 搜索（根据用户名）
function search() {
  if (!searchText.value) {
    list.value = fullList
    return
  }

  const key = searchText.value.toLowerCase()

  list.value = fullList.filter(u =>
    u.username.toLowerCase().includes(key)
  )
}

// 重置
function resetSearch() {
  searchText.value = ''
  list.value = fullList
}

// 时间格式化
function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString()
}

// -------------- 对话框与保存 ---------------
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

const form = reactive({
  id: null,
  username: ''
})

function openCreate() {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  Object.assign(form, { id: null, username: '' })
  dialogVisible.value = true
}

async function openEdit(row) {
  isEdit.value = true
  dialogTitle.value = '编辑用户'

  const res = await fetchUserById(row.id)
  Object.assign(form, res.data)

  dialogVisible.value = true
}

async function save() {
  if (isEdit.value) {
    await updateUser(form.id, { username: form.username })
    ElMessage.success('修改成功')
  } else {
    await createUser({ username: form.username })
    ElMessage.success('创建成功')
  }

  dialogVisible.value = false
  load()
}

// 删除前确认
function confirmDelete(row) {
  ElMessageBox.confirm(
    `确定要删除用户「${row.username}」吗？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      load()
    })
    .catch(() => {})
}

onMounted(load)
</script>
