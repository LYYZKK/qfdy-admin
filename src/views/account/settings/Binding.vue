<template>
  <a-list itemLayout="horizontal" :dataSource="data"></a-list>
</template>

<script>
import { List } from 'ant-design-vue'
export default {
  components: {
    AList: List
  },
  data() {
    return {
      data: []
    }
  },
  methods: {}
}
</script>

<style scoped>
</style>