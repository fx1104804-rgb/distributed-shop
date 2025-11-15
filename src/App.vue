<template>
  <el-container style="height:100vh;">
    <!-- 左侧导航栏 -->
    <el-aside width="230px" class="sidebar">
      <div class="logo">

        <span>分布式电商后台</span>
      </div>

<el-menu
  :default-active="$route.path"
  router
  background-color="#fff"
  text-color="#333"
  active-text-color="#409EFF"
  class="menu"
>
  <el-menu-item index="/dashboard">
    <el-icon><DataAnalysis /></el-icon>
    <span>仪表盘</span>
  </el-menu-item>

  <el-menu-item index="/products">
    <el-icon><Goods /></el-icon>
    <span>商品管理</span>
  </el-menu-item>

  <el-menu-item index="/orders">
    <el-icon><ShoppingCart /></el-icon>
    <span>订单管理</span>
  </el-menu-item>

  <el-menu-item index="/order-items">
    <el-icon><List /></el-icon>
    <span>订单项管理</span>
  </el-menu-item>

  <el-menu-item index="/inventory">
    <el-icon><TakeawayBox /></el-icon>
    <span>库存管理</span>
  </el-menu-item>

  <el-menu-item index="/stock-reservations">
    <el-icon><Lock /></el-icon>
    <span>库存预留管理</span>
  </el-menu-item>


  <el-menu-item index="/users">
    <el-icon><User /></el-icon>
    <span>用户管理</span>
  </el-menu-item>


  <!-- <el-menu-item index="/reports">
    <el-icon><TrendCharts /></el-icon>
    <span>数据统计</span>
  </el-menu-item> -->
</el-menu>

    </el-aside>

    <!-- 右侧主内容 -->
    <el-container>
      <el-header class="header-bar">
        <div class="header-title">分布式电商平台后台管理系统</div>
        <!-- <div class="header-user">管理员</div> -->
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
/* ==== Sidebar 样式 ==== */
.sidebar {
  background: #fff;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  height: 64px;
  border-bottom: 1px solid #f0f0f0;
  padding-left: 20px;
}

.logo img {
  width: 28px;
  height: 28px;
  margin-right: 10px;
}

.logo span {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
}

/* ==== 菜单样式 ==== */
.menu {
  border-right: none;
  padding-top: 10px;
  flex: 1;
  background: #fff;
}

.el-menu-item {
  border-radius: 8px;
  margin: 4px 12px;
  transition: all 0.2s;
}

.el-menu-item:hover {
  background-color: #ecf5ff;
}

.el-menu-item.is-active {
  background-color: #409EFF;
  color: white;
}

.el-menu-item.is-active .el-icon {
  color: white;
}

/* ==== 顶部栏 ==== */
.header-bar {
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-user {
  font-size: 14px;
  color: #666;
}

/* ==== 主体区域 ==== */
.main-content {
  background-color: #f5f7fa;
  padding: 20px;
  min-height: calc(100vh - 64px);
}
</style>
