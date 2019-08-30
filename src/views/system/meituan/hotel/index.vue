<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','HOTEL_ALL','HOTEL_CREATE']"
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
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="poiid" label="酒店ID"/>
      <el-table-column prop="realpoiid" label="酒店真实ID"/>
      <el-table-column prop="name" label="酒店名称"/>
      <el-table-column prop="lat" label="经度"/>
      <el-table-column prop="lng" label="纬度"/>
      <el-table-column prop="poirecommendtag" label="标签"/>
      <el-table-column prop="scoreintro" label="星级"/>
      <el-table-column prop="commentscountdesc" label="评论数量"/>
      <el-table-column v-if="checkPermission(['ADMIN','HOTEL_ALL','HOTEL_EDIT','HOTEL_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','HOTEL_ALL','HOTEL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','HOTEL_ALL','HOTEL_DELETE']"
            :ref="scope.row.poiid"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.poiid].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.poiid)">确定</el-button>
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
import { del } from '@/api/Hotel'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'poiid', display_name: '酒店ID' },
        { key: 'realpoiid', display_name: '酒店真实ID' },
        { key: 'name', display_name: '酒店名称' },
        { key: 'lat', display_name: '经度' },
        { key: 'lng', display_name: '纬度' },
        { key: 'scoreintro', display_name: '星级' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/Hotel'
      const sort = 'poiid,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(poiid) {
      this.delLoading = true
      del(poiid).then(res => {
        this.delLoading = false
        this.$refs[poiid].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[poiid].doClose()
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
        poiid: data.poiid,
        realpoiid: data.realpoiid,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        poirecommendtag: data.poirecommendtag,
        scoreintro: data.scoreintro,
        commentscountdesc: data.commentscountdesc
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
