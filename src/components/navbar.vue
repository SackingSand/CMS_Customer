<template>
  <div class="home">
    <mdb-navbar 
      style="z-index: 10" 
      expand="large" 
      dark 
      color="blue-gradient"
      id="main-navbar"
      position="top"
      scrolling
      :scrollingOffset="20"
    >
      <mdb-navbar-toggler>
        <mdb-navbar-nav>
          <mdb-nav-item to="/"><mdb-icon regular icon="paper-plane" class="mx-2"/>Home</mdb-nav-item>
          <mdb-nav-item to="/categories"><i class="fa fa-indent mr-2" aria-hidden="true"></i>Categories</mdb-nav-item>
        </mdb-navbar-nav>
        <mdb-navbar-nav right>
          <mdb-nav-item v-if="isLoggedIn"><mdb-icon regular icon="smile" class="mx-2"/>Welcome, {{$store.state.userInfo.name}}</mdb-nav-item>
          <mdb-nav-item v-if="$store.state.userInfo.role === 'admin'" to="/admin"><i class="fa fa-user-shield mr-2" aria-hidden="true"></i>Admin Homepage</mdb-nav-item>
          <mdb-nav-item v-if="$store.state.userInfo.role === 'merchant'" to="/merchant"><i class="fa fa-store-alt mr-2" aria-hidden="true"></i>Your Store Homepage</mdb-nav-item>
          <mdb-nav-item v-if="$store.state.userInfo.role !== 'merchant' && $store.state.userInfo.role !== 'admin'" @click="cart=!cart">
            <i class="fas fa-shopping-cart mr-2" aria-hidden="true"></i> Cart
            <mdb-badge class="animated" v-bind:class="animatedPill" pill color="default-color" v-if="$store.state.shoppingCart.length > 0" style="margin-left: -55px;margin-top: -5px; position: absolute">{{$store.state.shoppingCart.length}}</mdb-badge>
            </mdb-nav-item>
          <mdb-nav-item v-if="!isLoggedIn" @click="$store.commit(`showLoginModal`);loginHasError=false;$store.commit(`hideInfoLogin`)"><i class="fa fa-sign-out-alt mr-2" aria-hidden="true"></i>Login</mdb-nav-item>
          <mdb-nav-item v-if="!isLoggedIn" to="/register"><i class="fa fa-signature mr-2" aria-hidden="true"></i>Register</mdb-nav-item>
          <mdb-nav-item v-if="isLoggedIn" to="/logout"><i class="fa fa-power-off mr-2" aria-hidden="true"></i>Logout</mdb-nav-item>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
    
    <!-- //// -->

    <mdb-modal :show="showModal" @close="$store.commit(`hideLoginModal`);$store.commit(`hideInfoLogin`);$store.commit(`setLoginEmail`,'');userPassword='';" cascade class="text-left">
      <form @submit.prevent="login">
        <mdb-modal-header class="primary-color white-text">
            <h4 class="title"><mdb-icon icon="pencil-alt" /> Login</h4>
        </mdb-modal-header>
        <mdb-modal-body class="grey-text">
            <mdb-alert v-if="loginHasError" color="danger" class="animated" v-bind:class="animatedClass">{{ loginError }}</mdb-alert>
            <mdb-alert v-if="loginHasInfo" color="info" class="animated" v-bind:class="animatedClass">{{ loginInfo }}</mdb-alert>
            <mdb-input v-model="userEmail" size="sm" label="Your email" icon="user" group type="email" validate error="wrong" success="right"/>
            <mdb-input v-model="userPassword" size="sm" label="Password" icon="lock" group :type="passwordType" validate error="wrong" success="right">
              <mdb-btn title="show / hide password" @click="toggleLoginModal">
              <mdb-icon :icon="loginModalIcon" />
              </mdb-btn>
            </mdb-input>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn type="submit" class="col-sm-12">Continue</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- //// -->
    <mdb-modal :show="cart" @close="cart = false" size="lg" removeBackdrop side position="top-right mt-5 vw-100" class="text-center" style="z-index : 10">
      <mdb-modal-header>
        <h4 class="modal-title" id="myModalLabel">Your cart</h4>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-tbl hover>
          <mdb-tbl-head>
            <tr>
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
              <td style="overflow: hidden;">{{ item.name }}</td>
              <td>{{ numToCurrency(item.price) }}</td>
              <td>
                <input @input="$store.commit('alterCartItemAmount',[itemIndex, $event.target.value])" class="text-dark p-0 customNumberInput" size="2" type="number" :value="item.amount"/>
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
              <th scope="row"> Total </th>
              <td></td>
              <td>{{ cartTotalItems }} item(s)</td>
              <td>{{ numToCurrency(cartTotalPrice) }}</td>
              <td></td>
            </tr>

          </mdb-tbl-body>
        </mdb-tbl>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn outline="primary" @click="cart=false">Close</mdb-btn>
        <mdb-btn v-if="cartTotalItems > 0" color="primary" @click="cart=false;$router.push(`/checkout`)">Next >></mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!-- //// -->
  </div>
