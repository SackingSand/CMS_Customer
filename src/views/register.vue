<template>

  <mdb-container class="mb-5">
    <mdb-row class="align-items-center justify-content-start">
            
            <section class="demo-section ml-auto mr-auto animate">
              <h2>Registration</h2>                        
              <mdb-btn @click="toggleForm('customer')" color="primary" size="lg" group slot="append" id="button-addon2">Register as Customer</mdb-btn> &nbsp;
              <mdb-btn @click="toggleForm('merchant')" class="animate" color="primary" size="lg" group slot="append" id="button-addon2">Register as Merchant</mdb-btn>

            </section>
    </mdb-row>
    <hr />
        <section>
          <mdb-row class="align-items-center justify-content-start">
            <mdb-col v-if="activeTab == 'customer'" sm="12" md="8" lg="6" class="ml-auto mr-auto animate">
              <mdb-card>
                <mdb-card-body>
                  <form @submit.prevent="userRegister">
                    <p class="h4 text-center py-4">Sign up as Customer</p>
                    <div class="grey-text text-left ">
                      <mdb-alert v-if="userRegisterHasError" color="danger" class="animated" v-bind:class="animatedClass1">{{ userRegisterError }}</mdb-alert>
                      <mdb-input v-model="userName" label="Your name" icon="user" group type="text" validate error="wrong" success="right"/>
                      <mdb-input v-model="userEmail" label="Your email" icon="envelope" group type="email" validate error="wrong" success="right"/>
                      <mdb-input v-model="userPass" :type="typePass1" class="mt-0 mb-3" placeholder="Password" ariaDescribedBy="button-addon2">
                        <mdb-btn @click="revealUserPass" class="animate" :icon="typeIcon1" iconColor="white" color="primary" size="md" group slot="append" id="button-addon2"></mdb-btn>
                      </mdb-input>
                      <mdb-input v-model="userVerify" :type="typePass2" class="mt-0 mb-3" placeholder="Verify Password" ariaDescribedBy="button-addon2">
                        <mdb-btn @click="revealUserVerify" class="animate" :icon="typeIcon2" iconColor="white"  color="info" size="md" group slot="append" id="button-addon2"></mdb-btn>
                      </mdb-input>
                    </div>
                    <div class="text-center py-4 mt-3">
                      <mdb-btn color="cyan" icon="smile-wink" type="submit">Start Shopping</mdb-btn>
                    </div>
                  </form>
                </mdb-card-body>
              </mdb-card>
            </mdb-col>
            <mdb-col v-if="activeTab == 'merchant'" sm="12" md="8" lg="6" class="ml-auto mr-auto">
              <mdb-card>
                <mdb-card-body>
                  <form @submit.prevent="triggerMerchantDisclaimer">
                    <p class="h4 text-center py-4">Sign up as Merchant</p>
                    <div class="grey-text text-left ">
                      <mdb-alert v-if="merchantRegisterHasError" color="danger" class="animated" v-bind:class="animatedClass2">{{ merchantRegisterError }}</mdb-alert>
                      <mdb-input  v-model="merchantName" label="Your name" icon="user" group type="text" validate error="wrong" success="right"/>
                      <mdb-input  v-model="merchantEmail" label="Your email" icon="envelope" group type="email" validate error="wrong" success="right"/>
                      <mdb-input  v-model="merchantPass" :type="typePass3" class="mt-0 mb-3" placeholder="Password" ariaDescribedBy="button-addon2">
                        <mdb-btn @click="revealMerchantPass" :icon="typeIcon3" iconColor="white" color="primary" size="md" group slot="append" id="button-addon2"></mdb-btn>
                      </mdb-input>
                      <mdb-input  v-model="merchantVerify" :type="typePass4" class="mt-0 mb-3" placeholder="Verify Password" ariaDescribedBy="button-addon2">
                        <mdb-btn @click="revealMerchantVerify" :icon="typeIcon4" iconColor="white"  color="info" size="md" group slot="append" id="button-addon2"></mdb-btn>
                      </mdb-input>
                    </div>
                    <div class="text-center py-4 mt-3">
                      <mdb-btn icon="handshake" color="cyan" type="submit">Join Us</mdb-btn>
                    </div>
                  </form>
                </mdb-card-body>
              </mdb-card>
            </mdb-col>
          </mdb-row>
        </section>
        <!-- //// -->
        <mdb-modal :show="merchantDisclaimerModal" @close="merchantDisclaimerModal = false" scrollable>
        <mdb-modal-header>
            <mdb-modal-title>Merchant Disclaimer</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="secondary" @click.native="merchantDisclaimerModal = false">Disagree</mdb-btn>
            <mdb-btn color="primary" @click="merchantDisclaimerModal = false; merchantDisclaimerisShown = true; merchantRegister()">Agree</mdb-btn>
        </mdb-modal-footer>
        </mdb-modal>
        <!-- //// -->
  </mdb-container>

</template>

<script>
import axios from 'axios'
import {
    mdbAlert,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbInput,
    mdbBtn,
    mdbCard,
    mdbCardBody, 
    mdbModal, 
    mdbModalTitle,
    mdbModalHeader, 
    mdbModalBody, 
    mdbModalFooter
 } from 'mdbvue';
import { baseUrl } from '../components/var'

// @ is an alias to /src

