<template>
  <div class="w-box">
    <ul class="filter__nav">
      <li class="nav__i col-12 col-lg-1-8" v-for="c in checkboxes" :key="c.pk">
        <input type="radio" name="days"
          :id="'nav_' + c.pk"
          :value="c.val"
          @change="$emit('changedays', c.val)"
        >
        <label :for="'nav_' + c.pk">{{ c.txt }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TabListedDate",
  data(){
    return {
      checkboxes: [
        { pk: 30, txt: "Все", val: 9999 },
        { pk: 31, txt: "Сегодня", val: 1 },
        { pk: 32, txt: "3 дня", val: 3 },
        { pk: 33, txt: "За неделю", val: 7 },
        { pk: 34, txt: "14 дней", val: 14 },
        { pk: 35, txt: "30 дней", val: 30 },
      ],
    }
  },
  emits: ['changedays'],
  props: {
    listed_days: {
      type: Number,
      default: 9999,
    }
  },
  mounted(){
    this.setActiveTab()
  },
  beforeUpdate() {
    this.setActiveTab()
  },
  methods: {
    setActiveTab(){
      for (let i = 0; i < this.checkboxes.length; i++){
        const c = this.checkboxes[i];
        if (Number.parseInt(c.val) === Number.parseInt(this.listed_days)){
          const checkbox = document.getElementById('nav_' + c.pk)
          if (checkbox){ checkbox.checked = true }
          break;
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
