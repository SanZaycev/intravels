<template>
  <button class="btn" :class="color" @click="$emit('action')">
    <slot />
  </button>
</template>

<script>
export default {
  name: "Btn",
  emits: ['action'],
  props: {
    color: {
      type: String,
      default: "",
      validator(val){
        ['', 'primary', 'danger'].includes(val)
      }
    }
  },
}
</script>

<style scoped>

</style>
