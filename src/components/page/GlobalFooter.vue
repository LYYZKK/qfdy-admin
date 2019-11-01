<template>
  <div>
    <div v-has="permissions.ctiBar" class="footer p-t-10 p-b-10 full-width center">
      <cti-bar class="cti-bar" />
    </div>
  </div>
</template>

<script>
import ctiBar from '@/components/cti/cti-bar'
export default {
  name: 'LayoutFooter',
  components: {
    ctiBar
  },
  data() {
    return {
      permissions: {
        ctiBar: 'cti-bar'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  z-index: 999;
  background: #fff !important;
  border-top: 1px solid #ccc !important;
  position: fixed;
  bottom: 0px;
  left: 0;
  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }

  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