export default {
  name: 'register',
  components: {
    mdbAlert,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbInput,
    mdbBtn,
    mdbCard,
    mdbCardBody, 
    mdbModal, 
    mdbModalTitle,
    mdbModalHeader, 
    mdbModalBody, 
    mdbModalFooter
  },
  data() {
    return {
      activeTab : `customer`,
      userRegisterHasError : false,
      userRegisterError : ``,
      merchantRegisterHasError : false,
      merchantRegisterError : ``,
      userName : ``,
      userEmail : ``,
      userPass : ``,
      userVerify : ``,
      merchantName : ``,
      merchantEmail : ``,
      merchantPass : ``,
      merchantVerify : ``,
      typePass1 : `password`,
      typeIcon1 : `eye-slash`,
      typePass2 : `password`,
      typeIcon2 : `eye-slash`,
      typePass3 : `password`,
      typeIcon3 : `eye-slash`,
      typePass4 : `password`,
      typeIcon4 : `eye-slash`,
      animatedClass1: ``,
      animatedClass2: ``,
      merchantDisclaimerModal : false,
      merchantDisclaimerisShown : false,
    }
  },
  methods : {
    revealUserPass() {
      this.typePass1 == 'text' ? this.typePass1 = 'password' : this.typePass1 = 'text';
      this.typeIcon1 == 'eye' ? this.typeIcon1 = 'eye-slash' : this.typeIcon1 = 'eye';
    },
    revealUserVerify() {
      this.typePass2 == 'text' ? this.typePass2 = 'password' : this.typePass2 = 'text'
      this.typeIcon2 == 'eye' ? this.typeIcon2 = 'eye-slash' : this.typeIcon2 = 'eye';
    },
    revealMerchantPass() {
      this.typePass3 == 'text' ? this.typePass3 = 'password' : this.typePass3 = 'text'
      this.typeIcon3 == 'eye' ? this.typeIcon3 = 'eye-slash' : this.typeIcon3 = 'eye';
    },
    revealMerchantVerify() {
      this.typePass4 == 'text' ? this.typePass4 = 'password' : this.typePass4 = 'text'
      this.typeIcon4 == 'eye' ? this.typeIcon4 = 'eye-slash' : this.typeIcon4 = 'eye';
    },
    toggleForm(str) {
      this.userRegisterHasError = false
      this.merchantRegisterHasError = false
      if(str == `customer`) {
        this.activeTab = `customer`;
      } else {
        this.activeTab = `merchant`;
      }
    },
    triggerMerchantDisclaimer() {
      if(!this.merchantDisclaimerisShown) {
        this.merchantDisclaimerModal = true
      } else {
        this.merchantRegister()
      }
    },
    clearForm (){
      this.userName = ``;
      this.userEmail = ``;
      this.userPass = ``;
      this.userVerify = ``;
      this.merchantName = ``;
      this.merchantEmail = ``;
      this.merchantPass = ``;
      this.merchantVerify = ``;
    },
    merchantRegister() {
      this.animatedClass2 = ``
      this.merchantRegisterHasError = false;
      this.merchantRegisterError = ``;
      if(this.merchantPass !== this.merchantVerify) {
            this.animatedClass2 = `pulse`
            this.merchantRegisterHasError = true;
            this.merchantRegisterError = `Check your password`
      } else {
        axios.post(`${baseUrl}/users/register`, 
          {
            name : this.merchantName,
            email : this.merchantEmail,
            password : this.merchantPass,
            role : `merchant`
          })  .then ( () => {
            this.$store.commit(`showLoginModal`)
            this.$store.commit(`showInfoLogin`)
            this.$store.commit(`setLoginInfo`,`Registrasi berhasil menggunakan ${this.merchantEmail}, silahkan login`)
            this.$store.commit(`setLoginEmail`, this.merchantEmail)
            this.clearForm()
          })  .catch( err => {
            this.merchantRegisterHasError = true;
            this.animatedClass2 = `pulse`
            this.merchantRegisterError = err.response.data.error
            if(this.merchantRegisterError == 'Email is used, use login instead') {
              setTimeout( () => {
                this.animatedClass2 = ``
                this.merchantRegisterHasError = false;
                this.merchantRegisterError = ``;
                this.$store.commit('setLoginEmail', this.merchantEmail)
                this.$store.commit('showLoginModal')
                this.clearForm();
              },4000)
            }
          })
        }
    },
    userRegister() {
      this.animatedClass1 = ``
      this.userRegisterHasError = false;
      this.userRegisterError = ``;
      if(this.userPass !== this.userVerify) {
            this.animatedClass1 = `pulse`
            this.userRegisterHasError = true;
            this.userRegisterError = `Check your password`
      } else {
        axios.post(`${baseUrl}/users/register`, 
          {
            name : this.userName,
            email : this.userEmail,
            password : this.userPass,
          })  .then ( () => {
            this.$store.commit(`showLoginModal`)
            this.$store.commit(`showInfoLogin`)
            this.$store.commit(`setLoginInfo`,`Registrasi berhasil menggunakan ${this.userEmail}, silahkan login`)
            this.$store.commit(`setLoginEmail`, this.userEmail)
            this.clearForm()
          })  .catch( err => {
            console.log(err)
            this.userRegisterHasError = true;
            this.animatedClass1 = `pulse`
            this.userRegisterError = err.response.data.error
            if(this.userRegisterError == 'Email is used, use login instead') {
              setTimeout( () => {
                this.animatedClass2 = ``
                this.userRegisterHasError = false;
                this.userRegisterError = ``;
                this.$store.commit('setLoginEmail', this.userEmail)
                this.$store.commit('showLoginModal')
                this.clearForm();
              },4000)
            }
          })
        }
    }
  },
  created : function () {
    if(this.$store.state.isLoggedIn==true) {
      this.$router.push(`/`)
    }
  }
}
</script>
