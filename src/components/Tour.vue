<template>
<div v-if="isJob" class="w-job__container">
  <div class="w-banner" :style="bannerCss">
    <img v-if="job.banner_url" :src="job.banner_url" :alt="job.employer + ' - баннер'" class="bg-image">
    <div v-if="loaded" class="w-btn__link"><div class="w-nav__link" @click="onSwitchToList">Назад</div></div>
    <div v-if="loaded" class="w-share">
      <details class="w-share__details" ref="share">
        <summary class="w-link__share"><span class="w-text">Поделиться</span><span class="icn icn__share"></span></summary>
        <div class="w-box__share">
          <ul class="w-list">
            <li><button class="w-text">Отправить на е-почту</button><span class="icn icn__email"></span></li>
            <li><button class="w-text">Сохранить в Telegram</button><span class="icn icn__tg"></span></li>
            <li><button class="w-text">Сохранить ВКонтакте</button><span class="icn icn__vk"></span></li>
          </ul>
          <div class="w-backdrop" @click="$refs.share.removeAttribute('open')"></div>
        </div>
      </details>
    </div>
  </div>
  <div class="w-job" :class="fetchingClass">
    <div class="w-job__title"><h1>{{ job.h1 }}</h1></div>
    <div class="w-box">
      <div class="w-job__employer pb__15">
          <div v-if="job.employer_pk && job.employer" class="i-box pr__10">
            <router-link class="employer__name"
              :to="job.employer_url"
              :title="'Все вакансии в ' + job.employer"
            ><h2 class="w-url">{{ job.employer }}</h2></router-link>
            <div v-if="job.employer_accepted" class="employer__accepted"><span class="icn icn__check"></span><span class="employer__text">Подтверждён</span></div>
          </div>
        <span v-if="job.logo_url" class="w-job__logo"><img :src="job.logo_url" :alt="job.employer + ' - логотип'"></span>
      </div>
    </div>
    <div class="w-job__info">
      <div class="flex__ac pb__10">
        <span v-if="job.country" class="w-job__crumb bold"><h3>{{ job.country }}</h3></span>
        <span v-if="job.country" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
        <span v-if="job.state" class="w-job__crumb"><h3>{{ job.state }}</h3></span>
        <span v-if="job.state" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
        <span v-if="job.city" class="w-job__crumb"><h3>{{ job.city }}</h3></span>
      </div>
      <div class="flex__ac pb__20">
        <span v-if="job.profy" class="w-job__crumb bold"><h3>{{ job.profy }}</h3></span>
        <span v-if="job.profy" class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1024 1024"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
        <span v-if="job.subprofy" class="w-job__crumb"><h3>{{ job.subprofy }}</h3></span>
      </div>
      <div v-if="job.freelance" class="w- pb__15"><div class="w-flag">Удалённая работа</div></div>
      <div class="flex__ac pb__15">
        <div class="w-job__salary" v-if="job.salary">
          <span class="num">{{ job.salary }}<span class="currency">{{ job.currency_symbol }}</span></span>
        </div>
        <div class="w-job__type" v-if="job.work_type">
          <span>Вид занятости: <span class="l_txt">{{ job.work_type }}</span></span>
        </div>
      </div>
      <div class="flex__ac pb__25">
        <span v-if="job.natural_date" class="w-job__date">Опубликовано {{ job.natural_date }}</span>
      </div>
      <div class="flex__ac pb__20 w-actions">
        <div class="i-box"><button class="w-action w__star" @click="star" :class="staredClass"><span class="icn icn__star"></span></button></div>
        <div class="i-box"><button class="w-action w__apply w-apply" @click="reply" :class="repliedClass"><span class="icn icn__reply"></span></button></div>
      </div>
    </div>
    <TourContent :description="job.description" :content="job.content"/>
    <div v-if="job.skills && job.skills.length" class="w-tags">
      <div class="w-title__info"><h4>Ключевые навыки</h4></div>
      <div v-for="skill in job.skills" :key="skill.pk" class="w-tag"><div class="text">{{ skill.title }}</div></div>
    </div>
    <div class="w-contacts">
      <div class="w-title__info"><h4>Контактная информация</h4></div>
      <div v-if="isAuthenticated" class="w-body">
        <div class="pb__10"><p>{{ job.employer }}</p></div>
        <div v-if="job.employer_phone" class="i-row" title="Телефон"><span class="icn icn__phone"></span><span class="w-text">+{{ job.employer_code }}&nbsp;{{ job.employer_phone }}</span></div>
        <div v-if="job.employer_tg" class="i-row" title="Телеграм"><span class="icn icn__tg"></span><a class="w-text" rel="nofollow" :href="job.employer_tg">{{ job.employer_tg }}</a></div>
        <div v-if="job.employer_email" class="i-row" title="Email"><span class="icn icn__email"></span><a class="w-text" rel="nofollow" :href="'mailto:' + job.employer_email">{{ job.employer_email }}</a></div>
      </div>
      <div v-else class="w-body">
        <button class="w-link">Показать</button>
      </div>
    </div>
  </div>
  <div class="w-footer bg-white" :class="fetchingClass">
    <div class="w-more bg-white"><span class="text">Будьте осторожны, не указывайте данные своего банка или кредитной карты при приеме на работу. Узнайте, как защитить себя</span><router-link to="/rules" class="text">здесь</router-link></div>
    <details ref="claim">
      <summary class="i_box bg-white pt__10 pb__10"><span class="text">Сообщить об этом объявлении</span><span class="svg"><svg class="svg-chevron" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 1024 1024" focusable="false" fill="#a8a8a8"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span></summary>
      <div class="w-form col-12 col-lg-7">
        <div class="form-control">
          <label for="email">Ваш адрес электронной почты</label>
          <input id="email" type="text" class="w-input">
        </div>
        <div class="form-control">
          <label for="reason">Причина сообщения</label>
          <select class="w-select" placeholder="Выберите причину" id="reason"><option value="">Выберите причину</option><option value="1">Объявление не работает, я не могу откликнуться!</option><option value="2">Мошенничество</option><option value="3">Объявление размещено в не верной категории</option><option value="4">Оскорбительно / Вводит в заблуждение</option><option value="5">Другая</option></select>
        </div>
        <div class="form-control">
          <label for="comment">Дополнительные комментарии</label>
          <textarea name="comment" id="comment" cols="30" rows="10"></textarea>
        </div>
        <div class="form-control">
          <button class="w-btn whitegreen" @click="$refs.claim.removeAttribute('open')">Отмена</button>
          <button class="w-btn worky">Сообщить</button>
        </div>
      </div>
    </details>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {path} from "../core/state.js";
