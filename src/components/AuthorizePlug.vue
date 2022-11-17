<template>
<div v-if="isAuthenticated" class="view-box">
  <div class="auth-title"><h1>Вы авторизованы</h1></div>
  <hr>
  <div class="box">Добро пожаловать {{fullname}}</div>
  <span class="pr-1"><router-link :to="{name: 'Home'}">Главная</router-link></span>
  <span class="pr-1"><router-link :to="{name: 'Profile'}">Мой профиль</router-link></span>
</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "AuthorizePlug",
  computed: {
    ...mapGetters("user", ["isAuthenticated", "fullname"]),
  }
}
</script>

<style scoped>

</style>
