<template>
  <keep-alive>
    <div class="card">
      <div class="col-md-6"></div>
      <div class="auth-form col-md-6">
        <h1>Сброс пароля</h1>
        <p class="head-tip">Добавьте e-mail для отправки ссылки на сброс пароля</p>
        <div class="form-control pt__10">
          <input v-model.string.trim="email" @input="validEmail" type="email" id="email" placeholder="Ваш email" autocomplete="off">
          <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
        </div>
        <div class="auth-row reset-field pt__20">
          <button type="submit" class="auth-btn" @click.prevent="send">Отправить ссылку</button>
        </div>
        <div class="auth-foot">
          <router-link to="/login/" class="back-to-login">Назад ко входу</router-link>
        </div>
      </div>
    </div>
  </keep-alive>
</template>

<script>
import {setToastMessage} from "../services/setters";

export default {
  name: "ResetPass",
  data(){
    return {
      email: "",
      submitted: false,
      url: null,
      errors: {
        email: null,
      }
    }
  },
  methods: {
    getErrorText: function(err){
      let text = "";
      switch (err){
        case 'email':
          text = this.email + " не валидный email";
          break;
        default:
          text = "Это поле обязательно для заполнения";
      }
      return text;
    },
    formIsValid(){
      let isValid = true;
      if (!this.csrf){ isValid = false; }
      if (!this.url){ isValid = false; }
      if (!this.isEmail()){
        isValid = false;
        this.errors.email = this.getErrorText('email');
      }
      else { this.errors.email = null; }
      return isValid;
    },
    isEmail(){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    validEmail() {
      if (this.submitted) {
        this.errors.email = this.isEmail() ? null : this.getErrorText('email');
      }
    },
    cleanForm(){
      this.email = "";
      this.errors.email = null;
    },
    printBackendErrors(data){
      this.errors.email = data.email ? data.email[0] : null;
    },
    async send(){
      if (this.formIsValid()){
        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email
          })
        }).catch((error) => {
          console.error('Fetching error:', error);
        });
        console.log(response)
        switch (response.status){
          case 204:
            if (response.ok){
              const modal_data = {email: this.email};
              this.cleanForm();
            }
            break;
          case 404:
            setToastMessage(`Пользователь с email ${this.email} не найден.`)
            break;
          case 400:
            setToastMessage(`Произошла ошибка отправки письма на ${this.email}. Возможно сервер занят, повторите позже.`)
            break;
          default:
            setToastMessage("Server error")
        }
      }
      this.submitted = true;
    },
  },
}
</script>

<style scoped>

</style>
