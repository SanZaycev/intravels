<template>
  <div class="w-box pt__15">
    <div class="tour__total">
      <div class="i-box"><span class="bold">{{ itemsCount }}</span><span class="txt __13 pl__5">{{ naturalTotalToursText }}</span></div>
      <div class="i-box"><span class="tour__words">{{ wordsText }}</span></div>
    </div>
    <ul v-if="toursList.length" class="tours-list">
      <li class="tour" v-for="tour in toursList" :key="tour.pk" :data-pk="tour.pk">
        <div class="w-box">
          <div v-if="tour.h1" class="tour__title">
            <router-link
              :to="tour.url"
              :title="'Перейти к вакансии ' + tour.h1"
              @click="onTourDetail(tour.pk)"
            ><h3>{{ tour.h1 }}</h3></router-link>
          </div>
          <span v-if="tour.natural_date" class="tour__date">{{ tour.natural_date }}</span>
        </div>
        <div class="w-box pb__10">
          <div class="tour__salary">
            <div class="num">{{ tour.salary }}<span class="currency">{{ tour.currency_symbol }}</span></div>
          </div>
          <div class="flex__ac">
            <span v-if="tour.country && tour.country_slug" class="tour__crumb medium"><router-link :to="{ name: 'CountryTours', params: { country: tour.country_slug }}" @click="onAreaCrumbClick(tour.country_slug)" :title="'Все вакансии в стране ' + tour.country">{{ tour.country }}</router-link></span>
            <span v-if="tour.country && tour.country_slug" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
            <span v-if="tour.state && tour.state_slug" class="tour__crumb"><router-link :to="{ name: 'StateTours', params: { state: tour.state_slug }}" @click="onAreaCrumbClick(tour.state_slug)" :title="'Все вакансии в регионе ' + tour.state">{{ tour.state }}</router-link></span>
            <span v-if="tour.state && tour.state_slug" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
            <span v-if="tour.city && tour.city_slug" class="tour__crumb"><router-link :to="{ name: 'CityTours', params: { city: tour.city_slug }}" @click="onAreaCrumbClick(tour.city_slug)" :title="'Все вакансии в городе ' + tour.city">{{ tour.city }}</router-link></span>
          </div>
          <div class="flex__ac">
            <span v-if="tour.cat && tour.cat_slug" class="tour__crumb medium"><router-link :to="{ name: 'ToursCategory', params: { cat: tour.cat_slug }}" @click="onCatCrumbClick(tour.cat_slug)" :title="'Все вакансии в категории ' + tour.cat">{{ tour.cat }}</router-link></span>
            <span v-if="tour.cat && tour.cat_slug" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
            <span v-if="tour.subcat && tour.subcat_slug" class="tour__crumb"><router-link :to="{ name: 'ToursSubCategory', params: { subcat: tour.subcat_slug }}" @click="onCatCrumbClick(tour.subcat_slug)" :title="'Все вакансии по специализации ' + tour.subcat">{{ tour.subcat }}</router-link></span>
          </div>
        </div>
        <div class="w-box">
          <ul v-if="tour.tips && tour.tips.length" class="tour__tip-list">
            <li v-for="(tip, index) in tour.tips" :key="index" class="tour__tip"><span class="tip-text">{{ tip }}</span></li>
          </ul>
          <div v-if="tour.description" class="tour__description">{{ tour.description }}</div>
        </div>
        <div class="w-box pt__15">
          <div class="tour__foot">
            <div class="w-left w-box-sm">
              <div class="tour__employer">
                <div v-if="tour.logo_url" class="employer__logo"><img :src="tour.logo_url" :alt="tour.guide + ' - logo'"></div>
                <div v-if="tour.guide_pk && tour.guide" class="employer__name fz__16">
                  <router-link :to="tour.guide_url" :title="'Все туры у гида ' + tour.guide" class="w-url">{{ tour.guide }}</router-link>
                  <div v-if="tour.guide_accepted" class="employer__accepted"><span class="icn icn__check"></span><span class="employer__text">Подтверждён</span></div>
                </div>
              </div>
            </div>
            <div class="w-right star-box">
              <button type="button" class="tour__star"
              :title="staredTitle(tour.is_stared)"
              @click="star(tour)"
              ><span class="icn" :class="staredIcon(tour.is_stared)"></span></button>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <AppPagenav @pagechanged="onPageChange"/>
  </div>
  <div v-if="!toursList.length" class="u-box pt__35">
    <div class="w-card flex-center">
      <div class="card__title"><h4>Сейчас тут нет туров</h4></div>
      <span class="icn icn__empty_jobs"></span>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AppPagenav from "../components/AppPagenav.vue";
import {setErrorMessage, setToastMessage} from "../services/setters.js";
import {isEmptyString, isObject} from "../services/getters.js";

export default {
  name: "ToursList",
  components: {
    AppPagenav,
  },
  data() {
    return {
      busy: false
    }
  },
  props: {
    toursList: {
      type: Array,
      default: [],
    }
  },
  emits: ["onpagechange", "ontourdetail", "areacrumbclick", "catcrumbclick"],
  async mounted() {
    await this.setCredentialsInList()
  },
  computed: {
    ...mapGetters(['isStoreReady']),
    ...mapGetters('location', ['searchWords']),
    ...mapGetters('pagenav', ['itemsCount', 'naturalTotalToursText']),
    wordsText(){
      return !isEmptyString(this.searchWords) ? "«" + this.searchWords.replace("words=", "") + "»" : ""
    }
  },
  methods: {
    ...mapActions('tours', ['parseCredentialsInList', 'starListTour']),
    onPageChange(page) {
      this.$emit('onpagechange', page)
    },
    onTourDetail(pk) {
      this.$emit('ontourdetail', pk)
    },
    onAreaCrumbClick(slug) {
      this.$emit('areacrumbclick', slug)
    },
    onCatCrumbClick(slug) {
      this.$emit('catcrumbclick', slug)
    },
    staredTitle(is_stared) {
      return is_stared ? 'Удалить из избранного' : 'Добавить в избранное'
    },
    staredIcon(is_stared) {
      return is_stared ? 'icn__stared' : 'icn__unstared'
    },
    async star(tour) {
      if (!this.busy && !isEmptyString(tour.api_url)) {
        try {
          this.busy = true
          const data = await this.starListTour(tour)
          if (isObject(data) && data.message) {
            setToastMessage(data.message, data.condition)
          }
        } catch (err) {
          setErrorMessage(err)
        }
        this.busy = false
      }
    },
    async setCredentialsInList() {
      if (!this.isStoreReady) {
        try {
          const ids = this.toursList.map(tour => tour.pk)
          if (Array.isArray(ids) && ids.length) {
            const data = await this.$api.tours.credentialsList(ids)
            this.parseCredentialsInList(data)
          }
        } catch (err) {
          setErrorMessage(err)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
