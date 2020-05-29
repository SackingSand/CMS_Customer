<template>
  <mdb-container class="mt-5">
    <mdb-row class="mt-5 align-items-center justify-content-left bg-white rounded">
        <mdb-tbl class="col-md-12">
          <mdb-tbl-head>
            <tr>
              <th></th>
              <th>Product name</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Total</th>
              <th>
                <a v-if="cartItems.length > 0" @click="$store.commit('emptyCart')">
                  <mdb-icon color="danger" title="Empty cart" icon="trash" />
                </a>
              </th>
            </tr>
          </mdb-tbl-head>
          <mdb-tbl-body>
            
            <tr v-for="(item, itemIndex) in cartItems" :key="item.id">
              <td><img :src="item.filename" class="img-fluid rounded-circle" style="width: 80px; height: 80px; cursor: pointer;"></td>
              <td style="overflow: hidden;">{{ item.name }}</td>
              <td>{{ numToCurrency(item.price) }}</td>
              <td>
                <input @input="$store.commit('alterCartItemAmount',[itemIndex, $event.target.value])" class="text-dark p-0 customNumberInput" size="2" type="number" :value="item.amount"/>
                ( stock : {{ item.stock}}) <br><span v-if="item.amount >= item.stock" class="text-danger"> Stock limit </span>
              </td>
              <td>{{ numToCurrency(item.price * item.amount) }}</td>
              <td>
                <a @click="$store.commit('alterCartItemAmount',[itemIndex, '0'])">
                  <mdb-icon icon="times" />
                </a>
              </td>
            </tr>
            
            <tr v-if="cartItems.length < 1">
              <td colspan="5">  <i class="fa fa-heart-broken mr-2" aria-hidden="true"></i> It's a bit dusty here, add something</td>
            </tr>

            <tr class="total">
              <td></td>
              <th scope="row"> Total </th>
              <td></td>
              <td>{{ cartTotalItems }} item(s)</td>
              <td>{{ numToCurrency(cartTotalPrice) }}</td>
              <td></td>
            </tr>
            
            <tr>
              <td colspan="5">
                <mdb-alert v-if="checkoutHasError" color="danger" class="animated" v-bind:class="animatedClass">{{ checkoutError }}</mdb-alert>
                <mdb-btn v-if="cartTotalItems > 0" color="primary" @click="tryCheckout">Checkout</mdb-btn>
              </td>
            </tr>
          </mdb-tbl-body>
        </mdb-tbl>
    </mdb-row>
  </mdb-container>
</template>

<script>
import{ 
  mdbAlert,
  mdbIcon,
  mdbContainer,
  mdbRow,
  mdbTbl, 
  mdbTblHead, 
  mdbTblBody,
  mdbBtn

} from 'mdbvue'
import axios from 'axios'
import { baseUrl } from '../components/var'

export default {
  name: 'categories',
  components : {
    mdbAlert,
    mdbIcon,
    mdbContainer,
    mdbRow,
    mdbTbl, 
    mdbTblHead, 
    mdbTblBody,
    mdbBtn
  },
  data() {
    return {
      items : [],
      checkoutHasError : false,
      checkoutError : ''
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
    },
    doCheckout(){
      if(!localStorage.cmsaccesstoken) {
        this.$store.commit(`showLoginModal`)
        this.$store.commit(`showInfoLogin`)
        this.$store.commit(`setLoginInfo`, 'You need to login before you can checkout')
      } else {
        for(let i = 0; i < this.cartItems.length; i++) {
          axios.post(`${baseUrl}/products/checkout`, {
            name : this.cartItems[i].name,
            id : this.cartItems[i].id,
            amount : this.cartItems[i].amount
          }, {
            headers : {
              cmsaccesstoken : localStorage.cmsaccesstoken
            }
          })
          .then( ()=> {
            this.$store.dispatch('loadProducts')
            this.$store.commit('emptyCart')
            this.$router.push('/')
          })
          .catch( err => {
            console.log(err.response)
          })
        }
      }
    },
    tryCheckout() {
      let checked = true
      for(let i = 0; i < this.cartItems.length; i++) {
        axios.get(`${baseUrl}/products/single/${this.cartItems[i].id}`)
        .then( ({data}) => {
          if(this.cartItems.amount > data.result.stock){ 
            checked = false
          }
        })
        .catch( err => {
          console.log(err.response)
        })
      }
      if(checked){
        this.doCheckout()
      } else {
        this.checkoutHasError = true
        this.checkoutError = 'one of your cart item(s) exceed stock avalability'
      }
    }
  },
  computed : {
    cartItems () {
      return this.$store.state.shoppingCart
    },
    cartTotalItems () {
      let total = 0
      for ( let i = 0; i < this.$store.state.shoppingCart.length; i++)  {
        total = total + Number(this.$store.state.shoppingCart[i].amount)
      }
      return total
    },
    cartTotalPrice () {
      let total = 0
      for ( let i = 0; i < this.$store.state.shoppingCart.length; i++)  {
        total += (this.$store.state.shoppingCart[i].amount * this.$store.state.shoppingCart[i].price)
      }
      return total
    }
  },
  created : function () {
    this.$store.dispatch('loadCategories')
    this.$store.dispatch('loadProducts')
    this.$store.dispatch('loadAllPictures')
  },
  mounted : function() {
    this.filterByCategoryId()
  }
}
</script>
