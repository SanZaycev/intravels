<template>
<div class="filter__details w-type" :open="isMenuOpen">
  <div class="filter__summary">
    <div class="container">
      <div class="row">
        <div class="col-12" title="Отсортировать дополнительно по ключевым словам, зароботной плате и дате">
          <span class="tabs__filter-text" @click="toggleMenu">Дополнительно</span>
          <span class="icn icn__filter-tabs"></span>
        </div>
      </div>
    </div>
  </div>
  <div class="tabs__filter-container w-tours-container" id="wtabs">
    <div class="container">
      <div class="row">
        <div class="col-12 tabs__filter">
          <div class="tabs__filter-box">
            <div class="flex">
              <Tab
                class="t-w col-12 col-lg-2 col-md-6"
                :color="tabWordsColor"
                @action="onLoadWords"
              >Ключевые слова</Tab>
              <Tab
                class="t-w col-12 col-lg-2 col-md-6"
                :color="tabPayFromColor"
                @action="onLoadFrom"
              >Цена от: {{ payFromText }}</Tab>
              <Tab
                class="t-w col-12 col-lg-2 col-md-6"
                :color="tabPayToColor"
                @action="onLoadTo"
              >Цена до: {{ payToText }}</Tab>
              <Tab
                class="t-w col-12 col-lg-2 col-md-6"
                :color="tabListedDateColor"
                :days="listed_days"
                @action="onLoadDays"
              >Дата: {{ listedDateText }}</Tab>
            </div>
          </div>
          <div class="content__filter-box" :class="isOpenClass">
            <keep-alive>
              <TabWords
                v-if="active === actions.WORDS"
                :words="words"
                @inputwords="onInputWords"
                @searchwords="onSearchWords"
                @cleanwords="onCleanWords"
              ></TabWords>
              <TabPayFrom
                v-else-if="active === actions.FROM"
                :pay_from="pay_from"
                :pay_to="pay_to"
                @changefrom="onChangeFrom"
              ></TabPayFrom>
              <TabPayTo
                v-else-if="active === actions.TO"
                :pay_from="pay_from"
                :pay_to="pay_to"
                @changeto="onChangeTo"
              ></TabPayTo>
              <TabListedDate
                v-else-if="active === actions.DAYS"
                :listed_days="listed_days"
                @changedays="onChangeDays"
              ></TabListedDate>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import TabWords from "./TabWords.vue";
import TabPayFrom from "./TabPayFrom.vue";
import TabPayTo from "./TabPayTo.vue";
import TabListedDate from "./TabListedDate.vue";
import Tab from "./Tab.vue";
import {isEmptyString, isTypeUndefined} from "../../services/getters.js";
import routerNames from "../../router/names";

