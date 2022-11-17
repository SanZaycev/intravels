<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <div class="icon-wrap"><span :class="iconClass"></span></div>
      <div class="is-size-5 has-text-centered">{{ text }}</div>
    </div>
  </div>
</template>

<script>
import {views} from "../core/actions.js";

export default {
  name: "AppEmptyBox",
  beforeMount() {
  },
  props: {
    text: {
      type: String,
      required: false,
      default: "Сейчас тут пусто"
    },
  },
  computed: {
    viewAction() {
      return this.$store.state.location && this.$store.state.location.view ? this.$store.state.location.view : views.DEFAULT
    },
    iconClass() {
      switch (this.viewAction) {
        case views.DEFAULT: return 'icn__empty-default'
        default: return 'icn__empty-default'
      }
    }
  },
}
</script>
