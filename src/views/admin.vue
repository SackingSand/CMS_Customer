<template>
  <div class="home">
    <mdb-container class="mt-5" id="/#/admin#categoriesTable">
        <mdb-navbar color="info" class="lighten-4">
          <mdb-navbar-nav nav center>
            <!-- <mdb-nav-item href="#admin/#categoriesTable" class="bg-light btn btn-sm mr-4">Categories</mdb-nav-item>
            <mdb-nav-item href="#admin/#productsTable" class="bg-light btn btn-sm mr-4">Products</mdb-nav-item>
            <mdb-nav-item href="#admin/#picturesTable" class="bg-light btn btn-sm mr-4">Pictures</mdb-nav-item> -->
            <mdb-nav-item to="/admin/" class="bg-light btn btn-sm mr-4">Categories</mdb-nav-item>
            <mdb-nav-item to="/admin/products" class="bg-light btn btn-sm mr-4">Products</mdb-nav-item>
            <mdb-nav-item to="/admin/productpictures" class="bg-light btn btn-sm mr-4">Pictures</mdb-nav-item>
          </mdb-navbar-nav>
        </mdb-navbar>
    </mdb-container>
    <mdb-container class="mt-5" id="admin/#categoriesTable">
      <mdb-row class="mt-5 align-items-left justify-content-start">
        <router-view></router-view>
      </mdb-row>
      <mdb-row class="mt-4 ">
      </mdb-row>
    </mdb-container>
  </div>
</template>

<script>
import { 
  mdbContainer,
  mdbRow,
  mdbNavbar,
  mdbNavItem,
  mdbNavbarNav
  } from 'mdbvue'
import Axios from 'axios'
import { baseUrl } from '../components/var'

export default {
  name: 'admin',
  components : {
    mdbContainer,
    mdbRow,
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
  },
  data () {
    return {
      animatedClass : ``,
      showEditModal : false,
      editHasError : '',
      editError : '',
      editHasInfo : '',
      editInfo : '',
      editName : '',
      editId : 0,
      editIndex : 0,
      confirmDelete : false,
      deleteName : '',
      deleteId : 0,
      deleteIndex : 0,
      showAddModal : false,
      addHasError : '',
      addError : '',
      addName : ''
    }
  },
  methods : {
    openEdit(id, name, index) {
      this.showEditModal = true
      this.editId = id
      this.editIndex = index
      this.editName = name
    },
    editCategory () {
      this.animatedClass = ``
      this.editHasError = false
      Axios.put(`${baseUrl}/categories/edit`, {
        id : this.editId,
        name : this.editName
      } , {
        headers : {
          cmsaccesstoken : localStorage.cmsaccesstoken
        } 
      }).then( () => {
          this.showEditModal = false
          this.$store.dispatch('loadCategories')
          this.editName = ''
      }).catch ( err => {
          this.editHasError = true,
          this.animatedClass = `pulse`
          this.editError = err.response.data.error
          this.editName = ''
      })      
    },
    addCategory () {
      this.animatedClass = ``
      this.addHasError = false
      Axios.post(`${baseUrl}/categories/add`, {
        name : this.addName
      } , {
        headers : {
          cmsaccesstoken : localStorage.cmsaccesstoken
        } 
      }).then( () => {
          this.showAddModal = false
          this.$store.dispatch('loadCategories')
          this.addName = ''
      }).catch ( err => {
          this.addHasError = true,
          this.animatedClass = `pulse`
          this.addError = err.response.data.error
          this.addName = ''
      })
    },
    openDelete(id, name, index) {
      this.confirmDelete = true
      this.deleteId = id
      this.deleteName = name
      this.deleteIndex = index
    },
    deleteCategory () {
      Axios.delete(`${baseUrl}/categories/delete`, 
      {
        data : { id : this.deleteId },
        headers : {
          cmsaccesstoken : localStorage.cmsaccesstoken
        }
      }).then( () => {
          this.confirmDelete = false
          this.$store.dispatch('loadCategories')
      }).catch ( err => {
          console.log(err.response)
      })
    }
  },
  computed : {
    categories () {
        return this.$store.state.categories
    }
  },
  created : function() {
    if(this.$store.state.userInfo.role!=='admin') {
      this.$router.push('/')
    }
    this.$store.dispatch('loadCategories')
  }
}
</script>
