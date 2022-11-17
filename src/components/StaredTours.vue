<template>
<div class="u-box pt__15">
  <div class="job__total">
    <div class="i-box"><span class="bold">{{ pagenav.count }}</span><span class="txt __13 pl__5">{{ naturalTotalText }}</span></div>
  </div>
  <ul v-if="job_list.length" id="jl" class="job-list">
    <li class="job" v-for="j in job_list" :key="j.pk" :data-pk="j.pk">
      <div class="w-box">
        <div v-if="j.h1" class="job__title">
          <router-link
            :to="j.url"
            :title="'Перейти к вакансии ' + j.h1"
          ><h3>{{ j.h1 }}</h3></router-link>
        </div>
        <span v-if="j.natural_date" class="job__date">{{ j.natural_date }}</span>
        <button style="display: none" type="button" class="btn warning" @click="removeJob(j.pk)">Удалить</button>
      </div>
      <div class="w-box pb__10">
        <div class="job__salary">
          <div class="num">{{ j.salary }}<span class="currency">{{ j.currency_symbol }}</span></div>
        </div>
        <div class="flex__ac">
          <span v-if="j.country && j.country_slug" class="job__crumb medium"><router-link :to="{ name: 'CountryJobs', params: { country: j.country_slug }}" @click="onAreaCrumbClick(j.country_slug)" :title="'Все вакансии в стране ' + j.country">{{ j.country }}</router-link></span>
          <span v-if="j.country && j.country_slug" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
          <span v-if="j.state && j.state_slug" class="job__crumb"><router-link :to="{ name: 'StateJobs', params: { state: j.state_slug }}" @click="onAreaCrumbClick(j.state_slug)" :title="'Все вакансии в регионе ' + j.state">{{ j.state }}</router-link></span>
          <span v-if="j.state && j.state_slug" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
          <span v-if="j.city && j.city_slug" class="job__crumb"><router-link :to="{ name: 'CityJobs', params: { city: j.city_slug }}" @click="onAreaCrumbClick(j.city_slug)" :title="'Все вакансии в городе ' + j.city">{{ j.city }}</router-link></span>
        </div>
        <div class="flex__ac">
          <span v-if="j.profy && j.profy_slug" class="job__crumb medium"><router-link :to="{ name: 'Profy', params: { profy: j.profy_slug }}" @click="onProfyCrumbClick(j.profy_slug)" :title="'Все вакансии в категории ' + j.profy">{{ j.profy }}</router-link></span>
          <span v-if="j.profy && j.profy_slug" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
          <span v-if="j.subprofy && j.subprofy_slug" class="job__crumb"><router-link :to="{ name: 'Subprofy', params: { subprofy: j.subprofy_slug }}" @click="onProfyCrumbClick(j.subprofy_slug)" :title="'Все вакансии по специализации ' + j.subprofy">{{ j.subprofy }}</router-link></span>
        </div>
      </div>
      <div class="w-box">
        <ul v-if="j.tips && j.tips.length" class="job__tip-list">
          <li v-for="(t, index) in j.tips" :key="index" class="job__tip"><span class="tip-text">{{ t }}</span></li>
        </ul>
        <div v-if="j.description" class="job__description">{{ j.description }}</div>
      </div>
      <div class="w-box pt__15">
        <div class="job__foot">
          <div class="w-left w-box-sm">
            <div class="job__employer">
              <div v-if="j.logo_url" class="employer__logo"><img :src="j.logo_url" :alt="j.employer + ' - logo'"></div>
              <div v-if="j.employer_pk && j.employer" class="employer__name fz__16">
                <router-link :to="j.employer_url" :title="'Все вакансии в ' + j.employer" class="w-url">{{ j.employer }}</router-link>
                <div v-if="j.employer_accepted" class="employer__accepted"><span class="icn icn__check"></span><span class="employer__text">Подтверждён</span></div>
              </div>
            </div>
          </div>
          <div class="w-right star-box">
            <button type="button" class="job__star"
              :title="staredTitle(j.is_stared)"
              @click="starJob(j)"
            ><span class="icn" :class="staredIcon(j.is_stared)"></span></button>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <AppPagenav
      v-if="pagenav.total_pages > 1"
      :api="pagenav.api"
      :client="pagenav.client"
      :count="pagenav.count"
      :total_pages="pagenav.total_pages"
      :next="pagenav.next"
      :prev="pagenav.prev"
      :active="pagenav.active"
      :range="pagenav.range"
      @pagechanged="onPageChange"
  ></AppPagenav>
</div>
<div v-if="!job_list.length" class="u-box pt__35">
  <div class="w-card flex-center">
    <div class="card__title"><h4>Сейчас тут нет вакансий</h4></div>
    <span class="icn icn__empty_jobs"></span>
  </div>
</div>
</template>

<script>
import {mapActions} from "vuex";
import {path} from "../core/state.js";
import {apiActions} from "../core/actions.js";
import routerNames from "../router/names.js";
import AppPagenav from "../components/AppPagenav.vue";
import WorkyLoader from "../components/WorkyLoader";
import {isEmptyString, isNumber, isObject} from "../services/getters.js";
import {scrollTo, setToastMessage} from "../services/setters.js";

