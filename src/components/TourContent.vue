<template>
  <div v-if="description" class="job__description pt__20 pb__20">{{ description }}</div>
  <div v-if="content && content.length" class="w-content" v-html="parsedContent"></div>
</template>

<script>
export default {
  name: "TourContent",
  props: {
    description: {
      type: String,
      default: null
    },
    content: {
      type: Array,
      default: []
    }
  },
  computed: {
    parsedContent(){
      let html = ""
      console.log(this.content)
      for (let i = 0; i < this.content.length; i++){
        const part = this.content[i];
        switch (part.tag){
          case "p":
            html += `<p>${part.text}</p>`
            break;
          case "b":
            html += `<p><strong>${part.text}</strong></p>`
            break;
          case "em":
            html += `<p><em>${part.text}</em></p>`
            break;
          case "ul":
            if (Array.isArray(part.text) && part.text.length){
              html += `<ul>`
              for (let q = 0; q < part.text.length; q++){
                html += `<li>${part.text[q]}</li>`
              }
              html += `</ul>`
            }
            break;
          default: break;
        }
      }
      return html
    }
  },
}
</script>

<style scoped>

</style>
