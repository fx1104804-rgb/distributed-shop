<template>
  <div>
    <!-- <div class="page-title">🧾 商品管理</div> -->

    <el-card class="table-card">

      <!-- 搜索区域 -->
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <el-input 
          v-model="keyword" 
          placeholder="搜索商品（名称/ID）"
          clearable
          style="width:240px;"
        />

        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button  @click="resetSearch">重置</el-button>

        <el-button type="success" @click="openCreate">新增商品</el-button>
        
      </div>

      <!-- 表格 -->
      <el-table :data="filtered" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="单价" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="created_at" label="创建时间" width="160" />

        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary"
              @click="openEdit(row)"
            >编辑</el-button>

            <el-button 
              size="small" 
              type="danger"
              @click="confirmDelete(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 编辑商品弹窗 -->
    <el-dialog v-model="editVisible" title="编辑商品" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editForm.price" type="number"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="editVisible=false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>


    <!-- 新增商品弹窗 -->
    <el-dialog v-model="createVisible" title="新增商品" width="500px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="createForm.price" type="number"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="createForm.description" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">新增</el-button>
      </template>
    </el-dialog>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  fetchProducts, 
  updateProduct, 
  deleteProduct,
  createProduct
} from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'


/***********************
 * 数据加载
 ***********************/
const list = ref([])
const keyword = ref('')
const searchKey = ref('')  // 搜索实际使用的关键词

const load = async () => {
  const res = await fetchProducts()
  list.value = res.data
}

onMounted(load)


/***********************
 * 搜索逻辑
 ***********************/
const handleSearch = () => {
  searchKey.value = keyword.value
}

const resetSearch = () => {
  keyword.value = ''
  searchKey.value = ''
  load()
}

const filtered = computed(() => {
  if (!searchKey.value) return list.value
  const k = searchKey.value.toLowerCase()

  return list.value.filter(x =>
    x.name.toLowerCase().includes(k) ||
    String(x.id).includes(k)
  )
})


/***********************
 * 编辑商品
 ***********************/
const editVisible = ref(false)
const editForm = ref({})

const openEdit = (row) => {
  editForm.value = { ...row }
  editVisible.value = true
}

const submitEdit = async () => {
  await updateProduct(editForm.value.id, editForm.value)
  ElMessage.success("修改成功")
  editVisible.value = false
  load()
}


/***********************
 * 删除商品（带确认提示）
 ***********************/
const confirmDelete = (id) => {
  ElMessageBox.confirm(
    '确认删除该商品吗？删除后不可恢复！',
    '提示',
    {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    }
  )
    .then(async () => {
      await deleteProduct(id)
      ElMessage.success('删除成功')
      load()
    })
    .catch(() => {})
}


/***********************
 * 新增商品
 ***********************/
const createVisible = ref(false)
const createForm = ref({
  name: '',
  price: '',
  description: ''
})

const openCreate = () => {
  createForm.value = {
    name: '',
    price: '',
    description: ''
  }
  createVisible.value = true
}

const submitCreate = async () => {
  if (!createForm.value.name || !createForm.value.price) {
    ElMessage.warning("请填写完整信息")
    return
  }

  await createProduct(createForm.value)
  ElMessage.success("新增成功")
  createVisible.value = false
  load()
}
</script>


<style scoped>
.table-card {
  padding: 16px;
}
</style>
