<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">问卷题库</div>
      <template slot="operates">
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:paper:question:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="orderTag" width="80" label="题号" sortable align="center"></el-table-column>
        <el-table-column prop="title" width="150" label="题目" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="answer" width="80" label="参考答案" align="center"></el-table-column>
        <el-table-column prop="type" width="80" label="类型" align="center" >
          <template slot-scope="scope">{{['', '单选', '多选', '简答'][scope.row.type]}}</template>
        </el-table-column>
        <el-table-column prop="status" width="80" label="状态" align="center" >
          <template slot-scope="scope">{{['停用', '启用'][scope.row.status]}}</template>
        </el-table-column>
        <el-table-column prop="remarks" width="250" label="备注" show-overflow-tooltip ></el-table-column>
        <el-table-column width="150" label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:paper:question:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:paper:question:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="5vh" width="768px">
      <el-form size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
        <el-row>
          <el-col :span="12">
             <el-form-item label="序号" prop="orderTag" :rules="[{required:true, message:'必须字段'}]">
              <el-input-number v-model="temp.orderTag" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status" :rules="[{required:true, message:'必须字段'}]">
              <el-select v-model="temp.status" placeholder="">
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="停用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
             <el-form-item label="题目" prop="title" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="问题类型" prop="type" :rules="[{required:true, message:'必须字段'}]">
              <el-select v-model="temp.type" placeholder="">
                <el-option :value="1" label="单选"></el-option>
                <el-option :value="2" label="多选"></el-option>
                <el-option :value="3" label="简答"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参考答案" prop="answer">
              <el-input v-model="temp.answer" placeholder="若多选，请按顺序填写，如：AC" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选项" prop="options" v-if="temp.type !== 3" :rules="[{required:true, message:'必须字段'}]">
              <el-button type="success" size="mini" icon="el-icon-circle-plus" @click="handleOptionAdd(temp.options)">添加一行</el-button>
              <el-table border stripe size="mini" :data="temp.options" height="230" style="width: 100%;">
                <el-table-column prop="value" label="序号" width="60" />
                <el-table-column prop="name" label="选项" width="200" show-overflow-tooltip />
                <el-table-column prop="free" label="自由回答" width="70" align="center">
                  <template slot-scope="scope">{{['否', '是'][scope.row.free]}}</template>
                </el-table-column>
                <el-table-column prop="more" label="更多" width="80" show-overflow-tooltip />
                <el-table-column label="操作" align="center" width="200" class-name="small-padding">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" circle title="编辑" @click="handleOptionEdit(temp.options, scope.row)"></el-button>
                    <el-button type="danger"  size="mini" icon="el-icon-delete" circle title="删除" @click="handleOptionDelete(temp.options, scope.row)"></el-button>
                    <el-button type="primary" size="mini" icon="el-icon-arrow-up" circle title="上移" @click="handleOptionMoveUp(temp.options, scope.row)"></el-button>
                    <el-button type="primary" size="mini" icon="el-icon-arrow-down" circle title="下移" @click="handleOptionMoveDown(temp.options, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="temp.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>

      <el-dialog title="编辑" :visible.sync="dialogInnerVisible" width="720px" :modal="false" :center="true" >
        <el-form ref="tempInnerForm" :model="tempInner" size="medium" label-position="left" label-width="100px" style="width:calc(100% - 70px); margin-left:20px; margin-right:50px;">
          <el-form-item label="选项序号" prop="value" :rules="[{type: 'string', required:true, pattern: /^[a-zA-Z]{1}$/, message: '请输入一位的英文字母'}]">
            <el-select v-model="tempInner.value" placeholder="" filterable allow-create>
              <el-option value="A" label="A"></el-option>
              <el-option value="B" label="B"></el-option>
              <el-option value="C" label="C"></el-option>
              <el-option value="D" label="D"></el-option>
              <el-option value="E" label="E"></el-option>
              <el-option value="F" label="F"></el-option>
              <el-option value="G" label="G"></el-option>
              <el-option value="H" label="H"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选项文字" prop="name" :rules="[{required:true, message:'必须字段'}]">
            <el-input v-model="tempInner.name" placeholder="" />
          </el-form-item>
          <el-form-item label="自由回答" prop="free">
            <el-switch v-model="tempInner.free" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="扩展配置" prop="more">
            <el-input type="textarea" v-model="tempInner.more" placeholder="填入自定义配置，通常是JSON，注意与前端沟通好使用方式" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogInnerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleOptionConfirm()">确定</el-button>
        </div>
      </el-dialog>

    </el-dialog>

  </div>
</template>

