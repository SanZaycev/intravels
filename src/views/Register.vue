<template>
<div class="container">
  <AuthorizePlug v-if="loggedIn" />
  <div v-else class="view-box">
    <div class="auth-form" @keydown="onFormKeyDown">
      <h1 class="auth-title">Регистрация</h1>
      <div class="field">
        <label for="username">Логин</label>
        <div class="control">
          <input v-model.string.trim="username" @input="validUsername" type="text" id="username" class="input" placeholder="Ваш Логин" autocomplete="off" maxlength="20">
          <p class="help-block" v-if="submitted">Только латинские буквы и цифры без пробелов</p>
          <small v-if="errors.username" class="error-text">{{ errors.username }}</small>
        </div>
      </div>
      <div class="field">
        <label for="firstname">Имя</label>
        <div class="control">
          <input v-model.string.trim="firstname" @input="validFirstname" type="text" id="firstname" class="input" placeholder="Ваше Имя" autocomplete="off" maxlength="15">
          <p class="help-block" v-if="submitted">Кириллица и латинские буквы</p>
          <small v-if="errors.firstname" class="error-text">{{ errors.firstname }}</small>
        </div>
      </div>
      <div class="field">
        <label for="surname">Фамилия</label>
        <div class="control">
          <input v-model.string.trim="surname" @input="validSurname" type="text" id="surname" class="input" placeholder="Ваша Фамилия" autocomplete="off" maxlength="15">
          <p class="help-block" v-if="submitted">Кириллица и латинские буквы</p>
          <small v-if="errors.surname" class="error-text">{{ errors.surname }}</small>
        </div>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <div class="control">
          <input v-model.string.trim="email" @input="validEmail" type="email" id="email" class="input" placeholder="Ваш Адрес Электронной Почты" autocomplete="off" maxlength="30">
          <p class="help-block" v-if="submitted">Вы можете использовать email для входа, как и логин</p>
          <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
        </div>
      </div>
      <div class="field">
        <label for="password">Пароль</label>
        <div class="control">
          <input v-model.string.trim="password" @input="validPassword" type="password" id="password" class="input" placeholder="Ваш Пароль" autocomplete="off">
          <small v-if="errors.password" class="error-text">{{ errors.password }}</small>
        </div>
      </div>
      <div class="field">
        <label for="password2">Повторите пароль</label>
        <div class="control">
          <input v-model.string.trim="password2" @input="validPassword2" type="password" id="password2" class="input" autocomplete="off">
          <small v-if="errors.password2" class="error-text">{{ errors.password2 }}</small>
        </div>
      </div>
      <div class="field form-checkbox">
        <span class="label">Правила регистрации</span>
        <div class="checkbox">
          <label class="pointer"><input v-model="agree" @change="validAgree" type="checkbox" checked> С правилами согласен </label>
        </div>
        <small v-if="errors.agree" class="error-text">{{ errors.agree }}</small>
        <small v-if="errors.server" class="error-text">{{ errors.server }}</small>
      </div>
      <div class="auth-row">
        <button type="button" class="shadow-btn" @click="submitForm">Зарегистрироваться</button>
      </div>
      <div class="auth-foot">
        <hr>
        <div class="not-register">Уже зарегистрированы? <router-link :to="{name: 'Login'}" class="link-medium">Нажмите здесь</router-link> чтобы войти!</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AuthorizePlug from "../components/AuthorizePlug.vue";
import {setToastMessage} from "../services/setters.js";
import {isObject} from "../services/getters.js";

