<template>
<div class="container">
  <AuthorizePlug v-if="loggedIn" />
  <div v-else class="view-box">
    <div class="auth-form">
      <h1 class="auth-title">Активация пользователя</h1>
      <div class="box pt__15 text-center">
        <div class="i_box pr__10"><router-link :to="{name: 'Home'}">На главную</router-link></div>
        <div class="i_box pr__10"><router-link :to="{name: 'Login'}">Вход</router-link></div>
        <div class="i_box pr__10"><router-link :to="{name: 'Register'}">Регистрация</router-link></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AuthorizePlug from "../components/AuthorizePlug.vue";
import routerNames from "../router/names.js";
import {setToastMessage} from "../services/setters.js";
import {isObject} from "../services/getters";

export default {
  name: "UserActivate",
  components: {
    AuthorizePlug
  },
  data(){
    return {
      busy: false,
      uid: null,
      token: null
    }
  },
  inject: ['appScrollTo'],
  computed: {
    ...mapGetters('user', ['isAuthenticated']),
    ...mapGetters(['isStoreReady']),
    loggedIn() {
      return this.isStoreReady && this.isAuthenticated
    }
  },
  methods: {
    ...mapActions('user', ['activate']),
    ...mapActions('notification', ['createNotification']),
    formIsValid(){
      let isValid = true;
      if (!this.uid){ isValid = false; }
      if (!this.token){ isValid = false; }
      return isValid;
    },
    activateUser() {
      if (this.busy || !this.formIsValid()) { return }
      this.busy = true
      this.activate({ uid: this.uid, token: this.token }).then(() => {
        this.$router.replace({name: routerNames.Login})
        setToastMessage('Учётная запись успешно подтверждена', 'w-info')
        this.createNotification({
          type: "info",
          text: "Войдите в систему, используя свои учётные данные",
          closable: false
        })
      }).catch(err => {
        if (isObject(err)){
          switch (true) {
            case err.detail && Array.isArray(err.detail):
              setToastMessage(err.detail[0])
              break;
            case err.token && Array.isArray(err.token):
              setToastMessage(err.token[0])
              break;
            case err.uid && Array.isArray(err.uid):
              setToastMessage(err.uid[0])
              break;
            default: break;
          }
        }
      })
      this.busy = false
    }
  },
  beforeMount() {
    this.uid = this.$route.params.uid
    this.token = this.$route.params.token
    this.activateUser()
  }
}
</script>