<script>
import * as ActPaperQuestionApi from '@/api/paper/ActPaperQuestionApi.js'
import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'ActPaperQuestion',
  components: { TableWrapper },
  props: {
    phaseId: {
      type: String
    }
  },
  data () {
    return {
      // ---查询条件
      paperId: '',
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        paperId: this.paperId,
        title: '',
        options: [],
        answer: '',
        type: 1,
        status: 1,
        orderTag: 1,
        remarks: ''
      },
      dialogInnerVisible: false,
      tempInner: {
        target: null,
        name: '',
        value: '',
        free: 0, // 自由回答
        more: ''
      },
      // 防止重复保存
      canSubmit: true
    }
  },
  created () {
    // 路由参数
    if (this.phaseId) {
      this.paperId = this.phaseId
      this.handleSearch()
    } else {
      this.$message.error('缺少路由参数：paperId')
    }
  },
  methods: {
    // ---查询列表
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    // 翻页
    handleCurrentChange (current) {
      this.page.current = current
      this.$table.scrollTopAfterPage(this.$refs.table)
      this.doSearch()
    },
    doSearch () {
      let options = Object.assign({ paperId: this.paperId }, this.page)
      ActPaperQuestionApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
        // this.dataList.forEach(item => {
        //   item.options = JSON.parse(item.options)
        // })
      })
    },
    // ---编辑
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.canSubmit = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // answer处理
    dealAnswer () {
      let flag = true
      let answer = this.temp.answer
      // 单选
      if (this.temp.type === 1) {
        let reg = /^[a-zA-Z]?$/
        if (!reg.test(answer)) {
          flag = false
        } else {
          this.temp.answer = answer.toLocaleUpperCase()
        }
      }
      // 多选
      if (this.temp.type === 2) {
        let reg = /^[a-zA-Z]*$/
        if (!reg.test(answer)) {
          flag = false
        } else {
          // 转为数组排序
          let tempArr = (answer.toLocaleUpperCase()).split('')
          tempArr.sort()
          this.temp.answer = tempArr.join(',')
        }
      }
      if (!flag) {
        this.$message.info('请输入正确的参考答案')
      }
      return flag
    },
    // 新增保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dealAnswer() && this.canSubmit) {
            this.canSubmit = false
            const tempData = Object.assign({}, this.temp, { options: JSON.stringify(this.temp.options) })
            ActPaperQuestionApi.save(tempData).then(res => {
              this.handleSearch()
              this.dialogFormVisible = false
              this.$emit('refreshIframe')
              this.$message.success('创建成功')
            })
          }
        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row, { options: JSON.parse(row.options) })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.canSubmit = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改保存
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dealAnswer() && this.canSubmit) {
            this.canSubmit = false
            const tempData = Object.assign({}, this.temp, { options: JSON.stringify(this.temp.options) })
            ActPaperQuestionApi.update(tempData).then(() => {
              this.handleSearch()
              this.dialogFormVisible = false
              this.$emit('refreshIframe')
              this.$message.success('更新成功')
            })
          }
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此问题?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActPaperQuestionApi.del(row.id).then(res => {
          this.$emit('refreshIframe')
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        paperId: this.paperId,
        title: '',
        options: [],
        answer: '',
        type: 1,
        status: 1,
        orderTag: 1,
        remarks: ''
      }
    },
    // -------
    // 添加一行
    handleOptionAdd (arr) {
      arr.push({ name: '', value: '', free: 0, more: '' })
    },
    handleOptionEdit (arr, row) {
      this.tempInner = {
        target: row,
        value: row.value,
        name: row.name,
        free: row.free,
        more: row.more
      }
      this.dialogInnerVisible = true
      this.$nextTick(() => {
        this.$refs['tempInnerForm'].clearValidate()
      })
    },
    handleOptionMoveUp (arr, row) {
      let idx = arr.indexOf(row)
      if (idx > 0) {
        this.$set(arr, idx, arr[idx - 1])
        this.$set(arr, idx - 1, row)
      }
    },
    handleOptionMoveDown (arr, row) {
      let idx = arr.indexOf(row)
      if (idx < arr.length - 1) {
        this.$set(arr, idx, arr[idx + 1])
        this.$set(arr, idx + 1, row)
      }
    },
    handleOptionDelete (arr, row) {
      let idx = arr.indexOf(row)
      arr.splice(idx, 1)
    },
    // 增加一个选项到选项表格中
    handleOptionConfirm () {
      this.$refs['tempInnerForm'].validate((valid) => {
        if (valid) {
          // value转大写
          this.tempInner.value = this.tempInner.value.toLocaleUpperCase()
          let target = this.tempInner.target
          let idx = this.temp.options.indexOf(target)
          target.value = this.tempInner.value
          target.name = this.tempInner.name
          target.free = this.tempInner.free
          target.more = this.tempInner.more
          this.$set(this.temp.options, idx, target)
          this.dialogInnerVisible = false
        }
      })
    },
    resetTempInner () {
      this.tempInner = {
        target: null,
        value: '',
        name: '',
        free: 0,
        more: ''
      }
    }
  }
}
</script>

<style lang="scss" scope>

</style>
