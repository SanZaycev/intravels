<template>
<div class="container">
  <AuthorizePlug v-if="loggedIn" />
  <div v-else class="view-box">
    <div class="auth-form" @keydown="onFormKeyDown">
      <h1 class="auth-title">Вход</h1>
      <div class="field">
        <label for="username">Логин или E-mail</label>
        <div class="control">
          <input v-model.string.trim="username" @input="validUsername" type="text" id="username" class="input" placeholder="Ваш Логин" autocomplete="off" maxlength="20">
          <small v-if="errors.username" class="error-text">{{ errors.username }}</small>
        </div>
      </div>
      <div class="field">
        <label for="password">Пароль</label>
        <div class="control">
          <input v-model.string.trim="password" @input="validPassword" type="password" id="password" class="input" placeholder="Ваш Пароль" autocomplete="off">
          <small v-if="errors.password" class="error-text">{{ errors.password }}</small>
        </div>
      </div>
      <div class="box pt__10" v-if="backend_errors.length">
        <small v-for="(err, index) in backend_errors" :key="index" class="error-text">{{ err }}</small>
      </div>
      <div class="auth-row">
        <button type="button" class="shadow-btn" @click="submitForm">Войти</button>
      </div>
      <div class="auth-foot">
        <hr>
        <div class="not-register">Ещё не зарегистрированы? <router-link :to="{name: 'Register'}" class="link-medium">Нажмите здесь</router-link> для регистрации!</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AuthorizePlug from "../components/AuthorizePlug.vue";
import {cleanAuthToken} from "../services/tokens.js";
import {setToastMessage} from "../services/setters.js";
import routerNames from "../router/names.js";
import {isObject} from "../services/getters";

export default {
  name: "Login",
  components: {
    AuthorizePlug
  },
  data(){
    return {
      busy: false,
      submitted: false,
      username: "",
      password: "",
      backend_errors: [],
      errors: {
        username: null,
        password: null,
      },
    }
  },
  inject: ['appScrollTo'],
  computed: {
    ...mapGetters("user", ["isAuthenticated", "fullname"]),
    ...mapGetters(["isStoreReady"]),
    isErrors() {
      return !!this.data.errors.length;
    },
    loggedIn() {
      return this.isStoreReady && this.isAuthenticated
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    ...mapActions('notification', ['createNotification']),
    ...mapActions(['parseCtx', 'fetchingStart', 'fetchingDone', 'fetchingTimeout']),
    onFormKeyDown(e){
      if (e.keyCode === 13 || e.key === "Enter"){ this.submitForm(); }
    },
    getErrorText: function(err){
      let text = "";
      switch (err){
        case 'empty_username':
          text = "Для входа укажите логин или email";
          break;
        case 'empty_password':
          text = "Вы забыли ввести пароль";
          break;
        case 'username':
          text = this.username + " не валидный логин";
          break;
        case 'password':
          text = "Пароль может содержать буквы и цифры, минимальная длина 8 символов";
          break;
        default:
          text = "Это поле обязательно для заполнения";
      }
      return text;
    },
    formIsValid(){
      let valid = true
      if (!this.isPassword()){
        this.errors.password = this.getErrorText('password')
        valid = false
      }
      if (this.username === ""){
        this.errors.username = this.getErrorText('empty_username')
        valid = false
      }
      if (this.password === ""){
        this.errors.password = this.getErrorText('empty_password')
        valid = false
      }
      this.submitted = true
      return valid;
    },
    validUsername(){
      if (this.submitted){
        this.errors.username = this.username.length < 3 || this.username.length > 27 ? this.getErrorText('username') : null;
      }
    },
    validPassword() {
      if (this.submitted) {
        this.errors.password = this.isPassword() ? null : this.getErrorText('password');
      }
    },
    isPassword(){
      const letter = /[a-zA-Zа-яА-Я]/;
      const number = /[0-9]/;
      if (this.password.length < 8 || !letter.test(this.password) || !number.test(this.password)){ return false; }
      return true;
    },
    cleanForm(){
      this.username = "";
      this.password = "";
      this.errors = {
        username: null,
        password: null,
      };
      this.cleanBackendErrors()
    },
    cleanBackendErrors() {
      this.backend_errors = []
    },
    submitForm() {
      if (this.busy || !this.formIsValid()) { return }
      this.busy = true
      this.fetchingStart()

      this.cleanBackendErrors()
      cleanAuthToken()

      this.login({username: this.username, password: this.password}).then(() => {
        this.$router.replace( this.$route.query.to ?? { name: routerNames.Profile })
        setToastMessage('Успешный вход в систему ...', 'is-dark', 5000, 'bottom-right')
        this.createNotification({
          type: "info",
          text: `Добро пожаловать, ${this.fullname}!`,
          closable: true
        })
      }).catch(err => {
        if (isObject(err) && Array.isArray(err.non_field_errors)){
          this.backend_errors = err.non_field_errors
        }
      })

      this.appScrollTo("navbar")
      this.busy = false
      this.fetchingDone()
    }
  },
  beforeMount() {
    this.fetchingTimeout(200)
  }
}
</script>
