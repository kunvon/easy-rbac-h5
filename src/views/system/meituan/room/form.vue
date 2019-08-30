<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="酒店ID" >
        <el-input v-model="form.hotelid" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="抓取时间" >
        <el-input v-model="form.clawtime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="价格时间" >
        <el-input v-model="form.pricedate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="房间名称" >
        <el-input v-model="form.roomname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="价格" >
        <el-input v-model="form.price" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="剩余房间数" >
        <el-input v-model="form.leftroom" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="标签" >
        <el-input v-model="form.description" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/PriceRecord'
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
        id: '',
        hotelid: '',
        clawtime: '',
        pricedate: '',
        roomname: '',
        price: '',
        leftroom: '',
        description: ''
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
        id: '',
        hotelid: '',
        clawtime: '',
        pricedate: '',
        roomname: '',
        price: '',
        leftroom: '',
        description: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
