<template>
<div class="worky-filter">
  <div class="filter-container">
    <div class="container">
      <div class="row">
        <div class="col-12 w-tours">
          <div id="filter" class="filter">
            <AreasFilter @onareaselect="onAreaSelect"/>
            <CatsFilter @oncatselect="onCatSelect"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TabsFilter @ontabselect="onTabSelect"/>
</div>
</template>

<script>
import AreasFilter from "./AreasFilter.vue";
import CatsFilter from "./CatsFilter.vue";
import TabsFilter from "./TabsFilter.vue";

export default {
  name: "WorkyFilter",
  components: {
    AreasFilter,
    CatsFilter,
    TabsFilter,
  },
  emits: ['onareaselect', 'oncatselect', 'ontabselect'],
  methods: {
    onAreaSelect(data){
      this.$emit('onareaselect', data)
    },
    onCatSelect(data){
      this.$emit('oncatselect', data)
    },
    onTabSelect(){
      this.$emit('ontabselect')
    },
  },
}
</script>

<style scoped>

</style>
