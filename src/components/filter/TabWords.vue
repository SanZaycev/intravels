<template>
  <div class="filter__tab col-12 col-lg-6">
    <div class="filter__control">
      <span class="filter__icn"><span class="icn__words"></span></span>
      <input class="filter__current" autocomplete="off" type="text" name="words" placeholder="Ключевые слова, например: Конная прогулка"
        ref="words"
        :value="words"
        @input="onInput"
        @keydown="onKeyDown"
      >
      <button type="button" class="filter__clean"
        @click="onCleanInput()"
        :class="cleanBtnClass"
      ><span class="icn icn__close"></span></button>
    </div>
  </div>
  <div class="filter__search col-12 col-lg-6">
    <div class="filter-control">
      <button type="button" class="filter__search-btn"
        @click="onSubmit"
        :class="inactiveClass"
      >Поиск</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabWords",
  props: {
    words: {
      type: String,
      default: ""
    }
  },
  emits: ['inputwords', 'searchwords', 'cleanwords'],
  computed: {
    inactiveClass(){
      if (!this.words || !this.words.length){ return "w-inactive" }
      return "w-active"
    },
    cleanBtnClass(){
      if (!this.words || !this.words.length){ return 'w-hidden' }
      return "w-f-visible"
    }
  },
  methods: {
    onInput(e){
      const words = this.formattedWords(e.target.value);
      e.target.value = words;
      this.$emit('inputwords', words);
    },
    onKeyDown(e){
      if (
          this.words.length
          && this.words.length < 30
          && (e.keyCode === 13 || e.key === "Enter")
      ){ setTimeout(() => this.onSubmit(), 20) }
    },
    onSubmit(){
      this.$refs.words.blur();
      this.$emit('searchwords');
    },
    onCleanInput(){
      this.$emit('cleanwords');
    },
    formattedWords(val){
      return val.replace(/[^a-zа-яё\s]/gi, '').replace("  ", " ").substring(0, 30);
    },
  },
}
</script>

<style scoped>

</style>
