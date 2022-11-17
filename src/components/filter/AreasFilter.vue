<template>
  <div class="filter__area col-12 col-lg-6">
    <div class="w-box pl__10"><h4 class="filter__title">Где</h4></div>
    <div class="filter-box">
      <div id="areas" class="filter__input" ref="box">
        <span class="filter__icn"><span class="icn__pin"></span></span>
        <input type="text" class="filter__current" name="area" placeholder="Введите город, регион или страну" autocomplete="off"
          ref="input"
          v-model="input_value"
          @input="onInput"
          @focus="setInputFocus">
        <button v-if="input_value.length" class="filter__clean" @click="onInputClean"><span class="icn icn__close"></span></button>
        <div class="areas__results" ref="results">
          <ul class="areas-list" ref="areas" v-if="areas.length">
            <li class="area" v-for="_area in areas" :data-pk="_area.pk" :key="_area.pk">
              <a class="area-link" :href="_area.url" @click.prevent="onAreaClick(_area)"><div class="area-title">{{ _area.title }}</div><div class="area-desc">{{ _area.desc }}</div></a>
            </li>
          </ul>
          <ul class="areas-list capitals" ref="capitals" v-if="capitals.length">
            <li class="area" v-for="_area in capitals" :data-pk="_area.pk" :key="_area.pk">
              <a class="area-link" :href="_area.url" @click.prevent="onAreaClick(_area)"><div class="area-title">{{ _area.title }}</div></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {areas} from "../../store/data/areas.js";
import {path} from "../../core/state.js";
import {absoluteURI, capitals} from "../../services/location.js";
import {setToastMessage, translit} from "../../services/setters.js";
import {isEmptyString, isObject} from "../../services/getters.js";
import routerNames from "../../router/names";


