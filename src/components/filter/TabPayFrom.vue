<template>
  <div class="w-box">
    <ul class="filter__nav">
      <li class="nav__i col-12 col-lg-1" v-for="c in checkboxes" :key="c.pk">
        <input type="radio" name="from"
          :id="'nav_' + c.pk"
          :value="c.val"
          @change="$emit('changefrom', c.val)"
          :class="isInactive(c.val)"
        >
        <label :for="'nav_' + c.pk">{{ c.txt }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TabPayFrom",
  data(){
    return {
      checkboxes: [
        { pk: 1, txt: "0", val: 0, inactive: "" },
        { pk: 2, txt: "10T", val: 10000, inactive: "" },
        { pk: 3, txt: "20T", val: 20000, inactive: "" },
        { pk: 4, txt: "30T", val: 30000, inactive: "" },
        { pk: 5, txt: "40T", val: 40000, inactive: "" },
        { pk: 6, txt: "50T", val: 50000, inactive: "" },
        { pk: 7, txt: "60T", val: 60000, inactive: "" },
        { pk: 8, txt: "70T", val: 70000, inactive: "" },
        { pk: 9, txt: "80T", val: 80000, inactive: "" },
        { pk: 10, txt: "90T", val: 90000, inactive: "" },
        { pk: 11, txt: "100T", val: 100000, inactive: "" },
      ],
    }
  },
  emits: ['changefrom'],
  props: {
    pay_from: {
      type: Number,
      required: false,
      default: 0,
    },
    pay_to: {
      type: Number,
      required: false,
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
      if (val > this.pay_to){ return 'w-inactive' }
      return ""
    },
    setActiveTab(){
      for (let i = 0; i < this.checkboxes.length; i++){
        const c = this.checkboxes[i];
        if (c.val === this.pay_from){
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
