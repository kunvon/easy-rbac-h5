<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.hotelName" clearable placeholder="酒店名称" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-input v-model="query.roomName" clearable placeholder="房间名称" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-input v-model="query.pricedate" clearable placeholder="价格时间" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <!-- <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select> -->
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PRICERECORD_ALL','PRICERECORD_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data"  style="width: 100%;" ref="filterTable" border size="small">
      <el-table-column prop="id" label="自增主键"/>
      <el-table-column prop="hotel.name" label="酒店" sortable/>
      <el-table-column prop="clawtime" label="抓取时间" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.clawtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pricedate" label="价格时间" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.pricedate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roomname" label="房间名称"/>
      <el-table-column prop="price" label="价格" sortable/>
      <el-table-column prop="leftroom" label="剩余房间数" sortable/>
      <el-table-column prop="description" label="标签"/>
      <el-table-column v-if="checkPermission(['ADMIN','PRICERECORD_ALL','PRICERECORD_EDIT','PRICERECORD_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','PRICERECORD_ALL','PRICERECORD_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','PRICERECORD_ALL','PRICERECORD_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      :current-page="page + 1"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/PriceRecord'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false
      // queryTypeOptions: [
      //   { key: 'hotelid', display_name: '酒店ID' },
      //   { key: 'roomname', display_name: '房间名称' }
      // ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/PriceRecord'
      const sort = 'pricedate,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      // const type = query.type
      // const value = query.value
      // if (type && value) { this.params[type] = value }
      if (query.hotelName) { this.params.hotelName = query.hotelName }
      if (query.roomName) { this.params.roomName = query.roomName }
      if (query.pricedate) { this.params.pricedate = query.pricedate }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        hotelid: data.hotelid,
        clawtime: data.clawtime,
        pricedate: data.pricedate,
        roomname: data.roomname,
        price: data.price,
        leftroom: data.leftroom,
        description: data.description
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
