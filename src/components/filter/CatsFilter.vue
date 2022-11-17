<template>
  <div class="filter__cat col-12 col-lg-6">
    <div class="w-box pl__10"><h4 class="filter__title">Кто</h4></div>
    <details class="filter-box" id="catSelect" ref="cat_select" @click="onClickCatSelect">
      <summary class="w-type">
        <div class="filter__label">
          <span class="filter__icn" :class="catIcon"></span>
          <span class="filter__current">{{ catText }}</span>
          <span class="filter__chevron"><svg class="svg-chevron" xmlns="http://www.w3.org/2000/svg" width="15" height="42" viewBox="0 0 1024 1024" focusable="false" fill="#a8a8a8"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
        </div>
      </summary>
      <div class="cat-nav" ref="cat_nav">
        <ul class="cat-list" ref="cat_list">
          <li v-for="cat in categories" :key="cat.pk" class="cat-item" :data-pk="cat.pk" :data-slug="cat.slug">
            <details>
              <summary class="w-type">
                <div :title="cat.longtitle" class="cat-box">
                  <span class="icn" :class="cat.icon"></span>
                  <span class="cat-text">{{ cat.title }}</span>
                </div>
              </summary>
              <ul class="subcat-list">
                <li class="subcat-item" :data-slug="cat.slug" data-cat="true" data-checked="false" :title="'Все в' + cat.title">
                  <a :href="cat.url" class="subcat-box"><span class="cat-text">Все в {{ cat.title }}</span></a>
                  <span class="item-count">{{ cat.count }}</span>
                </li>
                <li v-for="subcat in cat.sub_list" class="subcat-item" :key="subcat.pk" :data-pk="subcat.pk" :data-slug="subcat.slug" data-checked="false" :title="subcat.title">
                  <a :href="subcat.url" class="subcat-box"><span class="cat-text">{{ subcat.title }}</span></a>
                  <span class="item-count">{{ subcat.count }}</span>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {categories} from "../../store/data/categories.js";
import {path} from "../../core/state.js";
import routerNames from "../../router/names.js";
import {absoluteURI} from "../../services/location.js";
import {setToastMessage} from "../../services/setters.js";
import {isEmptyString} from "../../services/getters.js";


