<template>
<div class="list-loader">
  <div class="balls__box" :style="boxCss">
    <div class="balls__bounce">
      <div class="balls__child b1"></div>
      <div class="balls__child b2"></div>
      <div class="balls__child b3"></div>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from "vuex";
import {views} from "../core/actions.js";

export default {
  name: "ListLoader",
  computed: {
    ...mapGetters(['isListFetching', 'activeView']),
    boxCss() {
      return this.isListFetching && this.isActive ? "display: block;" : "display: none"
    },
    isActive() {
      switch (this.activeView) {
        case views.ABOUT: return false
        default: return true
      }
    }
  }
}
</script>

<style scoped>
.list-loader {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  top: 0;
  right: 0;
  bottom: -5px;
  left: 0;
  border-radius: 4px;
  margin: 0 15px 0 15px;
  min-height: 188px;
  z-index: 10;
}
.balls__box {
  position:relative;
  min-height: 100px;
}
.balls__box .balls__bounce {
  position:absolute;
  z-index:1000;
  top:0;
  right:0;
  bottom:0;
  left:0
}
.balls__bounce {
  margin:40px auto;
  width:80px;
  text-align:center
}
.balls__child {
  width:20px;
  height:20px;
  background-color:#999;
  border-radius:100%;
  display:inline-block;
  -webkit-animation:balls-bounce 1.4s ease-in-out 0s infinite both;
  animation:balls-bounce 1.4s ease-in-out 0s infinite both
}
.balls__bounce .b1 {
  -webkit-animation-delay:-.32s;
  animation-delay:-.32s
}
.balls__bounce .b2 {
  -webkit-animation-delay:-.16s;
  animation-delay:-.16s
}
@-webkit-keyframes balls-bounce {
  0%,
  80%,
  to {
    transform:scale(0)
  }
  40% {
    transform:scale(1)
  }
}
@keyframes balls-bounce {
  0%,
  80%,
  to {
    transform:scale(0)
  }
  40% {
    transform:scale(1)
  }
}
</style>
