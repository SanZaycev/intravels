<template>
<div class="pagenav" v-if="showPagenav">
  <ul class="pagination">
    <li v-if="isDesktop" class="first">
      <a
        :href="clientBase"
        @click.prevent="onClickFirstPage"
        :disabled="isInFirstPage"
        title="Перейти на первую страницу"
      >Первая</a>
    </li>
    <li>
      <a
        :href="clientPrev"
        @click.prevent="onClickPreviousPage"
        :disabled="isInFirstPage"
        title="Перейти на предыдущую страницу"
      ><span aria-hidden="true">«</span></a>
    </li>
    <li v-for="p in pages" :key="p.number" :class="isActiveClass(p.number)">
      <a
        :href="setPageUrl(p.number)"
        @click.prevent="onClickPage(p.number)"
        :disabled="p.isDisabled"
      >{{ p.number }}</a>
    </li>
    <li>
      <a
        :href="clientNext"
        @click.prevent="onClickNextPage"
        :disabled="isInLastPage"
        title="Перейти на следующую страницу"
      ><span aria-hidden="true">»</span></a>
    </li>
    <li v-if="isDesktop" class="last">
      <a
        :href="clientLast"
        @click.prevent="onClickLastPage"
        :disabled="isInLastPage"
        title="Перейти на последнюю страницу"
      >Последняя</a>
    </li>
  </ul>
</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "AppPagenav",
  data() {
    return {
      activated: false
    }
  },
  mounted() {
    this.activated = true
  },
  emits: ['pagechanged'],
  computed: {
    ...mapGetters('pagenav', [
        'isPagenav',
        'activePage',
        'totalPages',
        'clientBase',
        'clientLast',
        'clientNext',
        'clientPrev',
        'range',
    ]),
    showPagenav() {
      return this.activated && this.isPagenav
    },
    isDesktop(){
      return document.documentElement.clientWidth > 480
    },
    startPage(){
      let page = 1;
      if (this.activePage === 1){  return 1; }
      else if (this.activePage === this.totalPages){
        page = this.totalPages - this.range + 1;
      }
      else {
        page = this.activePage - 1;
      }
      if (page < 1){ page = 1; }
      return page
    },
    endPage(){
      return Math.min(this.startPage + this.range - 1, this.totalPages);
    },
    pages(){
      const range = [];
      for (let i = this.startPage; i <= this.endPage; i++){
        range.push({
          number: i,
          isDisabled: i === this.activePage
        });
      }
      return range;
    },
    isInFirstPage(){
      return this.activePage === 1;
    },
    isInLastPage(){
      return this.activePage === this.totalPages;
    },
  },
  methods: {
    onClickFirstPage(){
      this.$emit('pagechanged', 1);
    },
    onClickPreviousPage(){
      this.$emit('pagechanged', this.activePage - 1);
    },
    onClickPage(page){
      page = page > 0 ? page : 1;
      this.$emit('pagechanged', page);
    },
    onClickNextPage(){
      this.$emit('pagechanged', this.activePage + 1);
    },
    onClickLastPage(){
      this.$emit('pagechanged', this.totalPages);
    },
    isPageActive(page){
      return this.activePage === page;
    },
    isActiveClass(page){
      return this.activePage === page ? "active" : ""
    },
    setPageUrl(page){
      if (page > 1){
        return `${this.clientBase}?page=${page}`
      }
      return this.clientBase
    },
  }
}
</script>

<style scoped>

</style>
