<template>
  <div
    class="flex-row"
  >
    <div
      v-for="r in keypad"
      :key="r.toString()"
      class="justify-center"
    >
      <v-btn
        class="keypad-btn"
        v-for="c in r"
        :key="c.toString()"
        depressed
        fab
        @click="click(c[0])"
      >
        <div
          class="flex-column"
        >
          <div
            class="keypad-btn__digit"
          >
            {{ c[0] }}
          </div>
          <div
            class="keypad-btn__letters"
          >
            {{ c[1] }}
          </div>
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Keypad',

  computed: {
    keypad() {
      return [
        [
          ['1', '\u00A0'],
          ['2', 'ABC'],
          ['3', 'DEF'],
        ],
        [
          ['4', 'GHI'],
          ['5', 'JKL'],
          ['6', 'MNO'],
        ],
        [
          ['7', 'PQRS'],
          ['8', 'TUV'],
          ['9', 'WXYZ'],
        ],
        [
          ['*', null],
          ['0', null],
          ['#', null],
        ],
      ]
    },
  },

  methods: {
    click(key) {
      this.$emit('keypad-click', key)
    },
  },
}
</script>

<style scoped lang="scss">
.keypad-btn {
  @apply rounded-xl my-2 mx-2;
}

.keypad-btn__digit {
  @apply text-lg;
}

.keypad-btn__letters {
  @apply uppercase text-xs text-light-grey;
}
</style>