export default {
  name: "TabsFilter",
  components: {
    Tab,
    TabWords,
    TabPayFrom,
    TabPayTo,
    TabListedDate,
  },
  data(){
    return {
      active: "",
      isMenuOpen: true,
      isTabsOpen: false,
      words: "",
      pay_from: 0,
      pay_to: 999999,
      listed_days: 9999,
      actions: {
        WORDS: "Words",
        FROM: "PayFrom",
        TO: "PayTo",
        DAYS: "ListedDate",
      },
    }
  },
  emits: ['ontabselect'],
  inject: ['appScrollTo'],
  watch: {
    $route(to, from) {
      if (from.name === routerNames.Job) {
        this.setActiveFilters()
      }
      if (this.isUsingLocation || this.isUsingCrumbs) {
        this.cleanTabs()
        setTimeout(() => {
          this.usingLocation(false)
          this.usingCrumbs(false)
        }, 1000)
      }
    }
  },
  computed: {
    ...mapGetters('location', ['isUsingLocation', 'isUsingCrumbs']),
    activeComponentName(){
      return 'Tab' + this.active;
    },
    tabWordsColor(){
      return this.active === this.actions.WORDS ? 'primary' : 'default'
    },
    tabPayFromColor(){
      return this.active === this.actions.FROM ? 'primary' : 'default'
    },
    tabPayToColor(){
      return this.active === this.actions.TO ? 'primary' : 'default'
    },
    tabListedDateColor(){
      return this.active === this.actions.DAYS ? 'primary' : 'default'
    },
    isOpenClass(){
      return this.isTabsOpen ? "" : "hidden"
    },
    listedDateText(){
      const days = this.listed_days.toString();
      if (!isEmptyString(days)){
        switch (days){
          case "9999": return "Все"
          case "1": return "Сегодня"
          case "3": return "За 3 дня"
          case "7": return "За неделю"
          case "14": return "За 14 ней"
          case "30": return "За 30 дней"
          default: break;
        }
      }
      return ""
    },
    payFromText(){
      const from = this.pay_from.toString();
      if (!isEmptyString(from)){
        if (from === "0"){ return "0" }
        return `${from.slice(0, -3)}T`
      }
      return ""
    },
    payToText(){
      const to = this.pay_to.toString();
      if (!isEmptyString(to)){
        if (to === "999999"){ return "200Т+" }
        return `${to.slice(0, -3)}T`
      }
      return ""
    },
  },
  methods: {
    ...mapActions('location', ['parseSearchParams', 'usingLocation', 'usingCrumbs']),
    ...mapActions(['listFetchingStart', 'listFetchingDone']),
    onLoadWords() {
      setTimeout(() => this.appScrollTo("main"), 15);
      this.active = this.actions.WORDS;
      this.isTabsOpen = true
    },
    onLoadTo() {
      setTimeout(() => this.appScrollTo("main"), 15);
      this.active = this.actions.TO;
      this.isTabsOpen = true
    },
    onLoadFrom() {
      setTimeout(() => this.appScrollTo("main"), 15);
      this.active = this.actions.FROM;
      this.isTabsOpen = true
    },
    onLoadDays() {
      setTimeout(() => this.appScrollTo("main"), 15);
      this.active = this.actions.DAYS;
      this.isTabsOpen = true
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    onInputWords(words) {
      this.words = words;
    },
    onCleanWords() {
      this.words = "";
      this.onSearchWords()
    },
    async onChangeFrom(from) {
      this.pay_from = from;
      await this.parseSearchParams({ from: this.pay_from })
      this.$emit('ontabselect')
      this.isTabsOpen = false;
      this.active = "";
    },
    async onChangeTo(to) {
      this.pay_to = to;
      await this.parseSearchParams({ to: this.pay_to })
      this.$emit('ontabselect')
      this.isTabsOpen = false;
      this.active = "";
    },
    async onChangeDays(days) {
      this.listed_days = days;
      await this.parseSearchParams({ days: this.listed_days })
      this.$emit('ontabselect')
      this.isTabsOpen = false;
      this.active = "";
    },
    async onSearchWords() {
      await this.parseSearchParams({ words: this.words })
      this.$emit('ontabselect')
      this.isTabsOpen = false;
      this.active = "";
    },
    setActiveFilters(){
      const search = this.$route.query
      if (!isTypeUndefined(search.words)){
        this.words = decodeURI(search.words)
        this.active = this.actions.WORDS
        this.isTabsOpen = true
      }
      if (!isTypeUndefined(search.from)){
        this.pay_from = Number.parseInt(search.from);
        if (!this.active) { this.active = this.actions.FROM }
        this.isTabsOpen = true
      }
      if (!isTypeUndefined(search.to)){
        this.pay_to = Number.parseInt(search.to);
        if (!this.active) { this.active = this.actions.TO }
        this.isTabsOpen = true
      }
      if (!isTypeUndefined(search.days)){
        this.listed_days = Number.parseInt(search.days);
        if (!this.active) { this.active = this.actions.DAYS }
        this.isTabsOpen = true
      }
    },
    cleanTabs() {
      this.isMenuOpen = true;
      this.isTabsOpen = false;
      this.active = "";
      this.words = "";
      this.pay_from = 0;
      this.pay_to = 999999;
      this.listed_days = 9999;
    },
    fetchingStart() {
      this.listFetchingStart();
      this.busy = true;
    },
    fetchingDone() {
      this.listFetchingDone();
      this.busy = false;
    },
  },
  mounted() {
    this.setActiveFilters()
  }
}
</script>

<style scoped>

</style>
