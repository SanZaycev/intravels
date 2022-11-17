<template>
  <div class="router-view">
    <div class="filter-wrapper w-tours" ref="filter">
      <ToursFilter
        v-if="isToursListView"
        @onareaselect="onAreaSelect"
        @oncatselect="onCatSelect"
        @ontabselect="onTabSelect"
        :style="renderingFilterStyle"
      />
    </div>
    <div class="container">
      <div class="row pb__50">
        <div id="uc" class="col-12" :class="containerClass">
          <ListLoader v-if="isListFetching"></ListLoader>
          <ToursList
            v-if="isToursListView"
            :toursList="toursList"
            @onpagechange="onPageChange"
            @ontourdetail="fetchTourDetail"
            @areacrumbclick="onAreaCrumbClick"
            @catcrumbclick="onCatCrumbClick"
          />
          <Tour v-else-if="isTourDetailView" @switchlist="onSwitchToList"/>
        </div>
        <WorkySidebar v-if="isToursListView"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ToursFilter from "../components/filter/ToursFilter.vue";
import ToursList from "../components/ToursList.vue";
import Tour from "../components/Tour.vue";
import WorkySidebar from "../components/WorkySidebar.vue";
import ListLoader from "../components/ListLoader.vue";
import {views} from "../core/actions.js";
import {path} from "../core/state.js";
import {isEmptyString} from "../services/getters.js";
import {setErrorMessage} from "../services/setters.js";


export default {
  name: "Tours",
  components: {
    ListLoader,
    ToursFilter,
    Tour,
    ToursList,
    WorkySidebar,
  },
  data() {
    return {
      busy: false,
      activated: false
    }
  },
  inject: ['appScrollTo', 'isDesktop'],
  mounted() {
    if (this.isRendering) {
      this.render()
      setTimeout(() => {
        this.usingRendering(false)
      }, 1000)
    }
  },
  computed: {
    ...mapGetters([
      'activeView',
      'isStoreReady',
      'isFetching',
      'isListFetching',
      'isRendering'
    ]),
    ...mapGetters('location', [
      'searchClientURI',
      'searchApiURI',
    ]),
    ...mapGetters('tours', ['toursList']),
    ...mapGetters('pagenav', ['activePage']),
    isToursListView() {
      return this.activeView === views.TOURS_LIST
    },
    isTourDetailView() {
      return this.activeView === views.TOUR_DETAIL
    },
    containerClass() {
      return this.isToursListView ? "col-lg-9" : ""
    },
    renderingFilterStyle() {
      return this.isRendering ? { "background-color": "#0d3880" } : { "background-color": "#ffffff" }
    }
  },
  methods: {
    ...mapActions('tours', [
      'getTour',
      'cleanTour'
    ]),
    ...mapActions('location', [
      'cleanLocationSearch',
      'setAreaBySlug',
      'setCatBySlug',
      'usingLocation',
      'usingCrumbs'
    ]),
    ...mapActions([
      'listFetchingStart',
      'listFetchingDone',
      'usingRendering'
    ]),
    fetchingStart() {
      this.listFetchingStart()
      this.busy = true
    },
    fetchingDone() {
      setTimeout(() => this.listFetchingDone(), 100)
      this.busy = false
      this.activated = true
    },
    onAreaSelect(data) {
      this.$ssr.parseToursData(data)
    },
    onCatSelect(data) {
      this.$ssr.parseToursData(data)
    },
    onTabSelect() {
      this.fetchFilterTabs()
    },
    onPageChange(page) {
      this.fetchToursList(page)
    },
    async fetchToursList(page, hasLoader=true, isCrumbEvent=false) {
      if (!this.busy) {
        this.busy = true;
        if (hasLoader){ this.listFetchingStart(); }
        setTimeout(() => this.appScrollTo( "main", isCrumbEvent ? "smooth" : "auto"), 50)
        try {
          if (!page){ page = this.activePage }
          const isPaged = page && Number.parseInt(page) > 1

          const _api = this.$ssr.toursListApiURI();
          const _client = this.$ssr.toursListClientURI();

          const api = isPaged
            ? isEmptyString(this.searchApiURI)
            ? `${_api}?page=${page}`
            : `${_api}&page=${page}`
            : _api
          const client = isPaged
            ? isEmptyString(this.searchClientURI)
            ? `${_client}?page=${page}`
            : `${_client}&page=${page}`
            : _client

          console.log("api: ", api)
          console.log("client: ", client)

          const data = await this.$api.tours.list(api)
          await this.$ssr.parseToursData(data)

          if (!isCrumbEvent){
            await this.$router.push(client)
          }
          this.fetchingDone()
        } catch (err) {
          setErrorMessage(err)
          this.fetchingDone()
        }
      }
    },
    async fetchFilterTabs() {
      if (!this.busy) {
        try {
          this.fetchingStart()
          const api = this.$ssr.toursListApiURI()
          const client = this.$ssr.toursListClientURI()
          if (!isEmptyString(api) && !isEmptyString(client)) {
            const data = await this.$api.tours.list(api)
            await this.$ssr.parseToursData(data)
            await this.$router.push(client)
          }
          setTimeout(() => {
            this.appScrollTo( "main")
            this.fetchingDone();
          }, 50)
        } catch (err) {
          setErrorMessage(err)
          this.fetchingDone()
        }
      }
    },
    async fetchTourDetail(pk) {
      if (!this.busy) {
        try {
          this.fetchingStart()
          setTimeout(() => this.appScrollTo( "tabs"), 30)
          const data = await this.getTour(`${path.API_TOURS}${pk}/`)
          await this.$ssr.parseToursData({ tour: data })
          setTimeout(() => this.fetchingDone(), 250)
        } catch (err) {
          setErrorMessage(err)
          this.fetchingDone();
        }
      }
    },
    async onSwitchToList() {
      try {
        await this.fetchToursList(this.$route.query.page, true, true)
        await this.$ssr.parseURLParams(this.$route)
        await this.cleanTour()
        setTimeout(() => this.appScrollTo("main", "smooth"), 15)
      } catch (err) {
        setErrorMessage(err)
      }
    },
    onAreaCrumbClick(slug) {
      if (!isEmptyString(slug)) {
        this.usingLocation(true)
        this.listFetchingStart()
        this.appScrollTo("main")
        this.setAreaBySlug(slug)
        this.setCatBySlug("/")
        this.cleanLocationSearch()
        setTimeout(() => this.fetchToursList(1, true, true), 50)
      }
    },
    onCatCrumbClick(slug) {
      if (!isEmptyString(slug)) {
        this.usingCrumbs(true)
        this.listFetchingStart()
        this.appScrollTo("main")
        this.setCatBySlug(slug)
        this.setAreaBySlug("/")
        this.cleanLocationSearch()
        setTimeout(() => this.fetchToursList(1, true, true), 50)
      }
    },
    async render() {
      try {
        await this.$ssr.parseURLParams(this.$route)
        await this.fetchToursList(this.$route.query.page, true, true)
      } catch (err) {
        setErrorMessage(err)
      }
    }
  }
}
</script>

<style scoped>

</style>
