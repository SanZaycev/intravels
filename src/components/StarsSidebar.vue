<template>
  <div id="aside" class="w-sidebar col-12 col-md-3">
    <div class="u-box">
      <aside id="sidebar" class="right-sidebar">
        <div class="sidebar-inner">
          <div class="sidebar-widget">
            <div class="w-box">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, vel?</div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>

export default {
  name: "StarsSidebar",
  data(){
    return {
      sidebar: null,
      main: null,
      box: null,
      offsetBar: null,
      delimetrZ: 0,
      setTop: 15,
      setBottom: 15,
      active: false,
      loaded: false,
    }
  },
  props: {
    fetching: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['onclickjobs', 'onclickcvs', 'onclickcourses'],
  mounted() {
    this.initialize();
  },
  unmounted() {
    this.destroy();
  },
  methods: {
    initialize(){
      this._setupRows()
      if (this.sidebar && this.main){
        if (!this.loaded){
          window.addEventListener('resize', this._onWindowResize, false);
          this.loaded = true;
        }
        setTimeout(()=>this.go(), 500);
      }
    },
    go(){
      if (!this.active && document.documentElement.clientWidth >= 768){
        this._listener();
        window.addEventListener("scroll", this._listener, false);
        this.active = true;
        console.log("Sticky initialized");
      }
    },
    destroy(){
      if (this.box){
        window.removeEventListener('scroll', this._listener, false);
        // window.removeEventListener('resize', this._onWindowResize, false);
        this.box.style.top = "0";
        this.box.className = 'stop';
        this.sidebar.style.height = 'auto';
        this.sidebar.children[0].style.width = '100%';
        this.active = false;
        console.log("Sticky destroyed");
      }
    },
    _setupRows(){
      this.main = document.getElementById('uc');
      this.sidebar = document.getElementById('sidebar');
    },
    _onWindowResize(){
      if (document.documentElement.clientWidth < 768){
        this.destroy()
      }
      else {
        if (!this.active){ this.go(); }
        this.sidebar.children[0].style.width = getComputedStyle(this.sidebar, '').width;
      }
    },
    _listener: function(){
      let rectSidebar = this.sidebar.getBoundingClientRect();
      let addBottom = this.main.getBoundingClientRect().bottom;
      if (this.box === null){
        let styleSidebar = getComputedStyle(this.sidebar, '');
        let s = '';
        for (let i = 0; i < styleSidebar.length; i++) {
          if (styleSidebar[i].indexOf('overflow') === 0 || styleSidebar[i].indexOf('padding') === 0 || styleSidebar[i].indexOf('border') === 0 || styleSidebar[i].indexOf('outline') === 0 || styleSidebar[i].indexOf('box-shadow') === 0 || styleSidebar[i].indexOf('background') === 0){
            s += styleSidebar[i] + ': ' + styleSidebar.getPropertyValue(styleSidebar[i]) + '; '
          }
        }
        this.box = document.createElement('div');
        this.box.id = "sticky";
        this.box.className = "stop";
        this.box.style.cssText = s + ' box-sizing: border-box; width: ' + this.sidebar.offsetWidth + 'px;';
        this.sidebar.insertBefore(this.box, this.sidebar.firstChild);

        for (let i = 1; i < this.sidebar.childNodes.length; i++) {
          this.box.appendChild(this.sidebar.childNodes[1]);
        }
        this.sidebar.style.height = this.box.getBoundingClientRect().height + 'px';
        this.sidebar.style.padding = '0';
        this.sidebar.style.border = '0';
      }
      let rectBox = this.box.getBoundingClientRect(),
          offsetBoxHeight = rectSidebar.top + rectBox.height,
          windowHeight = document.documentElement.clientHeight,
          R1 = Math.round(offsetBoxHeight - addBottom),
          R2 = Math.round(offsetBoxHeight - windowHeight);

      if (rectBox.height > windowHeight - this.setTop) {
        if (rectSidebar.top < this.offsetBar){
          if (R2 + this.setBottom > R1) {
            if (rectBox.bottom - windowHeight + this.setBottom <= this.setBottom){
              this.box.className = 'sticky';
              this.box.style.top = windowHeight - rectBox.height - this.setBottom + 'px';
              this.delimetrZ = this.setBottom + rectSidebar.top + rectBox.height - windowHeight;
            }
            else {
              this.box.className = 'stop';
              this.box.style.top = - this.delimetrZ + 'px';
            }
          }
          else {
            this.box.className = 'stop';
            this.box.style.top = - R1 +'px';
            this.delimetrZ = R1;
          }
        }
        else {
          if (rectSidebar.top - this.setTop < 0){
            if (rectBox.top - this.setTop >= 0){
              this.box.className = 'sticky';
              this.box.style.top = this.setTop + 'px';
              this.delimetrZ = rectSidebar.top - this.setTop;
            }
            else {
              this.box.className = 'stop';
              this.box.style.top = - this.delimetrZ + 'px';
            }
          }
          else {
            this.box.className = '';
            this.box.style.top = '';
            this.delimetrZ = 0;
          }
        }
        this.offsetBar = rectSidebar.top;
      }
      else {
        if ((rectSidebar.top - this.setTop) <= 0) {
          if ((rectSidebar.top - this.setTop) <= R1) {
            this.box.className = 'stop';
            this.box.style.top = - R1 +'px';
          }
          else {
            this.box.className = 'sticky';
            this.box.style.top = this.setTop + 'px';
          }
        }
        else {
          this.box.className = '';
          this.box.style.top = '';
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
