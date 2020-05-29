<template>
  <div class="home">
  <mdb-container class="mt-5">
    <mdb-row class="mt-5 align-items-center justify-content-start rounded p-3" style="overflow: hidden;">
      <section>
        <mdb-carousel :interval="4000" slide :items="intervalCarousel"></mdb-carousel>
      </section>
    </mdb-row>
    <mdb-row class="mt-4 align-items-center justify-content-start">
      <section class="col-sm-12 p-0 d-flex flex-wrap">
        
      <mdb-col md="4" v-for="(product) in products" :key="product.id" class="p-3 text-left">
        <mdb-card class="cloudy-knoxville-gradient">
          <div v-if="filterProductPicturesByProductId(product.id).length > 0">
            <mdb-view hover>
              <a href="#/">
                <mdb-card-image 
                v-for="picture in filterProductPicturesByProductId(product.id).slice(0,1)" 
                :key="picture.id" 
                :src="picture.filename" 
                class="border-bottom" 
                style="height: 150px" 
                :alt="product.name"
                ></mdb-card-image>
                <mdb-mask 
                flex-center 
                waves 
                overlay="black-slight"
                >
                <div class="w-100 h-100" @click="$store.commit('setLightboxIndex', 0);$store.commit('setLightboxItems', buildLightboxArray(filterProductPicturesByProductId(product.id)))" ></div>
                </mdb-mask>
              </a>
            </mdb-view>
          </div>
          <div v-else>
            <mdb-view hover>
              <a href="#/">
                <mdb-card-image 
                src="https://www.hammerheadshop.com/wp-content/uploads/2017/08/Product-ImageCOMING-SOON-2.png" 
                class="border-bottom" 
                style="height: 150px" 
                :alt="product.name"
                ></mdb-card-image>
                <mdb-mask 
                flex-center 
                waves
                overlay="black-slight"
                >
                <div class="w-100 h-100" @click="$store.commit('setLightboxIndex', 0);$store.commit('setLightboxItems', ['https://www.hammerheadshop.com/wp-content/uploads/2017/08/Product-ImageCOMING-SOON-2.png'])" ></div>
                </mdb-mask>
              </a>
            </mdb-view>
          </div>
          <mdb-card-body>
            <mdb-card-title>{{ product.name }}</mdb-card-title>
            <mdb-card-text>{{product.Category.name}}</mdb-card-text>
            <mdb-card-text>{{numToCurrency(product.price)}}</mdb-card-text>
            <mdb-card-text>Stock : {{ product.stock }}</mdb-card-text>
            <mdb-card-text>{{product.User.name}}</mdb-card-text>
            <mdb-btn 
              v-if="product.stock > 0" 
              size="sm" 
              color="primary" 
              @click="$store.commit('addItemToCart',
                {
                  id : product.id,
                  filename : filterProductPicturesByProductId(product.id)[0].filename,
                  name : product.name, 
                  price : product.price, 
                  amount : 1,
                  stock : product.stock
                })
              ">
              <i class="fas fa-cart-plus" aria-hidden="true"></i> Add to cart
            </mdb-btn>
            <mdb-btn v-else disabled size="sm" color="primary"><i class="fas fa-cart-plus" aria-hidden="true"></i> Out of Stock</mdb-btn> 
            
          </mdb-card-body>
        </mdb-card>
      </mdb-col>

      </section>
    </mdb-row>
  </mdb-container>
  </div>
</template>

<script>
import{ 
  mdbCard,
  mdbCardImage,
  mdbCardTitle,
  mdbCardText,
  mdbCardBody,
  mdbMask,
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbView,
  mdbBtn,
  mdbCarousel,

} from 'mdbvue'
export default {
  name: 'index',
  components : {
    mdbCard,
    mdbCardImage,
    mdbCardTitle,
    mdbCardText,
    mdbCardBody,
    mdbMask,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbView,
    mdbBtn,
    mdbCarousel,
  },
  data() {
    return {
      masonryMaxItem : 10,
      intervalCarousel: [
        {
          img: true,
          src: "https://suneducationgroup.com/wp-content/uploads/2019/11/WEB-BANNER-YEAR-END-PROMO-SUN-ENGLISH-2019-Copy-1.jpg",
          mask: "black-light",
          alt: "First Slide"
        },
        {
          img: true,
          src: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/hair-salon-summer-promo-banner-design-template-528ff4abd3f1db406d83eab50d1f7994_screen.jpg?ts=1561539295",
          mask: "black-slight"
        },
        {
          img: true,
          src: "https://blog.traveloka.com/en/wp-content/uploads/sites/3/2018/02/Promo-Banner-EN-1.jpg",
          mask: "black-slight"
        }
      ],
    }
  },
  methods : {
    buildLightboxArray(obj) {
      let newArray = []
      for (let i = 0; i < obj.length;i++){
        newArray.push(obj[i].filename)
      }
      return newArray
    },
    filterProductPicturesByProductId (id) {
      let result = this.productPictures.filter( function(el) {
        return el.ProductId == id
      })
      if(result.length < 1) {
        return [{filename : 'https://www.hammerheadshop.com/wp-content/uploads/2017/08/Product-ImageCOMING-SOON-2.png'}]
      }
      return result
    },
    numToCurrency(num) {
      return 'Rp. ' + num.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    }
  },
  computed : {
    products () {
      return this.$store.state.products
    },
    categories () {
      return this.$store.state.categories
    },
    productPictures () {
      return this.$store.state.allpictures
    }
  },
  created : function () {
    this.$store.dispatch('loadCategories')
    this.$store.dispatch('loadIndexProducts')
    this.$store.dispatch('loadAllPictures')
  }
}
</script>
