<template>
  <v-navigation-drawer
    v-if="open"
    class="user-sidebar"
    v-click-outside="{
      handler: onClickOutside,
      include,
    }"
    width="260"
    temporary
    absolute
    right
    permanent
  >
    <v-container>
      <v-row>
        <v-col class="user-sidebar__close">
          <v-icon
            color="secondary"
            @click.native="$emit('close-user-navigation')"
          >
            $close
          </v-icon>
        </v-col>
      </v-row>
      <v-row class="relative">
        <v-col class="user-sidebar__avatar">
          <Avatar
            v-if="info"
            :initials="info.initials"
            :email="info.email"
            :size="100"
            color="secondary"
          />
        </v-col>
        <router-link
          class="user-sidebar__edit"
          :to="{ name: 'EditUser' }"
          @click.native="$emit('close-user-navigation')"
        >
          <v-icon
            color="secondary"
            dense
          >
            $edit
          </v-icon>
        </router-link>
      </v-row>
      <v-row class="mx-0">
        <v-col class="user-sidebar__name secondary--text">
          <Tooltip
            :text="info.name"
            :activator-width-limit="activatorWidthLimit"
            :disable-tooltips="false"
            :bottom="true"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="user-sidebar__info">
          <UserInfoList
            v-if="info"
            :info="info"
            :disable-tooltips="true"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import UserInfoList from '@/components/Shared/UserInfoList.vue'
import Avatar from '@/components/Shared/Avatar.vue'
import Tooltip from '@/components/Shared/Tooltip.vue'

export default {
  components: {
    UserInfoList,
    Avatar,
    Tooltip,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      activatorWidthLimit: 236,
    }
  },
  computed: {
    ...mapGetters('account', ['info']),
  },
  methods: {
    include() {
      return [document.querySelector('.v-app-bar')]
    },
    onClickOutside() {
      this.$emit('close-user-navigation')
    },
  },
}
</script>

<style scoped lang="scss">
.user-sidebar {
  @apply z-30 fixed h-screen;
}

.user-sidebar__close {
  @apply flex flex-row justify-end;
}

.user-sidebar__avatar {
  @apply flex flex-row justify-center;
}

.user-sidebar__info {
  @apply px-8;
}

.user-sidebar__name {
  max-width: 236px;

  @apply block text-center font-bold truncate;
}

.user-sidebar__edit {
  @apply absolute bottom-2.5 right-2 cursor-pointer px-2 no-underline;
}
</style>
