<template>
  <p
    v-if="callDurationTimer && callDurationInSec"
    class="timer"
  >
    {{ callDurationInSec | formatTimer }}
  </p>
  <p
    class="timer"
    v-else
  >
    00:00:00
  </p>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('callDuration', ['callDurationTimer', 'callDurationInSec']),
  },
}
</script>

<style scoped lang="scss">
.timer {
  @apply text-sm text-black;
  @apply m-0 #{!important};
}
</style>
