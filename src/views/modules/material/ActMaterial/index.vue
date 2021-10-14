<template>
  <div class="media-list">
    <table-wrapper :filterable="false" :excel="false">
       <!-- 标签列表表头 -->
      <div slot="title">素材列表</div>
      <template slot="operates">
        <el-select size="small" v-model="searchType" @change="handleSearch(1)">
          <el-option v-for="item in mediaTypes" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-input size="small" placeholder="输入素材名称查询" v-model="searchText" clearable style="width:200px;" />
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch(1)">查询</el-button>
        <el-button v-if="$auth('activity:material:oss:add')" size="small" @click="handleCreate" icon="el-icon-plus">新增</el-button>
      </template>

      <section class="media-container">
        <el-card v-for="item in dataList" :key="item.id" class="media-item" :style="mediaItemStyle" :body-style="{ padding: '0px' }">
          <template v-if="item.type === 'ICON' || item.type === 'THUMB' || item.type === 'POSTER'">
            <div class="media-item-body" @click="handleMediaClick(item)">
              <el-image :src="item.url" fit="contain"></el-image>
            </div>
          </template>
          <template v-if="item.type === 'VIDEO'">
            <div class="media-item-body" @click="handleMediaClick(item)">
              <svg-icon icon-class="video"></svg-icon>
            </div>
          </template>
          <template v-if="item.type === 'VOICE'">
            <div class="media-item-body" @click="handleMediaClick(item)">
              <svg-icon icon-class="voice"></svg-icon>
            </div>
          </template>
          <div class="media-item-header">
            <el-dropdown>
              <span class="el-dropdown-link txt-primary txt-bold">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="copyOssUrl(item)">复制链接</el-dropdown-item>
                <el-dropdown-item @click.native="handleMediaClick(item)">预览</el-dropdown-item>
                <el-dropdown-item @click.native="handleUpdate(item)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="handleDelete(item)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="media-item-footer">
            <span class="meida-item-title" :title="item.srcName">{{item.srcName}}</span>
            <div>
              <span class="media-item-time">{{item.modTime}}</span>
              <!-- <el-button v-if="$auth('activity:material:oss:del')" size="mini" type="warning" @click="handleDelete(item)">删除</el-button> -->
            </div>
          </div>
        </el-card>
      </section>

      <!-- 分页 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page.sync="page.current"
          layout="total, prev, pager, next, jumper" :total="page.total" size="small">
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
        <el-form-item label="素材类型" prop="type">
          <el-select size="small" v-model="temp.type" @change="handleTypeChange">
            <el-option v-for="item in mediaTypes" :key="item.value" :value="item.value" :label="item.lable"
            :disabled="dialogStatus === 'update'"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="标题" prop="title" v-show="temp.type === 'video'">
          <el-input v-model="temp.title"></el-input>
        </el-form-item> -->
        <el-form-item label="素材文件" prop="file" v-if="dialogStatus === 'create'">
          <el-upload ref="fileUpload" :action="'/'" :show-file-list="true" :class="{hideUpload:uploadedFlag}"
              :on-remove="handleRemoveFile" :on-change="handleAddFile"
              :auto-upload="false" :accept="acceptFile[temp.type]['type']">
            <el-button size="small" type="primary">点击上传</el-button>
            <span style="font-size: .8em"> {{acceptFile[temp.type]['desc']}}</span>
          </el-upload>
          <div class="el-upload__tip" v-if="uploadTips">
            <span style="color: red; font-size:.9em;">{{uploadTips}}</span><br>
          </div>
          <div v-if="dialogStatus === 'update'">暂不支持素材回显，您可以点击<span class="span-link"
            @click="handleMediaClick({...temp, url: originMediaUrl})">此处</span>
            查看原素材哦
          </div>
        </el-form-item>
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="temp.srcName" placeholder="可为空"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input type="textarea" v-model="temp.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 素材查看 -->
    <el-dialog ref="previewDialog" :title="preview.srcName" :visible.sync="dialogPreviewVisible" width="700px" @close="handleReleaseMedia">
      <section style="text-align:center;">
        <template v-if="preview.type === 'ICON' || preview.type === 'THUMB' || preview.type === 'POSTER'">
          <img :src="preview.url" class="show_img_size"/>
        </template>
        <template v-if="preview.type === 'VOICE'">
          <audio :src="preview.url" controls="controls" class="media-element" style="width:100%">
            您的浏览器不支持音频播放！
          </audio>
        </template>
        <template v-if="preview.type === 'VIDEO'">
          <video :src="preview.url" controls="controls" class="media-element" style="width:100%">
            您的浏览器不支持视频播放！
          </video>
        </template>
      </section>
    </el-dialog>

  </div>