export default {
  name: "AreasFilter",
  data() {
    return {
      busy: false,
      searching: false,
      focused: false,
      data: areas,
      input_value: "",
      areas: [],
      capitals: [],
      actions: {
        MERGE_AREAS: "MERGE_AREAS",
        SET_COUNTRIES: "SET_COUNTRIES"
      }
    }
  },
  emits: ['onareaselect'],
  inject: ['appScrollTo'],
  watch: {
    $route(to, from) {
      this.cleanResults()
      this.setInputValue(to)
    }
  },
  beforeMount() {
    document.addEventListener("keydown", this.navigationListener, false);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.navigationListener, false);
  },
  mounted() {
    this.setInputValue(this.$route)
  },
  computed: {
    ...mapGetters('location', [
      'childrenAreas',
      'catApiURI',
      'catClientURI',
      'areaText',
      'areaSlug',
      'countrySlug',
      'searchClientURI',
      'searchApiURI'
    ]),
    isAreas() {
      return this.searching && (this.areas.length || this.capitals.length)
    },
  },
  methods: {
    ...mapActions(['listFetchingStart', 'listFetchingDone']),
    ...mapActions('location', ['setAreaBySlug']),
    fetchingStart() {
      this.busy = true;
      this.listFetchingStart();
      this.appScrollTo( "main")
      if (this.$refs.input) { this.$refs.input.blur() }
      if (this.$refs.box){ this.$refs.box.removeAttribute('open') }
    },
    fetchingDone() {
      this.listFetchingDone();
      this.busy = false;
    },
    setInputValue(route) {
      this.input_value = route.name !== routerNames.Worky ? this.areaText : ""
    },
    clientURI(url) {
      return !isEmptyString(this.searchClientURI) ? url + this.searchClientURI : url
    },
    apiURI(api_url) {
      return !isEmptyString(this.searchApiURI) ? api_url + this.searchApiURI : api_url
    },
    cleanAreas() {
      this.areas.splice(0, this.areas.length);
    },
    cleanCapitals() {
      this.capitals.splice(0, this.capitals.length);
    },
    cleanResults() {
      this.cleanAreas()
      this.cleanCapitals()
      this.searching = false;
    },
    setAreaURL(area) {
      area.url = absoluteURI({
        base: path.CLIENT_TOURS,
        area: area.uri,
        profy: this.catClientURI,
      });
      area.api_url = absoluteURI({
        base: path.API_TOURS,
        area: area.api_uri,
        profy: this.catApiURI,
      });
    },
    setInputText(obj) {
      if (typeof obj.text === "string"){
        this.input_value = obj.text;
      }
      else if (typeof obj.title === "string"){
        this.input_value = obj.title;
      }
    },
    async parseNewAreas(action) {
      console.log("parseNewAreas =======>")
      switch (action) {
        case this.actions.MERGE_AREAS:
          await this.setAreas()
          await this.setCapitals()
          break;
        case this.actions.SET_COUNTRIES:
          this.areas = await capitals.countries()
          await this.setCapitals("initial")
          break;
        default: break;
      }
      let hasArea = false
      for (let i = 0; i < this.areas.length; i++){
        if (isObject(this.areas[i])) {
          this.setAreaURL(this.areas[i])
          hasArea = true
        }
      }
      for (let i = 0; i < this.capitals.length; i++){
        if (isObject(this.capitals[i])) {
          this.setAreaURL(this.capitals[i])
          hasArea = true
        }
      }
      if (hasArea) {
        this.searching = true;
        this.$refs.box.setAttribute("open", "")
      }
      console.log("parsed areas =======>", this.areas)
      console.log("parsed capitals =======>", this.capitals)
      return Promise.resolve()
    },
    async setAreas() {
      if (Array.isArray(this.areas) && Array.isArray(this.childrenAreas)){
        for (let i = 0; i < this.childrenAreas.length; i++) {
          if (!this.areas.find(obj => obj.slug === this.childrenAreas[i].slug)){
            this.areas.push({ ...this.childrenAreas[i] })
          }
        }
      }
      return Promise.resolve()
    },
    async setCapitals(slug = this.countrySlug) {
      console.log("country slug: ", slug)
      switch (slug) {
        case "initial":
          this.capitals = capitals.initial()
          break;
        case "rossiya":
          this.capitals = capitals.ru()
          break;
        case "ukraina":
          this.capitals = capitals.ua()
          break;
        case "belarus":
          this.capitals = capitals.bel()
          break;
        case "kazahstan":
          this.capitals = capitals.kz()
          break;
        case "kyrgyzstan":
          this.capitals = capitals.kgz()
          break;
        case "latvia":
          this.capitals = capitals.lat()
          break;
        case "litva":
          this.capitals = capitals.lit()
          break;
        case "estonia":
          this.capitals = capitals.est()
          break;
        case "moldova":
          this.capitals = capitals.md()
          break;
        default:
          this.capitals = capitals.initial()
      }
      return Promise.resolve()
    },
    onInputClean() {
      setTimeout(() => {
        this.input_value = "";
        this.cleanResults();
        if (this.$refs.box){ this.$refs.box.removeAttribute('open') }
        if (this.$refs.input){ this.$refs.input.focus() }
      }, 100)
    },
    onInput() {
      this.input_value = translit(this.input_value);
      if (!this.busy && this.input_value.length > 1) {
        this.busy = true;
        this.cleanResults()
        this.search().then(() => this.parseNewAreas(this.actions.MERGE_AREAS).then(() => this.busy = false));
      } else if (this.$refs.box) {
        this.$refs.box.removeAttribute('open')
      }
    },
    setInputFocus() {
      if (this.input_value === "") {
        this.parseNewAreas(this.actions.SET_COUNTRIES)
      }
      const focusListener = (e) => {
        if (this.$refs.input) {
          const target = e.target;
          if (!this.$refs.input.contains(target)) {
            if (!this.$refs.results || !this.$refs.results.contains(target)) {
              this.input_value = this.areaText
            }
            if (this.$refs.box) {
              this.$refs.box.removeAttribute('open')
            }
            this.cleanResults();
            document.removeEventListener('click', focusListener, false);
          }
        } else {
          document.removeEventListener('click', focusListener, false);
        }
      }
      if (!this.busy && this.input_value.length) {
        this.busy = true
        this.cleanResults()
        this.search().then(() => this.parseNewAreas(this.actions.MERGE_AREAS).then(() => this.busy = false));
      }
      document.addEventListener('click', focusListener, false);
    },
    async onAreaClick(obj) {
      if (!this.busy && obj.slug !== this.areaSlug){
        try {
          await this.selectArea(obj)
        } catch (err) {
          setToastMessage(err.message ?? err.toString())
          this.fetchingDone();
        }
      }
    },
    async selectArea(obj){
      console.log("selectArea obj: ", obj)
      return new Promise(async (resolve, reject) => {
        try {
          this.fetchingStart();
          this.setInputText(obj);
          if (isEmptyString(obj.api_url)) {
            reject("Api url is empty on AreasFilter")
          }
          const api = this.apiURI(obj.api_url);
          const client = this.clientURI(obj.url);
          console.log("api: ", api)
          console.log("client: ", client)
          switch (true) {
            case isEmptyString(api):
              reject("Area api is empty on AreasFilter")
              break;
            case isEmptyString(client):
              reject("Area client is empty on AreasFilter")
              break;
            default:
              this.setAreaBySlug(obj.slug);
              const data = await this.$api.tours.list(api)
              await this.$router.push(client)
              this.$emit('onareaselect', data)
              this.fetchingDone();
              resolve(true)
          }
        } catch (err) {
          reject(err)
        }
      })
    },
    async search(){
      let regex = new RegExp(this.input_value.toLowerCase());
      const area = { country: null, state: null, city: null }
      for (let i = 0; i < this.data.length; i++){
        const country = this.data[i];
        if (regex.test(country.title.toLowerCase())){
          area.country = {
            is_country: true,
            pk: country.pk,
            title: country.title,
            longtitle: country.longtitle,
            slug: country.slug,
            uri: `v-strane-${country.slug}/`,
            api_uri: `country/${country.pk}/`,
            url: `${path.CLIENT_TOURS}v-strane-${country.slug}/`,
            api_url: `${path.API_TOURS}country/${country.pk}/`,
            desc: country.desc,
            text: country.title,
            coords: country.coords,
          }
          if (!this.areas.find(obj => obj.pk === area.country.pk)){ this.areas.push(area.country); }
        }
        for (let s = 0; s < country.areas.length; s++){
          const state = country.areas[s];
          if (regex.test(state.title.toLowerCase())){
            area.state = {
              is_state: true,
              pk: state.pk,
              title: state.title,
              longtitle: state.longtitle,
              slug: state.slug,
              uri: `v-regione-${state.slug}/`,
              api_uri: `state/${state.pk}/`,
              url: `${path.CLIENT_TOURS}v-regione-${state.slug}/`,
              api_url: `${path.API_TOURS}state/${state.pk}/`,
              desc: state.desc,
              text: state.title + ', ' + country.title,
              coords: state.coords,
            }
            if (!this.areas.find(obj => obj.pk === area.state.pk)){ this.areas.push(area.state); }
          }
          for (let c = 0; c < state.areas.length; c++){
            const city = state.areas[c];
            if (regex.test(city.title.toLowerCase())){
              area.city = {
                is_city: true,
                pk: city.pk,
                title: city.title,
                longtitle: city.longtitle,
                slug: city.slug,
                uri: `v-gorode-${city.slug}/`,
                api_uri: `city/${city.pk}/`,
                url: `${path.CLIENT_TOURS}v-gorode-${city.slug}/`,
                api_url: `${path.API_TOURS}city/${city.pk}/`,
                desc: city.desc,
                text: city.title + ', ' + state.title,
                coords: city.coords,
              }
              if (!this.areas.find(obj => obj.pk === area.city.pk)){ this.areas.push(area.city); }
            }
          }
        }
      }
    },
    navigationListener(event){
      event = event || window.Event;
      if (this.areas.length && this.searching){
        let is_active = false;
        const _areas =  this.$refs.areas ? this.$refs.areas.children ?? null : null
        if (!_areas) { return }
        switch(event.keyCode){
          case 13:
            for (let i = 0; i < _areas.length; i++){
              const row = _areas[i];
              if (row.classList.contains('active')){
                row.children[0].click();
                break;
              }
            }
            break;
          case 40:
            event.preventDefault();
            for (let i = 0; i < _areas.length; i++){
              const row = _areas[i];
              if (!is_active && row.classList.contains('active')){
                is_active = true;
                if (row.nextElementSibling){
                  row.classList.remove('active');
                  row.nextElementSibling.classList.add('active');
                }
                break;
              }
            }
            if(!is_active && _areas && _areas.length){
              _areas[0].classList.add('active');
            }
            break;
          case 38:
            event.preventDefault();
            for (let i = 0; i < _areas.length; i++){
              const row = _areas[i];
              if (!is_active && row.classList.contains('active')){
                is_active = true;
                if (row.previousElementSibling){
                  row.classList.remove('active');
                  row.previousElementSibling.classList.add('active');
                }
                break;
              }
            }
            break;
          default: break;
        }
      }
    }
  },
}
</script>

<style scoped>

</style>
