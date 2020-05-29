import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import Categories from './views/categories.vue'
import Register from './views/register.vue'
import Logout from './components/logout'
import Admin from './views/admin.vue'
import Checkout from './views/checkout.vue'
import Merchant from './views/merchant.vue'
import admintableproduct from './components/admintableproduct'
import admintablepicture from './components/admintablepicture'
import admintablecategories from './components/admintablecategories'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/admin',
      name: '',
      component: Admin,
      children : [
        { 
          path : '',
          name : 'admintablecategories',
          component : admintablecategories
        },
        { 
          path : 'products',
          name : 'admintableproduct',
          component : admintableproduct
        },
        { 
          path : 'productpictures',
          name : 'admintablepicture',
          component : admintablepicture
        }
      ]
    },
    {
      path: '/merchant',
      name: 'merchant',
      component: Merchant
    },
    { path : `/logout`, name : `Logout`, component : Logout}
    // { path : ``, name : ``, component : ``}
  ]
})
