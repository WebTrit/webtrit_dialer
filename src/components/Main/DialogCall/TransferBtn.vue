<template>
  <ActionBtn
    icon="$transfer"
    :text="$t('modal.transfer')"
    @click.native="$emit('open-transfer-popup')"
  />
</template>

<script>
import ActionBtn from '@/components/Main/DialogCall/ActionBtn.vue'

export default {
  components: {
    ActionBtn,
  },
}
</script>
