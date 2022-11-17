<template>
<div class="app-content">
  <AppAlerts/>

  <nav class="navbar" id="navbar">
    <div class="container">
      <div class="w-logo__nav">
        <div class="navbar-brand">
          <a href="/" class="navbar-logo">
            <div class="w-logo">
              <div class="w-logo__image"><svg viewBox="0 0 512 512" height="40" width="40"><g><path d="m512 256c0-26.132-3.926-51.345-11.202-75.093l-53.494-94.998c-46.89-52.7-115.214-85.909-191.304-85.909l-128 269.709 128 242.291c141.385 0 256-114.616 256-256z" fill="#4175df"/><path d="m256 0c-141.385 0-256 114.615-256 256 0 26.132 3.926 51.344 11.202 75.093l53.494 94.998c46.89 52.7 115.214 85.909 191.304 85.909z" fill="#4086f4"/><path d="m134.024 208.27-122.822 122.823c10.904 35.591 29.36 67.874 53.494 94.998l164.787-164.788z" fill="#bfd7fb"/><path d="m447.304 85.909-143.574 143.575-42.426-42.426c-1.706-1.706-3.48-3.302-5.303-4.809l-36.876 36.876 36.875 110.627c29.434 24.324 73.226 22.728 100.763-4.809l144.036-144.036c-10.905-35.59-29.361-67.873-53.495-94.998z" fill="#e3e7ea"/><path d="m256 182.248c-29.434-24.324-73.226-22.728-100.763 4.809l-21.213 21.213 116.673 116.673c1.706 1.706 3.48 3.302 5.303 4.809z" fill="#f1f3f4"/></g></svg></div>
              <div class="w-logo__url"><span class="w-logo__h1">In</span><span class="w-logo__h2">travels</span></div>
            </div>
          </a>
          <a class="navbar-area" v-if="isNavArea" :href="navAreaURL" @click.prevent="onNavAreaClick"><span class="w-area__text">{{ navAreaTitle }}</span></a>
        </div>
        <div class="navbar-menu" id="navbar-menu" :class="mainFetchingClass">
          <div class="navbar-end">
            <div class="navbar-item">

              <div class="auth-box" v-if="isAuthenticated" :open="isUsernav">
                <div class="navbar-user" @click="toggleUsernav">
                  <span class="u-nav__chevron"><svg width="13" height="30" viewBox="0 0 1024 1024" focusable="false" fill="#a8a8a8"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
                  <div class="navbar-username">{{ fullname }}</div>
                  <div class="avatar navbar-avatar"><img :src="avatar"></div>
                </div>
                <nav class="u-nav">
                  <ul class="u-nav__list">
                    <span class="hr"></span>
                    <li class="u-nav__item mt__10"><router-link :to="{name: 'Profile'}" @click.prevent="onClickNavLink" class="u-nav__link"><span class="u-nav__text">Профиль</span><span class="u-nav__icn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024" focusable="false"><path d="M480 124q25 0 48 5.5t44 17.5q20 12 36.5 27.5T638 211q12 20 17.5 41t5.5 44q0 24-5.5 45T638 382t-28.5 36-37.5 28h-1q-21 12-43.5 17.5T480 469t-47.5-5.5T389 446t-37.5-27.5T323 382q-12-20-18-41t-6-44q0-24 6-45t18-41q12-21 28-36.5t37-27.5q22-11 44.5-17t47.5-6zm0 497q42 0 82.5 8t79.5 24 73.5 37.5T778 739q29 28 51 60.5t39 69.5q8 19 14 38t10 38q1 5 2 9.5t1 9.5H65q0-5 1-9.5t2-9.5q4-19 10-38t14-38q17-37 39.5-69.5T182 739q29-27 63-48.5t73-37.5 79.5-24 82.5-8zm0-557q-33 0-63 8t-58 23q-28 16-50 37t-38 48-24 56-8 60q0 32 8 61t24 56q17 27 39 48.5t49 36.5q28 16 58 23.5t63 7.5 63-7.5 58-23.5 50-37 38-48 24-56 8-60q0-32-8-61t-24-56-38.5-48.5T601 95q-28-16-58-23.5T480 64zm0 497q-48 0-94.5 9T295 597q-45 18-83.5 43T141 696q-33 31-59 68.5T38 845q-19 43-28.5 87.5T0 1024h960q0-46-9.5-91T923 845q-19-43-45-80t-58-69q-33-31-72-56t-83-43-90.5-27-94.5-9z"></path></svg></span></router-link></li>
                    <li class="u-nav__item"><router-link :to="{name: 'Stars'}" class="u-nav__link" @click.prevent="onClickNavLink"><span class="u-nav__text">Избранное</span><span class="u-nav__icn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 900" focusable="false"><path d="M718 188q11 0 22 1.5t22 4.5q16 4 30.5 12t28.5 19q15 13 27 28t21 34h1l3 7q13 27 20 59.5t7 68.5v3q0 15-4.5 32.5T881 496q-11 24-26 47.5T821 590q-39 48-85.5 94T636 774q-46 38-85 67.5T480 891q-31-20-70-49.5T325 774h-1q-52-43-98.5-89T139 590q-19-23-34-46.5T79 496q-10-21-14.5-38.5T60 425v-3q0-37 7-69.5T87 293h1q0-2 1-3.5t2-3.5q10-18 21.5-33t26.5-28q14-11 28.5-19t30.5-12q11-3 22.5-4.5T242 188q24 0 45.5 7t43.5 21q15 9 28 21t24 26q12 15 22.5 32.5T425 333l56 129 54-129q9-20 19-37t22-32q11-14 24.5-26t28.5-22h1q21-14 43-21t45-7zm0-60q-32 0-62 9.5T597 165q-38 25-67.5 61T480 309q-21-47-50-83t-66-61q-29-18-59.5-27.5T242 128q-14 0-29 2t-30 6q-22 6-43 16.5T100 179t-34.5 36T38 259q-1 1-1.5 2t-.5 2l-2 2v1q-17 34-25.5 73T0 422v2q0 22 6 46t19 51q12 27 29 54t39 53q42 52 90.5 100T286 820q49 41 90 71.5t74 51.5q14 9 21.5 13.5t8.5 4.5q1 0 8.5-4.5T510 944q33-22 74-53t90-70q55-46 103.5-94t89.5-99q22-26 39-52.5t29-53.5q13-27 19-51.5t6-46.5v-2q-1-44-9-83t-24-72l-4-8q-13-24-28.5-43.5T860 180t-39.5-27-43.5-17q-15-4-30-6t-29-2z"></path></svg></span></router-link></li>
                    <li class="u-nav__item"><router-link :to="{name: 'ProfileSettings'}" class="u-nav__link" @click.prevent="onClickNavLink"><span class="u-nav__text">Настройки</span></router-link></li>
                    <li class="u-nav__item"><div class="u-nav__link" @click="userLogout"><span class="u-nav__text">Выход</span></div></li>
                  </ul>
                </nav>
                <div class="nav-backdrop" @click="onClickNavBackdrop"></div>
              </div>
              <div class="buttons">
                <a v-if="!isAuthenticated" href="/login" class="button is-light" @click.prevent="pushLoginUrl">Вход</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <div class="app__tabs" id="tabs" :class="appModeClass">
    <div class="container">
      <nav class="primary-navigation">
        <ul class="nav-tabs" :class="appModeClass">
          <li class="tab"><a href="/tours/" :class="toursTabClass" @click.prevent="onToursTabClick">Туры</a></li>
          <li class="tab"><a href="/sights/" :class="sightsTabClass" @click.prevent="onSightsTabClick">Достопримечательности</a></li>
          <li class="tab"><a href="/guides/" :class="guidesTabClass" @click.prevent="onGuidesTabClick">Гиды</a></li>
        </ul>
      </nav>
    </div>
  </div>

  <div class="app-notification" :class="boxFetchingClass">
    <AppNotification/>
  </div>

  <BallsLoader/>

  <main :class="mainFetchingClass" id="main" class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <footer id="footer" class="app-footer" :class="boxFetchingClass">
    <AppFooter/>
  </footer>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import routerNames from "./router/names.js";