</template>

<script>
import * as ActMaterialApi from '@/api/material/ActMaterialApi.js'

import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'MpMaterial',
  components: { TableWrapper },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      searchType: 'POSTER',
      searchText: '',
      // ---数据
      mediaTypes: [
        { label: '图标-ICON', value: 'ICON' },
        { label: '缩略图-THUMB', value: 'THUMB' },
        { label: '海报-POSTER', value: 'POSTER' },
        { label: '语音-VOICE', value: 'VOICE' },
        { label: '视频-VIDEO', value: 'VIDEO' }
      ],
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      temp: {
        type: 'POSTER',
        srcName: '',
        file: null,
        orderTag: 1,
        remarks: ''
      },
      acceptFile: {
        '': {},
        ICON: {
          type: '.jpg,.png',
          desc: '256KB，支持jpg/png格式',
          size: 256 * 1024
        },
        THUMB: {
          type: '.jpg,.png',
          desc: '1M，支持jpg/png格式',
          size: 1 * 1024 * 1024
        },
        POSTER: {
          type: '.png,.jpeg,.jpg,.gif',
          desc: '5M，支持bmp/png/jpeg/jpg/gif格式',
          size: 5 * 1024 * 1024
        },
        VOICE: {
          type: '.amr,.mp3',
          desc: '5M，播放长度不超过60s，mp3/wma/wav/amr格式',
          size: 5 * 1024 * 1024,
          duration: '60'
        },
        VIDEO: {
          type: '.mp4',
          desc: '10MB，支持MP4格式',
          size: 10 * 1024 * 1024
        }
      },
      uploadTips: '',
      uploadedFlag: false,
      dialogStatus: 'create',
      // ---查看素材
      dialogPreviewVisible: false,
      preview: {
        type: 'image',
        url: '',
        srcName: ''
      },
      // ---样式
      mediaItemStyle: {},
      // ---------- 新增素材
      // 防止重复上传
      canSubmit: true,
      // 原图片链接
      originMediaUrl: ''
    }
  },
  created () {
    this.handleSearch()
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
      this.doSearch()
    },
    doSearch () {
      let options = Object.assign({ type: this.searchType, srcName: this.searchText }, this.page)
      ActMaterialApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    handleCreate () {
      this.resetTemp()
      this.canSubmit = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // 延时100ms，防止控制台报错fileUpload为undefined
      setTimeout(() => {
        this.$refs['fileUpload'].clearFiles()
        this.uploadedFlag = false
      }, 100)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.temp.file) {
            this.$message.error('请先上传文件')
            return
          }
          if (this.canSubmit) {
            this.canSubmit = false
            // console.log('更新的数据', this.temp, tip)
            ActMaterialApi.save(this.temp).then(res => {
              // 刷新查询当前添加的种类素材
              this.searchType = this.temp.type
              this.searchText = this.temp.srcName
              this.handleSearch()
              this.dialogFormVisible = false
              this.$message({
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.canSubmit = true
            })
          }
        }
      })
    },
    // 更新
    handleUpdate (item) {
      this.resetTemp()
      this.$objects.copyProperties(item, this.temp)
      this.originMediaUrl = item.url
      this.temp.file = null
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 修改保存
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            type: this.temp.type,
            srcName: this.temp.srcName,
            remarks: this.temp.remarks
          }
          ActMaterialApi.update(tempData).then(res => {
            this.doSearch()
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.canSubmit = true
          })
        }
      })
    },
    handleDelete (media) {
      this.$confirm('确认删除？可能会导致使用此素材的对象不可用。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActMaterialApi.del(media.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        type: 'POSTER',
        srcName: '',
        file: null,
        orderTag: 1,
        remarks: ''
      }
    },
    // ---------预览
    handleMediaClick (item) {
      console.log('data', item)
      // 图文预览
      if (item.type === 'news') {
        this.$message.warning('暂不支持图文预览！')
        return
      }
      this.preview = {
        type: item.type,
        url: item.url || '',
        srcName: item.srcName || ''
      }
      let previewDialogEl = this.$refs['previewDialog'].$el
      let meidaEl = previewDialogEl.getElementsByClassName('media-element')[0]
      if (meidaEl) {
        meidaEl.load()
      }
      this.dialogPreviewVisible = true
    },
    handleReleaseMedia () {
      let previewDialogEl = this.$refs['previewDialog'].$el
      let meidaEl = previewDialogEl.getElementsByClassName('media-element')[0]
      if (meidaEl) {
        meidaEl.pause()
      }
    },
    // ---------
    handleTypeChange (val) {
      this.resetTemp()
      this.temp.type = val
      this.uploadTips = ''
      // 切换状态后，去除文件上传框中残存的上一次文件
      this.uploadedFlag = false
      this.$refs['fileUpload'].clearFiles()
    },
    handleAddFile (file, fileList) {
      this.uploadedFlag = true
      this.uploadTips = ''
      this.temp.file = null

      // 1. 校验文件大小，和音频长度
      if (file.size > this.acceptFile[this.temp.type].size) {
        this.uploadedFlag = false
        this.$refs.fileUpload.clearFiles()
        this.uploadTips = '文件太大，请重新上传'
      } else {
        // 语音类型，检查时长
        if (this.temp.type === 'voice') {
          let url = URL.createObjectURL(file.raw)
          var audioElement = new Audio(url)
          audioElement.addEventListener('loadedmetadata', function (_event) {
            let duration = audioElement.duration
            if (duration > this.acceptFile[this.temp.type].duration) {
              this.uploadTips = `音频文件时长为${duration}，超过限制，请重新上传`
            } else {
              this.uploadTips = ''
              this.temp.file = file.raw
              // this.temp.srcName = file.name
            }
          })
          URL.revokeObjectURL(file.raw)
        } else {
          this.uploadTips = ''
          this.temp.file = file.raw
          // this.temp.srcName = file.name
        }
      }
    },
    handleRemoveFile (file, fileList) {
      this.uploadedFlag = false
      this.temp.file = null
    },
    copyOssUrl (item) {
      this.$copyText(item.url).then(() => {
        this.$message.success('复制成功！')
      }, () => {
        this.$message.fail('复制失败！')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$card_width: 170px;
$card_height: 242px;

.media-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px 16px;
  .media-item {
    margin: 10px;
    width: $card_width;
    height: $card_height;
    .media-item-body {
      display: block;
      width: $card_width;
      height: $card_width;
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        cursor: pointer;
      }
      > svg {
        margin: 25%;
        width: 50%;
        height: 50%;
        cursor: pointer;
      }
    }
    .media-item-header {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #67C23A;
      cursor: pointer;
    }
    .media-item-footer {
      padding: 1rem 1rem 0;
      width: 100%;
      height: $card_height - $card_width;
      .meida-item-title{
        overflow: hidden;
        width: 100%;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .media-item-time {
        font-size: 13px;
        color: #999;
      }
      button {
        float: right;
      }
    }
  }
}
.show_img_size{
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.update-img {
  width: 200px;
  height: 200px;
}
</style>
<style lang="scss">
.hideUpload .el-upload {
  display: none;
}
.media-list .media-container .el-card__body {
  position: relative;
}
.span-link {
  text-decoration: underline;
  color: red
}
</style>
