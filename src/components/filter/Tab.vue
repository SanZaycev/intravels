<template>
  <button class="w-tab" :class="color" @click="$emit('action')">
    <slot />
  </button>
</template>

<script>
export default {
  name: "Tab",
  emits: ['action'],
  props: {
    color: {
      type: String,
      required: false,
      default: "default"
    }
  },
}
</script>

<style scoped>

</style>