export default {
  name: "Register",
  components: {
    AuthorizePlug
  },
  data() {
    return {
      main: null,
      username:"",
      firstname:"",
      surname:"",
      email: "",
      password: "",
      password2: "",
      agree: true,
      submitted: false,
      errors: {
        username: null,
        firstname: null,
        surname: null,
        email: null,
        password: null,
        password2: null,
        agree: null,
        server: null
      },
    }
  },
  inject: ['appScrollTo'],
  computed: {
    ...mapGetters(["isStoreReady"]),
    ...mapGetters("user", ["isAuthenticated"]),
    loggedIn() {
      return this.isStoreReady && this.isAuthenticated
    }
  },
  methods: {
    ...mapActions('user', ['register']),
    ...mapActions('notification', ['createNotification']),
    ...mapActions(['fetchingStart', 'fetchingDone', 'fetchingTimeout']),
    onFormKeyDown(e){
      if (e.keyCode === 13 || e.key === "Enter"){ this.submitForm(); }
    },
    getErrorText: function(err){
      let text = "";
      switch (err){
        case 'username':
          text = "Придумайте короткий уникальный логин в формате от 3 до 20 символов";
          break;
        case 'firstname':
          text = "Ваше имя в формате от 2 до 15 символов";
          break;
        case 'surname':
          text = "Ваша фамилия в формате от 2 до 15 символов";
          break;
        case 'email':
          text = this.email + " Не валидный email";
          break;
        case 'password':
          text = "Пароль может содержать буквы и цифры, минимальная длина 8 символов";
          break;
        case 'password2':
          text = "Пароли не совпадают";
          break;
        case 'agree':
          text = "Это поле обязательно для заполнения";
          break;
        default:
          text = "Это поле обязательно для заполнения";
      }
      return text;
    },
    formIsValid(){
      let isValid = true;
      if (this.username.length < 3 || this.username.length > 20){
        isValid = false;
        this.errors.username = this.getErrorText('username');
      }
      else { this.errors.username = null; }
      if (this.firstname.length < 2 || this.firstname.length > 15){
        isValid = false;
        this.errors.firstname = this.getErrorText('firstname');
      }
      else { this.errors.firstname = null; }
      if (this.surname.length < 2 || this.surname.length > 15){
        isValid = false;
        this.errors.surname = this.getErrorText('surname');
      }
      else { this.errors.surname = null; }
      if (!this.isEmail()){
        isValid = false;
        this.errors.email = this.getErrorText('email');
      }
      else { this.errors.email = null; }
      if (!this.isPassword()){
        isValid = false;
        this.errors.password = this.getErrorText('password');
      }
      else { this.errors.password = null; }
      if (!this.isEqualPasswords()){
        isValid = false;
        this.errors.password2 = this.getErrorText('password2');
      }
      else { this.errors.password2 = null; }
      if (!this.agree){
        isValid = false;
        this.errors.agree = this.getErrorText('agree');
      }
      else { this.errors.agree = null; }
      this.submitted = true;
      return isValid;
    },
    isEmail(){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    isPassword(){
      const letter = /[a-zA-Zа-яА-Я]/;
      const number = /[0-9]/;
      if (this.password.length < 8 || !letter.test(this.password) || !number.test(this.password)){ return false; }
      return true;
    },
    isEqualPasswords(){
      return this.password === this.password2
    },
    validUsername(){
      if (this.submitted){
        this.errors.username = this.username.length < 3 || this.username.length > 20 ? this.getErrorText('username') : null;
      }
    },
    validFirstname(){
      if (this.submitted){
        this.errors.firstname = this.firstname.length < 2 || this.firstname.length > 15 ? this.getErrorText('firstname') : null;
      }
    },
    validSurname(){
      if (this.submitted){
        this.errors.surname = this.surname.length < 2 || this.surname.length > 15 ? this.getErrorText('surname') : null;
      }
    },
    validEmail() {
      if (this.submitted) {
        this.errors.email = this.isEmail() ? null : this.getErrorText('email');
      }
    },
    validPassword() {
      if (this.submitted) {
        this.errors.password = this.isPassword() ? null : this.getErrorText('password');
        this.errors.password2 = this.isEqualPasswords() ? null : this.getErrorText('password2');
      }
    },
    validPassword2() {
      if (this.submitted) {
        this.errors.password2 = this.isEqualPasswords() ? null : this.getErrorText('password2');
      }
    },
    validAgree(){
      if (this.submitted){
        this.errors.agree = this.agree ? null : this.getErrorText('agree');
      }
    },
    cleanForm(){
      this.username = "";
      this.firstname = "";
      this.surname = "";
      this.email = "";
      this.password = "";
      this.password2 = "";
      this.agree = true;
      this.errors.username = null;
      this.errors.firstname = null;
      this.errors.surname = null;
      this.errors.email = null;
      this.errors.password = null;
      this.errors.password2 = null;
      this.errors.agree = null;
      this.errors.server = null;
    },
    printBackendErrors(data){
      if (isObject(data)){
        this.errors.username = data.username ? data.username[0] : null;
        this.errors.firstname = data.firstname ? data.firstname[0] : null;
        this.errors.surname = data.surname ? data.surname[0] : null;
        this.errors.email = data.email ? data.email[0] : null;
        this.errors.password = data.password ? data.password[0] : null;
        if (!this.errors.username && !this.errors.firstname && !this.errors.surname && !this.errors.email && !this.errors.password){
          this.errors.server = Array.isArray(data) ? data[0] : null;
        }
      }
    },
    submitForm(){
      if (this.busy || !this.formIsValid()) { return }
      this.busy = true
      this.fetchingStart()

      this.register({
        email: this.email,
        username: this.username,
        firstname: this.firstname,
        surname: this.surname,
        password: this.password,
      }).then(() => {
        const email = this.email
        const firstname = this.firstname
        const surname = this.surname
        this.createNotification({
          type: "info",
          text: `${firstname} ${surname}, поздравляем с успешной регистрацией на Iworky! Чтобы продолжить, подтвердите свой email по инструкции для входа в систему на ${email}.`,
          closable: false
        })
        setToastMessage('Учетная запись создана', 'w-info', 5000)
        this.cleanForm()
      }).catch(errors => {
        this.printBackendErrors(errors)
      })

      this.appScrollTo("navbar")
      this.busy = false
      this.fetchingDone()
    },
  },
  beforeMount() {
    this.fetchingTimeout(200)
  }
}
</script>

<style scoped>

</style>