</template>

<script>
import axios from 'axios'
import { baseUrl } from '../components/var'

import {
  mdbAlert,
  mdbIcon,
  mdbNavbar,
  mdbNavItem,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbInput, 
  mdbBtn, 
  mdbModal, 
  mdbModalHeader, 
  mdbModalBody, 
  mdbModalFooter,
  mdbBadge,
  mdbTbl, 
  mdbTblHead, 
  mdbTblBody
} from "mdbvue";

export default {
  name: 'navbar',
  components: {
    mdbAlert,
    mdbIcon,
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbInput,
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter,
    mdbBadge,
    mdbTbl, 
    mdbTblHead, 
    mdbTblBody
  },
  data() {
    return {
      passwordType : `password`,
      loginHasError : false,
      loginError : ``,
      userPassword : ``,
      animatedClass: ``,
      loginModalIcon : `eye-slash`,
      cart : false,
      animatedPill : 'flip'
    }
  },
  computed: {
    userEmail : {
      get: function () {
        return this.$store.state.loginEmail
      },
      set: function (newValue) {
        this.$store.commit('setLoginEmail', newValue)
      }
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn
    },
    showModal(){
      return this.$store.state.loginModal
    },
    loginHasInfo () {
      return this.$store.state.loginHasInfo
    },
    loginInfo () {
      return this.$store.state.loginInfo
    },
    cartItems () {
      this.toggleCartBadge()
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
  methods : {
    toggleCartBadge() {
      this.animatedPill = 'headShake'
      this.animatedPill = 'flip'
    },
    showLogin(){
      this.showModal = true, 
      this.userPassword = ``, 
      this.loginHasError = false
    },
    numToCurrency(num) {
      return 'Rp. ' + num.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    },
    login() {
      this.animatedClass = ``
      this.loginHasError = false
      this.$store.commit(`hideInfoLogin`)
      axios({
        method : 'post',
        url : `${baseUrl}/users/login`,
        data : {
          email : this.userEmail,
          password : this.userPassword
        },
      })  .then( result => {
            this.$store.commit(`setLoginEmail`, '')
            this.userPassword = ``;
            this.loginHasError = false,
            this.$store.commit(`hideLoginModal`)
            localStorage.setItem(`cmsaccesstoken`, result.data.cmsaccesstoken)
            this.$store.commit(`SetIsLogin`, true)
            this.$store.commit(`setInfo`, this.$jwt.decode(localStorage.cmsaccesstoken,`handycuttyspicy`))
            if(this.$store.state.userInfo.role === 'admin') {
              this.$router.push(`/logout`)
            } else if(this.$store.state.userInfo.role === 'merchant') {
              this.$router.push(`/merchant`)
            } else {
              // this.$router.push(`/`)
            }
      })  .catch( err => {
            this.loginHasError = true,
            this.animatedClass = `pulse`
            this.loginError = err.response.data.error
      })
    },
    toggleLoginModal() {
      this.passwordType == 'text' ? this.passwordType = 'password' : this.passwordType = 'text'
      this.loginModalIcon == 'eye-slash' ? this.loginModalIcon = 'eye' : this.loginModalIcon = 'eye-slash'
    }
  }
}
</script>
<style scoped>
  .customNumberInput {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    margin: 0;
  }
</style>