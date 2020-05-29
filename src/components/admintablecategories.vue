<template>
<section class="col-md-12">
  <h3>All Categories</h3>
  <br />
  <mdb-btn @click="showAddModal = true; addHasError = false" color="primary" class="m-0"><i class="fas fa-book mr-2" aria-hidden="true"></i>Add New</mdb-btn>
  <br />
  <mdb-tbl btn responsive striped class="my-5 rounded-top border border-light border-bottom-0 ">
    <mdb-tbl-head class="tempting-azure-gradient">
      <tr>
        <th>No</th>
        <th>Category ID</th>
        <th>Category Name</th>
        <th class="col-md-4">Action</th>
      </tr>
    </mdb-tbl-head>
    <mdb-tbl-body>

      <tr v-for="(category, index) in categories" :key="category.id" scope="row" class="">
        <td>{{ index+1 }}</td>
        <td>{{ category.id }}</td>
        <td>{{ category.name }}</td>
        <td>
          <mdb-btn @click="openEdit(category.id, category.name, index)" color="info" class=" btn-sm"><i class="fas fa-pencil-alt mr-2" aria-hidden="true"></i>Edit</mdb-btn> 
          <mdb-btn @click="openDelete(category.id, category.name, index)" color="danger" class=" btn-sm"><i class="fas fa-trash mr-2" aria-hidden="true"></i> Delete</mdb-btn>
        </td>
      </tr>
      
      <tr v-if="categories.length === 0" scope="row">
        <td colspan="4">
          No item here
        </td>
      </tr>
    
    </mdb-tbl-body>
  </mdb-tbl>
  <!-- // --- // -->
    <mdb-modal :show="showAddModal" @close="showAddModal = false" cascade class="text-left">
      <form @submit.prevent="addCategory">
        <mdb-modal-header class="primary-color white-text">
            <h4 class="title"><mdb-icon icon="pencil-alt" /> Add Category </h4>
        </mdb-modal-header>
        <mdb-modal-body class="grey-text">
            <mdb-alert v-if="addHasError" color="danger" class="animated" v-bind:class="animatedClass">{{ addError }}</mdb-alert>
            <mdb-input v-model="addName" size="sm" label="Category Name" icon="folder" group type="text" validate error="wrong" success="right"/>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn type="submit" class="col-sm-6 d-flex align-center mx-auto">Add</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- // --- // -->
    <mdb-modal :show="showEditModal" @close="showEditModal = false" cascade class="text-left">
      <form @submit.prevent="editCategory">
        <mdb-modal-header class="primary-color white-text">
            <h4 class="title"><mdb-icon icon="pencil-alt" /> Edit item </h4>
        </mdb-modal-header>
        <mdb-modal-body class="grey-text">
            <mdb-alert v-if="editHasError" color="danger" class="animated" v-bind:class="animatedClass">{{ editError }}</mdb-alert>
            <mdb-alert v-if="editHasInfo" color="info" class="animated" v-bind:class="animatedClass">{{ editInfo }}</mdb-alert>
            <mdb-input v-model="editName" size="sm" label="Category Name" icon="folder" group type="text" validate error="wrong" success="right"/>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn type="submit" class="col-sm-6 d-flex align-center mx-auto">Save Edit</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- // --- // -->
    <mdb-modal :show="confirmDelete" @close="confirmDelete = false" size="sm" class="text-center" danger>
      <mdb-modal-header class="young-passion-gradient" center :close="false">
        <p class="heading">Are you sure?</p>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-icon icon="times" class="animated bounce mr-1" /> Deleting '{{ deleteName }}' from category
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn class="btn-sm" color="danger" @click="deleteCategory">Yes</mdb-btn>
        <mdb-btn class="btn-md" color="secondary" @click="confirmDelete=false">No</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!-- // -- // -->
</section>
</template>

<script>
import { 
    mdbAlert,
    mdbTbl, 
    mdbTblHead, 
    mdbTblBody , 
    mdbModal, 
    mdbModalHeader, 
    mdbModalBody, 
    mdbModalFooter,
    mdbInput, 
    mdbBtn,
    mdbIcon
    } from 'mdbvue'
import { baseUrl } from '../components/var'
import Axios from 'axios'

export default {
  name: 'adminTableProduct',
  components : {
    mdbAlert,
    mdbTbl, 
    mdbTblHead, 
    mdbTblBody , 
    mdbModal, 
    mdbModalHeader, 
    mdbModalBody, 
    mdbModalFooter,
    mdbInput, 
    mdbBtn,
    mdbIcon
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
  created : function () {
    this.$store.dispatch('loadCategories')
  }

}
</script>

<style>

</style>