<template>
  <div class="view-box">
    <h1>Домашняя страница</h1>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: 'Home',
  methods: {
    ...mapActions(['fetchingTimeout']),
  },
  beforeMount() {
    this.fetchingTimeout(200)
  },
}
</script>