export default {
  name: "StaredJobs",
  components: {
    AppPagenav,
    WorkyLoader,
  },
  data() {
    return {
      activated: false,
      updating: false,
      busy: false,
      fetching: false,
      tabs: null,
      navbar: null,
      main: null,
      user: this.$store.state.user,
      location: this.$store.state.location,
      job_list: this.$store.state.jobs.list,
      pagenav: this.$store.state.pagenav,
      fetchingAction: "BALLS_LOADER",
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === routerNames.StaredJobs) {
        this.getJobsData(false)
      }
    }
  },
  computed: {
    naturalTotalText(){
      if (this.pagenav.count > 4 && this.pagenav.count < 21){ return ' вакансий' }
      else {
        const last_digit = Number.isInteger(this.pagenav.count) ? this.pagenav.count % 10 : this.pagenav.count.toString().slice(-1);
        switch (last_digit){
          case 1:
            return ' вакансия'
          case 2:
            return ' вакансии'
          case 3:
            return ' вакансии'
          case 4:
            return ' вакансии'
          default:
            return ' вакансий'
        }
      }
    },
    activePageNumber() {
      return isObject(this.pagenav) && isNumber(this.pagenav.active) && this.pagenav.active > 1
      ? this.pagenav.active
      : 1
    },
  },
  methods: {
    ...mapActions(['fetchingTimeout']),
    onPageChange(page) {
      this.fetchJobList(page, true, true).catch(err => setToastMessage(err.message, "w-error"))
    },
    onAreaCrumbClick() {
      setTimeout(() => scrollTo(this.main), 50)
    },
    onProfyCrumbClick() {
      setTimeout(() => scrollTo(this.main), 50)
    },
    staredTitle(is_stared) {
      return is_stared ? 'Удалить из избранного' : 'Добавить в избранное'
    },
    staredIcon(is_stared) {
      return is_stared ? 'icn__stared' : 'icn__unstared'
    },
    getJobsData(isPrefetching=true) {
      if (!this.updating) {
        this.updating = true
        this.fetchJobList(this.$route.query.page, isPrefetching)
        .then(() => setTimeout(() => this.updating = false, 500))
        .catch(err => setToastMessage(err.message, "w-error"))
        this.activated = true
      }
    },
    async starJob(job) {
      console.log(job)
      if (!this.busy && !isEmptyString(job.api_url)) {
        this.busy = true
        const response = await fetch(job.api_url, {
          method: 'POST',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"action": apiActions.STAR_JOB})
        }).catch((err) => setToastMessage(err.message, "w-error"));
        const data = await response.json()
        if (data.message) {
          setToastMessage(data.message, data.condition)
        }
        job.is_stared = !!data.stared
        this.busy = false
      }
    },
    async fetchJobList(page, isPrefetching=true, pagenavAction=false) {
      if (!this.busy) {
        return new Promise(async (resolve, reject) => {
          this.busy = true;
          if (isPrefetching) { this.fetchingStart(); }
          try {
            if (!page){ page = this.activePageNumber }
            const isPaged = page && Number.parseInt(page) > 1;
            const api = isPaged ? `${path.API_STARED_JOBS}?page=${page}` : path.API_STARED_JOBS;
            const client = isPaged ? `${path.CLIENT_STARED_JOBS}?page=${page}` : path.CLIENT_STARED_JOBS;
            const response = await fetch(path.API + api, {
              method: 'GET',
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
              }
            }).catch((error) => {
              console.error('Fetching error: ', error);
              throw new Error(error)
            });
            if (response.ok) {
              const data = await response.json()
              if (!isPrefetching) { await this.fetchingStart(); }
              await this.parseFetchingData(data)
              if (this.activated) {
                setTimeout(() => {
                  if (pagenavAction) {
                    scrollTo(this.main, "auto")
                  } else {
                    scrollTo(this.main, "smooth")
                  }
                }, 50)
              } else {
                await scrollTo(this.navbar, "smooth")
              }
              setTimeout(() => {
                this.fetchingDone()
                this.busy = false
                resolve("ok")
              }, 370)
            } else {
              throw new Error("Bad response from server at fetching jobs data ...")
            }
          } catch (err) {
            this.fetchingDone()
            this.busy = false
            reject(err)
          }
        })
      }
    },
    parseFetchingData(data) {
      if (isObject(data)){
        console.log(data)
        if (isObject(data.list)) {
          this.$store.commit('parseJobList', data.list)
        }
        if (isObject(data.pagenav)) {
          this.$store.commit('parsePagenav', data.pagenav)
        }
        console.log("JOB_LIST => ", this.job_list)
        console.log("PAGENAV => ", this.pagenav)
      }
    }
  },
  beforeMount() {
    setTimeout(() => this.getJobsData(true), 50)
  },
  mounted() {
    this.tabs = document.getElementById('tabs')
    this.navbar = document.getElementById('navbar')
    this.main = document.getElementById('main')
    setTimeout(() => this.activated = true, 500)
  },
}
</script>

<style scoped>

</style>
