<template>
  <div id="app">
    <CoolLightBox 
      :items="lightboxItems" 
      :index="lightboxIndex"
      :fullScreen="true"
      @close="$store.commit('clearLightboxIndex')">
    </CoolLightBox>

    <div class="images-wrapper">
      <div
        class="image"
        v-for="(image, imageIndex) in lightboxItems"
        :key="imageIndex"
        @click="lightboxIndex = imageIndex"
        :style="{ backgroundImage: 'url(' + image + ')' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
    };
  },
  computed : {
      lightboxIndex () {
          return this.$store.state.lightboxIndex
      },
      lightboxItems () {
          return this.$store.state.lightboxItems
      }
  }
};
</script>


<style>

</style>