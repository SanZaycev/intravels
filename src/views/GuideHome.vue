<template>
  <WorkyMsg :w__msg="w__msg" @close="w__msg = null"></WorkyMsg>

  <div class="container pb__30">
    <div class="u-box pt__30 pb__15"><h1 class="e__h1">Найдите лучшего исполнителя для ваших задач</h1></div>
    <div class="u-box">
      <div class="flex-box">
        <div class="col-md-4 p__10">
          <div class="e__icn"><span class="icn icn__plans"></span></div>
          <div class="e__title"><h2>Создайте объявление о работе</h2></div>
          <div class="e__text"><p>Наше пошаговое руководство позволяет быстро и легко разместить объявление о вакансии.</p></div>
        </div>
        <div class="col-md-4 p__10">
          <div class="e__icn"><span class="icn icn__resp"></span></div>
          <div class="e__title"><h2>Выберите свой тип объявления</h2></div>
          <div class="e__text"><p>У нас есть три разных типа размещения вашей вакансии, которые удовлетворят все ваши потребности.</p></div>
        </div>
        <div class="col-md-4 p__10">
          <div class="e__icn"><span class="icn icn__confa"></span></div>
          <div class="e__title"><h2>Управляйте кандидатами</h2></div>
          <div class="e__text"><p>Мы упрощаем вам поиск лучших кандидатов, претендующих на вашу должность.</p></div>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row pb__50">
      <div id="uc" class="col-12">
        <WorkyLoader v-if="fetching" action="EMPLOYER_LANDING_VIEW"></WorkyLoader>
        <div v-if="job_list.length" class="u-box pt__15" data-fetch="3">
          <div class="job__total">
            <div class="i-box"><span class="bold">{{ pagenav.count }}</span><span class="txt __13 pl__5">{{ naturalTotalText }}</span></div>
          </div>
          <ul id="jl" class="job-list">
            <li class="job" v-for="j in job_list" :key="j.pk" :data-pk="j.pk">
              <div class="box">
                <div v-if="j.h1" class="job__title">
                  <router-link
                    :to="j.url"
                    :title="'Перейти к вакансии ' + j.h1"
                    @click.prevent="fetchJobDetail(j.pk)"
                  ><h3>{{ j.h1 }}</h3></router-link>
                </div>
                <span v-if="j.natural_date" class="job__date">{{ j.natural_date }}</span>
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
        <div v-else class="u-box pt__35">
          <div class="card bg-gray flex-center">
            <div class="card__title"><h4>Сейчас тут пусто, создайте первую вакансию</h4></div>
            <span class="icn icn__empty_jobs"></span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import WorkyMsg from "../components/WorkyMsg.vue";
import WorkyLoader from "../components/WorkyLoader.vue";
import AppPagenav from "../components/AppPagenav.vue";
import {isObject} from "../services/getters.js";
import {deleteObject, mergeArraysByPk, parseObjects} from "../services/setters.js";

export default {
  name: "GuideHome",
  data(){
    return {
      csrf: null,
      fetching: true,
      content: null,
      w__msg: {
        type: "info",
        text: "Backend Text..."
      }
    }
  },
  inject: [
    'user',
    'login',
    'actions',
    'views',
    'location',
    'api_worky',
    'professions',
    'job',
    'job_list',
    'pagenav',
    'events',
  ],
  components: {
    WorkyMsg,
    WorkyLoader,
    AppPagenav,
  },
  mounted(){
    this.content = document.getElementById('uc');
    document.addEventListener('fetchingStart', this.fetchingStart, false);
    document.addEventListener('fetchingDone', this.fetchingDone, false);
    document.addEventListener('cleanjob', this.cleanJob, false);
    console.log("Employer inject API_WORKY => ", this.api_worky)
    console.log("Employer inject JOB => ", this.job)
    console.log("Employer inject JOB_LIST => ", this.job_list)
    console.log("Employer inject PAGENAV => ", this.pagenav)
    this.fetchingDone();
  },
  computed: {
    isJobView(){
      if (isObject(this.job) && this.job.pk){ return true }
      return false
    },
    canFetchPagenav(){
      if (isObject(this.pagenav) && this.pagenav.api && this.pagenav.api.base && this.pagenav.active){ return true }
      return false
    },
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
  },
  methods: {
    fetchingStart(){
      console.log('fetching start')
      this.fetching = true;
    },
    fetchingDone(){
      console.log('fetching done')
      this.fetching = false;
    },
    apiUrl(){
      return "/api/v1/employer/"
    },
    clientUrl(){
      return "/employer/"
    },
    async parseFetchingData(data){
      if (typeof data.job_list === "object"){
        this.job_list.splice(0, this.job_list.length)
        mergeArraysByPk(this.job_list, data.job_list);
      }
      if (isObject(data.pagenav)){
        parseObjects(this.pagenav, data.pagenav);
      }
      if (isObject(data.job)){
        console.log("JOB_LIST JOB ========>", this.job)
        parseObjects(this.job, data.job);
      }
    },
    cleanJob(){
      deleteObject(this.job);
    },
    onPageChange(page){
      if (this.canFetchPagenav){
        this.fetchJobList(page).then(() => {
          console.log('onPageChanged!');
        });
      }
    },
    async fetchJobList(page = 1){
      this.fetchingStart();
      //setTimeout(()=>utils.scrollTo(this.content), 50);

      setTimeout(async () => {
        try {
          // if (!page){ page = this.activePageNumber; }
          const api_url = this.apiUrl()
          const url = this.clientUrl()
          const api_search_uri = this.apiSearchUri();
          const search_uri = this.clientSearchUri();

          const api = `${api_url}?page=${page}`;
          const client = `${url}?page=${page}`;

          this.pagenav.api.active = api
          this.pagenav.client.active = page > 1 ? client : `${url}${search_uri}`

          const response = await fetch(this.pagenav.api.active, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
          }).catch((error) => {
            console.error('Fetching error:', error.message);
            throw new Error(error.message)
          });
          if (response.ok){
            const data = await response.json();
            this.parseFetchingData(data).then(() => {
              this.fetchingDone();
            });
          }
          else { throw new Error("Данные вакансий не были предоставлены") }
        }
        catch (err){
          console.log(err);
          this.worky__msg = {
            type: "danger",
            text: err.message
          }
          this.fetchingDone();
        }
      }, 100);
    },
  },
}
</script>

<style scoped>

</style>
