<template>
  <div class="home">
  <mdb-container class="mt-5">
    <mdb-row class="mt-5 align-items-center justify-content-left pl-3">
      <h4 class="demo-title"><strong>Browse categories</strong></h4>
    </mdb-row>
    <hr />
    <mdb-row class="mt-4 align-items-center justify-content-start">
      <section class="col-sm-12 p-0 d-flex flex-wrap">

      <mdb-col lg="3" md="12" class="text-left p-0 px-1 mb-3">
        <section class="demo-section">
          <section>
            <mdb-row>
              <mdb-col md="12" class="">
                <mdb-list-group>
                  <mdb-list-group-item disabled active>Categories :</mdb-list-group-item>
                  <a v-for="item in categories" :key="item.id" @click="filterByCategoryId(item.id)">
                    <mdb-list-group-item action> {{ item.name }}</mdb-list-group-item>
                  </a>
                </mdb-list-group>
              </mdb-col>
            </mdb-row>
          </section>
        </section>
      </mdb-col>
        
      <mdb-col lg="9" md="12" class="p-0 text-left d-flex flex-wrap justify-content-start">
        <div class="col-lg-4 col-md-12 d-flex flex-wrap px-2 pb-3" v-for="(product) in items" :key="product.id">
          <mdb-card class="cloudy-knoxville-gradient m-0 p-0 col-sm-12">
            <div v-if="filterProductPicturesByProductId(product.id).length > 0">
              <mdb-view hover>
                <a>
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
                <a>
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
        </div>
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
  mdbListGroup,
  mdbListGroupItem

} from 'mdbvue'
export default {
  name: 'categories',
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
    mdbListGroup,
    mdbListGroupItem
  },
  data() {
    return {
      items : []
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
    filterByCategoryId(id) {
      this.$store.dispatch('loadProducts')
      .finally(() => {
        if(!id){
          this.items = this.products
        } else {
          this.items = this.products.filter( function(el) {
            return el.CategoryId == id
          })
        }
      })
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
  },
  mounted : function() {
    this.filterByCategoryId()
  }
}
</script>