import AppAlerts from "./components/AppAlerts.vue";
import BallsLoader from "./components/BallsLoader.vue";
import AppNotification from "./components/AppNotification.vue";
import AppFooter from "./components/AppFooter.vue";
import {setToastMessage, scrollTo, setErrorMessage} from "./services/setters.js";
import {isLoggedOut} from "./services/getters.js";
import {testCities2} from "./store/data/tests";

export default {
  components: {
    AppNotification,
    AppAlerts,
    BallsLoader,
    AppFooter,
  },
  data(){
    return {
      busy: false,
      rows: {
        main: null,
        navbar: null,
        tabs: null,
        wtabs: null,
        uc: null,
      },
    }
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated', 'fullname', 'avatar']),
    ...mapGetters('location', ['isNavArea', 'navAreaTitle', 'navAreaURL']),
    ...mapGetters([]),
    ...mapGetters([
      'activeView',
      'mode',
      'appModeClass',
      'isStoreReady',
      'isFetching',
      'isUsernav',
      'toursTabClass',
      'sightsTabClass',
      'guidesTabClass'
    ]),
    boxFetchingClass() {
      return this.isStoreReady ? "" : "box-fetching"
    },
    mainFetchingClass() {
      return this.isFetching || !this.isStoreReady ? "box-fetching" : "loaded"
    },
  },
  methods: {
    ...mapActions('user', ['logout']),
    ...mapActions('pagenav', ['cleanPagenav']),
    ...mapActions('location', ['setAreaText', 'cleanLocationSearch', 'usingLocation']),
    ...mapActions([
      'parseCtx',
      'closeUsernav',
      'toggleUsernav',
      'fetchingTimeout',
      'fetchingStart',
      'fetchingDone',
      'listFetchingStart',
      'listFetchingDone',
      'usingRendering'
    ]),
    isDesktop() {
      return document.documentElement.clientWidth > 992
    },
    onClickNavLink() {
      this.fetchingTimeout(200)
      this.cleanPagenav()
      this.appScrollTo("main")
    },
    onClickNavBackdrop() {
      if (this.isDesktop()) {
        this.closeUsernav()
      }
    },
    onToursTabClick() {
      if (!this.busy){
        this.busy = true;
        this.closeUsernav()
        this.cleanPagenav()
        this.cleanLocationSearch()
        this.usingLocation(true)
        this.$router.push({name: routerNames.Tours}).then(() => {
          this.usingRendering(true)
          setTimeout(() => this.appScrollTo( "navbar"), 50)
          this.busy = false
        });
      }
    },
    onSightsTabClick() {
      if (!this.busy){
        this.busy = true;
        this.closeUsernav()
        this.cleanPagenav()
        this.cleanLocationSearch()
        this.$router.push({name: routerNames.Sights}).then(() => {
          setTimeout(() => this.appScrollTo( "navbar"), 50)
          this.busy = false
        });
      }
    },
    onGuidesTabClick() {
      if (!this.busy){
        this.busy = true;
        this.closeUsernav()
        this.cleanPagenav()
        this.cleanLocationSearch()
        this.$router.push({name: routerNames.Guides}).then(() => {
          setTimeout(() => this.appScrollTo( "navbar"), 50)
          this.busy = false
        });
      }
    },
    onNavAreaClick() {
      if (!this.busy){
        this.busy = true;
        const title = this.navAreaTitle;
        this.closeUsernav()
        this.cleanPagenav()
        this.cleanLocationSearch()
        this.usingLocation(true)
        this.setAreaText(title)
        this.$router.push(this.navAreaURL).then(() => {
          this.usingRendering(true)
          setTimeout(() => this.appScrollTo( "navbar"), 50)
          this.busy = false
        });
      }
    },
    async pushLoginUrl() {
      !isLoggedOut(this.$route.name)
        ? await this.$router.push({ name: routerNames.Login, query: { to: this.$route.path }})
        : await this.$router.replace({ name: 'Login' })
    },
    async userLogout() {
      this.closeUsernav()
      this.fetchingStart()
      try {
        await this.logout()
        await this.pushLoginUrl().then(() => location.reload())
      }
      catch (err){
        setToastMessage(err.message ?? err.toString())
      }
      this.fetchingDone()
    },
    async getCtx() {
      try {
        const data = await this.$api.auth.getCtx()
        this.parseCtx(data)
      } catch (err) {
        setErrorMessage(err)
      }
    },
    appScrollTo(el, behavior="smooth") {
      switch (el) {
        case "main":
          scrollTo(this.rows.main, behavior)
          break;
        case "navbar":
          scrollTo(this.rows.navbar, behavior)
          break;
        case "tabs":
          scrollTo(this.rows.tabs, behavior)
          break;
        case "wtabs":
          scrollTo(this.rows.wtabs, behavior)
          break;
        case "uc":
          scrollTo(this.rows.uc, behavior)
          break;
        default:
          scrollTo(this.rows.navbar, behavior)
      }
    },
    mapCities() {
      for (let i = 0; i < testCities2.length; i++){
        testCities2[i].pk = i + 1
      }
      console.log("__CITIES__:", testCities2)
    },
  },
  beforeMount() {
    this.getCtx()
  },
  mounted() {
    this.fetchingTimeout(300)
    this.rows.main = document.getElementById('main')
    this.rows.navbar = document.getElementById('navbar')
    this.rows.tabs = document.getElementById('tabs')
    this.rows.wtabs = document.getElementById('wtabs')
    this.rows.uc = document.getElementById('uc')
    this.mapCities()
  },
  provide() {
    return {
      appScrollTo: this.appScrollTo,
      isDesktop: this.isDesktop
    }
  }
}
</script>

<style>
.box-fetching {
  opacity: 0;
}
.flex-norm{
  flex: 0 1 auto;
  width: auto;
}
.slide-enter-active{
  animation: slideIn 0.3s;
}
.slide-leave-active{
  animation: slideOut 0.3s;
}
@keyframes slideIn{
  from{transform: rotateY(90deg);}
  to{transform: rotateY(0deg);}
}
@keyframes slideOut{
  from{transform: rotateY(0deg);}
  to{transform: rotateY(90deg);}
}
</style>
