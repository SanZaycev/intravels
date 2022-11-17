<template>
<div v-if="isActive" class="w__box">
  <div class="w__row" :class="type">
    <div class="w__msg">
      <div class="if_box"><span class="icn" :class="type"></span></div>
      <div class="if_box w__msg-text">{{ text }} <router-link v-if="isTo" :to="{name: toName}">{{ toText }}</router-link></div>
      <button v-if="closable" @click="close" class="w__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve" focusable="false" aria-hidden="true" height="21" width="21" fill="#2765cf"><path d="m13.4 12 5.3-5.3c.4-.4.4-1 0-1.4s-1-.4-1.4 0L12 10.6 6.7 5.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l5.3 5.3-5.3 5.3c-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3l5.3-5.3 5.3 5.3c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L13.4 12z"></path></svg></button>
    </div>
  </div>
</div>
</template>

<script>
import {isEmptyString} from "../services/getters.js";

export default {
  name: "Notification",
  data() {
    return {
      active: false
    }
  },
  props: {
    type: {
      type: String,
      default: "info"
    },
    text: {
      type: String,
      default: ""
    },
    toText: {
      type: String,
      default: null
    },
    toName: {
      type: String,
      default: null
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      return this.active && !isEmptyString(this.text)
    },
    isTo() {
      return !isEmptyString(this.toText) && !isEmptyString(this.toName)
    },
  },
  methods: {
    close() {
      this.active = false
    }
  },
  mounted() {
    this.active = true
  }
}
</script>

<style scoped>
.w__box {
  display: block;
  position: relative;
  width: 100%;
  padding: 10px 0 10px 0;
}
.w__msg {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  font-family: "AcromMedium", sans-serif;
  font-size: 15px;
  padding: 15px 15px 15px 0;
  min-height: 78px;
  border-top: 1px solid #eee;
}
.w__msg-text {
  display: inline-block;
  width: calc(100% - 40px);
  padding: 5px 7px;
}
.w__row.info {
  color: #1e468c;
  background-color: #e8ecf2;
  border-radius: 7px;
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.15);
  border-left: 5px solid #155bc9;
  overflow: hidden;
}
.w__row.success {
  color: #155724;
  background-color: #d4edda;
  border-radius: 0 4px 4px 0;
  border-color: #c3e6cb;
  box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);
  border-left: 5px solid #42b983;
}
.w__row.danger {
  color: #721c24;
  background-color: #f8d7da;
  border-radius: 0 4px 4px 0;
  border-color: #f5c6cb;
  box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);
  border-left: 5px solid #e53935;
}
.w__row.warning {
  color: #542700;
  background-color: #fff;
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);
  border-left: 5px solid #ffc107;
}
.w__msg > .if_box > .icn{
  margin: 0 0 0 9px;
  width: 25px;
  height: 25px;
}
.w__close:hover { opacity: .9; }
.w__close{
  position: absolute;
  top: 7px;
  right: 7px;
  transition: opacity .1s linear;
}
</style>
