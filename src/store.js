import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { baseUrl } from './components/var'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginEmail : '',
    isLoggedIn : false,
    loginModal : false,
    loginHasInfo : false,
    loginInfo : ``,
    userInfo : {},
    products : [],
    categories : [],
    pictures : [],
    allpictures : [],
    lightboxIndex : null,
    lightboxItems : [],// [array of picture url's]
    shoppingCart : [] // {id, filename, name, price, amount}
  },
  mutations: {
    SetIsLogin(state, data){
      state.isLoggedIn = data
    },
    setLoginEmail(state, data){
      state.loginEmail = data
    },
    showLoginModal(state){
      state.loginModal = true
    },
    hideLoginModal(state){
      state.loginModal = false
    },
    showInfoLogin(state){
      state.loginHasInfo = true;
    },
    hideInfoLogin(state){
      state.loginHasInfo = false;
    },
    setLoginInfo(state, data) {
      state.loginInfo = data
    },
    setInfo(state, data) {
      state.userInfo = data
    },
    storeProducts(state, data) {
      state.products = data
    },
    storeCategories(state, data) {
      state.categories = data
    },
    storeAllPictures(state, data) {
      state.allpictures = data
    },
    storeProductPictures(state, data) {
      state.pictures = data
    },
    clearLightboxIndex(state) {
      state.lightboxIndex = null
    },
    setLightboxIndex(state, data) {
      state.lightboxIndex = data
    },
    setLightboxItems(state, data) {
      state.lightboxItems = data
    },
    addItemToCart(state, data) {
      let found = false
      let itemIndex = 0
      for ( let i = 0; i < state.shoppingCart.length; i++) {
        if(state.shoppingCart[i].id === data.id) {
          found = true
          itemIndex = i
        }
      }
      if(found) {
        if(state.shoppingCart[itemIndex].amount < state.shoppingCart[itemIndex].stock) {
          state.shoppingCart[itemIndex].amount ++
        }
      } else {
        state.shoppingCart.push(data)
      }
    },
    alterCartItemAmount (state, data) { // [index, amount]
      if(data[1] === "0") {
        state.shoppingCart.splice(data[0],1)
      } else {
        if(data[1] <= state.shoppingCart[data[0]].stock) {
          state.shoppingCart[data[0]].amount = data[1]
        }
      }
    },
    emptyCart(state) {
      state.shoppingCart = []
    }
  },
  actions: {
    clearUserInfo({ commit }) {
      return new Promise ((resolve) => {
        resolve(commit('SetIsLogin',false))
      })  .then (() => {
        return commit('setInfo', {})
      })
    },
    loadProducts({commit}) {
      axios.get(`${baseUrl}/products`)
      .then ( ({data}) => {
        commit('storeProducts', data.result)
      })
    },
    loadIndexProducts({commit}) {
      axios.get(`${baseUrl}/products/limit/25`)
      .then ( ({data}) => {
        commit('storeProducts', data.result)
      }).catch( err => {
        console.log(err.response)
      })
    },
    loadCategories({commit}) {
      axios.get(`${baseUrl}/categories`)
      .then ( ({data}) => {
        return commit('storeCategories', data.Category)
      })
    },
    loadProductPictures({commit}) {
      axios.get(`${baseUrl}/pictures/merchant`, {
        headers : {
            cmsaccesstoken : localStorage.cmsaccesstoken
        }
      })
      .then ( ({data}) => {
        commit('storeProductPictures', data.result)
      }).catch( err => {
        console.log(err)
      })
    },
    loadAllPictures({commit}) {
      axios.get(`${baseUrl}/pictures/`)
      .then ( ({data}) => {
        commit('storeAllPictures', data.result)
      }).catch( err => {
        console.log(err)
      })
    }
  }
})