export default {
  name: "CatFilter",
  data() {
    return {
      activated: false,
      busy: false,
      isOpenMenu: false,
      categories: []
    }
  },
  emits: ['oncatselect'],
  inject: ['appScrollTo'],
  unmounted() {
    this.activated = false
  },
  mounted(){
    this.setup()
  },
  watch: {
    $route(to, from) {
       this.onChangeArea().then(() => setTimeout(() => this.usingLocation(false), 1000))
    }
  },
  computed: {
    ...mapGetters('location', [
      'areaClientURI',
      'areaApiURI',
      'catText',
      'catIcon',
      'catSlug',
      'catRootSlug',
      'searchClientURI',
      'searchApiURI',
      'isUsingLocation',
      'isUsingCrumbs'
    ]),
    isCleanNavPath() {
      return this.$route.name === routerNames.Tours || (this.isUsingLocation && !this.isUsingCrumbs)
    }
  },
  methods: {
    ...mapActions(['listFetchingStart', 'listFetchingDone']),
    ...mapActions('location', [
      'setInitialCat',
      'setCatBySlug',
      'updateSidebar',
      'usingLocation'
    ]),
    fetchingStart() {
      this.listFetchingStart();
      this.busy = true;
      setTimeout(() => this.appScrollTo("main"));
    },
    fetchingDone() {
      this.listFetchingDone();
      this.busy = false;
    },
    clientURI(url) {
      return !isEmptyString(this.searchClientURI) ? url + this.searchClientURI : url
    },
    apiURI(api_url) {
      return !isEmptyString(this.searchApiURI) ? api_url + this.searchApiURI : api_url
    },
    setup() {
      this.setCategories().then(() => setTimeout(() => this.setupCatList().then(() => this.activated = true), 500))
    },
    isActiveCat(slug) {
      return this.catSlug === slug
    },
    isActiveRootCat(slug) {
      return this.catRootSlug === slug
    },
    onClickCatSelect() {
      if (!this.isOpenMenu){
        this.isOpenMenu = true
        document.addEventListener('click', this.hideCatsMenu, false);
      }
    },
    isCheckedCat(el){
      return el.children[0].dataset.checked && JSON.parse(el.children[0].dataset.checked)
    },
    hideCatsMenu(event) {
      const select = this.$refs.cat_select;
      const menu = this.$refs.cat_nav;
      const target = event.target;
      if (
          select && menu
          && select.hasAttribute('open')
          && !select.contains(target)
          && !menu.contains(target)
      ){
        select.removeAttribute('open')
        document.removeEventListener('click', this.hideCatsMenu, false);
        this.isOpenMenu = false
      }
    },
    setInstanceURLS(instance) {
      instance.url = absoluteURI({
        base: path.CLIENT_TOURS,
        area: this.areaClientURI,
        cat: instance.uri,
      });
      instance.api_url = absoluteURI({
        base: path.API_TOURS,
        area: this.areaApiURI,
        cat: instance.api_uri,
      });
    },
    async setCategories() {
      this.categories = [];
      for (let p = 0; p < categories.length; p++) {
        const cat = { ...categories[p] };
        this.setInstanceURLS(cat)
        for (let s = 0; s < cat.sub_list.length; s++) {
          this.setInstanceURLS(cat.sub_list[s])
        }
        this.categories.push(cat)
      }
    },
    async onChangeArea() {
      await this.setCategories()
      const cat_list = this.$refs.cat_list
      if (cat_list){
        if (this.isCleanNavPath) {
          this.setInitialCat()
        }
        for (let i = 0; i < cat_list.children.length; i++){
          const cat = cat_list.children[i];
          if (this.isCleanNavPath) {
            cat.children[0].removeAttribute('open')
          }
          const p__pk = Number.parseInt(cat.dataset.pk);
          const p__obj = this.categories.find(obj => obj.pk === p__pk);
          if (p__obj){
            const sub_list = cat.children[0].children[1];
            sub_list.children[0].children[0].setAttribute('href', p__obj.url);

            let isAllSubCatsChecked = true;
            for (let q = 0; q < sub_list.children.length; q++){
              const subcat = sub_list.children[q];
              if (this.isCleanNavPath) { subcat.dataset.checked = "false" }
              const s__pk = Number.parseInt(subcat.dataset.pk);
              const s__obj = p__obj.sub_list.find(obj => obj.pk === s__pk);
              if (s__obj){
                if (this.isUsingCrumbs){
                  if (this.isActiveCat(subcat.dataset.slug)) {
                    subcat.dataset.checked = "true";
                    isAllSubCatsChecked = false
                  } else {
                    subcat.dataset.checked = "false"
                  }
                }
                subcat.children[0].setAttribute('href', s__obj.url);
              }
            }
            if (this.isUsingCrumbs) {
              cat.children[0].children[1].children[0].dataset.checked = isAllSubCatsChecked ? "true" : "false";
            }
          }
        }
      }
      return Promise.resolve()
    },
    async setupCatList(){
      const cat_list = this.$refs.cat_list
      if (cat_list){
        const cat_select = this.$refs.cat_select;
        const _cleanCatOpen = this.cleanCatOpen;
        const _onSubCatClick = this.onSubCatClick
        for (let i = 0; i < cat_list.children.length; i++) {
          const cat = cat_list.children[i];
          if (this.isActiveRootCat(cat.dataset.slug)) {
            cat.children[0].setAttribute('open', "")
          } else {
            cat.children[0].removeAttribute('open')
          }
          const all_subcat = cat.children[0].children[1].children[0];
          const p__pk = Number.parseInt(cat.dataset.pk);
          const p__obj = this.categories.find(obj => obj.pk === p__pk);
          if (p__obj){
            if (!this.activated) {
              cat.children[0].children[0].children[0].addEventListener('click', function () {
                if (!cat.children[0].hasAttribute('open')){
                  _cleanCatOpen(cat);
                  all_subcat.children[0].click();
                }
              });
            }
            for (let q = 0; q < cat.children[0].children[1].children.length; q++) {
              const subcat = cat.children[0].children[1].children[q];
              if (this.isActiveCat(subcat.dataset.slug)) {
                subcat.dataset.checked = "true"
              } else {
                subcat.dataset.checked = "false"
              }
              if (!this.activated) {
                const s__pk = Number.parseInt(subcat.dataset.pk);
                const s__obj = p__obj.sub_list.find(obj => obj.pk === s__pk);
                if (s__obj){
                  subcat.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (!JSON.parse(subcat.dataset.checked)){
                      _cleanCatOpen(cat);
                      _onSubCatClick(this, s__obj);
                      cat_select.removeAttribute('open');
                    }
                  });
                }
                else if (subcat.dataset.cat && JSON.parse(subcat.dataset.cat)){
                  subcat.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (!JSON.parse(subcat.dataset.checked)){
                      _cleanCatOpen(cat);
                      _onSubCatClick(this, p__obj);
                    }
                  });
                }
              }
            }
          }
        }
      }
    },
    cleanCatOpen(el){
      for (let i = 0; i < el.parentNode.children.length; i++){
        const cat = el.parentNode.children[i];
        if (el.dataset.pk !== cat.dataset.pk){
          cat.children[0].removeAttribute('open')
          const subcat_list = cat.children[0].children[1];
          for (let q = 0; q < subcat_list.children.length; q++){
            subcat_list.children[q].dataset.checked = "false";
          }
        }
      }
    },
    subCatCheck(el){
      const subcat_list = el.parentNode;
      for (let i = 0; i < subcat_list.children.length; i++){
        subcat_list.children[i].dataset.checked = "false";
      }
      el.dataset.checked = "true";
    },
    async onSubCatClick(el, obj){
      if (!this.busy && !this.isCheckedCat(el)) {
        try {
          this.fetchingStart();
          await this.subCatCheck(el);
          await this.setInstanceURLS(obj);
          await this.selectCat(obj)
          this.fetchingDone();
        } catch (err) {
          setToastMessage(err.message ?? err.toString())
          this.fetchingDone();
        }
      }
    },
    async selectCat(obj){
      return new Promise(async (resolve, reject) => {
        try {
          if (isEmptyString(obj.api_url)) {
            reject("Api url is empty in CatFilter")
          }
          const api = this.apiURI(obj.api_url);
          const client = this.clientURI(obj.url);
          console.log("api: ", api)
          console.log("client: ", client)
          switch (true) {
            case isEmptyString(api):
              reject("Cat api is empty on CatFilter")
              break;
            case isEmptyString(client):
              reject("Cat client is empty on CatFilter")
              break;
            default:
              await this.setCatBySlug(obj.slug);
              const data = await this.$api.tours.list(api)
              this.$emit('oncatselect', data)
              await this.$router.push(client)
              if (!isEmptyString(obj.banner_url) && !isEmptyString(obj.pr)) {
                this.updateSidebar({
                  banner_url: path.HOST_API + obj.banner_url,
                  pr: obj.pr
                })
              }
              resolve(true)
          }
        } catch (err) {
          reject(err)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
