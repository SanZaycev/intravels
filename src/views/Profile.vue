<template>
<div class="router-view">
  <div class="profile-head">
    <div class="container">
      <span ref="details" class="w-scrollto"></span>
      <div v-if="!isDetails" class="f-box">
        <div class="p-col"><div class="p-avatar"><img :src="avatar" alt="avatar"></div></div>
        <div class="p-col">
          <div class="w-box p-fullname"><h2>{{ fullname }}</h2></div>
          <div class="w-box p-area"><p>cv.area</p></div>
          <div class="w-box p-email"><p>{{ email }}</p></div>
        </div>
        <div class="col-12"><div class="w-row__btn"><button class="p-btn v4" @click="showDetails"><span>Изменить личные данные</span></button></div></div>
      </div>
      <div v-else class="p-form">
        <BoxLoader class="center" :fetching="fetching"/>
        <div class="w-row open details">
          <div class="w-row__title pb__20"><h3>Изменить личные данные</h3></div>
          <div class="f-box">
            <div class="col-12 col-md-6">
              <div class="w-control">
                <label for="i-1" class="w-label">Имя</label>
                <input type="text" id="i-1" :value="firstname" name="fullname" maxlength="15">
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="w-control">
                <label for="i-2" class="w-label">Фамилия</label>
                <input type="text" id="i-2" :value="surname" name="surname" maxlength="15">
              </div>
            </div>
          </div>
          <div class="f-box">
            <div class="w-control">
              <label for="s-1" class="w-label">Где я нахожусь</label>
              <select name="area" id="s-1"></select>
              <span class="select-chevron"><svg width="13" height="30" viewBox="0 0 1024 1024" focusable="false" fill="#a8a8a8"><path d="M945 305l78 67-510 524L3 372l75-69 435 451 432-449z"></path></svg></span>
            </div>
            <div class="w-control">
              <label for="phone" class="w-label">Телефон</label>
              <div class="iti-box" id="iti">
                <div class="iti-selected-flag" :data-code="phoneCode"><div class="iti__flag"></div><div class="iti-arrow"></div><div class="iti-selected-code">+{{ phoneCode }}</div></div>
                <ul class="iti-country-list"></ul>
              </div>
              <input id="phone" type="tel" name="phone" placeholder="(999) 999 9999" autocomplete="off" maxlength="15">
            </div>
            <div class="w-control pb__5">
              <span class="w-label ml__5">Email</span>
              <div class="f-text">{{ email }}</div>
            </div>
            <div class="w-control">
              <Notification
                :type="notifyDetails.type"
                :text="notifyDetails.text"
                :toText="notifyDetails.toText"
                :toName="notifyDetails.toName"
                :closable="false"
              />
            </div>
          </div>
          <div class="f-box pl__5 pr__5">
            <div class="w-row__btn"><button class="p-btn v3"><span>Сохранить</span></button></div>
            <div class="w-row__btn"><button class="p-btn v1" @click="hideDetails"><span>Отмена</span></button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="profile-body">
    <div class="container">
      <div class="row">
        <div id="uc" class="col-12 col-md-9">
          <ListLoader v-if="isListFetching"></ListLoader>
          <div class="p-form">
            <span ref="description" class="w-scrollto"></span>
            <div v-if="!isDescription" class="w-row">
              <div class="w-row__title pb__20"><h3>Обо мне</h3></div>
              <div class="w-row__text pb__30"><p>Добавьте короткое описание о себе, чтобы дать знать работодателю о том, кто вы есть.</p></div>
              <div class="w-row__btn"><button class="p-btn v2" @click="showDescription"><span>Добавить описание</span></button></div>
            </div>
            <div v-else class="w-row open">
              <div class="w-row__title pb__20"><h3>Добавить описание о себе</h3></div>
              <div class="w-box">
                <label for="t-1">Подчеркните свои сильные стороны и напишите свой уникальный опыт.</label>
                <textarea class="w-textarea" name="description" id="t-1" cols="30" rows="5"></textarea>
              </div>
              <div class="w-row__btn"><button class="p-btn v3"><span>Сохранить</span></button></div>
              <div class="w-row__btn"><button class="p-btn v1" @click="hideDescription"><span>Отмена</span></button></div>
            </div>
          </div>
          <div class="p-form">
            <span ref="experience" class="w-scrollto"></span>
            <div v-if="!isExperience" class="w-row">
              <div class="w-row__title pb__20"><h3>Опыт работы</h3></div>
              <div class="w-row__text pb__30"><p>Чем больше вы расскажете работодателям о своем опыте, тем больше вы сможете выделиться.</p></div>
              <div class="w-row__btn"><button class="p-btn v2" @click="showExperience"><span>Добавить должность</span></button></div>
            </div>
            <div v-else class="w-row open">
              <div class="w-row__title pb__20"><h3>Добавить опыт работы</h3></div>
              <div class="w-box">
                <label for="t-2">Кратко перечислите свои обязанности, навыки и достижения</label>
                <textarea class="w-textarea" name="description" id="t-2" cols="30" rows="5"></textarea>
              </div>
              <div class="w-row__btn"><button class="p-btn v3"><span>Сохранить</span></button></div>
              <div class="w-row__btn"><button class="p-btn v1" @click="hideExperience"><span>Отмена</span></button></div>
            </div>
          </div>
          <div class="p-form">
            <span ref="education" class="w-scrollto"></span>
            <div v-if="!isEducation" class="w-row">
              <div class="w-row__title pb__20"><h3>Образование</h3></div>
              <div class="w-row__text pb__30"><p>Расскажите работодателям о своем образовании.</p></div>
              <div class="w-row__btn"><button class="p-btn v2" @click="showEducation"><span>Добавить образование</span></button></div>
            </div>
            <div v-else class="w-row open">
              <div class="w-row__title pb__20"><h3>Добавить образование</h3></div>
              <div class="w-box">
                <label for="t-3">Добавьте мероприятия, проекты, награды и учебные достижения.</label>
                <textarea class="w-textarea" name="description" id="t-3" cols="30" rows="5"></textarea>
              </div>
              <div class="w-row__btn"><button class="p-btn v3"><span>Сохранить</span></button></div>
              <div class="w-row__btn"><button class="p-btn v1" @click="hideEducation"><span>Отмена</span></button></div>
            </div>
          </div>
          <div class="p-form">
            <span ref="licenses" class="w-scrollto"></span>
            <div v-if="!isLicenses" class="w-row">
              <div class="w-row__title pb__20"><h3>Лицензии и сертификаты</h3></div>
              <div class="w-row__text pb__30"><p>Продемонстрируйте свои профессиональные качества. Добавьте сюда свои соответствующие лицензии, сертификаты, членства и аккредитации.</p></div>
              <div class="w-row__btn"><button class="p-btn v2" @click="showLicenses"><span>Добавить сертификат</span></button></div>
            </div>
            <div v-else class="w-row open">
              <div class="w-row__title pb__20"><h3>Добавить лицензию или сертификат</h3></div>
              <div class="w-box">
                <label for="t-4">Кратко опишите ваши лицензии и сертификаты.</label>
                <textarea class="w-textarea" name="description" id="t-4" cols="30" rows="5"></textarea>
              </div>
              <div class="w-row__btn"><button class="p-btn v3"><span>Сохранить</span></button></div>
              <div class="w-row__btn"><button class="p-btn v1" @click="hideLicenses"><span>Отмена</span></button></div>
            </div>
          </div>
          <div class="p-form">
            <span ref="skills" class="w-scrollto"></span>
            <div v-if="!isSkills" class="w-row">
              <div class="w-row__title pb__20"><h3>Навыки</h3></div>
              <div class="w-row__text pb__30"><p>Пусть работодатели знают, насколько ценным вы можете быть для них.</p></div>
              <div class="w-row__btn"><button class="p-btn v2" @click="showSkills"><span>Добавить навыки</span></button></div>
            </div>
            <div v-else class="w-row open">
              <div class="w-row__title pb__20"><h3>Добавить навыки</h3></div>
              <div class="w-box">

              </div>
              <div class="w-row__btn"><button class="p-btn v3"><span>Сохранить</span></button></div>
              <div class="w-row__btn"><button class="p-btn v1" @click="hideSkills"><span>Отмена</span></button></div>
            </div>
          </div>
          <div class="p-form">
            <span ref="lang" class="w-scrollto"></span>
            <div v-if="!isLang" class="w-row">
              <div class="w-row__title pb__20"><h3>Языки</h3></div>
              <div class="w-row__text pb__30"><p>Добавьте языки, чтобы привлечь больше компаний и работодателей.</p></div>
              <div class="w-row__btn"><button class="p-btn v2" @click="showLang"><span>Добавить язык</span></button></div>
            </div>
            <div v-else class="w-row open">
              <div class="w-row__title pb__20"><h3>Добавить язык</h3></div>
              <div class="w-box">
                <label for="i-10" class="w-label">Язык</label>
                <input type="text" id="i-10" placeholder="Например английский, китайский, немецкий">
              </div>
              <div class="w-row__btn"><button class="p-btn v3"><span>Сохранить</span></button></div>
              <div class="w-row__btn"><button class="p-btn v1" @click="hideLang"><span>Отмена</span></button></div>
            </div>
          </div>
        </div>
        <ProfileSidebar/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ProfileSidebar from "../components/ProfileSidebar.vue";
