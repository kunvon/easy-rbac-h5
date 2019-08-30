<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="酒店真实ID" >
        <el-input v-model="form.realpoiid" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="酒店名称" >
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="经度" >
        <el-input v-model="form.lat" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="纬度" >
        <el-input v-model="form.lng" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="标签" >
        <el-input v-model="form.poirecommendtag" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="星级" >
        <el-input v-model="form.scoreintro" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="评论数量" >
        <el-input v-model="form.commentscountdesc" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/Hotel'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        poiid: '',
        realpoiid: '',
        name: '',
        lat: '',
        lng: '',
        poirecommendtag: '',
        scoreintro: '',
        commentscountdesc: ''
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        poiid: '',
        realpoiid: '',
        name: '',
        lat: '',
        lng: '',
        poirecommendtag: '',
        scoreintro: '',
        commentscountdesc: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