import TourContent from "../components/TourContent.vue";
import {setErrorMessage, setToastMessage} from "../services/setters.js";
import {isEmptyString, isObject, isTypeUndefined} from "../services/getters.js";


export default {
  name: "Tour",
  data(){
    return {
      busy: false,
      loaded: false,
    }
  },
  components: {
    TourContent,
  },
  emits: ['switchlist'],
  computed: {
    ...mapGetters("jobs", [
        "job",
        "jobApiURL",
        "isReplied",
        "staredClass",
        "repliedClass",
    ]),
    ...mapGetters("user", ["isAuthenticated"]),
    ...mapGetters(['isStoreReady']),
    bannerCss() {
      return this.job.banner_url ? { 'height': '230px' } : { 'height': '58px', 'margin-bottom': '15px' }
    },
    isJob() {
      return isObject(this.job) && this.job.pk
    },
    fetchingClass() {
      return !this.loaded ? "fetching" : ""
    }
  },
  methods: {
    ...mapActions("jobs", ["parseCredentials", "starJob", "replyJob"]),
    async setCredentials(pk) {
      if (!isTypeUndefined(pk) && Number.parseInt(pk) && !this.isStoreReady) {
        const data = await this.$api.jobs.credentials(`${path.API_JOBS}credentials/${pk}/`)
        this.parseCredentials(data)
      }
    },
    async onSwitchToList() {
      await this.$router.push(this.$ssr.jobsListClientURI())
      this.$emit('switchlist')
    },
    async star() {
      if (!this.busy && !isEmptyString(this.jobApiURL)) {
        try {
          this.busy = true
          const data = await this.starJob(this.jobApiURL)
          if (isObject(data) && data.message) {
            setToastMessage(data.message, data.condition)
          }
        } catch (err) {
          setErrorMessage(err)
        }
        this.busy = false
      }
    },
    async reply() {
      if (!this.busy) {
        if (this.isReplied) {
          return setToastMessage("Вы уже откликнулись на вакансию «"+ this.job.h1 + "»", "w-info")
        }
        try {
          const data = await this.replyJob(this.jobApiURL)
          if (isObject(data)) {
            setToastMessage(data.message ?? data.toString(), data.condition)
          }
        } catch (err) {
          setErrorMessage(err)
        }
        this.busy = false
      }
    },
  },
  async mounted(){
    try {
      await this.setCredentials(this.$route.params.job)
      this.loaded = true
    } catch (err) {
      setErrorMessage(err)
    }
  },
  unmounted() {
    this.loaded = false
  }
}
</script>

<style scoped>

</style>