import BoxLoader from "../components/BoxLoader.vue";
import ListLoader from "../components/ListLoader.vue";
import Notification from "../components/Notification.vue";
import {ITI} from "../libs/iti.js";
import routerNames from "../router/names.js";
import {scrollTo} from "../services/setters.js";

export default {
  name: 'Profile',
  components: {
    BoxLoader,
    ListLoader,
    ProfileSidebar,
    Notification,
  },
  data() {
    return {
      fetching: false,
      activated: false,
      updating: false,
      busy: false,
      isDetails: false,
      isDescription: false,
      isExperience: false,
      isEducation: false,
      isLicenses: false,
      isSkills: false,
      isLang: false,
      data: {
        fullname: null,
        surname: null,
        phone_code: null,
        phone: null,
      },
      notifyDetails: {
        type: "info",
        text: "Вы можете изменить email, пароль или удалить свою учетную запись в ",
        toText: "настройках",
        toName: routerNames.ProfileSettings,
      }
    }
  },
  beforeMount() {
    this.listFetchingStart()
  },
  mounted() {
    setTimeout(() => {
      this.listFetchingDone()
      this.activated = true
    }, 300)
  },
  unmounted() {
    this.activated = false;
    ITI.destroy();
  },
  computed: {
    ...mapGetters(['isListFetching']),
    ...mapGetters('user', [
      'avatar',
      'firstname',
      'surname',
      'fullname',
      'email',
      'phone',
      'phoneCode',
    ])
  },
  methods: {
    ...mapActions(['listFetchingStart', 'listFetchingDone']),
    showDetails() {
      this.fetching = true;
      this.isDetails = true;
      setTimeout(() => {
        scrollTo(this.$refs.details)
        ITI.initialize({
          setPhoneCode: this.setITIPhoneCode,
          setPhone: this.setPhone,
          phone_code: this.phoneCode,
          phone: this.phone,
        });
        this.fetching = false;
      }, 200);
    },
    hideDetails() {
      this.isDetails = false;
      setTimeout(() => {
        scrollTo(this.$refs.details)
        ITI.destroy();
      }, 100);
    },
    showDescription() {
      this.isDescription = true;
      setTimeout(() => scrollTo(this.$refs.description), 100);
    },
    hideDescription() {
      this.isDescription = false;
      setTimeout(() => scrollTo(this.$refs.description), 100);
    },
    showExperience() {
      this.isExperience = true;
      setTimeout(() => scrollTo(this.$refs.experience), 100);
    },
    hideExperience() {
      this.isExperience = false;
      setTimeout(() => scrollTo(this.$refs.experience), 100);
    },
    showEducation() {
      this.isEducation = true;
      setTimeout(() => scrollTo(this.$refs.education), 100);
    },
    hideEducation() {
      this.isEducation = false;
      setTimeout(() => scrollTo(this.$refs.education), 100);
    },
    showLicenses() {
      this.isLicenses = true;
      setTimeout(() => scrollTo(this.$refs.licenses), 100);
    },
    hideLicenses() {
      this.isLicenses = false;
      setTimeout(() => scrollTo(this.$refs.licenses), 100);
    },
    showSkills() {
      this.isSkills = true;
      setTimeout(() => scrollTo(this.$refs.skills), 100);
    },
    hideSkills() {
      this.isSkills = false;
      setTimeout(() => scrollTo(this.$refs.skills), 100);
    },
    showLang() {
      this.isLang = true;
      setTimeout(() => scrollTo(this.$refs.lang), 100);
    },
    hideLang() {
      this.isLang = false;
      setTimeout(() => scrollTo(this.$refs.lang), 100);
    },
    setITIPhoneCode: function(num){
      this.data.phone_code = num;
    },
    setPhone: function (numbers){
      this.data.phone = numbers
    },
  }
}
</script>
