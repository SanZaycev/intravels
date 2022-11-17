<template>
  <div v-if="w__msg" class="w__row" :class="w__msg.type">
    <div class="container">
      <div class="w__msg">
        <div class="i_box"><span class="icn" :class="w__msg.type"></span></div>
        <div class="i_box w__msg-text">{{ w__msg.text }}</div>
        <button class="btn" :class="w__msg.type" @click="$emit('close')">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkyMsg",
  props: ['w__msg'],
  emits: ['close'],
}
</script>

<style scoped>

</style>
