<template>
  <div class="w-box">
    <ul class="filter__nav">
      <li class="nav__i col-12 col-lg-1" v-for="c in checkboxes" :key="c.pk">
        <input type="radio" name="to"
          :id="'nav_' + c.pk"
          :value="c.val"
          @change="$emit('changeto', c.val)"
          :class="isInactive(c.val)"
        >
        <label :for="'nav_' + c.pk">{{ c.txt }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TabPayTo",
  data(){
    return {
      checkboxes: [
        { pk: 12, txt: "30T", val: 30000, inactive: "" },
        { pk: 13, txt: "40T", val: 40000, inactive: "" },
        { pk: 14, txt: "50T", val: 50000, inactive: "" },
        { pk: 15, txt: "60T", val: 60000, inactive: "" },
        { pk: 16, txt: "70T", val: 70000, inactive: "" },
        { pk: 17, txt: "80T", val: 80000, inactive: "" },
        { pk: 18, txt: "90T", val: 90000, inactive: "" },
        { pk: 19, txt: "100T", val: 100000, inactive: "" },
        { pk: 20, txt: "150T", val: 150000, inactive: "" },
        { pk: 21, txt: "200T", val: 200000, inactive: "" },
        { pk: 22, txt: "200T+", val: 999999, inactive: "" },
      ],
    }
  },
  emits: ['changeto'],
  props: {
    pay_from: {
      type: Number,
      default: 0,
    },
    pay_to: {
      type: Number,
      default: 999999,
    }
  },
  mounted(){
    this.setActiveTab()
  },
  beforeUpdate() {
    this.setActiveTab()
  },
  methods: {
    isInactive(val){
      if (val < this.pay_from){ return 'w-inactive' }
      return ""
    },
    setActiveTab(){
      for (let i = 0; i < this.checkboxes.length; i++){
        const c = this.checkboxes[i];
        if (c.val === this.pay_to){
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
