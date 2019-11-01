import Vue from 'vue'

import isFunction from 'lodash.isfunction'

import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  data() {
    return {
      files: {},
      UPLOAD_CHANGE_HANDLER: ({ info, fieldName, callback, uploadLoading = 'uploadLoading' }) => {
        this.files = this.files || {}
        if (info.file.status === 'uploading') {
          this[uploadLoading] = true
          return
        }
        if (info.file.status === 'done') {
          this[uploadLoading] = false
          const response = info.file.response
          if (response.success) {
            if (fieldName) {
              this.model[fieldName] = response.message
              this.files[fieldName] = response.message
            }
            if (isFunction(callback)) callback({ info, files: this.files })
          } else {
            this.$message.warning(response.message)
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`上传失败！`)
        }
      },
      FILE_UPLOAD_HEADERS: {
        'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      // eslint-disable-next-line no-unused-vars
      BEFORE_UPLOAD: file => {
        return true
      },
      FILE_UPLOAD_URL: `${process.env.BASE_URL}/sys/common/upload`,
      FILE_UPLOAD_ACTION: () => {
        return this.FILE_UPLOAD_URL
      },
      FILE_REVIEW_BASE_URL: `${process.env.BASE_URL}/sys/common/view`,
      IMAGE_REVIEW_URL_RENDER: filePathSuffix => {
        return `${this.FILE_REVIEW_BASE_URL}/${filePathSuffix}`
      },
      FILE_DOWNLOAD_BASE_URL: `${process.env.BASE_URL}/sys/common/download`,
      FILE_DOWNLOAD_URL_RENDER: (filePathSuffix, originalFileName) => {
        let downloadUrl = `${this.FILE_DOWNLOAD_BASE_URL}?filePath=${filePathSuffix}`
        if (originalFileName) {
          downloadUrl += `&originalFileName=${originalFileName}`
        }
        return downloadUrl
      },
      // eslint-disable-next-line no-unused-vars
      BEFORE_FILE_UPLOAD_ACTION: file => {}
    }
  },
  methods: {
    getViewFileUrl(filePath) {
      return `${window._CONFIG['viewFileDomainURL']}?url=` + this.IMAGE_REVIEW_URL_RENDER(filePath)
    },
    /* 文件下载 */
    downloadFile(text) {
      if (!text) {
        this.$message.warning('未知的文件')
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      window.open(process.env.BASE_URL + this.FILE_DOWNLOAD_URL_RENDER(text))
    },
    getFileName(path) {
      if (path.lastIndexOf('\\') >= 0) {
        let reg = new RegExp('\\\\', 'g')
        path = path.replace(reg, '/')
      }
      return path.substring(path.lastIndexOf('/') + 1)
    }
  }
}
