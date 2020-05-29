<template>
  <div id="app" class="flyout">
    <navbar></navbar>
    <main>
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </main>
    <LightBox></LightBox>
    <Footer></Footer>
  </div>
</template>

<script>
import navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LightBox from '@/components/lightbox';

export default {
  //SECRETJWT=handycuttyspicy
  created : function() {
    if(localStorage.cmsaccesstoken) {
      this.$store.commit(`SetIsLogin`, true)
      this.$store.commit(`setInfo`, this.$jwt.decode(localStorage.cmsaccesstoken,`handycuttyspicy`))
    }
  },
  components: {
    navbar,
    Footer,
    LightBox
  }
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  margin-top: 120px;
  text-align: center;
  color: #2c3e50;
}

.bg {
  /* The image used */
  background-image: url("../src/assets/bg.jpg");

  /* Full height */
  min-height: 80vh;

  /* Center and scale the image nicely */
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
}

input {
  color : white
}
</style>
