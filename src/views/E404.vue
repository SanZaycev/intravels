<template>
  <div class="container">
    <div class="view-box">
      <div class="view-title"><h1>Страница не найдена</h1></div>
      <hr>
      <p>Мы не смогли найти данную страницу. Возможно она просрочена или удалена.</p>
      <span class="pr-1"><router-link :to="{name: 'Home'}">Главная</router-link></span>
      <span class="pr-1"><router-link :to="{name: 'Tours'}">Экскурсии</router-link></span>
    </div>
  </div>
</template>

<script>

export default {
  name: "E404"
}
</script>
