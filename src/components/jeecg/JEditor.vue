<template>
  <div>
    <editor v-model="body" :init="init" :disabled="disabled" @onClick="onClick"></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'

export default {
  name: 'JEditor',
  components: {
    Editor
  },
  props: {
    value: {
      default: '',
      type: String
    },
    config: {
      type: Object,
      default: () => {
        return {
          theme: 'modern',
          height: 600
        }
      }
    },
    url: {
      default: '',
      type: String
    },
    accept: {
      default: 'image/jpeg, image/png, image/gif, image/svg',
      type: String
    },
    maxSize: {
      default: 1024 * 1024 * 5, // 5M.
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: [String, Array],
      default: `fontselect | formatselect | fontsizeselect forecolor backcolor | bold italic underline strikethrough | insertfile link image | table | alignleft aligncenter alignright alignjustify | removeformat | undo redo` // 需要的工具栏
    },
    plugins: {
      type: [String, Array],
      default: `
        paste
        importcss
        image
        code
        table
        advlist
        fullscreen
        link
        lists
        textcolor
        colorpicker
        hr
        preview
        wordcount
      `
    }
  },
  data() {
    return {
      body: this.value,
      init: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/lightgray',
        height: 300,
        toolbar: this.toolbar,
        plugins: this.plugins,
        branding: false,
        menubar: false,
        images_upload_handler: (blobInfo, success) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        }
      },
      visible: true
    }
  },
  methods: {
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    clear() {
      this.body = ''
    }
  },
  mounted() {
    tinymce.init({})
  },
  watch: {
    body(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style scoped>
</style>
