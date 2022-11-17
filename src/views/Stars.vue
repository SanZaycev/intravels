<template>
<div class="t-container">
  <div class="container">
    <div class="row">
      <div class="u-box">
        <ul class="t-tabs" :class="modeClass">
          <li class="t-box">
            <router-link class="t-link" :to="{name: 'StaredTours'}" @click="onClickToursTab">
              <span class="icn icn__jobs"></span>
              <span class="t-text">Избранные вакансии</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<div class="container">
  <div class="row pb__50 pt__5">
    <div id="uc" class="col-12 col-md-9">
      <WorkyLoader v-if="fetching" :action="fetchingAction"/>
      <StaredTours v-if="isToursView"/>
    </div>
    <StarsSidebar
      v-if="!isHomeView"
      :fetching="fetching"
    />
  </div>
</div>
</template>

<script>
import {mapActions} from "vuex";
import StaredTours from "../components/StaredTours.vue";
import WorkyLoader from "../components/WorkyLoader.vue";
import StarsSidebar from "../components/StarsSidebar.vue";
import {views} from "../core/actions.js";

export default {
  name: "Stars",
  components: {
    StaredTours,
    WorkyLoader,
    StarsSidebar,
  },
  inject: ['getModeClass'],
  data() {
    return {
      fetching: false,
      modeClass: "w-default",
      location: this.$store.state.location,
      fetchingAction: "BALLS_LOADER",
    }
  },
  computed: {
    isToursView() {
      return this.location.view === views.STARED_TOURS
    },
    isHomeView() {
      return this.location.view === views.STARS
    }
  },
  methods: {
    ...mapActions(['fetchingTimeout']),
    fetchingStart() {
      this.fetching = true
    },
    fetchingDone() {
      this.fetching = false
    },
    onClickToursTab() {
      if (!this.isToursView) {
        this.fetchingStart()
        this.$store.dispatch('cleanPagenav')
        .then(() => this.$store.dispatch('cleanToursList'))
      }
    },
  },
  beforeMount() {
    this.fetchingTimeout(200)
  },
  provide() {
    return {
      fetchingStart: this.fetchingStart,
      fetchingDone: this.fetchingDone,
    }
  }
}
</script>

<style scoped>

</style>
